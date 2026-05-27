// Vercel Serverless Function — /api/recipients
// GET  → list recipients
// POST → add recipient  (requires valid admin Google credential)
// DELETE → remove recipient (requires valid admin Google credential)
//
// Required env vars:
//   UPSTASH_REDIS_REST_URL    — from upstash.com
//   UPSTASH_REDIS_REST_TOKEN  — from upstash.com
//   ADMIN_EMAIL               — admin's Gmail address

import { Redis } from '@upstash/redis'

const REDIS_KEY = 'brief:recipients'

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

// decode Google JWT payload without signature verification
function decodeGoogleJWT(credential) {
  try {
    const b64 = credential.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(Buffer.from(b64, 'base64').toString('utf8'))
  } catch { return null }
}

async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body
  return new Promise(resolve => {
    let raw = ''
    req.on('data', c => { raw += c })
    req.on('end', () => { try { resolve(JSON.parse(raw)) } catch { resolve({}) } })
    req.on('error', () => resolve({}))
  })
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const redis = getRedis()
  if (!redis) {
    return res.status(500).json({
      error: 'Upstash Redis not configured. Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to Vercel env vars.'
    })
  }

  // ── GET — public, no auth needed ─────────────────────────────────────────
  if (req.method === 'GET') {
    const recipients = await redis.get(REDIS_KEY) ?? []
    return res.status(200).json({ recipients })
  }

  // ── POST / DELETE — require admin credential ──────────────────────────────
  const body = await parseBody(req)
  const { credential, email } = body

  if (!credential) {
    return res.status(401).json({ error: 'Missing Google credential' })
  }

  const payload = decodeGoogleJWT(credential)
  if (!payload) {
    return res.status(401).json({ error: 'Invalid credential' })
  }

  // verify admin email
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  if (ADMIN_EMAIL && payload.email !== ADMIN_EMAIL) {
    return res.status(403).json({ error: `Unauthorized: ${payload.email} is not an admin` })
  }

  // check JWT expiry
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    return res.status(401).json({ error: 'Credential expired — please sign in again' })
  }

  let recipients = await redis.get(REDIS_KEY) ?? []

  if (req.method === 'POST') {
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' })
    }
    if (!recipients.includes(email)) {
      recipients = [...recipients, email]
      await redis.set(REDIS_KEY, recipients)
    }
    return res.status(200).json({ recipients })
  }

  if (req.method === 'DELETE') {
    if (!email) return res.status(400).json({ error: 'Missing email' })
    recipients = recipients.filter(r => r !== email)
    await redis.set(REDIS_KEY, recipients)
    return res.status(200).json({ recipients })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
