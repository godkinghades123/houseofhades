import { useMemo, useState } from 'react'
import { OS_NODES, OS_EDGES, KIND_COLOR, type OsNode, type OsEdge } from '../data/osGraph'

interface Props {
  selected: string | null
  onSelect: (id: string | null) => void
}

function edgePath(from: OsNode, to: OsNode): string {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const mx = (from.x + to.x) / 2
  const my = (from.y + to.y) / 2
  const cx = mx + dy * 0.08
  const cy = my - dx * 0.08
  return `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`
}

/** Small train car that rides an edge path */
function FlowTrain({
  pathId,
  color,
  duration,
  delay,
  primary,
}: {
  pathId: string
  color: string
  duration: number
  delay: number
  primary: boolean
}) {
  return (
    <g opacity={primary ? 1 : 0.55} style={{ pointerEvents: 'none' }}>
      {/* engine body */}
      <rect
        x={-7}
        y={-3.5}
        width={14}
        height={7}
        rx={1.5}
        fill={color}
        stroke="#0b0d17"
        strokeWidth={0.8}
      >
        <animateMotion
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          rotate="auto"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </rect>
      {/* head lamp */}
      <circle r={1.6} fill="#fff" opacity={0.9}>
        <animateMotion
          dur={`${duration}s`}
          begin={`${delay}s`}
          repeatCount="indefinite"
          rotate="auto"
          keyPoints="0;1"
          keyTimes="0;1"
          calcMode="linear"
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </circle>
    </g>
  )
}

