'use client'

import { useState } from 'react'
import ThemeSwitcher from './theme-switcher'

const navGroups = [
  {
    label: null,
    items: [
      { href: '/', label: 'ホーム' },
    ],
  },
  {
    label: '公演',
    items: [
      { href: '/events', label: '公演情報' },
      { href: '/calendar', label: 'カレンダー' },
      { href: '/theaters', label: '劇場案内' },
    ],
  },
  {
    label: '芸人',
    items: [
      { href: '/comedians', label: '芸人一覧' },
      { href: '/nsc', label: 'NSC期別' },
      { href: '/interviews', label: 'インタビュー' },
    ],
  },
  {
    label: 'コンテンツ',
    items: [
      { href: '/glossary', label: '用語辞典' },
      { href: '/bmti', label: 'BMTI診断', accent: true },
      { href: '/compatibility', label: '相性診断', accent: true },
    ],
  },
]

export default function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(!open)}
        className="sm:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
        aria-label="メニュー"
      >
        <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${open ? 'rotate-45 translate-y-[4px]' : ''}`} style={{ backgroundColor: 'rgb(var(--text))' }} />
        <span className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${open ? '-rotate-45 -translate-y-[4px]' : ''}`} style={{ backgroundColor: 'rgb(var(--text))' }} />
      </button>

      {/* Mobile menu overlay */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm sm:hidden animate-fade-in" onClick={() => setOpen(false)} />
          <div
            className="fixed top-14 left-0 right-0 z-50 sm:hidden border-b animate-fade-in-up p-6 max-h-[calc(100vh-3.5rem)] overflow-y-auto"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
            }}
          >
            <nav className="space-y-4 mb-6">
              {navGroups.map((group, gi) => (
                <div key={gi}>
                  {group.label && (
                    <p className="text-[10px] font-bold t-accent uppercase tracking-wider px-4 mb-1">{group.label}</p>
                  )}
                  <div className="space-y-0.5">
                    {group.items.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          item.accent ? 'bg-gold-soft t-gold' : ''
                        }`}
                        style={!item.accent ? { color: 'rgb(var(--text-secondary))' } : {}}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t pt-4" style={{ borderColor: 'rgb(var(--border))' }}>
              <p className="text-[10px] t-muted tracking-wider mb-3 px-1">テーマ</p>
              <ThemeSwitcher variant="inline" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
