import { useState, useMemo, createContext, useContext, useCallback, useEffect, useRef } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import {
  Brain, Cpu, TrendingUp, Flame, ChevronDown, ChevronUp,
  Calendar, RefreshCw, Zap, Globe, BarChart2, Shield,
  Star, ArrowUpRight, AlertTriangle, Mail, CheckCircle, XCircle,
  Settings, MapPin, Sun, Moon,
} from 'lucide-react'
import { news as staticNews, chinaNews as staticChina, overseasNews as staticOverseas,
         synthesis as staticSynthesis, weekRange as staticWeekRange,
         publishedAt as staticPublishedAt } from './data.js'
import { i18n, LANG_KEY } from './i18n.js'

const THEME_KEY = 'aib-theme'
import { LangCtx } from './context.js'
import AdminPanel from './AdminPanel.jsx'

const useLang = () => useContext(LangCtx)

// ─── BriefCtx — live data ────────────────────────────────────────────────────

function makeMeta(news) {
  // Normalise region defensively — API may return capitalised or unexpected values
  const normalised = news.map(n => ({
    ...n,
    region: (typeof n.region === 'string' && n.region.toLowerCase() === 'china')
      ? 'china' : 'overseas',
  }))
  const china    = normalised.filter(n => n.region === 'china')
  const overseas = normalised.filter(n => n.region === 'overseas')
  return {
    chinaNews:    china,
    overseasNews: overseas,
    news:         normalised,   // return the normalised array so everything is consistent
    categoryMeta: {
      AI:         { count: normalised.filter(n => n.category === 'AI').length },
      Technology: { count: normalised.filter(n => n.category === 'Technology').length },
      Finance:    { count: normalised.filter(n => n.category === 'Finance').length },
      china:      { count: china.length },
      overseas:   { count: overseas.length },
    },
  }
}

const staticMeta = makeMeta(staticNews)

// Empty brief used while data is loading (no mockup content shown)
const EMPTY_BRIEF = {
  news: [], chinaNews: [], overseasNews: [],
  categoryMeta: {
    AI:         { count: 0 },
    Technology: { count: 0 },
    Finance:    { count: 0 },
    china:      { count: 0 },
    overseas:   { count: 0 },
  },
  synthesis:   staticSynthesis,
  weekRange:   staticWeekRange,
  publishedAt: '',
  source:      'loading',
  cachedAt:    null,
  health:      null,
}

const BriefCtx = createContext(EMPTY_BRIEF)

const useBrief = () => useContext(BriefCtx)

// ─── constants ───────────────────────────────────────────────────────────────

const CAT = {
  AI:         { pill: 'pill-ai',   text: 'text-ai',   stripe: 'stripe-ai',   Icon: Brain,      panel: 'panel-ai'   },
  Technology: { pill: 'pill-tech', text: 'text-tech', stripe: 'stripe-tech', Icon: Cpu,        panel: 'panel-tech' },
  Finance:    { pill: 'pill-fin',  text: 'text-fin',  stripe: 'stripe-fin',  Icon: TrendingUp, panel: 'panel-fin'  },
}
const IMPACT_CLS = { High: 'impact-high', Medium: 'impact-medium', Low: 'impact-low' }

const REGION_TABS = [
  { key: 'All',      Icon: Star    },
  { key: 'china',    Icon: MapPin  },
  { key: 'overseas', Icon: Globe   },
]
const REGION_ACTIVE = { All: 'text-white',  china: 'text-red-400', overseas: 'text-ai' }
const REGION_LINE   = { All: 'bg-slate-300', china: 'bg-red-400',  overseas: 'bg-ai'  }

const CAT_FILTERS = ['AI', 'Technology', 'Finance']

