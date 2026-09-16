import {
  MARKETING_SECRET,
  MARKETING_REPO_PATHS,
  MARKETING_GATES,
  MARKETING_WORKFLOW,
  MARKETING_PLATFORMS,
  MARKETING_ACTIVITY,
  type GateStatus,
} from '../data/marketingAgent'
import { PageShell, SectionCard } from './ui'

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
    <PageShell
      eyebrow="House of Hades · Distribution layer"
      title="Marketing / Brand Agent"
      footer={
        <>
          Secret never appears in this UI. Caption generation stays with PP / founder.
          Architecture status and gates — not vanity metrics.
        </>
      }
    >
      <p className="text-xs text-hades-muted -mt-4 mb-6 max-w-2xl leading-relaxed font-sans">
        Status of{' '}
        <span className="text-hades-silver font-mono">{MARKETING_SECRET}</span> —
        Buffer-backed posting. Draft by default. Human approval before anything goes live.
      </p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Secret', value: 'Configured', sub: MARKETING_SECRET },
          { label: 'Live publish', value: 'Gated', sub: 'Requires --approved' },
          { label: 'Channels', value: 'Pending IDs', sub: 'Run list_channels.py' },
          { label: 'Cadence', value: 'Manual', sub: 'No cron until proven' },
        ].map((k) => (
          <div key={k.label} className="hades-card p-3">
            <div className="hades-section-label mb-1">{k.label}</div>
            <div className="text-sm font-ui tracking-wide text-white">{k.value}</div>
            <div className="text-[10px] text-hades-muted mt-0.5 font-mono truncate">
              {k.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SectionCard title="Content gates">
          <ul className="divide-y divide-hades-border">
            {MARKETING_GATES.map((g) => (
              <li key={g.id} className="px-4 py-2.5 flex items-start gap-3">
                <span
                  className={`text-[10px] font-ui uppercase shrink-0 w-24 ${statusColor(g.status)}`}
                >
                  {statusLabel(g.status)}
                </span>
                <div className="min-w-0 font-sans">
                  <div className="text-xs font-medium text-white">{g.label}</div>
                  <div className="text-[11px] text-hades-muted leading-snug">{g.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recommended workflow">
          <ol className="p-4 space-y-3">
            {MARKETING_WORKFLOW.map((s) => (
              <li key={s.n} className="flex gap-3">
                <span className="text-[10px] font-mono text-hades-red shrink-0 mt-0.5">
                  0{s.n}
                </span>
                <div className="font-sans">
                  <div className="text-xs font-medium text-white">{s.title}</div>
                  <div className="text-[11px] text-hades-muted leading-snug">{s.body}</div>
                </div>
              </li>
            ))}
          </ol>
        </SectionCard>
      </div>

      <SectionCard title="Platforms" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-sans">
            <thead>
              <tr className="text-left text-hades-muted border-b border-hades-border">
                <th className="px-4 py-2 font-ui tracking-wide">Platform</th>
                <th className="px-4 py-2 font-ui tracking-wide">Handle / note</th>
                <th className="px-4 py-2 font-ui tracking-wide">Env var</th>
              </tr>
            </thead>
            <tbody>
              {MARKETING_PLATFORMS.map((p) => (
                <tr key={p.id} className="border-b border-hades-border/60">
                  <td className="px-4 py-2 font-medium text-white">{p.label}</td>
                  <td className="px-4 py-2 text-hades-muted">{p.handle}</td>
                  <td className="px-4 py-2 font-mono text-hades-silver">{p.env}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title="Repo tools" className="mb-6">
        <ul className="p-4 space-y-1.5 font-mono text-[11px]">
          {Object.entries(MARKETING_REPO_PATHS).map(([k, path]) => (
            <li key={k} className="flex gap-2">
              <span className="text-hades-muted w-28 shrink-0">{k}</span>
              <span className="text-hades-silver">{path}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Recent agent runs">
        <div className="px-4 py-2 border-b border-hades-border flex justify-end">
          <span className="text-[10px] text-hades-muted font-mono">
            {MARKETING_ACTIVITY.source}
          </span>
        </div>
        {MARKETING_ACTIVITY.lastRuns.length === 0 ? (
          <p className="p-4 text-[11px] text-hades-muted leading-relaxed font-sans">
            {MARKETING_ACTIVITY.note}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-sans">
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
      </SectionCard>
    </PageShell>
  )
}
