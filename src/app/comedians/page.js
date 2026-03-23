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
    default: return 'bg-gray-300 text-gray-700'
  }
}

export default function ComediansPage() {
  const sortedComedians = [...comediansData].sort((a, b) => {
    const rankOrder = { S: 0, A: 1, B: 2, C: 3 }
    return (rankOrder[a.rank] ?? 99) - (rankOrder[b.rank] ?? 99)
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">芸人一覧</h1>
      <p className="text-gray-500 mb-8">よしもと漫才劇場で活躍する芸人たち</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sortedComedians.map((comedian) => (
          <a
            key={comedian.id}
            href={`/comedians/${comedian.id}`}
            className="card hover:border-yoshimoto-red border-2 border-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎤</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold truncate">{comedian.name}</h2>
                  <span className={`badge text-xs ${getRankBadge(comedian.rank)}`}>{comedian.rank}</span>
                </div>
                <p className="text-sm text-gray-500">
                  {comedian.members.join('・')} ／ {comedian.category}
                </p>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{comedian.description}</p>

            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mb-3">
              <span>{comedian.nscYear}</span>
              <span>{comedian.formation}年結成</span>
            </div>

            {comedian.achievements.length > 0 && (
              <div className="space-y-1">
                {comedian.achievements.slice(0, 2).map((a) => (
                  <p key={a} className="text-xs font-medium text-yoshimoto-red">🏆 {a}</p>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
