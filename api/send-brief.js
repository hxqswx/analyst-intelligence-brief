// Vercel Serverless Function  — POST /api/send-brief
// Also called by Vercel Cron (vercel.json) every day at 06:00 UTC
//
// Required env var in Vercel dashboard → Settings → Environment Variables:
//   RESEND_API_KEY   — get from https://resend.com (free tier: 3000 emails/month)

import { Resend } from 'resend'
import { Redis } from '@upstash/redis'
import { news, synthesis, weekRange, publishedAt } from '../src/data.js'
import { refreshBriefData, recordRefreshFailure } from './refresh-data.js'

const FROM          = 'Analyst Brief <brief@exploring-china.com>'
const FALLBACK_TO   = ['mikexiangwang@gmail.com', 'xiangwang0083@gmail.com']
const REDIS_KEY     = 'brief:recipients'

function getRedis() {
  const url   = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

// ── country flag helper ───────────────────────────────────────────────────────
const COUNTRY_FLAGS = {
  US: '🇺🇸', UK: '🇬🇧', CN: '🇨🇳', HK: '🇭🇰', EU: '🇪🇺',
  JP: '🇯🇵', KR: '🇰🇷', IN: '🇮🇳', SG: '🇸🇬', AU: '🇦🇺',
  DE: '🇩🇪', FR: '🇫🇷', Global: '🌐',
}
const countryFlag = (c) => COUNTRY_FLAGS[c] ?? '🌐'

// ── category colours (email-safe inline styles) ──────────────────────────────
const CAT_STYLE = {
  AI:         { bg: '#eff6ff', color: '#1d4ed8', label: 'AI'   },
  Technology: { bg: '#f5f3ff', color: '#6d28d9', label: '科技' },
  Finance:    { bg: '#ecfdf5', color: '#059669', label: '金融' },
}
const IMPACT_STYLE = {
  High:   { bg: '#fef2f2', color: '#dc2626' },
  Medium: { bg: '#fffbeb', color: '#d97706' },
  Low:    { bg: '#f3f4f6', color: '#6b7280' },
}

// ── HTML email template ───────────────────────────────────────────────────────
// briefData: { news, synthesis, weekRange, publishedAt } — falls back to static imports
function buildHTML(lang = 'zh', briefData = {}) {
  const newsList    = briefData.news        ?? news
  const syn         = briefData.synthesis   ?? synthesis
  const wr          = briefData.weekRange   ?? weekRange
  const pubAt       = briefData.publishedAt ?? publishedAt

  const isZh = lang === 'zh'
  const tx = obj => (typeof obj === 'object' ? (obj[lang] ?? obj.en) : obj)

  // dynamic counts
  const aiCount   = newsList.filter(n => n.category === 'AI').length
  const techCount = newsList.filter(n => n.category === 'Technology').length
  const finCount  = newsList.filter(n => n.category === 'Finance').length
  const highCount = newsList.filter(n => n.impact === 'High').length

  const catLabel = cat =>
    isZh ? (cat === 'Technology' ? '科技' : cat === 'Finance' ? '金融' : 'AI')
         : (cat === 'Technology' ? 'Tech' : cat)

  const impactLabel = imp =>
    isZh ? ({ High: '高影响', Medium: '中影响', Low: '低影响' }[imp])
         : imp

  const articleHTML = newsList.map(item => {
    const cs = CAT_STYLE[item.category]
    const is = IMPACT_STYLE[item.impact]
    return `
    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:12px;">
      <tr>
        <td width="4" style="background:${cs.color};padding:0;"></td>
        <td style="padding:16px 18px;background:#ffffff;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td>
                <span style="font-family:monospace;font-size:18px;font-weight:800;color:#d29922;">#${item.rank}</span>
                &nbsp;
                <span style="background:${cs.bg};color:${cs.color};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">
                  ${catLabel(item.category)}
                </span>
                &nbsp;
                <span style="background:${is.bg};color:${is.color};padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;">
                  ${impactLabel(item.impact)}
                </span>
                ${item.country ? `&nbsp;<span style="background:#f3f4f6;color:#374151;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;">${countryFlag(item.country)} ${item.country}</span>` : ''}
                <span style="float:right;font-size:11px;color:#9ca3af;">${item.date}</span>
              </td>
            </tr>
            <tr><td style="height:8px;"></td></tr>
            <tr>
              <td style="font-size:14px;font-weight:700;color:#111827;line-height:1.45;">
                ${tx(item.title)}
              </td>
            </tr>
            <tr><td style="height:6px;"></td></tr>
            <tr>
              <td style="font-size:13px;color:#4b5563;line-height:1.75;">
                ${tx(item.summary)}
              </td>
            </tr>
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td style="background:#f9fafb;border-radius:6px;padding:10px 12px;">
                <div style="font-size:11px;font-weight:700;color:${cs.color};margin-bottom:5px;">
                  ${isZh ? '▸ 为何重要' : '▸ Why It Matters'}
                </div>
                <div style="font-size:12px;color:#6b7280;line-height:1.7;">
                  ${tx(item.whyItMatters)}
                </div>
                <div style="margin-top:6px;font-size:11px;color:#9ca3af;">
                  ${isZh ? '来源：' : 'Sources: '}${item.sources.map(s =>
                    `<a href="${s.url}" style="color:#60a5fa;text-decoration:none;">${s.name}</a>`
                  ).join(' · ')}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`
  }).join('\n')

  const synthesisHTML = `
  <table width="100%" cellpadding="0" cellspacing="0"
         style="border:1px solid rgba(251,191,36,0.4);border-radius:10px;overflow:hidden;margin-bottom:24px;background:#1c1a0e;">
    <tr>
      <td style="padding:14px 18px;border-bottom:1px solid rgba(251,191,36,0.2);background:rgba(251,191,36,0.08);">
        <span style="font-size:10px;font-weight:700;color:#d29922;text-transform:uppercase;letter-spacing:2px;">
          🔥 ${isZh ? '本周最热议题' : "Week's Most Debated Topic"}
        </span>
        &nbsp;&nbsp;
        <span style="background:rgba(251,191,36,0.15);color:#f59e0b;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;">
          ${syn.debateScore}% ${isZh ? '热议' : 'debate'}
        </span>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 18px;">
        <div style="font-size:16px;font-weight:800;color:#fbbf24;line-height:1.4;margin-bottom:12px;">
          ${tx(syn.topic)}
        </div>
        <div style="font-size:13px;color:#9ca3af;line-height:1.8;">
          ${tx(syn.summary)}
        </div>
      </td>
    </tr>
  </table>`

  const now = new Date().toLocaleString(isZh ? 'zh-CN' : 'en-US',
    { timeZone: 'UTC', dateStyle: 'full', timeStyle: 'short' })

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${isZh ? '分析师情报简报' : 'Analyst Intelligence Brief'}</title>
</head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
    <tr><td align="center" style="padding:24px 16px;">

      <!-- wrapper -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- header -->
        <tr>
          <td style="background:#0d1117;border-radius:12px 12px 0 0;padding:24px 24px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <div style="font-size:19px;font-weight:800;color:#e6edf3;">
                    ${isZh ? '分析师情报简报' : 'Analyst Intelligence Brief'}
                  </div>
                  <div style="font-size:12px;color:#484f58;margin-top:3px;font-family:monospace;">
                    ${wr} &nbsp;·&nbsp; ${isZh ? '每日归档' : 'Daily Archive'}
                  </div>
                </td>
                <td align="right" style="vertical-align:middle;">
                  <span style="background:rgba(96,165,250,0.15);color:#60a5fa;padding:4px 10px;border-radius:999px;font-size:11px;font-weight:600;">
                    ${isZh ? `${newsList.length}条简报` : `Top ${newsList.length} Briefs`}
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- stat bar -->
        <tr>
          <td style="background:#161b26;padding:12px 24px;border-bottom:1px solid #21262d;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="text-align:center;">
                  <span style="font-size:18px;font-weight:800;color:#60a5fa;">${aiCount}</span><br>
                  <span style="font-size:10px;color:#484f58;">AI</span>
                </td>
                <td style="text-align:center;">
                  <span style="font-size:18px;font-weight:800;color:#c084fc;">${techCount}</span><br>
                  <span style="font-size:10px;color:#484f58;">${isZh ? '科技' : 'Tech'}</span>
                </td>
                <td style="text-align:center;">
                  <span style="font-size:18px;font-weight:800;color:#34d399;">${finCount}</span><br>
                  <span style="font-size:10px;color:#484f58;">${isZh ? '金融' : 'Finance'}</span>
                </td>
                <td style="text-align:center;">
                  <span style="font-size:18px;font-weight:800;color:#f87171;">${highCount}</span><br>
                  <span style="font-size:10px;color:#484f58;">${isZh ? '高影响' : 'High Impact'}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- body -->
        <tr>
          <td style="background:#f3f4f6;padding:20px 16px;">

            <!-- synthesis -->
            ${synthesisHTML}

            <!-- section title -->
            <div style="font-size:11px;font-weight:700;color:#9ca3af;text-transform:uppercase;
                        letter-spacing:2px;margin-bottom:12px;padding:0 2px;">
              ${isZh ? `本周${newsList.length}大要闻` : `Top ${newsList.length} Developments This Week`}
            </div>

            <!-- articles -->
            ${articleHTML}

          </td>
        </tr>

        <!-- footer -->
        <tr>
          <td style="background:#0d1117;border-radius:0 0 12px 12px;padding:20px 24px;text-align:center;">
            <div style="font-size:12px;color:#484f58;margin-bottom:6px;">
              ${isZh
                ? '为科技与金融行业分析师精选情报 · 基于公开报道，不构成投资建议'
                : 'Curated intelligence for technology & finance analysts · Not financial advice'}
            </div>
            <div style="font-size:11px;color:#30363d;font-family:monospace;">
              ${isZh ? '归档时间：' : 'Archived: '}${now} UTC
            </div>
            <div style="margin-top:10px;">
              <a href="https://analyst-intelligence-brief.vercel.app"
                 style="color:#60a5fa;font-size:12px;text-decoration:none;">
                ${isZh ? '在线查看完整版本 →' : 'View full brief online →'}
              </a>
            </div>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── parse raw body (Vercel Node.js functions don't always auto-parse JSON) ────
async function parseBody(req) {
  if (req.body && typeof req.body === 'object') return req.body   // already parsed
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', chunk => { raw += chunk })
    req.on('end', () => {
      try { resolve(JSON.parse(raw)) } catch { resolve({}) }
    })
    req.on('error', () => resolve({}))
  })
}

// ── handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Allow GET (cron) and POST (manual trigger from UI)
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({
      error: 'RESEND_API_KEY not set — add it in Vercel → Settings → Environment Variables (resend.com for a free key).'
    })
  }

  const body = await parseBody(req)
  const lang = body?.lang ?? 'zh'

  // ── Step 1: refresh live data IN-PROCESS before sending (ensures today's news) ──
  // Runs directly (not via self-fetch) so there is no timeout race — the email
  // always reflects the data that was just generated and stored in Redis.
  let briefData    = null
  let refreshError = null
  if (process.env.GROQ_API_KEY) {
    try {
      console.log('[send-brief] running in-process refresh…')
      const { data } = await refreshBriefData()
      if (data?.news?.length > 0) briefData = data
      console.log(`[send-brief] refresh done — ${data?.news?.length ?? 0} items`)
    } catch (e) {
      refreshError = e.message
      console.warn('[send-brief] refresh failed (will use cached):', e.message)
      await recordRefreshFailure(e)
    }
  }

  // ── Step 2: read recipients + (fallback) cached data from Redis ───────────────
  let toList = FALLBACK_TO
  try {
    const redis = getRedis()
    if (redis) {
      const [stored, liveData] = await Promise.all([
        redis.get(REDIS_KEY),
        briefData ? Promise.resolve(null) : redis.get('brief:live_data'),
      ])
      if (Array.isArray(stored) && stored.length > 0) toList = stored
      if (!briefData && liveData?.news?.length > 0) briefData = liveData
    }
  } catch (e) {
    console.warn('[send-brief] Redis read failed:', e.message)
  }

  try {
    const resend  = new Resend(apiKey)
    const payload = briefData ?? { news, synthesis, weekRange, publishedAt }
    const html    = buildHTML(lang, payload)
    const subject = `${lang === 'zh' ? '分析师情报简报' : 'Analyst Intelligence Brief'} — ${briefData ? new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : weekRange}`

    // Send individually so each recipient sees only their own address in the To field
    const results = await Promise.all(
      toList.map(email =>
        resend.emails.send({ from: FROM, to: [email], subject, html })
      )
    )

    const errors = results.filter(r => r.error).map(r => r.error)
    if (errors.length === toList.length) throw new Error(JSON.stringify(errors[0]))

    const ids = results.map(r => r.data?.id).filter(Boolean)
    console.log(`[send-brief] sent ${ids.length}/${toList.length} →`, ids)

    // Alert admins if the brief went out on STALE data (refresh failed this run)
    if (refreshError) {
      try {
        await resend.emails.send({
          from:    FROM,
          to:      FALLBACK_TO,
          subject: `⚠️ 简报数据刷新失败 — 已发送旧数据 (${new Date().toLocaleDateString('en-US',{month:'short',day:'numeric'})})`,
          html:    `<div style="font-family:sans-serif;font-size:14px;color:#111;line-height:1.7;">
            <p><strong>今天的简报刷新失败</strong>,邮件使用了 Redis 中的旧缓存数据发送。</p>
            <p><strong>错误信息:</strong></p>
            <pre style="background:#f4f4f5;padding:10px;border-radius:6px;white-space:pre-wrap;color:#b91c1c;">${refreshError}</pre>
            <p>常见原因:Groq 限流/额度用尽、RSS 源批量失效、Redis 写入失败。可前往管理后台手动「立即刷新数据」重试。</p>
          </div>`,
        })
        console.log('[send-brief] sent refresh-failure alert to admins')
      } catch (alertErr) {
        console.warn('[send-brief] could not send failure alert:', alertErr.message)
      }
    }

    return res.status(200).json({ ok: true, sent: ids.length, ids, to: toList, refreshFailed: !!refreshError, week: payload.weekRange ?? weekRange })
  } catch (err) {
    console.error('[send-brief] error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
