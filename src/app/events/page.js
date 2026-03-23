import eventsData from '../../data/events.json'
import comediansData from '../../data/comedians.json'
import theatersData from '../../data/theaters.json'

export const metadata = { title: '公演スケジュール — WAKATE' }

function getTypeStyle(type) {
  switch (type) {
    case 'バトルライブ': return 'bg-accent-soft t-accent'
    case 'ネタライブ': return 'bg-blue-500/10 text-blue-400'
    case '単独ライブ': return 'bg-purple-500/10 text-purple-400'
    case '企画ライブ': return 'bg-mint-soft t-mint'
    case '特別公演': return 'bg-gold-soft t-gold'
    default: return 'tag'
  }
}

function getStatusStyle(s) {
  switch (s) {
    case '販売中': return 'bg-mint-soft t-mint'
    case '近日発売': return 'bg-gold-soft t-gold'
    default: return 'tag'
  }
}

export default function EventsPage() {
  const sorted = [...eventsData].sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
  const byDate = sorted.reduce((acc, e) => { (acc[e.date] = acc[e.date] || []).push(e); return acc }, {})

  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Schedule</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">公演スケジュール</h1>
        <p className="text-sm t-muted mb-8">よしもと漫才劇場・森ノ宮の公演一覧</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-10 animate-fade-in delay-2">
        {['バトルライブ', 'ネタライブ', '単独ライブ', '企画ライブ', '特別公演'].map(t => (
          <span key={t} className={`badge ${getTypeStyle(t)}`}>{t}</span>
        ))}
      </div>

      <div className="space-y-10">
        {Object.entries(byDate).map(([date, events], gi) => {
          const d = new Date(date + 'T00:00:00')
          const dow = ['日','月','火','水','木','金','土'][d.getDay()]
          const isWe = d.getDay() === 0 || d.getDay() === 6
          return (
            <div key={date} className={`animate-fade-in-up delay-${Math.min(gi + 1, 8)}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-mono font-bold ${isWe ? 't-accent' : ''}`}>{date}</span>
                <span className={`badge text-[10px] ${isWe ? 'bg-accent-soft t-accent' : 'tag'}`}>{dow}</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'rgb(var(--border))' }} />
              </div>
              <div className="space-y-3">
                {events.map((ev) => {
                  const theater = theatersData.find(t => t.id === ev.theater)
                  const performers = ev.performers.map(p => comediansData.find(c => c.id === p)).filter(Boolean)
                  return (
                    <article key={ev.id} className="card">
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        <span className={`badge ${getTypeStyle(ev.type)}`}>{ev.type}</span>
                        <span className={`badge ${getStatusStyle(ev.status)}`}>{ev.status}</span>
                        {theater && <span className="tag">{theater.shortName}</span>}
                      </div>
                      <h3 className="font-bold text-sm mb-1.5">{ev.title}</h3>
                      <p className="text-xs t-muted mb-3">{ev.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs t-muted mb-3">
                        <span>{ev.startTime}〜{ev.endTime}</span>
                        <span>¥{ev.price.toLocaleString()}</span>
                      </div>
                      {performers.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {performers.map(p => (
                            <a key={p.id} href={`/comedians/${p.id}`} className="tag hover:bg-accent-soft hover:t-accent transition-colors">{p.name}</a>
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
