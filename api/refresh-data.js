// Vercel Serverless Function — POST /api/refresh-data
// RSS → Groq → Redis.  Called by admin panel + lazy-refresh from brief-data.js.
//
// Required env vars:
//   GROQ_API_KEY            — free at console.groq.com
//   UPSTASH_REDIS_REST_URL  — from upstash.com
//   UPSTASH_REDIS_REST_TOKEN
// Optional:
//   GROQ_MODEL              — pins a model. Verified against the live model list;
//                             if it is gone, we auto-pick the best available one.

import Groq        from 'groq-sdk'
import { Redis }   from '@upstash/redis'

const GROQ_API_BASE = 'https://api.groq.com/openai/v1'

// Groq's free tier bills prompt + max_tokens against a tokens-per-minute cap, so a
// single call for 20 rich bilingual items does not fit. Generate in batches instead.
const TPM_BUDGET        = Number(process.env.GROQ_TPM) || 8000
const BATCH_SIZE        = Number(process.env.GROQ_BATCH_SIZE) || 5
const BATCH_OUTPUT_EST  = BATCH_SIZE * 620   // ~620 output tokens per bilingual item
const TOKEN_MARGIN      = 400                // headroom for the model's own accounting
// Vercel kills the function at maxDuration (60s); stop cleanly before that so
// whatever has been generated still gets stored.
const DEADLINE_MS       = Number(process.env.REFRESH_DEADLINE_MS) || 50_000
const TARGET_ITEMS      = Number(process.env.BRIEF_ITEMS) || 20

// Rough but adequate: ~3.5 chars/token for mixed English + Chinese prompts.
function estimateTokens(text) {
  return Math.ceil(text.length / 3.5)
}

export const REDIS_DATA_KEY   = 'brief:live_data'
export const REDIS_TS_KEY     = 'brief:live_ts'
export const REDIS_HEALTH_KEY = 'brief:health'   // { ok, at, items?, error? } — last refresh outcome

// Record a failed refresh so it's diagnosable / surfaceable in the UI.
// Best-effort: uses its own Redis client so a half-broken caller can't mask it.
export async function recordRefreshFailure(error) {
  try {
    const r = getRedis()
    if (r) await r.set(REDIS_HEALTH_KEY, { ok: false, at: Date.now(), error: String(error?.message ?? error).slice(0, 300) })
  } catch (e) {
    console.warn('[refresh-data] could not record failure health:', e.message)
  }
}

// ── RSS sources ───────────────────────────────────────────────────────────────
const RSS_FEEDS = [
  // ── UK ────────────────────────────────────────────────────────────────────
  'https://feeds.bbci.co.uk/news/technology/rss.xml',           // BBC Technology
  'https://feeds.bbci.co.uk/news/business/rss.xml',             // BBC Business
  'https://www.theguardian.com/technology/rss',                  // The Guardian Tech
  // ── US Tech ───────────────────────────────────────────────────────────────
  'https://techcrunch.com/feed/',                                // TechCrunch
  'https://venturebeat.com/category/ai/feed/',                   // VentureBeat AI
  'https://www.theverge.com/rss/index.xml',                      // The Verge
  'https://www.wired.com/feed/rss',                              // Wired
  'https://feeds.arstechnica.com/arstechnica/technology-lab',    // Ars Technica
  // ── US Finance ────────────────────────────────────────────────────────────
  'https://feeds.reuters.com/reuters/businessNews',              // Reuters Business
  'https://feeds.reuters.com/reuters/technologyNews',            // Reuters Technology
  'https://www.cnbc.com/id/19854910/device/rss/rss.html',       // CNBC Tech
  // ── Asia (ex-China) ───────────────────────────────────────────────────────
  'https://asia.nikkei.com/rss/feed/rss',                       // Nikkei Asia (Japan/Asia)
  // ── China — English-language (accessible from US servers) ─────────────────
  'https://www.scmp.com/rss/4/feed',                            // SCMP (HK / Asia)
  'https://www.caixinglobal.com/rss/rss.xml',                    // Caixin Global (finance EN)
  'https://www.chinadaily.com.cn/rss/index_rss.xml',            // China Daily (gov EN)
  'https://www.globaltimes.cn/rss/outbrain.xml',                // Global Times (EN)
  'https://www.cgtn.com/subscribe/rss/section/business.xml',    // CGTN Business (state EN)
  'https://kr-asia.com/feed',                                    // KrASIA (China/SE-Asia tech EN)
  'https://technode.com/feed/',                                  // TechNode (China tech EN)
  // ── China — Chinese-language (may timeout from US; gracefully ignored if blocked) ──
  'https://36kr.com/feed',                                      // 36氪 (CN tech 中文)
]
// Note: 微博、小红书、微信公众号 do not offer public RSS feeds and cannot be polled
// without private API credentials — only RSS-based sources are supported here.

