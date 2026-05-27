// Vercel Serverless Function — GET /api/brief-data
// Returns live news data from Redis cache, or falls back to static data.js
// Cache TTL: 1 hour (set by /api/refresh-data cron)

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
      if (data?.news?.length > 0) {
        const age = ts ? Date.now() - Number(ts) : Infinity
        return res.status(200).json({
          ...data,
          source:   age < MAX_AGE_MS ? 'live' : 'stale',
          cachedAt: ts ? Number(ts) : null,
        })
      }
    } catch (e) {
      console.warn('[brief-data] Redis read error:', e.message)
    }
  }

  // Static fallback
  return res.status(200).json({ news, synthesis, weekRange, publishedAt, source: 'static', cachedAt: null })
}
