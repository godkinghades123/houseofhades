import { useState } from 'react'
import { BUSINESS_PILLARS, AI_OS_LAYERS, STAGE1_BLOCKERS } from '../data/agentOs'
import { PageShell, SectionCard } from './ui'

export function AgentOsView() {
  const [focus, setFocus] = useState<string | null>(null)

  return (
    <PageShell
      eyebrow="House of Hades · Stage 1"
      title="Agent OS — Not 2035 Fantasy"
      footer={
        <>
          Pattern: orchestrator + loop + tool stack. Implementation is House of Hades only —
          Phase 1 Engine, real cash floors, PP under Continuity. No inflated portfolio.
        </>
      }
    >
      <p className="text-xs text-hades-muted -mt-4 mb-6 max-w-2xl leading-relaxed font-sans">
        Business pillars on the left. AI operating system on the right. Only tools and numbers
        you actually run. Respect the chart.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 min-w-0">
        <section>
          <h2 className="hades-section-label mb-3">The Business</h2>
          <div className="space-y-3">
            {BUSINESS_PILLARS.map((p) => {
              const active = focus === p.id
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFocus(active ? null : p.id)}
                  className={`w-full text-left rounded-lg border p-3 transition bg-hades-panel ${
                    active
                      ? 'border-hades-red shadow-hades-glow'
                      : 'border-hades-border hover:border-hades-silver-dim'
                  }`}
                  style={{ borderLeftWidth: 3, borderLeftColor: p.color }}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded font-ui"
                      style={{ background: p.color, color: '#0a0a0a' }}
                    >
                      {p.n}
                    </span>
                    <span className="text-xs font-ui tracking-wide text-white">
                      {p.title}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {p.tools.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-hades-elevated border border-hades-border text-hades-muted font-sans"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-hades-muted leading-snug font-sans">
                    {p.stage1Truth}
                  </p>
                </button>
              )
            })}
          </div>
        </section>

        <section className="relative">
          <h2 className="hades-section-label mb-3">The AI Operating System</h2>
          <div className="space-y-4">
            {AI_OS_LAYERS.map((layer, idx) => (
              <SectionCard key={layer.id}>
                <div className="hades-card-header px-4 py-2 flex items-center gap-2">
                  <span className="text-[10px] text-hades-red font-mono">0{idx + 1}</span>
                  <h3 className="font-ui text-xs tracking-wide text-white">{layer.title}</h3>
                </div>
                <div className="p-4">
                  <p className="text-xs text-hades-muted leading-relaxed mb-3 font-sans">
                    {layer.body}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {layer.nodes.map((n) => (
                      <span
                        key={n}
                        className="text-[11px] px-2 py-1 rounded-md border border-hades-border bg-hades-bg text-hades-silver font-sans"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              </SectionCard>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-hades-red/40 bg-hades-red/5 p-4">
            <div className="hades-section-label text-hades-red mb-2">
              Stage 1 blockers (not optional)
            </div>
            <ul className="space-y-1">
              {STAGE1_BLOCKERS.map((b) => (
                <li key={b} className="text-xs text-hades-muted flex gap-2 font-sans">
                  <span className="text-hades-red">▸</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
