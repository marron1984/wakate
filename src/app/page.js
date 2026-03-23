import newsData from '../data/news.json'
import comediansData from '../data/comedians.json'

function getCategoryColor(category) {
  switch (category) {
    case 'ライブ情報': return 'badge-red'
    case '劇場ニュース': return 'badge-gold'
    case 'メディア情報': return 'bg-blue-500 text-white'
    case '大会情報': return 'bg-purple-500 text-white'
    default: return 'badge-gray'
  }
}

export default function Home() {
  return (
    <div>
      {/* ヒーローセクション */}
      <section className="bg-gradient-to-r from-yoshimoto-black to-gray-800 text-white rounded-2xl p-8 mb-10">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-yoshimoto-red">ワカテ</span>NEWS
        </h1>
        <p className="text-lg text-gray-300 mb-6">
          吉本興業の若手芸人にフォーカスした情報サイト
        </p>
        <div className="flex gap-4">
          <a href="/comedians" className="bg-yoshimoto-red hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            芸人一覧を見る
          </a>
          <a href="/theaters" className="border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            劇場情報を見る
          </a>
        </div>
      </section>

      {/* 最新ニュース */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-yoshimoto-red pl-3">最新ニュース</h2>
        <div className="space-y-4">
          {newsData.map((news) => {
            const comedian = news.comedianId
              ? comediansData.find(c => c.id === news.comedianId)
              : null
            return (
              <article key={news.id} className="card">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`badge ${getCategoryColor(news.category)}`}>
                    {news.category}
                  </span>
                  <time className="text-sm text-gray-500">{news.date}</time>
                </div>
                <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                <p className="text-gray-600">{news.summary}</p>
                {comedian && (
                  <a
                    href={`/comedians/${comedian.id}`}
                    className="inline-block mt-3 text-sm text-yoshimoto-red hover:underline"
                  >
                    {comedian.name} のプロフィール →
                  </a>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {/* 注目の若手 */}
      <section>
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-yoshimoto-gold pl-3">注目の若手芸人</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {comediansData.slice(0, 3).map((comedian) => (
            <a key={comedian.id} href={`/comedians/${comedian.id}`} className="card hover:border-yoshimoto-red border-2 border-transparent">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🎤</span>
                <div>
                  <h3 className="font-bold text-lg">{comedian.name}</h3>
                  <p className="text-sm text-gray-500">{comedian.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{comedian.description}</p>
              {comedian.achievements[0] && (
                <p className="mt-2 text-sm font-medium text-yoshimoto-red">{comedian.achievements[0]}</p>
              )}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
