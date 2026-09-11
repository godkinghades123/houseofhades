export type MarkerType = 'position' | 'signal' | 'watchlist' | 'task' | 'pp'

export interface MapMarker {
  id: string
  name: string
  type: MarkerType
  lat: number
  lng: number
  status: 'active' | 'pending' | 'closed' | 'alert'
  meta?: string
}

export interface KPI {
  label: string
  value: string
  change?: string
  tone?: 'positive' | 'negative' | 'neutral'
}

export interface TableRow {
  id: string
  name: string
  type: string
  status: string
  owner: string
  updated: string
  priority: 'high' | 'medium' | 'low'
}

// Atlanta metro focus
export const ATLANTA_CENTER = { lat: 33.749, lng: -84.388 }

export const markers: MapMarker[] = [
  { id: 'm1', name: 'Engine Phase 1', type: 'position', lat: 33.755, lng: -84.390, status: 'active', meta: 'Defined-risk only' },
  { id: 'm2', name: 'Watchlist 8 — AI', type: 'watchlist', lat: 33.770, lng: -84.365, status: 'active', meta: 'NVDA / PLTR / FTNT' },
  { id: 'm3', name: 'Oil Majors Signal', type: 'signal', lat: 33.730, lng: -84.410, status: 'alert', meta: 'Brent > $100' },
  { id: 'm4', name: 'PP Learning Sync', type: 'pp', lat: 33.780, lng: -84.400, status: 'pending', meta: 'Tool Intelligence' },
  { id: 'm5', name: 'Trust Notarization', type: 'task', lat: 33.740, lng: -84.370, status: 'pending', meta: 'Highest priority' },
  { id: 'm6', name: 'KeyBank Build Floor', type: 'task', lat: 33.760, lng: -84.420, status: 'active', meta: '$700–$2k target' },
  { id: 'm7', name: 'Signal Log Update', type: 'signal', lat: 33.720, lng: -84.350, status: 'active', meta: 'Weekly net-change' },
  { id: 'm8', name: 'Content Cadence', type: 'task', lat: 33.790, lng: -84.380, status: 'active', meta: 'Philosophy slot' },
]

export const kpis: KPI[] = [
  { label: 'Engine Net Liq', value: '~$287', change: 'Phase 1', tone: 'neutral' },
  { label: 'Active Signals', value: '3', change: '+1', tone: 'positive' },
  { label: 'Open PP Tasks', value: '5', change: '2 high', tone: 'neutral' },
  { label: 'Watchlists Live', value: '36', change: 'stable', tone: 'positive' },
]

export const tableRows: TableRow[] = [
  { id: 't1', name: 'Engine Phase 1 Risk Check', type: 'Position', status: 'Active', owner: 'PP', updated: '2h ago', priority: 'high' },
  { id: 't2', name: 'Oil / Yields Market Brief', type: 'Signal', status: 'Logged', owner: 'PP', updated: '5h ago', priority: 'medium' },
  { id: 't3', name: 'Trust Notarization', type: 'Task', status: 'Pending', owner: 'Javarous', updated: '1d ago', priority: 'high' },
  { id: 't4', name: 'WL8 AI Snapshot Refresh', type: 'Watchlist', status: 'Due', owner: 'PP', updated: '3d ago', priority: 'medium' },
  { id: 't5', name: 'KeyBank Floor Progress', type: 'Task', status: 'Active', owner: 'Javarous', updated: '6h ago', priority: 'high' },
  { id: 't6', name: 'PP Tool Intelligence Score', type: 'PP', status: 'Synced', owner: 'PP', updated: '12h ago', priority: 'low' },
]