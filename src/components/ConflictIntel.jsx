import React from 'react';

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

const NAV = [
  { icon:'dashboard', label:'Global Intel', active:true },
  { icon:'map',       label:'Heatmaps' },
  { icon:'timeline',  label:'Forecasting' },
  { icon:'security',  label:'Military Ops' },
  { icon:'rss_feed',  label:'OSINT Live' },
];

const OSINT = [
  { level:'Critical Alert', color: C.danger,    age:'2m ago',  text:'Multiple ground-to-air radar activations detected in Sector 7 perimeter.', tags:['SIGINT','Conf: 98%'] },
  { level:'Propaganda Shift', color: C.secondary, age:'14m ago', text:'State-media rhetoric intensifying regarding maritime border claims.', tags:['Social','NLP Cluster'] },
  { level:'Diplomatic',      color: C.primary,   age:'45m ago', text:'UN Security Council calls for emergency session at 22:00 UTC.', tags:['Official'] },
];

export default function ConflictIntel() {
  return (
    <div className="flex h-full overflow-hidden" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      {/* ── SIDEBAR ── */}
      <aside className="hidden md:flex flex-col shrink-0" style={{ width:256, backgroundColor: C.surface, borderRight:`1px solid ${C.border}` }}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center rounded-lg" style={{ backgroundColor: C.primary, boxShadow:`0 0 15px ${C.primary}66` }}>
            <span className="material-symbols-outlined font-bold" style={{ color: C.bg }}>radar</span>
          </div>
          <h1 className="font-bold text-2xl tracking-tighter" style={{ color:'#fff', fontFamily:'Rajdhani, sans-serif' }}>SENTINEL<span style={{ color: C.primary, fontWeight:900 }}> V2</span></h1>
        </div>
        <nav className="flex-1 px-4 space-y-1 py-4">
          {NAV.map(n => (
            <div key={n.label} className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors"
              style={n.active ? { backgroundColor:`${C.primary}1A`, color: C.primary, border:`1px solid ${C.primary}33` } : { color: C.muted }}>
              <span className="material-symbols-outlined">{n.icon}</span>
              <span className="font-semibold">{n.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4" style={{ borderTop:`1px solid ${C.border}` }}>
          <div className="flex items-center gap-3 p-2 rounded-xl" style={{ backgroundColor:`${C.bg}80`, border:`1px solid ${C.border}` }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor:`${C.primary}33`, border:`1px solid ${C.primary}4D` }}>
              <span className="material-symbols-outlined text-sm" style={{ color: C.primary }}>person</span>
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: C.text }}>Cmdr. Sterling</p>
              <p className="text-[10px] uppercase tracking-wider" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>Level 5 Access</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: C.bg }}>
        {/* Subheader */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-20" style={{ backgroundColor:`${C.surface}CC`, borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(20px)' }}>
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: C.muted }}>Conflict Intensity Monitor</h2>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor:`${C.danger}1A`, border:`1px solid ${C.danger}33` }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.danger }} />
              <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: C.danger }}>Live SITREP</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: C.muted }}>search</span>
              <input className="rounded-lg pl-10 pr-4 py-2 text-sm w-72 outline-none transition-all" placeholder="Search coordinates or entities..."
                style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.text }} />
            </div>
            {['notifications','light_mode','settings'].map(ic => (
              <button key={ic} className="p-2 transition-colors" style={{ color: C.muted }}>
                <span className="material-symbols-outlined">{ic}</span>
              </button>
            ))}
          </div>
        </header>

        <div className="p-6 lg:p-8 space-y-6">
          {/* Forecast chart */}
          <div className="rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
            <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-1" style={{ color:'#fff', fontFamily:'Rajdhani, sans-serif' }}>Conflict Intensity Forecast</h3>
                <p className="text-sm max-w-xl" style={{ color: C.muted }}>Aggregated NLP intelligence score processing global news, social patterns, and satellite telemetry.</p>
              </div>
              <div className="flex gap-6 items-center p-4 rounded-xl" style={{ backgroundColor:`${C.bg}80`, border:`1px solid ${C.border}` }}>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.muted }}>Current Score</div>
                  <div className="text-4xl font-black tracking-tighter" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>7.42</div>
                </div>
                <div className="w-px h-10" style={{ backgroundColor: C.border }} />
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C.muted }}>24h Projection</div>
                  <div className="text-2xl font-black tracking-tighter" style={{ color: C.danger, fontFamily:'Rajdhani, sans-serif' }}>8.15</div>
                  <div className="text-[10px] font-bold" style={{ color: C.danger }}>+9.8% Rise</div>
                </div>
              </div>
            </div>
            {/* SVG chart */}
            <div className="relative w-full" style={{ height:350 }}>
              <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
                <line x1="0" y1="50"  x2="1000" y2="50"  stroke={C.border} strokeDasharray="8 8" />
                <line x1="0" y1="150" x2="1000" y2="150" stroke={C.border} strokeDasharray="8 8" />
                <line x1="0" y1="250" x2="1000" y2="250" stroke={C.border} strokeDasharray="8 8" />
                <path d="M 600 150 L 700 120 L 800 160 L 900 100 L 1000 80 L 1000 220 L 900 240 L 800 260 L 700 230 L 600 150 Z" fill={`${C.primary}14`} />
                <path d="M 0 240 L 100 230 L 200 250 L 300 210 L 400 190 L 500 215 L 600 150" fill="none" stroke="#64748B" strokeWidth="4" strokeLinecap="round" />
                <path d="M 600 150 L 700 170 L 800 210 L 900 150 L 1000 120" fill="none" stroke={C.primary} strokeDasharray="8 8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="600" cy="150" r="6" fill={C.primary} stroke={C.bg} strokeWidth="2" />
                <rect x="580" y="110" width="40" height="20" rx="4" fill={C.primary} />
                <text x="600" y="124" textAnchor="middle" fill={C.bg} fontSize="10" fontWeight="900">NOW</text>
              </svg>
              <div className="flex justify-between mt-6 px-2">
                {['-48H','-24H','Live Pulse','+12H Forecast','+24H Forecast'].map((lbl,i) => (
                  <span key={lbl} className="text-[11px] font-bold uppercase tracking-widest" style={{ color: i < 2 ? C.muted : i === 2 ? C.primary : `${C.primary}99`, fontFamily:'Rajdhani, sans-serif' }}>{lbl}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom grid */}
          <div className="grid grid-cols-12 gap-6">
            {/* Casualty cards */}
            <div className="col-span-12 md:col-span-4 space-y-4">
              <h4 className="text-sm font-bold px-1" style={{ color:'#fff' }}>Casualty Assessment</h4>
              {[
                { badge:'Critical', color: C.danger, zone:'Zone A-1 High-Density', count:'4,200 - 5,850', pct:88, note:'Confidence level: 94.2% based on census overlay.', icon:'warning' },
                { badge:'Elevated', color: C.secondary, zone:'Buffer Sector South', count:'850 - 1,120', pct:45, note:'Evacuation routes currently at 30% capacity.', icon:'group' },
              ].map(r => (
                <div key={r.zone} className="p-5 rounded-xl hover:border-primary/30 transition-all" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="material-symbols-outlined p-2 rounded-lg" style={{ color: r.color, backgroundColor:`${r.color}1A` }}>{r.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: r.color }}>{r.badge}</span>
                  </div>
                  <h5 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: C.muted }}>{r.zone}</h5>
                  <div className="text-3xl font-bold mb-2" style={{ color:'#fff' }}>{r.count}</div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                    <div className="h-full rounded-full" style={{ width:`${r.pct}%`, backgroundColor: r.color, boxShadow:`0 0 8px ${r.color}80` }} />
                  </div>
                  <p className="text-[10px] mt-3 font-medium italic" style={{ color: C.muted }}>{r.note}</p>
                </div>
              ))}
            </div>
            {/* Donut chart */}
            <div className="col-span-12 md:col-span-4">
              <div className="p-6 h-full flex flex-col rounded-xl" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-sm font-bold" style={{ color:'#fff' }}>Engagement Capabilities</h4>
                  <span className="material-symbols-outlined text-lg" style={{ color: C.muted }}>info</span>
                </div>
                <div className="flex-1 flex items-center justify-center relative">
                  <svg className="w-48 h-48 -rotate-90">
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke={C.border} strokeWidth="20" />
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke={C.primary} strokeWidth="20" strokeDasharray="502" strokeDashoffset="150" strokeLinecap="round" />
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke={C.danger} strokeWidth="20" strokeDasharray="502" strokeDashoffset="420" strokeLinecap="round" />
                    <circle cx="96" cy="96" r="80" fill="transparent" stroke={C.secondary} strokeWidth="20" strokeDasharray="502" strokeDashoffset="470" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color:'#fff', fontFamily:'Rajdhani, sans-serif' }}>82%</span>
                    <span className="text-[10px] font-bold uppercase" style={{ color: C.muted }}>Ready</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-8">
                  {[['Air-to-Air',C.primary],['Ballistic',C.danger],['Electronic',C.secondary],['Infantry','#374151']].map(([l,c]) => (
                    <div key={l} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor:c }} />
                      <span className="text-[11px] font-bold uppercase" style={{ color: C.muted }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* OSINT Feed */}
            <div className="col-span-12 md:col-span-4">
              <div className="rounded-xl flex flex-col" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}`, maxHeight:460 }}>
                <div className="p-5 flex items-center justify-between sticky top-0 rounded-t-xl z-10" style={{ borderBottom:`1px solid ${C.border}`, backgroundColor: C.surface }}>
                  <h4 className="text-sm font-bold flex items-center gap-2" style={{ color:'#fff' }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: C.primary }}>bolt</span> Live OSINT Reports
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ backgroundColor: C.bg, color: C.muted }}>12 NEW</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {OSINT.map(o => (
                    <div key={o.level} className="p-4 rounded-r-lg transition-colors cursor-pointer"
                      style={{ borderLeft:`2px solid ${o.color}`, backgroundColor:`${o.color}0D` }}>
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: o.color }}>{o.level}</span>
                        <span className="text-[10px]" style={{ color: C.muted }}>{o.age}</span>
                      </div>
                      <p className="text-sm font-semibold leading-snug" style={{ color:'#CBD5E1' }}>{o.text}</p>
                      <div className="mt-3 flex gap-2">
                        {o.tags.map(t => (
                          <span key={t} className="text-[9px] px-2 py-0.5 rounded uppercase font-bold" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}`, color: C.muted }}>{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="p-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors" style={{ color: C.primary, borderTop:`1px solid ${C.border}` }}>
                  Expand Full Intel Archive
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
