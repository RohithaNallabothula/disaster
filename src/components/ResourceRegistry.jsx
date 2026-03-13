import React, { useState } from 'react';

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

const SIDEBAR_NAV = [
  { icon:'dashboard', label:'Dashboard' },
  { icon:'inventory_2', label:'Resource Registry', active:true },
  { icon:'map', label:'Tactical Map' },
  { icon:'radio', label:'Comms Hub' },
  { icon:'biotech', label:'CBRN Module' },
];

const FILTER_TABS = ['All Resources (124)','Ambulances','Fire Support','CBRN / HAZMAT','Logistics'];

const RESOURCES = [
  { icon:'ambulance',        iconColor: C.primary,    status:'Available', statusColor: C.success, id:'AL-01',  name:'Ambulance Alpha-1',  location:'Sector 4 - Zone B',    condLabel:'Condition',       condPct:98,  condSegs:[C.success,C.success,C.success,'dim'], actions:[{label:'Dispatch',primary:true},{icon:'more_vert'}] },
  { icon:'masks',            iconColor: C.danger,     status:'Deployed',  statusColor: C.danger,  id:'HZ-07',  name:'HAZMAT Unit 7',      location:'Industrial District',  condLabel:'Deployment Load', condPct:82,  condSegs:[C.danger,C.danger,C.danger,'dim'],   actions:[{label:'Recall Unit',primary:false},{icon:'info'}] },
  { icon:'home_work',        iconColor: C.secondary,  status:'En Route',  statusColor: C.secondary,id:'SH-D',  name:'Shelter Delta',      location:'Downtown Central',     condLabel:'ETA Progress',    condPct:45,  condSegs:[C.secondary,C.secondary,'dim','dim'],actions:[{label:'Update Route',primary:false},{icon:'map'}] },
  { icon:'medical_services', iconColor: C.primary,    status:'Available', statusColor: C.success, id:'MD-E5',  name:'Medic Echo-5',       location:'Forward Base 1',       condLabel:'Supply Level',    condPct:100, condSegs:[C.success,C.success,C.success,C.success], actions:[{label:'Dispatch',primary:true},{icon:'add'}] },
  { icon:'ambulance',        iconColor: C.primary,    status:'Available', statusColor: C.success, id:'AL-B3',  name:'Ambulance Beta-3',   location:'North Point Harbor',   condLabel:'Condition',       condPct:92,  condSegs:[C.success,C.success,C.success,'dim'], actions:[{label:'Dispatch',primary:true},{icon:'more_vert'}] },
  { icon:'medical_services', iconColor: C.danger,     status:'Deployed',  statusColor: C.danger,  id:'MD-S9',  name:'Medic Sierra-9',     location:'Central Medical',      condLabel:'Fatigue Level',   condPct:25,  condSegs:[C.danger,'dim','dim','dim'],          actions:[{label:'Relieve Duty',primary:false},{icon:'phone_in_talk'}] },
];

