import { Activity, Filter, Radio, List, Bot, MapPin } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

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

const filters = [
  { id: 'all', label: 'All', icon: MapPin },
  { id: 'position', label: 'Positions', icon: Activity },
  { id: 'signal', label: 'Signals', icon: Radio },
  { id: 'watchlist', label: 'Watchlists', icon: List },
  { id: 'task', label: 'Tasks', icon: Filter },
  { id: 'pp', label: 'PP', icon: Bot },
]

export function Sidebar({ filter, onFilterChange }: Props) {
  return (
    <aside className="w-72 border-r border-hades-border bg-hades-panel flex flex-col overflow-y-auto">
      <div className="p-4 border-b border-hades-border">
        <h2 className="text-xs uppercase tracking-wider text-hades-muted mb-3">Filters</h2>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => {
            const Icon = f.icon
            const active = filter === f.id
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(f.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition ${
                  active 
                    ? 'bg-hades-accent text-white' 
                    : 'bg-hades-border/50 text-hades-muted hover:bg-hades-border'
                }`}
              >
                <Icon size={12} />
                {f.label}
              </button>
            )
          })}
        </div>
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
        <h2 className="text-xs uppercase tracking-wider text-hades-muted">Quick Status</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-hades-muted">Engine Phase</span>
            <span className="text-hades-cyan">1 · Defined Risk</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">Trust Status</span>
            <span className="text-hades-amber">Not Notarized</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">KeyBank Floor</span>
            <span>Building</span>
          </div>
          <div className="flex justify-between">
            <span className="text-hades-muted">PP Router</span>
            <span className="text-hades-green">Online</span>
          </div>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-hades-border text-[10px] text-hades-muted">
        House of Hades · Stage 1<br />
        Atlanta Command
      </div>
    </aside>
  )
}