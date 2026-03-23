'use client'

import comediansData from '../../../data/comedians.json'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

function getSpeakerStyle(speaker) {
  if (speaker === '——') return 't-muted font-bold'
  return 'font-black'
}

export default function InterviewDetail({ interview, comedian, otherInterviews }) {
  return (
    <div className="max-w-3xl mx-auto">
      {/* Back link */}
      <a href="/interviews" className="inline-block text-xs t-muted hover:t-accent transition-colors mb-6">← インタビュー一覧</a>

      {/* Header */}
      <div className="animate-fade-in-up mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[10px] t-muted">{formatDate(interview.date)}</span>
          {comedian && (
            <>
              <a href={`/comedians/${comedian.id}`} className="tag text-[10px] hover:bg-accent-soft hover:t-accent transition-colors">
                {comedian.name}
              </a>
              <span className="tag text-[10px]">{comedian.nscYear}</span>
            </>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">{interview.title}</h1>
        <p className="text-sm t-muted">{interview.subtitle}</p>
      </div>

      {/* Thumbnail */}
      {interview.thumbnail && (
        <div className="rounded-lg overflow-hidden mb-8 animate-fade-in delay-1">
          <img
            src={interview.thumbnail}
            alt={interview.title}
            className="w-full aspect-[2/1] object-cover"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-6 animate-fade-in delay-1">
        {interview.tags.map(tag => (
          <span key={tag} className="tag text-[10px]">{tag}</span>
        ))}
      </div>

      {/* Intro */}
      <div className="card p-5 mb-8 animate-fade-in-up delay-1">
        <p className="text-sm t-secondary leading-relaxed">{interview.intro}</p>
      </div>

      {/* Interview sections */}
      <div className="space-y-10">
        {interview.sections.map((section, si) => (
          <div key={si} className={`animate-fade-in-up delay-${Math.min(si + 2, 5)}`}>
            <h2 className="section-title mb-6">{section.heading}</h2>
            <div className="space-y-5">
              {section.content.map((line, li) => (
                <div key={li} className={`${line.speaker === '——' ? 'pl-0' : 'pl-4'}`}>
                  <p className={`text-xs mb-1 ${getSpeakerStyle(line.speaker)}`}>
                    {line.speaker === '——' ? '——' : line.speaker}
                  </p>
                  <p className={`text-sm leading-relaxed ${line.speaker === '——' ? 't-muted italic' : 't-secondary'}`}>
                    {line.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Comedian card */}
      {comedian && (
        <div className="mt-12 animate-fade-in-up">
          <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Profile</p>
          <a href={`/comedians/${comedian.id}`} className="card block p-5 hover:border-accent-soft transition-all group">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-black text-base group-hover:t-accent transition-colors">{comedian.name}</h3>
              <span className="tag text-[10px]">{comedian.nscYear}</span>
            </div>
            <p className="text-xs t-muted mb-1">{comedian.members.join('・')} ／ 結成{comedian.formation}年 ／ {comedian.category}</p>
            <p className="text-sm t-secondary">{comedian.description}</p>
          </a>
        </div>
      )}

      {/* Other interviews */}
      {otherInterviews.length > 0 && (
        <div className="mt-12 animate-fade-in-up">
          <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Other Interviews</p>
          <div className="space-y-3">
            {otherInterviews.map(other => {
              const otherComedian = comediansData.find(c => c.id === other.comedianId)
              return (
                <a
                  key={other.id}
                  href={`/interviews/${other.id}`}
                  className="card block p-4 hover:border-accent-soft transition-all group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] t-muted">{formatDate(other.date)}</span>
                    {otherComedian && (
                      <span className="tag text-[10px]">{otherComedian.name}</span>
                    )}
                  </div>
                  <h3 className="font-black text-sm group-hover:t-accent transition-colors">{other.title}</h3>
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
