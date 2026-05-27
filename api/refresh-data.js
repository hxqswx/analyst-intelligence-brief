// Vercel Serverless Function — GET /api/refresh-data
// Called on-demand (lazy refresh from brief-data.js) + manually from admin panel.
// Fetches RSS headlines → Groq (free) → stores structured brief in Redis.
//
// Required env vars:
//   GROQ_API_KEY                 — free at console.groq.com
//   UPSTASH_REDIS_REST_URL       — from upstash.com
//   UPSTASH_REDIS_REST_TOKEN     — from upstash.com
// Optional:
//   GROQ_MODEL                   — defaults to llama-3.3-70b-versatile

import Groq  from 'groq-sdk'
import { Redis } from '@upstash/redis'

export const REDIS_DATA_KEY = 'brief:live_data'
export const REDIS_TS_KEY   = 'brief:live_ts'

// ── Free RSS sources ──────────────────────────────────────────────────────────
const RSS_FEEDS = [
  'https://feeds.bbci.co.uk/news/technology/rss.xml',
  'https://feeds.bbci.co.uk/news/business/rss.xml',
  'https://techcrunch.com/feed/',
  'https://www.scmp.com/rss/4/feed',
]

// ── XML helpers ───────────────────────────────────────────────────────────────
function unCDATA(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/&#\d+;/g, '').trim()
}
function xmlTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return unCDATA(m?.[1] ?? '')
}

async function fetchFeed(url) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalystBot/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) { console.warn(`[refresh-data] RSS ${url} → HTTP ${r.status}`); return [] }
    const xml = await r.text()
    const out = []
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const seg   = m[1]
      const title = xmlTag(seg, 'title')
      const desc  = xmlTag(seg, 'description').slice(0, 400)
      const link  = xmlTag(seg, 'link') ||
                    seg.match(/<link\s*\/?>[\s\n]*(https?:\/\/[^\s<]+)/)?.[1] || ''
      if (title) out.push({ title, desc, link })
      if (out.length >= 6) break
    }
    return out
  } catch (e) {
    console.warn(`[refresh-data] RSS ${url} failed: ${e.message}`)
    return []
  }
}

// ── Week range ────────────────────────────────────────────────────────────────
function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1))
  const sun = new Date(mon); sun.setDate(mon.getDate() + 6)
  const fmt = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(mon)} – ${fmt(sun)}, ${now.getFullYear()}`
}

// ── Redis ─────────────────────────────────────────────────────────────────────
function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const tok = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !tok) return null
  try { return new Redis({ url, token: tok }) } catch { return null }
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GROQ_API_KEY not set — get a free key at console.groq.com' })

  // 1. Fetch RSS feeds in parallel
  const feeds = await Promise.all(RSS_FEEDS.map(fetchFeed))
  const items = feeds.flat()
  console.log(`[refresh-data] fetched ${items.length} headlines from ${RSS_FEEDS.length} feeds`)

  if (items.length === 0) {
    return res.status(500).json({ error: 'All RSS feeds returned no items' })
  }

  const today     = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const weekRange = getWeekRange()

  const headlines = items.slice(0, 25)
    .map((it, i) => `[${i + 1}] ${it.title}\n${it.desc || '(no description)'}\nURL: ${it.link || 'n/a'}`)
    .join('\n\n')

  // 2. Generate structured brief via Groq
  const model  = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  const prompt = `Today is ${today}. You are an analyst news processor creating a bilingual intelligence brief.

Analyze these recent headlines:

${headlines}

Return a JSON object with this exact structure:
{
  "news": [
    {
      "id": 1,
      "rank": 1,
      "region": "overseas",
      "category": "AI",
      "impact": "High",
      "date": "${today}",
      "tags": ["tag1", "tag2"],
      "title": { "zh": "中文标题", "en": "English title" },
      "summary": { "zh": "两三句中文摘要。", "en": "2-3 sentence English summary." },
      "whyItMatters": { "zh": "中文分析。", "en": "English analysis." },
      "sources": [{ "name": "Source Name", "url": "https://..." }]
    }
  ],
  "synthesis": {
    "topic":       { "zh": "最热议题", "en": "Most debated topic" },
    "summary":     { "zh": "3-4句综合分析。", "en": "3-4 sentence synthesis." },
    "debateScore": 82,
    "sectors":     ["AI"]
  },
  "weekRange":   "${weekRange}",
  "publishedAt": "${new Date().toISOString()}"
}

Rules:
- Select exactly 10 items, ranked 1-10 by importance
- region "china" for Chinese companies (Baidu, Tencent, Alibaba, Huawei, ByteDance, Xiaomi, JD, PDD, Meituan) or China economy/policy; all others "overseas"
- category: "AI" for AI/ML/LLM; "Technology" for hardware/software/cybersecurity; "Finance" for markets/crypto/banks
- impact: "High" for major market-moving; "Medium" for notable; "Low" for minor
- tags: 2-3 short keywords
- sectors in synthesis: 1-2 items from ["AI", "Technology", "Finance"]
- sources: use the URL from the list above; name = publication name`

  try {
    const groq = new Groq({ apiKey })

    const completion = await groq.chat.completions.create({
      model,
      messages:        [{ role: 'user', content: prompt }],
      max_tokens:      4096,
      temperature:     0.3,
      response_format: { type: 'json_object' },   // Groq JSON mode — no parsing failures
    })

    const data = JSON.parse(completion.choices[0].message.content)

    if (!Array.isArray(data.news) || data.news.length === 0) {
      throw new Error('Model returned an empty news array')
    }

    console.log(`[refresh-data] generated ${data.news.length} items via ${model}`)

    // 3. Store in Redis
    const redis = getRedis()
    if (redis) {
      await redis.set(REDIS_DATA_KEY, data)
      await redis.set(REDIS_TS_KEY,   Date.now())
      console.log('[refresh-data] stored in Redis')
    } else {
      console.warn('[refresh-data] Redis not configured — data not persisted')
    }

    return res.status(200).json({ ok: true, items: data.news.length, weekRange: data.weekRange, model, stored: !!redis })
  } catch (e) {
    console.error('[refresh-data] error:', e.message)
    return res.status(500).json({ error: e.message })
  }
}
