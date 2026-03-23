import theatersData from '../../data/theaters.json'

export const metadata = {
  title: '劇場情報 - ワカテNEWS',
}

export default function TheatersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">劇場情報</h1>
      <p className="text-gray-500 mb-8">吉本の若手芸人が活躍する主要劇場の一覧です</p>

      <div className="space-y-6">
        {theatersData.map((theater) => (
          <article key={theater.id} className="card">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🎭</span>
                  <h2 className="text-xl font-bold">{theater.name}</h2>
                  <span className="badge-gray text-xs">{theater.shortName}</span>
                </div>
                <p className="text-gray-600 mb-4">{theater.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">📍 住所</span>
                    <p className="text-gray-500">{theater.address}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">🚃 アクセス</span>
                    <p className="text-gray-500">{theater.access}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">💺 キャパシティ</span>
                    <p className="text-gray-500">{theater.capacity}席</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {theater.features.map((feature) => (
                    <span key={feature} className="badge bg-yoshimoto-red/10 text-yoshimoto-red text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
