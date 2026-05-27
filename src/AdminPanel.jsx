import { useState, useEffect, useContext } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { X, Plus, Mail, Shield, LogOut, Loader2, AlertCircle } from 'lucide-react'
import { LangCtx } from './context.js'

// decode Google JWT payload (client-side, no signature check)
function decodeJWT(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(b64))
  } catch { return null }
}

export default function AdminPanel({ onClose }) {
  const { t } = useContext(LangCtx)
  const [user,       setUser]       = useState(null)
  const [isAdmin,    setIsAdmin]    = useState(false)
  const [recipients, setRecipients] = useState([])
  const [newEmail,   setNewEmail]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [msg,        setMsg]        = useState({ text: '', ok: true })
  const [credential, setCredential] = useState(null)

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const ADMIN_EMAIL      = import.meta.env.VITE_ADMIN_EMAIL

  useEffect(() => {
    if (isAdmin) fetchRecipients()
  }, [isAdmin])

  // ── Google login handler ──────────────────────────────────────────────────
  const handleGoogleSuccess = (resp) => {
    const decoded = decodeJWT(resp.credential)
    if (!decoded) return setMsg({ text: 'Failed to decode token', ok: false })
    if (ADMIN_EMAIL && decoded.email !== ADMIN_EMAIL) {
      return setMsg({ text: t.adminUnauthorized, ok: false })
    }
    setUser(decoded)
    setCredential(resp.credential)
    setIsAdmin(true)
    setMsg({ text: '', ok: true })
  }

  // ── recipient CRUD ────────────────────────────────────────────────────────
  const fetchRecipients = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/recipients')
      const data = await res.json()
      setRecipients(data.recipients ?? [])
    } catch { setMsg({ text: 'Failed to load recipients', ok: false }) }
    setLoading(false)
  }

  const addRecipient = async () => {
    const email = newEmail.trim()
    if (!email || !email.includes('@')) return
    setLoading(true)
    try {
      const res = await fetch('/api/recipients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRecipients(data.recipients)
      setNewEmail('')
      setMsg({ text: '', ok: true })
    } catch (e) { setMsg({ text: e.message, ok: false }) }
    setLoading(false)
  }

  const removeRecipient = async (email) => {
    setLoading(true)
    try {
      const res = await fetch('/api/recipients', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, credential }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setRecipients(data.recipients)
    } catch (e) { setMsg({ text: e.message, ok: false }) }
    setLoading(false)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAdmin(false)
    setCredential(null)
    setRecipients([])
    setMsg({ text: '', ok: true })
  }

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-md mx-4 bg-surface-card rounded-2xl border border-surface-line shadow-2xl">

        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-line">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-ai/15">
              <Shield size={14} className="text-ai" />
            </div>
            <span className="text-sm font-semibold text-white">{t.adminPanel}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/8 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5">
          {!GOOGLE_CLIENT_ID ? (
            /* ── not configured ── */
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <AlertCircle size={32} className="text-amber-400" />
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{t.adminNotConfigured}</p>
            </div>

          ) : !isAdmin ? (
            /* ── login view ── */
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-xl bg-ai/10 border border-ai/20
                              flex items-center justify-center">
                <Shield size={22} className="text-ai" />
              </div>
              <p className="text-xs text-slate-400 text-center">{t.adminLogin}</p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setMsg({ text: 'Google login failed', ok: false })}
                  theme="filled_black"
                  shape="pill"
                  size="medium"
                />
              </div>
              {msg.text && (
                <p className="text-xs text-red-400 text-center">{msg.text}</p>
              )}
            </div>

          ) : (
            /* ── admin view ── */
            <div className="space-y-4">

              {/* user info row */}
              <div className="flex items-center justify-between py-2 px-3 rounded-lg
                              bg-surface-raise border border-surface-line">
                <div className="flex items-center gap-2.5">
                  {user.picture
                    ? <img src={user.picture} alt="" className="w-7 h-7 rounded-full" />
                    : <div className="w-7 h-7 rounded-full bg-ai/20 flex items-center justify-center">
                        <Shield size={12} className="text-ai" />
                      </div>
                  }
                  <div>
                    <p className="text-xs font-medium text-white leading-tight">{user.name}</p>
                    <p className="text-2xs text-slate-500 leading-tight">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-2xs text-slate-500
                             hover:text-slate-300 transition-colors"
                >
                  <LogOut size={11} />
                  {t.adminLogout}
                </button>
              </div>

              {/* recipients */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Mail size={13} className="text-fin" />
                  <span className="text-xs font-semibold text-slate-200">{t.adminRecipients}</span>
                  <span className="text-2xs text-slate-600 ml-auto">
                    {loading ? <Loader2 size={11} className="animate-spin" /> : `${recipients.length}`}
                  </span>
                </div>

                {/* list */}
                <div className="space-y-1.5 mb-3 max-h-52 overflow-y-auto">
                  {recipients.map(email => (
                    <div key={email}
                      className="flex items-center justify-between px-3 py-2
                                 rounded-lg bg-surface-raise border border-surface-line">
                      <span className="text-xs text-slate-300 font-mono truncate">{email}</span>
                      <button
                        onClick={() => removeRecipient(email)}
                        disabled={loading}
                        className="ml-2 p-1 rounded hover:bg-red-500/20 text-slate-600
                                   hover:text-red-400 transition-colors shrink-0 disabled:opacity-40"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                  {recipients.length === 0 && !loading && (
                    <p className="text-xs text-slate-600 text-center py-3">
                      — 暂无收件人 —
                    </p>
                  )}
                </div>

                {/* add email */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addRecipient()}
                    placeholder={t.adminAddPlaceholder}
                    className="flex-1 px-3 py-2 rounded-lg bg-surface-raise border border-surface-line
                               text-xs text-white placeholder:text-slate-600 focus:outline-none
                               focus:border-ai/50 transition-colors"
                  />
                  <button
                    onClick={addRecipient}
                    disabled={loading || !newEmail}
                    className="px-3 py-2 rounded-lg bg-ai/15 border border-ai/30 text-ai
                               hover:bg-ai/25 transition-colors disabled:opacity-40"
                  >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                  </button>
                </div>

                {msg.text && (
                  <p className={`text-2xs mt-2 ${msg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                    {msg.text}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
