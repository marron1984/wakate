import './globals.css'

export const metadata = {
  title: 'ワカテNEWS - よしもと漫才劇場ニュースサイト',
  description: 'よしもと漫才劇場の若手芸人・公演情報・イベント情報を発信するニュースサイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-yoshimoto-black text-white sticky top-0 z-50">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold">
              <span className="text-yoshimoto-red">ワカテ</span>NEWS
              <span className="text-xs text-gray-400 ml-2 hidden sm:inline">よしもと漫才劇場</span>
            </a>
            <ul className="flex gap-4 sm:gap-6 text-sm font-medium">
              <li><a href="/" className="hover:text-yoshimoto-red transition-colors">ホーム</a></li>
              <li><a href="/events" className="hover:text-yoshimoto-red transition-colors">公演情報</a></li>
              <li><a href="/comedians" className="hover:text-yoshimoto-red transition-colors">芸人一覧</a></li>
              <li><a href="/theaters" className="hover:text-yoshimoto-red transition-colors">劇場案内</a></li>
            </ul>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8 min-h-screen">
          {children}
        </main>
        <footer className="bg-yoshimoto-black text-gray-400 text-sm">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            <p>&copy; 2026 ワカテNEWS - よしもと漫才劇場ニュースサイト</p>
            <p className="mt-1">※ このサイトはファンメイドのサンプルサイトです。公式サイトではありません。</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
