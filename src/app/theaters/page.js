import theatersData from '../../data/theaters.json'
import comediansData from '../../data/comedians.json'
import eventsData from '../../data/events.json'

export const metadata = {
  title: '劇場案内 - ワカテNEWS',
}

export default function TheatersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">劇場案内</h1>
      <p className="text-gray-500 mb-8">よしもと漫才劇場と関連劇場の情報</p>

      <div className="space-y-8">
        {theatersData.map((theater) => {
          const theaterComedians = comediansData.filter(c => c.homeTheater === theater.id)
          const theaterEvents = eventsData
            .filter(e => e.theater === theater.id)
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 3)

          return (
            <article key={theater.id} className="card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🎭</span>
                <div>
                  <h2 className="text-2xl font-bold">{theater.name}</h2>
                  <p className="text-sm text-gray-500">{theater.openYear}年オープン ／ キャパシティ {theater.capacity}席</p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">{theater.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">📍 住所</h3>
                  <p className="text-gray-500">{theater.address}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-700 mb-1">🚃 アクセス</h3>
                  <p className="text-gray-500">{theater.access}</p>
                </div>
              </div>

              {/* ライブの種類 */}
              {theater.liveTypes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">開催されるライブの種類</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {theater.liveTypes.map((lt) => (
                      <div key={lt.name} className="bg-gray-50 rounded-lg p-3">
                        <p className="font-medium text-sm">{lt.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{lt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 所属芸人 */}
              {theaterComedians.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-3">所属芸人（{theaterComedians.length}組）</h3>
                  <div className="flex flex-wrap gap-2">
                    {theaterComedians.map((c) => (
                      <a
                        key={c.id}
                        href={`/comedians/${c.id}`}
                        className="text-sm bg-gray-100 hover:bg-yoshimoto-red/10 hover:text-yoshimoto-red px-3 py-1.5 rounded-full transition-colors"
                      >
                        {c.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* 直近の公演 */}
              {theaterEvents.length > 0 && (
                <div>
                  <h3 className="font-bold text-gray-700 mb-3">直近の公演</h3>
                  <div className="space-y-2">
                    {theaterEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs text-gray-400">{event.date.slice(5)}</p>
                          <p className="text-sm font-bold">{event.startTime}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{event.title}</p>
                          <p className="text-xs text-gray-500">¥{event.price.toLocaleString()} ／ {event.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="/events" className="inline-block text-sm text-yoshimoto-red hover:underline mt-3 font-medium">
                    すべての公演を見る →
                  </a>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
