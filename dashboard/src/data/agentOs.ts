/**
 * How House of Hades runs — Stage 1 Agent OS
 * Honest map: real tools only, no 2035 SaaS stack.
 */

export interface BusinessPillar {
  id: string
  n: number
  title: string
  tools: string[]
  stage1Truth: string
  color: string
}

export interface OsLayer {
  id: string
  title: string
  body: string
  nodes: string[]
}

/** Left column — THE BUSINESS */
export const BUSINESS_PILLARS: BusinessPillar[] = [
  {
    id: 'marketing',
    n: 1,
    title: 'MARKETING / BRAND',
    tools: ['Instagram', 'Bible', 'Content pillars', 'Highlights'],
    stage1Truth: '~1k followers · @houseofhadesinc migration open · Truth over hype',
    color: '#38bdf8',
  },
  {
    id: 'sales',
    n: 2,
    title: 'SALES / OFFERS',
    tools: ['Gumroad', 'Bio taps', 'ETF Masterclass'],
    stage1Truth: 'Courses live · revenue tracked weekly · no fake funnel',
    color: '#4ade80',
  },
  {
    id: 'operations',
    n: 3,
    title: 'OPERATIONS',
    tools: ['Headquarters', 'GitHub Issues', 'Amazon bridge', 'Water'],
    stage1Truth: 'Amazon $18.50/hr bridge · water $50–75/wk toward rent',
    color: '#fb923c',
  },
  {
    id: 'followup',
    n: 4,
    title: 'FOLLOW-UP / CADENCE',
    tools: ['Signal Log', 'Cadence slots', 'PP Learning'],
    stage1Truth: 'Mon Tip / Wed Edu / Phil / Sat Blueprint · Tip 007 live',
    color: '#c084fc',
  },
  {
    id: 'finance',
    n: 5,
    title: 'FINANCE',
    tools: ['Engine', 'KeyBank', 'Treasury', 'Chime'],
    stage1Truth: 'Engine ~$287 Phase 1 · KeyBank ~$65 under $700 floor',
    color: '#f472b6',
  },
]

/** Right column — THE AI OPERATING SYSTEM */
export const AI_OS_LAYERS: OsLayer[] = [
  {
    id: 'orchestrator',
    title: 'ORCHESTRATOR + HUMAN',
    body: 'Persephone (PP) routes research, content drafts, and task hygiene. Javarous approves capital, Trust, and public posts. PP never invents balances.',
    nodes: ['PP / Persephone', 'Javarous (Human)', 'Headquarters scorecard'],
  },
  {
    id: 'loop',
    title: 'THE LOOP',
    body: 'Vault / Watchtower → Signal → Judgment → PP Learning → Continuity rules → back to HQ ops. Same loop the System Map trains ride.',
    nodes: [
      'Vault + Watchtower',
      'Signal Log',
      'Judgment',
      'PP Learning',
      'Continuity',
      'Headquarters',
    ],
  },
  {
    id: 'stack',
    title: 'THE TOOL STACK',
    body: 'Stage 1 connected stack only — not twenty SaaS logos. Notion is source of truth. GitHub is execution. Dashboard is the live window.',
    nodes: [
      'Notion (HQ, Continuity, Vault…)',
      'GitHub Issues + Actions',
      'Tastytrade Engine',
      'Vercel Ops Dashboard',
      'IG + Gumroad',
    ],
  },
]

export const STAGE1_BLOCKERS = [
  'Trust not notarized',
  'KeyBank under $700 floor',
  'Notion API secrets must work for auto-sync',
]
