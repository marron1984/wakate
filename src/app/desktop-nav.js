'use client'

import { useState, useRef, useEffect } from 'react'
import ThemeSwitcher from './theme-switcher'

const moreItems = [
  { href: '/nsc', label: 'NSC期別' },
  { href: '/calendar', label: 'カレンダー' },
  { href: '/theaters', label: '劇場案内' },
  { href: '/glossary', label: '用語辞典' },
]

export default function DesktopNav() {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="hidden sm:flex items-center gap-1">
      <a href="/" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">ホーム</a>
      <a href="/events" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">公演情報</a>
      <a href="/comedians" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">芸人一覧</a>
      <a href="/interviews" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">インタビュー</a>

      {/* More dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover flex items-center gap-1"
        >
          その他
          <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M2 4 L5 7 L8 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
        {open && (
          <div
            className="absolute top-full right-0 mt-2 w-44 rounded-lg border shadow-lg py-1 animate-fade-in z-50"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
            }}
          >
            {moreItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm hover:bg-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <a href="/bmti" className="bg-accent-soft t-accent hover:opacity-80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">BMTI</a>
      <a href="/compatibility" className="bg-gold-soft t-gold hover:opacity-80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">相性診断</a>
      <div className="ml-2">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
