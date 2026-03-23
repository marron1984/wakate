'use client'

import { useState } from 'react'
import bmtiData from '../../data/bmti.json'
import comediansData from '../../data/comedians.json'

const { axes, questions, types } = bmtiData

function getColor(c) {
  switch (c) {
    case 'accent': return { bg: 'bg-accent', soft: 'bg-accent-soft', text: 't-accent', border: 'border-accent-soft' }
    case 'gold': return { bg: 'bg-gold', soft: 'bg-gold-soft', text: 't-gold', border: 'border-gold-soft' }
    case 'purple': return { bg: 'bg-purple-500', soft: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' }
    case 'blue': return { bg: 'bg-blue-500', soft: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' }
    case 'mint': return { bg: 'bg-mint', soft: 'bg-mint-soft', text: 't-mint', border: 'border-mint-soft' }
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

/** 回答配列から4軸のスコアを算出し、BMTIコードを返す */
function calcResult(answers) {
  const axisScores = {}
  for (const ax of axes) {
    axisScores[ax.id] = { left: 0, right: 0 }
  }

  answers.forEach((ans, i) => {
    const q = questions[i]
    const side = ans.dir
    const axis = q.axis
    axisScores[axis][side] += ans.weight
  })

  let code = ''
  const breakdown = []
  for (const ax of axes) {
    const s = axisScores[ax.id]
    const isLeft = s.left >= s.right
    const letter = isLeft ? ax.left.code : ax.right.code
    const label = isLeft ? ax.left.label : ax.right.label
    const pct = Math.round(
      (Math.max(s.left, s.right) / (s.left + s.right || 1)) * 100
    )
    code += letter
    breakdown.push({ axis: ax.name, chosen: label, letter, pct, left: ax.left, right: ax.right, leftScore: s.left, rightScore: s.right })
  }

  return { code, breakdown, type: types[code] }
}

export default function BmtiPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
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
        setResult(calcResult(next))
      }
      setPicking(false)
    }, 300)
  }

  function reset() {
    setStep(0)
    setAnswers([])
    setResult(null)
  }

  const progress = ((step + (result ? 1 : 0)) / questions.length) * 100

  // ===== 結果画面 =====
  if (result) {
    const t = result.type
    const c = getColor(t.color)
    const matched = t.comedians
      .map(id => comediansData.find(x => x.id === id))
      .filter(Boolean)

    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-fade-in-up">
          <p className={`${c.text} text-[10px] font-bold tracking-[0.3em] uppercase mb-2`}>Your BMTI Result</p>
          <h1 className="text-3xl font-black tracking-tight mb-8">診断結果</h1>
        </div>

        {/* メインカード */}
        <div className={`${c.soft} border ${c.border} rounded-3xl p-8 text-center mb-8 animate-scale-in delay-1`}>
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-3`}>漫才劇場BMTI</p>
          <p className={`text-5xl font-black tracking-widest mb-4 animate-fade-in-up delay-2 ${c.text}`}>{result.code}</p>
          <h2 className="text-xl font-black tracking-tight mb-2 animate-fade-in-up delay-2">{t.name}</h2>
          <p className="text-sm t-muted mb-4 animate-fade-in delay-3">{t.tagline}</p>
          <p className="text-sm t-secondary leading-relaxed max-w-md mx-auto animate-fade-in delay-3">{t.description}</p>
        </div>

        {/* 4軸の内訳 */}
        <div className="card mb-8 animate-fade-in-up delay-2">
          <p className="text-[10px] t-muted uppercase tracking-wider mb-5">4軸の内訳</p>
          <div className="space-y-5">
            {result.breakdown.map((b, i) => {
              const total = b.leftScore + b.rightScore || 1
              const leftPct = Math.round((b.leftScore / total) * 100)
              const rightPct = 100 - leftPct
              const isLeft = b.leftScore >= b.rightScore
              return (
                <div key={b.axis} className={`animate-slide-in-left delay-${i + 1}`}>
                  <p className="text-[11px] t-muted mb-2 text-center">{b.axis}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-24 text-right">
                      <span className={`text-xs font-bold ${isLeft ? c.text : 't-muted'}`}>{b.left.label}</span>
                      <span className="text-[10px] t-muted ml-1">{leftPct}%</span>
                    </div>
                    <div className="flex-1 h-2.5 rounded-full subtle-bg overflow-hidden flex">
                      <div
                        className={`h-full rounded-l-full transition-all duration-700 ${isLeft ? c.bg : ''}`}
                        style={{ width: `${leftPct}%`, backgroundColor: isLeft ? undefined : 'rgb(var(--text-muted) / 0.3)' }}
                      />
                      <div
                        className={`h-full rounded-r-full transition-all duration-700 ${!isLeft ? c.bg : ''}`}
                        style={{ width: `${rightPct}%`, backgroundColor: !isLeft ? undefined : 'rgb(var(--text-muted) / 0.3)' }}
                      />
                    </div>
                    <div className="w-24">
                      <span className={`text-xs font-bold ${!isLeft ? c.text : 't-muted'}`}>{b.right.label}</span>
                      <span className="text-[10px] t-muted ml-1">{rightPct}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* タイプコード解説 */}
        <div className="card mb-8 animate-fade-in-up delay-3">
          <p className="text-[10px] t-muted uppercase tracking-wider mb-4">あなたのコード</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {result.breakdown.map((b, i) => (
              <div key={i} className={`${c.soft} border ${c.border} rounded-xl px-4 py-3 text-center min-w-[80px]`}>
                <p className={`text-2xl font-black ${c.text}`}>{b.letter}</p>
                <p className="text-[10px] t-muted mt-1">{b.chosen}</p>
              </div>
            ))}
          </div>
        </div>

        {/* マッチ芸人 */}
        <div className="mb-10 animate-fade-in-up delay-4">
          <p className={`${c.text} text-[10px] font-bold tracking-[0.2em] uppercase mb-1`}>Best Match</p>
          <h3 className="section-title mb-4">あなたと同じタイプの芸人</h3>
          <div className="space-y-2">
            {matched.map((comedian, i) => (
              <a
                key={comedian.id}
                href={`/comedians/${comedian.id}`}
                className={`card group flex items-center gap-4 animate-fade-in-up delay-${Math.min(i + 5, 8)} ${i === 0 ? `border ${c.border}` : ''}`}
              >
                {i === 0 && (
                  <span className={`${c.soft} ${c.text} text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse-glow`}>BEST</span>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm group-hover:t-accent transition-colors">{comedian.name}</p>
                  <p className="text-[11px] t-muted">{comedian.members.join(' / ')} — {comedian.category}</p>
                </div>
                <span className={`badge text-[10px] ${getRankBadge(comedian.rank)}`}>{comedian.rank}</span>
              </a>
            ))}
          </div>
        </div>

        {/* 全16タイプ一覧 */}
        <div className="mb-10 animate-fade-in-up delay-5">
          <h3 className="section-title mb-4">全16タイプ</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {Object.entries(types).map(([code, tp]) => {
              const tc = getColor(tp.color)
              const isMine = code === result.code
              return (
                <div
                  key={code}
                  className={`rounded-xl p-3 text-center transition-all ${
                    isMine ? `${tc.soft} border ${tc.border} ring-2 ring-offset-1` : 'subtle-bg'
                  }`}
                  style={isMine ? { ringColor: 'rgb(var(--accent))' } : {}}
                >
                  <p className={`text-sm font-black font-mono ${isMine ? tc.text : 't-muted'}`}>{code}</p>
                  <p className={`text-[10px] mt-0.5 ${isMine ? '' : 't-muted'}`} style={{ opacity: isMine ? 1 : 0.6 }}>{tp.name}</p>
                  {isMine && <span className={`inline-block mt-1 text-[9px] font-bold ${tc.text}`}>← あなた</span>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center animate-fade-in delay-6">
          <button onClick={reset} className="btn-primary">もう一度診断する</button>
          <a href="/compatibility" className="btn-outline">芸人相性チェック</a>
          <a href="/comedians" className="btn-outline">芸人一覧</a>
        </div>
      </div>
    )
  }

  // ===== 質問画面 =====
  const q = questions[step]
  const axisInfo = axes.find(a => a.id === q.axis)

  return (
    <div className="max-w-2xl mx-auto">
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Manzai Theater BMTI</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">漫才劇場BMTI</h1>
        <p className="text-sm t-muted mb-8">8問の質問で、あなたの「お笑い人格タイプ」を診断</p>
      </div>

      <div className="mb-10 animate-fade-in delay-1">
        <div className="flex justify-between text-xs t-muted mb-2">
          <span className="font-mono">{step + 1} / {questions.length}</span>
          <span className="tag text-[10px]">{axisInfo.name}</span>
          <span className="font-mono">{Math.round(progress)}%</span>
        </div>
        <div className="w-full rounded-full h-1 subtle-bg">
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: 'rgb(var(--accent))' }}
          />
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
        <button onClick={() => { setStep(step - 1); setAnswers(answers.slice(0, -1)) }} className="btn-ghost text-xs animate-fade-in">
          ← 前の質問
        </button>
      )}
    </div>
  )
}
