import './globals.css'

export const metadata = {
  title: 'ワカテNEWS - 吉本若手芸人ニュースサイト',
  description: '吉本興業の若手芸人にフォーカスしたニュース・劇場情報サイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-yoshimoto-black text-white">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">
              <span className="text-yoshimoto-red">ワカテ</span>NEWS
            </a>
            <ul className="flex gap-6 text-sm font-medium">
              <li><a href="/" className="hover:text-yoshimoto-red transition-colors">ホーム</a></li>
              <li><a href="/theaters" className="hover:text-yoshimoto-red transition-colors">劇場情報</a></li>
              <li><a href="/comedians" className="hover:text-yoshimoto-red transition-colors">芸人一覧</a></li>
            </ul>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="bg-yoshimoto-black text-gray-400 text-sm">
          <div className="max-w-6xl mx-auto px-4 py-6 text-center">
            <p>&copy; 2026 ワカテNEWS - 吉本若手芸人ニュースサイト</p>
            <p className="mt-1">※ このサイトはファンメイドのサンプルサイトです</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
