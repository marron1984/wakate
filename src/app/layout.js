import './globals.css'

export const metadata = {
  title: 'WAKATE — よしもと漫才劇場',
  description: 'よしもと漫才劇場の若手芸人・公演情報・イベント情報を発信するニュースサイト',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>
        <header className="fixed top-0 w-full z-50 bg-bg/80 backdrop-blur-xl border-b border-border">
          <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-black text-lg tracking-tighter">
              WAKA<span className="text-accent">TE</span>
            </a>
            <ul className="flex items-center gap-1">
              <li><a href="/" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-white/5">Home</a></li>
              <li><a href="/events" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-white/5">Events</a></li>
              <li><a href="/comedians" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-white/5">Comedians</a></li>
              <li><a href="/theaters" className="btn-ghost px-3 py-1.5 rounded-lg hover:bg-white/5">Theater</a></li>
              <li><a href="/compatibility" className="ml-1 bg-gold/10 text-gold hover:bg-gold/20 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors">Diagnosis</a></li>
            </ul>
          </nav>
        </header>
        <main className="max-w-6xl mx-auto px-6 pt-24 pb-16 min-h-screen">
          {children}
        </main>
        <footer className="border-t border-border">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-black text-sm tracking-tighter">WAKA<span className="text-accent">TE</span></p>
              <p className="text-xs text-muted mt-1">Fan-made site. Not affiliated with Yoshimoto Kogyo.</p>
            </div>
            <div className="flex gap-6 text-xs text-muted">
              <a href="/events" className="hover:text-white transition-colors">Events</a>
              <a href="/comedians" className="hover:text-white transition-colors">Comedians</a>
              <a href="/compatibility" className="hover:text-white transition-colors">Diagnosis</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
