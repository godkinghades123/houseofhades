import { useMemo, useState } from 'react'
import { MapView } from './components/MapView'
import { SystemMap } from './components/SystemMap'
import { AgentOsView } from './components/AgentOsView'
import { MarketingAgentView } from './components/MarketingAgentView'
import { AgentColonyView } from './components/AgentColonyView'
import { Sidebar } from './components/Sidebar'
import { KPIBar } from './components/KPIBar'
import { DataTable } from './components/DataTable'
import {
  liveKpis,
  liveMarkers,
  liveTableRows,
  LAST_SYNCED,
  OPS_MAP_SYNC_URL,
  filterMarkers,
} from './data/live'
import { INTEGRATION_STATUS } from './services/integrations'

type ViewMode = 'ops' | 'system' | 'agent' | 'marketing' | 'colony'

export default function App() {
  const [selected, setSelected] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [view, setView] = useState<ViewMode>('colony')

  const filteredMarkers = useMemo(
    () => filterMarkers(liveMarkers, filter),
    [filter]
  )

  const syncLabel = new Date(LAST_SYNCED).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })

  const viewLabel =
    view === 'system'
      ? 'Page flow'
      : view === 'ops'
        ? 'Atlanta ops'
        : view === 'marketing'
          ? 'Marketing agent'
          : view === 'colony'
            ? 'Agent Colony'
            : 'Agent OS'

  return (
    <div className="h-screen flex flex-col bg-hades-bg text-white overflow-hidden font-sans">
      <header className="h-12 shrink-0 border-b border-hades-border flex items-center justify-between px-4 bg-hades-purple-deep/90 backdrop-blur z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-7 h-7 rounded bg-hades-red flex items-center justify-center text-[10px] font-ui font-bold shrink-0 shadow-hades-glow">
            H
          </div>
          <span className="font-display text-xl tracking-brand leading-none shrink-0">
            HADES
          </span>
          <span className="text-hades-silver-dim text-[10px] font-ui tracking-wider shrink-0 hidden sm:inline">
            OPS · ATLANTA
          </span>

          <div className="ml-2 flex rounded-md border border-hades-border overflow-hidden text-[11px] font-ui tracking-wide">
            {(
              [
                ['colony', 'Colony'],
                ['agent', 'Agent OS'],
                ['marketing', 'Marketing'],
                ['system', 'System Map'],
                ['ops', 'Ops Map'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setView(id)
                  setSelected(null)
                }}
                className={`px-2.5 py-1 transition whitespace-nowrap uppercase ${
                  view === id
                    ? 'bg-hades-red text-white'
                    : 'bg-transparent text-hades-muted hover:text-white hover:bg-hades-elevated'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-hades-muted shrink-0 font-ui tracking-wide">
          <span className="hidden md:inline">
            SYNCED {syncLabel}{' '}
            <a
              href={OPS_MAP_SYNC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-hades-silver hover:text-white hover:underline ml-1"
            >
              RUN SYNC →
            </a>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-hades-red animate-pulse shadow-hades-glow" />
            PP ONLINE
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
            {view === 'colony' && <AgentColonyView />}
            {view === 'agent' && <AgentOsView />}
            {view === 'marketing' && <MarketingAgentView />}
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
              <DataTable
                rows={liveTableRows}
                selected={selected}
                onSelect={setSelected}
              />
            </div>
          )}
        </div>
      </div>

      <div className="h-6 shrink-0 border-t border-hades-border bg-hades-panel flex items-center px-3 text-[10px] text-hades-muted gap-4 font-ui tracking-wide">
        <span>VIEW: {viewLabel.toUpperCase()}</span>
        {view === 'ops' && filter !== 'all' && (
          <span className="text-hades-silver">FILTER: {filter}</span>
        )}
        <span>NOTION: {INTEGRATION_STATUS.notion}</span>
        <span>ENGINE: {INTEGRATION_STATUS.engine}</span>
        <span>GITHUB: {INTEGRATION_STATUS.github}</span>
        <span>MARKETING: {INTEGRATION_STATUS.marketing}</span>
      </div>
    </div>
  )
}
