import { useMemo, useState } from 'react'
import { MapView } from './components/MapView'
import { SystemMap } from './components/SystemMap'
import { AgentOsView } from './components/AgentOsView'
import { Sidebar } from './components/Sidebar'
import { KPIBar } from './components/KPIBar'
import { DataTable } from './components/DataTable'
import { liveKpis, liveMarkers, liveTableRows, LAST_SYNCED, filterMarkers } from './data/live'
import { INTEGRATION_STATUS } from './services/integrations'

type ViewMode = 'ops' | 'system' | 'agent'

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<ViewMode>('agent')

  const filteredMarkers = useMemo(
    () => filterMarkers(liveMarkers, filter),
    [filter]
  )

  const syncLabel = new Date(LAST_SYNCED).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })

  const viewLabel =
    view === 'system' ? 'Page flow' : view === 'ops' ? 'Atlanta ops' : 'Agent OS'

  return (
    <div className="h-screen flex flex-col bg-hades-bg text-white overflow-hidden">
      <header className="h-12 shrink-0 border-b border-hades-border flex items-center justify-between px-4 bg-hades-panel/80 backdrop-blur z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded bg-hades-accent flex items-center justify-center text-xs font-bold shrink-0">H</div>
          <span className="font-semibold tracking-wide shrink-0">HADES Ops</span>
          <span className="text-hades-muted text-xs shrink-0">· Atlanta</span>

          <div className="ml-2 flex rounded-md border border-hades-border overflow-hidden text-xs">
            {(
              [
                ['agent', 'Agent OS'],
                ['system', 'System Map'],
                ['ops', 'Ops Map'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setView(id); setSelected(null) }}
                className={`px-2.5 py-1 transition whitespace-nowrap ${
                  view === id
                    ? 'bg-hades-accent text-white'
                    : 'bg-transparent text-hades-muted hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-hades-muted shrink-0">
          <span>Synced {syncLabel}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hades-green animate-pulse" />
            PP Online
          </span>
        </div>
      </header>

      <div className="shrink-0">
        <KPIBar items={liveKpis} />
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {view === 'ops' && (
          <Sidebar filter={filter} onFilterChange={setFilter} />
        )}

        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div className="flex-1 relative min-h-0 overflow-hidden">
            {view === 'agent' && <AgentOsView />}
            {view === 'system' && (
              <SystemMap selected={selected} onSelect={setSelected} />
            )}
            {view === 'ops' && (
              <MapView
                markers={filteredMarkers}
                selected={selected}
                onSelect={setSelected}
              />
            )}
          </div>

          {view === 'ops' && (
            <div className="h-56 shrink-0 border-t border-hades-border bg-hades-panel overflow-auto">
              <DataTable rows={liveTableRows} selected={selected} onSelect={setSelected} />
            </div>
          )}
        </div>
      </div>

      <div className="h-6 shrink-0 border-t border-hades-border bg-hades-panel/80 flex items-center px-3 text-[10px] text-hades-muted gap-4">
        <span>View: {viewLabel}</span>
        {view === 'ops' && filter !== 'all' && (
          <span className="text-hades-cyan">Filter: {filter}</span>
        )}
        <span>Notion: {INTEGRATION_STATUS.notion}</span>
        <span>Engine: {INTEGRATION_STATUS.engine}</span>
        <span>GitHub Issues: {INTEGRATION_STATUS.github}</span>
      </div>
    </div>
  )
}
