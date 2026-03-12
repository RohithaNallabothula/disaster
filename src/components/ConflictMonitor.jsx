import React from 'react';
import { Shield, MessageSquare, TrendingUp, AlertTriangle, Eye } from 'lucide-react';

const ConflictEvent = ({ type, title, location, intensity, time }) => (
  <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4 hover:border-sentinel-danger/20 transition-all group">
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${intensity > 7 ? 'bg-red-500 animate-pulse' : 'bg-yellow-500'}`} />
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{type}</span>
      </div>
      <span className="text-[10px] text-gray-600 font-mono">{time}</span>
    </div>
    <h3 className="text-white font-bold text-sm mb-1 leading-snug group-hover:text-sentinel-danger transition-colors">{title}</h3>
    <p className="text-xs text-gray-400 mb-4">{location}</p>
    <div className="flex items-center justify-between">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 rounded-full bg-sentinel-700 border border-sentinel-900 flex items-center justify-center text-[10px] text-gray-400 font-bold">OS</div>
        <div className="w-6 h-6 rounded-full bg-sentinel-700 border border-sentinel-900 flex items-center justify-center text-[10px] text-gray-400 font-bold">SI</div>
      </div>
      <div className="flex items-center gap-1 text-[10px] font-bold text-sentinel-danger">
        <TrendingUp size={12} />
        INTENSITY {intensity}/10
      </div>
    </div>
  </div>
);

const ConflictMonitor = ({ incidents = [] }) => {
  const mockEvents = [
    { type: 'OSINT Report', title: 'Suspicious movement near Critical Substation G', location: 'Western Industrial Zone', intensity: 8.4, time: '14:22:10' },
    { type: 'Signal Intel', title: 'Unidentified drone flight pattern over Port', location: 'Naval Extension A', intensity: 6.2, time: '14:15:45' },
    { type: 'Crowd Intel', title: 'Civilians report armed presence near Shelter 42', location: 'Old City North', intensity: 9.1, time: '14:08:22' },
    { type: 'Infrastructure', title: 'Repeated signal jamming on Emergency Band 4', location: 'Sector 01 Base', intensity: 5.5, time: '13:55:12' }
  ];

  // Merge real incidents into the feed
  const allEvents = [
    ...incidents.map(inc => ({
      type: 'LIVE ALERT',
      title: inc.title,
      location: `Lat: ${inc.location[0].toFixed(2)}, Lng: ${inc.location[1].toFixed(2)}`,
      intensity: inc.severity === 'Critical' ? 9.5 : 7.0,
      time: new Date(inc.timestamp).toLocaleTimeString()
    })),
    ...mockEvents
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 pt-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-sentinel-danger uppercase tracking-[0.2em] mb-2 block">OSINT/SIGINT Intelligence</span>
            <h1 className="text-4xl font-black text-white italic tracking-tight">Conflict Threat Monitor</h1>
          </div>
          <div className="flex gap-4">
             <div className="bg-sentinel-danger/10 border border-sentinel-danger/20 rounded-2xl px-6 py-3 text-center">
                <p className="text-[10px] text-sentinel-danger font-black uppercase mb-1">Global Intensity</p>
                <p className="text-2xl font-black text-white italic">7.4</p>
             </div>
             <div className="bg-sentinel-800 border border-white/5 rounded-2xl px-6 py-3 text-center">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Active Sources</p>
                <p className="text-2xl font-black text-white italic">{allEvents.length}</p>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-4">
             <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-4 flex items-center gap-2">
                <MessageSquare size={12} />
                Intelligence Feed
             </div>
             {allEvents.map((ev, i) => (
                <ConflictEvent key={i} {...ev} />
             ))}
          </div>

          <div className="space-y-6">
             <div className="bg-sentinel-800 border border-white/5 rounded-3xl p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                   <Shield size={16} className="text-sentinel-danger" />
                   Security Protocols
                </h4>
                <div className="space-y-4">
                   <div className="p-3 bg-sentinel-900 border border-white/5 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Active DEFCON</p>
                      <p className="text-sm font-bold text-sentinel-warning italic uppercase">Level 3: Increased State</p>
                   </div>
                   <div className="p-3 bg-sentinel-900 border border-white/5 rounded-xl">
                      <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Exclusion Zones</p>
                      <p className="text-sm font-bold text-white italic">04 Areas Restricted</p>
                   </div>
                </div>
             </div>

             <div className="bg-sentinel-danger rounded-3xl p-6 shadow-2xl shadow-red-500/10">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                   <Eye size={16} />
                   Critical Watchlist
                </h4>
                <div className="space-y-2">
                   <p className="text-white/80 text-[10px] font-medium leading-relaxed italic">
                     "System monitoring unusual patterns in satellite thermal imagery over sector 04. Escalation predicted within 40 minutes."
                   </p>
                   <button className="w-full mt-4 bg-white text-sentinel-danger font-black py-2 rounded-xl text-[10px] uppercase tracking-widest">
                      Detail View
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConflictMonitor;
