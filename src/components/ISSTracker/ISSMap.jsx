import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ISSIcon = L.divIcon({
  className: '',
  html: `
    <div style="position:relative;width:48px;height:48px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;width:48px;height:48px;border-radius:50%;
        background:radial-gradient(circle,rgba(6,182,212,0.25) 0%,transparent 70%);
        animation:iss-pulse 2s ease-in-out infinite;"></div>
      <span style="font-size:26px;filter:drop-shadow(0 0 10px #06b6d4);position:relative;z-index:1;">🛸</span>
    </div>`,
  iconSize:   [48, 48],
  iconAnchor: [24, 24],
});

function AutoPan({ position }) {
  const map = useMap();
  const prev = useRef(null);
  useEffect(() => {
    if (position?.latitude && position?.longitude) {
      const ll = [position.latitude, position.longitude];
      if (!prev.current ||
        Math.abs(prev.current[0] - ll[0]) > 0.01 ||
        Math.abs(prev.current[1] - ll[1]) > 0.01) {
        map.panTo(ll, { animate: true, duration: 1.2 });
        prev.current = ll;
      }
    }
  }, [position, map]);
  return null;
}

export default function ISSMap({ position, positions, speed, nearestPlace }) {
  const center = position ? [position.latitude, position.longitude] : [0, 0];
  const trail  = positions.map((p) => [p.latitude, p.longitude]);

  return (
    <div className="rounded-xl overflow-hidden"
      style={{ height: 400, border: '1px solid rgba(255,255,255,0.08)' }}>
      <MapContainer
        center={center} zoom={3}
        style={{ width: '100%', height: '100%' }}
        zoomControl attributionControl
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>'
          subdomains="abcd" maxZoom={19}
        />
        {trail.length > 1 && (
          <Polyline positions={trail}
            pathOptions={{ color: '#06b6d4', weight: 2, opacity: 0.55, dashArray: '6 5' }} />
        )}
        {position && (
          <Marker position={[position.latitude, position.longitude]} icon={ISSIcon}>
            <Tooltip permanent={false} direction="top" offset={[0, -30]}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7 }}>
                <div style={{ color: '#06b6d4', fontWeight: 700, marginBottom: 3 }}>🛸 ISS Position</div>
                <div>📍 {Number(position.latitude).toFixed(4)}°, {Number(position.longitude).toFixed(4)}°</div>
                {speed && <div>⚡ {Math.round(speed).toLocaleString()} km/h</div>}
                {nearestPlace && nearestPlace !== '—' && <div>🌍 {nearestPlace}</div>}
              </div>
            </Tooltip>
          </Marker>
        )}
        <AutoPan position={position} />
      </MapContainer>
    </div>
  );
}
