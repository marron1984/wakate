'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} })

const THEMES = [
  { id: 'dark', label: 'ダーク', icon: '🌑' },
  { id: 'light', label: 'ライト', icon: '☀️' },
  { id: 'midnight', label: 'ミッドナイト', icon: '🌌' },
  { id: 'sunset', label: 'サンセット', icon: '🌅' },
  { id: 'forest', label: 'フォレスト', icon: '🌲' },
]

export { THEMES }

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('wakate-theme') || 'dark'
    setTheme(saved)
    document.documentElement.setAttribute('data-theme', saved)
    setMounted(true)
  }, [])

  function changeTheme(t) {
    setTheme(t)
    localStorage.setItem('wakate-theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  if (!mounted) {
    return <div data-theme="dark">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: changeTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
