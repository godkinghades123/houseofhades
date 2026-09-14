import {
  MARKETING_SECRET,
  MARKETING_REPO_PATHS,
  MARKETING_GATES,
  MARKETING_WORKFLOW,
  MARKETING_PLATFORMS,
  MARKETING_ACTIVITY,
  type GateStatus,
} from '../data/marketingAgent'

function statusColor(s: GateStatus): string {
  if (s === 'enforced') return 'text-hades-green'
  if (s === 'pending') return 'text-hades-amber'
  return 'text-hades-muted'
}

function statusLabel(s: GateStatus): string {
  if (s === 'enforced') return 'Enforced'
  if (s === 'pending') return 'Pending setup'
  return 'Open'
}

export function MarketingAgentView() {
  return (
    <div className="h-full w-full overflow-auto bg-hades-bg">
      <div className="min-w-[960px] p-6 pb-16 max-w-5xl">
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-hades-muted mb-1">
            House of Hades · Distribution layer
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            Marketing / Brand Agent
          </h1>
          <p className="text-xs text-hades-muted mt-2 max-w-2xl leading-relaxed">
            Status of <span className="text-hades-cyan font-mono">{MARKETING_SECRET}</span> —
            Buffer-backed posting for Instagram, X, and TikTok. Draft by default.
            Human approval required before anything queues live.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Secret', value: 'Configured', sub: MARKETING_SECRET },
            { label: 'Live publish', value: 'Gated', sub: 'Requires --approved' },
            { label: 'Channels', value: 'Pending IDs', sub: 'Run list_channels.py' },
            { label: 'Cadence', value: 'Manual', sub: 'No cron until proven' },
          ].map((k) => (
            <div
              key={k.label}
              className="rounded-lg border border-hades-border bg-hades-panel/80 p-3"
            >
              <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1">
                {k.label}
              </div>
              <div className="text-sm font-semibold">{k.value}</div>
              <div className="text-[10px] text-hades-muted mt-0.5 font-mono truncate">
                {k.sub}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Gates */}
          <section className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden">
            <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border">
              <h2 className="text-xs font-semibold tracking-wide">Content gates</h2>
            </div>
            <ul className="divide-y divide-hades-border">
              {MARKETING_GATES.map((g) => (
                <li key={g.id} className="px-4 py-2.5 flex items-start gap-3">
                  <span
                    className={`text-[10px] font-semibold uppercase shrink-0 w-24 ${statusColor(g.status)}`}
                  >
                    {statusLabel(g.status)}
                  </span>
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{g.label}</div>
                    <div className="text-[11px] text-hades-muted leading-snug">{g.detail}</div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Workflow */}
          <section className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden">
            <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border">
              <h2 className="text-xs font-semibold tracking-wide">Recommended workflow</h2>
            </div>
            <ol className="p-4 space-y-3">
              {MARKETING_WORKFLOW.map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="text-[10px] font-mono text-hades-cyan shrink-0 mt-0.5">
                    0{s.n}
                  </span>
                  <div>
                    <div className="text-xs font-medium">{s.title}</div>
                    <div className="text-[11px] text-hades-muted leading-snug">{s.body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* Platforms */}
        <section className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden mb-6">
          <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border">
            <h2 className="text-xs font-semibold tracking-wide">Platforms</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-left text-hades-muted border-b border-hades-border">
                  <th className="px-4 py-2 font-medium">Platform</th>
                  <th className="px-4 py-2 font-medium">Handle / note</th>
                  <th className="px-4 py-2 font-medium">Env var</th>
                </tr>
              </thead>
              <tbody>
                {MARKETING_PLATFORMS.map((p) => (
                  <tr key={p.id} className="border-b border-hades-border/60">
                    <td className="px-4 py-2 font-medium">{p.label}</td>
                    <td className="px-4 py-2 text-hades-muted">{p.handle}</td>
                    <td className="px-4 py-2 font-mono text-hades-cyan">{p.env}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Repo paths */}
        <section className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden mb-6">
          <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border">
            <h2 className="text-xs font-semibold tracking-wide">Repo tools</h2>
          </div>
          <ul className="p-4 space-y-1.5 font-mono text-[11px]">
            {Object.entries(MARKETING_REPO_PATHS).map(([k, path]) => (
              <li key={k} className="flex gap-2">
                <span className="text-hades-muted w-28 shrink-0">{k}</span>
                <span className="text-white/90">{path}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Activity */}
        <section className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden">
          <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border flex items-center justify-between">
            <h2 className="text-xs font-semibold tracking-wide">Recent agent runs</h2>
            <span className="text-[10px] text-hades-muted font-mono">{MARKETING_ACTIVITY.source}</span>
          </div>
          {MARKETING_ACTIVITY.lastRuns.length === 0 ? (
            <p className="p-4 text-[11px] text-hades-muted leading-relaxed">
              {MARKETING_ACTIVITY.note}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-hades-muted border-b border-hades-border">
                    <th className="px-4 py-2">When</th>
                    <th className="px-4 py-2">Platform</th>
                    <th className="px-4 py-2">Pillar</th>
                    <th className="px-4 py-2">Highlight</th>
                    <th className="px-4 py-2">Approved</th>
                    <th className="px-4 py-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {MARKETING_ACTIVITY.lastRuns.map((r, i) => (
                    <tr key={i} className="border-b border-hades-border/60">
                      <td className="px-4 py-2 font-mono text-hades-muted">{r.logged_at}</td>
                      <td className="px-4 py-2">{r.platform}</td>
                      <td className="px-4 py-2">{r.pillar}</td>
                      <td className="px-4 py-2">{r.highlight}</td>
                      <td className="px-4 py-2">{r.approved ? 'Yes' : 'Draft'}</td>
                      <td className="px-4 py-2">{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="mt-8 text-[10px] text-hades-muted border-t border-hades-border pt-4 max-w-3xl">
          Secret never appears in this UI. Caption generation stays with PP / founder.
          This page reports architecture status and gates — not vanity metrics.
        </div>
      </div>
    </div>
  )
}
