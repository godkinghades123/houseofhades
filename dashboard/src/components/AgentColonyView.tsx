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
      {/* Needs the Duke strip */}
      {needsHuman.length > 0 && (
        <div className="shrink-0 border-b border-hades-red/40 bg-hades-red/10 px-4 py-2.5 flex items-center gap-3 text-sm text-red-200">
          <span className="w-2 h-2 rounded-full bg-hades-red animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          <span>
            {needsHuman.length === 1
              ? `1 agent needs the Duke: ${needsHuman[0].name}`
              : `${needsHuman.length} agents need the Duke`}
          </span>
        </div>
      )}

      <div className="p-5 pb-12 max-w-[1400px] w-full mx-auto">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-hades-muted mb-1">
              House of Hades · Underworld Residents
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Agent Colony
            </h1>
            <p className="text-xs text-hades-muted mt-1.5 max-w-xl leading-relaxed">
              Spatial registry of every active agent by realm. Snapshot from Continuity
              — pull live rows from{' '}
              <a
                href={NOTION_REGISTRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-hades-cyan hover:underline"
              >
                Notion Agent Registry
              </a>{' '}
              into <span className="font-mono text-white/70">agentColony.ts</span>.
            </p>
          </div>
        </div>

        {/* Status chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {STATUS_FILTERS.map((s) => {
            const active = filter === s
            const isNeeds = s === 'Needs Human'
            return (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(s)}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition ${
                  active
                    ? isNeeds
                      ? 'border-hades-red text-red-200 bg-hades-red/15 shadow-[0_0_10px_rgba(239,68,68,0.25)]'
                      : 'border-hades-accent text-white bg-hades-accent/20'
                    : 'border-hades-border text-hades-muted hover:border-hades-muted hover:text-white'
                }`}
              >
                {s === 'all' ? 'All' : s}
              </button>
            )
          })}
        </div>

        {/* Realm grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {REALM_ORDER.map((realm) => {
            const list = byRealm[realm] || []
            return (
              <section
                key={realm}
                className={`rounded-lg border border-hades-border bg-hades-panel/80 overflow-hidden flex flex-col min-h-[160px] border-t-2 ${REALM_ACCENT[realm]}`}
              >
                <div className="px-3 py-2.5 border-b border-hades-border flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold tracking-wide truncate">
                      {realm}
                    </div>
                    <div className="text-[10px] text-hades-muted mt-0.5 leading-snug">
                      {REALM_DEPT[realm]}
                    </div>
                  </div>
                  <span className="text-[10px] text-hades-muted bg-hades-bg px-1.5 py-0.5 rounded shrink-0">
                    {list.length}
                  </span>
                </div>
                <div className="p-2 flex flex-col gap-1.5 flex-1">
                  {list.length === 0 ? (
                    <div className="text-[11px] text-hades-muted/70 text-center py-4">
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
                              ? 'border-hades-red/40 bg-hades-red/5 hover:bg-hades-red/10'
                              : 'border-transparent bg-hades-bg/60 hover:border-hades-border hover:bg-hades-bg'
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-full bg-hades-panel border border-hades-border grid place-items-center text-sm shrink-0 ${
                              meta.color
                            } ${needs ? 'shadow-[0_0_10px_rgba(239,68,68,0.35)]' : ''}`}
                          >
                            {meta.posture}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-medium truncate">
                              {a.name}
                            </span>
                            <span className="block text-[10px] text-hades-muted">
                              {a.status}
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

        <div className="mt-8 text-[10px] text-hades-muted border-t border-hades-border pt-4 max-w-3xl">
          Pull-based snapshot by design. No live Notion polling in Stage 1 — keep the
          registry honest in Notion, then refresh <span className="font-mono">agentColony.ts</span>.
          Pattern mirrors the original Underworld Agent Colony single-file dashboard.
        </div>
      </div>

      {/* Detail panel */}
      {selected && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelected(null)}
            aria-hidden
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-sm bg-hades-panel border-l border-hades-border z-50 flex flex-col shadow-2xl">
            <div className="px-4 py-3 border-b border-hades-border flex items-start justify-between gap-3">
              <h2 className="text-base font-semibold tracking-tight leading-snug pr-2">
                {selected.name}
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded border border-hades-border text-hades-muted hover:text-white hover:border-hades-muted shrink-0"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-sm">
              <Field label="Realm" value={selected.realm} />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1">
                  Status
                </div>
                <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full border border-hades-border bg-hades-bg text-xs">
                  <span className={STATUS_META[selected.status].color}>
                    {STATUS_META[selected.status].posture}
                  </span>
                  {selected.status}
                </div>
              </div>
              <Field label="Last Active" value={selected.lastActive || '—'} />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1">
                  Thread / Source
                </div>
                <div className="flex items-start gap-2 rounded-md border border-hades-border bg-hades-bg px-2.5 py-2 font-mono text-[11px]">
                  <span className="flex-1 break-all">{selected.thread || '—'}</span>
                  {selected.thread && (
                    <button
                      type="button"
                      className="text-hades-cyan text-[10px] shrink-0 hover:underline"
                      onClick={() => {
                        navigator.clipboard.writeText(selected.thread)
                      }}
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1">
                  Notes
                </div>
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
      <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1">
        {label}
      </div>
      <div className="text-sm">{value}</div>
    </div>
  )
}
