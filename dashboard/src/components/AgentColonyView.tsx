import { useMemo, useState } from 'react'
import {
  COLONY_AGENTS,
  REALM_ORDER,
  REALM_DEPT,
  REALM_ACCENT,
  STATUS_META,
  NOTION_REGISTRY_URL,
  type ColonyAgent,
  type AgentStatus,
  type Realm,
} from '../data/agentColony'
import { Chip, PageShell } from './ui'

const STATUS_FILTERS: Array<'all' | AgentStatus> = [
  'all',
  'Needs Human',
  'Working',
  'Blocked',
  'Idle',
  'Done',
  'Archived',
]

export function AgentColonyView() {
  const [filter, setFilter] = useState<'all' | AgentStatus>('all')
  const [selected, setSelected] = useState<ColonyAgent | null>(null)

  const needsHuman = useMemo(
    () => COLONY_AGENTS.filter((a) => a.status === 'Needs Human'),
    []
  )

  const filtered = useMemo(
    () =>
      filter === 'all'
        ? COLONY_AGENTS
        : COLONY_AGENTS.filter((a) => a.status === filter),
    [filter]
  )

  const byRealm = useMemo(() => {
    const map = {} as Record<Realm, ColonyAgent[]>
    REALM_ORDER.forEach((r) => {
      map[r] = []
    })
    filtered.forEach((a) => {
      if (!map[a.realm]) map[a.realm] = []
      map[a.realm].push(a)
    })
    return map
  }, [filtered])

  return (
    <div className="h-full w-full overflow-auto bg-hades-bg flex flex-col">
      {needsHuman.length > 0 && (
        <div className="shrink-0 border-b border-hades-red/50 bg-hades-red/10 px-4 py-2.5 flex items-center gap-3 text-sm text-red-100 font-ui tracking-wide">
          <span className="w-2 h-2 rounded-full bg-hades-red animate-pulse shadow-hades-glow" />
          <span>
            {needsHuman.length === 1
              ? `1 AGENT NEEDS THE DUKE: ${needsHuman[0].name.toUpperCase()}`
              : `${needsHuman.length} AGENTS NEED THE DUKE`}
          </span>
        </div>
      )}

      <PageShell
        eyebrow="House of Hades · Underworld Residents"
        title="Agent Colony"
        footer={
          <>
            Pull-based snapshot. Live truth:{' '}
            <a
              href={NOTION_REGISTRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hades-silver hover:text-white underline"
            >
              Notion Agent Registry
            </a>
            {' '}→ refresh <span className="font-mono text-white/70">agentColony.ts</span>.
          </>
        }
      >
        <p className="text-xs text-hades-muted -mt-4 mb-5 max-w-xl leading-relaxed font-sans">
          Spatial registry of every active agent by realm. Respect the chart. No hype.
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {STATUS_FILTERS.map((s) => (
            <Chip
              key={s}
              active={filter === s}
              danger={s === 'Needs Human'}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s}
            </Chip>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {REALM_ORDER.map((realm) => {
            const list = byRealm[realm] || []
            return (
              <section
                key={realm}
                className={`hades-card overflow-hidden flex flex-col min-h-[160px] border-t-2 ${REALM_ACCENT[realm]}`}
              >
                <div className="px-3 py-2.5 border-b border-hades-border flex items-start justify-between gap-2 bg-hades-purple/10">
                  <div className="min-w-0">
                    <div className="font-ui text-xs tracking-wide text-white truncate">
                      {realm.toUpperCase()}
                    </div>
                    <div className="text-[10px] text-hades-muted mt-0.5 leading-snug font-sans">
                      {REALM_DEPT[realm]}
                    </div>
                  </div>
                  <span className="text-[10px] text-hades-silver bg-hades-bg border border-hades-border px-1.5 py-0.5 rounded shrink-0 font-mono">
                    {list.length}
                  </span>
                </div>
                <div className="p-2 flex flex-col gap-1.5 flex-1">
                  {list.length === 0 ? (
                    <div className="text-[11px] text-hades-muted/70 text-center py-4 font-sans">
                      No residents{filter !== 'all' ? ' in this state' : ''}
                    </div>
                  ) : (
                    list.map((a) => {
                      const meta = STATUS_META[a.status]
                      const needs = a.status === 'Needs Human'
                      return (
                        <button
                          key={a.name}
                          type="button"
                          onClick={() => setSelected(a)}
                          className={`w-full text-left flex items-center gap-2.5 px-2.5 py-2 rounded-md border transition ${
                            needs
                              ? 'border-hades-red/50 bg-hades-red/10 hover:bg-hades-red/15'
                              : 'border-transparent bg-hades-bg/80 hover:border-hades-border hover:bg-hades-elevated'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full bg-hades-panel border border-hades-border grid place-items-center text-sm shrink-0 ${
                              meta.color
                            } ${needs ? 'shadow-hades-glow' : ''}`}
                          >
                            {meta.posture}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium truncate font-sans">
                              {a.name}
                            </span>
                            <span className="block text-[10px] text-hades-muted font-ui tracking-wide">
                              {a.status.toUpperCase()}
                            </span>
                          </span>
                        </button>
                      )
                    })
                  )}
                </div>
              </section>
            )
          })}
        </div>
      </PageShell>

      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40"
            onClick={() => setSelected(null)}
            aria-hidden
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-hades-panel border-l border-hades-border z-50 flex flex-col shadow-2xl">
            <div className="px-4 py-3 border-b border-hades-border flex items-start justify-between gap-3 bg-hades-purple-deep">
              <h2 className="font-display text-2xl tracking-wide leading-none pr-2 text-white">
                {selected.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded border border-hades-border text-hades-muted hover:text-white hover:border-hades-silver shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-sm font-sans">
              <Field label="Realm" value={selected.realm} />
              <div>
                <div className="hades-section-label mb-1">Status</div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded border border-hades-border bg-hades-bg text-xs font-ui tracking-wide">
                  <span className={STATUS_META[selected.status].color}>
                    {STATUS_META[selected.status].posture}
                  </span>
                  {selected.status.toUpperCase()}
                </div>
              </div>
              <Field label="Last Active" value={selected.lastActive || '—'} />
              <div>
                <div className="hades-section-label mb-1">Thread / Source</div>
                <div className="flex items-start gap-2 rounded-md border border-hades-border bg-hades-bg px-2.5 py-2 font-mono text-[11px]">
                  <span className="flex-1 break-all text-hades-silver">
                    {selected.thread || '—'}
                  </span>
                  {selected.thread && (
                    <button
                      type="button"
                      className="text-hades-red text-[10px] shrink-0 hover:underline font-ui"
                      onClick={() => navigator.clipboard.writeText(selected.thread)}
                    >
                      COPY
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className="hades-section-label mb-1">Notes</div>
                <p className="text-xs text-hades-muted leading-relaxed">
                  {selected.notes || '—'}
                </p>
              </div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="hades-section-label mb-1">{label}</div>
      <div className="text-sm text-white">{value}</div>
    </div>
  )
}
