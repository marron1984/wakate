import theatersData from '../../data/theaters.json'
import comediansData from '../../data/comedians.json'
import eventsData from '../../data/events.json'

export const metadata = { title: '劇場案内 — WAKATE' }

export default function TheatersPage() {
  return (
    <div>
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Theaters</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">劇場案内</h1>
        <p className="text-sm t-muted mb-10">よしもと漫才劇場と関連劇場</p>
      </div>

      <div className="space-y-8">
        {theatersData.map((theater, ti) => {
          const tC = comediansData.filter(c => c.homeTheater === theater.id)
          const tE = eventsData.filter(e => e.theater === theater.id).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
          return (
            <article key={theater.id} className={`card p-8 animate-fade-in-up delay-${ti + 1}`}>
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight mb-1">{theater.name}</h2>
                <p className="text-xs t-muted">{theater.openYear}年 / {theater.capacity}席</p>
              </div>
              <p className="text-sm t-secondary leading-relaxed mb-6">{theater.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                {[['Address', theater.address], ['Access', theater.access]].map(([l, v]) => (
                  <div key={l} className="subtle-bg rounded-xl p-4">
                    <p className="text-[10px] t-muted uppercase tracking-wider mb-1">{l}</p>
                    <p className="text-xs">{v}</p>
                  </div>
                ))}
              </div>
              {theater.liveTypes.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Live Types</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {theater.liveTypes.map(lt => (
                      <div key={lt.name} className="subtle-bg rounded-xl p-3">
                        <p className="text-xs font-medium mb-0.5">{lt.name}</p>
                        <p className="text-[11px] t-muted">{lt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {tC.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Comedians ({tC.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tC.map(c => <a key={c.id} href={`/comedians/${c.id}`} className="tag hover:bg-accent-soft hover:t-accent transition-colors">{c.name}</a>)}
                  </div>
                </div>
              )}
              {tE.length > 0 && (
                <div>
                  <p className="text-[10px] t-muted uppercase tracking-wider mb-3">Upcoming</p>
                  <div className="space-y-2">
                    {tE.map(ev => (
                      <div key={ev.id} className="subtle-bg rounded-xl p-3 flex items-center gap-4">
                        <div className="text-center min-w-[48px]">
                          <p className="text-[10px] t-muted font-mono">{ev.date.slice(5)}</p>
                          <p className="text-xs font-bold font-mono">{ev.startTime}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium">{ev.title}</p>
                          <p className="text-[11px] t-muted">¥{ev.price.toLocaleString()} / {ev.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <a href="/events" className="btn-ghost text-xs mt-3 inline-block">All events →</a>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </div>
  )
}