// ── XML / entity helpers ──────────────────────────────────────────────────────
function unCDATA(s = '') {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ').replace(/&#160;/g, ' ')
    .replace(/&#\d+;/g, '').replace(/&[a-z]+;/g, '')
    .replace(/\s+/g, ' ').trim()
}
function xmlTag(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'))
  return unCDATA(m?.[1] ?? '')
}

async function fetchFeed(url) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalystBot/1.0)' },
      signal: AbortSignal.timeout(5000),
    })
    if (!r.ok) { console.warn(`[refresh-data] RSS ${url} → HTTP ${r.status}`); return [] }
    const xml = await r.text()
    const out = []
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const seg   = m[1]
      const title = xmlTag(seg, 'title')
      const desc  = xmlTag(seg, 'description').slice(0, 200)
      const link  = xmlTag(seg, 'link') ||
                    seg.match(/<link\s*\/?>[\s\n]*(https?:\/\/[^\s<]+)/)?.[1] || ''
      if (title) out.push({ title, desc, link })
      if (out.length >= 3) break   // 3/feed max → forces source diversity in round-robin
    }
    return out
  } catch (e) {
    console.warn(`[refresh-data] RSS ${url} failed: ${e.message}`)
    return []
  }
}

// ── Round-robin feed selector (1 item per feed per round — maximises source diversity) ──
function roundRobin(feedItemArrays, total) {
  const result  = []
  const cursors = feedItemArrays.map(() => 0)
  while (result.length < total) {
    let added = false
    for (let f = 0; f < feedItemArrays.length && result.length < total; f++) {
      if (cursors[f] < feedItemArrays[f].length) {
        result.push(feedItemArrays[f][cursors[f]++])
        added = true
      }
    }
    if (!added) break   // all feeds exhausted
  }
  return result
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

// ── China source detection (URL-based — more reliable than model inference) ───
const CHINA_DOMAINS = [
  'chinadaily.com.cn', 'globaltimes.cn', 'cgtn.com', 'xinhuanet.com',
  'caixinglobal.com', 'caixin.com', '36kr.com', 'huxiu.com',
  'scmp.com', 'yicai.com', 'kr-asia.com', 'technode.com',
  'sinafinance.com', 'sina.com.cn',
]

function isChineseDomain(url = '') {
  return CHINA_DOMAINS.some(d => url.includes(d))
}

// ── Feed → country mapping (source origin, not story subject) ─────────────────
const FEED_COUNTRY_MAP = [
  ['feeds.bbci.co.uk',        'UK'],
  ['bbc.co.uk',               'UK'],
  ['theguardian.com',         'UK'],
  ['techcrunch.com',          'US'],
  ['venturebeat.com',         'US'],
  ['theverge.com',            'US'],
  ['wired.com',               'US'],
  ['arstechnica.com',         'US'],
  ['reuters.com',             'Global'],
  ['cnbc.com',                'US'],
  ['asia.nikkei.com',         'JP'],
  ['nikkei.com',              'JP'],
  ['scmp.com',                'HK'],
  ['kr-asia.com',             'Global'],
  ['technode.com',            'CN'],
  ['chinadaily.com.cn',       'CN'],
  ['globaltimes.cn',          'CN'],
  ['cgtn.com',                'CN'],
  ['caixinglobal.com',        'CN'],
  ['caixin.com',              'CN'],
  ['36kr.com',                'CN'],
  ['xinhuanet.com',           'CN'],
]

function getFeedCountry(url = '') {
  for (const [domain, country] of FEED_COUNTRY_MAP) {
    if (url.includes(domain)) return country
  }
  return null
}

// ── Field normalisation ────────────────────────────────────────────────────────
const VALID_CATS      = new Set(['AI', 'Technology', 'Finance'])
const VALID_IMPACTS   = new Set(['High', 'Medium', 'Low'])
const VALID_COUNTRIES = new Set(['US', 'UK', 'CN', 'HK', 'EU', 'JP', 'KR', 'IN', 'SG', 'AU', 'DE', 'FR', 'Global'])

function normaliseItem(item, index) {
  // Priority: URL of source > model-inferred region
  const sourceUrl      = item.sources?.[0]?.url ?? ''
  const urlSaysChina   = isChineseDomain(sourceUrl)
  const modelSaysChina = typeof item.region === 'string' &&
                         item.region.toLowerCase().trim() === 'china'
  const region   = (urlSaysChina || modelSaysChina) ? 'china' : 'overseas'
  const category = VALID_CATS.has(item.category)    ? item.category : 'Technology'
  const impact   = VALID_IMPACTS.has(item.impact)   ? item.impact   : 'Medium'
  const country  = VALID_COUNTRIES.has(item.country) ? item.country : 'Global'

  // Ensure bilingual objects
  const toObj = (v) =>
    v && typeof v === 'object' ? v : { zh: String(v ?? ''), en: String(v ?? '') }

  return {
    ...item,
    id:           index + 1,
    rank:         index + 1,
    region,
    category,
    impact,
    country,
    date:         item.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    tags:         Array.isArray(item.tags)    ? item.tags.slice(0, 2) : [],
    sources:      Array.isArray(item.sources) ? item.sources          : [],
    title:        toObj(item.title),
    summary:      toObj(item.summary),
    whyItMatters: toObj(item.whyItMatters),
  }
}

// ── Model resolution ──────────────────────────────────────────────────────────
// Hard-coding a model id caused a silent 11-day outage when Groq retired
// llama-3.3-70b-versatile. Instead we ask Groq what it currently serves and pick
// the best general-purpose chat model, so a future retirement self-heals.

// Not general-purpose chat models — audio, safety classifiers, embeddings.
const NON_CHAT_PATTERNS = [
  /whisper/i, /\btts\b/i, /guard/i, /embed/i, /moderation/i, /rerank/i,
]

// Heuristic score, deliberately pattern-based rather than a list of exact ids —
// it survives version bumps (llama-3.3 → llama-4 → …) without another outage.
function scoreModel(id) {
  if (NON_CHAT_PATTERNS.some(p => p.test(id))) return -1
  let score = 0
  if (/versatile/i.test(id))                        score += 100  // Groq's general-purpose tag
  if (/llama/i.test(id))                            score += 40
  if (/qwen|kimi|deepseek|gpt-oss|mixtral|gemma/i.test(id)) score += 20
  if (/instant|mini|small|8b|7b/i.test(id))         score -= 20   // fast but weaker
  if (/preview|alpha|beta/i.test(id))               score -= 30
  // Reasoning models emit <think> blocks that break strict JSON parsing.
  if (/\br1\b|reasoning|distill|think/i.test(id))   score -= 90
  const size = id.match(/(\d+)\s*b\b/i)                           // bigger = better, capped
  if (size) score += Math.min(Number(size[1]), 200) / 4
  return score
}

async function listGroqModels(apiKey) {
  const r = await fetch(`${GROQ_API_BASE}/models`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    signal:  AbortSignal.timeout(10000),
  })
  if (!r.ok) throw new Error(`Groq /models → HTTP ${r.status}`)
  const body = await r.json()
  return (body?.data ?? []).map(m => m.id).filter(Boolean)
}

