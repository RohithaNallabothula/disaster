import React, { useState } from 'react';

const C = { bg:'#0A0F1E', surface:'#111827', border:'#1E293B', primary:'#06B6D4', secondary:'#F59E0B', danger:'#EF4444', success:'#10B981', muted:'#64748B', text:'#F1F5F9' };

const INCIDENTS = [
  { id:'#INC-882', type:'Wildfire - Complex', icon:'local_fire_department', iconColor: C.secondary, region:'Region IV - Sierra Foothills', severity:'Critical', severityColor: C.danger, status:'Active', statusColor: C.primary, commander:'Cmdr. J. Donovan', initials:'JD', time:'04:12:44', expanded:true },
  { id:'#INC-881', type:'Flood - Riverine', icon:'water_drop', iconColor: C.primary, region:'Region II - Delta District', severity:'Medium', severityColor: C.secondary, status:'Contained', statusColor: C.muted, commander:'Capt. S. Miller', initials:'SM', time:'12:45:10', expanded:false },
  { id:'#INC-880', type:'Hazmat - Chemical', icon:'warning', iconColor: C.secondary, region:'Region IX - Industrial Park', severity:'High', severityColor: C.secondary, status:'Open', statusColor: C.primary, commander:'Cmdr. A. Lopez', initials:'AL', time:'00:22:55', expanded:false },
];

const STATS = [
  { label:'Total Active', value:'18', sub:'+3 Incidents (1hr)', subColor: C.primary },
  { label:'Operational Units', value:'142', sub:'82% Efficiency', subColor: C.success },
  { label:'Mean Response Time', value:'4m 12s', sub:'+12s Deviation', subColor: C.danger },
  { label:'Total At-Risk Pop.', value:'28.4k', sub:'Stabilized', subColor: C.muted },
];

