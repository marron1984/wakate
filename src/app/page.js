import newsData from '../data/news.json'
import eventsData from '../data/events.json'
import comediansData from '../data/comedians.json'
import interviewsData from '../data/interviews.json'

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
  const latestInterview = interviewsData[0]
  const latestInterviewComedian = latestInterview ? comediansData.find(x => x.id === latestInterview.comedianId) : null

  return (
    <div>
      {/* Hero - compact */}
      <section className="animate-fade-in-up mb-10">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          WAKATE<span className="t-accent">.</span><span className="t-gold">Fun</span>
        </h1>
        <p className="t-muted text-sm mb-5">
          よしもと漫才劇場の若手芸人にフォーカスした情報サイト
        </p>
        <div className="flex flex-wrap gap-2 animate-fade-in delay-1">
          <a href="/events" className="btn-primary">公演情報</a>
          <a href="/comedians" className="btn-outline">芸人一覧</a>
          <a href="/compatibility" className="btn-outline border-gold-soft t-gold">相性診断</a>
        </div>
      </section>

      {/* Featured Interview with image */}
      {latestInterview && (
        <a href={`/interviews/${latestInterview.id}`} className="block mb-10 animate-fade-in-up delay-1">
          <section className="card p-0 overflow-hidden sm:flex">
            {latestInterview.thumbnail && (
              <div className="sm:w-2/5 aspect-[3/2] sm:aspect-auto bg-surface-hover relative overflow-hidden">
                <img
                  src={latestInterview.thumbnail}
                  alt={latestInterview.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-accent-soft t-accent">インタビュー</span>
                {latestInterviewComedian && <span className="tag">{latestInterviewComedian.name}</span>}
                <span className="text-[11px] t-muted">{latestInterview.date}</span>
              </div>
              <h2 className="font-bold text-base sm:text-lg tracking-tight mb-2 leading-snug">{latestInterview.title}</h2>
              <p className="text-xs t-muted leading-relaxed line-clamp-2">{latestInterview.intro}</p>
            </div>
          </section>
        </a>
      )}

      {/* Diagnosis Banner */}
      <a href="/compatibility" className="block group mb-10 animate-fade-in-up delay-2">
        <div className="flex items-center justify-between bg-gold-soft border border-gold-soft hover:border-themed rounded-lg px-5 py-4 transition-all">
          <div>
            <p className="font-bold text-sm">芸人相性チェック — 7つの質問であなたの推し芸人が見つかる</p>
          </div>
          <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
        </div>
      </a>

      {/* More Interviews */}
      {interviewsData.length > 1 && (
        <section className="mb-10">
          <div className="flex items-end justify-between mb-4">
            <h2 className="section-title animate-slide-in-left">インタビュー</h2>
            <a href="/interviews" className="btn-ghost text-xs">一覧を見る →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {interviewsData.slice(1, 4).map((interview, i) => {
              const c = comediansData.find(x => x.id === interview.comedianId)
              return (
                <a
                  key={interview.id}
                  href={`/interviews/${interview.id}`}
                  className={`card block group animate-fade-in-up delay-${i + 1}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {c && <span className="tag text-[10px]">{c.name}</span>}
                    <span className="text-[10px] t-muted">{interview.date}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1.5 group-hover:t-accent transition-colors leading-snug">{interview.title}</h3>
                  <p className="text-xs t-muted line-clamp-2">{interview.intro}</p>
                </a>
              )
            })}
          </div>
        </section>
      )}

      {/* Rookies */}
      <section className="mb-10">
        <div className="flex items-end justify-between mb-4">
          <h2 className="section-title animate-slide-in-left">超若手ピックアップ</h2>
          <a href="/comedians#rank-D" className="btn-ghost text-xs">もっと見る →</a>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {rookies.map((c, i) => (
            <a key={c.id} href={`/comedians/${c.id}`} className={`card group animate-fade-in-up delay-${Math.min(i + 1, 8)}`}>
              <p className="font-bold text-sm mb-1 group-hover:t-mint transition-colors">{c.name}</p>
              <p className="text-[11px] t-muted mb-2">{c.nscYear}</p>
              <span className="badge bg-mint-soft t-mint text-[10px]">ルーキー</span>
              {c.achievements[0] && <p className="text-[11px] t-accent mt-2 line-clamp-1">{c.achievements[0]}</p>}
            </a>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* News */}
        <div className="lg:col-span-3">
          <h2 className="section-title mb-4 animate-slide-in-left">ニュース</h2>
          <div className="space-y-2">
            {newsData.slice(0, 12).map((news, i) => {
              const comedian = news.comedianId ? comediansData.find(c => c.id === news.comedianId) : null
              return (
                <article key={news.id} className={`card animate-fade-in-up delay-${Math.min(i + 1, 8)} ${news.event ? 'border-l-2' : ''}`} style={news.event ? { borderLeftColor: 'rgb(var(--accent))' } : {}}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${getCategoryStyle(news.category)}`}>{news.category}</span>
                    <time className="text-[11px] t-muted">{news.date}</time>
                  </div>
                  <h3 className="font-bold text-sm mb-1 leading-snug">{news.title}</h3>
                  <p className="text-xs t-muted leading-relaxed">{news.summary}</p>
                  {news.event && (
                    <div className="mt-2 flex flex-wrap gap-1">
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
        <aside className="lg:col-span-2 space-y-8">
          <div className="animate-fade-in-up delay-2">
            <h2 className="section-title mb-3">直近の公演</h2>
            <div className="space-y-2">
              {upcoming.map((ev) => (
                <a key={ev.id} href="/events" className="block card group">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="tag">{ev.type}</span>
                    {ev.status === '販売中' && <span className="badge bg-mint-soft t-mint text-[10px]">販売中</span>}
                  </div>
                  <p className="font-bold text-sm group-hover:t-accent transition-colors">{ev.title}</p>
                  <p className="text-[11px] t-muted mt-1">{ev.date} {ev.startTime}〜 / ¥{ev.price.toLocaleString()}</p>
                </a>
              ))}
            </div>
            <a href="/events" className="btn-ghost text-xs mt-3 inline-block">すべての公演 →</a>
          </div>

          <div className="animate-fade-in-up delay-4">
            <h2 className="section-title mb-3">注目の芸人</h2>
            <div className="space-y-2">
              {comediansData.filter(c => c.rank === 'A').slice(0, 4).map((c) => (
                <a key={c.id} href={`/comedians/${c.id}`} className="block card group">
                  <p className="font-bold text-sm group-hover:t-accent transition-colors">{c.name}</p>
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
