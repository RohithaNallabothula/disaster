import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix default icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

// Hopkinson-Cranz scaling: radius = k * yield^(1/3)
// k constants (metres/kg^1/3 TNT) per PSI threshold
const PSI_CONFIGS = [
  { psi:'20.0 PSI', k: 2.2,  color: C.danger,    fillOpacity: 0.18, desc:'Total destruction of reinforced structures. Complete infrastructure failure.',    risk:'CRITICAL (99%)' },
  { psi:'10.0 PSI', k: 3.8,  color: '#F97316',   fillOpacity: 0.12, desc:'Severe structural damage; multi-story buildings collapsed. Glass fragmentation lethal.', risk:'SEVERE (85%)' },
  { psi:'5.0 PSI',  k: 6.2,  color: '#EAB308',   fillOpacity: 0.08, desc:'Residential buildings destroyed. Extensive debris. Moderate to high casualties.', risk:'MODERATE (40%)' },
  { psi:'1.0 PSI',  k: 18.0, color: C.primary,   fillOpacity: 0.04, desc:'Minor damage; window breakage. Atmospheric dust cloud exposure likely.',         risk:'MINIMAL (<5%)' },
];

function calcRadii(yieldKg) {
  return PSI_CONFIGS.map(z => ({ ...z, radius: Math.round(z.k * Math.cbrt(yieldKg)) }));
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({ click: e => onMapClick([e.latlng.lat, e.latlng.lng]) });
  return null;
}

function FlyTo({ center }) {
  const map = useMap();
  useEffect(() => { map.flyTo(center, map.getZoom(), { duration: 0.8 }); }, [center]);
  return null;
}

const NAV_ITEMS = [
  { icon:'grid_view', label:'Incident Command' },
  { icon:'explosion', label:'Blast Calculator', active: true },
  { icon:'biotech',   label:'CBRN Module' },
  { icon:'monitoring',label:'Intelligence Feed' },
];

