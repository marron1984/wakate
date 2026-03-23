import comediansData from '../../../data/comedians.json'
import newsData from '../../../data/news.json'
import eventsData from '../../../data/events.json'
import theatersData from '../../../data/theaters.json'

export function generateStaticParams() {
  return comediansData.map((comedian) => ({
    id: comedian.id,
  }))
}

export function generateMetadata({ params }) {
  const comedian = comediansData.find(c => c.id === params.id)
  return {
    title: comedian ? `${comedian.name} - ワカテNEWS` : '芸人情報 - ワカテNEWS',
  }
}

function getRankLabel(rank) {
  switch (rank) {
    case 'S': return 'レジェンド'
    case 'A': return '看板'
    case 'B': return '中堅'
    case 'C': return '若手'
    default: return ''
  }
}

function getRankColor(rank) {
  switch (rank) {
    case 'S': return 'bg-yoshimoto-gold text-white'
    case 'A': return 'bg-yoshimoto-red text-white'
    case 'B': return 'bg-blue-500 text-white'
    case 'C': return 'bg-green-500 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

export default function ComedianDetail({ params }) {
  const comedian = comediansData.find(c => c.id === params.id)

  if (!comedian) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-gray-400">芸人が見つかりません</p>
        <a href="/comedians" className="text-yoshimoto-red hover:underline mt-4 inline-block">← 芸人一覧に戻る</a>
      </div>
    )
  }

  const theater = theatersData.find(t => t.id === comedian.homeTheater)
  const relatedNews = newsData.filter(n => n.comedianId === comedian.id)
  const upcomingEvents = eventsData.filter(e => e.performers.includes(comedian.id))
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div>
      <a href="/comedians" className="text-sm text-gray-500 hover:text-yoshimoto-red mb-6 inline-block">
        ← 芸人一覧に戻る
      </a>

      {/* プロフィールカード */}
      <div className="card mb-8">
        <div className="flex items-start gap-4 mb-6">
          <span className="text-5xl">🎤</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-bold">{comedian.name}</h1>
              <span className={`badge text-xs ${getRankColor(comedian.rank)}`}>
                {comedian.rank}・{getRankLabel(comedian.rank)}
              </span>
            </div>
            <p className="text-gray-500">{comedian.category}</p>
          </div>
        </div>

        <p className="text-gray-600 mb-6 leading-relaxed">{comedian.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">メンバー</p>
            <p className="font-medium">{comedian.members.join('・')}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">結成年</p>
            <p className="font-medium">{comedian.formation}年</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">NSC期</p>
            <p className="font-medium">{comedian.nscYear}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1">ホーム劇場</p>
            <p className="font-medium">{theater ? theater.shortName : '—'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 主な実績 */}
        {comedian.achievements.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-l-4 border-yoshimoto-gold pl-3">主な実績</h2>
            <div className="space-y-2">
              {comedian.achievements.map((achievement) => (
                <div key={achievement} className="card py-3 flex items-center gap-2">
                  <span>🏆</span>
                  <span className="font-medium text-sm">{achievement}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 出演予定の公演 */}
        {upcomingEvents.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 border-l-4 border-yoshimoto-red pl-3">出演予定の公演</h2>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <a key={event.id} href="/events" className="block card py-3 hover:border-yoshimoto-red border border-transparent">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[55px]">
                      <p className="text-xs text-gray-400">{event.date.slice(5)}</p>
                      <p className="text-sm font-bold">{event.startTime}</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <p className="text-xs text-gray-500">
                        ¥{event.price.toLocaleString()} ／ {event.status}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* 関連ニュース */}
      {relatedNews.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-gray-300 pl-3">関連ニュース</h2>
          <div className="space-y-3">
            {relatedNews.map((news) => (
              <article key={news.id} className="card py-4">
                <time className="text-xs text-gray-400">{news.date}</time>
                <h3 className="font-bold mt-1">{news.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{news.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
