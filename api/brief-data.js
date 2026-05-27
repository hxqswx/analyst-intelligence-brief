// Vercel Serverless Function — GET /api/brief-data
//
// Returns live news data from Redis cache, or triggers a live refresh if stale.
// Cache TTL: 1 hour. After 1 hour, this endpoint calls /api/refresh-data inline
// so data is always current on first visit after an hour (adds ~10s latency once/hr).
//
// Falls back to static data.js if Redis is not configured or Anthropic key is missing.

import { Redis } from '@upstash/redis'
import { news, synthesis, weekRange, publishedAt } from '../src/data.js'

const REDIS_DATA_KEY = 'brief:live_data'
const REDIS_TS_KEY   = 'brief:live_ts'
const MAX_AGE_MS     = 60 * 60 * 1000   // 1 hour

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !tok) return null
  try { return new Redis({ url, token: tok }) } catch { return null }
}

// Self-call to refresh — only runs once per hour (first request after TTL expires)
async function triggerRefresh(req) {
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000'
    const proto = host.includes('localhost') ? 'http' : 'https'
    await fetch(`${proto}://${host}/api/refresh-data`, { method: 'POST', signal: AbortSignal.timeout(25000) })
  } catch (e) {
    console.warn('[brief-data] inline refresh failed:', e.message)
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const redis = getRedis()
  if (redis) {
    try {
      const [data, ts] = await Promise.all([
        redis.get(REDIS_DATA_KEY),
        redis.get(REDIS_TS_KEY),
      ])
      const age = ts ? Date.now() - Number(ts) : Infinity

      // Fresh cache — return immediately
      if (data?.news?.length > 0 && age < MAX_AGE_MS) {
        return res.status(200).json({ ...data, source: 'live', cachedAt: Number(ts) })
      }

      // Stale or empty — trigger inline refresh then re-read
      if (process.env.ANTHROPIC_API_KEY) {
        console.log('[brief-data] cache stale, triggering inline refresh…')
        await triggerRefresh(req)
        const [fresh, freshTs] = await Promise.all([
          redis.get(REDIS_DATA_KEY),
          redis.get(REDIS_TS_KEY),
        ])
        if (fresh?.news?.length > 0) {
          return res.status(200).json({ ...fresh, source: 'live', cachedAt: freshTs ? Number(freshTs) : Date.now() })
        }
      }

      // Refresh didn't help — return stale cache if available
      if (data?.news?.length > 0) {
        return res.status(200).json({ ...data, source: 'stale', cachedAt: ts ? Number(ts) : null })
      }
    } catch (e) {
      console.warn('[brief-data] Redis error:', e.message)
    }
  }

  // Static fallback
  return res.status(200).json({ news, synthesis, weekRange, publishedAt, source: 'static', cachedAt: null })
}
