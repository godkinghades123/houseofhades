import { useMemo, useState } from 'react'
import { MapView } from './components/MapView'
import { SystemMap } from './components/SystemMap'
import { Sidebar } from './components/Sidebar'
import { KPIBar } from './components/KPIBar'
import { DataTable } from './components/DataTable'
import { liveKpis, liveMarkers, liveTableRows, LAST_SYNCED, filterMarkers } from './data/live'
import { INTEGRATION_STATUS } from './services/integrations'

type ViewMode = 'ops' | 'system'

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<ViewMode>('system')

  const filteredMarkers = useMemo(
    () => filterMarkers(liveMarkers, filter),
    [filter]
  )

  const syncLabel = new Date(LAST_SYNCED).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })

  return (
    <div className="h-screen flex flex-col bg-hades-bg text-white overflow-hidden">
      <header className="h-12 shrink-0 border-b border-hades-border flex items-center justify-between px-4 bg-hades-panel/80 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-hades-accent flex items-center justify-center text-xs font-bold">H</div>
          <span className="font-semibold tracking-wide">HADES Ops</span>
          <span className="text-hades-muted text-xs">· Atlanta</span>

          <div className="ml-4 flex rounded-md border border-hades-border overflow-hidden text-xs">
            <button
              onClick={() => { setView('system'); setSelected(null) }}
              className={`px-3 py-1 transition ${
                view === 'system'
                  ? 'bg-hades-accent text-white'
                  : 'bg-transparent text-hades-muted hover:text-white'
              }`}
            >
              System Map
            </button>
            <button
              onClick={() => { setView('ops'); setSelected(null) }}
              className={`px-3 py-1 transition ${
                view === 'ops'
                  ? 'bg-hades-accent text-white'
                  : 'bg-transparent text-hades-muted hover:text-white'
              }`}
            >
              Ops Map
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 text-xs text-hades-muted">
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
            {view === 'system' ? (
              <SystemMap selected={selected} onSelect={setSelected} />
            ) : (
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
        <span>View: {view === 'system' ? 'Page flow' : 'Atlanta ops'}</span>
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
