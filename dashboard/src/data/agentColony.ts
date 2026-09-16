/**
 * Underworld Agent Colony — registry snapshot
 * Mirrors Notion: Agent Registry — Underworld Residents
 * Realm accents use official HADES board (purple / red / silver)
 */

export type AgentStatus =
  | 'Working'
  | 'Needs Human'
  | 'Blocked'
  | 'Idle'
  | 'Done'
  | 'Archived'

export type Realm =
  | 'Hades Office'
  | 'Judgment Hall'
  | 'Tartarus'
  | 'Elysium'
  | 'Styx'
  | 'Asphodel'
  | 'The Ship / Crossing'

export interface ColonyAgent {
  name: string
  realm: Realm
  status: AgentStatus
  lastActive: string
  thread: string
  notes: string
}

export const REALM_ORDER: Realm[] = [
  'Hades Office',
  'Judgment Hall',
  'Tartarus',
  'Elysium',
  'Styx',
  'Asphodel',
  'The Ship / Crossing',
]

export const REALM_DEPT: Record<Realm, string> = {
  'Hades Office': 'Founder desk · command · user input',
  'Judgment Hall': 'Ops · Continuity · Legal · PP orchestration',
  Tartarus: 'Engine · high-stakes execution · tool-router',
  Elysium: 'Academy · content · education',
  Styx: 'Communication · marketing · distribution',
  Asphodel: 'Research & watchlists',
  'The Ship / Crossing': 'New / unassigned agents',
}

/** Top border accent — brand board only */
export const REALM_ACCENT: Record<Realm, string> = {
  'Hades Office': 'border-hades-red',
  'Judgment Hall': 'border-hades-purple',
  Tartarus: 'border-hades-red',
  Elysium: 'border-hades-purple-bright',
  Styx: 'border-hades-silver',
  Asphodel: 'border-hades-silver-dim',
  'The Ship / Crossing': 'border-hades-border',
}

export const STATUS_META: Record<
  AgentStatus,
  { posture: string; color: string }
> = {
  Working: { posture: '⚒', color: 'text-hades-green' },
  'Needs Human': { posture: '✋', color: 'text-hades-red' },
  Blocked: { posture: '⛓', color: 'text-hades-amber' },
  Idle: { posture: '🕯', color: 'text-hades-muted' },
  Done: { posture: '✦', color: 'text-hades-silver' },
  Archived: { posture: '·', color: 'text-hades-muted/50' },
}

export const COLONY_AGENTS: ColonyAgent[] = [
  {
    name: 'Persephone (PP)',
    realm: 'Hades Office',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'Notion · Continuity + Headquarters · Ops Dashboard',
    notes:
      'Primary AI operator / orchestrator. Issues handoffs; no free agent chat.',
  },
  {
    name: 'Thanatos Veyr',
    realm: 'Tartarus',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'pp/tool-router · Agent Registry',
    notes: 'HANDOFF #001 + TASK 001.1: agent.registry + pp/crew scaffold.',
  },
  {
    name: 'Necrothys',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Signal & engine execution',
    notes: 'Phase 1: defined-risk only, 3% max loss.',
  },
  {
    name: 'HalfTrend Signal Engine',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-14',
    thread: 'tools/tradingview/halftrend-long-short-signal-engine.pine',
    notes: 'BigBeluga Long/Short. ENGINE_RULES.md.',
  },
  {
    name: 'Helveth',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Legal & structural accountability',
    notes: 'Trust drafted — still not notarized. Highest unresolved priority.',
  },
  {
    name: 'Mictlanor',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Priority enforcement',
    notes: 'Surfaces blocked or aging open items.',
  },
  {
    name: 'Trust Tracker',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-09',
    thread: 'Hades Revocable Living Trust (draft)',
    notes: 'Zero legal effect until notarized.',
  },
  {
    name: 'Ops Dashboard Sync',
    realm: 'Judgment Hall',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'https://godkinghades123-houseofhades.vercel.app',
    notes: 'Live Ops Dashboard · Colony tab · brand theme locked.',
  },
  {
    name: 'Continuity §05 Portfolio Snapshot',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-09',
    thread: 'Master Continuity Document',
    notes: 'Stale vs live Tastytrade / Fidelity / Fundrise. Rewrite owed.',
  },
  {
    name: 'Marketing / Brand Agent',
    realm: 'Styx',
    status: 'Working',
    lastActive: '2026-09-14',
    thread: 'tools/marketing · Buffer API',
    notes: 'Draft-by-default. Pillar / highlight / hashtag gates.',
  },
  {
    name: 'Styxion',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Distribution layer · Buffer',
    notes: 'Draft-by-default discipline applies.',
  },
  {
    name: 'Anubarak',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Outer-world outreach',
    notes: 'Identity protection beyond core platforms.',
  },
  {
    name: 'Instagram Handle Migration',
    realm: 'Styx',
    status: 'Blocked',
    lastActive: '2026-09-09',
    thread: '@hadesstocktrading → @houseofhadesinc',
    notes: 'Decision locked. Rename not yet executed.',
  },
  {
    name: 'Acheron Vail',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Content production',
    notes: 'Two-layer captions. Pillar + highlight before ship.',
  },
  {
    name: 'Melinoë Rhad',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Philosophy · Journey',
    notes: 'Real Stage 1 build content preferred. No hype.',
  },
  {
    name: 'Content Engine — Captions',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-12',
    thread: 'Content Production SOPs',
    notes: 'Layer 1 HADES + Layer 2 Black Wealth. #HADES #hadesmarkets.',
  },
  {
    name: 'Morveth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Research synthesis',
    notes: 'Supports Watchtower. Sector lists untrimmed.',
  },
  {
    name: 'Yamaeth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Long-term thesis tracking',
    notes: 'VCX, WMT DRIP, Fidelity ZERO. Patience layer.',
  },
  {
    name: 'Watchtower Research',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-08',
    thread: 'Investment Research Vault / Watchtower',
    notes: 'Weekly net-change snapshots flagged stale.',
  },
  {
    name: 'Thanagor',
    realm: 'The Ship / Crossing',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Transitions · Handoffs',
    notes: 'Crossing agent. Keeps colony coherent on transfers.',
  },
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
