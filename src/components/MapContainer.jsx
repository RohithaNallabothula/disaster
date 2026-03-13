import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockDataService, DISASTER_TYPES, SEVERITY_LEVELS } from '../services/mockDataService';
import { mlEngine } from '../services/mlEngine';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MAP_CENTER = [34.0522, -118.2437];

// Active overlays state keys
const OVERLAYS = [
  { key: 'incidents', label: 'Active Incidents', icon: 'warning' },
  { key: 'thermal',   label: 'Thermal',          icon: 'thermostat' },
  { key: 'cbrn',      label: 'CBRN Plume',       icon: 'science' },
  { key: 'blast',     label: 'Blast Radius',      icon: 'crisis_alert' },
];

// Custom zoom control via Leaflet methods
function ZoomControls() {
  const map = useMap();
  return (
    <div
      className="absolute top-6 left-6 z-[1000] flex flex-col rounded-lg shadow-xl overflow-hidden"
      style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
    >
      <button
        className="p-2 transition-colors hover:brightness-125"
        style={{ color: '#64748B' }}
        onClick={() => map.zoomIn()}
        title="Zoom in"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
      </button>
      <div style={{ height: 1, backgroundColor: '#1E293B', margin: '0 4px' }} />
      <button
        className="p-2 transition-colors hover:brightness-125"
        style={{ color: '#64748B' }}
        onClick={() => map.zoomOut()}
        title="Zoom out"
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>remove</span>
      </button>
    </div>
  );
}

