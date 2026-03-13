import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize:[25,41], iconAnchor:[12,41] });
L.Marker.prototype.options.icon = DefaultIcon;

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

// Live incident feed with random updates
const ICON_COLORS = { WILDFIRE:C.danger, FLOOD:C.primary, HAZMAT:C.secondary, CBRN:'#C026D3', EARTHQUAKE:'#F97316' };
const INCIDENT_POOL = [
  { id:'INC-882', type:'WILDFIRE',   lat:34.052, lng:-118.24, title:'Wildfire - Sierra Complex',     severity:'Critical' },
  { id:'INC-881', type:'FLOOD',      lat:34.12,  lng:-118.35, title:'Flood - Riverine Delta',        severity:'Medium'   },
  { id:'INC-880', type:'HAZMAT',     lat:34.00,  lng:-118.19, title:'Hazmat - Chemical Spill',       severity:'High'     },
  { id:'INC-879', type:'EARTHQUAKE', lat:33.95,  lng:-118.40, title:'Earthquake M4.2 — Southgate',  severity:'Medium'   },
  { id:'INC-878', type:'CBRN',       lat:34.08,  lng:-118.30, title:'CBRN — Bio-aerosol Detection', severity:'Critical' },
];

const SEV_COLORS = { Critical:C.danger, High:C.secondary, Medium:'#EAB308', Low:C.success };

function createDotIcon(color) {
  return L.divIcon({
    html:`<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 10px ${color};border:2px solid #fff"></div>`,
    className:'', iconSize:[14,14], iconAnchor:[7,7],
  });
}

// Simulated telemetry values
function useTelemetry() {
  const [tele, setTele] = useState({ sensors:24, coverage:98.2, latency:14, packets:4821, threats:3 });
  useEffect(() => {
    const id = setInterval(() => {
      setTele(t => ({
        sensors: t.sensors,
        coverage: +(t.coverage + (Math.random()-0.5)*0.3).toFixed(1),
        latency: Math.max(8, Math.min(40, t.latency + (Math.random()-0.5)*3 | 0)),
        packets: t.packets + (Math.random()*80 | 0),
        threats: t.threats,
      }));
    }, 2000);
    return () => clearInterval(id);
  }, []);
  return tele;
}

// Adds blinking pings on map
function PingMarker({ pos, color }) {
  const map = useMap();
  useEffect(() => {
    const icon = L.divIcon({
      html:`<div class="ping-ring" style="border-color:${color}"></div>`,
      className:'', iconSize:[30,30], iconAnchor:[15,15],
    });
    const m = L.marker(pos, { icon }).addTo(map);
    return () => m.remove();
  }, [pos, color, map]);
  return null;
}

const LOG_TEMPLATES = [
  (id,sev) => `[INFO] Incident ${id}: Status updated to ${sev}. NIMS ICS Phase 2 activated.`,
  (id)     => `[INFO] AI-SITREP for ${id} generated. Confidence: 94.2%`,
  (id)     => `[WARN] Crowd-report anomaly near ${id}. AI filtering active.`,
  ()       => `[INFO] Satellite pass COPERNICUS-V3 complete. 4.8k packets ingested.`,
  ()       => `[INFO] Sensor heartbeat OK — 24/24 nodes responding.`,
  (id)     => `[INFO] Resource allocation updated for ${id}. 6 units deployed.`,
];

