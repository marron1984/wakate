'use client'

import { useMemo } from 'react'

export default function NewsTicker({ news }) {
  const items = useMemo(() => news.slice(0, 8), [news])

  if (items.length === 0) return null

  const track = items.map(n => (
    `${n.category ? `【${n.category}】` : ''}${n.title}`
  )).join('\u3000\u3000／\u3000\u3000')

  return (
    <div className="mb-6 overflow-hidden animate-fade-in" style={{ borderBottom: '1px solid rgb(var(--border))' }}>
      <div className="flex items-center">
        <span className="shrink-0 text-[10px] font-bold px-2.5 py-1.5" style={{ background: 'rgb(var(--accent))', color: '#fff' }}>
          NEWS
        </span>
        <div className="overflow-hidden flex-1 py-1.5">
          <div className="ticker-track">
            <span className="text-xs t-secondary whitespace-nowrap">
              {track}
              {'\u3000\u3000／\u3000\u3000'}
              {track}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
