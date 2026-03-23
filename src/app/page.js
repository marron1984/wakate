import newsData from '../data/news.json'
import eventsData from '../data/events.json'
import comediansData from '../data/comedians.json'

function getCategoryStyle(cat) {
  switch (cat) {
    case '公演情報': return 'bg-accent-soft t-accent'
    case 'イベント': return 'bg-gold-soft t-gold'
    case 'メディア': return 'bg-blue-500/10 text-blue-400'
    case '受賞': return 'bg-purple-500/10 text-purple-400'
    case '注目若手': return 'bg-mint-soft t-mint'
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

export default function Home() {
  const upcoming = eventsData
    .filter(e => e.date >= '2026-03-23')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const rookies = comediansData.filter(c => c.rank === 'D')

  return (
    <div>
      {/* Hero */}
      <section className="animate-fade-in-up relative overflow-hidden rounded-3xl bg-surface border border-themed p-10 sm:p-14 mb-12">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] animate-pulse-glow" style={{ backgroundColor: 'rgb(var(--accent) / 0.08)' }} />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] animate-pulse-glow delay-3" style={{ backgroundColor: 'rgb(var(--gold) / 0.05)' }} />
        <div className="relative">
          <p className="t-accent text-xs font-bold tracking-[0.3em] uppercase mb-4 animate-fade-in delay-1">Yoshimoto Manzai Gekijo</p>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-4 animate-fade-in-up delay-2">
            WAKA<span className="t-accent">TE</span>
          </h1>
          <p className="t-muted text-sm max-w-md mb-8 leading-relaxed animate-fade-in delay-3">
            よしもと漫才劇場の若手芸人にフォーカスした情報サイト。
          </p>
          <div className="flex flex-wrap gap-3 animate-fade-in-up delay-4">
            <a href="/events" className="btn-primary">Events</a>
            <a href="/comedians" className="btn-outline">Comedians</a>
            <a href="/compatibility" className="bg-gold-soft t-gold hover:opacity-80 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">Diagnosis</a>
          </div>
        </div>
      </section>

      {/* Diagnosis Banner */}
      <a href="/compatibility" className="block group mb-12 animate-fade-in-up delay-2">
        <div className="flex items-center justify-between bg-gold-soft border border-gold-soft hover:border-themed rounded-2xl px-6 py-5 transition-all">
          <div>
            <p className="t-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Interactive</p>
            <p className="font-bold text-sm">芸人相性チェック — 7つの質問であなたの推し芸人が見つかる</p>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform animate-float">→</span>
        </div>
      </a>

      {/* Rookies */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div className="animate-slide-in-left">
            <p className="t-mint text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Next Generation</p>
            <h2 className="section-title">超若手ピックアップ</h2>
          </div>
          <a href="/comedians#rank-D" className="btn-ghost text-xs">View all →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {rookies.map((c, i) => (
            <a key={c.id} href={`/comedians/${c.id}`} className={`card group animate-fade-in-up delay-${Math.min(i + 1, 8)}`} style={{ borderColor: 'transparent' }}>
              <p className="font-bold text-sm mb-1 group-hover:t-mint transition-colors">{c.name}</p>
              <p className="text-[11px] t-muted mb-2">{c.nscYear}</p>
              <span className="badge bg-mint-soft t-mint text-[10px]">D</span>
              {c.achievements[0] && <p className="text-[11px] t-accent mt-2 line-clamp-1">{c.achievements[0]}</p>}
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* News */}
        <div className="lg:col-span-3">
          <div className="mb-6 animate-slide-in-left">
            <p className="t-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Latest</p>
            <h2 className="section-title">ニュース</h2>
          </div>
          <div className="space-y-3">
            {newsData.slice(0, 12).map((news, i) => {
              const comedian = news.comedianId ? comediansData.find(c => c.id === news.comedianId) : null
              return (
                <article key={news.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)} ${news.event ? 'border-l-2' : ''}`} style={news.event ? { borderLeftColor: 'rgb(var(--accent))' } : {}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryStyle(news.category)}`}>{news.category}</span>
                    <time className="text-[11px] t-muted">{news.date}</time>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 leading-snug">{news.title}</h3>
                  <p className="text-xs t-muted leading-relaxed">{news.summary}</p>
                  {news.event && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="tag">{news.event.date}</span>
                      <span className="tag">{news.event.time}〜</span>
                      <span className="tag">¥{news.event.price.toLocaleString()}</span>
                      <span className="tag">{news.event.theater}</span>
                      <span className={`badge text-[10px] ${getStatusStyle(news.event.status)}`}>{news.event.status}</span>
                    </div>
                  )}
                  {comedian && <a href={`/comedians/${comedian.id}`} className="inline-block mt-2 text-xs t-accent hover:underline">{comedian.name} →</a>}
                </article>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-10">
          <div className="animate-fade-in-up delay-3">
            <div className="mb-4">
              <p className="t-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Upcoming</p>
              <h2 className="section-title">直近の公演</h2>
            </div>
            <div className="space-y-2">
              {upcoming.map((ev) => (
                <a key={ev.id} href="/events" className="block card group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="tag">{ev.type}</span>
                    {ev.status === '販売中' && <span className="badge bg-mint-soft t-mint text-[10px]">ON SALE</span>}
                  </div>
                  <p className="font-semibold text-sm group-hover:t-accent transition-colors">{ev.title}</p>
                  <p className="text-[11px] t-muted mt-1">{ev.date} {ev.startTime}〜 / ¥{ev.price.toLocaleString()}</p>
                </a>
              ))}
            </div>
            <a href="/events" className="btn-ghost text-xs mt-3 inline-block">All events →</a>
          </div>

          <div className="animate-fade-in-up delay-5">
            <div className="mb-4">
              <p className="t-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Featured</p>
              <h2 className="section-title">注目の芸人</h2>
            </div>
            <div className="space-y-2">
              {comediansData.filter(c => c.rank === 'A').slice(0, 4).map((c) => (
                <a key={c.id} href={`/comedians/${c.id}`} className="block card group">
                  <p className="font-semibold text-sm group-hover:t-accent transition-colors">{c.name}</p>
                  <p className="text-[11px] t-muted">{c.members.join(' / ')} — {c.category}</p>
                  {c.achievements[0] && <p className="text-[11px] t-accent mt-1">{c.achievements[0]}</p>}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