// Cached for the lifetime of the warm lambda — one extra HTTP call per cold start.
let cachedModel = null

export async function resolveModel(apiKey, { force = false } = {}) {
  if (cachedModel && !force) return cachedModel

  const pinned = process.env.GROQ_MODEL
  let available
  try {
    available = await listGroqModels(apiKey)
  } catch (e) {
    // Can't enumerate — fall back to the pin, or let the completion call surface the error.
    console.warn(`[refresh-data] could not list models (${e.message}); using pin=${pinned ?? 'none'}`)
    if (pinned) return (cachedModel = pinned)
    throw new Error(`Cannot determine a Groq model: ${e.message}`)
  }

  // A pin is honoured only if Groq still serves it.
  if (pinned && available.includes(pinned)) {
    console.log(`[refresh-data] using pinned model ${pinned}`)
    return (cachedModel = pinned)
  }
  if (pinned) {
    console.warn(`[refresh-data] pinned model "${pinned}" is no longer available — auto-selecting`)
  }

  const ranked = available
    .map(id => ({ id, score: scoreModel(id) }))
    .filter(m => m.score >= 0)
    .sort((a, b) => b.score - a.score)

  if (ranked.length === 0) {
    throw new Error(`No usable chat model among ${available.length} Groq models`)
  }

  console.log(`[refresh-data] auto-selected ${ranked[0].id} from ${available.length} models ` +
              `(runners-up: ${ranked.slice(1, 4).map(m => m.id).join(', ') || 'none'})`)
  return (cachedModel = ranked[0].id)
}

