import { useState, useMemo, createContext, useContext, useCallback } from 'react'
import {
  Brain, Cpu, TrendingUp, Flame, ChevronDown, ChevronUp,
  Calendar, RefreshCw, Zap, Globe, BarChart2, Shield,
  Star, ArrowUpRight, AlertTriangle,
} from 'lucide-react'
import { news, synthesis, weekRange, publishedAt, categoryMeta } from './data.js'
import { i18n, LANG_KEY } from './i18n.js'

// ─── lang context ─────────────────────────────────────────────────────────────

const LangCtx = createContext({ lang: 'zh', t: i18n.zh })
const useLang = () => useContext(LangCtx)

// ─── constants ────────────────────────────────────────────────────────────────

const CAT = {
  AI:         { pill: 'pill-ai',   text: 'text-ai',   stripe: 'stripe-ai',   Icon: Brain,      panel: 'panel-ai'   },
  Technology: { pill: 'pill-tech', text: 'text-tech', stripe: 'stripe-tech', Icon: Cpu,        panel: 'panel-tech' },
  Finance:    { pill: 'pill-fin',  text: 'text-fin',  stripe: 'stripe-fin',  Icon: TrendingUp, panel: 'panel-fin'  },
}
const IMPACT_CLS = { High: 'impact-high', Medium: 'impact-medium', Low: 'impact-low' }

// tab definitions — keys must match category values in data.js
const TAB_DEFS = [
  { key: 'All',        Icon: Star        },
  { key: 'AI',         Icon: Brain       },
  { key: 'Technology', Icon: Cpu         },
  { key: 'Finance',    Icon: TrendingUp  },
]

// ─── helpers ──────────────────────────────────────────────────────────────────

// resolve bilingual field: { en, zh } → string
const tx = (field, lang) =>
  field && typeof field === 'object' ? (field[lang] ?? field.en) : field

// ─── atoms ────────────────────────────────────────────────────────────────────