export default function LiveMonitor() {
  const [incidents, setIncidents] = useState(INCIDENT_POOL);
  const [logs, setLogs]           = useState([]);
  const [selected, setSelected]   = useState(null);
  const [filter, setFilter]       = useState('ALL');
  const [mapType, setMapType]     = useState('dark');
  const [paused, setPaused]       = useState(false);
  const tele = useTelemetry();
  const logRef = useRef(null);

  // Simulate live log stream
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const inc = incidents[Math.random()*incidents.length|0];
      const tmpl = LOG_TEMPLATES[Math.random()*LOG_TEMPLATES.length|0];
      const msg = tmpl(inc.id, inc.severity);
      const level = msg.includes('[WARN]') ? 'WARN' : 'INFO';
      const entry = { id:Date.now(), ts:`[${new Date().toLocaleTimeString('en-US',{hour12:false})}]`, level, color: level==='WARN'?C.secondary:C.success, text:msg };
      setLogs(prev => [entry, ...prev].slice(0,60));
    }, 2500);
    return () => clearInterval(id);
  }, [incidents, paused]);

  // Auto-scroll logs
  useEffect(() => {
    if (logRef.current && !paused) logRef.current.scrollTop = 0;
  }, [logs]);

  const tileUrl = {
    dark:      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    streets:   'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  }[mapType];

  const filtered = filter==='ALL' ? incidents : incidents.filter(i => i.severity===filter || i.type===filter);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      {/* Sub-header toolbar */}
      <div className="flex items-center justify-between px-5 py-2.5 shrink-0" style={{ backgroundColor: C.surface, borderBottom:`1px solid ${C.border}` }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor:`${C.danger}1A`, border:`1px solid ${C.danger}33` }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.danger }} />
            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.danger }}>LIVE FEED</span>
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest hidden md:block" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>Global Incident Monitor</h2>
        </div>
        <div className="flex items-center gap-3">
          {/* Filter chips */}
          {['ALL','Critical','High','WILDFIRE','CBRN'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all"
              style={filter===f ? { backgroundColor:C.primary, color:C.bg } : { backgroundColor:C.bg, border:`1px solid ${C.border}`, color:C.muted }}>
              {f}
            </button>
          ))}
          <div className="w-px h-4 mx-1" style={{ backgroundColor: C.border }} />
          {/* Map tile selector */}
          {['dark','satellite','streets'].map(t => (
            <button key={t} onClick={() => setMapType(t)}
              className="px-2 py-1 rounded text-[10px] font-bold uppercase transition-all"
              style={mapType===t ? { backgroundColor:`${C.primary}22`, color:C.primary, border:`1px solid ${C.primary}44` } : { color:C.muted }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* MAP — 70% */}
        <div className="relative flex-1" style={{ minWidth:0 }}>
          <MapContainer center={[34.05, -118.24]} zoom={11} style={{ width:'100%', height:'100%' }} zoomControl={false} attributionControl={false}>
            <TileLayer url={tileUrl} />
            {filtered.map(inc => {
              const color = SEV_COLORS[inc.severity] || C.muted;
              return (
                <React.Fragment key={inc.id}>
                  <Circle center={[inc.lat, inc.lng]} radius={1500}
                    pathOptions={{ color, fillColor:color, fillOpacity:0.12, weight:1.5, dashArray:'6 4' }} />
                  <Marker position={[inc.lat, inc.lng]} icon={createDotIcon(color)}
                    eventHandlers={{ click: () => setSelected(inc) }}>
                    <Popup>
                      <div style={{ fontFamily:'Source Sans 3, sans-serif', minWidth:180, background:C.surface, padding:8, borderRadius:6, color:C.text }}>
                        <div className="font-bold text-sm" style={{ color }}>{inc.title}</div>
                        <div className="text-[11px] mt-1" style={{ color:C.muted }}>Type: {inc.type} | Severity: {inc.severity}</div>
                        <div className="text-[11px]" style={{ color:C.muted }}>ID: {inc.id}</div>
                      </div>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>

          {/* Incident count overlay */}
          <div className="absolute top-3 left-3 z-[1000] flex flex-col gap-2">
            {Object.entries({ Critical:C.danger, High:C.secondary, Medium:'#EAB308' }).map(([sev,col]) => (
              <div key={sev} className="flex items-center gap-2 px-3 py-1.5 rounded shadow" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${col}44` }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor:col }} />
                <span className="text-[10px] font-bold uppercase" style={{ color:col }}>{sev}</span>
                <span className="ml-auto font-mono font-bold text-xs" style={{ color:col }}>{incidents.filter(i=>i.severity===sev).length}</span>
              </div>
            ))}
          </div>

          {/* Selected incident card */}
          {selected && (
            <div className="absolute bottom-3 left-3 z-[1000] p-4 rounded-xl shadow-2xl" style={{ backgroundColor:`${C.surface}EE`, border:`1px solid ${C.border}`, maxWidth:320, backdropFilter:'blur(12px)' }}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold uppercase" style={{ color: SEV_COLORS[selected.severity] }}>{selected.severity}</span>
                <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              <h4 className="font-bold text-sm mb-1" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif', textTransform:'uppercase' }}>{selected.title}</h4>
              <div className="text-xs" style={{ color:C.muted }}>ID: {selected.id} | Type: {selected.type}</div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-1.5 rounded text-xs font-bold uppercase" style={{ backgroundColor:C.primary, color:C.bg }}>Dispatch Unit</button>
                <button className="flex-1 py-1.5 rounded text-xs font-bold uppercase" style={{ backgroundColor:C.surface, border:`1px solid ${C.border}`, color:C.muted }}>View ICS</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL — 30% */}
        <div className="flex flex-col shrink-0 overflow-hidden" style={{ width:340, borderLeft:`1px solid ${C.border}`, backgroundColor: C.surface }}>
          {/* Telemetry strip */}
          <div className="grid grid-cols-3 gap-0.5 p-3 shrink-0" style={{ borderBottom:`1px solid ${C.border}`, backgroundColor:`${C.bg}80` }}>
            {[
              ['Sensors',    tele.sensors,   'Online',  C.success],
              ['Coverage',   tele.coverage+'%','',      C.primary],
              ['Latency',    tele.latency+'ms','',      tele.latency>25?C.secondary:C.success],
            ].map(([label,val,sub,color]) => (
              <div key={label} className="text-center px-2 py-2">
                <div className="text-[9px] uppercase font-bold mb-1" style={{ color: C.muted }}>{label}</div>
                <div className="text-base font-bold font-mono" style={{ color, fontFamily:'Rajdhani, sans-serif' }}>{val}</div>
                {sub && <div className="text-[8px] uppercase" style={{ color }}>{sub}</div>}
              </div>
            ))}
          </div>

          {/* Incident list */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderBottom:`1px solid ${C.border}` }}>
            <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Active Incidents ({filtered.length})</span>
            <button onClick={() => setSelected(null)} className="text-[10px] uppercase font-bold" style={{ color: C.primary }}>Clear</button>
          </div>
          <div className="overflow-y-auto shrink-0" style={{ maxHeight:200 }}>
            {filtered.map(inc => (
              <div key={inc.id} onClick={() => setSelected(inc)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{ borderBottom:`1px solid ${C.border}44`, backgroundColor: selected?.id===inc.id ? `${C.primary}11` : 'transparent' }}>
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: SEV_COLORS[inc.severity] }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate" style={{ color: C.text }}>{inc.title}</div>
                  <div className="text-[10px]" style={{ color: C.muted }}>{inc.id} · {inc.type}</div>
                </div>
                <span className="text-[9px] font-bold uppercase shrink-0" style={{ color: SEV_COLORS[inc.severity] }}>{inc.severity}</span>
              </div>
            ))}
          </div>

          {/* Live log stream */}
          <div className="flex items-center justify-between px-4 py-2 shrink-0" style={{ borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}` }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ color: C.primary }}>terminal</span>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Live Log Stream</span>
            </div>
            <button onClick={() => setPaused(p => !p)}
              className="text-[10px] font-bold uppercase px-2 py-0.5 rounded transition-all"
              style={{ backgroundColor: paused?`${C.secondary}22`:`${C.success}22`, color: paused?C.secondary:C.success, border:`1px solid ${paused?C.secondary:C.success}44` }}>
              {paused ? '▶ Resume' : '⏸ Pause'}
            </button>
          </div>
          <div ref={logRef} className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[10px]" style={{ backgroundColor:'#00000018' }}>
            {logs.map(log => (
              <div key={log.id} className="flex gap-2 px-2 py-1.5 rounded"
                style={{ backgroundColor: log.level==='WARN' ? `${C.secondary}0D` : 'transparent', borderLeft:`3px solid ${log.color}` }}>
                <span style={{ color: C.muted, whiteSpace:'nowrap' }}>{log.ts}</span>
                <span className="font-bold w-10 shrink-0 text-center" style={{ color: log.color }}>{log.level}</span>
                <span style={{ color:'#94A3B8' }}>{log.text.replace(/^\[.*?\]\s*/,'')}</span>
              </div>
            ))}
            {logs.length===0 && (
              <div className="text-center py-8" style={{ color: C.muted }}>Awaiting live stream...</div>
            )}
          </div>

          {/* Packets counter */}
          <div className="px-4 py-2 shrink-0 flex items-center gap-2" style={{ borderTop:`1px solid ${C.border}`, backgroundColor:`${C.bg}80` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} />
            <span className="text-[10px] font-mono font-bold" style={{ color: C.muted }}>Packets: <span style={{ color: C.primary }}>{tele.packets.toLocaleString()}</span></span>
            <span className="ml-auto text-[10px] font-bold uppercase" style={{ color: C.muted }}>Node: DC-ALPHA-04</span>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <footer className="px-6 py-2 flex justify-between items-center font-mono text-[10px] font-bold tracking-widest uppercase" style={{ backgroundColor: C.surface, borderTop:`1px solid ${C.border}`, color: C.muted }}>
        <div className="flex items-center gap-6">
          <span><span style={{ color: C.primary }}>ACTIVE INCIDENTS:</span> {incidents.length}</span>
          <span style={{ borderLeft:`1px solid ${C.border}`, paddingLeft:24 }}><span style={{ color: C.primary }}>ALERT LEVEL:</span> <span style={{ color: C.danger }}>BRAVO</span></span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2" style={{ color: C.success }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: C.success }} /> LIVE GLOBAL FEED ACTIVE
          </div>
        </div>
      </footer>
    </div>
  );
}
