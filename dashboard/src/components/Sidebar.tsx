import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { engine, cash, trustNotarized, signalActivity7d } from '../data/live'
import { Chip } from './ui'

interface Props {
  filter: string
  onFilterChange: (f: string) => void
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="hades-section-label mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

export function Sidebar({ filter, onFilterChange }: Props) {
  const set = (id: string) => onFilterChange(id)
  const hasSignalFeed = signalActivity7d.length > 0

  return (
    <aside className="w-72 border-r border-hades-border bg-hades-panel flex flex-col overflow-y-auto shrink-0 font-sans">
      <div className="p-4 border-b border-hades-border">
        <h2 className="hades-section-label mb-3">Ops Filters</h2>

        <Group title="Type">
          {(['all', 'position', 'signal', 'watchlist', 'task', 'pp'] as const).map((id) => (
            <Chip key={id} active={filter === id} onClick={() => set(id)}>
              {id === 'all' ? 'All' : id}
            </Chip>
          ))}
        </Group>

        <Group title="Priority">
          {(['priority:high', 'priority:medium', 'priority:low'] as const).map((id) => (
            <Chip key={id} active={filter === id} onClick={() => set(id)}>
              {id.split(':')[1]}
            </Chip>
          ))}
        </Group>

        <Group title="Stage 1 blockers">
          <Chip
            active={filter === 'blocker:stage1'}
            danger
            onClick={() => set('blocker:stage1')}
          >
            Trust · KeyBank · Water
          </Chip>
        </Group>

        <Group title="Signal severity">
          {(['severity:normal', 'severity:alert', 'severity:critical'] as const).map((id) => (
            <Chip
              key={id}
              active={filter === id}
              danger={id === 'severity:critical'}
              onClick={() => set(id)}
            >
              {id.split(':')[1]}
            </Chip>
          ))}
        </Group>
      </div>

      <div className="p-4 border-b border-hades-border">
        <h2 className="hades-section-label mb-3">Signal Activity (7d)</h2>
        {hasSignalFeed ? (
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={signalActivity7d}>
                <defs>
                  <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e10600" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#e10600" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: '#111111',
                    border: '1px solid #2a2a2a',
                    fontSize: 11,
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="v"
                  stroke="#e10600"
                  fill="url(#signalGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-[11px] text-hades-muted leading-relaxed py-2">
            No live signal feed yet. Truth over fake data.
          </p>
        )}
      </div>

      <div className="p-4 space-y-3">
        <h2 className="hades-section-label">Live Stage 1 Status</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-hades-muted">Engine Phase</span>
            <span className="text-hades-silver">{engine.phase} · Defined Risk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">Net Liq</span>
            <span className="text-white">${engine.netLiq}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">KeyBank</span>
            <span className="text-hades-amber">
              ${cash.keybank} / ${cash.keybankFloor.min}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">Trust Status</span>
            <span className={trustNotarized ? 'text-hades-green' : 'text-hades-red'}>
              {trustNotarized ? 'Notarized' : 'Not Notarized'}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-hades-border text-[10px] text-hades-muted font-ui tracking-wide">
        HOUSE OF HADES · STAGE 1
        <br />
        ATLANTA · TRUTH OVER HYPE
      </div>
    </aside>
  )
}
