import { createContext } from 'react'
import { i18n } from './i18n.js'

// Shared language context — imported by both App.jsx and AdminPanel.jsx
// Kept in a separate file to avoid circular import issues
export const LangCtx = createContext({ lang: 'zh', t: i18n.zh })
