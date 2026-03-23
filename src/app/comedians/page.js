import comediansData from '../../data/comedians.json'

export const metadata = { title: '芸人一覧 — WAKATE' }

function getRankStyle(rank) {
  switch (rank) {
    case 'S': return { badge: 'bg-gold/10 text-gold', hover: 'hover:border-gold/40' }
    case 'A': return { badge: 'bg-accent/10 text-accent', hover: 'hover:border-accent/40' }
    case 'B': return { badge: 'bg-blue-500/10 text-blue-400', hover: 'hover:border-blue-500/40' }
    case 'C': return { badge: 'bg-purple-500/10 text-purple-400', hover: 'hover:border-purple-500/40' }
    case 'D': return { badge: 'bg-mint/10 text-mint', hover: 'hover:border-mint/40' }
    default: return { badge: 'bg-white/5 text-muted', hover: 'hover:border-border-hover' }
  }
}

function getRankLabel(r) {
  return { S: 'Legend', A: 'Top', B: 'Middle', C: 'Rising', D: 'Rookie' }[r] || ''
}

export default function ComediansPage() {
  const ranks = ['S', 'A', 'B', 'C', 'D']
  const byRank = ranks.reduce((a, r) => { a[r] = comediansData.filter(c => c.rank === r); return a }, {})

  return (
    <div>
      <p className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Comedians</p>
      <h1 className="text-3xl font-black tracking-tight mb-2">芸人一覧</h1>
      <p className="text-sm text-muted mb-4">{comediansData.length} acts at よしもと漫才劇場</p>

      <div className="flex flex-wrap gap-1.5 mb-10">
        {ranks.map((r) => (
          <a key={r} href={`#rank-${r}`} className={`badge ${getRankStyle(r).badge}`}>
            {r} · {getRankLabel(r)}（{byRank[r].length}）
          </a>
        ))}
      </div>

      {ranks.map((rank) => {
        const list = byRank[rank]
        if (!list.length) return null
        const style = getRankStyle(rank)
        return (
          <section key={rank} id={`rank-${rank}`} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <span className={`badge ${style.badge}`}>{rank}</span>
              <span className="font-bold text-sm">{getRankLabel(rank)}</span>
              <span className="text-xs text-muted">{list.length} acts</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className={`grid gap-3 ${rank === 'D' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {list.map((c) => (
                <a key={c.id} href={`/comedians/${c.id}`} className={`card group ${style.hover}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-bold group-hover:text-accent transition-colors ${rank === 'D' ? 'text-sm' : 'text-base'}`}>{c.name}</h3>
                    <span className="tag">{c.category}</span>
                  </div>
                  <p className="text-xs text-muted mb-2">{c.members.join(' / ')}</p>
                  <p className="text-xs text-muted/70 mb-2 line-clamp-2">{c.description}</p>
                  <div className="flex flex-wrap gap-2 text-[11px] text-muted">
                    <span>{c.nscYear}</span>
                    <span>{c.formation}年〜</span>
                  </div>
                  {c.achievements[0] && (
                    <p className="text-[11px] text-accent mt-2">{c.achievements[0]}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
