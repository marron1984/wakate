'use client'

import { useState } from 'react'
import eventsData from '../../data/events.json'
import comediansData from '../../data/comedians.json'

const WEEKDAYS = ['月', '火', '水', '木', '金', '土', '日']

function getTypeStyle(type) {
  switch (type) {
    case 'ネタライブ': return 'bg-accent-soft t-accent border-accent-soft'
    case 'バトルライブ': return 'bg-gold-soft t-gold border-gold-soft'
    case '単独ライブ': return 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    case '企画ライブ': return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    case '特別公演': return 'bg-mint-soft t-mint border-mint-soft'
    default: return 'tag'
  }
}

function getStatusStyle(s) {
  switch (s) {
    case '販売中': return 't-accent'
    case '近日発売': return 't-gold'
    case '完売': return 't-muted'
    default: return 't-muted'
  }
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1 // Monday = 0
}

export default function CalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(null)

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const monthStr = `${year}-${String(month + 1).padStart(2, '0')}`
  const monthEvents = eventsData.filter(e => e.date.startsWith(monthStr))

  function eventsOnDay(day) {
    const ds = `${monthStr}-${String(day).padStart(2, '0')}`
    return monthEvents.filter(e => e.date === ds)
  }

  function prevMonth() {
    setSelected(null)
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }

  function nextMonth() {
    setSelected(null)
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  function goToday() {
    setSelected(null)
    setYear(today.getFullYear())
    setMonth(today.getMonth())
  }

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const selectedEvents = selected ? eventsOnDay(selected) : []

  // Build cells
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Calendar</p>
        <h1 className="text-3xl font-black tracking-tight mb-8">公演カレンダー</h1>
      </div>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6 animate-fade-in delay-1">
        <button onClick={prevMonth} className="btn-ghost text-sm px-3 py-1.5">← 前月</button>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black tracking-tight">
            {year}年{month + 1}月
          </h2>
          <button onClick={goToday} className="tag text-[10px] hover:bg-accent-soft hover:t-accent transition-colors cursor-pointer">今月</button>
        </div>
        <button onClick={nextMonth} className="btn-ghost text-sm px-3 py-1.5">翌月 →</button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mb-4 animate-fade-in delay-1">
        {['ネタライブ', 'バトルライブ', '単独ライブ', '企画ライブ', '特別公演'].map(t => (
          <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${getTypeStyle(t)}`}>{t}</span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="card p-4 sm:p-6 mb-6 animate-scale-in delay-1">
        {/* Header */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((w, i) => (
            <div key={w} className={`text-center text-[11px] font-bold py-2 ${i === 5 ? 'text-blue-400' : i === 6 ? 't-accent' : 't-muted'}`}>
              {w}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-px">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} />

            const dayEvents = eventsOnDay(day)
            const dayStr = `${monthStr}-${String(day).padStart(2, '0')}`
            const isToday = dayStr === todayStr
            const isSelected = day === selected
            const dayOfWeek = (firstDay + day - 1) % 7

            return (
              <button
                key={day}
                onClick={() => setSelected(day === selected ? null : day)}
                className={`relative min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-xl text-left transition-all border ${
                  isSelected
                    ? 'border-accent-soft bg-accent-soft'
                    : dayEvents.length > 0
                      ? 'border-transparent hover:border-accent-soft hover:bg-accent-soft/50'
                      : 'border-transparent'
                }`}
              >
                <span className={`text-xs font-bold block mb-1 ${
                  isToday ? 'bg-accent text-white w-5 h-5 rounded-full flex items-center justify-center' :
                  dayOfWeek === 5 ? 'text-blue-400' :
                  dayOfWeek === 6 ? 't-accent' : 't-secondary'
                }`}>
                  {day}
                </span>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map(ev => (
                    <div key={ev.id} className={`text-[8px] sm:text-[9px] font-bold px-1 py-0.5 rounded truncate ${getTypeStyle(ev.type)}`}>
                      <span className="hidden sm:inline">{ev.title.length > 10 ? ev.title.slice(0, 10) + '…' : ev.title}</span>
                      <span className="sm:hidden">{ev.type.slice(0, 2)}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="text-[8px] t-muted text-center">+{dayEvents.length - 3}</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selected && (
        <div className="mb-8 animate-fade-in-up">
          <h3 className="section-title mb-4">
            {month + 1}月{selected}日の公演
            {selectedEvents.length === 0 && <span className="text-sm t-muted font-normal ml-2">公演なし</span>}
          </h3>
          <div className="space-y-3">
            {selectedEvents.map(ev => {
              const performers = ev.performers
                .map(id => comediansData.find(x => x.id === id))
                .filter(Boolean)

              return (
                <div key={ev.id} className="card p-5 animate-fade-in-up">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2 ${getTypeStyle(ev.type)}`}>{ev.type}</span>
                      <h4 className="font-black text-base tracking-tight">{ev.title}</h4>
                    </div>
                    <span className={`text-[11px] font-bold whitespace-nowrap ${getStatusStyle(ev.status)}`}>{ev.status}</span>
                  </div>

                  <p className="text-sm t-muted mb-3">{ev.description}</p>

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs t-muted mb-3">
                    <span>🕐 {ev.startTime}〜{ev.endTime}</span>
                    <span>💴 ¥{ev.price.toLocaleString()}</span>
                    {ev.ticketUrl && ev.status === '販売中' && (
                      <a href={ev.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-primary ml-auto">チケットを購入</a>
                    )}
                    {ev.ticketUrl && ev.status === '近日発売' && (
                      <span className="ml-auto text-[11px] t-muted border rounded px-2.5 py-1" style={{ borderColor: 'rgb(var(--border))' }}>近日発売</span>
                    )}
                  </div>

                  {performers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {performers.map(c => (
                        <a key={c.id} href={`/comedians/${c.id}`} className="tag text-[10px] hover:bg-accent-soft hover:t-accent transition-colors">
                          {c.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Monthly summary */}
      <div className="card p-5 animate-fade-in-up delay-2">
        <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Monthly Summary</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div>
            <span className="t-muted text-xs">公演数</span>
            <p className="font-black text-lg">{monthEvents.length}</p>
          </div>
          {['ネタライブ', 'バトルライブ', '単独ライブ', '企画ライブ', '特別公演'].map(t => {
            const count = monthEvents.filter(e => e.type === t).length
            if (count === 0) return null
            return (
              <div key={t}>
                <span className="t-muted text-xs">{t}</span>
                <p className="font-black text-lg">{count}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
