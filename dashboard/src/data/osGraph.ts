/**
 * HADES Operating System — page graph
 * KIND colors locked to official brand board (purple / red / silver / black family)
 */

export type NodeKind =
  | 'hub'
  | 'memory'
  | 'research'
  | 'execution'
  | 'capital'
  | 'brand'
  | 'learning'

export interface OsNode {
  id: string
  label: string
  short: string
  kind: NodeKind
  role: string
  x: number
  y: number
}

export interface OsEdge {
  id: string
  from: string
  to: string
  label: string
  weight: 'primary' | 'secondary'
}

export const OS_NODES: OsNode[] = [
  {
    id: 'hq',
    label: 'Headquarters',
    short: 'HQ',
    kind: 'hub',
    role: 'CEO Dashboard — cash, Engine snapshot, tasks, scorecard. Operational only.',
    x: 420,
    y: 280,
  },
  {
    id: 'continuity',
    label: 'Master Continuity',
    short: 'Continuity',
    kind: 'memory',
    role: 'Rules + policy source of truth. Placement rule: append, never stack at top.',
    x: 200,
    y: 120,
  },
  {
    id: 'bible',
    label: 'HADES Bible',
    short: 'Bible',
    kind: 'brand',
    role: 'Brand identity, voice, content pillars, typography, non-negotiables.',
    x: 80,
    y: 280,
  },
  {
    id: 'watchtower',
    label: 'Watchtower',
    short: 'Watchtower',
    kind: 'research',
    role: 'Live positions + research surface. Feeds action decisions.',
    x: 640,
    y: 100,
  },
  {
    id: 'vault',
    label: 'Investment Research Vault',
    short: 'Vault',
    kind: 'research',
    role: 'Watchlists, thesis notes, catalysts, market briefings. Never rename lists.',
    x: 820,
    y: 220,
  },
  {
    id: 'signal',
    label: 'Signal Log',
    short: 'Signals',
    kind: 'research',
    role: 'Every actionable signal logged with rule + outcome. Evidence trail.',
    x: 700,
    y: 380,
  },
  {
    id: 'treasury',
    label: 'Treasury',
    short: 'Treasury',
    kind: 'capital',
    role: 'Capital architecture, Core vs Engine routing, floors.',
    x: 420,
    y: 480,
  },
  {
    id: 'engine',
    label: 'Engine (Tastytrade)',
    short: 'Engine',
    kind: 'capital',
    role: 'Phase 1 defined-risk only. Net Liq snapshot → Headquarters.',
    x: 260,
    y: 420,
  },
  {
    id: 'github',
    label: 'GitHub Issues',
    short: 'GitHub',
    kind: 'execution',
    role: 'Execution board. Day-to-day “do this next.” Not full Continuity.',
    x: 580,
    y: 480,
  },
  {
    id: 'pp',
    label: 'PP Learning System',
    short: 'PP Learn',
    kind: 'learning',
    role: 'Mistakes, patterns, router scores. Syncs into docs/LESSONS.md.',
    x: 100,
    y: 420,
  },
  {
    id: 'judgment',
    label: 'Judgment',
    short: 'Judgment',
    kind: 'memory',
    role: 'Trade judgment / process review. Closes the learning loop.',
    x: 820,
    y: 400,
  },
]

export const OS_EDGES: OsEdge[] = [
  { id: 'e1', from: 'continuity', to: 'hq', label: 'rules & policy', weight: 'primary' },
  { id: 'e2', from: 'bible', to: 'hq', label: 'brand constraints', weight: 'secondary' },
  { id: 'e3', from: 'bible', to: 'continuity', label: 'identity locked', weight: 'secondary' },
  { id: 'e4', from: 'engine', to: 'hq', label: 'Net Liq snapshot', weight: 'primary' },
  { id: 'e5', from: 'engine', to: 'treasury', label: 'profits → Core only', weight: 'primary' },
  { id: 'e6', from: 'hq', to: 'github', label: 'open work / tasks', weight: 'primary' },
  { id: 'e7', from: 'github', to: 'hq', label: 'status closed', weight: 'secondary' },
  { id: 'e8', from: 'vault', to: 'watchtower', label: 'watchlist pyramid', weight: 'primary' },
  { id: 'e9', from: 'watchtower', to: 'signal', label: 'actionable signal', weight: 'primary' },
  { id: 'e10', from: 'signal', to: 'judgment', label: 'outcome logged', weight: 'primary' },
  { id: 'e11', from: 'judgment', to: 'pp', label: 'lessons', weight: 'secondary' },
  { id: 'e12', from: 'pp', to: 'continuity', label: 'durable rules', weight: 'primary' },
  { id: 'e13', from: 'vault', to: 'signal', label: 'market brief → log', weight: 'secondary' },
  { id: 'e14', from: 'hq', to: 'watchtower', label: 'ops focus', weight: 'secondary' },
  { id: 'e15', from: 'treasury', to: 'continuity', label: 'capital rules', weight: 'secondary' },
  { id: 'e16', from: 'pp', to: 'github', label: 'sync / issues', weight: 'secondary' },
]

/** Official board: purple power · red intensity · silver precision */
export const KIND_COLOR: Record<NodeKind, string> = {
  hub: '#e10600',
  memory: '#3b1f6e',
  research: '#c0c0c0',
  execution: '#8a8a8a',
  capital: '#e10600',
  brand: '#3b1f6e',
  learning: '#c0c0c0',
}
