import { MapContainer, TileLayer, Popup, CircleMarker } from 'react-leaflet'
import { ATLANTA_CENTER, type MapMarker } from '../data/mock'

const colorMap: Record<string, string> = {
  position: '#22d3ee',
  signal: '#ef4444',
  watchlist: '#7c3aed',
  task: '#f59e0b',
  pp: '#10b981',
}

interface Props {
  markers: MapMarker[]
  selected: string | null
  onSelect: (id: string | null) => void
}

export function MapView({ markers, selected, onSelect }: Props) {
  return (
    <MapContainer
      center={[ATLANTA_CENTER.lat, ATLANTA_CENTER.lng]}
      zoom={11}
      className="h-full w-full"
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

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
                <div className="text-xs opacity-70 capitalize">{m.type} · {m.status}</div>
                {m.meta && <div className="text-xs mt-1">{m.meta}</div>}
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
