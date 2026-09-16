/**
 * How House of Hades runs — Stage 1 Agent OS
 * Colors locked to official brand board: purple / black / red / silver
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

/** Left column — THE BUSINESS — on-brand accents only */
export const BUSINESS_PILLARS: BusinessPillar[] = [
  {
    id: 'marketing',
    n: 1,
    title: 'MARKETING / BRAND',
    tools: ['Instagram', 'Buffer API', 'tools/marketing', 'Highlights'],
    stage1Truth:
      '~1k followers · Buffer draft-gated · @houseofhadesinc migration open',
    color: '#c0c0c0', // silver — precision
  },
  {
    id: 'sales',
    n: 2,
    title: 'SALES / OFFERS',
    tools: ['Gumroad', 'Bio taps', 'ETF Masterclass'],
    stage1Truth: 'Courses live · revenue tracked weekly · no fake funnel',
    color: '#e10600', // red — intensity
  },
  {
    id: 'operations',
    n: 3,
    title: 'OPERATIONS',
    tools: ['Headquarters', 'GitHub Issues', 'Amazon bridge', 'Water'],
    stage1Truth: 'Amazon $18.50/hr bridge · water $50–75/wk toward rent',
    color: '#3b1f6e', // purple — power
  },
  {
    id: 'followup',
    n: 4,
    title: 'FOLLOW-UP / CADENCE',
    tools: ['Signal Log', 'Cadence slots', 'PP Learning'],
    stage1Truth: 'Mon Tip / Wed Edu / Phil / Sat Blueprint · Tip 007 live',
    color: '#8a8a8a', // silver-dim
  },
  {
    id: 'finance',
    n: 5,
    title: 'FINANCE',
    tools: ['Engine', 'KeyBank', 'Treasury', 'Chime'],
    stage1Truth: 'Engine ~$287 Phase 1 · KeyBank under $700 floor',
    color: '#e10600', // red
  },
]

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
      'Buffer (MARKETING__BRAND__AGENT)',
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
  'Buffer channel IDs not locked yet',
]
