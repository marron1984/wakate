'use client'

import { useState } from 'react'
import { useTheme, THEMES } from './theme-provider'

export default function ThemeSwitcher({ variant = 'icon' }) {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const current = THEMES.find(t => t.id === theme)

  // Inline variant — grid of color dots (for mobile menu)
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-2">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center text-base transition-all duration-200 ${
              theme === t.id ? 'ring-2 scale-110' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: 'rgb(var(--text) / 0.05)',
              ringColor: theme === t.id ? 'rgb(var(--accent))' : undefined,
            }}
            aria-label={t.label}
          >
            {t.icon}
          </button>
        ))}
      </div>
    )
  }

  // Icon variant — dropdown (for desktop)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{ backgroundColor: 'rgb(var(--text) / 0.05)' }}
        aria-label="テーマを変更"
      >
        <span className="text-sm">{current?.icon || '🌑'}</span>
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
                  theme === t.id ? 't-accent font-semibold' : ''
                }`}
                style={{ color: theme !== t.id ? 'rgb(var(--text-secondary))' : undefined }}
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
