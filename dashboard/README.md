# HADES Ops Dashboard

Dark AI / trading operations dashboard for **House of Hades**.

Live: https://godkinghades123-houseofhades.vercel.app

Views:
- **Colony** — Underworld Agent Registry (realms, status, Needs the Duke)
- **Agent OS** — Stage 1 business + AI OS map
- **Marketing** — Buffer / brand agent gates
- **System Map** — page flow
- **Ops Map** — Atlanta map + positions / signals / tasks

## Quick start

```bash
cd dashboard
npm install
npm run dev
```

Open http://localhost:5173

## Deploy (Vercel)

Repo is monorepo-style. Dashboard lives under `dashboard/`.

**Required Vercel settings**

| Setting | Value |
|---------|--------|
| Root Directory | `dashboard` |
| Framework | Vite |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Production Branch | `main` |

If the project is already linked to `godkinghades123/houseofhades`:
1. Push to `main` → Vercel auto-builds.
2. Open Deployments in the Vercel dashboard and confirm the latest commit is **Ready**.
3. Hard-refresh the production URL (cache).

If Root Directory is wrong, the site will serve an old or broken build. Fix under:
Project → Settings → General → Root Directory → `dashboard` → Redeploy.

Manual redeploy: Deployments → … on latest → Redeploy.

## Data sources (Stage 1 — pull snapshots)

| Data | File | Source of truth |
|------|------|-----------------|
| KPIs / map / tasks | `src/data/live.ts` | Notion HQ + GitHub Issues (manual sync) |
| Agent Colony | `src/data/agentColony.ts` | [Notion Agent Registry](https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1) |
| Marketing agent | `src/data/marketingAgent.ts` | Buffer + tools/marketing gates |

**No live Notion polling on Vercel yet** (by design). To refresh Colony:
1. Update rows in Notion Agent Registry.
2. Mirror into `src/data/agentColony.ts`.
3. Commit + push `main` → Vercel redeploys.

Same pattern for `live.ts` (Engine, KeyBank, Trust, issues).

## Stack

- Vite + React + TypeScript
- Tailwind CSS (dark HADES palette)
- Leaflet + react-leaflet
- Recharts

## Structure

```
dashboard/
  src/
    data/
      live.ts           # Stage 1 ops snapshot
      agentColony.ts    # Underworld residents snapshot
      marketingAgent.ts
      agentOs.ts
    components/
      AgentColonyView.tsx
      AgentOsView.tsx
      MarketingAgentView.tsx
      SystemMap.tsx
      MapView.tsx
      …
    App.tsx             # view switcher (Colony default)
```

## Related repo paths (not on Vercel)

| Path | Role |
|------|------|
| `pp/tool-router/` | Capability routing (incl. agent.registry) |
| `pp/crew/` | Optional multi-agent / handoff runner |
| `docs/` | Continuity rules, ENGINE_RULES, architecture |

These run locally or via PP — they are not part of the Vite static deploy.
