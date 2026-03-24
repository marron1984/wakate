'use client'

import { useState } from 'react'
import theatersData from '../../data/theaters.json'
import comediansData from '../../data/comedians.json'
import eventsData from '../../data/events.json'

const regions = ['すべて', '関西', '関東', '九州・沖縄']

const regionColors = {
  '関西': { text: 't-accent', bg: 'bg-accent-soft' },
  '関東': { text: 't-sub', bg: 'bg-sub-soft' },
  '九州・沖縄': { text: 'text-emerald-400', bg: 'bg-emerald-400/10' },
}

export default function TheatersPage() {
  const [activeRegion, setActiveRegion] = useState('すべて')

  const filtered = activeRegion === 'すべて'
    ? theatersData
    : theatersData.filter(t => t.region === activeRegion)

  const grouped = {}
  for (const t of filtered) {
    if (!grouped[t.region]) grouped[t.region] = []
    grouped[t.region].push(t)
  }

  const totalCapacity = theatersData.reduce((s, t) => s + t.capacity, 0)

  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Nationwide Theaters</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">全国劇場</h1>
        <p className="text-sm t-muted mb-6">全国{theatersData.length}劇場のよしもとお笑いネットワーク</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8 animate-fade-in-up delay-1">
        {[
          { label: '劇場数', value: `${theatersData.length}`, unit: '劇場' },
          { label: '総座席数', value: totalCapacity.toLocaleString(), unit: '席' },
          { label: 'エリア', value: `${Object.keys(regionColors).length}`, unit: '地域' },
        ].map(s => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-xl font-black t-accent">{s.value}</p>
            <p className="text-[10px] t-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Region Filter */}
      <div className="flex flex-wrap gap-1.5 mb-8 animate-fade-in-up delay-2">
        {regions.map(r => (
          <button
            key={r}
            onClick={() => setActiveRegion(r)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all ${
              activeRegion === r
                ? 'bg-accent-soft t-accent border-[rgb(var(--accent)/0.3)]'
                : 'border-[rgb(var(--border))] t-muted hover:border-[rgb(var(--border-hover))]'
            }`}
          >
            {r}
            {r !== 'すべて' && (
              <span className="ml-1 opacity-60">
                {theatersData.filter(t => t.region === r).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Theater List by Region */}
      <div className="space-y-10">
        {Object.entries(grouped).map(([region, theaters]) => {
          const rc = regionColors[region] || { text: 't-muted', bg: 'bg-surface-hover' }
          return (
            <section key={region}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className={`text-lg font-black ${rc.text}`}>{region}</h2>
                <div className="flex-1 h-px bg-[rgb(var(--border))]" />
                <span className="text-[10px] t-muted">{theaters.length}劇場</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {theaters.map((theater, ti) => {
                  const tC = comediansData.filter(c => c.homeTheater === theater.id)
                  const tE = eventsData
                    .filter(e => e.theater === theater.id)
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .slice(0, 2)

                  return (
                    <article
                      key={theater.id}
                      className={`card p-6 animate-fade-in-up delay-${(ti % 4) + 1}`}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <h3 className="text-lg font-black tracking-tight leading-tight">
                            {theater.name}
                          </h3>
                          <p className="text-[11px] t-muted mt-0.5">
                            {theater.prefecture} / {theater.openYear}年〜 / {theater.capacity}席
                          </p>
                        </div>
                        <span className={`badge ${rc.bg} ${rc.text} shrink-0`}>
                          {theater.shortName}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs t-secondary leading-relaxed mb-4">
                        {theater.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {theater.features.map(f => (
                          <span key={f} className="tag text-[10px]">{f}</span>
                        ))}
                      </div>

                      {/* Access Info */}
                      <div className="space-y-2 mb-4">
                        <div className="subtle-bg rounded-lg p-3">
                          <p className="text-[9px] t-muted uppercase tracking-wider mb-0.5">Address</p>
                          <p className="text-[11px]">{theater.address}</p>
                        </div>
                        <div className="subtle-bg rounded-lg p-3">
                          <p className="text-[9px] t-muted uppercase tracking-wider mb-0.5">Access</p>
                          <p className="text-[11px]">{theater.access}</p>
                        </div>
                      </div>

                      {/* Live Types */}
                      {theater.liveTypes.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[9px] t-muted uppercase tracking-wider mb-2">Live Types</p>
                          <div className="space-y-1.5">
                            {theater.liveTypes.map(lt => (
                              <div key={lt.name} className="subtle-bg rounded-lg p-2.5">
                                <p className="text-[11px] font-medium">{lt.name}</p>
                                <p className="text-[10px] t-muted mt-0.5">{lt.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Associated Comedians */}
                      {tC.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[9px] t-muted uppercase tracking-wider mb-2">
                            所属芸人 ({tC.length}組)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {tC.slice(0, 8).map(c => (
                              <a
                                key={c.id}
                                href={`/comedians/${c.id}`}
                                className="tag text-[10px] hover:bg-accent-soft hover:t-accent transition-colors"
                              >
                                {c.name}
                              </a>
                            ))}
                            {tC.length > 8 && (
                              <span className="tag text-[10px] t-muted">+{tC.length - 8}組</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Upcoming Events */}
                      {tE.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[9px] t-muted uppercase tracking-wider mb-2">Upcoming</p>
                          <div className="space-y-1.5">
                            {tE.map(ev => (
                              <div key={ev.id} className="subtle-bg rounded-lg p-2.5 flex items-center gap-3">
                                <div className="text-center min-w-[40px]">
                                  <p className="text-[9px] t-muted font-mono">{ev.date.slice(5)}</p>
                                  <p className="text-[11px] font-bold font-mono">{ev.startTime}</p>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium truncate">{ev.title}</p>
                                  <p className="text-[10px] t-muted">
                                    ¥{ev.price.toLocaleString()} / {ev.status}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Website Link */}
                      {theater.website && (
                        <a
                          href={theater.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-ghost text-[11px] inline-flex items-center gap-1"
                        >
                          公式サイト
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <path d="M3 1h6v6M9 1L1 9" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      )}
                    </article>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
