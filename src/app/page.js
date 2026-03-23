import newsData from '../data/news.json'
import eventsData from '../data/events.json'
import comediansData from '../data/comedians.json'

function getCategoryColor(category) {
  switch (category) {
    case '公演情報': return 'bg-yoshimoto-red text-white'
    case 'イベント': return 'bg-yoshimoto-gold text-white'
    case 'メディア': return 'bg-blue-500 text-white'
    case '受賞': return 'bg-purple-500 text-white'
    case '注目若手': return 'bg-emerald-500 text-white'
    case 'ニュース': return 'bg-gray-600 text-white'
    default: return 'bg-gray-200 text-gray-700'
  }
}

function getStatusColor(status) {
  switch (status) {
    case '販売中': return 'bg-green-500 text-white'
    case '近日発売': return 'bg-orange-400 text-white'
    case '完売': return 'bg-gray-500 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

function getEventTypeColor(type) {
  switch (type) {
    case 'バトルライブ': return 'bg-red-100 text-red-700 border-red-200'
    case 'ネタライブ': return 'bg-blue-100 text-blue-700 border-blue-200'
    case '単独ライブ': return 'bg-purple-100 text-purple-700 border-purple-200'
    case '企画ライブ': return 'bg-green-100 text-green-700 border-green-200'
    case '特別公演': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

export default function Home() {
  const upcomingEvents = eventsData
    .filter(e => e.date >= '2026-03-23')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const rookies = comediansData.filter(c => c.rank === 'D')

  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-br from-yoshimoto-black via-gray-800 to-yoshimoto-black text-white rounded-2xl p-8 mb-10">
        <p className="text-yoshimoto-red font-bold text-sm mb-2 tracking-wider">YOSHIMOTO MANZAI GEKIJO</p>
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">
          <span className="text-yoshimoto-red">ワカテ</span>NEWS
        </h1>
        <p className="text-gray-300 mb-6 max-w-xl">
          よしもと漫才劇場の若手芸人にフォーカスした情報サイト。公演スケジュール、芸人プロフィール、最新ニュースをお届けします。
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="/events" className="bg-yoshimoto-red hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            公演スケジュール
          </a>
          <a href="/comedians" className="border border-white/50 hover:bg-white hover:text-gray-900 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
            芸人一覧
          </a>
        </div>
      </section>

      {/* 超若手ピックアップ */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold border-l-4 border-emerald-500 pl-3">
            超若手ピックアップ
            <span className="text-sm font-normal text-gray-400 ml-2">- Next Generation -</span>
          </h2>
          <a href="/comedians" className="text-sm text-yoshimoto-red hover:underline font-medium">全員見る →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {rookies.map((comedian) => (
            <a
              key={comedian.id}
              href={`/comedians/${comedian.id}`}
              className="bg-gradient-to-b from-white to-gray-50 rounded-lg border-2 border-transparent hover:border-emerald-400 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="text-center mb-2">
                <span className="text-3xl">{comedian.category === 'ピン芸人' ? '🎙️' : comedian.category.includes('コント') ? '🎬' : '🎤'}</span>
              </div>
              <h3 className="font-bold text-center text-sm mb-1">{comedian.name}</h3>
              <p className="text-xs text-gray-500 text-center mb-2">{comedian.nscYear}</p>
              <span className="block text-center">
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">D・超若手</span>
              </span>
              {comedian.achievements[0] && (
                <p className="text-xs text-yoshimoto-red text-center mt-2 line-clamp-1">🏆 {comedian.achievements[0]}</p>
              )}
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* メインカラム: ニュース */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-yoshimoto-red pl-3">最新ニュース</h2>
          <div className="space-y-4">
            {newsData.slice(0, 15).map((news) => {
              const comedian = news.comedianId
                ? comediansData.find(c => c.id === news.comedianId)
                : null
              return (
                <article key={news.id} className={`card ${news.event ? 'border-l-4 border-l-yoshimoto-red' : ''}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`badge ${getCategoryColor(news.category)}`}>
                      {news.category}
                    </span>
                    <time className="text-sm text-gray-400">{news.date}</time>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                  <p className="text-gray-600 text-sm">{news.summary}</p>
                  {news.event && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-gray-100 px-2 py-1 rounded">📅 {news.event.date}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">🕐 {news.event.time}〜</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">💴 ¥{news.event.price.toLocaleString()}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded">📍 {news.event.theater}</span>
                      <span className={`px-2 py-1 rounded font-medium ${getStatusColor(news.event.status)}`}>
                        {news.event.status}
                      </span>
                    </div>
                  )}
                  {comedian && (
                    <a
                      href={`/comedians/${comedian.id}`}
                      className="inline-block mt-3 text-sm text-yoshimoto-red hover:underline font-medium"
                    >
                      {comedian.name} のプロフィール →
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {/* サイドバー */}
        <aside>
          {/* 直近の公演 */}
          <h2 className="text-2xl font-bold mb-6 border-l-4 border-yoshimoto-gold pl-3">直近の公演</h2>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <a key={event.id} href="/events" className="block card py-4 hover:border-yoshimoto-red border-2 border-transparent">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getEventTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                  {event.status === '販売中' && (
                    <span className="text-xs px-2 py-0.5 rounded bg-green-500 text-white">販売中</span>
                  )}
                </div>
                <p className="font-bold text-sm mb-1">{event.title}</p>
                <p className="text-xs text-gray-500">
                  📅 {event.date} {event.startTime}〜 ／ ¥{event.price.toLocaleString()}
                </p>
              </a>
            ))}
          </div>
          <a href="/events" className="block text-center text-sm text-yoshimoto-red hover:underline mt-4 font-medium">
            すべての公演を見る →
          </a>

          {/* 注目の芸人 */}
          <h2 className="text-2xl font-bold mb-4 mt-8 border-l-4 border-yoshimoto-red pl-3">注目の芸人</h2>
          <div className="space-y-3">
            {comediansData.filter(c => c.rank === 'A').slice(0, 4).map((comedian) => (
              <a key={comedian.id} href={`/comedians/${comedian.id}`} className="block card py-3 hover:border-yoshimoto-red border-2 border-transparent">
                <p className="font-bold text-sm">{comedian.name}</p>
                <p className="text-xs text-gray-500">{comedian.members.join('・')} ／ {comedian.category}</p>
                {comedian.achievements[0] && (
                  <p className="text-xs text-yoshimoto-red mt-1">🏆 {comedian.achievements[0]}</p>
                )}
              </a>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
