import comediansData from '../../data/comedians.json'

export const metadata = {
  title: '芸人一覧 - ワカテNEWS',
}

function getRankBadge(rank) {
  switch (rank) {
    case 'S': return 'bg-yoshimoto-gold text-white'
    case 'A': return 'bg-yoshimoto-red text-white'
    case 'B': return 'bg-blue-500 text-white'
    case 'C': return 'bg-green-500 text-white'
    case 'D': return 'bg-emerald-500 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

function getRankLabel(rank) {
  switch (rank) {
    case 'S': return 'レジェンド'
    case 'A': return '看板'
    case 'B': return '中堅'
    case 'C': return '若手'
    case 'D': return '超若手'
    default: return ''
  }
}

export default function ComediansPage() {
  const rankOrder = { S: 0, A: 1, B: 2, C: 3, D: 4 }
  const sortedComedians = [...comediansData].sort(
    (a, b) => (rankOrder[a.rank] ?? 99) - (rankOrder[b.rank] ?? 99)
  )

  const ranks = ['S', 'A', 'B', 'C', 'D']
  const comediansByRank = ranks.reduce((acc, rank) => {
    acc[rank] = sortedComedians.filter(c => c.rank === rank)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">芸人一覧</h1>
      <p className="text-gray-500 mb-4">よしもと漫才劇場で活躍する芸人たち（全{comediansData.length}組）</p>

      {/* ランク凡例 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {ranks.map((rank) => (
          <a
            key={rank}
            href={`#rank-${rank}`}
            className={`badge text-xs ${getRankBadge(rank)} hover:opacity-80 transition-opacity`}
          >
            {rank}・{getRankLabel(rank)}（{comediansByRank[rank].length}組）
          </a>
        ))}
      </div>

      {ranks.map((rank) => {
        const comedians = comediansByRank[rank]
        if (comedians.length === 0) return null

        return (
          <section key={rank} id={`rank-${rank}`} className="mb-10">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className={`badge ${getRankBadge(rank)}`}>{rank}</span>
              <span>{getRankLabel(rank)}</span>
              <span className="text-sm font-normal text-gray-400">（{comedians.length}組）</span>
            </h2>

            <div className={`grid gap-4 ${rank === 'D' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
              {comedians.map((comedian) => (
                <a
                  key={comedian.id}
                  href={`/comedians/${comedian.id}`}
                  className={`card hover:border-2 border-2 border-transparent ${
                    rank === 'D' ? 'hover:border-emerald-400' : 'hover:border-yoshimoto-red'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{comedian.category === 'ピン芸人' ? '🎙️' : comedian.category.includes('コント') ? '🎬' : '🎤'}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold truncate ${rank === 'D' ? 'text-base' : 'text-xl'}`}>{comedian.name}</h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {comedian.members.join('・')} ／ {comedian.category}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{comedian.description}</p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-2">
                    <span>{comedian.nscYear}</span>
                    <span>{comedian.formation}年結成</span>
                  </div>

                  {comedian.achievements.length > 0 && (
                    <div className="space-y-1">
                      {comedian.achievements.slice(0, rank === 'D' ? 1 : 2).map((a) => (
                        <p key={a} className="text-xs font-medium text-yoshimoto-red">🏆 {a}</p>
                      ))}
                    </div>
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