const MapLayer = ({ incidents = [], sensors = [], satelliteRegions = [], onDeployAssets }) => {
  const [activeOverlays, setActiveOverlays] = useState({ incidents: true, thermal: false, cbrn: true, blast: true });
  const [mapView, setMapView] = useState('2D');
  const [coords, setCoords] = useState({ lat: 34.0522, lng: -118.2437 });

  const toggleOverlay = (key) => setActiveOverlays(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#0A0F1E' }}>

      {/* Leaflet map */}
      <MapContainer
        center={MAP_CENTER}
        zoom={11}
        minZoom={3}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        className="h-full w-full"
        zoomControl={false}
        whenReady={(mapInstance) => {
          mapInstance.target.on('mousemove', (e) =>
            setCoords({ lat: e.latlng.lat, lng: e.latlng.lng })
          );
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap={true}
        />

        <ZoomControls />

        {/* Incident markers */}
        {activeOverlays.incidents && incidents.map(inc => (
          <Marker key={inc.id} position={inc.location}>
            <Popup>
              <div className="p-2 min-w-[160px]">
                <h3 className="font-bold text-sm text-gray-900 mb-1">{inc.title}</h3>
                <p className="text-xs text-gray-600">{inc.description}</p>
                <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold ${
                  inc.severity === SEVERITY_LEVELS.CRITICAL ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                }`}>{inc.severity}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* CBRN Plume Polygons */}
        {activeOverlays.cbrn && incidents.filter(i => i.type === DISASTER_TYPES.CBRN).map(inc => (
          <Polygon
            key={`plume-${inc.id}`}
            positions={mlEngine.calculateCBRNPlume(inc.location, { windDirection: 225, windSpeed: 10 })}
            pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.3, weight: 2, dashArray: '10, 5' }}
          >
            <Popup>
              <div className="p-2">
                <h4 className="font-bold text-red-500 uppercase text-xs">CBRN PLUME</h4>
                <p className="text-xs text-gray-600">Predictive dispersion area.</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* Blast Radius Circles */}
        {activeOverlays.blast && incidents.filter(i => i.type === DISASTER_TYPES.SEISMIC).map(inc =>
          mlEngine.calculateBlastZones(inc.location, 5000).map((zone, idx) => (
            <Circle
              key={`blast-${inc.id}-${idx}`}
              center={inc.location}
              radius={zone.radius}
              pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }}
              interactive={false}
            />
          ))
        )}

        {/* IoT Sensor Circles */}
        {sensors.map(sensor => (
          <Circle
            key={`sensor-${sensor.id}`}
            center={sensor.position}
            radius={800}
            pathOptions={{
              color: sensor.value > 5 ? '#EF4444' : '#06B6D4',
              fillColor: sensor.value > 5 ? '#EF4444' : '#06B6D4',
              fillOpacity: 0.45,
              weight: 2,
            }}
            interactive={true}
          >
            <Popup>
              <div className="p-2 min-w-[120px]">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{sensor.type} Sensor</p>
                <p className="text-sm font-black text-gray-900">{sensor.id}</p>
                <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Live:</span>
                  <span className="text-xs font-bold text-red-600 font-mono">{sensor.value?.toFixed(4)}</span>
                </div>
              </div>
            </Popup>
          </Circle>
        ))}

        {/* Satellite Regions */}
        {satelliteRegions.map(region => (
          <Rectangle
            key={`region-${region.id}`}
            bounds={region.bounds}
            pathOptions={{ color: '#EF4444', weight: 1, fillOpacity: 0.05, dashArray: '5, 5' }}
          />
        ))}
      </MapContainer>

      {/* ── MAP UI OVERLAYS (pointer-events-none wrapper) ── */}
      <div className="absolute inset-0 pointer-events-none z-[500]">

        {/* TOP-LEFT: View toggle + Zoom label */}
        <div className="absolute top-6 left-20 flex gap-3 pointer-events-auto">
          <div
            className="p-1 rounded-lg flex shadow-xl"
            style={{ backgroundColor: '#111827', border: '1px solid #1E293B' }}
          >
            <button
              onClick={() => setMapView('2D')}
              className="px-4 py-1.5 rounded-md text-xs font-bold transition-all"
              style={mapView === '2D'
                ? { backgroundColor: '#06B6D4', color: '#0A0F1E' }
                : { color: '#64748B' }}
            >
              2D MAP
            </button>
            <button
              onClick={() => setMapView('3D')}
              className="px-4 py-1.5 rounded-md text-xs font-bold transition-all"
              style={mapView === '3D'
                ? { backgroundColor: '#06B6D4', color: '#0A0F1E' }
                : { color: '#64748B' }}
            >
              3D GLOBE
            </button>
          </div>
        </div>

        {/* TOP-RIGHT: Overlay chips */}
        <div className="absolute top-6 right-6 flex flex-wrap justify-end gap-2 max-w-[55%] pointer-events-auto">
          {OVERLAYS.map(ov => (
            <button
              key={ov.key}
              onClick={() => toggleOverlay(ov.key)}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold flex items-center gap-1.5 shadow-lg transition-all"
              style={activeOverlays[ov.key]
                ? { backgroundColor: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', color: '#06B6D4' }
                : { backgroundColor: '#111827', border: '1px solid #1E293B', color: '#64748B' }
              }
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: activeOverlays[ov.key] ? '#06B6D4' : '#64748B' }}
              />
              {ov.label}
            </button>
          ))}
          <button
            className="p-1.5 rounded-full shadow-lg"
            style={{ backgroundColor: '#111827', border: '1px solid #1E293B', color: '#64748B' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>more_horiz</span>
          </button>
        </div>

        {/* BOTTOM: Legend + Telemetry */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between pointer-events-auto">

          {/* Legend */}
          <div
            className="p-4 rounded-xl shadow-2xl backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(17,24,39,0.95)', border: '1px solid #1E293B' }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: '#64748B', fontFamily: 'Rajdhani, sans-serif' }}
              >
                Map Legend
              </h4>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {[
                { color: '#EF4444', label: 'CBRN Zone' },
                { color: '#F59E0B', label: 'Hostile Activity' },
                { color: '#06B6D4', label: 'Env Hazard' },
                { color: null,      label: 'Evac Route', dashed: true },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.dashed
                    ? <div className="w-5 h-0.5 border-t-2 border-dashed" style={{ borderColor: 'rgba(6,182,212,0.6)' }} />
                    : <div className="w-2.5 h-2.5 rounded-full ring-2" style={{ backgroundColor: item.color, '--tw-ring-color': `${item.color}33` }} />
                  }
                  <span className="text-[11px] font-medium" style={{ color: 'rgba(241,245,249,0.8)' }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* GIS Telemetry */}
          <div
            className="px-5 py-3 rounded-xl shadow-2xl backdrop-blur-sm flex items-center gap-8"
            style={{ backgroundColor: 'rgba(17,24,39,0.95)', border: '1px solid #1E293B' }}
          >
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: '#64748B' }}>
                Lat / Long
              </span>
              <span className="text-xs font-mono font-bold" style={{ color: '#06B6D4' }}>
                {coords.lat.toFixed(4)}° N, {Math.abs(coords.lng).toFixed(4)}° W
              </span>
            </div>
            <div style={{ width: 1, height: 32, backgroundColor: '#1E293B' }} />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: '#64748B' }}>
                Elevation
              </span>
              <span className="text-xs font-mono" style={{ color: '#F1F5F9' }}>287m AMSL</span>
            </div>
            <div style={{ width: 1, height: 32, backgroundColor: '#1E293B' }} />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-tighter" style={{ color: '#64748B' }}>
                Satellites
              </span>
              <span className="text-xs font-mono" style={{ color: '#F1F5F9' }}>9 Linked</span>
            </div>
            <div
              className="flex items-center ml-2 px-3 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <div className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: '#10B981' }} />
              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#10B981' }}>
                Nominal
              </span>
            </div>
          </div>
        </div>

        {/* Thermal hotspot overlay (when enabled) */}
        {activeOverlays.thermal && (
          <div
            className="absolute rounded-full animate-pulse opacity-50 pointer-events-none"
            style={{
              top: '30%', left: '50%',
              width: 256, height: 256,
              background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)',
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MapLayer;
