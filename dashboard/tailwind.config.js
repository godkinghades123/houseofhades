/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hades: {
          bg: '#0b0d17',
          panel: '#12141f',
          border: '#1e2130',
          accent: '#7c3aed',
          cyan: '#22d3ee',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          muted: '#94a3b8'
        }
      }
    },
  },
  plugins: [],
}