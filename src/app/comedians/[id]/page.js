import comediansData from '../../../data/comedians.json'
import newsData from '../../../data/news.json'

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

export default function ComedianDetail({ params }) {
  const comedian = comediansData.find(c => c.id === params.id)

  if (!comedian) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl font-bold text-gray-400">芸人が見つかりません</p>
        <a href="/comedians" className="text-yoshimoto-red hover:underline mt-4 inline-block">
          ← 芸人一覧に戻る
        </a>
      </div>
    )
  }

  const relatedNews = newsData.filter(n => n.comedianId === comedian.id)

  return (
    <div>
      <a href="/comedians" className="text-sm text-gray-500 hover:text-yoshimoto-red mb-4 inline-block">
        ← 芸人一覧に戻る
      </a>

      <div className="card mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-5xl">🎤</span>
          <div>
            <h1 className="text-3xl font-bold">{comedian.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge-red">{comedian.category}</span>
              <span className="text-sm text-gray-500">{comedian.formation}年結成</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{comedian.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-bold text-gray-700 mb-1">メンバー</h3>
            <p className="text-gray-600">{comedian.members.join('、')}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">所属</h3>
            <p className="text-gray-600">{comedian.agency}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">ホーム劇場</h3>
            <p className="text-gray-600">{comedian.homeTheater}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-700 mb-1">結成年</h3>
            <p className="text-gray-600">{comedian.formation}年</p>
          </div>
        </div>
      </div>

      {comedian.achievements.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-l-4 border-yoshimoto-gold pl-3">主な実績</h2>
          <div className="space-y-2">
            {comedian.achievements.map((achievement) => (
              <div key={achievement} className="card py-3">
                <span className="font-medium">🏆 {achievement}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {relatedNews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 border-l-4 border-yoshimoto-red pl-3">関連ニュース</h2>
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
