/**
 * Ops Map live layer.
 * - Markers (map pins) live here and stay curated.
 * - KPIs / cash / issues come from synced_meta.json (PP sync or GitHub Action).
 */

import type { KPI, MapMarker, TableRow } from './mock'
import synced from './synced_meta.json'

export const LAST_SYNCED = synced.syncedAt

export const engine = synced.engine
export const cash = synced.cash
export const trustNotarized = Boolean(synced.trustNotarized)

export const liveKpis = synced.kpis as KPI[]
export const openIssueLinks = synced.openIssueLinks as {
  number: number
  title: string
  url: string
}[]

/** Map table row id (e.g. i5) → GitHub issue URL */
const issueUrlById = new Map<string, string>()
for (const link of openIssueLinks) {
  issueUrlById.set(`i${link.number}`, link.url)
}

export const liveTableRows: TableRow[] = (synced.tableRows as TableRow[]).map((row) => ({
  ...row,
  issueUrl: issueUrlById.get(row.id),
}))

/** No live signal-count feed yet — chart stays empty until Signal Log sync exists */
export const signalActivity7d: { name: string; v: number }[] = []

export const OPS_MAP_SYNC_URL =
  'https://github.com/godkinghades123/houseofhades/actions/workflows/ops-map-sync.yml'

export const liveMarkers: MapMarker[] = [
  {
    id: 'pos-engine',
    name: 'Engine Phase 1',
    type: 'position',
    lat: 33.755,
    lng: -84.390,
    status: 'active',
    meta: `Net Liq $${engine.netLiq} · Defined-risk`,
    priority: 'high',
    owner: 'PP',
  },
  {
    id: 'wl-8',
    name: 'Watchlist 8 — AI',
    type: 'watchlist',
    lat: 33.770,
    lng: -84.365,
    status: 'active',
    meta: 'NVDA / PLTR / FTNT',
    priority: 'medium',
    owner: 'PP',
    sector: 'ai',
  },
  {
    id: 'sig-oil',
    name: 'Oil / Yields Pressure',
    type: 'signal',
    lat: 33.730,
    lng: -84.410,
    status: 'alert',
    meta: 'Brent > $100 · 10y ~4.9% · CPI watch Sep 11',
    priority: 'high',
    owner: 'PP',
    sector: 'oil',
    severity: 'critical',
  },
  {
    id: 'task-trust',
    name: 'Trust Notarization',
    type: 'task',
    lat: 33.740,
    lng: -84.370,
    status: 'pending',
    meta: 'Stage 1 blocker · #5',
    priority: 'high',
    owner: 'Javarous',
    stage1Blocker: true,
  },
  {
    id: 'task-keybank',
    name: 'KeyBank Floor',
    type: 'task',
    lat: 33.760,
    lng: -84.420,
    status: 'active',
    meta: `$${cash.keybank} → $${cash.keybankFloor.min}`,
    priority: 'high',
    owner: 'Javarous',
    stage1Blocker: true,
  },
  {
    id: 'task-water',
    name: 'Water Profit Target',
    type: 'task',
    lat: 33.745,
    lng: -84.395,
    status: 'active',
    meta: '$50–75/wk toward rent · #3',
    priority: 'high',
    owner: 'Javarous',
    stage1Blocker: true,
  },
  {
    id: 'task-cadence',
    name: 'Content Cadence',
    type: 'task',
    lat: 33.790,
    lng: -84.380,
    status: 'active',
    meta: 'Ship next posts · #8',
    priority: 'medium',
    owner: 'both',
    cadence: 'phil',
  },
  {
    id: 'pp-sync',
    name: 'PP Learning Sync',
    type: 'pp',
    lat: 33.780,
    lng: -84.400,
    status: 'pending',
    meta: 'Needs NOTION_API_KEY secrets',
    priority: 'low',
    owner: 'PP',
  },
  {
    id: 'sig-vici',
    name: 'VICI Watch',
    type: 'signal',
    lat: 33.720,
    lng: -84.350,
    status: 'active',
    meta: 'Entry interest ~$24.96 · #6',
    priority: 'medium',
    owner: 'PP',
    sector: 'reits',
    severity: 'normal',
  },
]

export function filterMarkers(markers: MapMarker[], filter: string): MapMarker[] {
  if (!filter || filter === 'all') return markers

  if (['position', 'signal', 'watchlist', 'task', 'pp'].includes(filter)) {
    return markers.filter((m) => m.type === filter)
  }

  if (filter.startsWith('priority:')) {
    const p = filter.slice('priority:'.length)
    return markers.filter((m) => m.priority === p)
  }

  if (filter.startsWith('owner:')) {
    const o = filter.slice('owner:'.length)
    return markers.filter((m) => m.owner === o || m.owner === 'both')
  }

  if (filter === 'blocker:stage1') {
    return markers.filter((m) => m.stage1Blocker === true)
  }

  if (filter.startsWith('cadence:')) {
    const c = filter.slice('cadence:'.length)
    return markers.filter((m) => m.cadence === c)
  }

  if (filter.startsWith('sector:')) {
    const s = filter.slice('sector:'.length)
    return markers.filter((m) => m.sector === s)
  }

  if (filter.startsWith('severity:')) {
    const sev = filter.slice('severity:'.length)
    return markers.filter(
      (m) =>
        m.type === 'signal' &&
        (m.severity === sev || (sev === 'alert' && m.status === 'alert'))
    )
  }

  return markers
}
