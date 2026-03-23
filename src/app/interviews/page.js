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

export default function InterviewsListPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="animate-fade-in-up mb-8">
        <h1 className="text-2xl font-black tracking-tight mb-1">インタビュー</h1>
        <p className="text-sm t-muted">漫才劇場の芸人たちのリアルな声をお届け</p>
      </div>

      <div className="space-y-3">
        {interviewsData.map((interview, i) => {
          const comedian = getComedian(interview.comedianId)
          return (
            <a
              key={interview.id}
              href={`/interviews/${interview.id}`}
              className={`card block p-0 overflow-hidden hover:border-accent-soft transition-all group animate-fade-in-up delay-${Math.min(i + 1, 5)} ${interview.thumbnail ? 'sm:flex' : ''}`}
            >
              {interview.thumbnail && (
                <div className="sm:w-1/3 aspect-[3/2] sm:aspect-auto bg-surface-hover overflow-hidden">
                  <img
                    src={interview.thumbnail}
                    alt={interview.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`p-5 flex-1 ${interview.thumbnail ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-[10px] t-muted">{formatDate(interview.date)}</span>
                  {comedian && (
                    <span className="tag text-[10px]">{comedian.nscYear}</span>
                  )}
                </div>
                <h2 className="font-bold text-base tracking-tight group-hover:t-accent transition-colors mb-1">
                  {interview.title}
                </h2>
                <p className="text-xs t-muted mb-2">{interview.subtitle}</p>
                <p className="text-sm t-secondary leading-relaxed mb-3 line-clamp-2">{interview.intro}</p>
                <div className="flex flex-wrap gap-1">
                  {interview.tags.map(tag => (
                    <span key={tag} className="tag text-[10px]">{tag}</span>
                  ))}
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}
