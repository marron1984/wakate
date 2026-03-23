import comediansData from '../../data/comedians.json'

const RANK_ORDER = ['S', 'A', 'B', 'C', 'D']
const RANK_LABEL = { S: 'Sランク', A: 'Aランク', B: 'Bランク', C: 'Cランク', D: 'Dランク（超若手）' }

const SNS_META = {
  x: { label: 'X', icon: '𝕏', style: 'hover:bg-[#1da1f2]/10 hover:text-[#1da1f2]' },
  youtube: { label: 'YouTube', icon: '▶', style: 'hover:bg-red-500/10 hover:text-red-400' },
  instagram: { label: 'Instagram', icon: '📷', style: 'hover:bg-pink-500/10 hover:text-pink-400' },
  tiktok: { label: 'TikTok', icon: '♪', style: 'hover:bg-cyan-500/10 hover:text-cyan-400' },
}

export const metadata = {
  title: '芸人SNSまとめ | WAKATE.Fun',
}

export default function SnsPage() {
  const grouped = RANK_ORDER.map(rank => ({
    rank,
    label: RANK_LABEL[rank],
    comedians: comediansData.filter(c => c.rank === rank && c.sns),
  })).filter(g => g.comedians.length > 0)

  const totalAccounts = comediansData.reduce((sum, c) => sum + (c.sns ? Object.keys(c.sns).length : 0), 0)

  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-fade-in-up">
        <p className="t-accent text-[10px] font-bold tracking-[0.3em] uppercase mb-2">SNS</p>
        <h1 className="text-3xl font-black tracking-tight mb-2">芸人SNSまとめ</h1>
        <p className="text-sm t-muted mb-8">{comediansData.length}組 / {totalAccounts}アカウント</p>
      </div>

      {/* SNS platform legend */}
      <div className="flex flex-wrap gap-2 mb-8 animate-fade-in delay-1">
        {Object.entries(SNS_META).map(([key, meta]) => (
          <span key={key} className="tag text-xs">
            <span className="mr-1">{meta.icon}</span>{meta.label}
          </span>
        ))}
      </div>

      {/* Grouped by rank */}
      <div className="space-y-8">
        {grouped.map((group, gi) => (
          <div key={group.rank} className={`animate-fade-in-up delay-${Math.min(gi + 1, 4)}`}>
            <h2 className="section-bar mb-4">{group.label}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.comedians.map(c => (
                <div key={c.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <a href={`/comedians/${c.id}`} className="font-bold text-sm hover:t-accent transition-colors">{c.name}</a>
                      <p className="text-[10px] t-muted mt-0.5">{c.members.join('・')} — {c.category}</p>
                    </div>
                    <span className="badge bg-accent-soft t-accent text-[9px] shrink-0">{c.rank}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(c.sns).map(([platform, url]) => {
                      const meta = SNS_META[platform]
                      if (!meta) return null
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-colors t-secondary ${meta.style}`}
                          style={{ borderColor: 'rgb(var(--border))' }}
                        >
                          <span>{meta.icon}</span>
                          <span>{meta.label}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
