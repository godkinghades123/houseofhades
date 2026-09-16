/**
 * Underworld Agent Colony — registry snapshot
 * Mirrors Notion: Agent Registry — Underworld Residents
 * https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1
 *
 * Update this file when you export live rows from Notion.
 * Shape matches the registry: Name, Realm, Status, Last Active, Thread/Source, Notes.
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

export const REALM_ACCENT: Record<Realm, string> = {
  'Hades Office': 'border-hades-amber',
  'Judgment Hall': 'border-hades-muted',
  Tartarus: 'border-hades-red',
  Elysium: 'border-hades-accent',
  Styx: 'border-hades-cyan',
  Asphodel: 'border-hades-green',
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
  Done: { posture: '✦', color: 'text-hades-cyan' },
  Archived: { posture: '·', color: 'text-hades-muted/50' },
}

/**
 * Snapshot synced from Notion Agent Registry — 2026-09-16
 * (HANDOFF #001 · TASK 001.1 in progress on Thanatos)
 */
export const COLONY_AGENTS: ColonyAgent[] = [
  {
    name: 'Persephone (PP)',
    realm: 'Hades Office',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'Notion · Continuity + Headquarters · Ops Dashboard',
    notes:
      'Primary AI operator / orchestrator. Issues handoffs; no free agent chat. Continuity, research, captions, rule enforcement.',
  },
  {
    name: 'Thanatos Veyr',
    realm: 'Tartarus',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'pp/tool-router · docs/TOOL_ROUTING.md · Agent Registry',
    notes:
      'HANDOFF #001 + TASK 001.1: agent.registry in tool-router; optional pp/crew scaffold. Deep systems · tool intelligence.',
  },
  {
    name: 'Necrothys',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Signal & engine execution',
    notes:
      'Execution layer for signals. HalfTrend companion. Phase 1: defined-risk only, 3% max loss.',
  },
  {
    name: 'HalfTrend Signal Engine',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-14',
    thread: 'tools/tradingview/halftrend-long-short-signal-engine.pine',
    notes: 'BigBeluga Long/Short. ENGINE_RULES.md. Phase 1 only.',
  },
  {
    name: 'Helveth',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Legal & structural accountability',
    notes:
      'Trust drafted/corrected — still not notarized. Highest unresolved priority.',
  },
  {
    name: 'Mictlanor',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Priority enforcement · Unresolved debt tracking',
    notes: 'Surfaces blocked or aging open items. Reports into Judgment Hall.',
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
    notes: 'Live Ops Dashboard · Colony tab · Marketing view.',
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
    thread: 'tools/marketing · Buffer API (MARKETING__BRAND__AGENT)',
    notes: 'Draft-by-default. Pillar / highlight / hashtag gates.',
  },
  {
    name: 'Styxion',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Distribution layer · Buffer + channel crossing',
    notes: 'Draft-by-default discipline applies.',
  },
  {
    name: 'Anubarak',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Outer-world outreach · Brand guardianship',
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
    thread: 'Content production · Elevated writing',
    notes: 'Two-layer captions. Pillar + highlight before ship.',
  },
  {
    name: 'Melinoë Rhad',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Philosophy · Mindset · Journey content',
    notes: 'Real Stage 1 build content preferred. No hype.',
  },
  {
    name: 'Content Engine — Captions',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-12',
    thread: 'Content Production SOPs · two-layer captions',
    notes: 'Layer 1 HADES + Layer 2 Black Wealth. #HADES #hadesmarkets.',
  },
  {
    name: 'Morveth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Research synthesis · Watchlist memory',
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
    thread: 'Notion · Investment Research Vault / Watchtower',
    notes: 'Weekly net-change snapshots flagged stale.',
  },
  {
    name: 'Thanagor',
    realm: 'The Ship / Crossing',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Transitions · Handoffs · Realm transfers',
    notes: 'Crossing agent. Keeps colony coherent on transfers.',
  },
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