const COUNTRY_META = {
  US:     { flag: '🇺🇸', label: 'US'     },
  UK:     { flag: '🇬🇧', label: 'UK'     },
  CN:     { flag: '🇨🇳', label: '中国'   },
  HK:     { flag: '🇭🇰', label: 'HK'     },
  EU:     { flag: '🇪🇺', label: 'EU'     },
  JP:     { flag: '🇯🇵', label: 'JP'     },
  KR:     { flag: '🇰🇷', label: 'KR'     },
  IN:     { flag: '🇮🇳', label: 'IN'     },
  SG:     { flag: '🇸🇬', label: 'SG'     },
  AU:     { flag: '🇦🇺', label: 'AU'     },
  DE:     { flag: '🇩🇪', label: 'DE'     },
  FR:     { flag: '🇫🇷', label: 'FR'     },
  Global: { flag: '🌐',   label: 'Global' },
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const tx = (field, lang) =>
  field && typeof field === 'object' ? (field[lang] ?? field.en) : field

function timeAgo(ts, lang, t) {
  if (!ts) return null
  const mins = Math.floor((Date.now() - ts) / 60000)
  if (mins < 1)  return t.justUpdated
  if (mins < 60) return t.updatedAgo(mins, lang === 'zh' ? '分钟' : 'm')
  return t.updatedAgo(Math.floor(mins / 60), lang === 'zh' ? '小时' : 'h')
}

// ─── atoms ───────────────────────────────────────────────────────────────────

function CategoryPill({ category }) {
  const { lang, t } = useLang()
  const { pill, Icon } = CAT[category] ?? CAT.AI
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pill}`}>
      <Icon size={10} />
      {t.catLabel[category]}
    </span>
  )
}

function ImpactPill({ impact }) {
  const { t } = useLang()
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${IMPACT_CLS[impact]}`}>
      <Zap size={9} />
      {t.impact[impact]}
    </span>
  )
}

function CountryBadge({ country }) {
  const { lang } = useLang()
  const meta = COUNTRY_META[country] ?? COUNTRY_META.Global
  const label = (lang === 'zh' && country === 'CN') ? '中国'
              : (lang === 'zh' && country === 'HK') ? '香港'
              : meta.label
  return (
    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-2xs font-medium
                     bg-surface-raise border border-surface-line text-slate-400">
      <span className="text-base leading-none" style={{ fontSize: '12px' }}>{meta.flag}</span>
      {label}
    </span>
  )
}

// ─── RegionTabBar ─────────────────────────────────────────────────────────────

