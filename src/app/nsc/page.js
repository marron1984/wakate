import comediansData from '../../data/comedians.json'

export const metadata = { title: 'NSC期別一覧 — WAKATE.Fun' }

function getRankStyle(r) {
  switch (r) {
    case 'S': return 'bg-gold-soft t-gold'
    case 'A': return 'bg-accent-soft t-accent'
    case 'B': return 'bg-blue-500/10 text-blue-400'
    case 'C': return 'bg-purple-500/10 text-purple-400'
    case 'D': return 'bg-mint-soft t-mint'
    default: return 'tag'
  }
}

/** "NSC大阪44期" → { school: "大阪", num: 44 } */
function parseNsc(str) {
  const m = str.match(/NSC\s*(大阪|東京)\s*(\d+)期/)
  if (!m) return null
  return { school: m[1], num: Number(m[2]) }
}

export default function NscPage() {
  // 期ごとにグループ化
  const groups = {}
  for (const c of comediansData) {
    const nsc = parseNsc(c.nscYear)
    if (!nsc) continue
    const key = `${nsc.school}-${nsc.num}`
    if (!groups[key]) groups[key] = { school: nsc.school, num: nsc.num, comedians: [] }
    groups[key].comedians.push(c)
  }

  // 期の新しい順 → 同期なら大阪→東京
  const sorted = Object.values(groups).sort((a, b) => {
    if (b.num !== a.num) return b.num - a.num
    return a.school === '大阪' ? -1 : 1
  })

  // 統計
  const totalGenerations = sorted.length
  const newestGen = sorted[0]
  const oldestGen = sorted[sorted.length - 1]

  return (
    <div>
      {/* ヘッダー */}
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">NSC Generations</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">NSC期別一覧</h1>
        <p className="text-sm t-muted mb-6">
          よしもと漫才劇場の芸人を NSC（吉本総合芸能学院）の期別に一覧表示
        </p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10 animate-fade-in delay-2">
        <div className="card text-center">
          <p className="text-2xl font-black t-accent">{comediansData.length}</p>
          <p className="text-[11px] t-muted mt-1">総組数</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-black t-accent">{totalGenerations}</p>
          <p className="text-[11px] t-muted mt-1">期数</p>
        </div>
        <div className="card text-center">
          <p className="text-lg font-black">{newestGen.num}期</p>
          <p className="text-[11px] t-muted mt-1">最新期（{newestGen.school}）</p>
        </div>
        <div className="card text-center">
          <p className="text-lg font-black">{oldestGen.num}期</p>
          <p className="text-[11px] t-muted mt-1">最古参（{oldestGen.school}）</p>
        </div>
      </div>

      {/* 期ナビゲーション */}
      <div className="flex flex-wrap gap-1.5 mb-10 animate-fade-in delay-3">
        {sorted.map(g => (
          <a
            key={`${g.school}-${g.num}`}
            href={`#nsc-${g.school}-${g.num}`}
            className="badge tag hover:bg-surface-hover transition-colors"
          >
            {g.school}{g.num}期
            <span className="t-muted ml-1">({g.comedians.length})</span>
          </a>
        ))}
      </div>

      {/* 期別リスト */}
      {sorted.map((group, gi) => (
        <section
          key={`${group.school}-${group.num}`}
          id={`nsc-${group.school}-${group.num}`}
          className="mb-12"
        >
          <div className={`flex items-center gap-3 mb-5 animate-slide-in-left delay-${Math.min(gi + 1, 8)}`}>
            <span className="badge bg-accent-soft t-accent font-bold">
              NSC{group.school} {group.num}期
            </span>
            <span className="text-xs t-muted">{group.comedians.length}組</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'rgb(var(--border))' }} />
          </div>

          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {group.comedians.map((c, i) => (
              <a
                key={c.id}
                href={`/comedians/${c.id}`}
                className={`card group hover:border-accent-soft animate-fade-in-up delay-${Math.min(i + 1, 8)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm group-hover:t-accent transition-colors">{c.name}</h3>
                  <div className="flex gap-1.5">
                    <span className={`badge text-[10px] ${getRankStyle(c.rank)}`}>{c.rank}</span>
                    <span className="tag text-[10px]">{c.category}</span>
                  </div>
                </div>
                <p className="text-xs t-muted mb-2">{c.members.join(' / ')}</p>
                <p className="text-xs t-secondary line-clamp-2" style={{ opacity: 0.6 }}>{c.description}</p>
                {c.achievements[0] && (
                  <p className="text-[11px] t-accent mt-2 truncate">{c.achievements[0]}</p>
                )}
                <p className="text-[11px] t-muted mt-2">{c.formation}年結成</p>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
