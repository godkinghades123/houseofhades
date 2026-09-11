import { useState } from 'react'
import { MapView } from './components/MapView'
import { Sidebar } from './components/Sidebar'
import { KPIBar } from './components/KPIBar'
import { DataTable } from './components/DataTable'
import { markers, kpis, tableRows } from './data/mock'

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const filteredMarkers = filter === 'all' 
    ? markers 
    : markers.filter(m => m.type === filter)

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
          <span>PP Online</span>
          <span className="w-2 h-2 rounded-full bg-hades-green animate-pulse" />
        </div>
      </header>

      {/* KPI strip */}
      <KPIBar items={kpis} />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left analytics rail */}
        <Sidebar filter={filter} onFilterChange={setFilter} />

        {/* Map + bottom table */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 relative">
            <MapView 
              markers={filteredMarkers} 
              selected={selected} 
              onSelect={setSelected} 
            />
          </div>

          {/* Bottom data table */}
          <div className="h-56 border-t border-hades-border bg-hades-panel">
            <DataTable rows={tableRows} selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </div>
    </div>
  )
}