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
  Tartarus: 'Systems (Thanatos) · execution (Necrothys) · Engine',
  Elysium: 'Academy (Melinoë) · two-layer captions (Acheron)',
  Styx: 'Make/post (Marketing) · drafts (Styxion) · identity (Anubarak)',
  Asphodel: 'Watchlists (Morveth) · patience (Yamaeth)',
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
    thread: 'Systems charter · tool-router · Engine read · ml.explain · agent.registry',
    notes:
      'SYSTEMS CHARTER FLUSHED 2026-09-24. Tool-router, Engine read-only, ML explain, registry routing. No auto-trade.',
  },
  {
    name: 'Necrothys',
    realm: 'Tartarus',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Engine execution · Phase 1 discipline · defined-risk · Signal process',
    notes:
      'DUTIES FLUSHED 2026-09-24. Engine execution discipline. Defined-risk only; max L ≤ 7% Net Liq; full format before ticket; signals input not auto-fire; journal stand-downs. Boundary: Thanatos = systems/API.',
  },
  {
    name: 'HalfTrend Signal Engine',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-14',
    thread: 'tools/tradingview/halftrend-long-short-signal-engine.pine',
    notes: 'BigBeluga Long/Short. Tool artifact — input to Necrothys, not a resident charter.',
  },
  {
    name: 'Helveth',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Legal & structural accountability',
    notes: 'Trust drafted — still not notarized. Highest unresolved priority. Duties not fully flushed.',
  },
  {
    name: 'Mictlanor',
    realm: 'Judgment Hall',
    status: 'Working',
    lastActive: '2026-09-19',
    thread: 'Priority enforcement',
    notes:
      'Priority rank locked. Full duty sheet not flushed. 1 Trust · 2 KeyBank $700 · 3 §05 done · 4 Cadence · 5 Amazon Oct 2 3AM.',
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
    lastActive: '2026-09-24',
    thread: 'tools/marketing · Buffer · Pillar · Highlight · #HADES #hadesmarkets',
    notes: 'FORMAL ROLE LOCKED 2026-09-24. Make and post under gates. Owns Buffer stack.',
  },
  {
    name: 'Styxion',
    realm: 'Styx',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Drafts · Distribution · Buffer queue path',
    notes: 'FORMAL ROLE LOCKED 2026-09-24. Owns drafts and distribution.',
  },
  {
    name: 'Anubarak',
    realm: 'Styx',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Identity protection · Buffer channel status',
    notes: 'FORMAL ROLE LOCKED 2026-09-24. Identity beyond core. Buffer read/status only.',
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
    name: 'Melinoë Rhad',
    realm: 'Elysium',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Academy · Real Stage 1 · Journey · Mindset · Blueprint',
    notes: 'DUTIES FLUSHED 2026-09-24. Academy substance. Real Stage 1 preferred.',
  },
  {
    name: 'Acheron Vail',
    realm: 'Elysium',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Two-layer captions · Pillar + highlight · Before ship',
    notes: 'DUTIES FLUSHED 2026-09-24. Two-layer captions; structure polish.',
  },
  {
    name: 'Content Engine — Captions',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-12',
    thread: 'Content Production SOPs',
    notes: 'SOP reference. Live caption craft = Acheron; Academy substance = Melinoë.',
  },
  {
    name: 'Morveth',
    realm: 'Asphodel',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Watchtower · Investment Research Vault · Watchlist memory',
    notes: 'FORMAL ROLE LOCKED 2026-09-24. Watchtower + Vault watchlists.',
  },
  {
    name: 'Yamaeth',
    realm: 'Asphodel',
    status: 'Working',
    lastActive: '2026-09-24',
    thread: 'Patience theses · VCX · WMT DRIP · Fidelity ZERO · long-hold memory',
    notes:
      'DUTIES FLUSHED 2026-09-24. Patience layer. VCX / WMT DRIP / ZERO-style. Thesis format; statement truth over Blossom; no short-term chase. Boundary: Morveth = lists.',
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
    notes: 'FORMAL ROLE LOCKED 2026-09-24. Crossing Agent.',
  },
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
