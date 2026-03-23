'use client'

import { useState } from 'react'
import ThemeSwitcher from './theme-switcher'

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
            className="fixed top-14 left-0 right-0 z-50 sm:hidden border-b animate-fade-in-up p-6"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
            }}
          >
            <nav className="space-y-1 mb-6">
              {[
                { href: '/', label: 'ホーム' },
                { href: '/events', label: '公演情報' },
                { href: '/comedians', label: '芸人一覧' },
                { href: '/nsc', label: 'NSC期別' },
                { href: '/calendar', label: 'カレンダー' },
                { href: '/theaters', label: '劇場案内' },
                { href: '/glossary', label: '用語辞典' },
                { href: '/bmti', label: 'BMTI診断', accent: true },
                { href: '/compatibility', label: '相性診断', accent: true },
              ].map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors animate-fade-in-up delay-${i + 1} ${
                    item.accent ? 'bg-gold-soft t-gold' : ''
                  }`}
                  style={!item.accent ? { color: 'rgb(var(--text-secondary))' } : {}}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="border-t pt-4 animate-fade-in-up delay-6" style={{ borderColor: 'rgb(var(--border))' }}>
              <p className="text-[10px] t-muted tracking-wider mb-3 px-1">テーマ</p>
              <ThemeSwitcher variant="inline" />
            </div>
          </div>
        </>
      )}
    </>
  )
}
