'use client'

import { useState } from 'react'
import glossaryData from '../../data/glossary.json'

const categories = [...new Set(glossaryData.map(g => g.category))]

function getCategoryStyle(cat) {
  switch (cat) {
    case '基本': return 'bg-accent-soft t-accent'
    case '技術': return 'bg-gold-soft t-gold'
    case 'スタイル': return 'bg-purple-500/10 text-purple-400'
    case '形式': return 'bg-blue-500/10 text-blue-400'
    case '賞レース': return 'bg-mint-soft t-mint'
    case '文化': return 'bg-orange-400/10 text-orange-400'
    case '劇場': return 'bg-accent-soft t-accent'
    default: return 'tag'
  }
}

export default function GlossaryPage() {
  const [filter, setFilter] = useState('すべて')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)

  const filtered = glossaryData.filter(g => {
    if (filter !== 'すべて' && g.category !== filter) return false
    if (search) {
      const s = search.toLowerCase()
      return g.term.toLowerCase().includes(s) || g.reading.includes(s) || g.description.includes(s)
    }
    return true
  })

  function getRelated(ids) {
    return ids.map(id => glossaryData.find(g => g.id === id)).filter(Boolean)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Glossary</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">漫才用語辞典</h1>
        <p className="text-sm t-muted mb-8">漫才劇場をもっと楽しむための用語集</p>
      </div>

      {/* Search */}
      <div className="mb-4 animate-fade-in delay-1">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="用語を検索…"
          className="w-full subtle-bg border border-transparent focus:border-accent-soft rounded-xl px-4 py-3 text-sm outline-none transition-colors"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in delay-1">
        {['すべて', ...categories].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              filter === cat ? 'bg-accent t-on-accent' : 'tag hover:bg-accent-soft hover:t-accent'
            }`}
          >
            {cat}
            {cat !== 'すべて' && (
              <span className="ml-1 opacity-60">{glossaryData.filter(g => g.category === cat).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-xs t-muted mb-4">{filtered.length}件の用語</p>

      {/* Terms */}
      <div className="space-y-2">
        {filtered.map((g, i) => {
          const isOpen = expanded === g.id
          const related = getRelated(g.related || [])

          return (
            <div
              key={g.id}
              className={`card transition-all animate-fade-in-up delay-${Math.min(i + 1, 5)}`}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : g.id)}
                className="w-full text-left p-5 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-black text-base tracking-tight">{g.term}</h3>
                    <span className="text-xs t-muted">({g.reading})</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getCategoryStyle(g.category)}`}>{g.category}</span>
                  </div>
                  {!isOpen && (
                    <p className="text-sm t-muted truncate">{g.description}</p>
                  )}
                </div>
                <span className="t-muted text-sm transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : '' }}>▼</span>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 animate-fade-in">
                  <p className="text-sm t-secondary leading-relaxed mb-4">{g.description}</p>
                  {related.length > 0 && (
                    <div>
                      <p className="text-[10px] t-muted uppercase tracking-wider mb-2">関連用語</p>
                      <div className="flex flex-wrap gap-1.5">
                        {related.map(r => (
                          <button
                            key={r.id}
                            onClick={(e) => { e.stopPropagation(); setExpanded(r.id); setFilter('すべて'); setSearch('') }}
                            className="tag text-[11px] hover:bg-accent-soft hover:t-accent transition-colors cursor-pointer"
                          >
                            {r.term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card p-10 text-center">
          <p className="t-muted text-sm">該当する用語が見つかりません</p>
        </div>
      )}
    </div>
  )
}