export default function IncidentManagement() {
  const [expanded, setExpanded] = useState('#INC-882');
  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: C.bg, color: C.text, fontFamily:'Source Sans 3, sans-serif' }}>
      <main className="flex-1 px-4 lg:px-10 py-8 max-w-[1600px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs uppercase tracking-widest mb-2 font-bold" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>
              <span>Incident Command</span>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span style={{ color: C.primary }}>NIMS/ICS Lifecycle</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight uppercase" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>Real-time Operations</h1>
            <p className="mt-1 max-w-md" style={{ color: C.muted }}>Monitoring global multi-agency response efforts and active threat vectors.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center p-1 rounded-md" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
              <button className="px-4 py-1.5 text-xs font-bold rounded uppercase tracking-wider" style={{ backgroundColor: C.primary, color: C.bg, fontFamily:'Rajdhani, sans-serif' }}>Grid View</button>
              <button className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Map View</button>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-bold shadow-lg transition-all"
              style={{ backgroundColor: C.primary, color: C.bg, boxShadow:`0 4px 20px ${C.primary}33`, fontFamily:'Rajdhani, sans-serif' }}>
              <span className="material-symbols-outlined text-xl">add_alert</span> Create New Incident
            </button>
          </div>
        </div>

        {/* Selection bar */}
        <div className="flex items-center justify-between gap-4 mb-6 px-4 py-3 rounded-lg" style={{ backgroundColor:`${C.primary}1A`, border:`1px solid ${C.primary}4D` }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
              <span className="text-sm font-bold uppercase tracking-wider" style={{ fontFamily:'Rajdhani, sans-serif' }}>2 Incidents Selected</span>
            </div>
            <div className="w-px h-4" style={{ backgroundColor: C.border }} />
            <div className="flex gap-2">
              {[
                { icon:'ios_share', label:'Export SITREP', red:false },
                { icon:'group', label:'Reassign Command', red:false },
                { icon:'close', label:'Archive Selected', red:true },
              ].map(btn => (
                <button key={btn.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-all"
                  style={btn.red ? { backgroundColor:`${C.danger}33`, border:`1px solid ${C.danger}4D`, color: C.danger } : { backgroundColor: C.surface, border:`1px solid ${C.border}`, color: C.text, fontFamily:'Rajdhani, sans-serif' }}>
                  <span className="material-symbols-outlined text-base">{btn.icon}</span>{btn.label}
                </button>
              ))}
            </div>
          </div>
          <button className="text-xs font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Clear Selection</button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          {[['location_on','All Regions'],['category','All Types']].map(([icon,label]) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-md" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
              <span className="material-symbols-outlined text-lg" style={{ color: C.muted }}>{icon}</span>
              <select className="bg-transparent text-sm font-bold outline-none uppercase tracking-wider cursor-pointer pr-8" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>
                <option>{label}</option>
              </select>
            </div>
          ))}
          <button className="ml-auto text-sm font-bold flex items-center gap-1 transition-colors" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>
            <span className="material-symbols-outlined text-base">refresh</span> Refresh Data
          </button>
        </div>

        {/* Table */}
        <div className="rounded-lg overflow-hidden shadow-2xl mb-8" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ backgroundColor: C.bg, borderBottom:`1px solid ${C.border}` }}>
                  <th className="px-6 py-4 w-10"><input type="checkbox" className="w-4 h-4 rounded" /></th>
                  {['ID','Type','Region','Severity','Status','Assigned Commander','Time Elapsed',''].map((h,i) => (
                    <th key={h+i} className={`px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] ${i===5?'text-right':''}`} style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: C.border }}>
                {INCIDENTS.map(inc => (
                  <React.Fragment key={inc.id}>
                    <tr style={expanded===inc.id ? { backgroundColor:`${C.primary}0D`, borderLeft:`4px solid ${C.primary}` } : { borderLeft:'4px solid transparent' }}
                      className="transition-colors cursor-pointer" onClick={() => setExpanded(expanded===inc.id ? null : inc.id)}>
                      <td className="px-6 py-5"><input type="checkbox" defaultChecked={inc.expanded} className="w-4 h-4 rounded" onClick={e => e.stopPropagation()} /></td>
                      <td className="px-6 py-5 text-sm font-bold tracking-widest" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>{inc.id}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined" style={{ color: inc.iconColor }}>{inc.icon}</span>
                          <span className="text-sm font-semibold" style={{ color: C.text }}>{inc.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm" style={{ color: C.muted }}>{inc.region}</td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest"
                          style={{ backgroundColor:`${inc.severityColor}1A`, color: inc.severityColor, border:`1px solid ${inc.severityColor}4D`, fontFamily:'Rajdhani, sans-serif' }}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: inc.statusColor, animation: inc.status==='Active' ? 'pulse 2s infinite' : 'none' }} />
                          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: inc.statusColor, fontFamily:'Rajdhani, sans-serif' }}>{inc.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: C.border, color: C.text }}>{inc.initials}</div>
                          <span className="text-sm font-medium" style={{ color: C.text }}>{inc.commander}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-mono text-sm" style={{ color: C.muted }}>{inc.time}</td>
                      <td className="px-6 py-5 text-right">
                        <button className="material-symbols-outlined transition-colors" style={{ color: C.muted }}>
                          {expanded===inc.id ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        </button>
                      </td>
                    </tr>
                    {expanded===inc.id && (
                      <tr style={{ backgroundColor:`${C.bg}66` }}>
                        <td colSpan={9} className="px-6 py-8">
                          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Mini map */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                              <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Geospatial Awareness</h3>
                                <div className="text-right">
                                  <p className="text-[10px] uppercase font-bold" style={{ color: C.muted }}>Est. Population at Risk</p>
                                  <p className="text-lg font-bold" style={{ fontFamily:'Rajdhani, sans-serif', color: C.text }}>14,200</p>
                                </div>
                              </div>
                              <div className="h-56 rounded-lg relative overflow-hidden" style={{ border:`1px solid ${C.border}` }}>
                                <div className="absolute inset-0" style={{ background:'linear-gradient(135deg, #0a1628, #0d2040)', backgroundImage:'radial-gradient(ellipse at 40% 40%, #1a3a5c 0%, transparent 60%)' }} />
                                <div className="absolute inset-0" style={{ backgroundColor:`${C.primary}1A` }} />
                                <div className="absolute top-4 right-4 px-2 py-1 rounded text-[10px] font-bold" style={{ backgroundColor:`${C.bg}E6`, color: C.primary, border:`1px solid ${C.primary}33`, fontFamily:'Rajdhani, sans-serif' }}>
                                  LIVE DATA: 10Hz
                                </div>
                                <div className="absolute bottom-4 left-4">
                                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>Sector A-4 Perimeter</p>
                                  <p className="text-sm font-bold" style={{ color: C.text }}>12km SW of Summit Ridge</p>
                                </div>
                              </div>
                            </div>
                            {/* Tactical Objectives */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Tactical Objectives (ICS-202)</h3>
                              <div className="space-y-3">
                                {[
                                  { icon:'check', color: C.success, title:'Primary Evacuation', desc:'Clear residents in Zone 12-B. Target: 1800hrs.', pct:100 },
                                  { icon:'pending', color: C.secondary, title:'Contingency Line 4', desc:'Establish anchor point at Deer Creek.', pct:65 },
                                ].map(obj => (
                                  <div key={obj.title} className="flex gap-4 p-4 rounded" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor:`${obj.color}33`, color: obj.color }}>
                                      <span className="material-symbols-outlined text-sm font-bold">{obj.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-bold uppercase tracking-wider" style={{ color: C.text, fontFamily:'Rajdhani, sans-serif' }}>{obj.title}</p>
                                      <p className="text-xs mt-1" style={{ color: C.muted }}>{obj.desc}</p>
                                      <div className="w-full h-1 mt-3 rounded-full overflow-hidden" style={{ backgroundColor: C.border }}>
                                        <div className="h-full" style={{ width:`${obj.pct}%`, backgroundColor: obj.color }} />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Resources */}
                            <div className="lg:col-span-4 flex flex-col gap-6">
                              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>Resource Allocation</h3>
                              <div className="rounded divide-y" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}`, borderColor: C.border }}>
                                {[
                                  { icon:'fire_truck', name:'Engine Co. 42', location:'Alpha Base Staging', status:'ON-SCENE', statusColor: C.success },
                                  { icon:'helicopter', name:'Helitack Team 2', location:'Air Ops Zone C', status:'DEPLOYED', statusColor: C.success },
                                ].map(r => (
                                  <div key={r.name} className="p-4 flex items-center justify-between" style={{ borderColor: C.border }}>
                                    <div className="flex items-center gap-3">
                                      <span className="material-symbols-outlined" style={{ color: C.primary }}>{r.icon}</span>
                                      <div>
                                        <p className="text-sm font-bold uppercase" style={{ fontFamily:'Rajdhani, sans-serif', color: C.text }}>{r.name}</p>
                                        <p className="text-[10px]" style={{ color: C.muted }}>{r.location}</p>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: r.statusColor, fontFamily:'Rajdhani, sans-serif' }}>{r.status}</span>
                                  </div>
                                ))}
                                <button className="w-full py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all" style={{ color: C.primary, fontFamily:'Rajdhani, sans-serif' }}>
                                  Manage 14 Additional Units
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor:`${C.bg}80`, borderTop:`1px solid ${C.border}` }}>
            <p className="text-xs uppercase tracking-widest" style={{ color: C.muted, fontFamily:'Rajdhani, sans-serif' }}>
              Showing <span className="font-bold" style={{ color: C.text }}>1-3</span> of 24 operational incidents
            </p>
            <div className="flex gap-2">
              {['chevron_left','chevron_right'].map(ic => (
                <button key={ic} className="p-2 rounded transition-colors" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}`, color: C.muted }}>
                  <span className="material-symbols-outlined text-lg">{ic}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="p-6 rounded-lg relative overflow-hidden" style={{ backgroundColor: C.surface, border:`1px solid ${C.border}` }}>
              <p className="text-xs font-bold uppercase text-muted tracking-widest" style={{ fontFamily:'Rajdhani, sans-serif' }}>{s.label}</p>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-3xl font-bold tracking-tight" style={{ fontFamily:'Rajdhani, sans-serif', color: C.text }}>{s.value}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: s.subColor, fontFamily:'Rajdhani, sans-serif' }}>{s.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
