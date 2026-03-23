import './globals.css'
import { ThemeProvider } from './theme-provider'
import ThemeSwitcher from './theme-switcher'
import MobileNav from './mobile-nav'
import DesktopNav from './desktop-nav'

export const metadata = {
  title: 'WAKATE — よしもと漫才劇場',
  description: 'よしもと漫才劇場の若手芸人・公演情報・イベント情報を発信するニュースサイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" data-theme="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <ThemeProvider>
          <header className="fixed top-0 w-full z-50 glass">
            <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
              <a href="/" className="font-black text-lg tracking-tighter">
                WAKA<span className="t-accent">TE</span>
              </a>

              {/* Desktop nav */}
              <DesktopNav />

              {/* Mobile nav */}
              <div className="flex sm:hidden items-center gap-2">
                <ThemeSwitcher />
                <MobileNav />
              </div>
            </nav>
          </header>
          <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 min-h-screen">
            {children}
          </main>
          <footer style={{ borderTop: '1px solid rgb(var(--border))' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
                <div>
                  <p className="font-black text-sm tracking-tighter mb-1">WAKA<span className="t-accent">TE</span></p>
                  <p className="text-xs t-muted">※ ファンメイドサイトです。吉本興業公式ではありません。</p>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-xs t-muted">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider t-accent">公演</p>
                    <a href="/events" className="block hover:t-accent transition-colors">公演情報</a>
                    <a href="/calendar" className="block hover:t-accent transition-colors">カレンダー</a>
                    <a href="/theaters" className="block hover:t-accent transition-colors">劇場案内</a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider t-accent">芸人</p>
                    <a href="/comedians" className="block hover:t-accent transition-colors">芸人一覧</a>
                    <a href="/nsc" className="block hover:t-accent transition-colors">NSC期別</a>
                    <a href="/interviews" className="block hover:t-accent transition-colors">インタビュー</a>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider t-accent">コンテンツ</p>
                    <a href="/glossary" className="block hover:t-accent transition-colors">用語辞典</a>
                    <a href="/bmti" className="block hover:t-accent transition-colors">BMTI診断</a>
                    <a href="/compatibility" className="block hover:t-accent transition-colors">相性診断</a>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
