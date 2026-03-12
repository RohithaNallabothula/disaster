import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Rectangle, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { mockDataService, DISASTER_TYPES, SEVERITY_LEVELS } from '../services/mockDataService';
import { mlEngine } from '../services/mlEngine';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const SENTINEL_MAP_CENTER = [34.0522, -118.2437]; // LA Example

const MapLayer = ({ incidents = [], sensors = [], satelliteRegions = [] }) => {
  return (
    <MapContainer 
      center={SENTINEL_MAP_CENTER} 
      zoom={11} 
      minZoom={3}
      maxBounds={[[-85, -180], [85, 180]]}
      maxBoundsViscosity={1.0}
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        noWrap={true}
      />
      
      {/* 1. Incident Markers */}
      {incidents.map(incident => (
        <Marker key={incident.id} position={incident.location}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg">{incident.title}</h3>
              <p className="text-sm text-gray-600">{incident.description}</p>
              <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-bold ${
                incident.severity === SEVERITY_LEVELS.CRITICAL ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
              }`}>
                {incident.severity}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* 2. Specialized ML Layers (Siblings for layer priority) */}
      {incidents.filter(inc => inc.type === DISASTER_TYPES.CBRN).map(inc => (
        <Polygon 
          key={`plume-${inc.id}`}
          positions={mlEngine.calculateCBRNPlume(inc.location, { windDirection: 225, windSpeed: 10 })}
          pathOptions={{
            color: '#ef4444',
            fillColor: '#ef4444',
            fillOpacity: 0.3,
            weight: 2,
            dashArray: '10, 5'
          }}
          interactive={true}
        >
          <Popup>
            <div className="p-2">
              <h4 className="font-bold text-red-500 uppercase tracking-tighter">CBRN PLUME</h4>
              <p className="text-xs font-bold text-gray-700">Predictive dispersion area.</p>
            </div>
          </Popup>
        </Polygon>
      ))}

      {incidents.filter(inc => inc.type === DISASTER_TYPES.SEISMIC).map(inc => (
        mlEngine.calculateBlastZones(inc.location, 5000).map((zone, idx) => (
          <Circle 
            key={`blast-${inc.id}-${idx}`}
            center={inc.location} 
            radius={zone.radius} 
            pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 1, dashArray: '5, 10' }} 
            interactive={false}
          />
        ))
      ))}

      {/* 3. IoT Sensors - Using Circle with explicit interactive prop */}
      {sensors.map(sensor => (
        <Circle 
          key={`sensor-${sensor.id}`} 
          center={sensor.position} 
          radius={800} 
          pathOptions={{ 
            color: sensor.value > 5 ? '#ef4444' : '#3b82f6', 
            fillColor: sensor.value > 5 ? '#ef4444' : '#3b82f6', 
            fillOpacity: 0.5,
            weight: 3
          }}
          interactive={true}
        >
          <Popup>
            <div className="p-2 min-w-[120px]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">{sensor.type} Sensor</p>
              <p className="text-sm font-black text-gray-900 leading-none">{sensor.id}</p>
              <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Live:</span>
                <span className="text-xs font-bold text-red-600 font-mono">
                  {sensor.value.toFixed(4)}
                </span>
              </div>
            </div>
          </Popup>
        </Circle>
      ))}

      {/* 4. Satellite Surveillance Regions */}
      {satelliteRegions.map(region => (
        <Rectangle 
          key={`region-${region.id}`} 
          bounds={region.bounds} 
          pathOptions={{ color: '#ef4444', weight: 1, fillOpacity: 0.05, dashArray: '5, 5' }} 
        />
      ))}
    </MapContainer>
  );
};

export default MapLayer;
