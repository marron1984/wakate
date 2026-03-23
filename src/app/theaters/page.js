import theatersData from '../../data/theaters.json'
import comediansData from '../../data/comedians.json'
import eventsData from '../../data/events.json'

export const metadata = { title: '劇場案内 — WAKATE' }

export default function TheatersPage() {
  return (
    <div>
      <p className="text-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Theaters</p>
      <h1 className="text-3xl font-black tracking-tight mb-2">劇場案内</h1>
      <p className="text-sm text-muted mb-10">よしもと漫才劇場と関連劇場</p>

      <div className="space-y-8">
        {theatersData.map((theater) => {
          const tComedians = comediansData.filter(c => c.homeTheater === theater.id)
          const tEvents = eventsData.filter(e => e.theater === theater.id).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3)
          return (
            <article key={theater.id} className="card p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-black tracking-tight mb-1">{theater.name}</h2>
                <p className="text-xs text-muted">{theater.openYear}年 / {theater.capacity}席</p>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-6">{theater.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Address</p>
                  <p className="text-xs">{theater.address}</p>
                </div>
                <div className="bg-white/[0.03] rounded-xl p-4">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Access</p>
                  <p className="text-xs">{theater.access}</p>
                </div>
              </div>

              {theater.liveTypes.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Live Types</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {theater.liveTypes.map((lt) => (
                      <div key={lt.name} className="bg-white/[0.03] rounded-xl p-3">
                        <p className="text-xs font-medium mb-0.5">{lt.name}</p>
                        <p className="text-[11px] text-muted">{lt.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tComedians.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Comedians ({tComedians.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tComedians.map((c) => (
                      <a key={c.id} href={`/comedians/${c.id}`} className="tag hover:bg-accent/10 hover:text-accent transition-colors">{c.name}</a>
                    ))}
                  </div>
                </div>
              )}

              {tEvents.length > 0 && (
                <div>
                  <p className="text-[10px] text-muted uppercase tracking-wider mb-3">Upcoming</p>
                  <div className="space-y-2">
                    {tEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 bg-white/[0.03] rounded-xl p-3">
                        <div className="text-center min-w-[48px]">
                          <p className="text-[10px] text-muted font-mono">{event.date.slice(5)}</p>
                          <p className="text-xs font-bold font-mono">{event.startTime}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium">{event.title}</p>
                          <p className="text-[11px] text-muted">¥{event.price.toLocaleString()} / {event.status}</p>
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
