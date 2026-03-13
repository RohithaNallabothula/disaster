import React from 'react';

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

const SOURCES = [
  { icon:'satellite_alt', label:'Copernicus / ESA',  title:'Satellite Ingestion',   pct:'98.4%', trend:'+0.2', trendUp:true,  badge:'High',     latency:'0.42s', color: C.primary,   svgPath:'M0 45 Q 25 15, 50 35 T 100 25 T 150 45 T 200 15' },
  { icon:'sensors',       label:'MQTT Protocol',     title:'IoT Network',           pct:'94.1%', trend:'+1.5', trendUp:true,  badge:'High',     latency:'0.08s', color: C.primary,   svgPath:'M0 30 L 20 25 L 40 45 L 60 15 L 80 50 L 100 20 L 120 40 L 140 10 L 160 35 L 180 25 L 200 45' },
  { icon:'newspaper',     label:'Reuters Intel',     title:'Global Social Intel',   pct:'89.2%', trend:'+2.4', trendUp:true,  badge:'Solid',    latency:'12.1s', color: C.primary,   svgPath:'M0 30 C 20 30, 40 10, 60 10 S 80 50, 100 50 S 120 20, 140 20 S 160 40, 180 40 S 200 30, 200 30' },
  { icon:'dataset',       label:'Public OSINT',      title:'Open Intel Feeds',      pct:'76.5%', trend:'-1.2', trendUp:false, badge:'Variable', latency:'45.0s', color: C.secondary, svgPath:'M0 40 L 25 35 L 50 45 L 75 25 L 100 30 L 125 15 L 150 25 L 175 40 L 200 35' },
  { icon:'groups',        label:'Citizen Reports',   title:'Crowd Sourced',         pct:'61.2%', trend:'-8.4', trendUp:false, badge:'Moderate', latency:'2.4m',  color: C.danger,    svgPath:'M0 10 L 50 40 L 100 55 L 150 45 L 200 58' },
];

const LOGS = [
  { time:'[14:22:01.402]', level:'Info',  color: C.success,    text:'Satellite data cluster (COPERNICUS-V3) ingested successfully. 4.8k packets processed. Global confidence parity reached.', highlight:true },
  { time:'[14:21:58.210]', level:'Info',  color: C.success,    text:'MQTT Broker heartbeat detected on port 1883. TLS 1.3 Handshake successful. Latency: 4ms.' },
  { time:'[14:21:45.003]', level:'Warn',  color: C.secondary,  text:'Crowd Reports threshold exception: High volume of contradictory reports in Sector 7-G. Anomaly detection active.', highlight:true },
  { time:'[14:21:30.912]', level:'Info',  color: C.success,    text:"Reuters News API: 'Major Fire in Industrial Park' report extracted. Sentiment: Critical. Location tagged." },
  { time:'[14:21:12.445]', level:'Info',  color: C.success,    text:'OSINT background sync initialized for regional conflict zones. Polling 14 external nodes.' },
  { time:'[14:20:55.101]', level:'Info',  color: C.success,    text:'SENTINEL-AI: Confidence weights recalibrated for IoT sensors based on thermal anomaly cross-verification.', highlight:true },
  { time:'[14:20:42.000]', level:'Debug', color:'#475569',     text:'Memory cleanup: Buffers for stream OSINT-77 purged. 128MB reclaimed.' },
  { time:'[14:19:44.230]', level:'Error', color: C.danger,     text:'Critical: Failed to connect to DarkWeb Monitoring Node #03. Connection timeout (408). Retrying in 15s.', highlight:true },
  { time:'[14:19:12.115]', level:'Info',  color: C.success,    text:'System baseline check complete: 100% operational efficiency across core services.' },
];