function CategoryPill({ category }) {
  const { lang, t } = useLang()
  const { pill, Icon } = CAT[category]
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

// ─── TabBar ───────────────────────────────────────────────────────────────────

const TAB_ACTIVE = {
  All:        'border-slate-300  text-white',
  AI:         'border-ai         text-ai',
  Technology: 'border-tech       text-tech',
  Finance:    'border-fin        text-fin',
}
const TAB_LINE = {
  All:        'bg-slate-300',
  AI:         'bg-ai',
  Technology: 'bg-tech',
  Finance:    'bg-fin',
}

function TabBar({ active, setActive }) {
  const { t } = useLang()
  const counts = {
    All:        news.length,
    AI:         categoryMeta.AI.count,
    Technology: categoryMeta.Technology.count,
    Finance:    categoryMeta.Finance.count,
  }
  return (
    <div className="border-b border-surface-line">
      <div className="flex overflow-x-auto no-scrollbar">
        {TAB_DEFS.map(({ key, Icon }) => {
          const isActive = active === key
          const colorCls = TAB_ACTIVE[key]
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-medium
                          whitespace-nowrap shrink-0 transition-colors duration-150
                          ${isActive ? colorCls.split(' ')[1] : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon size={13} />
              {t.tabs[key]}
              <span className={`ml-0.5 text-2xs px-1.5 py-px rounded-full
                ${isActive ? 'bg-white/15' : 'bg-white/6 text-slate-600'}`}>
                {counts[key]}
              </span>
              {isActive && (
                <span className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-t-full ${TAB_LINE[key]}`} />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── NewsCard ─────────────────────────────────────────────────────────────────

function NewsCard({ item, index }) {
  const { lang, t } = useLang()
  const [expanded, setExpanded] = useState(false)
  const { stripe, text, panel } = CAT[item.category]

  return (
    <article
      className="card overflow-hidden cursor-pointer group animate-slide-up"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both', opacity: 0 }}
      onClick={() => setExpanded(e => !e)}
    >
      <div className="flex">
        {/* accent stripe */}
        <div className={`w-1 shrink-0 ${stripe}`} />

        <div className="flex-1 min-w-0">
          {/* header */}
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-mono font-bold text-xl tabular-nums leading-none
                  ${item.rank <= 3 ? 'text-gold' : 'text-slate-500'}`}>
                  #{item.rank}
                </span>
                <CategoryPill category={item.category} />
                <ImpactPill impact={item.impact} />
              </div>
              <span className="flex items-center gap-1 text-2xs text-slate-600 shrink-0">
                <Calendar size={10} />
                {item.date}
              </span>
            </div>

            <h3 className="text-base font-semibold text-slate-100 leading-snug mb-2
                           group-hover:text-white transition-colors">
              {tx(item.title, lang)}
            </h3>

            <p className="text-sm text-slate-400 leading-relaxed">
              {tx(item.summary, lang)}
            </p>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map(tag => (
                <span key={tag} className="text-2xs px-2 py-0.5 rounded-md
                  bg-surface-raise border border-surface-line text-slate-500">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* expanded panel */}
          <div className={`overflow-hidden transition-all duration-300
            ${expanded ? 'max-h-[600px]' : 'max-h-0'}`}>
            <div className={`mx-4 mb-4 p-3.5 rounded-lg ${panel}`}>
              <div className={`flex items-center gap-1.5 text-xs font-semibold mb-2 ${text}`}>
                <ArrowUpRight size={12} />
                {t.whyItMatters}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                {tx(item.whyItMatters, lang)}
              </p>
              <div className="mt-2.5 pt-2.5 border-t border-white/8
                              flex flex-wrap items-center gap-1.5 text-2xs text-slate-600">
                <span>{t.sources}</span>
                {item.sources.map((src, i) => (
                  <span key={src} className="text-slate-500">
                    {src}{i < item.sources.length - 1 ? ' ·' : ''}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* toggle footer */}
          <div className={`flex items-center justify-center gap-1 py-2 border-t border-surface-line
                           text-2xs font-medium ${text} opacity-60`}>
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
  const [open, setOpen] = useState(false)
  return (
    <section
      className="rounded-xl border border-gold/25 bg-surface-card shadow-glow-gold
                 overflow-hidden cursor-pointer"
      onClick={() => setOpen(o => !o)}
    >
      {/* label bar */}
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
          {synthesis.sectors.map(s => <CategoryPill key={s} category={s} />)}
          <span className="text-gold/40 ml-1">
            {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </span>
        </div>
      </div>

      {/* body */}
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

function StatsBar() {
  const { t } = useLang()
  const stats = [
    { label: t.tabs.AI,         value: categoryMeta.AI.count,         color: 'text-ai',     Icon: Brain        },
    { label: t.tabs.Technology, value: categoryMeta.Technology.count,  color: 'text-tech',   Icon: Cpu          },
    { label: t.tabs.Finance,    value: categoryMeta.Finance.count,     color: 'text-fin',    Icon: TrendingUp   },
    { label: t.highImpact,      value: news.filter(n => n.impact === 'High').length,
                                                                        color: 'text-red-400', Icon: AlertTriangle },
  ]
  return (
    <div className="grid grid-cols-4 gap-2">
      {stats.map(({ label, value, color, Icon }) => (
        <div key={label}
          className="flex flex-col items-center gap-1.5 py-3 px-2
                     rounded-xl bg-surface-card border border-surface-line">
          <Icon size={14} className={color} />
          <span className={`text-xl font-bold leading-none ${color}`}>{value}</span>
          <span className="text-2xs text-slate-600 text-center leading-tight">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header({ lang, setLang }) {
  const { t } = useLang()
  return (
    <header className="sticky top-0 z-30 bg-surface-base/90 backdrop-blur-xl
                       border-b border-surface-line safe-top">
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
            <div className="text-2xs text-slate-600 font-mono leading-tight">{weekRange}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
            {t.live}
          </div>
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
          <button className="p-2 rounded-lg bg-surface-card border border-surface-line
                             text-slate-500 hover:text-slate-300 transition-colors">
            <RefreshCw size={13} />
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  const { t } = useLang()
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
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem(LANG_KEY) || 'zh' } catch { return 'zh' }
  })
  const [activeTab, setActiveTab] = useState('All')

  const t = i18n[lang]

  // switch tab AND scroll back to top so filtered content is visible
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const filtered = useMemo(
    () => activeTab === 'All' ? news : news.filter(n => n.category === activeTab),
    [activeTab]
  )

  return (
    <LangCtx.Provider value={{ lang, t }}>
      <div className="min-h-dvh flex flex-col bg-surface-base">

        <Header lang={lang} setLang={setLang} />

        {/* sticky tab bar */}
        <div className="sticky top-14 z-20 bg-surface-base/95 backdrop-blur-lg
                        border-b border-surface-line">
          <div className="max-w-2xl mx-auto px-4">
            <TabBar active={activeTab} setActive={handleTabChange} />
          </div>
        </div>

        <main className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 pb-4">

          {/* hero */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-white leading-tight mb-1">
              {t.topBriefs}<br />
              <span className="text-gradient-ai">{t.thisWeek}</span>
            </h1>
            <p className="text-sm text-slate-500">{t.tagline} — {weekRange}</p>
          </div>

          {/* stats */}
          <div className="mb-5"><StatsBar /></div>

          {/* synthesis — only on All tab */}
          {activeTab === 'All' && (
            <div className="mb-5"><SynthesisCard /></div>
          )}

          {/* category section label when filtered */}
          {activeTab !== 'All' && (
            <div className="flex items-center gap-2 mb-4">
              {(() => {
                const { Icon, text } = CAT[activeTab]
                return (
                  <>
                    <Icon size={14} className={text} />
                    <span className={`text-sm font-semibold ${text}`}>
                      {t.catLabel[activeTab]} · {filtered.length} {t.stories}
                    </span>
                  </>
                )
              })()}
            </div>
          )}

          {/* article list */}
          <div className="flex flex-col gap-3">
            {filtered.map((item, i) => (
              <NewsCard key={`${activeTab}-${item.id}`} item={item} index={i} />
            ))}
          </div>

        </main>

        <Footer />
      </div>
    </LangCtx.Provider>
  )
}
