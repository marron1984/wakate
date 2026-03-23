import interviewsData from '../../../data/interviews.json'
import comediansData from '../../../data/comedians.json'
import InterviewDetail from './interview-detail'

function getComedian(id) {
  return comediansData.find(c => c.id === id)
}

export function generateStaticParams() {
  return interviewsData.map(interview => ({ id: interview.id }))
}

export function generateMetadata({ params }) {
  const interview = interviewsData.find(a => a.id === params.id)
  return {
    title: interview ? `${interview.title} | WAKATE` : 'インタビュー | WAKATE',
  }
}

export default function InterviewPage({ params }) {
  const interview = interviewsData.find(a => a.id === params.id)
  if (!interview) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <h1 className="text-2xl font-black mb-4">記事が見つかりません</h1>
        <a href="/interviews" className="t-accent text-sm hover:underline">← インタビュー一覧に戻る</a>
      </div>
    )
  }

  const comedian = getComedian(interview.comedianId)
  const otherInterviews = interviewsData.filter(a => a.id !== interview.id).slice(0, 3)

  return <InterviewDetail interview={interview} comedian={comedian} otherInterviews={otherInterviews} />
}
