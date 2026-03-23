import newsData from '../data/news.json'
import eventsData from '../data/events.json'
import comediansData from '../data/comedians.json'
import interviewsData from '../data/interviews.json'

function getCategoryStyle(cat) {
  switch (cat) {
    case '公演情報': return 'bg-accent-soft t-accent'
    case 'イベント': return 'bg-sub-soft t-sub'
    case 'メディア': return 'bg-sub-soft t-sub'
    case '受賞': return 'bg-accent-soft t-accent'
    case '注目若手': return 'bg-accent-soft t-accent'
    default: return 'tag'
  }
}

export default function Home() {
  const upcoming = eventsData
    .filter(e => e.date >= '2026-03-23')
    .sort((a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime))
    .slice(0, 5)

  const rookies = comediansData.filter(c => c.rank === 'D')
  const feat = interviewsData[0]
  const featComedian = feat ? comediansData.find(x => x.id === feat.comedianId) : null

  return (
    <div>
      {/* Pickup Interview (top feature) */}
      {feat && (
        <a href={`/interviews/${feat.id}`} className="block mb-8 animate-fade-in">
          <div className="sm:flex gap-5 items-stretch">
            {feat.thumbnail && (
              <div className="sm:w-1/2 mb-3 sm:mb-0 overflow-hidden rounded">
                <img src={feat.thumbnail} alt={feat.title} className="w-full h-full object-cover aspect-[3/2]" />
              </div>
            )}
            <div className="sm:w-1/2 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <span className="badge bg-accent-soft t-accent">INTERVIEW</span>
                <span className="text-[10px] t-muted">{feat.date}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight mb-2 leading-snug hover:t-accent transition-colors">{feat.title}</h2>
              <p className="text-xs t-secondary leading-relaxed line-clamp-3 mb-2">{feat.intro}</p>
              {featComedian && <p className="text-xs t-muted">{featComedian.name}（{featComedian.nscYear}）</p>}
            </div>
          </div>
        </a>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2">
          {/* News */}
          <div className="mb-8">
            <h2 className="section-bar mb-3">ニュース</h2>
            <div>
              {newsData.slice(0, 10).map((news, i) => {
                const comedian = news.comedianId ? comediansData.find(c => c.id === news.comedianId) : null
                const matchedEvent = news.event ? eventsData.find(e => e.date === news.event.date && e.startTime === news.event.time) : null
                return (
                  <article key={news.id} className={`list-item px-2 animate-fade-in delay-${Math.min(i + 1, 8)}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <time className="text-[10px] t-muted shrink-0 w-[70px]">{news.date}</time>
                      <span className={`badge ${getCategoryStyle(news.category)}`}>{news.category}</span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug mb-0.5">{news.title}</h3>
                    <p className="text-[11px] t-muted leading-relaxed line-clamp-1">{news.summary}</p>
                    {news.event && (
                      <div className="mt-1.5 flex flex-wrap items-center gap-1">
                        <span className="tag">{news.event.date} {news.event.time}〜</span>
                        <span className="tag">¥{news.event.price.toLocaleString()}</span>
                        <span className="tag">{news.event.theater}</span>
                        {news.event.status === '販売中' && matchedEvent?.ticketUrl && (
                          <a href={matchedEvent.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] t-accent font-bold hover:underline ml-1">チケット購入 →</a>
                        )}
                        {news.event.status === '近日発売' && <span className="tag">近日発売</span>}
                      </div>
                    )}
                    {comedian && <a href={`/comedians/${comedian.id}`} className="text-[11px] t-sub hover:underline">{comedian.name}</a>}
                  </article>
                )
              })}
            </div>
          </div>

          {/* More Interviews */}
          {interviewsData.length > 1 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="section-bar">インタビュー</h2>
                <a href="/interviews" className="btn-ghost">一覧 →</a>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {interviewsData.slice(1, 5).map((interview, i) => {
                  const c = comediansData.find(x => x.id === interview.comedianId)
                  return (
                    <a key={interview.id} href={`/interviews/${interview.id}`} className={`list-item px-2 block group animate-fade-in delay-${i + 1}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] t-muted">{interview.date}</span>
                        {c && <span className="tag">{c.name}</span>}
                      </div>
                      <h3 className="text-sm font-bold group-hover:t-accent transition-colors leading-snug">{interview.title}</h3>
                      <p className="text-[11px] t-muted line-clamp-1 mt-0.5">{interview.intro}</p>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Rookies */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="section-bar">超若手ピックアップ</h2>
              <a href="/comedians" className="btn-ghost">芸人一覧 →</a>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {rookies.map((c, i) => (
                <a key={c.id} href={`/comedians/${c.id}`} className={`card group animate-fade-in delay-${Math.min(i + 1, 8)}`}>
                  <p className="text-sm font-bold group-hover:t-accent transition-colors">{c.name}</p>
                  <p className="text-[10px] t-muted mt-0.5">{c.nscYear}</p>
                  <span className="badge bg-accent-soft t-accent text-[9px] mt-1.5">ルーキー</span>
                  {c.achievements[0] && <p className="text-[10px] t-secondary mt-1 line-clamp-1">{c.achievements[0]}</p>}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Diagnosis */}
          <a href="/compatibility" className="card block group p-3">
            <p className="badge bg-sub-soft t-sub mb-1.5">診断</p>
            <p className="text-sm font-bold group-hover:t-accent transition-colors">芸人相性チェック</p>
            <p className="text-[10px] t-muted mt-0.5">7つの質問であなたの推し芸人が見つかる →</p>
          </a>

          {/* BMTI */}
          <a href="/bmti" className="card block group p-3">
            <p className="badge bg-accent-soft t-accent mb-1.5">BMTI</p>
            <p className="text-sm font-bold group-hover:t-accent transition-colors">ボケツッコミ適性診断</p>
            <p className="text-[10px] t-muted mt-0.5">あなたの漫才タイプは？ →</p>
          </a>

          {/* Upcoming */}
          <div>
            <h2 className="section-bar mb-3">直近の公演</h2>
            <div>
              {upcoming.map((ev) => (
                <div key={ev.id} className="list-item px-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="tag">{ev.type}</span>
                    {ev.status === '販売中' && <span className="badge bg-accent-soft t-accent">販売中</span>}
                  </div>
                  <a href="/events" className="text-sm font-bold hover:t-accent transition-colors">{ev.title}</a>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-[10px] t-muted">{ev.date} {ev.startTime}〜 ¥{ev.price.toLocaleString()}</p>
                    {ev.ticketUrl && ev.status === '販売中' && (
                      <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] t-accent font-bold hover:underline shrink-0">購入 →</a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <a href="/events" className="btn-ghost mt-2 inline-block">すべての公演 →</a>
          </div>

          {/* Featured comedians */}
          <div>
            <h2 className="section-bar mb-3">注目の芸人</h2>
            <div>
              {comediansData.filter(c => c.rank === 'A').slice(0, 4).map((c) => (
                <a key={c.id} href={`/comedians/${c.id}`} className="list-item block px-1 group">
                  <p className="text-sm font-bold group-hover:t-accent transition-colors">{c.name}</p>
                  <p className="text-[10px] t-muted">{c.members.join('・')} — {c.category}</p>
                  {c.achievements[0] && <p className="text-[10px] t-secondary mt-0.5">{c.achievements[0]}</p>}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
