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

## Current data source (live Stage 1)

Data is pulled from:
- **Notion Headquarters** → Engine Net Liq, cash floors, Trust status
- **GitHub Issues** → open PP / execution tasks

Source of truth file: `src/data/live.ts`  
Last synced: **2026-09-11**

| KPI | Value |
|-----|-------|
| Engine Net Liq | ~$287 (Phase 1) |
| KeyBank | ~$65 (floor $700) |
| Open Issues | 9 |
| Watchlists | 36 |

Integration contracts live in `src/services/integrations.ts`.

## Stack

- Vite + React + TypeScript
- Tailwind CSS (dark HADES palette)
- Leaflet + react-leaflet (dark Carto tiles)
- Recharts
- Lucide icons

## How live updates work right now

1. PP fetches Headquarters + open GitHub Issues
2. Rewrites `src/data/live.ts` with current numbers and tasks
3. Dashboard reads from `live.ts`

This keeps the UI honest to Stage 1 without requiring API keys yet.

## Next (full live)

- [ ] Notion API or server proxy for Headquarters / Watchtower / Signal Log
- [ ] GitHub Issues live list (already structured)
- [ ] Optional Tastytrade / manual Engine snapshot endpoint
- [ ] Auto-refresh button that calls the integration layer

## Structure

```
dashboard/
  src/
    data/
      mock.ts      # types + original seed
      live.ts      # current Stage 1 snapshot (use this)
    services/
      integrations.ts  # contracts for Notion / Engine / GitHub
    components/
      MapView.tsx
      Sidebar.tsx
      KPIBar.tsx
      DataTable.tsx
    App.tsx
```
