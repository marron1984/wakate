import eventsData from '../../data/events.json'
import comediansData from '../../data/comedians.json'
import theatersData from '../../data/theaters.json'

export const metadata = {
  title: '公演スケジュール - ワカテNEWS',
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

function getStatusColor(status) {
  switch (status) {
    case '販売中': return 'bg-green-500 text-white'
    case '近日発売': return 'bg-orange-500 text-white'
    case '完売': return 'bg-gray-500 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

export default function EventsPage() {
  const sortedEvents = [...eventsData].sort(
    (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  )

  const eventsByDate = sortedEvents.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = []
    acc[event.date].push(event)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">公演スケジュール</h1>
      <p className="text-gray-500 mb-8">よしもと漫才劇場・森ノ宮の公演一覧</p>

      {/* 凡例 */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['バトルライブ', 'ネタライブ', '単独ライブ', '企画ライブ', '特別公演'].map((type) => (
          <span key={type} className={`text-xs px-3 py-1 rounded border font-medium ${getEventTypeColor(type)}`}>
            {type}
          </span>
        ))}
      </div>

      <div className="space-y-8">
        {Object.entries(eventsByDate).map(([date, events]) => {
          const d = new Date(date + 'T00:00:00')
          const dayOfWeek = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
          const isWeekend = d.getDay() === 0 || d.getDay() === 6

          return (
            <div key={date}>
              <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${isWeekend ? 'text-yoshimoto-red' : ''}`}>
                <span className="bg-yoshimoto-black text-white text-sm px-3 py-1 rounded">
                  {date}（{dayOfWeek}）
                </span>
              </h2>
              <div className="space-y-4">
                {events.map((event) => {
                  const theater = theatersData.find(t => t.id === event.theater)
                  const performers = event.performers
                    .map(pid => comediansData.find(c => c.id === pid))
                    .filter(Boolean)

                  return (
                    <article key={event.id} className="card">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className={`text-xs px-2.5 py-1 rounded border font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                        <span className={`text-xs px-2.5 py-1 rounded font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        {theater && (
                          <span className="text-xs text-gray-500">📍 {theater.shortName}</span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>

                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mb-3">
                        <span>🕐 {event.startTime}〜{event.endTime}</span>
                        <span>💴 ¥{event.price.toLocaleString()}</span>
                      </div>

                      {performers.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-2">出演者</p>
                          <div className="flex flex-wrap gap-2">
                            {performers.map((p) => (
                              <a
                                key={p.id}
                                href={`/comedians/${p.id}`}
                                className="text-xs bg-gray-100 hover:bg-yoshimoto-red/10 hover:text-yoshimoto-red px-3 py-1.5 rounded-full transition-colors"
                              >
                                {p.name}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
