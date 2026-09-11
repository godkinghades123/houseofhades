import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, Popup, CircleMarker, Polyline, useMap } from 'react-leaflet'
import { ATLANTA_CENTER, type MapMarker } from '../data/mock'

const colorMap: Record<string, string> = {
  position: '#22d3ee',
  signal: '#ef4444',
  watchlist: '#7c3aed',
  task: '#f59e0b',
  pp: '#10b981',
}

/** Logical ops routes — trains carry work/info between these stations */
const OPS_ROUTES: { id: string; from: string; to: string; label: string; primary?: boolean }[] = [
  { id: 'r1', from: 'pos-engine', to: 'sig-oil', label: 'market pressure → Engine', primary: true },
  { id: 'r2', from: 'sig-oil', to: 'wl-8', label: 'signal → watchlist', primary: true },
  { id: 'r3', from: 'wl-8', to: 'sig-vici', label: 'research → watch', primary: false },
  { id: 'r4', from: 'pos-engine', to: 'task-keybank', label: 'capital floor', primary: true },
  { id: 'r5', from: 'task-keybank', to: 'task-water', label: 'rent / cash work', primary: true },
  { id: 'r6', from: 'task-trust', to: 'pp-sync', label: 'blocker → PP track', primary: true },
  { id: 'r7', from: 'pp-sync', to: 'task-cadence', label: 'PP → content', primary: false },
  { id: 'r8', from: 'task-cadence', to: 'pos-engine', label: 'discipline loop', primary: false },
  { id: 'r9', from: 'sig-vici', to: 'pos-engine', label: 'thesis → Engine check', primary: false },
]

interface Props {
  markers: MapMarker[]
  selected: string | null
  onSelect: (id: string | null) => void
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

/** Interpolate position along a polyline (array of [lat, lng]) */
function pointAlong(path: [number, number][], t: number): [number, number] {
  if (path.length === 0) return [ATLANTA_CENTER.lat, ATLANTA_CENTER.lng]
  if (path.length === 1) return path[0]
  const clamped = Math.max(0, Math.min(0.9999, t))
  const segCount = path.length - 1
  const f = clamped * segCount
  const i = Math.floor(f)
  const local = f - i
  const a = path[i]
  const b = path[i + 1]
  return [lerp(a[0], b[0], local), lerp(a[1], b[1], local)]
}

function OpsTrain({
  path,
  color,
  durationMs,
  delayMs,
}: {
  path: [number, number][]
  color: string
  durationMs: number
  delayMs: number
}) {
  const [pos, setPos] = useState<[number, number]>(path[0] ?? [ATLANTA_CENTER.lat, ATLANTA_CENTER.lng])

  useEffect(() => {
    if (path.length < 2) return
    let frame = 0
    let start: number | null = null
    let raf = 0

    const tick = (now: number) => {
      if (start === null) start = now + delayMs
      const elapsed = now - start
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }
      const t = (elapsed % durationMs) / durationMs
      setPos(pointAlong(path, t))
      frame++
      // throttle setState a bit
      if (frame % 1 === 0) raf = requestAnimationFrame(tick)
      else raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [path, durationMs, delayMs])

  return (
    <CircleMarker
      center={pos}
      radius={5}
      pathOptions={{
        color: '#0b0d17',
        fillColor: color,
        fillOpacity: 1,
        weight: 1.5,
      }}
      interactive={false}
    />
  )
}

/** Invalidate size when container mounts so Leaflet fills the pane */
function MapResizeFix() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 100)
    return () => clearTimeout(t)
  }, [map])
  return null
}

export function MapView({ markers, selected, onSelect }: Props) {
  const byId = useMemo(() => {
    const m = new Map<string, MapMarker>()
    markers.forEach((x) => m.set(x.id, x))
    return m
  }, [markers])

  const routes = useMemo(() => {
    return OPS_ROUTES.map((r) => {
      const a = byId.get(r.from)
      const b = byId.get(r.to)
      if (!a || !b) return null
      const path: [number, number][] = [
        [a.lat, a.lng],
        [b.lat, b.lng],
      ]
      const color = colorMap[a.type] || '#a78bfa'
      return { ...r, path, color }
    }).filter(Boolean) as {
      id: string
      from: string
      to: string
      label: string
      primary?: boolean
      path: [number, number][]
      color: string
    }[]
  }, [byId])

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[ATLANTA_CENTER.lat, ATLANTA_CENTER.lng]}
        zoom={11}
        className="h-full w-full"
        zoomControl={true}
      >
        <MapResizeFix />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> · CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
        />

        {/* Tracks */}
        {routes.map((r) => {
          const related =
            !selected || selected === r.from || selected === r.to
          return (
            <Polyline
              key={r.id}
              positions={r.path}
              pathOptions={{
                color: related ? r.color : '#1e293b',
                weight: r.primary ? 3 : 2,
                opacity: related ? (r.primary ? 0.75 : 0.45) : 0.15,
                dashArray: r.primary ? undefined : '6 8',
              }}
            />
          )
        })}

        {/* Trains */}
        {routes.map((r, i) => {
          const related =
            !selected || selected === r.from || selected === r.to
          if (!related) return null
          return (
            <OpsTrain
              key={`train-${r.id}`}
              path={r.path}
              color={r.color}
              durationMs={r.primary ? 4500 : 7000}
              delayMs={i * 350}
            />
          )
        })}

        {/* Stations */}
        {markers.map((m) => {
          const color = colorMap[m.type] || '#94a3b8'
          const isSelected = selected === m.id

          return (
            <CircleMarker
              key={m.id}
              center={[m.lat, m.lng]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.85,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelect(m.id),
              }}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-xs opacity-70 capitalize">
                    {m.type} · {m.status}
                  </div>
                  {m.meta && <div className="text-xs mt-1">{m.meta}</div>}
                </div>
              </Popup>
            </CircleMarker>
          )
        })}
      </MapContainer>

      <div className="absolute bottom-3 left-3 z-[1000] rounded-lg border border-hades-border bg-hades-panel/90 px-3 py-2 text-[10px] text-hades-muted pointer-events-none">
        Trains = ops information flow · click a station to focus routes
      </div>
    </div>
  )
}
