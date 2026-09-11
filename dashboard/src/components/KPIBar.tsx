import type { KPI } from '../data/mock'

interface Props {
  items: KPI[]
}

export function KPIBar({ items }: Props) {
  return (
    <div className="h-16 border-b border-hades-border bg-hades-panel/60 flex items-center gap-6 px-4 overflow-x-auto">
      {items.map((kpi) => (
        <div key={kpi.label} className="flex flex-col min-w-[120px]">
          <span className="text-[10px] uppercase tracking-wider text-hades-muted">{kpi.label}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-semibold">{kpi.value}</span>
            {kpi.change && (
              <span className={`text-xs ${
                kpi.tone === 'positive' ? 'text-hades-green' :
                kpi.tone === 'negative' ? 'text-hades-red' : 'text-hades-muted'
              }`}>
                {kpi.change}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}