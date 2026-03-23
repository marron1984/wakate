'use client'

import { useState } from 'react'
import { useTheme, THEMES } from './theme-provider'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: 'rgb(var(--text) / 0.05)' }}
        aria-label="テーマを変更"
      >
        <span className="text-sm">{THEMES.find(t => t.id === theme)?.icon || '🌑'}</span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl p-1.5 border animate-scale-in shadow-2xl min-w-[160px]"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
            }}
          >
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false) }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-all duration-150 ${
                  theme === t.id ? 't-accent font-semibold' : 'btn-ghost'
                }`}
                style={theme !== t.id ? { color: 'rgb(var(--text-secondary))' } : {}}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgb(var(--text) / 0.05)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent' }}
              >
                <span className="text-base">{t.icon}</span>
                <span>{t.label}</span>
                {theme === t.id && <span className="ml-auto text-[10px]">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
