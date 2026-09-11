/**
 * Integration layer for live data sources.
 *
 * Current state (Stage 1):
 * - Data is manually synced into `src/data/live.ts` by PP from Notion + GitHub.
 * - This file defines the contracts so full API wiring is straightforward later.
 *
 * Future:
 * 1. Notion: Watchtower, Signal Log, Headquarters (via Notion API or MCP bridge)
 * 2. Engine: Tastytrade snapshot (manual or broker API)
 * 3. GitHub Issues: live open issues for PP tasks
 */

export interface EngineSnapshot {
  netLiq: number
  phase: 1 | 2 | 3
  ytd: string
  maxLossPct: number
  optionsBuyingPower: number
  rule: string
  asOf: string
}

export interface CashSnapshot {
  chime: number
  keybank: number
  keybankFloor: { min: number; target: number }
  fidelityGo: number
  groundfloor: number
  asOf: string
}

export interface IssueItem {
  number: number
  title: string
  state: 'OPEN' | 'CLOSED'
  labels: string[]
  updated_at: string
  html_url: string
}

/** Placeholder — replace with real Notion fetch when API keys / backend ready */
export async function fetchHeadquarters(): Promise<{ engine: EngineSnapshot; cash: CashSnapshot } | null> {
  // TODO: Notion API or server proxy → Headquarters page
  console.info('[integrations] fetchHeadquarters not yet live — using live.ts snapshot')
  return null
}

/** Placeholder — replace with real GitHub Issues list */
export async function fetchOpenIssues(): Promise<IssueItem[] | null> {
  // TODO: GitHub REST / GraphQL or server proxy
  console.info('[integrations] fetchOpenIssues not yet live — using live.ts snapshot')
  return null
}

/** Placeholder — Signal Log / Watchtower */
export async function fetchSignalsAndWatchtower(): Promise<unknown | null> {
  console.info('[integrations] fetchSignalsAndWatchtower not yet live')
  return null
}

export const INTEGRATION_STATUS = {
  notion: 'manual-sync' as const,   // Headquarters, Watchtower, Signal Log
  engine: 'manual-sync' as const,   // from Headquarters Engine block
  github: 'manual-sync' as const,   // open issues pulled into live.ts
  lastManualSync: '2026-09-11',
}