// ── Core refresh logic (runs in-process — used by both the HTTP handler and ──
//    send-brief.js, which calls it directly to avoid a fragile self-fetch) ───
// Throws on failure; returns the stored data object on success.
export async function refreshBriefData() {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) throw new Error('GROQ_API_KEY not set')

  // 1. Fetch RSS in parallel (5 s timeout keeps total ≤ 5 s)
  const feedResults = await Promise.all(
    RSS_FEEDS.map(async feedUrl => {
      const it = await fetchFeed(feedUrl)
      const isChina = isChineseDomain(feedUrl)
      return { feedUrl, items: it.map(i => ({ ...i, feedUrl })), isChina }
    })
  )

  // Separate by region; keep items grouped per feed for round-robin
  const chinaFeeds    = feedResults.filter(f => f.isChina)
  const overseasFeeds = feedResults.filter(f => !f.isChina)
  const chinaTotal    = chinaFeeds.reduce((s, f) => s + f.items.length, 0)
  const overseasTotal = overseasFeeds.reduce((s, f) => s + f.items.length, 0)
  console.log(`[refresh-data] fetched china=${chinaTotal} (${chinaFeeds.length} feeds) overseas=${overseasTotal} (${overseasFeeds.length} feeds)`)

  if (chinaTotal + overseasTotal < 4) {
    throw new Error(`Too few headlines: ${chinaTotal + overseasTotal}`)
  }

  const today     = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  const weekRange = getWeekRange()
  const pubAt     = new Date().toISOString()

  // Round-robin picks 1 item per feed per round → maximises source diversity.
  // Target: 10 overseas + 10 China = 20 total.
  // If one side is short, leftover quota fills from the other side.
  const WANT_OVERSEAS = 10, WANT_CHINA = 10
  const sliceOverseas = roundRobin(overseasFeeds.map(f => f.items), WANT_OVERSEAS + Math.max(0, WANT_CHINA - chinaTotal))
  const sliceChina    = roundRobin(chinaFeeds.map(f => f.items),    WANT_CHINA    + Math.max(0, WANT_OVERSEAS - sliceOverseas.length))
  let targets = [...sliceOverseas, ...sliceChina]

  // Each run can only afford a few items, so generate ones the pool does not have
  // yet — otherwise every run would re-generate the same top headlines and the
  // pool could never fill up.
  const redisEarly = getRedis()
  let prevNews = []
  if (redisEarly) {
    try {
      const prev = await redisEarly.get(REDIS_DATA_KEY)
      prevNews = Array.isArray(prev?.news) ? prev.news : []
    } catch (e) {
      console.warn('[refresh-data] could not read previous pool:', e.message)
    }
  }
  if (prevNews.length > 0) {
    const covered = new Set(prevNews.map(it => it?.sources?.[0]?.url).filter(Boolean))
    const unseen  = targets.filter(t => t.link && !covered.has(t.link))
    if (unseen.length > 0) {
      console.log(`[refresh-data] ${unseen.length}/${targets.length} headlines are new to the pool`)
      targets = unseen
    } else {
      console.log('[refresh-data] no new headlines — regenerating the freshest')
    }
  }

  const N = targets.length

  // 2. Generate. Groq's free tier caps tokens-per-minute, and a request's cost is
  //    prompt + max_tokens. 20 rich bilingual items exceed that in one call, so we
  //    split into sequential batches sized to fit the budget.
  let model = await resolveModel(apiKey)
  console.log(`[refresh-data] sending ${N} headlines to ${model}`)

  const buildPrompt = (batch, offset) => {
  const n = batch.length
  // Tag each headline with [CN] or [INTL] so the model has a reliable region hint
  const headlines = batch
    .map((it, i) => {
      const tag = isChineseDomain(it.link || '') ? '[CN]' : '[INTL]'
      return `${i + 1}. ${tag} ${it.title.slice(0, 100)}\n   ${(it.desc || '').slice(0, 160)}\n   URL: ${it.link || 'n/a'}`
    })
    .join('\n\n')
  const N = n
  return `You are a bilingual analyst news editor. Today is ${today}.

I have ${N} news headlines. Convert each headline into exactly one structured news item.
You MUST output exactly ${N} items — one per headline, in the same order.

HEADLINES:
${headlines}

OUTPUT FORMAT — return this exact JSON structure:
{
  "news": [
    {
      "id": 1,
      "rank": 1,
      "region": "overseas",
      "country": "US",
      "category": "AI",
      "impact": "High",
      "date": "${today}",
      "tags": ["keyword1", "keyword2"],
      "title":        { "zh": "简洁中文标题（≤15字）", "en": "Concise English Title" },
      "summary":      { "zh": "3至5句中文摘要，涵盖事件背景、核心内容与主要影响，字数100至200字。", "en": "3-5 sentence English summary covering context, core content, and key implications, around 80-120 words." },
      "whyItMatters": { "zh": "3至5句中文深度分析：解释该事件对行业、市场或地缘政治的深远影响，字数100至200字。", "en": "3-5 sentence English analysis: explain the deeper significance for the industry, market, or geopolitics, around 80-120 words." },
      "sources": [{ "name": "Source Name", "url": "https://source-url.com" }]
    }
  ],
  "synthesis": {
    "topic":       { "zh": "本周热议主题", "en": "This Week Hot Topic" },
    "summary":     { "zh": "两句综合分析。", "en": "Two sentence overall analysis." },
    "debateScore": 78,
    "sectors":     ["AI"]
  },
  "weekRange":   "${weekRange}",
  "publishedAt": "${pubAt}"
}

STRICT RULES — apply to ALL ${N} items:
1. Produce EXACTLY ${N} items in "news" — one per headline, same order
2. region: headlines tagged [CN] → MUST use "china". Headlines tagged [INTL] → use "overseas" UNLESS the story is primarily about China's economy, government policy, or a Chinese company (Alibaba/Tencent/Baidu/Huawei/ByteDance/Xiaomi/BYD/CATL/JD/Meituan/SMIC/Lenovo/WeChat/Xiaohongshu/36Kr)
3. category: EXACTLY one of "AI" (models/LLM/agents) | "Technology" (hardware/chips/software/cyber) | "Finance" (markets/crypto/macro/VC)
4. impact: EXACTLY one of "High" | "Medium" | "Low"
5. tags: exactly 2 short English keywords
6. Use the headline's URL as the source URL
7. Chinese text: natural, fluent Mandarin — do not use pinyin or romanisation
8. title: concise, ≤ 15 words per language
9. summary: 3-5 sentences, 80-120 English words / 100-200 Chinese characters — cover background, what happened, and key impact
10. whyItMatters: 3-5 sentences of depth analysis, 80-120 English words / 100-200 Chinese characters — explain strategic/market/geopolitical significance
11. country: the PRIMARY country/region this story is ABOUT — exactly one of: "US" | "UK" | "CN" | "HK" | "EU" | "JP" | "KR" | "IN" | "SG" | "AU" | "DE" | "FR" | "Global"`
  }

  const groq = new Groq({ apiKey })

  const callModel = (m, prompt, maxTokens) => groq.chat.completions.create({
    model:           m,
    messages:        [{ role: 'user', content: prompt }],
    max_tokens:      maxTokens,
    temperature:     0.1,
    response_format: { type: 'json_object' },
  })

  // One batch → parsed items. Retries once on a retired model, and shrinks the
  // token ask when the org's TPM budget rejects the request.
  async function runBatch(batch, offset, budget) {
    const prompt = buildPrompt(batch, offset)
    let maxTokens = Math.min(8000, Math.max(1200, budget - estimateTokens(prompt) - TOKEN_MARGIN))

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const completion = await callModel(model, prompt, maxTokens)
        const parsed = JSON.parse(completion.choices[0].message.content)
        return {
          news:      Array.isArray(parsed.news) ? parsed.news : [],
          synthesis: parsed.synthesis,
        }
      } catch (e) {
        const msg = e?.message ?? ''

        // Model retired between resolution and use — re-resolve and retry.
        if (e?.status === 404 || /model_not_found|does not exist/i.test(msg)) {
          const next = await resolveModel(apiKey, { force: true })
          if (next === model) throw e
          console.warn(`[refresh-data] model "${model}" retired — switching to ${next}`)
          model = next
          continue
        }

        // Over the tokens-per-minute budget — obey the limit the error reports.
        if (e?.status === 413 || /rate_limit_exceeded|too large/i.test(msg)) {
          const limit = Number(msg.match(/Limit\s+(\d+)/i)?.[1])
          const room  = (limit || budget) - estimateTokens(prompt) - TOKEN_MARGIN
          if (room < 800 || attempt === 2) {
            throw new Error(`Token budget too small for ${batch.length} items: ${msg.slice(0, 160)}`)
          }
          console.warn(`[refresh-data] TPM rejected (limit=${limit || '?'}) — retrying with max_tokens=${room}`)
          maxTokens = room
          continue
        }

        throw e
      }
    }
    throw new Error('Batch failed after retries')
  }

  const rawNews  = []
  let synthesis  = null
  let spent      = 0                      // tokens charged in the current TPM window
  let windowAt   = Date.now()
  const deadline = Date.now() + DEADLINE_MS

  for (let i = 0; i < targets.length; i += BATCH_SIZE) {
    const batch = targets.slice(i, i + BATCH_SIZE)

    // Reset the rolling window once a minute has passed.
    if (Date.now() - windowAt >= 60_000) { spent = 0; windowAt = Date.now() }

    const cost = estimateTokens(buildPrompt(batch, i)) + BATCH_OUTPUT_EST + TOKEN_MARGIN
    if (spent + cost > TPM_BUDGET) {
      // Would breach the per-minute cap; wait out the window — but only if there is
      // enough wall clock left, since Vercel kills the function at maxDuration.
      const waitMs = 60_000 - (Date.now() - windowAt) + 1_000
      if (Date.now() + waitMs > deadline) {
        console.log(`[refresh-data] stopping at ${rawNews.length} items — TPM window needs ${Math.round(waitMs / 1000)}s, not enough time left`)
        break
      }
      console.log(`[refresh-data] TPM window full (${spent}/${TPM_BUDGET}) — waiting ${Math.round(waitMs / 1000)}s`)
      await new Promise(r => setTimeout(r, waitMs))
      spent = 0; windowAt = Date.now()
    }

    if (Date.now() > deadline) {
      console.log(`[refresh-data] deadline reached — stopping at ${rawNews.length} items`)
      break
    }

    try {
      const out = await runBatch(batch, i, TPM_BUDGET - spent)
      // Pair each item with its own source here — a failed batch would otherwise
      // shift indices and graft the wrong URL/country onto later items.
      out.news.forEach((item, j) => rawNews.push({ item, src: batch[j] }))
      synthesis ??= out.synthesis
      spent += cost
      console.log(`[refresh-data] batch ${i / BATCH_SIZE + 1}: ${out.news.length}/${batch.length} items (spent ~${spent}/${TPM_BUDGET})`)
    } catch (e) {
      // Partial results still beat serving days-old data.
      console.warn(`[refresh-data] batch at ${i} failed: ${e.message}`)
      spent += cost
      if (rawNews.length === 0 && i + BATCH_SIZE >= targets.length) throw e
    }
  }

  if (rawNews.length === 0) throw new Error('Model returned an empty news array')

  const parsed = { synthesis }
  console.log(`[refresh-data] model returned ${rawNews.length} items (expected ${N}) via ${model}`)

  // Inject original RSS URLs + country — model may deviate; URL-based detection is ground-truth.
  rawNews.forEach(({ item, src }) => {
    if (!src) return
    const articleUrl = src.link    || ''
    const feedUrl    = src.feedUrl || ''

    // Inject original article URL into sources[0]
    if (articleUrl) {
      if (!Array.isArray(item.sources)) item.sources = []
      if (!item.sources[0]) item.sources[0] = {}
      item.sources[0].url = articleUrl
      if (!item.sources[0].name) {
        try { item.sources[0].name = new URL(articleUrl).hostname.replace(/^www\./, '') }
        catch { item.sources[0].name = 'Source' }
      }
    }

    // Override region — never trust model when we know the feed origin
    if (isChineseDomain(articleUrl) || isChineseDomain(feedUrl)) item.region = 'china'

    // Override country from feed origin (beats model inference for known sources)
    const feedCountry = getFeedCountry(feedUrl) || getFeedCountry(articleUrl)
    if (feedCountry) item.country = feedCountry
  })

  const items         = rawNews.map(({ item }) => item)
  const chinaCount    = items.filter(it => it.region === 'china' || isChineseDomain(it.sources?.[0]?.url ?? '')).length
  const overseasCount = items.length - chinaCount
  console.log(`[refresh-data] region split — china=${chinaCount} overseas=${overseasCount}`)

  const redis = getRedis()

  // The free-tier TPM cap means one run generates only a handful of items. Rather
  // than shrinking the brief to that batch, merge the fresh items over the previous
  // pool: newest first, deduped by article URL, capped at TARGET_ITEMS. Successive
  // refreshes roll the pool over while it stays full.
  let merged = items.map(normaliseItem)
  {
    const seen = new Set(merged.map(it => it.sources?.[0]?.url).filter(Boolean))
    for (const old of prevNews) {
      if (merged.length >= TARGET_ITEMS) break
      const url = old?.sources?.[0]?.url
      if (url && seen.has(url)) continue
      if (url) seen.add(url)
      merged.push(old)
    }
    console.log(`[refresh-data] merged ${items.length} fresh + ${merged.length - items.length} carried over`)
  }
  // Re-rank so id/rank stay sequential after the merge.
  merged = merged.map((it, i) => ({ ...it, id: i + 1, rank: i + 1 }))

  // Normalise every field to prevent frontend display bugs
  const data = {
    news:        merged,
    synthesis:   parsed.synthesis   ?? { topic: { zh: '科技趋势', en: 'Tech Trends' }, summary: { zh: '本周科技金融动态。', en: 'This week in tech and finance.' }, debateScore: 70, sectors: ['Technology'] },
    weekRange:   parsed.weekRange   ?? weekRange,
    publishedAt: parsed.publishedAt ?? pubAt,
  }

  // 3. Store in Redis
  if (redis) {
    const now = Date.now()
    await redis.set(REDIS_DATA_KEY,   data)
    await redis.set(REDIS_TS_KEY,     now)
    await redis.set(REDIS_HEALTH_KEY, { ok: true, at: now, items: data.news.length, fresh: items.length })
    console.log(`[refresh-data] stored ${data.news.length} items in Redis (${items.length} fresh)`)
  } else {
    console.warn('[refresh-data] Redis not configured')
  }

  return { data, model, items: data.news.length, stored: !!redis }
}

// ── HTTP Handler — thin wrapper around refreshBriefData() ─────────────────────
export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    const { data, model, items, stored } = await refreshBriefData()
    return res.status(200).json({ ok: true, items, weekRange: data.weekRange, model, stored })
  } catch (e) {
    console.error('[refresh-data] error:', e.message)
    await recordRefreshFailure(e)
    return res.status(500).json({ error: e.message })
  }
}
