import comediansData from '../../../data/comedians.json'
import newsData from '../../../data/news.json'
import eventsData from '../../../data/events.json'
import theatersData from '../../../data/theaters.json'

export function generateStaticParams() {
  return comediansData.map((c) => ({ id: c.id }))
}

export function generateMetadata({ params }) {
  const c = comediansData.find(c => c.id === params.id)
  return { title: c ? `${c.name} — WAKATE` : 'WAKATE' }
}

function getRankStyle(rank) {
  switch (rank) {
    case 'S': return { badge: 'bg-gold/10 text-gold', label: 'Legend' }
    case 'A': return { badge: 'bg-accent/10 text-accent', label: 'Top' }
    case 'B': return { badge: 'bg-blue-500/10 text-blue-400', label: 'Middle' }
    case 'C': return { badge: 'bg-purple-500/10 text-purple-400', label: 'Rising' }
    case 'D': return { badge: 'bg-mint/10 text-mint', label: 'Rookie' }
    default: return { badge: 'bg-white/5 text-muted', label: '' }
  }
}

export default function ComedianDetail({ params }) {
  const comedian = comediansData.find(c => c.id === params.id)
  if (!comedian) {
    return (
      <div className="text-center py-20">
        <p className="text-xl font-bold text-muted">Not found</p>
        <a href="/comedians" className="text-accent text-sm mt-4 inline-block">← Back</a>
      </div>
    )
  }

  const theater = theatersData.find(t => t.id === comedian.homeTheater)
  const relatedNews = newsData.filter(n => n.comedianId === comedian.id)
  const upcomingEvents = eventsData.filter(e => e.performers.includes(comedian.id)).sort((a, b) => a.date.localeCompare(b.date))
  const style = getRankStyle(comedian.rank)

  return (
    <div>
      <a href="/comedians" className="btn-ghost text-xs mb-8 inline-block">← 芸人一覧</a>

      {/* Profile */}
      <div className="card mb-8 p-8">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-black tracking-tight">{comedian.name}</h1>
          <span className={`badge ${style.badge}`}>{comedian.rank} · {style.label}</span>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-6">{comedian.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            ['Members', comedian.members.join(' / ')],
            ['Since', `${comedian.formation}年`],
            ['NSC', comedian.nscYear],
            ['Theater', theater?.shortName || '—'],
          ].map(([label, value]) => (
            <div key={label} className="bg-white/[0.03] rounded-xl p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1">{label}</p>
              <p className="text-sm font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Achievements */}
        {comedian.achievements.length > 0 && (
          <section>
            <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Achievements</p>
            <h2 className="section-title mb-4">主な実績</h2>
            <div className="space-y-2">
              {comedian.achievements.map((a) => (
                <div key={a} className="card py-3 flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span className="text-sm">{a}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Events */}
        {upcomingEvents.length > 0 && (
          <section>
            <p className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Upcoming</p>
            <h2 className="section-title mb-4">出演予定</h2>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <a key={event.id} href="/events" className="card group flex items-center gap-4 py-3">
                  <div className="text-center min-w-[48px]">
                    <p className="text-[10px] text-muted">{event.date.slice(5)}</p>
                    <p className="text-sm font-bold font-mono">{event.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-accent transition-colors">{event.title}</p>
                    <p className="text-[11px] text-muted">¥{event.price.toLocaleString()} / {event.status}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="mt-10">
          <p className="text-muted text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Related</p>
          <h2 className="section-title mb-4">関連ニュース</h2>
          <div className="space-y-2">
            {relatedNews.map((news) => (
              <article key={news.id} className="card py-4">
                <time className="text-[11px] text-muted">{news.date}</time>
                <h3 className="font-bold text-sm mt-1">{news.title}</h3>
                <p className="text-xs text-muted mt-1">{news.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
