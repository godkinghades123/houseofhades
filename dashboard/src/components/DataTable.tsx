import type { TableRow } from '../data/mock'

interface Props {
  rows: TableRow[]
  selected: string | null
  onSelect: (id: string | null) => void
}

const priorityColor = {
  high: 'text-hades-red',
  medium: 'text-hades-amber',
  low: 'text-hades-muted',
}

export function DataTable({ rows, selected, onSelect }: Props) {
  return (
    <div className="h-full overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-hades-panel border-b border-hades-border text-hades-muted text-xs uppercase tracking-wider">
          <tr>
            <th className="text-left px-4 py-2 font-medium">Name</th>
            <th className="text-left px-3 py-2 font-medium">Type</th>
            <th className="text-left px-3 py-2 font-medium">Status</th>
            <th className="text-left px-3 py-2 font-medium">Owner</th>
            <th className="text-left px-3 py-2 font-medium">Updated</th>
            <th className="text-left px-3 py-2 font-medium">Priority</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              onClick={() => onSelect(row.id)}
              className={`border-b border-hades-border/50 cursor-pointer transition hover:bg-hades-border/30 ${
                selected === row.id ? 'bg-hades-accent/10' : ''
              }`}
            >
              <td className="px-4 py-2.5 font-medium">{row.name}</td>
              <td className="px-3 py-2.5 text-hades-muted">{row.type}</td>
              <td className="px-3 py-2.5">{row.status}</td>
              <td className="px-3 py-2.5 text-hades-muted">{row.owner}</td>
              <td className="px-3 py-2.5 text-hades-muted">{row.updated}</td>
              <td className={`px-3 py-2.5 capitalize ${priorityColor[row.priority]}`}>
                {row.priority}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}