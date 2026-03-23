import eventsData from '../../data/events.json'
import comediansData from '../../data/comedians.json'
import theatersData from '../../data/theaters.json'

export const metadata = { title: '公演スケジュール — WAKATE' }

function getEventTypeColor(type) {
  switch (type) {
    case 'バトルライブ': return 'bg-accent/10 text-accent'
    case 'ネタライブ': return 'bg-blue-500/10 text-blue-400'
    case '単独ライブ': return 'bg-purple-500/10 text-purple-400'
    case '企画ライブ': return 'bg-mint/10 text-mint'
    case '特別公演': return 'bg-gold/10 text-gold'
    default: return 'bg-white/5 text-muted'
  }
}

function getStatusColor(status) {
  switch (status) {
    case '販売中': return 'bg-mint/10 text-mint'
    case '近日発売': return 'bg-gold/10 text-gold'
    case '完売': return 'bg-white/5 text-muted'
    default: return 'bg-white/5 text-muted'
  }
}

export default function EventsPage() {
  const sorted = [...eventsData].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  const byDate = sorted.reduce((acc, e) => { (acc[e.date] = acc[e.date] || []).push(e); return acc }, {})

  return (
    <div>
      <p className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Schedule</p>
      <h1 className="text-3xl font-black tracking-tight mb-2">公演スケジュール</h1>
      <p className="text-sm text-muted mb-8">よしもと漫才劇場・森ノ宮の公演一覧</p>

      <div className="flex flex-wrap gap-1.5 mb-10">
        {['バトルライブ', 'ネタライブ', '単独ライブ', '企画ライブ', '特別公演'].map((t) => (
          <span key={t} className={`badge ${getEventTypeColor(t)}`}>{t}</span>
        ))}
      </div>

      <div className="space-y-10">
        {Object.entries(byDate).map(([date, events]) => {
          const d = new Date(date + 'T00:00:00')
          const dow = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
          const isWe = d.getDay() === 0 || d.getDay() === 6
          return (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-mono font-bold ${isWe ? 'text-accent' : 'text-white'}`}>{date}</span>
                <span className={`text-xs px-2 py-0.5 rounded-md ${isWe ? 'bg-accent/10 text-accent' : 'bg-white/5 text-muted'}`}>{dow}</span>
                <div className="flex-1 h-px bg-border" />
              </div>
              <div className="space-y-3">
                {events.map((event) => {
                  const theater = theatersData.find(t => t.id === event.theater)
                  const performers = event.performers.map(pid => comediansData.find(c => c.id === pid)).filter(Boolean)
                  return (
                    <article key={event.id} className="card">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className={`badge ${getEventTypeColor(event.type)}`}>{event.type}</span>
                        <span className={`badge ${getStatusColor(event.status)}`}>{event.status}</span>
                        {theater && <span className="tag">{theater.shortName}</span>}
                      </div>
                      <h3 className="font-bold text-sm mb-1.5">{event.title}</h3>
                      <p className="text-xs text-muted mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted mb-3">
                        <span>{event.startTime}〜{event.endTime}</span>
                        <span>¥{event.price.toLocaleString()}</span>
                      </div>
                      {performers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {performers.map((p) => (
                            <a key={p.id} href={`/comedians/${p.id}`} className="tag hover:bg-accent/10 hover:text-accent transition-colors">{p.name}</a>
                          ))}
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