export default function DataSourceMonitor() {
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 lg:px-10 py-8">
        {/* Page heading */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-tight" style={{ color:'#fff', fontFamily:'Rajdhani, sans-serif' }}>Data Source Monitor</h1>
            <p className="font-medium mt-1 tracking-wide text-sm uppercase" style={{ color:`${C.primary}CC` }}>Real-time Ingestion Health &amp; Confidence Index</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor:`${C.success}1A`, border:`1px solid ${C.success}33` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.success }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.success }}>System Operational</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded" style={{ backgroundColor:`${C.primary}1A`, border:`1px solid ${C.primary}33` }}>
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary }}>Node: DC-ALPHA-04</span>
            </div>
          </div>
        </div>

        {/* Source Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {SOURCES.map(s => (
            <div key={s.title} className="flex flex-col gap-4 p-5 rounded relative overflow-hidden transition-all group cursor-pointer"
              style={{ border:`1px solid ${C.border}`, backgroundColor: C.surface }}>
              <div className="flex justify-between items-start z-10">
                <div className="p-2 rounded" style={{ backgroundColor:`${s.color}1A`, color: s.color }}>
                  <span className="material-symbols-outlined">{s.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: C.muted }}>{s.label}</span>
              </div>
              <div className="z-10">
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color:'#CBD5E1', fontFamily:'Rajdhani, sans-serif' }}>{s.title}</h3>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-bold" style={{ color:'#fff', fontFamily:'Rajdhani, sans-serif' }}>{s.pct}</span>
                  <div className="px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ backgroundColor: s.trendUp ? `${C.success}1A` : `${C.danger}1A` }}>
                    <span className="material-symbols-outlined text-[10px]" style={{ color: s.trendUp ? C.success : C.danger }}>
                      {s.trendUp ? 'expand_less' : 'expand_more'}
                    </span>
                    <span className="text-[10px] font-bold" style={{ color: s.trendUp ? C.success : C.danger }}>{Math.abs(parseFloat(s.trend))}</span>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase mt-1 tracking-widest" style={{ color:`${s.color}99` }}>Confidence Badge: {s.badge}</p>
              </div>
              <div className="h-16 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                <svg className="w-full h-full" viewBox="0 0 200 60">
                  <path d={s.svgPath} fill="none" stroke={s.color} strokeWidth="1.5" />
                </svg>
              </div>
              <div className="flex justify-between items-center pt-2 z-10" style={{ borderTop:`1px solid ${C.border}` }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>Sync Latency</span>
                <span className="text-[10px] font-mono" style={{ color: s.color }}>{s.latency}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Logs */}
          <div className="flex-1 rounded overflow-hidden flex flex-col" style={{ minHeight:540, border:`1px solid ${C.border}`, backgroundColor: C.surface }}>
            <div className="px-5 py-4 flex justify-between items-center" style={{ borderBottom:`1px solid ${C.border}`, backgroundColor:'rgba(30,41,59,0.2)' }}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-xl" style={{ color: C.primary }}>terminal</span>
                <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color:'#CBD5E1', fontFamily:'Rajdhani, sans-serif' }}>Global System Ingestion Logs</h2>
              </div>
              <div className="flex gap-2">
                {['Export CSV','Clear Logs'].map(btn => (
                  <button key={btn} className="text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest transition-colors"
                    style={{ border:`1px solid ${C.primary}33`, color: C.primary }}>
                    {btn}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-2.5 font-mono text-[11px]" style={{ backgroundColor:'rgba(0,0,0,0.2)' }}>
              {LOGS.map((log, i) => (
                <div key={i} className="flex gap-4 p-2.5 rounded"
                  style={{ backgroundColor: log.highlight ? `${log.color}0D` : 'transparent', borderLeft: log.highlight ? `4px solid ${log.color}` : '4px solid transparent' }}>
                  <span className="shrink-0" style={{ color: C.muted }}>{log.time}</span>
                  <span className="font-bold uppercase w-12 text-center" style={{ color: log.color }}>{log.level}</span>
                  <span style={{ color:'#CBD5E1' }}>{log.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Side stats */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* Ingestion summary */}
            <div className="p-6 rounded" style={{ border:`1px solid ${C.border}`, backgroundColor: C.surface }}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-5" style={{ fontFamily:'Rajdhani, sans-serif', color:'#CBD5E1' }}>Ingestion Summary</h3>
              {[['Active Data Streams','1,422',85,''],['System Memory Utilization','14.2 GB',42,''],['Net Throughput','82 MB/s',68,'']].map(([label,val,pct]) => (
                <div key={label} className="space-y-2 mb-5">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider font-bold">
                    <span style={{ color: C.muted }}>{label}</span>
                    <span className="font-mono" style={{ color:'#fff' }}>{val}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor:'#1e293b' }}>
                    <div className="h-full rounded-full" style={{ width:`${pct}%`, backgroundColor: C.primary }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Trust Index */}
            <div className="p-6 rounded" style={{ backgroundColor: C.primary }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined font-black" style={{ color: C.bg }}>verified_user</span>
                <h3 className="text-xs font-bold uppercase tracking-widest" style={{ color: C.bg, fontFamily:'Rajdhani, sans-serif' }}>Global Trust Index</h3>
              </div>
              <p className="text-5xl font-bold mb-2" style={{ color: C.bg, fontFamily:'Rajdhani, sans-serif' }}>86%</p>
              <p className="text-xs font-medium leading-relaxed" style={{ color:`${C.bg}E6`, opacity:0.9 }}>
                Cross-referenced data across all 12 global regions is rated at <span className="font-bold underline">High Confidence</span>. AI SITREP generation is currently <span className="font-bold">ENABLED</span>.
              </p>
              <button className="w-full mt-6 py-2.5 rounded font-bold text-[10px] uppercase tracking-widest transition-colors" style={{ backgroundColor: C.bg, color:'#fff', border:`1px solid ${C.bg}` }}>
                Download SITREP Report
              </button>
            </div>
            {/* Mini map */}
            <div className="p-6 rounded" style={{ border:`1px solid ${C.border}`, backgroundColor: C.surface }}>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ fontFamily:'Rajdhani, sans-serif', color:'#CBD5E1' }}>Regional Node Map</h3>
              <div className="aspect-video w-full rounded flex items-center justify-center relative overflow-hidden" style={{ backgroundColor:'rgba(30,41,59,0.5)', border:`1px dashed ${C.primary}4D` }}>
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 200 100">
                    <path className="animate-pulse" d="M20,50 Q40,20 60,50 T100,50 T140,50 T180,50" fill="none" stroke={C.primary} strokeWidth="0.5" />
                    <circle cx="45" cy="35" r="2" fill={C.primary} />
                    <circle cx="120" cy="55" r="2" fill={C.primary} />
                    <circle cx="160" cy="30" r="2" fill={C.primary} />
                  </svg>
                </div>
                <span className="material-symbols-outlined text-3xl relative z-10" style={{ color:`${C.primary}99` }}>explore</span>
              </div>
              <p className="text-[10px] text-center mt-3 italic" style={{ color: C.muted }}>Monitoring active global clusters in real-time</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-10 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop:`1px solid ${C.border}`, backgroundColor:`${C.surface}80` }}>
        <div className="flex items-center gap-3" style={{ color: C.muted }}>
          <span className="material-symbols-outlined text-sm">security</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Sentinel Intelligence Systems v5.0.0-V2_STABLE</span>
        </div>
        <div className="flex gap-8">
          {['System Documentation','API Key Management','Support Desk'].map(lbl => (
            <a key={lbl} href="#" className="text-[10px] font-bold uppercase tracking-widest transition-colors" style={{ color: C.muted }}>{lbl}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