export default function ResourceRegistry() {
  const [activeFilter, setActiveFilter] = useState(0);

  return (
    <div className="flex h-full flex-col overflow-hidden" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      <div className="flex flex-1 overflow-hidden">
        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-6 overflow-y-auto p-4 shrink-0" style={{ width:256, backgroundColor:`${C.surface}80`, borderRight:`1px solid ${C.border}` }}>
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-widest font-bold mb-3 px-3" style={{ color: C.muted }}>Operations Hub</p>
            {SIDEBAR_NAV.map(n => (
              <button key={n.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded transition-all"
                style={n.active ? { backgroundColor:`${C.primary}1A`, color: C.primary, border:`1px solid ${C.primary}33` } : { color: C.muted }}>
                <span className="material-symbols-outlined text-xl">{n.icon}</span>
                <span className="text-sm font-medium" style={{ fontFamily:'Rajdhani, sans-serif', textTransform:'uppercase' }}>{n.label}</span>
              </button>
            ))}
          </div>
          <div className="mt-auto">
            <div className="p-4 rounded mb-4" style={{ backgroundColor: C.bg, border:`1px solid ${C.border}` }}>
              <h4 className="text-[10px] font-bold uppercase mb-2 tracking-widest" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>Rapid Deployment</h4>
              <div className="aspect-square w-full rounded relative overflow-hidden cursor-crosshair" style={{ backgroundColor:'rgba(0,0,0,0.4)', border:`1px solid ${C.border}` }}>
                <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, #060c18,#0a1a2e)', filter:'grayscale(0.6)' }} />
                <div className="absolute inset-0" style={{ background:'linear-gradient(to top, #0A0F1E, transparent)', opacity:0.6 }} />
                <div className="absolute bottom-2 left-2 right-2 flex justify-between text-[9px] font-mono uppercase" style={{ color:`${C.primary}CC` }}>
                  <span>Grid: 40.7128° N</span>
                  <span className="animate-pulse">Active</span>
                </div>
              </div>
              <p className="text-[10px] text-center mt-2 uppercase tracking-tighter italic" style={{ color: C.muted }}>Drag assets to map for dispatch</p>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-[10px] font-bold uppercase tracking-widest pt-4" style={{ borderTop:`1px solid ${C.border}`, color: C.muted }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.success }} />
              System Health: Nominal
            </div>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: C.bg }}>
          {/* Filter bar */}
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom:`1px solid ${C.border}`, backgroundColor:`${C.surface}4D` }}>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
              {FILTER_TABS.map((tab, i) => (
                <button key={tab} onClick={() => setActiveFilter(i)}
                  className="px-4 py-1.5 rounded text-[11px] font-bold whitespace-nowrap transition-all"
                  style={activeFilter===i ? { backgroundColor: C.primary, color: C.bg, fontFamily:'Rajdhani, sans-serif' } : { border:`1px solid ${C.border}`, color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2 shrink-0">
              {[['filter_alt','Filter'],['swap_vert','Sort']].map(([ic,lbl]) => (
                <button key={lbl} className="flex items-center gap-2 px-3 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest transition-colors"
                  style={{ border:`1px solid ${C.border}`, color: C.muted }}>
                  <span className="material-symbols-outlined text-sm">{ic}</span>{lbl}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {RESOURCES.map(r => (
                <div key={r.id} className="flex flex-col gap-4 p-5 rounded-lg cursor-move transition-all"
                  style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
                  <div className="flex justify-between items-start">
                    <div className="p-2 rounded" style={{ backgroundColor:`${r.iconColor}1A`, color: r.iconColor, border:`1px solid ${r.iconColor}33` }}>
                      <span className="material-symbols-outlined">{r.icon}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: r.statusColor, animation: r.status==='En Route' ? 'pulse 2s infinite' : 'none' }}>{r.status}</span>
                      <span className="text-[9px] font-mono" style={{ color: C.muted }}>ID: {r.id}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight" style={{ fontFamily:'Rajdhani, sans-serif', color: C.text, textTransform:'uppercase', letterSpacing:'0.05em' }}>{r.name}</h3>
                    <div className="flex items-center gap-1 text-[11px] mt-1 uppercase tracking-wider" style={{ color: C.muted }}>
                      <span className="material-symbols-outlined text-xs">location_on</span> {r.location}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[9px] uppercase font-bold px-0.5" style={{ color: C.muted }}>
                      <span>{r.condLabel}</span>
                      <span>{r.condPct}%</span>
                    </div>
                    <div className="flex gap-1">
                      {r.condSegs.map((seg, i) => (
                        <div key={i} className="flex-1 h-1 rounded-full" style={{ backgroundColor: seg === 'dim' ? `${C.border}` : seg }} />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto pt-2">
                    {r.actions.map((action, i) => (
                      action.label ? (
                        <button key={action.label} className={`${i===0?'flex-1':''} text-[11px] font-bold py-2 rounded uppercase transition-all`}
                          style={action.primary ? { backgroundColor:`${C.primary}1A`, color: C.primary, border:`1px solid ${C.primary}33`, fontFamily:'Rajdhani, sans-serif' }
                            : { backgroundColor: C.surface, border:`1px solid ${C.border}`, color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>
                          {action.label}
                        </button>
                      ) : (
                        <button key={action.icon} className="p-2 rounded transition-colors" style={{ border:`1px solid ${C.border}`, color: C.muted }}>
                          <span className="material-symbols-outlined text-sm">{action.icon}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer summary */}
          <footer className="p-3 flex items-center justify-between px-6 shrink-0" style={{ backgroundColor: C.surface, borderTop:`1px solid ${C.border}` }}>
            <div className="flex gap-8">
              {[['Available Assets:','48',C.success],['Active Deployments:','12',C.danger],['Logistics En Route:','07',C.secondary]].map(([lbl,val,color]) => (
                <div key={lbl} className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest" style={{ color: C.muted }}>{lbl}</span>
                  <span className="text-sm font-bold" style={{ color, fontFamily:'Rajdhani, sans-serif' }}>{val}</span>
                </div>
              ))}
            </div>
            <div className="text-[10px] font-mono uppercase" style={{ color: C.muted }}>
              Syncing Global Registry <span className="ml-2 px-1 py-0.5 rounded" style={{ backgroundColor:`${C.primary}1A`, color: C.primary }}>4s...</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