export function SystemMap({ selected, onSelect }: Props) {
  const [hoverEdge, setHoverEdge] = useState<string | null>(null)

  const nodeMap = useMemo(() => {
    const m = new Map<string, OsNode>()
    OS_NODES.forEach((n) => m.set(n.id, n))
    return m
  }, [])

  const selectedNode = selected ? nodeMap.get(selected) : null
  const relatedEdges = selected
    ? OS_EDGES.filter((e) => e.from === selected || e.to === selected)
    : []

  return (
    <div className="h-full w-full relative bg-hades-bg overflow-auto overscroll-contain">
      <div className="relative min-w-[960px] min-h-[640px] w-full h-full">
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(#1e2130 1px, transparent 1px), linear-gradient(90deg, #1e2130 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <svg
          viewBox="0 0 920 560"
          className="w-full h-full min-h-[560px]"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker
              id="arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
            </marker>
            <marker
              id="arrow-hot"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" />
            </marker>
          </defs>

          {/* Tracks + hidden path ids for trains */}
          {OS_EDGES.map((edge) => {
            const from = nodeMap.get(edge.from)
            const to = nodeMap.get(edge.to)
            if (!from || !to) return null

            const path = edgePath(from, to)
            const pathId = `track-${edge.id}`
            const active =
              hoverEdge === edge.id ||
              selected === edge.from ||
              selected === edge.to
            const primary = edge.weight === 'primary'
            const fromNode = nodeMap.get(edge.from)
            const trainColor = fromNode
              ? KIND_COLOR[fromNode.kind]
              : '#a78bfa'

            // dim trains on unrelated edges when a node is selected
            const trainVisible = !selected || active

            return (
              <g key={edge.id}>
                <g
                  onMouseEnter={() => setHoverEdge(edge.id)}
                  onMouseLeave={() => setHoverEdge(null)}
                  className="cursor-pointer"
                >
                  {/* rail */}
                  <path
                    d={path}
                    fill="none"
                    stroke={active ? '#a78bfa' : primary ? '#334155' : '#1e293b'}
                    strokeWidth={active ? 2.2 : primary ? 1.8 : 1.2}
                    strokeDasharray={primary ? '0' : '4 6'}
                    markerEnd={active ? 'url(#arrow-hot)' : 'url(#arrow)'}
                    style={{
                      transition: 'stroke 0.25s ease, stroke-width 0.25s ease',
                      opacity: selected && !active ? 0.2 : 1,
                    }}
                  />
                  {/* motion path (invisible, for trains) */}
                  <path id={pathId} d={path} fill="none" stroke="none" />
                  <path d={path} fill="none" stroke="transparent" strokeWidth={14} />
                  {active && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 12}
                      textAnchor="middle"
                      className="fill-hades-muted text-[9px]"
                      style={{ pointerEvents: 'none' }}
                    >
                      {edge.label}
                    </text>
                  )}
                </g>

                {/* Information trains */}
                {trainVisible && (
                  <>
                    <FlowTrain
                      pathId={pathId}
                      color={trainColor}
                      duration={primary ? 5.5 : 8}
                      delay={(edge.id.charCodeAt(1) % 5) * 0.4}
                      primary={primary}
                    />
                    {primary && (
                      <FlowTrain
                        pathId={pathId}
                        color={trainColor}
                        duration={5.5}
                        delay={2.8 + (edge.id.charCodeAt(1) % 3) * 0.3}
                        primary={primary}
                      />
                    )}
                  </>
                )}
              </g>
            )
          })}

          {/* Stations (nodes) */}
          {OS_NODES.map((node) => {
            const color = KIND_COLOR[node.kind]
            const isSelected = selected === node.id
            const isRelated = relatedEdges.some(
              (e) => e.from === node.id || e.to === node.id
            )
            const dim = selected && !isSelected && !isRelated

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onSelect(isSelected ? null : node.id)}
                className="cursor-pointer"
                style={{
                  transition: 'opacity 0.3s ease',
                  opacity: dim ? 0.3 : 1,
                }}
              >
                {node.kind === 'hub' && (
                  <circle
                    r={34}
                    fill="none"
                    stroke={color}
                    strokeWidth={1}
                    className="hub-pulse"
                    opacity={0.5}
                  />
                )}
                <circle
                  r={isSelected ? 28 : 22}
                  fill="#12141f"
                  stroke={color}
                  strokeWidth={isSelected ? 3 : 2}
                  style={{ transition: 'r 0.2s ease, stroke-width 0.2s ease' }}
                />
                <circle r={6} fill={color} />
                <text
                  y={40}
                  textAnchor="middle"
                  className="fill-white text-[11px] font-medium"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.short}
                </text>
              </g>
            )
          })}
        </svg>

        <div className="absolute top-3 right-3 rounded-lg border border-hades-border bg-hades-panel/90 p-3 text-[10px] space-y-1.5 z-10">
          <div className="text-hades-muted uppercase tracking-wider mb-1">Layers</div>
          {(Object.entries(KIND_COLOR) as [string, string][]).map(([k, c]) => (
            <div key={k} className="flex items-center gap-2 capitalize">
              <span className="w-2 h-2 rounded-full" style={{ background: c }} />
              {k}
            </div>
          ))}
          <div className="pt-1 text-hades-muted border-t border-hades-border mt-1 space-y-0.5">
            <div>Trains = information flow</div>
            <div>Scroll · click station · hover rail</div>
          </div>
        </div>
      </div>

      <div
        className={`sticky bottom-3 left-3 z-20 mx-3 mb-3 max-w-md rounded-lg border border-hades-border bg-hades-panel/95 backdrop-blur p-4 transition-all duration-300 ${
          selectedNode
            ? 'opacity-100'
            : 'opacity-0 pointer-events-none h-0 p-0 m-0 overflow-hidden border-0'
        }`}
      >
        {selectedNode && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: KIND_COLOR[selectedNode.kind] }}
              />
              <h3 className="font-semibold text-sm">{selectedNode.label}</h3>
              <span className="text-[10px] uppercase tracking-wider text-hades-muted ml-auto">
                {selectedNode.kind}
              </span>
            </div>
            <p className="text-xs text-hades-muted leading-relaxed mb-3">
              {selectedNode.role}
            </p>
            {relatedEdges.length > 0 && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-hades-muted">
                  Train routes (information flow)
                </div>
                {relatedEdges.map((e) => (
                  <div key={e.id} className="text-xs flex gap-2">
                    <span className="text-hades-cyan shrink-0">
                      {e.from === selectedNode.id ? '→' : '←'}
                    </span>
                    <span>
                      <span className="text-white/80">
                        {e.from === selectedNode.id
                          ? nodeMap.get(e.to)?.short
                          : nodeMap.get(e.from)?.short}
                      </span>
                      <span className="text-hades-muted"> · {e.label}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export type { OsEdge }
