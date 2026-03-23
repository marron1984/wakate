import newsData from '../../../data/news.json'
import comediansData from '../../../data/comedians.json'
import eventsData from '../../../data/events.json'

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

export function generateStaticParams() {
  return newsData.map(n => ({ id: String(n.id) }))
}

export function generateMetadata({ params }) {
  const news = newsData.find(n => String(n.id) === params.id)
  return {
    title: news ? `${news.title} | WAKATE.Fun` : 'ニュース | WAKATE.Fun',
  }
}

export default function NewsDetailPage({ params }) {
  const news = newsData.find(n => String(n.id) === params.id)

  if (!news) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-black mb-4">記事が見つかりません</h1>
        <a href="/" className="t-accent text-sm hover:underline">← トップに戻る</a>
      </div>
    )
  }

  const comedian = news.comedianId ? comediansData.find(c => c.id === news.comedianId) : null
  const matchedEvent = news.event ? eventsData.find(e => e.date === news.event.date && e.startTime === news.event.time) : null

  // Related news: same category or same comedian, excluding self
  const related = newsData
    .filter(n => n.id !== news.id && (n.category === news.category || (news.comedianId && n.comedianId === news.comedianId)))
    .slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <a href="/" className="text-xs t-muted hover:t-accent transition-colors mb-4 inline-block">← トップに戻る</a>

        <div className="flex items-center gap-2 mb-3">
          <time className="text-xs t-muted">{news.date}</time>
          <span className={`badge ${getCategoryStyle(news.category)}`}>{news.category}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug mb-6">{news.title}</h1>
      </div>

      {/* Body */}
      <div className="card p-5 sm:p-8 mb-6 animate-fade-in-up delay-1">
        <p className="text-sm sm:text-base leading-relaxed t-secondary">{news.summary}</p>

        {/* Event info */}
        {news.event && (
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
            <p className="text-[10px] t-muted uppercase tracking-wider font-bold mb-3">Event Info</p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="tag">{news.event.date}</span>
              <span className="tag">{news.event.time}〜</span>
              <span className="tag">{news.event.theater}</span>
              <span className="tag">¥{news.event.price.toLocaleString()}</span>
              <span className={`badge ${news.event.status === '販売中' ? 'bg-accent-soft t-accent' : 'bg-gold-soft t-gold'}`}>{news.event.status}</span>
            </div>
            {matchedEvent?.ticketUrl && news.event.status === '販売中' && (
              <a href={matchedEvent.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-primary inline-block">チケットを購入</a>
            )}
          </div>
        )}

        {/* Related comedian */}
        {comedian && (
          <div className="mt-6 pt-5 border-t" style={{ borderColor: 'rgb(var(--border))' }}>
            <p className="text-[10px] t-muted uppercase tracking-wider font-bold mb-3">Related Comedian</p>
            <a href={`/comedians/${comedian.id}`} className="card inline-flex items-center gap-3 group">
              <div>
                <p className="text-sm font-bold group-hover:t-accent transition-colors">{comedian.name}</p>
                <p className="text-[10px] t-muted">{comedian.members.join('・')} — {comedian.category}</p>
              </div>
              <span className="text-xs t-muted">→</span>
            </a>
          </div>
        )}
      </div>

      {/* Related news */}
      {related.length > 0 && (
        <div className="animate-fade-in-up delay-2">
          <h2 className="section-bar mb-3">関連ニュース</h2>
          <div>
            {related.map(n => (
              <a key={n.id} href={`/news/${n.id}`} className="list-item px-2 block group">
                <div className="flex items-center gap-2 mb-1">
                  <time className="text-[10px] t-muted shrink-0 w-[70px]">{n.date}</time>
                  <span className={`badge ${getCategoryStyle(n.category)}`}>{n.category}</span>
                </div>
                <h3 className="text-sm font-bold leading-snug group-hover:t-accent transition-colors">{n.title}</h3>
                <p className="text-[11px] t-muted leading-relaxed line-clamp-1">{n.summary}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
