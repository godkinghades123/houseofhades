import { useState } from 'react'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { KPIBar } from './components/KPIBar'
import { DataTable } from './components/DataTable'
import { liveKpis, liveMarkers, liveTableRows, LAST_SYNCED } from './data/live'
import { INTEGRATION_STATUS } from './services/integrations'

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredMarkers = filter === 'all'
    ? liveMarkers
    : liveMarkers.filter(m => m.type === filter)

  const syncLabel = new Date(LAST_SYNCED).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  })

  return (
    <div className="h-screen flex flex-col bg-hades-bg text-white overflow-hidden">
      {/* Top bar */}
      <header className="h-12 border-b border-hades-border flex items-center justify-between px-4 bg-hades-panel/80 backdrop-blur z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-hades-accent flex items-center justify-center text-xs font-bold">H</div>
          <span className="font-semibold tracking-wide">HADES Ops</span>
          <span className="text-hades-muted text-xs">· Atlanta</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-hades-muted">
          <span>Synced {syncLabel}</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hades-green animate-pulse" />
            PP Online
          </span>
        </div>
      </header>

      {/* KPI strip — live Stage 1 numbers */}
      <KPIBar items={liveKpis} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar filter={filter} onFilterChange={setFilter} />

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <MapView
              markers={filteredMarkers}
              selected={selected}
              onSelect={setSelected}
            />
          </div>

          <div className="h-56 border-t border-hades-border bg-hades-panel">
            <DataTable rows={liveTableRows} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>

      {/* Tiny integration status footer */}
      <div className="h-6 border-t border-hades-border bg-hades-panel/80 flex items-center px-3 text-[10px] text-hades-muted gap-4">
        <span>Notion: {INTEGRATION_STATUS.notion}</span>
        <span>Engine: {INTEGRATION_STATUS.engine}</span>
        <span>GitHub Issues: {INTEGRATION_STATUS.github}</span>
      </div>
    </div>
  )
}