function RegionTabBar({ active, setActive }) {
  const { t } = useLang()
  const { news, categoryMeta } = useBrief()
  const counts = {
    All:      news.length,
    china:    categoryMeta.china.count,
    overseas: categoryMeta.overseas.count,
  }
  return (
    <div className="flex overflow-x-auto no-scrollbar border-b border-surface-line">
      {REGION_TABS.map(({ key, Icon }) => {
        const isActive = active === key
        return (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium
                        whitespace-nowrap shrink-0 transition-colors duration-150
                        ${isActive ? REGION_ACTIVE[key] : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Icon size={13} />
            {t.tabs[key]}
            <span className={`ml-0.5 text-2xs px-1.5 py-px rounded-full
              ${isActive ? 'bg-white/15' : 'bg-white/8 text-slate-400'}`}>
              {counts[key]}
            </span>
            {isActive && (
              <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${REGION_LINE[key]}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ─── CatFilterBar ─────────────────────────────────────────────────────────────

function CatFilterBar({ active, setActive }) {
  const { t } = useLang()
  const { news } = useBrief()
  const counts = {
    AI:         news.filter(n => n.category === 'AI').length,
    Technology: news.filter(n => n.category === 'Technology').length,
    Finance:    news.filter(n => n.category === 'Finance').length,
  }
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-4 py-2.5
                    border-b border-surface-line/60">
      {/* All */}
      <button
        onClick={() => setActive(null)}
        className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors border
          ${active === null
            ? 'bg-white/12 border-white/20 text-white'
            : 'border-surface-line text-slate-400 hover:text-slate-200'}`}
      >
        {t.catAll}
      </button>

      {CAT_FILTERS.map(cat => {
        const { pill, Icon } = CAT[cat]
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => setActive(isActive ? null : cat)}
            className={`shrink-0 flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                        transition-colors border
              ${isActive
                ? `${pill} border-transparent`
                : 'border-surface-line text-slate-400 hover:text-slate-200'}`}
          >
            <Icon size={10} />
            {t.catLabel[cat]}
            <span className={`text-2xs ml-0.5 ${isActive ? 'opacity-80' : 'text-slate-400'}`}>
              {counts[cat]}
            </span>
          </button>
        )
      })}
    </div>
  )
}

// ─── SectionHeader ────────────────────────────────────────────────────────────

function SectionHeader({ region, count }) {
  const { t } = useLang()
  const isChina = region === 'china'
  return (
    <div className={`flex items-center gap-2 mb-3 mt-1 pb-2
                     border-b ${isChina ? 'border-red-500/20' : 'border-ai/20'}`}>
      {isChina
        ? <span className="text-base leading-none">🇨🇳</span>
        : <Globe size={13} className="text-ai" />
      }
      <span className={`text-xs font-bold uppercase tracking-widest
        ${isChina ? 'text-red-400' : 'text-ai'}`}>
        {isChina ? t.sectionChina : t.sectionOverseas}
      </span>
      <span className="text-2xs text-slate-400 ml-1">{count} {t.stories}</span>
    </div>
  )
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────

function NewsCard({ item, index }) {
  const { lang, t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const { stripe, text, panel } = CAT[item.category] ?? CAT.AI

  return (
    <article
      className="card overflow-hidden cursor-pointer group animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both', opacity: 0 }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex">
        <div className={`w-1 shrink-0 ${stripe}`} />

        <div className="flex-1 min-w-0">
          {/* header row */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-mono font-bold text-xl tabular-nums leading-none
                  ${item.rank <= 3 ? 'text-gold' : 'text-slate-400'}`}>
                  #{item.rank}
                </span>
                <CategoryPill category={item.category} />
                <ImpactPill impact={item.impact} />
                {item.country && <CountryBadge country={item.country} />}
              </div>
              <span className="flex items-center gap-1 text-2xs text-slate-400 shrink-0">
                <Calendar size={10} />
                {item.date}
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-100 leading-snug mb-2
                           group-hover:text-white transition-colors">
              {tx(item.title, lang)}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed">
              {tx(item.summary, lang)}
            </p>

            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.tags.map(tag => (
                  <span key={tag} className="text-2xs px-2 py-0.5 rounded-md
                    bg-surface-raise border border-surface-line text-slate-400">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* expanded panel */}
          <div className={`overflow-hidden transition-all duration-300
            ${expanded ? 'max-h-[1200px]' : 'max-h-0'}`}>
            <div className={`mx-4 mb-4 p-3.5 rounded-lg ${panel}`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${text}`}>
                <ArrowUpRight size={12} />
                {t.whyItMatters}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {tx(item.whyItMatters, lang)}
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-white/10
                              flex flex-wrap items-center gap-1.5 text-2xs text-slate-400">
                <span>{t.sources}</span>
                {(item.sources ?? []).map((src, i) => (
                  <a
                    key={src.name}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="text-slate-300 hover:text-ai underline underline-offset-2 transition-colors"
                  >
                    {src.name}{i < item.sources.length - 1 ? ' ·' : ''}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* toggle footer */}
          <div className={`flex items-center justify-center gap-1 py-2 border-t border-surface-line
                           text-2xs font-medium ${text} opacity-80`}>
            {expanded
              ? <><ChevronUp size={12} />{t.collapse}</>
              : <><ChevronDown size={12} />{t.whyItMatters}</>}
          </div>
        </div>
      </div>
    </article>
  )
}

// ─── SynthesisCard ────────────────────────────────────────────────────────────

function SynthesisCard() {
  const { lang, t } = useLang()
  const { synthesis } = useBrief()
  const [open, setOpen] = useState(false)
  const sectors = (synthesis.sectors ?? []).filter(s => CAT[s])

  return (
    <section
      className="rounded-xl border border-gold/25 bg-surface-card shadow-glow-gold
                 overflow-hidden cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      <div className="flex items-center justify-between gap-3
                      px-4 py-3 bg-gradient-to-r from-gold/10 to-transparent
                      border-b border-gold/15">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1 rounded-lg bg-gold/15">
            <Flame size={14} className="text-gold" />
          </div>
          <span className="text-2xs font-bold text-gold/70 uppercase tracking-widest">
            {t.mostDebated}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full
                           bg-gold/12 border border-gold/20 text-gold text-2xs font-bold">
            <BarChart2 size={9} />
            {synthesis.debateScore}{t.debateScore}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {sectors.map(s => <CategoryPill key={s} category={s} />)}
          <span className="text-gold/40 ml-1">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
        </div>
      </div>
      <div className="px-4 py-3.5">
        <h2 className="text-lg font-bold text-gradient-gold leading-snug">
          {tx(synthesis.topic, lang)}
        </h2>
        <div className={`overflow-hidden transition-all duration-400
          ${open ? 'max-h-[900px] mt-3' : 'max-h-0'}`}>
          <p className="text-sm text-slate-400 leading-relaxed">
            {tx(synthesis.summary, lang)}
          </p>
        </div>
        <p className="text-2xs text-gold/40 mt-2">
          {open ? t.collapseSynthesis : t.expandSynthesis}
        </p>
      </div>
    </section>
  )
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────

function StatsBar({ activeCat, setActiveCat, activeImpact, setActiveImpact }) {
  const { t } = useLang()
  const { news, categoryMeta } = useBrief()

  const stats = [
    {
      label:     'AI',
      value:     categoryMeta.AI.count,
      color:     'text-ai',
      Icon:      Brain,
      activeBg:  'bg-ai-muted',
      activeBdr: 'border-ai-border',
      activeShadow: 'shadow-glow-ai',
      isActive:  activeCat === 'AI',
      onClick:   () => setActiveCat(activeCat === 'AI' ? null : 'AI'),
    },
    {
      label:     t.catLabel.Technology,
      value:     categoryMeta.Technology.count,
      color:     'text-tech',
      Icon:      Cpu,
      activeBg:  'bg-tech-muted',
      activeBdr: 'border-tech-border',
      activeShadow: 'shadow-glow-tech',
      isActive:  activeCat === 'Technology',
      onClick:   () => setActiveCat(activeCat === 'Technology' ? null : 'Technology'),
    },
    {
      label:     t.catLabel.Finance,
      value:     categoryMeta.Finance.count,
      color:     'text-fin',
      Icon:      TrendingUp,
      activeBg:  'bg-fin-muted',
      activeBdr: 'border-fin-border',
      activeShadow: 'shadow-glow-fin',
      isActive:  activeCat === 'Finance',
      onClick:   () => setActiveCat(activeCat === 'Finance' ? null : 'Finance'),
    },
    {
      label:     t.highImpact,
      value:     news.filter(n => n.impact === 'High').length,
      color:     'text-red-400',
      Icon:      AlertTriangle,
      activeBg:  'bg-red-500/10',
      activeBdr: 'border-red-500/25',
      activeShadow: '',
      isActive:  activeImpact,
      onClick:   () => setActiveImpact(v => !v),
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(({ label, value, color, Icon, activeBg, activeBdr, activeShadow, isActive, onClick }) => (
        <button
          key={label}
          onClick={onClick}
          className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border
                      cursor-pointer transition-all duration-150 select-none
                      ${isActive
                        ? `${activeBg} ${activeBdr} ${activeShadow}`
                        : 'bg-surface-card border-surface-line hover:border-slate-600'}`}
        >
          <Icon size={14} className={color} />
          <span className={`text-xl font-bold leading-none ${color}`}>{value}</span>
          <span className={`text-2xs text-center leading-tight transition-colors
            ${isActive ? color : 'text-slate-400'}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ lang, setLang, onAdminOpen, theme, setTheme }) {
  const { t } = useLang()
  const { weekRange, source, cachedAt } = useBrief()
  const [online,      setOnline]      = useState(navigator.onLine)
  const [refreshing,  setRefreshing]  = useState(false)
  const [emailStatus, setEmailStatus] = useState(null)
  const [emailErr,    setEmailErr]    = useState('')

  useEffect(() => {
    const on  = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online',  on)
    window.addEventListener('offline', off)
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off) }
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => window.location.reload(), 400)
  }

  const handleEmail = async () => {
    if (emailStatus === 'sending') return
    setEmailStatus('sending')
    try {
      const res  = await fetch('/api/send-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? `HTTP ${res.status}`)
      setEmailStatus('ok')
      setEmailErr('')
      setTimeout(() => setEmailStatus(null), 3500)
    } catch (e) {
      setEmailErr(e.message.slice(0, 120))
      setEmailStatus('err')
      setTimeout(() => { setEmailStatus(null); setEmailErr('') }, 5000)
    }
  }

  // freshness badge
  const freshnessLabel = source === 'live'
    ? (cachedAt ? timeAgo(cachedAt, lang, t) : t.liveLabel)
    : source === 'stale' ? t.staleLabel
    : null   // static — don't show

  return (
    <header className="sticky top-0 z-30 bg-surface-base/90 backdrop-blur-xl
                       border-b border-surface-line safe-top">
      {emailErr && (
        <div className="max-w-2xl mx-auto px-4 py-1.5 text-2xs text-red-400
                        bg-red-500/10 border-b border-red-500/20 font-mono truncate">
          ✗ {emailErr}
        </div>
      )}
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ai via-tech to-fin
                          flex items-center justify-center shadow-glow-ai">
            <Globe size={14} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100 leading-tight">
              {t.appTitle}
            </div>
            <div className="text-2xs text-slate-400 font-mono leading-tight">{weekRange}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* live / freshness indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs mr-1
                          px-2 py-1 rounded-full bg-surface-card border border-surface-line
                          text-slate-300">
            <span className={`w-1.5 h-1.5 rounded-full
              ${!online           ? 'bg-red-500'
              : source === 'live' ? 'bg-emerald-400 animate-pulse-slow'
              :                     'bg-slate-500'}`} />
            {!online ? (lang === 'zh' ? '已离线' : 'Offline')
              : freshnessLabel ?? (lang === 'zh' ? '静态数据' : 'Static')}
          </div>

          {/* send email */}
          <button
            onClick={handleEmail}
            title={lang === 'zh' ? '发送简报到邮箱' : 'Email brief'}
            className={`p-2 rounded-lg border transition-all duration-200
              ${emailStatus === 'ok'      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' :
                emailStatus === 'err'     ? 'bg-red-500/20     border-red-500/40     text-red-400'     :
                emailStatus === 'sending' ? 'bg-surface-card border-surface-line text-ai animate-pulse' :
                'bg-surface-card border-surface-line text-slate-400 hover:text-white'}`}
          >
            {emailStatus === 'ok'  ? <CheckCircle size={13} /> :
             emailStatus === 'err' ? <XCircle     size={13} /> :
             <Mail size={13} />}
          </button>

          {/* theme toggle */}
          <button
            onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            title={lang === 'zh' ? (theme === 'dark' ? '切换浅色模式' : '切换深色模式') : (theme === 'dark' ? 'Light mode' : 'Dark mode')}
            className="p-2 rounded-lg bg-surface-card border border-surface-line
                       text-slate-400 hover:text-white transition-colors"
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* language toggle */}
          <button
            onClick={() => setLang(l => {
              const next = l === 'zh' ? 'en' : 'zh'
              try { localStorage.setItem(LANG_KEY, next) } catch {}
              return next
            })}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold
                       bg-surface-card border border-surface-line
                       text-slate-400 hover:text-white transition-colors"
          >
            {t.langToggle}
          </button>

          {/* refresh */}
          <button
            onClick={handleRefresh}
            title={lang === 'zh' ? '刷新页面' : 'Refresh'}
            className="p-2 rounded-lg bg-surface-card border border-surface-line
                       text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          </button>

          {/* admin */}
          <button
            onClick={onAdminOpen}
            title={lang === 'zh' ? '管理后台' : 'Admin'}
            className="p-2 rounded-lg bg-surface-card border border-surface-line
                       text-slate-400 hover:text-ai transition-colors"
          >
            <Settings size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── StaleBanner — surfaces refresh failures / very old data ──────────────────

const STALE_THRESHOLD_H = 26   // daily refresh; >26h means a cycle was missed

function StaleBanner() {
  const { lang, t } = useLang()
  const { source, cachedAt, health } = useBrief()

  if (source === 'loading' || source === 'live') {
    // 'live' but old? (e.g. cron missed, cache still <1h logic returned live) — check age
    if (source === 'live') {
      const ageH = cachedAt ? Math.floor((Date.now() - cachedAt) / 3.6e6) : 0
      if (ageH < STALE_THRESHOLD_H && health?.ok !== false) return null
    } else {
      return null
    }
  }

  const ageH = cachedAt ? Math.floor((Date.now() - cachedAt) / 3.6e6) : null
  const message =
    source === 'static'                         ? t.staleStatic
    : ageH != null                              ? t.staleAgo(ageH)
    : (health?.error ? t.staleAgo(0) : t.staleStatic)

  return (
    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/30
                    bg-amber-500/10 px-4 py-3">
      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-amber-300">{t.staleTitle}</div>
        <div className="text-xs text-amber-200/80 leading-relaxed mt-0.5">{message}</div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="shrink-0 text-2xs font-semibold px-2.5 py-1 rounded-md
                   bg-amber-500/20 border border-amber-500/40 text-amber-200
                   hover:bg-amber-500/30 transition-colors"
      >
        {t.staleRetry}
      </button>
    </div>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLang()
  const { publishedAt } = useBrief()
  return (
    <footer className="border-t border-surface-line mt-8 safe-bottom">
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 mb-1">
          <Shield size={11} />
          {t.footer}
        </div>
        <div className="text-2xs text-slate-700 font-mono">{publishedAt}</div>
        <p className="mt-3 text-2xs text-slate-700 leading-relaxed max-w-sm mx-auto">
          {t.disclaimer}
        </p>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [lang,       setLang]      = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'zh' } catch { return 'zh' }
  })
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) || 'dark' } catch { return 'dark' }
  })

  // Apply theme class to <html> and persist
  useEffect(() => {
    const html = document.documentElement
    if (theme === 'light') {
      html.classList.add('light')
    } else {
      html.classList.remove('light')
    }
    try { localStorage.setItem(THEME_KEY, theme) } catch {}
  }, [theme])

  const [activeTab,    setActiveTab]    = useState('All')
  const [activeCat,    setActiveCat]    = useState(null)    // null = all categories
  const [activeImpact, setActiveImpact] = useState(false)   // true = High impact only
  const [adminOpen,    setAdminOpen]    = useState(false)

  // ── live brief data ──────────────────────────────────────────────────────
  const [briefData,    setBriefData]    = useState(EMPTY_BRIEF)
  const [briefLoading, setBriefLoading] = useState(true)
  const isFirstLoad = useRef(true)

  const loadData = useCallback(async () => {
    // Only show full-screen loading on very first page load
    if (isFirstLoad.current) setBriefLoading(true)
    try {
      const res = await fetch('/api/brief-data')
      const raw = await res.json()
      if (!res.ok || !Array.isArray(raw.news) || raw.news.length === 0) throw new Error('empty')
      const derived = makeMeta(raw.news)   // derived.news = normalised array
      setBriefData({
        ...derived,
        synthesis:   raw.synthesis   ?? staticSynthesis,
        weekRange:   raw.weekRange   ?? staticWeekRange,
        publishedAt: raw.publishedAt ?? staticPublishedAt,
        source:      raw.source      ?? 'live',
        cachedAt:    raw.cachedAt    ?? null,
        health:      raw.health      ?? null,
      })
    } catch {
      // Only fall back to static data if we have nothing yet (first load failure)
      if (isFirstLoad.current) {
        setBriefData({ ...staticMeta, synthesis: staticSynthesis, weekRange: staticWeekRange, publishedAt: staticPublishedAt, source: 'static', cachedAt: null })
      }
    } finally {
      if (isFirstLoad.current) {
        setBriefLoading(false)
        isFirstLoad.current = false
      }
    }
  }, [])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 60 * 60 * 1000)   // silent background refresh
    return () => clearInterval(id)
  }, [loadData])

  const t = i18n[lang]

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // ── filter logic ─────────────────────────────────────────────────────────
  const applyFilters = (list) => {
    if (activeCat    !== null)  list = list.filter(n => n.category === activeCat)
    if (activeImpact)           list = list.filter(n => n.impact   === 'High')
    return list
  }
  const displayChina = useMemo(() =>
    applyFilters(briefData.chinaNews),
    [briefData.chinaNews, activeCat, activeImpact]        // eslint-disable-line
  )
  const displayOverseas = useMemo(() =>
    applyFilters(briefData.overseasNews),
    [briefData.overseasNews, activeCat, activeImpact]     // eslint-disable-line
  )
  const displayFiltered = useMemo(() => {
    const base = activeTab === 'All'
      ? briefData.news
      : briefData.news.filter(n => n.region === activeTab)
    return applyFilters(base)
  }, [briefData.news, activeTab, activeCat, activeImpact]) // eslint-disable-line

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <LangCtx.Provider value={{ lang, t }}>
        <BriefCtx.Provider value={briefData}>
          <div className="min-h-dvh flex flex-col bg-surface-base">

            <Header lang={lang} setLang={setLang} onAdminOpen={() => setAdminOpen(true)} theme={theme} setTheme={setTheme} />

            {briefLoading ? (
              /* ── Loading screen — no mockup data shown ── */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 py-24">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-ai via-tech to-fin
                                flex items-center justify-center shadow-glow-ai">
                  <Globe size={22} className="text-white animate-pulse" />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm font-medium text-slate-300">
                    {lang === 'zh' ? '正在获取实时简报…' : 'Loading live brief…'}
                  </p>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span key={i}
                        className="w-1.5 h-1.5 rounded-full bg-ai/60 animate-bounce"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* sticky filter bars */}
                <div className="sticky top-14 z-20 bg-surface-base/95 backdrop-blur-lg">
                  <div className="max-w-2xl mx-auto px-4">
                    <RegionTabBar active={activeTab} setActive={handleTabChange} />
                  </div>
                  <div className="max-w-2xl mx-auto">
                    <CatFilterBar active={activeCat} setActive={setActiveCat} />
                  </div>
                </div>

                <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-4">

                  {/* health banner — only shows when data is stale / refresh failed */}
                  <StaleBanner />

                  {/* hero */}
                  <div className="mb-5">
                    <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
                      {t.topBriefs}<br />
                      <span className="text-gradient-ai">{t.thisWeek}</span>
                    </h1>
                    <p className="text-sm text-slate-500">{t.tagline} — {briefData.weekRange}</p>
                  </div>

                  {/* stats */}
                  <div className="mb-5">
                    <StatsBar
                      activeCat={activeCat}       setActiveCat={setActiveCat}
                      activeImpact={activeImpact}  setActiveImpact={setActiveImpact}
                    />
                  </div>

                  {/* synthesis — only on All tab with no category filter */}
                  {activeTab === 'All' && activeCat === null && !activeImpact && (
                    <div className="mb-5"><SynthesisCard /></div>
                  )}

                  {/* article list */}
                  {activeTab === 'All' ? (
                    <div className="flex flex-col gap-3">
                      <SectionHeader region="china"   count={displayChina.length} />
                      {displayChina.map((item, i) => (
                        <NewsCard key={`china-${item.id}`} item={item} index={i} />
                      ))}
                      {displayChina.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">
                          {lang === 'zh' ? '该分类下暂无中国新闻' : 'No China news in this category'}
                        </p>
                      )}
                      <div className="mt-4">
                        <SectionHeader region="overseas" count={displayOverseas.length} />
                      </div>
                      {displayOverseas.map((item, i) => (
                        <NewsCard key={`overseas-${item.id}`} item={item} index={i} />
                      ))}
                      {displayOverseas.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-4">
                          {lang === 'zh' ? '该分类下暂无海外新闻' : 'No overseas news in this category'}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {displayFiltered.map((item, i) => (
                        <NewsCard key={`${activeTab}-${item.id}`} item={item} index={i} />
                      ))}
                      {displayFiltered.length === 0 && (
                        <p className="text-xs text-slate-600 text-center py-8">
                          {lang === 'zh' ? '该分类下暂无新闻' : 'No news in this category'}
                        </p>
                      )}
                    </div>
                  )}

                </main>

                <Footer />
              </>
            )}

            {adminOpen && (
              <AdminPanel onClose={() => setAdminOpen(false)} onRefresh={loadData} />
            )}

          </div>
        </BriefCtx.Provider>
      </LangCtx.Provider>
    </GoogleOAuthProvider>
  )
}
