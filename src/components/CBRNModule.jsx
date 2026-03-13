import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize:[25,41], iconAnchor:[12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

// Gaussian plume params for each agent
const AGENT_PARAMS = {
  chlorine: { maxConc:4200,  dissipate:48,  risk:'Critical',   toxLc50:430,   color:C.danger },
  sarin:    { maxConc:18000, dissipate:12,  risk:'Lethal',     toxLc50:35,    color:'#C026D3' },
  ammonia:  { maxConc:1800,  dissipate:90,  risk:'Elevated',   toxLc50:5000,  color:C.secondary },
  mustard:  { maxConc:900,   dissipate:240, risk:'Persistent', toxLc50:1500,  color:'#84CC16' },
};

// Returns rough dispersion radii in metres from Pasquill-Gifford model
function computeZones(amount, windSpeed, stabilityClass) {
  const sc = { A:0.22, B:0.16, C:0.12, D:0.08, E:0.06 }[stabilityClass] || 0.08;
  const base = Math.cbrt(amount) * 40;
  const windFactor = Math.max(0.5, 10 / Math.max(1, windSpeed));
  return {
    isolation:   Math.round(base * windFactor * sc * 10),
    protective:  Math.round(base * windFactor * sc * 18),
    downwind:    Math.round(base * windFactor * sc * 50),
  };
}

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, map.getZoom(), { duration:0.8 }); }, [center]);
  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: e => onMapClick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

// Draws an SVG wedge on map for the downwind plume
function PlumeOverlay({ center, direction, downwindRadius }) {
  const map = useMap();
  const [overlay, setOverlay] = useState(null);

  useEffect(() => {
    if (overlay) overlay.remove();

    const dirRad = (direction - 90) * (Math.PI / 180);
    const spread = 35 * (Math.PI / 180);
    const R = downwindRadius;

    const p1 = L.latLng(
      center[0] + (R * Math.cos(dirRad - spread)) / 111320,
      center[1] + (R * Math.sin(dirRad - spread)) / (111320 * Math.cos(center[0] * Math.PI / 180))
    );
    const p2 = L.latLng(
      center[0] + (R * Math.cos(dirRad + spread)) / 111320,
      center[1] + (R * Math.sin(dirRad + spread)) / (111320 * Math.cos(center[0] * Math.PI / 180))
    );

    const poly = L.polygon([L.latLng(center), p1, p2], {
      color: C.secondary, fillColor: C.secondary, fillOpacity: 0.20, weight: 1.5, dashArray: '8 4',
    }).addTo(map);
    setOverlay(poly);
    return () => { poly.remove(); };
  }, [center, direction, downwindRadius, map]);

  return null;
}

const STABILITY_CLASSES = ['A (Extremely Unstable)','B (Moderately Unstable)','C (Slightly Unstable)','D (Neutral)','E (Slightly Stable)'];

