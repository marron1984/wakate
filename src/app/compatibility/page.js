'use client'

import { useState } from 'react'
import compatibilityData from '../../data/compatibility.json'
import comediansData from '../../data/comedians.json'

const questions = compatibilityData.questions
const allResults = compatibilityData.results

function getTypeColor(type) {
  switch (type) {
    case 'energy': return { bg: 'bg-accent', soft: 'bg-accent-soft', text: 't-accent', border: 'border-accent-soft' }
    case 'classic': return { bg: 'bg-gold', soft: 'bg-gold-soft', text: 't-gold', border: 'border-gold-soft' }
    case 'unique': return { bg: 'bg-purple-500', soft: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' }
    case 'intellectual': return { bg: 'bg-blue-500', soft: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' }
    case 'warm': return { bg: 'bg-orange-400', soft: 'bg-orange-400/10', text: 'text-orange-400', border: 'border-orange-400/30' }
    default: return { bg: '', soft: 'tag', text: 't-muted', border: 'border-themed' }
  }
}

function getRankBadge(r) {
  switch (r) {
    case 'S': return 'bg-gold-soft t-gold'
    case 'A': return 'bg-accent-soft t-accent'
    case 'B': return 'bg-blue-500/10 text-blue-400'
    case 'C': return 'bg-purple-500/10 text-purple-400'
    case 'D': return 'bg-mint-soft t-mint'
    default: return 'tag'
  }
}

export default function CompatibilityPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [scores, setScores] = useState(null)
  const [picking, setPicking] = useState(false)

  function pick(opt) {
    if (picking) return
    setPicking(true)
    const next = [...answers, opt]
    setAnswers(next)

    setTimeout(() => {
      if (step + 1 < questions.length) {
        setStep(step + 1)
      } else {
        const total = { energy: 0, classic: 0, unique: 0, intellectual: 0, warm: 0 }
        next.forEach(a => Object.entries(a.scores).forEach(([k, v]) => { total[k] += v }))
        const top = Object.entries(total).reduce((a, b) => a[1] > b[1] ? a : b)[0]
        setScores(total)
        setResult(allResults.find(r => r.type === top))
      }
      setPicking(false)
    }, 300)
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
        <div className="animate-fade-in-up">
          <p className={`${c.text} text-[10px] font-bold tracking-[0.3em] uppercase mb-2`}>Your Result</p>
          <h1 className="text-3xl font-black tracking-tight mb-8">診断結果</h1>
        </div>

        <div className={`${c.soft} border ${c.border} rounded-3xl p-8 text-center mb-8 animate-scale-in delay-1`}>
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-3`}>あなたのお笑いタイプ</p>
          <h2 className="text-2xl font-black tracking-tight mb-4 animate-fade-in-up delay-2">{result.label}</h2>
          <p className="text-sm t-muted leading-relaxed max-w-md mx-auto animate-fade-in delay-3">{result.description}</p>
        </div>

        <div className="card mb-8 animate-fade-in-up delay-2">
          <p className="text-[10px] t-muted uppercase tracking-wider mb-4">Score Breakdown</p>
          <div className="space-y-3">
            {sorted.map(([type, score], i) => {
              const tc = getTypeColor(type)
              const tr = allResults.find(r => r.type === type)
              const pct = max > 0 ? (score / max) * 100 : 0
              return (
                <div key={type} className={`animate-slide-in-left delay-${i + 1}`}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className={`font-medium ${tc.text}`}>{tr?.label}</span>
                    <span className="t-muted font-mono">{score}</span>
                  </div>
                  <div className="w-full rounded-full h-1.5 subtle-bg">
                    <div className={`${tc.bg} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mb-10 animate-fade-in-up delay-4">
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-1`}>Best Match</p>
          <h3 className="section-title mb-4">相性の良い芸人</h3>
          <div className="space-y-2">
            {matched.map((comedian, i) => (
              <a key={comedian.id} href={`/comedians/${comedian.id}`} className={`card group flex items-center gap-4 animate-fade-in-up delay-${Math.min(i + 5, 8)} ${i === 0 ? `border ${c.border}` : ''}`}>
                {i === 0 && <span className={`${c.soft} ${c.text} text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse-glow`}>BEST</span>}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:t-accent transition-colors">{comedian.name}</p>
                  <p className="text-[11px] t-muted">{comedian.members.join(' / ')} — {comedian.category}</p>
                </div>
                <span className={`badge text-[10px] ${getRankBadge(comedian.rank)}`}>{comedian.rank}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center animate-fade-in delay-6">
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
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Compatibility Check</p>
        <h1 className="text-3xl font-black tracking-tight mb-8">芸人相性チェック</h1>
      </div>

      <div className="mb-10 animate-fade-in delay-1">
        <div className="flex justify-between text-xs t-muted mb-2">
          <span className="font-mono">{step + 1} / {questions.length}</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="w-full rounded-full h-1 subtle-bg">
          <div className="h-1 rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: 'rgb(var(--accent))' }} />
        </div>
      </div>

      <div key={step} className="card p-8 mb-4 animate-scale-in">
        <p className="t-accent text-xs font-bold mb-4 font-mono">Q{step + 1}</p>
        <h2 className="text-xl font-black tracking-tight mb-8">{q.question}</h2>
        <div className="space-y-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => pick(opt)}
              disabled={picking}
              className={`w-full text-left subtle-bg hover:bg-accent-soft border border-transparent hover:border-accent-soft rounded-xl px-5 py-4 transition-all group animate-fade-in-up delay-${i + 1}`}
            >
              <div className="flex items-center gap-4">
                <span className="w-7 h-7 subtle-bg group-hover:bg-accent-soft group-hover:t-accent rounded-lg flex items-center justify-center text-xs font-bold font-mono transition-colors t-muted">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm t-secondary group-hover:t-accent transition-colors">{opt.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {step > 0 && (
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)) }} className="btn-ghost text-xs animate-fade-in">← 前の質問</button>
      )}
    </div>
  )
}
