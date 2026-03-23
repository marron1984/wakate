'use client'

import { useState } from 'react'
import compatibilityData from '../../data/compatibility.json'
import comediansData from '../../data/comedians.json'

const questions = compatibilityData.questions
const results = compatibilityData.results

function getTypeColor(type) {
  switch (type) {
    case 'energy': return { bg: 'bg-accent', soft: 'bg-accent/10', text: 'text-accent', border: 'border-accent/30' }
    case 'classic': return { bg: 'bg-gold', soft: 'bg-gold/10', text: 'text-gold', border: 'border-gold/30' }
    case 'unique': return { bg: 'bg-purple-500', soft: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' }
    case 'intellectual': return { bg: 'bg-blue-500', soft: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' }
    case 'warm': return { bg: 'bg-orange-400', soft: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/30' }
    default: return { bg: 'bg-muted', soft: 'bg-white/5', text: 'text-muted', border: 'border-border' }
  }
}

function getRankBadge(rank) {
  switch (rank) {
    case 'S': return 'bg-gold/10 text-gold'
    case 'A': return 'bg-accent/10 text-accent'
    case 'B': return 'bg-blue-500/10 text-blue-400'
    case 'C': return 'bg-purple-500/10 text-purple-400'
    case 'D': return 'bg-mint/10 text-mint'
    default: return 'bg-white/5 text-muted'
  }
}

export default function CompatibilityPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [scores, setScores] = useState(null)

  function pick(option) {
    const next = [...answers, option]
    setAnswers(next)
    if (step + 1 < questions.length) {
      setStep(step + 1)
    } else {
      const total = { energy: 0, classic: 0, unique: 0, intellectual: 0, warm: 0 }
      next.forEach(a => Object.entries(a.scores).forEach(([k, v]) => { total[k] += v }))
      const top = Object.entries(total).reduce((a, b) => a[1] > b[1] ? a : b)[0]
      setScores(total)
      setResult(results.find(r => r.type === top))
    }
  }

  function reset() { setStep(0); setAnswers([]); setResult(null); setScores(null) }

  const progress = ((step + (result ? 1 : 0)) / questions.length) * 100

  // Result
  if (result) {
    const c = getTypeColor(result.type)
    const matched = result.comedians.map(id => comediansData.find(x => x.id === id)).filter(Boolean)
    const max = Math.max(...Object.values(scores))
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1])

    return (
      <div className="max-w-2xl mx-auto">
        <p className={`${c.text} text-[10px] font-bold tracking-[0.3em] uppercase mb-2`}>Your Result</p>
        <h1 className="text-3xl font-black tracking-tight mb-8">診断結果</h1>

        {/* Main result */}
        <div className={`${c.soft} border ${c.border} rounded-3xl p-8 text-center mb-8`}>
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-3`}>あなたのお笑いタイプ</p>
          <h2 className="text-2xl font-black tracking-tight mb-4">{result.label}</h2>
          <p className="text-sm text-muted leading-relaxed max-w-md mx-auto">{result.description}</p>
        </div>

        {/* Score bars */}
        <div className="card mb-8">
          <p className="text-[10px] text-muted uppercase tracking-wider mb-4">Score Breakdown</p>
          <div className="space-y-3">
            {sorted.map(([type, score]) => {
              const tc = getTypeColor(type)
              const tr = results.find(r => r.type === type)
              const pct = max > 0 ? (score / max) * 100 : 0
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${tc.text}`}>{tr?.label}</span>
                    <span className="text-muted font-mono">{score}</span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-1.5">
                    <div className={`${tc.bg} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Matched comedians */}
        <div className="mb-10">
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-1`}>Best Match</p>
          <h3 className="section-title mb-4">相性の良い芸人</h3>
          <div className="space-y-2">
            {matched.map((comedian, i) => (
              <a key={comedian.id} href={`/comedians/${comedian.id}`} className={`card group flex items-center gap-4 ${i === 0 ? `border ${c.border}` : ''}`}>
                {i === 0 && <span className={`${c.soft} ${c.text} text-[10px] font-bold px-2 py-0.5 rounded-md`}>BEST</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:text-accent transition-colors">{comedian.name}</p>
                  <p className="text-[11px] text-muted">{comedian.members.join(' / ')} — {comedian.category}</p>
                </div>
                <span className={`badge text-[10px] ${getRankBadge(comedian.rank)}`}>{comedian.rank}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset} className="btn-primary">もう一度</button>
          <a href="/comedians" className="btn-outline">芸人一覧</a>
          <a href="/events" className="btn-outline">公演情報</a>
        </div>
      </div>
    )
  }

  // Question
  const q = questions[step]

  return (
    <div className="max-w-2xl mx-auto">
      <p className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Compatibility Check</p>
      <h1 className="text-3xl font-black tracking-tight mb-8">芸人相性チェック</h1>

      {/* Progress */}
      <div className="mb-10">
        <div className="flex justify-between text-xs text-muted mb-2">
          <span className="font-mono">{step + 1} / {questions.length}</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-white/5 rounded-full h-1">
          <div className="bg-accent h-1 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="card p-8 mb-4">
        <p className="text-accent text-xs font-bold mb-4 font-mono">Q{step + 1}</p>
        <h2 className="text-xl font-black tracking-tight mb-8">{q.question}</h2>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(opt)}
              className="w-full text-left bg-white/[0.03] hover:bg-accent/5 hover:border-accent/30 border border-border rounded-xl px-5 py-4 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 bg-white/5 group-hover:bg-accent group-hover:text-white rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button
          onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)) }}
          className="btn-ghost text-xs"
        >
          ← 前の質問
        </button>
      )}
    </div>
  )
}
