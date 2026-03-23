/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0A0A0A',
        surface: '#141414',
        'surface-hover': '#1C1C1C',
        'surface-alt': '#1A1A1A',
        border: '#262626',
        'border-hover': '#404040',
        muted: '#737373',
        accent: '#FF3B30',
        'accent-soft': 'rgba(255, 59, 48, 0.12)',
        gold: '#FFCC00',
        'gold-soft': 'rgba(255, 204, 0, 0.12)',
        mint: '#30D158',
        'mint-soft': 'rgba(48, 209, 88, 0.12)',
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
