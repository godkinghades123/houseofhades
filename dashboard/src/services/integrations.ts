/**
 * Integration layer for live data sources.
 *
 * Stage 1 path:
 * - PP or GitHub Action writes dashboard/src/data/synced_meta.json
 * - live.ts imports that file for KPIs / issues / cash
 *
 * Secrets (repo Actions):
 * - NOTION_API_KEY
 * - NOTION_HQ_PAGE_ID  (Headquarters page UUID)
 * - Optional: NOTION_DATABASE_ID for PP Learning Sync
 */

export const INTEGRATION_STATUS = {
  notion: 'action-or-manual' as const,
  engine: 'from-hq-snapshot' as const,
  github: 'from-issues-api' as const,
  lastManualSync: '2026-09-11',
  liveFile: 'dashboard/src/data/synced_meta.json',
}
