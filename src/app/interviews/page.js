'use client'

import interviewsData from '../../data/interviews.json'
import comediansData from '../../data/comedians.json'

function getComedian(id) {
  return comediansData.find(c => c.id === id)
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`
}

function getRankStyle(rank) {
  switch (rank) {
    case 'S': return 'bg-gold-soft t-gold'
    case 'A': return 'bg-accent-soft t-accent'
    case 'B': return 'bg-purple-500/10 text-purple-400'
    case 'C': return 'bg-blue-500/10 text-blue-400'
    case 'D': return 'bg-mint-soft t-mint'
    default: return 'tag'
  }
}

export default function InterviewsListPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Interviews</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">インタビュー</h1>
        <p className="text-sm t-muted mb-8">漫才劇場の芸人たちのリアルな声をお届け</p>
      </div>

      <div className="space-y-4">
        {interviewsData.map((interview, i) => {
          const comedian = getComedian(interview.comedianId)
          return (
            <a
              key={interview.id}
              href={`/interviews/${interview.id}`}
              className={`card block p-6 hover:border-accent-soft transition-all group animate-fade-in-up delay-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] t-muted">{formatDate(interview.date)}</span>
                    {comedian && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getRankStyle(comedian.rank)}`}>
                        {comedian.rank}ランク
                      </span>
                    )}
                  </div>
                  <h2 className="font-black text-lg tracking-tight group-hover:t-accent transition-colors mb-1">
                    {interview.title}
                  </h2>
                  <p className="text-xs t-muted mb-2">{interview.subtitle}</p>
                </div>
              </div>

              <p className="text-sm t-secondary leading-relaxed mb-3 line-clamp-2">{interview.intro}</p>

              <div className="flex flex-wrap gap-1.5">
                {interview.tags.map(tag => (
                  <span key={tag} className="tag text-[10px]">{tag}</span>
                ))}
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
