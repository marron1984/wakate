'use client'

import { useState, useRef, useEffect } from 'react'
import ThemeSwitcher from './theme-switcher'

const moreItems = [
  { href: '/nsc', label: 'NSC期別' },
  { href: '/calendar', label: 'カレンダー' },
  { href: '/theaters', label: '劇場案内' },
  { href: '/glossary', label: '用語辞典' },
  { href: '/sns', label: 'SNSまとめ' },
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
    <div className="hidden sm:flex items-center gap-0.5 text-[13px]">
      <a href="/" className="px-2.5 py-1.5 t-muted hover:text-[rgb(var(--text))] transition-colors">ホーム</a>
      <a href="/events" className="px-2.5 py-1.5 t-muted hover:text-[rgb(var(--text))] transition-colors">公演情報</a>
      <a href="/comedians" className="px-2.5 py-1.5 t-muted hover:text-[rgb(var(--text))] transition-colors">芸人一覧</a>
      <a href="/interviews" className="px-2.5 py-1.5 t-muted hover:text-[rgb(var(--text))] transition-colors">インタビュー</a>

      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="px-2.5 py-1.5 t-muted hover:text-[rgb(var(--text))] transition-colors flex items-center gap-0.5"
        >
          その他
          <svg width="8" height="8" viewBox="0 0 8 8" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
            <path d="M1.5 3 L4 5.5 L6.5 3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
        {open && (
          <div
            className="absolute top-full right-0 mt-1 w-36 rounded border shadow-lg py-1 animate-fade-in z-50"
            style={{
              backgroundColor: 'rgb(var(--surface))',
              borderColor: 'rgb(var(--border))',
            }}
          >
            {moreItems.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-1.5 text-[13px] t-muted hover:text-[rgb(var(--text))] hover:bg-surface-hover transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

      <span className="mx-1 text-[rgb(var(--border))]">|</span>
      <a href="/bmti" className="px-2 py-1 t-accent text-[12px] font-bold hover:opacity-80 transition-opacity">BMTI</a>
      <a href="/compatibility" className="px-2 py-1 t-sub text-[12px] font-bold hover:opacity-80 transition-opacity">相性診断</a>
      <div className="ml-1.5">
        <ThemeSwitcher />
      </div>
    </div>
  )
}
