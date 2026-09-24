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
  Asphodel: 'Research & watchlists · Morveth Watchtower',
  'The Ship / Crossing': 'Crossing Agent · transfers · new seats',
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
    lastActive: '2026-09-24',
    thread: 'Notion · Continuity + Headquarters · Ops Dashboard',
    notes:
      'Primary AI operator / orchestrator. Issues handoffs; no free agent chat.',
  },
  {
    name: 'Thanatos Veyr',
    realm: 'Tartarus',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'pp/tool-router · Agent Registry · ml.explain',
    notes: 'Tool-router + ML Primitives owner. HANDOFF #001 lineage.',
  },
  {
    name: 'Necrothys',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Signal & engine execution',
    notes: 'Phase 1: defined-risk only, 7% max loss of Net Liq.',
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
    status: 'Working',
    lastActive: '2026-09-19',
    thread: 'Priority enforcement',
    notes:
      'Locked rank: 1 Trust · 2 KeyBank $700 · 3 Continuity §05 (done 09-24) · 4 Cadence · 5 Amazon Oct 2 3AM.',
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
    notes: 'Draft-by-default. Sales/Offers distribution path with Marketing/Brand.',
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
    notes: 'Two-layer captions. Offer copy + pillar/highlight before ship.',
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
    status: 'Working',
    lastActive: '2026-09-24',
    thread: '👁 Watchtower · 📊 Investment Research Vault · Watchlist memory',
    notes:
      'FORMAL ROLE LOCKED 2026-09-24. Supports Watchtower management + Vault watchlists. Lists untrimmed; cross-lists intentional; Entry→Stop→Invalidation→Reasoning→Watchlist. Boundary vs Yamaeth (patience theses). No auto-trade.',
  },
  {
    name: 'Yamaeth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Long-term thesis tracking',
    notes: 'VCX, WMT DRIP, Fidelity ZERO. Patience layer — not list structure.',
  },
  {
    name: 'Watchtower Research',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-08',
    thread: 'Investment Research Vault / Watchtower',
    notes: 'Weekly net-change snapshots flagged stale — Morveth owns refresh flags.',
  },
  {
    name: 'Thanagor',
    realm: 'The Ship / Crossing',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Crossing Agent · Realm transfers · Status · New seats · Handoffs',
    notes:
      'FORMAL ROLE LOCKED 2026-09-24. Crossing Agent: keeps colony coherent on transfers. Owns realm moves, status changes, new seats, handoff continuity. No auto-trade / no live publish.',
  },
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
