/** @type {import('tailwindcss').Config} */
/**
 * HADES brand tokens — locked to official brand board
 * Purple = power + mystery | Black = serious + clean
 * Red = intensity | Silver = precision, charts
 * Fonts: Bebas Neue (display) · Oswald (UI) · Montserrat (body)
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hades: {
          // Core surfaces
          bg: '#0a0a0a',
          panel: '#111111',
          elevated: '#1a1a1a',
          border: '#2a2a2a',
          // Brand primary (power + mystery)
          purple: '#3b1f6e',
          'purple-deep': '#1a0a3c',
          'purple-bright': '#6b3fa0',
          // Intensity
          red: '#e10600',
          'red-dim': '#9b0000',
          // Precision / charts
          silver: '#c0c0c0',
          'silver-dim': '#8a8a8a',
          // Status (derived, still on-brand)
          green: '#22c55e',
          amber: '#f59e0b',
          cyan: '#c0c0c0', // chart/link silver — not SaaS cyan
          muted: '#8a8a8a',
          // Legacy aliases so existing classes keep working
          accent: '#3b1f6e',
        },
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'Impact', 'sans-serif'],
        ui: ['Oswald', 'system-ui', 'sans-serif'],
        sans: ['Montserrat', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      letterSpacing: {
        brand: '0.12em',
      },
      boxShadow: {
        'hades-glow': '0 0 24px rgba(225, 6, 0, 0.25)',
        'hades-purple': '0 0 20px rgba(59, 31, 110, 0.45)',
      },
    },
  },
  plugins: [],
}