export default function BlastCalculator() {
  const [yieldKg, setYieldKg]     = useState(5000);
  const [expType, setExpType]     = useState('High Explosive (TNT Equivalent)');
  const [center, setCenter]       = useState([40.7128, -74.006]);
  const [zones, setZones]         = useState(() => calcRadii(5000));
  const [calculating, setCalc]    = useState(false);
  const [mapType, setMapType]     = useState('street');
  const [exported, setExported]   = useState(false);
  const mapRef = useRef(null);

  const handleCalculate = async () => {
    setCalc(true);
    await new Promise(r => setTimeout(r, 600));
    setZones(calcRadii(Number(yieldKg)));
    setCalc(false);
  };

  const handleExport = () => {
    const rows = ['Pressure Zone,Effective Radius (m),Structural Damage Profile,Casualty Risk',
      ...zones.map(z => `"${z.psi}","${z.radius} m","${z.desc}","${z.risk}"`)].join('\n');
    const blob = new Blob([rows], { type:'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'blast_analysis.csv'; a.click();
    URL.revokeObjectURL(url);
    setExported(true); setTimeout(() => setExported(false), 2000);
  };

  const tileUrl = mapType === 'satellite'
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col shrink-0 overflow-y-auto" style={{ width:288, backgroundColor: C.surface, borderRight:`1px solid ${C.border}` }}>
          <nav className="p-4 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 px-3" style={{ color: C.muted }}>Primary Navigation</div>
            {NAV_ITEMS.map(n => (
              <div key={n.label} className="flex items-center gap-3 px-3 py-2.5 rounded transition-colors cursor-pointer"
                style={n.active ? { backgroundColor:`${C.primary}1A`, color: C.primary, border:`1px solid ${C.primary}33` } : { color: C.muted }}>
                <span className="material-symbols-outlined">{n.icon}</span>
                <span className="font-semibold uppercase text-sm" style={{ fontFamily:'Rajdhani, sans-serif', letterSpacing:'0.05em' }}>{n.label}</span>
              </div>
            ))}
          </nav>

          <div className="flex-1 p-5 space-y-5" style={{ borderTop:`1px solid ${C.border}` }}>
            <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>Input Parameters</h3>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: C.muted }}>Explosive Type</label>
              <select value={expType} onChange={e => setExpType(e.target.value)}
                className="w-full text-sm p-2 rounded outline-none"
                style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }}>
                <option>High Explosive (TNT Equivalent)</option>
                <option>Nuclear (Low Yield)</option>
                <option>Thermobaric / FAE</option>
                <option>Chemical Agent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: C.muted }}>Yield (KG TNT)</label>
              <div className="flex rounded overflow-hidden" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}` }}>
                <input type="number" min="1" max="1000000" value={yieldKg}
                  onChange={e => setYieldKg(e.target.value)}
                  className="flex-1 bg-transparent text-lg font-bold p-2 outline-none" style={{ color: C.text }} />
                <span className="px-3 self-center text-[10px] font-bold" style={{ color: C.muted }}>KG</span>
              </div>
              <input type="range" min="100" max="50000" value={yieldKg} onChange={e => setYieldKg(e.target.value)}
                className="w-full mt-2" style={{ accentColor: C.primary }} />
              <div className="flex justify-between text-[9px]" style={{ color: C.muted }}>
                <span>100 kg</span><span>50,000 kg</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: C.muted }}>Target — Click Map to Set</label>
              <div className="flex rounded overflow-hidden text-xs font-mono p-2 gap-2" style={{ backgroundColor: C.bg, border:`1px solid ${C.primary}44`, color: C.primary }}>
                <span className="material-symbols-outlined text-sm">location_on</span>
                {center[0].toFixed(4)}° N, {center[1].toFixed(4)}° W
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold tracking-tighter" style={{ color: C.muted }}>Map Layer</label>
              <div className="flex rounded overflow-hidden" style={{ border:`1px solid ${C.border}` }}>
                {['street','satellite'].map(t => (
                  <button key={t} onClick={() => setMapType(t)}
                    className="flex-1 py-1.5 text-xs font-bold uppercase transition-all"
                    style={mapType===t ? { backgroundColor: C.primary, color: C.bg } : { backgroundColor: C.surface, color: C.muted }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleCalculate} disabled={calculating}
              className="w-full py-3 rounded font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: calculating ? `${C.primary}88`:C.primary, color: C.bg, fontFamily:'Rajdhani, sans-serif', boxShadow:`0 4px 20px ${C.primary}33` }}>
              <span className="material-symbols-outlined text-xl">{calculating ? 'sync' : 'rocket_launch'}</span>
              {calculating ? 'Calculating...' : 'Calculate Effects'}
            </button>
          </div>

          {/* Zone legend */}
          <div className="p-4 text-xs space-y-2" style={{ borderTop:`1px solid ${C.border}` }}>
            {zones.map(z => (
              <div key={z.psi} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: z.color, boxShadow:`0 0 5px ${z.color}` }} />
                <span style={{ color: C.muted }}>{z.psi}</span>
                <span className="ml-auto font-mono font-bold text-[11px]" style={{ color: z.color }}>{z.radius} m</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* MAP */}
          <div className="flex-1 relative" style={{ minHeight: 0 }}>
            <MapContainer
              center={center} zoom={12} style={{ width:'100%', height:'100%' }}
              zoomControl={false} ref={mapRef} attributionControl={false}>
              <TileLayer url={tileUrl} />
              <MapClickHandler onMapClick={setCenter} />
              <FlyTo center={center} />
              {zones.map(z => (
                <Circle key={z.psi} center={center} radius={z.radius}
                  pathOptions={{ color: z.color, fillColor: z.color, fillOpacity: z.fillOpacity, weight: 1.5, dashArray: z.psi==='1.0 PSI'?'6 4':'none' }} />
              ))}
              <Marker position={center}>
                <Popup>
                  <div style={{ fontFamily:'monospace', fontSize:12 }}>
                    <strong>Ground Zero</strong><br />
                    {center[0].toFixed(5)}° N<br />
                    {Math.abs(center[1]).toFixed(5)}° W
                  </div>
                </Popup>
              </Marker>
            </MapContainer>

            {/* Ground Zero overlay card */}
            <div className="absolute top-4 left-4 p-3 rounded z-[1000] shadow-2xl" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}`, backdropFilter:'blur(8px)' }}>
              <div className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: C.muted }}>Ground Zero</div>
              {[['LAT', `${center[0].toFixed(4)}° N`],['LNG', `${Math.abs(center[1]).toFixed(4)}° W`]].map(([k,v]) => (
                <div key={k} className="flex items-center gap-3">
                  <span className="text-[11px] font-bold font-mono uppercase w-8" style={{ color: C.primary }}>{k}</span>
                  <span className="text-xs font-bold font-mono" style={{ color: C.text }}>{v}</span>
                </div>
              ))}
              <div className="mt-1.5 text-[9px] uppercase font-bold" style={{ color:`${C.muted}` }}>Click map to move target</div>
            </div>

            {/* Map type toggle on map */}
            <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
              <div className="flex flex-col rounded overflow-hidden shadow-xl" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}` }}>
                <button className="p-2.5 transition-colors" style={{ color: C.muted, borderBottom:`1px solid ${C.border}` }}
                  onClick={() => mapRef.current?._zoomIn?.() || mapRef.current?.zoomIn?.()}>
                  <span className="material-symbols-outlined text-lg">add</span>
                </button>
                <button className="p-2.5 transition-colors" style={{ color: C.muted }}>
                  <span className="material-symbols-outlined text-lg">remove</span>
                </button>
              </div>
            </div>
          </div>

          {/* DATA TABLE */}
          <div className="overflow-y-auto shrink-0" style={{ maxHeight:260, backgroundColor: C.surface, borderTop:`1px solid ${C.border}` }}>
            <div className="flex items-center justify-between p-5 sticky top-0 z-10" style={{ backgroundColor: C.surface, borderBottom:`1px solid ${C.border}` }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined" style={{ color: C.primary }}>analytics</span>
                <h2 className="text-lg font-bold uppercase tracking-wide" style={{ fontFamily:'Rajdhani, sans-serif' }}>Hopkinson-Cranz Blast Analysis</h2>
              </div>
              <button onClick={handleExport}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-all px-3 py-1.5 rounded"
                style={{ color: exported?C.success:C.primary, border:`1px solid ${exported?C.success:C.primary}44`, backgroundColor:`${exported?C.success:C.primary}11` }}>
                <span className="material-symbols-outlined text-sm">{exported?'check':'picture_as_pdf'}</span>
                {exported ? 'Exported!' : 'Export CSV'}
              </button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.muted, borderBottom:`1px solid ${C.border}` }}>
                  {['Pressure Zone','Effective Radius','Structural Damage Profile','Casualty Risk'].map((h,i) => (
                    <th key={h} className={`pb-3 pt-2 px-5 ${i===3?'text-right':''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map(z => (
                  <tr key={z.psi} style={{ borderBottom:`1px solid ${C.border}44` }}>
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: z.color }} />
                        <span className="font-bold font-mono" style={{ color: z.color }}>{z.psi}</span>
                      </div>
                    </td>
                    <td className="py-3 px-5 font-bold" style={{ color: C.text }}>{z.radius} m</td>
                    <td className="py-3 px-5 text-sm" style={{ color: C.muted }}>{z.desc}</td>
                    <td className="py-3 px-5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold"
                        style={{ backgroundColor:`${z.color}1A`, color: z.color, border:`1px solid ${z.color}33` }}>{z.risk}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <footer className="px-6 py-2 flex justify-between items-center font-mono text-[10px] font-bold tracking-widest uppercase" style={{ backgroundColor: C.surface, borderTop:`1px solid ${C.border}`, color: C.muted }}>
        <div className="flex items-center gap-6">
          <span><span style={{ color: C.primary }}>GRID:</span> MGRS 18TWV 8426 1109</span>
          <span style={{ borderLeft:`1px solid ${C.border}`, paddingLeft:24 }}><span style={{ color: C.primary }}>ENGINE:</span> HC-SCALING-V2.4</span>
          <span style={{ borderLeft:`1px solid ${C.border}`, paddingLeft:24 }}><span style={{ color: C.primary }}>LATENCY:</span> 14MS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ color: C.success }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> MAP SYNC ESTABLISHED
          </div>
          <div className="px-2 py-0.5 rounded" style={{ color: C.primary, backgroundColor:`${C.primary}1A` }}>SECURE ENCLAVE 04</div>
        </div>
      </footer>
    </div>
  );
}
