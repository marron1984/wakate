import comediansData from '../../../data/comedians.json'
import newsData from '../../../data/news.json'
import eventsData from '../../../data/events.json'
import theatersData from '../../../data/theaters.json'

export function generateStaticParams() {
  return comediansData.map(c => ({ id: c.id }))
}
export function generateMetadata({ params }) {
  const c = comediansData.find(c => c.id === params.id)
  return { title: c ? `${c.name} — WAKATE.Fun` : 'WAKATE.Fun' }
}

function getRankStyle(r) {
  switch (r) {
    case 'S': return { badge: 'bg-gold-soft t-gold', label: 'Legend' }
    case 'A': return { badge: 'bg-accent-soft t-accent', label: 'Top' }
    case 'B': return { badge: 'bg-blue-500/10 text-blue-400', label: 'Middle' }
    case 'C': return { badge: 'bg-purple-500/10 text-purple-400', label: 'Rising' }
    case 'D': return { badge: 'bg-mint-soft t-mint', label: 'Rookie' }
    default: return { badge: 'tag', label: '' }
  }
}

export default function ComedianDetail({ params }) {
  const comedian = comediansData.find(c => c.id === params.id)
  if (!comedian) {
    return <div className="text-center py-20"><p className="text-xl font-bold t-muted">Not found</p><a href="/comedians" className="t-accent text-sm mt-4 inline-block">← Back</a></div>
  }

  const theater = theatersData.find(t => t.id === comedian.homeTheater)
  const news = newsData.filter(n => n.comedianId === comedian.id)
  const events = eventsData.filter(e => e.performers.includes(comedian.id)).sort((a, b) => a.date.localeCompare(b.date))
  const s = getRankStyle(comedian.rank)

  return (
    <div>
      <a href="/comedians" className="btn-ghost text-xs mb-8 inline-block animate-fade-in">← 芸人一覧</a>

      <div className="card p-8 mb-8 animate-fade-in-up">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-black tracking-tight">{comedian.name}</h1>
          <span className={`badge ${s.badge}`}>{comedian.rank} · {s.label}</span>
        </div>
        <p className="text-sm t-secondary leading-relaxed mb-6">{comedian.description}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[['Members', comedian.members.join(' / ')], ['Since', `${comedian.formation}年`], ['NSC', comedian.nscYear], ['Theater', theater?.shortName || '—']].map(([l, v], i) => (
            <div key={l} className={`subtle-bg rounded-xl p-3 animate-fade-in-up delay-${i + 1}`}>
              <p className="text-[10px] t-muted uppercase tracking-wider mb-1">{l}</p>
              <p className="text-sm font-medium">{v}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {comedian.achievements.length > 0 && (
          <section className="animate-fade-in-up delay-3">
            <p className="t-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Achievements</p>
            <h2 className="section-title mb-4">主な実績</h2>
            <div className="space-y-2">
              {comedian.achievements.map((a, i) => (
                <div key={a} className={`card py-3 flex items-center gap-3 animate-slide-in-left delay-${i + 1}`}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'rgb(var(--gold))' }} />
                  <span className="text-sm">{a}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {events.length > 0 && (
          <section className="animate-fade-in-up delay-4">
            <p className="t-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Upcoming</p>
            <h2 className="section-title mb-4">出演予定</h2>
            <div className="space-y-2">
              {events.map(ev => (
                <a key={ev.id} href="/events" className="card group flex items-center gap-4 py-3">
                  <div className="text-center min-w-[48px]">
                    <p className="text-[10px] t-muted font-mono">{ev.date.slice(5)}</p>
                    <p className="text-sm font-bold font-mono">{ev.startTime}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:t-accent transition-colors">{ev.title}</p>
                    <p className="text-[11px] t-muted">¥{ev.price.toLocaleString()} / {ev.status}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {news.length > 0 && (
        <section className="mt-10 animate-fade-in-up delay-5">
          <p className="t-muted text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Related</p>
          <h2 className="section-title mb-4">関連ニュース</h2>
          <div className="space-y-2">
            {news.map(n => (
              <article key={n.id} className="card py-4">
                <time className="text-[11px] t-muted">{n.date}</time>
                <h3 className="font-bold text-sm mt-1">{n.title}</h3>
                <p className="text-xs t-muted mt-1">{n.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
