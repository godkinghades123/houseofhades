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
 * Seed from Continuity + known agents (Sep 2026).
 * Replace with Notion export when registry is populated.
 */
export const COLONY_AGENTS: ColonyAgent[] = [
  {
    name: 'Persephone (PP)',
    realm: 'Hades Office',
    status: 'Working',
    lastActive: '2026-09-16',
    thread: 'Notion · Continuity + Headquarters',
    notes:
      'Primary AI operator. Command layer for all realms. Continuity, research, captions, rule enforcement.',
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
]

export const NOTION_REGISTRY_URL =
  'https://app.notion.com/p/2e65c6f573334c969cf71df0ee5f25c1'
