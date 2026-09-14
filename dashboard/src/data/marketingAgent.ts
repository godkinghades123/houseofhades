/**
 * MARKETING__BRAND__AGENT status for Ops Dashboard.
 * Truth-first: architecture + gates only until approval_log is synced live.
 */

export const MARKETING_SECRET = 'MARKETING__BRAND__AGENT'

export const MARKETING_REPO_PATHS = {
  client: 'tools/marketing/buffer_client.py',
  listChannels: 'tools/marketing/list_channels.py',
  createPost: 'tools/marketing/create_post.py',
  approvalLog: 'tools/marketing/approval_log.jsonl',
  readme: 'tools/marketing/README.md',
} as const

export type GateStatus = 'enforced' | 'pending' | 'open'

export interface MarketingGate {
  id: string
  label: string
  status: GateStatus
  detail: string
}

export const MARKETING_GATES: MarketingGate[] = [
  {
    id: 'secret',
    label: 'Buffer secret',
    status: 'enforced',
    detail: `${MARKETING_SECRET} in GitHub Secrets · never logged`,
  },
  {
    id: 'pillar',
    label: 'Pillar required',
    status: 'enforced',
    detail: 'Chart Education · Hades Philosophy · Market Commentary',
  },
  {
    id: 'highlight',
    label: 'Highlight required',
    status: 'enforced',
    detail: 'One of the 10 Instagram highlights or script refuses',
  },
  {
    id: 'hashtags',
    label: 'Hashtag close',
    status: 'enforced',
    detail: '#HADES + #hadesmarkets mandatory in caption',
  },
  {
    id: 'approval',
    label: 'Human approval gate',
    status: 'enforced',
    detail: 'Without --approved → Buffer draft only (cannot queue live)',
  },
  {
    id: 'channels',
    label: 'Channel IDs',
    status: 'pending',
    detail: 'Run list_channels.py · set BUFFER_CHANNEL_INSTAGRAM / X / TIKTOK',
  },
  {
    id: 'handle',
    label: 'IG handle migration',
    status: 'open',
    detail: '@houseofhadesinc planned · not executed yet',
  },
]

export interface WorkflowStep {
  n: number
  title: string
  body: string
}

export const MARKETING_WORKFLOW: WorkflowStep[] = [
  {
    n: 1,
    title: 'Draft package',
    body: 'PP (or founder) writes L1 + L2 caption, assigns pillar + highlight, saves text file.',
  },
  {
    n: 2,
    title: 'create_post without --approved',
    body: 'Script validates rules and creates a Buffer DRAFT only.',
  },
  {
    n: 3,
    title: 'Human review',
    body: 'Javarous checks caption in Buffer (or re-reads the file).',
  },
  {
    n: 4,
    title: 'Re-run with --approved',
    body: 'Queues or schedules live. approval_log.jsonl records the outcome.',
  },
]

export const MARKETING_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', env: 'BUFFER_CHANNEL_INSTAGRAM', handle: '@houseofhadesinc (migration open)' },
  { id: 'x', label: 'X', env: 'BUFFER_CHANNEL_X', handle: '@Javarous5' },
  { id: 'tiktok', label: 'TikTok', env: 'BUFFER_CHANNEL_TIKTOK', handle: '@hypejaay124' },
] as const

/** Placeholder until approval_log sync is wired — do not invent counts */
export const MARKETING_ACTIVITY = {
  source: 'tools/marketing/approval_log.jsonl',
  note: 'No live feed yet. Activity table stays empty until log sync is wired — Truth over fake data.',
  lastRuns: [] as Array<{
    logged_at: string
    platform: string
    pillar: string
    highlight: string
    approved: boolean
    mode: string
    result: string
  }>,
}
