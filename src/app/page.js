import newsData from '../data/news.json'
import eventsData from '../data/events.json'
import comediansData from '../data/comedians.json'

function getCategoryColor(category) {
  switch (category) {
    case '公演情報': return 'bg-accent/10 text-accent'
    case 'イベント': return 'bg-gold/10 text-gold'
    case 'メディア': return 'bg-blue-500/10 text-blue-400'
    case '受賞': return 'bg-purple-500/10 text-purple-400'
    case '注目若手': return 'bg-mint/10 text-mint'
    case 'ニュース': return 'bg-white/5 text-muted'
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

export default function Home() {
  const upcomingEvents = eventsData
    .filter(e => e.date >= '2026-03-23')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const rookies = comediansData.filter(c => c.rank === 'D')

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-surface via-surface to-accent/5 border border-border p-10 sm:p-14 mb-12">
        <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-accent text-xs font-bold tracking-[0.3em] uppercase mb-4">Yoshimoto Manzai Gekijo</p>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter mb-4">
            WAKA<span className="text-accent">TE</span>
          </h1>
          <p className="text-muted text-sm max-w-md mb-8 leading-relaxed">
            よしもと漫才劇場の若手芸人にフォーカスした情報サイト。公演スケジュール、芸人プロフィール、最新ニュースをお届け。
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/events" className="btn-primary">公演スケジュール</a>
            <a href="/comedians" className="btn-outline">芸人一覧</a>
            <a href="/compatibility" className="bg-gold/10 hover:bg-gold/20 text-gold px-5 py-2.5 rounded-xl font-semibold text-sm transition-all">相性診断</a>
          </div>
        </div>
      </section>

      {/* Diagnosis Banner */}
      <a href="/compatibility" className="block group mb-12">
        <div className="flex items-center justify-between bg-gold/5 border border-gold/20 hover:border-gold/40 rounded-2xl px-6 py-5 transition-all">
          <div>
            <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Interactive</p>
            <p className="font-bold text-sm">芸人相性チェック — 7つの質問であなたの推し芸人が見つかる</p>
          </div>
          <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </a>

      {/* Rookies */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-mint text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Next Generation</p>
            <h2 className="section-title">超若手ピックアップ</h2>
          </div>
          <a href="/comedians#rank-D" className="btn-ghost text-xs">View all →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {rookies.map((comedian) => (
            <a
              key={comedian.id}
              href={`/comedians/${comedian.id}`}
              className="group bg-surface border border-border rounded-2xl p-4 hover:border-mint/40 transition-all"
            >
              <p className="font-bold text-sm mb-1 group-hover:text-mint transition-colors">{comedian.name}</p>
              <p className="text-[11px] text-muted mb-2">{comedian.nscYear}</p>
              <span className="tag bg-mint/10 text-mint">D</span>
              {comedian.achievements[0] && (
                <p className="text-[11px] text-accent mt-2 line-clamp-1">{comedian.achievements[0]}</p>
              )}
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* News */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <p className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Latest</p>
            <h2 className="section-title">ニュース</h2>
          </div>
          <div className="space-y-3">
            {newsData.slice(0, 12).map((news) => {
              const comedian = news.comedianId
                ? comediansData.find(c => c.id === news.comedianId)
                : null
              return (
                <article key={news.id} className={`card ${news.event ? 'border-l-2 border-l-accent' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryColor(news.category)}`}>{news.category}</span>
                    <time className="text-[11px] text-muted">{news.date}</time>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 leading-snug">{news.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{news.summary}</p>
                  {news.event && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <span className="tag">{news.event.date}</span>
                      <span className="tag">{news.event.time}〜</span>
                      <span className="tag">¥{news.event.price.toLocaleString()}</span>
                      <span className="tag">{news.event.theater}</span>
                      <span className={`badge text-[10px] ${getStatusColor(news.event.status)}`}>{news.event.status}</span>
                    </div>
                  )}
                  {comedian && (
                    <a href={`/comedians/${comedian.id}`} className="inline-block mt-2 text-xs text-accent hover:underline">
                      {comedian.name} →
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-2 space-y-10">
          {/* Events */}
          <div>
            <div className="mb-4">
              <p className="text-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Upcoming</p>
              <h2 className="section-title">直近の公演</h2>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <a key={event.id} href="/events" className="block card group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="tag">{event.type}</span>
                    {event.status === '販売中' && <span className="badge bg-mint/10 text-mint text-[10px]">ON SALE</span>}
                  </div>
                  <p className="font-semibold text-sm group-hover:text-accent transition-colors">{event.title}</p>
                  <p className="text-[11px] text-muted mt-1">{event.date} {event.startTime}〜 ／ ¥{event.price.toLocaleString()}</p>
                </a>
              ))}
            </div>
            <a href="/events" className="btn-ghost text-xs mt-3 inline-block">All events →</a>
          </div>

          {/* Featured */}
          <div>
            <div className="mb-4">
              <p className="text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Featured</p>
              <h2 className="section-title">注目の芸人</h2>
            </div>
            <div className="space-y-2">
              {comediansData.filter(c => c.rank === 'A').slice(0, 4).map((comedian) => (
                <a key={comedian.id} href={`/comedians/${comedian.id}`} className="block card group">
                  <p className="font-semibold text-sm group-hover:text-accent transition-colors">{comedian.name}</p>
                  <p className="text-[11px] text-muted">{comedian.members.join(' / ')} — {comedian.category}</p>
                  {comedian.achievements[0] && (
                    <p className="text-[11px] text-accent mt-1">{comedian.achievements[0]}</p>
                  )}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
