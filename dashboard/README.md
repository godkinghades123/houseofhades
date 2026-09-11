# HADES Ops Dashboard

Dark AI / trading operations dashboard for **House of Hades**.

- Map centered on **Atlanta**
- Layers: Positions · Signals · Watchlists · Tasks · PP activity
- Left analytics rail + KPI strip + bottom data table
- Built for Stage 1 reality (Engine Phase 1, Trust status, KeyBank floor, etc.)

## Quick start

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173

## Stack

- Vite + React + TypeScript
- Tailwind CSS (dark HADES palette)
- Leaflet + react-leaflet (dark Carto tiles)
- Recharts
- Lucide icons

## Current mock data

Markers and table rows are seeded with real Stage 1 concepts:
- Engine Phase 1
- Watchlist 8 (AI)
- Oil / yields signal
- Trust notarization task
- KeyBank build floor
- PP Learning / Tool Intelligence

Replace `src/data/mock.ts` with live Notion / Engine feeds later.

## Next upgrades

- Connect to Notion (Watchtower, Signal Log, Headquarters)
- Live Engine Net Liq via broker API or manual snapshot
- Real-time PP task feed from GitHub Issues
- Filter + search persistence
- Mobile responsive refinement
