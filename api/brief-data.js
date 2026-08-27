// Vercel Serverless Function — GET /api/brief-data
//
// Returns live news data from Redis cache, or triggers a live refresh if stale.
// Cache TTL: 1 hour. After 1 hour, this endpoint calls /api/refresh-data inline
// so data is always current on first visit after an hour (adds ~10s latency once/hr).
//
// Falls back to static data.js if Redis is not configured or Anthropic key is missing.

import { Redis } from '@upstash/redis'
import { news, synthesis, weekRange, publishedAt } from '../src/data.js'
import { refreshBriefData, recordRefreshFailure } from './refresh-data.js'

const REDIS_DATA_KEY   = 'brief:live_data'
const REDIS_TS_KEY     = 'brief:live_ts'
const REDIS_HEALTH_KEY = 'brief:health'
const MAX_AGE_MS       = 60 * 60 * 1000   // 1 hour

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !tok) return null
  try { return new Redis({ url, token: tok }) } catch { return null }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const redis = getRedis()
  if (redis) {
    try {
      const [data, ts, health] = await Promise.all([
        redis.get(REDIS_DATA_KEY),
        redis.get(REDIS_TS_KEY),
        redis.get(REDIS_HEALTH_KEY),
      ])
      const age = ts ? Date.now() - Number(ts) : Infinity

      // Fresh cache — return immediately
      if (data?.news?.length > 0 && age < MAX_AGE_MS) {
        return res.status(200).json({ ...data, source: 'live', cachedAt: Number(ts), health })
      }

      // Stale or empty — refresh in-process (no self-fetch, no timeout race)
      if (process.env.GROQ_API_KEY) {
        console.log('[brief-data] cache stale, running in-process refresh…')
        try {
          const { data: fresh } = await refreshBriefData()
          if (fresh?.news?.length > 0) {
            const now = Date.now()
            return res.status(200).json({ ...fresh, source: 'live', cachedAt: now, health: { ok: true, at: now, items: fresh.news.length } })
          }
        } catch (e) {
          console.warn('[brief-data] in-process refresh failed:', e.message)
          await recordRefreshFailure(e)
          // Surface the failure to the client alongside the stale data below
          if (data?.news?.length > 0) {
            return res.status(200).json({ ...data, source: 'stale', cachedAt: ts ? Number(ts) : null, health: { ok: false, at: Date.now(), error: String(e.message).slice(0, 300) } })
          }
        }
      }

      // Refresh didn't help — return stale cache if available
      if (data?.news?.length > 0) {
        return res.status(200).json({ ...data, source: 'stale', cachedAt: ts ? Number(ts) : null, health })
      }
    } catch (e) {
      console.warn('[brief-data] Redis error:', e.message)
    }
  }

  // Static fallback (Redis down / unconfigured, or no data ever stored)
  return res.status(200).json({ news, synthesis, weekRange, publishedAt, source: 'static', cachedAt: null, health: { ok: false, at: null, error: 'no_live_data' } })
}
