import './globals.css'
import { ThemeProvider } from './theme-provider'
import ThemeSwitcher from './theme-switcher'
import MobileNav from './mobile-nav'

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
              <div className="hidden sm:flex items-center gap-1">
                <a href="/" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">ホーム</a>
                <a href="/events" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">公演情報</a>
                <a href="/comedians" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">芸人一覧</a>
                <a href="/theaters" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">劇場案内</a>
                <a href="/compatibility" className="bg-gold-soft t-gold hover:opacity-80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">相性診断</a>
                <div className="ml-2">
                  <ThemeSwitcher />
                </div>
              </div>

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
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-black text-sm tracking-tighter">WAKA<span className="t-accent">TE</span></p>
                <p className="text-xs t-muted mt-1">※ ファンメイドサイトです。吉本興業公式ではありません。</p>
              </div>
              <div className="flex gap-6 text-xs t-muted">
                <a href="/events" className="hover:t-accent transition-colors">公演情報</a>
                <a href="/comedians" className="hover:t-accent transition-colors">芸人一覧</a>
                <a href="/compatibility" className="hover:t-accent transition-colors">相性診断</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
