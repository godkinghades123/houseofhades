/**
 * Live Stage 1 snapshot — last synced from Notion Headquarters + GitHub Issues
 * Synced: 2026-09-11 (PP)
 */

import type { KPI, MapMarker, TableRow } from './mock'

export const LAST_SYNCED = '2026-09-11T01:30:00-04:00'

export const engine = {
  netLiq: 287,
  phase: 1 as const,
  ytd: 'red',
  maxLossPct: 3,
  optionsBuyingPower: 110,
  rule: 'Defined-risk options only',
}

export const cash = {
  chime: 10,
  keybank: 65,
  keybankFloor: { min: 700, target: 2000 },
  fidelityGo: 80,
  groundfloor: 30.11,
}

export const liveKpis: KPI[] = [
  { label: 'Engine Net Liq', value: `$${engine.netLiq}`, change: 'Phase 1', tone: 'neutral' },
  { label: 'KeyBank Build', value: `$${cash.keybank}`, change: `Floor $${cash.keybankFloor.min}`, tone: 'neutral' },
  { label: 'Open Issues', value: '9', change: '2 high', tone: 'neutral' },
  { label: 'Watchlists', value: '36', change: 'stable', tone: 'positive' },
]

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
    meta: 'Brent > $100 · 10y ~4.9%',
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
    meta: 'Tool Intelligence',
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

export const liveTableRows: TableRow[] = [
  { id: 'i5', name: 'Trust notarization (Stage 1 blocker)', type: 'Task', status: 'Open', owner: 'Javarous', updated: 'Sep 4', priority: 'high' },
  { id: 'i3', name: 'Hit weekly water profit target toward rent', type: 'Task', status: 'Open', owner: 'Javarous', updated: 'Sep 4', priority: 'high' },
  { id: 'i8', name: 'Stage 1 content cadence — ship next posts', type: 'Task', status: 'Open', owner: 'PP / Javarous', updated: 'Sep 4', priority: 'medium' },
  { id: 'i6', name: 'VICI 2-week watch review', type: 'Signal', status: 'Open', owner: 'PP', updated: 'Sep 4', priority: 'medium' },
  { id: 'i7', name: 'Journal HIMS + CMCSA vs entry thesis', type: 'Signal', status: 'Open', owner: 'PP', updated: 'Sep 4', priority: 'medium' },
  { id: 'i10', name: 'Weekly watchlist net-change refresh', type: 'Watchlist', status: 'Open', owner: 'PP', updated: 'Sep 5', priority: 'medium' },
  { id: 'i9', name: 'Refresh Continuity §05 portfolio to live truth', type: 'Task', status: 'Open', owner: 'PP', updated: 'Sep 5', priority: 'low' },
  { id: 'eng', name: 'Engine Phase 1 risk discipline', type: 'Position', status: 'Active', owner: 'PP', updated: 'Live', priority: 'high' },
]

export const openIssueLinks = [
  { number: 5, title: 'Trust notarization (Stage 1 blocker)', url: 'https://github.com/godkinghades123/houseofhades/issues/5' },
  { number: 3, title: 'Hit weekly water profit target toward rent', url: 'https://github.com/godkinghades123/houseofhades/issues/3' },
  { number: 8, title: 'Stage 1 content cadence — ship next posts', url: 'https://github.com/godkinghades123/houseofhades/issues/8' },
  { number: 6, title: 'VICI 2-week watch review', url: 'https://github.com/godkinghades123/houseofhades/issues/6' },
  { number: 7, title: 'Journal HIMS + CMCSA vs entry thesis', url: 'https://github.com/godkinghades123/houseofhades/issues/7' },
  { number: 10, title: 'Weekly watchlist net-change refresh', url: 'https://github.com/godkinghades123/houseofhades/issues/10' },
  { number: 9, title: 'Refresh Continuity §05 portfolio to live truth', url: 'https://github.com/godkinghades123/houseofhades/issues/9' },
]

/** Apply Ops Map filter id to marker list */
export function filterMarkers(markers: MapMarker[], filter: string): MapMarker[] {
  if (!filter || filter === 'all') return markers

  // Type filters (legacy)
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
    return markers.filter((m) => m.type === 'signal' && (m.severity === sev || (sev === 'alert' && m.status === 'alert')))
  }

  return markers
}
