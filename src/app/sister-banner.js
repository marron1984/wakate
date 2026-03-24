'use client'

import { useState, useEffect } from 'react'

export default function SisterBanner() {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    setDismissed(sessionStorage.getItem('sister-banner-dismissed') === '1')
  }, [])

  const dismiss = () => {
    sessionStorage.setItem('sister-banner-dismissed', '1')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="fixed top-14 w-full z-40 animate-fade-in" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
      <div className="bg-sub-soft">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between gap-3">
          <a
            href="https://geinin.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs sm:text-sm hover:opacity-80 transition-opacity min-w-0"
          >
            <span className="t-sub font-bold shrink-0">NEW</span>
            <span className="t-secondary truncate">
              姉妹サイト <span className="font-bold" style={{ color: 'rgb(var(--text))' }}>GEININ.Fun</span> — 芸人総合情報サイトがオープン
            </span>
            <span className="t-sub text-xs shrink-0">→</span>
          </a>
          <button
            onClick={dismiss}
            className="t-muted hover:text-[rgb(var(--text))] transition-colors text-sm shrink-0 px-1"
            aria-label="閉じる"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