export default function CBRNModule() {
  const [agent, setAgent]       = useState('chlorine');
  const [windSpeed, setWindSpeed]= useState(12);
  const [direction, setDirection]= useState(45);
  const [amount, setAmount]     = useState(500);
  const [unit, setUnit]         = useState('kg');
  const [stability, setStability]= useState('D');
  const [mapType, setMapType]   = useState('street');
  const [center, setCenter]     = useState([41.8781, -87.6298]); // Chicago
  const [zones, setZones]       = useState(() => computeZones(500, 12, 'D'));
  const [params, setParams]     = useState(AGENT_PARAMS.chlorine);
  const [running, setRunning]   = useState(false);
  const [exported, setExported] = useState(false);

  const handleRun = async () => {
    setRunning(true);
    await new Promise(r => setTimeout(r, 700));
    const kg = unit === 'lb' ? amount * 0.453592 : Number(amount);
    setZones(computeZones(kg, Number(windSpeed), stability));
    setParams(AGENT_PARAMS[agent] || AGENT_PARAMS.chlorine);
    setRunning(false);
  };

  const handleExport = () => {
    const data = [
      `CBRN Simulation Report`,
      `Generated: ${new Date().toISOString()}`,
      ``,
      `Agent: ${agent} | Wind: ${windSpeed} km/h @ ${direction}° | Amount: ${amount} ${unit}`,
      `Stability Class: ${stability}`,
      ``,
      `Zone,Radius (m)`,
      `Isolation Zone,${zones.isolation}`,
      `Protective Action Zone,${zones.protective}`,
      `Downwind Hazard Zone,${zones.downwind}`,
      ``,
      `Max Concentration: ${params.maxConc} PPM`,
      `Time to Dissipate: ${params.dissipate} min`,
      `Inhalation Risk: ${params.risk}`,
    ].join('\n');
    const blob = new Blob([data], { type:'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='cbrn_sitrep.txt'; a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(()=>setExported(false), 2000);
  };

  const tileUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const riskPct = { Critical:85, Lethal:99, Elevated:55, Persistent:40 }[params.risk] || 50;

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── */}
        <aside className="flex flex-col overflow-y-auto shrink-0" style={{ width:320, backgroundColor: C.surface, borderRight:`1px solid ${C.border}` }}>
          <div className="p-5 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>Plume Configuration</h2>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Chemical Agent</span>
              <select className="w-full rounded-lg h-10 px-3 text-sm outline-none" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }}
                value={agent} onChange={e => setAgent(e.target.value)}>
                <option value="chlorine">Chlorine (Cl2)</option>
                <option value="sarin">Sarin (GB)</option>
                <option value="ammonia">Ammonia (NH3)</option>
                <option value="mustard">Sulfur Mustard (HD)</option>
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Wind Speed</span>
                <div className="relative">
                  <input type="number" value={windSpeed} onChange={e=>setWindSpeed(e.target.value)}
                    className="w-full rounded-lg h-10 px-3 text-sm outline-none" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }} />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold" style={{ color: C.muted }}>KM/H</span>
                </div>
                <input type="range" min="1" max="60" value={windSpeed} onChange={e=>setWindSpeed(e.target.value)}
                  className="w-full mt-1" style={{ accentColor: C.primary }} />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Direction</span>
                <div className="relative">
                  <input type="number" min="0" max="360" value={direction} onChange={e=>setDirection(e.target.value)}
                    className="w-full rounded-lg h-10 px-3 text-sm outline-none" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }} />
                  <span className="absolute right-3 top-2.5 text-[10px] font-bold" style={{ color: C.muted }}>DEG</span>
                </div>
                <input type="range" min="0" max="360" value={direction} onChange={e=>setDirection(e.target.value)}
                  className="w-full mt-1" style={{ accentColor: C.primary }} />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Stability Class (Pasquill-Gifford)</span>
              <select value={stability} onChange={e=>setStability(e.target.value)}
                className="w-full rounded-lg h-10 px-3 text-sm outline-none" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }}>
                {STABILITY_CLASSES.map(s => <option key={s} value={s[0]}>Class {s}</option>)}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Release Amount</span>
              <div className="flex gap-2">
                <input type="number" value={amount} onChange={e=>setAmount(e.target.value)}
                  className="flex-1 rounded-lg h-10 px-3 text-sm outline-none" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }} />
                <select value={unit} onChange={e=>setUnit(e.target.value)}
                  className="w-20 rounded-lg h-10 text-xs outline-none px-2" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }}>
                  <option value="kg">kg</option><option value="lb">lb</option>
                </select>
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: C.muted }}>Release Location — Click Map to Set</span>
              <div className="flex rounded gap-2 p-2 text-xs font-mono" style={{ backgroundColor: C.bg, border:`1px solid ${C.primary}44`, color: C.primary }}>
                <span className="material-symbols-outlined text-sm">location_on</span>
                {center[0].toFixed(4)}°, {center[1].toFixed(4)}°
              </div>
            </label>

            <div className="flex gap-2">
              <div className="flex rounded overflow-hidden flex-1" style={{ border:`1px solid ${C.border}` }}>
                {['street','satellite'].map(t=>(
                  <button key={t} onClick={()=>setMapType(t)}
                    className="flex-1 py-1.5 text-xs font-bold uppercase transition-all"
                    style={mapType===t?{backgroundColor:C.primary,color:C.bg}:{backgroundColor:C.surface,color:C.muted}}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleRun} disabled={running}
              className="w-full py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: running?`${C.primary}88`:C.primary, color:C.bg, fontFamily:'Rajdhani, sans-serif', letterSpacing:'0.1em', boxShadow:`0 4px 20px ${C.primary}33` }}>
              <span className="material-symbols-outlined text-xl">{running?'sync':'refresh'}</span>
              {running ? 'Running Simulation...' : 'Run Simulation'}
            </button>
          </div>

          {/* Ambient Stats */}
          <div className="mt-auto p-5" style={{ borderTop:`1px solid ${C.border}`, backgroundColor:`${C.bg}80` }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Ambient Stats</h2>
              <span className="material-symbols-outlined text-sm" style={{ color: C.primary, fontSize:18 }}>cloud_sync</span>
            </div>
            {[['Temperature','22°C'],['Humidity','64%'],['Static Stability',stability==='A'||stability==='B'?'Unstable':stability==='E'?'Stable':'Neutral']].map(([k,v]) => (
              <div key={k} className="flex justify-between items-center text-xs mb-3">
                <span style={{ color: C.muted }}>{k}</span>
                <span className="font-semibold" style={{ color: k==='Static Stability' ? C.success : C.text }}>{v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN MAP ── */}
        <main className="relative flex-1 flex flex-col overflow-hidden">
          <div className="relative flex-1">
            <MapContainer center={center} zoom={12} style={{ width:'100%', height:'100%' }} zoomControl={false} attributionControl={false}>
              <TileLayer url={tileUrl} />
              <MapClickHandler onMapClick={setCenter} />
              <FlyTo center={center} />
              {/* Isolation zone */}
              <Circle center={center} radius={zones.isolation}
                pathOptions={{ color:C.danger, fillColor:C.danger, fillOpacity:0.25, weight:2 }} />
              {/* Protective action zone */}
              <Circle center={center} radius={zones.protective}
                pathOptions={{ color:C.primary, fillColor:C.primary, fillOpacity:0.08, weight:1.5, dashArray:'6 4' }} />
              {/* Downwind plume wedge */}
              <PlumeOverlay center={center} direction={Number(direction)} downwindRadius={zones.downwind} />
            </MapContainer>

            {/* Map controls */}
            <div className="absolute right-4 top-4 flex flex-col gap-2 z-[1000]">
              <div className="rounded-lg overflow-hidden flex flex-col" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}` }}>
                {['add','remove'].map((ic,i) => (
                  <div key={ic} className="w-10 h-10 flex items-center justify-center" style={{ color: C.muted, borderBottom:i===0?`1px solid ${C.border}`:'none' }}>
                    <span className="material-symbols-outlined">{ic}</span>
                  </div>
                ))}
              </div>
              {['layers','my_location'].map(ic => (
                <div key={ic} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}`, color: C.muted }}>
                  <span className="material-symbols-outlined">{ic}</span>
                </div>
              ))}
            </div>

            {/* Zone legend */}
            <div className="absolute left-4 bottom-4 p-4 rounded-xl flex flex-col gap-3 shadow-2xl z-[1000]" style={{ minWidth:220, backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}`, backdropFilter:'blur(12px)' }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>Zone Definition</h3>
              {[
                { color: C.danger,    label:'Isolation Zone',       radius: zones.isolation },
                { color: C.primary,   label:'Protective Action',     radius: zones.protective },
                { color: C.secondary, label:'Downwind Hazard Plume', radius: zones.downwind },
              ].map(({ color, label, radius }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow:`0 0 0 4px ${color}33` }} />
                  <span className="text-xs" style={{ color:'#CBD5E1' }}>{label}</span>
                  <span className="ml-auto font-mono font-bold text-[11px]" style={{ color }}>{radius} m</span>
                </div>
              ))}
            </div>

            {/* Gaussian Analysis card */}
            <div className="absolute right-4 bottom-4 rounded-xl overflow-hidden shadow-2xl z-[1000]" style={{ width:380, backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}`, backdropFilter:'blur(12px)' }}>
              <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom:`1px solid ${C.border}`, backgroundColor:`${C.primary}0D` }}>
                <h2 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>
                  <span className="material-symbols-outlined text-lg">monitoring</span> Gaussian Analysis
                </h2>
                <span className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>Stable Mode</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor:`${C.bg}80`, border:`1px solid ${C.border}` }}>
                    <p className="text-[10px] uppercase font-bold mb-1 tracking-wider" style={{ color: C.muted }}>Max Concentration</p>
                    <p className="text-2xl font-bold" style={{ color: C.danger, fontFamily:'Rajdhani, sans-serif' }}>{params.maxConc.toLocaleString()} <span className="text-[10px]" style={{ color: C.muted }}>PPM</span></p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor:`${C.bg}80`, border:`1px solid ${C.border}` }}>
                    <p className="text-[10px] uppercase font-bold mb-1 tracking-wider" style={{ color: C.muted }}>Time to Dissipate</p>
                    <p className="text-2xl font-bold" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>{params.dissipate} <span className="text-[10px]" style={{ color: C.muted }}>MIN</span></p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="uppercase tracking-wider font-bold" style={{ color: C.muted }}>Inhalation Risk</span>
                    <span className="font-bold uppercase" style={{ color: C.danger }}>{params.risk}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
                    <div className="h-full" style={{ width:`${riskPct}%`, backgroundColor: C.danger, boxShadow:`0 0 8px ${C.danger}`, transition:'width 0.5s ease' }} />
                  </div>
                </div>
                <button onClick={handleExport}
                  className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all"
                  style={{ backgroundColor: exported?`${C.success}22`:C.border, border:`1px solid ${exported?C.success:C.primary}33`, color: exported?C.success:C.primary, fontFamily:'Rajdhani, sans-serif' }}>
                  {exported ? '✓ Downloaded!' : 'Download SITREP PDF'}
                </button>
              </div>
            </div>
          </div>

          {/* Triage Bar */}
          <div className="flex items-center px-6 gap-6 shrink-0" style={{ height:120, borderTop:`1px solid ${C.border}`, backgroundColor: C.surface }}>
            <div className="flex-none pr-6" style={{ borderRight:`1px solid ${C.border}` }}>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Triage Overview</h3>
              <div className="flex gap-4">
                {[['184','Red (Imm)',C.danger],['312','Yellow (Del)',C.secondary],['1.2k','Green (Min)',C.success]].map(([n,l,c]) => (
                  <div key={l} className="text-center">
                    <div className="text-xl font-bold" style={{ color:c, fontFamily:'Rajdhani, sans-serif' }}>{n}</div>
                    <div className="text-[9px] uppercase" style={{ color: C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-4">
              {[
                ['Decon Station A','42 throughput/hr',C.success,'Active'],
                ['Hospital Load','98% ICU Capacity',C.danger,'Saturated'],
                ['Evac Route 12','15k En Route',C.secondary,'Congested'],
              ].map(([title,stat,color,status]) => (
                <div key={title} className="p-3 rounded-lg" style={{ backgroundColor:`${C.bg}80`, border:`1px solid ${C.border}55` }}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>{title}</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color }}>{status}</span>
                  </div>
                  <div className="text-base font-bold" style={{ fontFamily:'Rajdhani, sans-serif', color: C.text }}>{stat}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* STATUS BAR */}
      <footer className="h-8 flex items-center justify-between px-6 text-[10px] uppercase tracking-[0.2em] font-bold" style={{ backgroundColor: C.surface, borderTop:`1px solid ${C.border}`, color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.success }} /> GPS: {center[0].toFixed(4)}° N, {center[1].toFixed(4)}°</span>
          <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.success }} /> Sensor Grid 24/24 Online</span>
        </div>
        <div className="flex gap-4">
          <span style={{ color: C.primary, fontWeight:700 }}>SENTINEL V2.5-ALPHA</span>
          <span>System Uptime: 142:21:05</span>
        </div>
      </footer>
    </div>
  );
}
