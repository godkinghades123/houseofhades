import { useState } from 'react'
import { BUSINESS_PILLARS, AI_OS_LAYERS, STAGE1_BLOCKERS } from '../data/agentOs'

export function AgentOsView() {
  const [focus, setFocus] = useState<string | null>(null)

  return (
    <div className="h-full w-full overflow-auto bg-hades-bg">
      <div className="min-w-[960px] p-6 pb-16">
        <div className="mb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-hades-muted mb-1">
            House of Hades · Stage 1
          </div>
          <h1 className="text-xl font-semibold tracking-tight">
            How an Agent OS Runs Here — Not 2035 Fantasy
          </h1>
          <p className="text-xs text-hades-muted mt-2 max-w-2xl leading-relaxed">
            Same pattern as the agentic-business diagram: Business pillars on the left,
            AI operating system on the right. Only tools and numbers you actually run.
          </p>
        </div>

        <div className="grid grid-cols-[320px_1fr] gap-6">
          {/* THE BUSINESS */}
          <section>
            <h2 className="text-[11px] uppercase tracking-wider text-hades-muted mb-3">
              The Business
            </h2>
            <div className="space-y-3">
              {BUSINESS_PILLARS.map((p) => {
                const active = focus === p.id
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setFocus(active ? null : p.id)}
                    className={`w-full text-left rounded-lg border p-3 transition ${
                      active
                        ? 'border-white/40 bg-hades-panel'
                        : 'border-hades-border bg-hades-panel/60 hover:border-hades-border/80'
                    }`}
                    style={{ borderLeftWidth: 3, borderLeftColor: p.color }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: p.color, color: '#0b0d17' }}
                      >
                        {p.n}
                      </span>
                      <span className="text-xs font-semibold tracking-wide">{p.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {p.tools.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-hades-border/60 text-hades-muted"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-[11px] text-hades-muted leading-snug">{p.stage1Truth}</p>
                  </button>
                )
              })}
            </div>
          </section>

          {/* THE AI OS */}
          <section className="relative">
            <h2 className="text-[11px] uppercase tracking-wider text-hades-muted mb-3">
              The AI Operating System
            </h2>

            {/* flow rails from business into OS */}
            <div className="absolute left-0 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-hades-accent/40 to-transparent -ml-3" />

            <div className="space-y-4">
              {AI_OS_LAYERS.map((layer, idx) => (
                <div
                  key={layer.id}
                  className="rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden"
                >
                  <div className="px-4 py-2 bg-hades-border/40 border-b border-hades-border flex items-center gap-2">
                    <span className="text-[10px] text-hades-cyan font-mono">0{idx + 1}</span>
                    <h3 className="text-xs font-semibold tracking-wide">{layer.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-hades-muted leading-relaxed mb-3">{layer.body}</p>
                    <div className="flex flex-wrap gap-2">
                      {layer.nodes.map((n) => (
                        <span
                          key={n}
                          className="text-[11px] px-2 py-1 rounded-md border border-hades-border bg-hades-bg text-white/90"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-hades-amber/40 bg-hades-amber/5 p-4">
              <div className="text-[10px] uppercase tracking-wider text-hades-amber mb-2">
                Stage 1 blockers (not optional)
              </div>
              <ul className="space-y-1">
                {STAGE1_BLOCKERS.map((b) => (
                  <li key={b} className="text-xs text-hades-muted flex gap-2">
                    <span className="text-hades-amber">▸</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        <div className="mt-8 text-[10px] text-hades-muted border-t border-hades-border pt-4 max-w-3xl">
          Pattern credit: agentic business diagrams (orchestrator + loop + tool stack).
          Implementation is House of Hades only — Phase 1 Engine, real cash floors, PP as
          operator under Continuity rules. No inflated portfolio.
        </div>
      </div>
    </div>
  )
}
