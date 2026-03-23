import './globals.css'
import { ThemeProvider } from './theme-provider'
import ThemeSwitcher from './theme-switcher'

export const metadata = {
  title: 'WAKATE — よしもと漫才劇場',
  description: 'よしもと漫才劇場の若手芸人・公演情報・イベント情報を発信するニュースサイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" data-theme="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <header className="fixed top-0 w-full z-50 glass">
            <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <a href="/" className="font-black text-lg tracking-tighter">
                WAKA<span className="t-accent">TE</span>
              </a>
              <div className="flex items-center gap-1">
                <a href="/" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">Home</a>
                <a href="/events" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">Events</a>
                <a href="/comedians" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">Comedians</a>
                <a href="/theaters" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-surface-hover">Theater</a>
                <a href="/compatibility" className="bg-gold-soft t-gold hover:opacity-80 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all">Diagnosis</a>
                <div className="ml-2">
                  <ThemeSwitcher />
                </div>
              </div>
            </nav>
          </header>
          <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 min-h-screen">
            {children}
          </main>
          <footer style={{ borderTop: '1px solid rgb(var(--border))' }}>
            <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-black text-sm tracking-tighter">WAKA<span className="t-accent">TE</span></p>
                <p className="text-xs t-muted mt-1">Fan-made site. Not affiliated with Yoshimoto Kogyo.</p>
              </div>
              <div className="flex gap-6 text-xs t-muted">
                <a href="/events" className="hover:t-accent transition-colors">Events</a>
                <a href="/comedians" className="hover:t-accent transition-colors">Comedians</a>
                <a href="/compatibility" className="hover:t-accent transition-colors">Diagnosis</a>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
