import comediansData from '../../data/comedians.json'

export const metadata = {
  title: '芸人一覧 - ワカテNEWS',
}

export default function ComediansPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">芸人一覧</h1>
      <p className="text-gray-500 mb-8">吉本興業の注目若手芸人をチェック</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {comediansData.map((comedian) => (
          <a
            key={comedian.id}
            href={`/comedians/${comedian.id}`}
            className="card hover:border-yoshimoto-red border-2 border-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🎤</span>
              <div>
                <h2 className="text-xl font-bold">{comedian.name}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{comedian.category}</span>
                  <span>·</span>
                  <span>{comedian.formation}年結成</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-1">
              メンバー: {comedian.members.join('、')}
            </p>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{comedian.description}</p>

            {comedian.achievements.length > 0 && (
              <div className="space-y-1">
                {comedian.achievements.map((achievement) => (
                  <p key={achievement} className="text-sm font-medium text-yoshimoto-red">
                    🏆 {achievement}
                  </p>
                ))}
              </div>
            )}

            <p className="mt-3 text-xs text-gray-400">📍 {comedian.homeTheater}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
