import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { engine, cash } from '../data/live'

const chartData = [
  { name: 'Mon', v: 12 },
  { name: 'Tue', v: 18 },
  { name: 'Wed', v: 15 },
  { name: 'Thu', v: 22 },
  { name: 'Fri', v: 19 },
  { name: 'Sat', v: 14 },
  { name: 'Sun', v: 17 },
]

interface Props {
  filter: string
  onFilterChange: (f: string) => void
}

function Chip({
  id,
  label,
  active,
  onClick,
}: {
  id: string
  label: string
  active: boolean
  onClick: (id: string) => void
}) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`px-2 py-1 rounded text-[11px] transition ${
        active
          ? 'bg-hades-accent text-white'
          : 'bg-hades-border/50 text-hades-muted hover:bg-hades-border hover:text-white'
      }`}
    >
      {label}
    </button>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[10px] uppercase tracking-wider text-hades-muted mb-1.5">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  )
}

export function Sidebar({ filter, onFilterChange }: Props) {
  const set = onFilterChange

  return (
    <aside className="w-72 border-r border-hades-border bg-hades-panel flex flex-col overflow-y-auto shrink-0">
      <div className="p-4 border-b border-hades-border">
        <h2 className="text-xs uppercase tracking-wider text-hades-muted mb-3">Ops Filters</h2>

        <Group title="Type">
          <Chip id="all" label="All" active={filter === 'all'} onClick={set} />
          <Chip id="position" label="Positions" active={filter === 'position'} onClick={set} />
          <Chip id="signal" label="Signals" active={filter === 'signal'} onClick={set} />
          <Chip id="watchlist" label="Watchlists" active={filter === 'watchlist'} onClick={set} />
          <Chip id="task" label="Tasks" active={filter === 'task'} onClick={set} />
          <Chip id="pp" label="PP" active={filter === 'pp'} onClick={set} />
        </Group>

        <Group title="Priority">
          <Chip id="priority:high" label="High" active={filter === 'priority:high'} onClick={set} />
          <Chip id="priority:medium" label="Medium" active={filter === 'priority:medium'} onClick={set} />
          <Chip id="priority:low" label="Low" active={filter === 'priority:low'} onClick={set} />
        </Group>

        <Group title="Owner">
          <Chip id="owner:Javarous" label="Javarous" active={filter === 'owner:Javarous'} onClick={set} />
          <Chip id="owner:PP" label="PP" active={filter === 'owner:PP'} onClick={set} />
        </Group>

        <Group title="Stage 1 blockers">
          <Chip id="blocker:stage1" label="Trust · KeyBank · Water" active={filter === 'blocker:stage1'} onClick={set} />
        </Group>

        <Group title="Content cadence">
          <Chip id="cadence:tip" label="Mon Tip" active={filter === 'cadence:tip'} onClick={set} />
          <Chip id="cadence:edu" label="Wed Edu" active={filter === 'cadence:edu'} onClick={set} />
          <Chip id="cadence:phil" label="Phil / Mindset" active={filter === 'cadence:phil'} onClick={set} />
          <Chip id="cadence:blueprint" label="Sat Blueprint" active={filter === 'cadence:blueprint'} onClick={set} />
        </Group>

        <Group title="Watchlist sector">
          <Chip id="sector:oil" label="Oil" active={filter === 'sector:oil'} onClick={set} />
          <Chip id="sector:ai" label="AI" active={filter === 'sector:ai'} onClick={set} />
          <Chip id="sector:income" label="Income" active={filter === 'sector:income'} onClick={set} />
          <Chip id="sector:semis" label="Semis" active={filter === 'sector:semis'} onClick={set} />
          <Chip id="sector:reits" label="REITs" active={filter === 'sector:reits'} onClick={set} />
          <Chip id="sector:defense" label="Defense" active={filter === 'sector:defense'} onClick={set} />
          <Chip id="sector:nuclear" label="Nuclear" active={filter === 'sector:nuclear'} onClick={set} />
        </Group>

        <Group title="Signal severity">
          <Chip id="severity:normal" label="Normal" active={filter === 'severity:normal'} onClick={set} />
          <Chip id="severity:alert" label="Alert" active={filter === 'severity:alert'} onClick={set} />
          <Chip id="severity:critical" label="Critical" active={filter === 'severity:critical'} onClick={set} />
        </Group>
      </div>

      <div className="p-4 border-b border-hades-border">
        <h2 className="text-xs uppercase tracking-wider text-hades-muted mb-3">Signal Activity (7d)</h2>
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="signalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" hide />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#12141f', border: '1px solid #1e2130', fontSize: 11 }}
              />
              <Area type="monotone" dataKey="v" stroke="#7c3aed" fill="url(#signalGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <h2 className="text-xs uppercase tracking-wider text-hades-muted">Live Stage 1 Status</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-hades-muted">Engine Phase</span>
            <span className="text-hades-cyan">{engine.phase} · Defined Risk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">Net Liq</span>
            <span>${engine.netLiq}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">KeyBank</span>
            <span className="text-hades-amber">${cash.keybank} / ${cash.keybankFloor.min}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">Trust Status</span>
            <span className="text-hades-amber">Not Notarized</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">PP Router</span>
            <span className="text-hades-green">Online</span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-hades-border text-[10px] text-hades-muted">
        House of Hades · Stage 1<br />
        Atlanta Command · Truth over hype
      </div>
    </aside>
  )
}
