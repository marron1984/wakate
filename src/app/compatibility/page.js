'use client'

import { useState } from 'react'
import compatibilityData from '../../data/compatibility.json'
import comediansData from '../../data/comedians.json'

const questions = compatibilityData.questions
const results = compatibilityData.results

function getTypeEmoji(type) {
  switch (type) {
    case 'energy': return '🔥'
    case 'classic': return '🎙️'
    case 'unique': return '🌀'
    case 'intellectual': return '🧠'
    case 'warm': return '☀️'
    default: return '🎤'
  }
}

function getTypeColor(type) {
  switch (type) {
    case 'energy': return { bg: 'bg-red-500', light: 'bg-red-50', border: 'border-red-400', text: 'text-red-600' }
    case 'classic': return { bg: 'bg-yoshimoto-gold', light: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-700' }
    case 'unique': return { bg: 'bg-purple-500', light: 'bg-purple-50', border: 'border-purple-400', text: 'text-purple-600' }
    case 'intellectual': return { bg: 'bg-blue-500', light: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-600' }
    case 'warm': return { bg: 'bg-orange-400', light: 'bg-orange-50', border: 'border-orange-400', text: 'text-orange-600' }
    default: return { bg: 'bg-gray-500', light: 'bg-gray-50', border: 'border-gray-400', text: 'text-gray-600' }
  }
}

function getRankBadge(rank) {
  switch (rank) {
    case 'S': return 'bg-yoshimoto-gold text-white'
    case 'A': return 'bg-yoshimoto-red text-white'
    case 'B': return 'bg-blue-500 text-white'
    case 'C': return 'bg-green-500 text-white'
    case 'D': return 'bg-emerald-500 text-white'
    default: return 'bg-gray-300 text-gray-700'
  }
}

export default function CompatibilityPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState(null)
  const [scores, setScores] = useState(null)

  function handleAnswer(option) {
    const newAnswers = [...answers, option]
    setAnswers(newAnswers)

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculateResult(newAnswers)
    }
  }

  function calculateResult(allAnswers) {
    const totalScores = { energy: 0, classic: 0, unique: 0, intellectual: 0, warm: 0 }

    allAnswers.forEach((answer) => {
      Object.entries(answer.scores).forEach(([key, value]) => {
        totalScores[key] += value
      })
    })

    const maxType = Object.entries(totalScores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    const matched = results.find(r => r.type === maxType)

    setScores(totalScores)
    setResult(matched)
  }

  function handleReset() {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setScores(null)
  }

  const progress = ((currentQuestion + (result ? 1 : 0)) / questions.length) * 100

  // 結果画面
  if (result) {
    const color = getTypeColor(result.type)
    const matchedComedians = result.comedians
      .map(id => comediansData.find(c => c.id === id))
      .filter(Boolean)

    const maxScore = Math.max(...Object.values(scores))
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1])

    return (
      <div>
        <h1 className="text-3xl font-bold mb-2">芸人相性チェック</h1>
        <p className="text-gray-500 mb-8">あなたの診断結果</p>

        {/* メイン結果 */}
        <div className={`rounded-2xl ${color.light} border-2 ${color.border} p-8 mb-8 text-center`}>
          <p className="text-6xl mb-4">{getTypeEmoji(result.type)}</p>
          <p className={`text-sm font-bold ${color.text} mb-2`}>あなたのお笑いタイプは...</p>
          <h2 className="text-3xl font-bold mb-4">{result.label}</h2>
          <p className="text-gray-600 max-w-lg mx-auto leading-relaxed">{result.description}</p>
        </div>

        {/* スコア内訳 */}
        <div className="card mb-8">
          <h3 className="font-bold text-lg mb-4">タイプ別スコア</h3>
          <div className="space-y-3">
            {sortedScores.map(([type, score]) => {
              const typeResult = results.find(r => r.type === type)
              const typeColor = getTypeColor(type)
              const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium">
                      {getTypeEmoji(type)} {typeResult?.label}
                    </span>
                    <span className={`font-bold ${typeColor.text}`}>{score}pt</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className={`${typeColor.bg} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* マッチした芸人 */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-yoshimoto-red pl-3">
            あなたと相性の良い芸人
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {matchedComedians.map((comedian, index) => (
              <a
                key={comedian.id}
                href={`/comedians/${comedian.id}`}
                className={`card hover:border-2 border-2 border-transparent ${
                  index === 0 ? `hover:${color.border} ring-2 ${color.border}` : 'hover:border-yoshimoto-red'
                } relative`}
              >
                {index === 0 && (
                  <span className={`absolute -top-3 -right-3 ${color.bg} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                    BEST MATCH
                  </span>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎤</span>
                  <div>
                    <h4 className="font-bold">{comedian.name}</h4>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${getRankBadge(comedian.rank)}`}>{comedian.rank}</span>
                      <span className="text-xs text-gray-500">{comedian.category}</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-2">{comedian.members.join('・')}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{comedian.description}</p>
                {comedian.achievements[0] && (
                  <p className="text-xs text-yoshimoto-red mt-2">🏆 {comedian.achievements[0]}</p>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* アクション */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleReset}
            className="bg-yoshimoto-red hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
          >
            もう一度診断する
          </button>
          <a
            href="/comedians"
            className="border-2 border-gray-300 hover:border-yoshimoto-red text-gray-700 hover:text-yoshimoto-red px-8 py-3 rounded-lg font-bold transition-colors"
          >
            芸人一覧を見る
          </a>
          <a
            href="/events"
            className="border-2 border-gray-300 hover:border-yoshimoto-red text-gray-700 hover:text-yoshimoto-red px-8 py-3 rounded-lg font-bold transition-colors"
          >
            公演スケジュールを見る
          </a>
        </div>
      </div>
    )
  }

  // 質問画面
  const q = questions[currentQuestion]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">芸人相性チェック</h1>
      <p className="text-gray-500 mb-8">7つの質問に答えて、あなたと相性の良い漫才劇場の芸人を見つけよう！</p>

      {/* プログレスバー */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Q{currentQuestion + 1} / {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-yoshimoto-red h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 質問カード */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <p className="text-yoshimoto-red font-bold text-sm mb-3">Question {currentQuestion + 1}</p>
          <h2 className="text-2xl font-bold mb-8">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="w-full text-left bg-gray-50 hover:bg-yoshimoto-red/5 hover:border-yoshimoto-red border-2 border-gray-200 rounded-xl px-6 py-4 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-200 group-hover:bg-yoshimoto-red group-hover:text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">{option.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 戻るボタン */}
        {currentQuestion > 0 && (
          <button
            onClick={() => {
              setCurrentQuestion(currentQuestion - 1)
              setAnswers(answers.slice(0, -1))
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 前の質問に戻る
          </button>
        )}
      </div>
    </div>
  )
}
