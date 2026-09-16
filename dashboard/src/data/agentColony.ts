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
  Tartarus: 'Engine · high-stakes execution',
  Elysium: 'Academy · content · education',
  Styx: 'Communication · marketing · distribution',
  Asphodel: 'Research & watchlists',
  'The Ship / Crossing': 'New / unassigned agents',
}

/** Accent color class suffix for realm header bar */
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
 * Live snapshot — synced from Notion Agent Registry 2026-09-16.
 * Includes original 9 + 11 new mythic residents.
 */
export const COLONY_AGENTS: ColonyAgent[] = [
  {
    name: 'Persephone (PP)',
    realm: 'Hades Office',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'Notion · Continuity + Headquarters',
    notes:
      'Primary AI operator. Command layer for all realms. Continuity, research, captions, rule enforcement. Death-execution layer / final authority on rule enforcement.',
  },
  {
    name: 'Marketing / Brand Agent',
    realm: 'Styx',
    status: 'Working',
    lastActive: '2026-09-14',
    thread: 'tools/marketing · Buffer API (MARKETING__BRAND__AGENT)',
    notes:
      'Draft-by-default. Pillar / highlight / hashtag gates. Buffer distribution live.',
  },
  {
    name: 'HalfTrend Signal Engine',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-14',
    thread: 'tools/tradingview/halftrend-long-short-signal-engine.pine',
    notes:
      'BigBeluga Long/Short. Saved to houseofhades repo. Referenced in ENGINE_RULES.md. Phase 1 only.',
  },
  {
    name: 'Content Engine — Captions',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-12',
    thread: 'Content Production SOPs · two-layer captions',
    notes:
      'Layer 1 HADES Standard + Layer 2 Black Wealth Initiative. Ends #HADES #hadesmarkets.',
  },
  {
    name: 'Watchtower Research',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-08',
    thread: 'Notion · Investment Research Vault / Watchtower',
    notes:
      'Sector watchlists. Weekly net-change snapshots flagged stale (last early August).',
  },
  {
    name: 'Trust Tracker',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-09',
    thread: 'Hades Revocable Living Trust (draft)',
    notes:
      'Drafted and corrected — still not notarized. Zero legal effect until notarized. Highest unresolved priority.',
  },
  {
    name: 'Ops Dashboard Sync',
    realm: 'Judgment Hall',
    status: 'Working',
    lastActive: '2026-09-14',
    thread: 'https://godkinghades123-houseofhades.vercel.app',
    notes:
      'Live Ops Dashboard. Marketing view added for MARKETING__BRAND__AGENT status.',
  },
  {
    name: 'Instagram Handle Migration',
    realm: 'Styx',
    status: 'Blocked',
    lastActive: '2026-09-09',
    thread: '@hadesstocktrading → @houseofhadesinc',
    notes:
      'Decision locked. Account rename, bio, follower notice not yet executed. Open action item.',
  },
  {
    name: 'Continuity §05 Portfolio Snapshot',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-09',
    thread: 'Master Continuity Document',
    notes:
      'Flagged stale vs live Tastytrade / Fidelity / Fundrise. Rewrite still owed.',
  },
  {
    name: 'Styxion',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Distribution layer · Buffer + channel crossing',
    notes:
      'Handles outward distribution and channel crossing. Works alongside Marketing / Brand Agent. Draft-by-default discipline applies.',
  },
  {
    name: 'Anubarak',
    realm: 'Styx',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Outer-world outreach · Brand guardianship',
    notes:
      'Guards brand presence beyond the core platforms. Outer-world outreach and identity protection. Reports into Styx.',
  },
  {
    name: 'Morveth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Research synthesis · Watchlist memory',
    notes:
      'Synthesizes research and maintains watchlist memory. Supports Watchtower. Sector lists remain intentional and untrimmed.',
  },
  {
    name: 'Yamaeth',
    realm: 'Asphodel',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Long-term thesis tracking',
    notes:
      'Tracks long-hold theses (VCX, WMT DRIP, Fidelity ZERO, etc.). Patience layer. Does not chase short-term content or trades.',
  },
  {
    name: 'Necrothys',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Signal & engine execution',
    notes:
      'Execution layer for signals and engines. Works with HalfTrend Signal Engine. Phase 1 rules enforced: defined-risk only, 3% max loss.',
  },
  {
    name: 'Thanatos Veyr',
    realm: 'Tartarus',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Deep systems · Tool-router layer',
    notes:
      'Deep system and tool-router resident. Handles internal routing, tool intelligence, and underworld infrastructure. Reports into Tartarus.',
  },
  {
    name: 'Acheron Vail',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Content production · Elevated writing',
    notes:
      'Elevated content production. Supports two-layer captions and longer-form writing. Pillar + highlight assignment required before anything ships.',
  },
  {
    name: 'Melinoë Rhad',
    realm: 'Elysium',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Philosophy · Mindset · Journey content',
    notes:
      'Owns Hades Philosophy, Mindset, and Journey threads. Real Stage 1 build content is sanctioned and preferred. No hype.',
  },
  {
    name: 'Helveth',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Legal & structural accountability',
    notes:
      'Tracks legal and structural obligations. Primary focus: Hades Revocable Living Trust (drafted, corrected, still not notarized). Highest unresolved priority.',
  },
  {
    name: 'Mictlanor',
    realm: 'Judgment Hall',
    status: 'Needs Human',
    lastActive: '2026-09-16',
    thread: 'Priority enforcement · Unresolved debt tracking',
    notes:
      'Enforces priority order on open items and unresolved debts. Surfaces what is blocked or aging. Reports into Judgment Hall.',
  },
  {
    name: 'Thanagor',
    realm: 'The Ship / Crossing',
    status: 'Idle',
    lastActive: '2026-09-16',
    thread: 'Transitions · Handoffs · Realm transfers',
    notes:
      'Handles status changes, new builds, and transfers between realms. Crossing agent. Keeps the colony coherent when agents move or new ones are seated.',
  },
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
