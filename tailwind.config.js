/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        yoshimoto: {
          red: '#E60012',
          black: '#1A1A1A',
          gold: '#C8A84E',
        },
      },
    },
  },
  plugins: [],
}
