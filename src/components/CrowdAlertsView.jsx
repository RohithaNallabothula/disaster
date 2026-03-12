import React from 'react';
import { Users, AlertOctagon, Clock, MapPin, Plus, MessageSquare } from 'lucide-react';

const AlertCard = ({ alert }) => (
  <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-5 hover:border-sentinel-danger/30 transition-all group relative overflow-hidden">
    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
      <AlertOctagon size={48} className="text-sentinel-danger" />
    </div>
    
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
          alert.severity === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-orange-500/20 text-orange-500'
        }`}>
          {alert.type}
        </span>
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{alert.severity} SEVERITY</span>
      </div>
    </div>

    <h3 className="text-white font-bold text-lg mb-2 leading-tight group-hover:text-sentinel-danger transition-colors">{alert.title}</h3>
    <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">{alert.description}</p>

    <div className="flex items-center justify-between pt-4 border-t border-white/5">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
          <Clock size={12} />
          {new Date(alert.timestamp).toLocaleTimeString()}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase">
          <MapPin size={12} />
          LAT: {alert.location[0].toFixed(2)}
        </div>
      </div>
      <button className="flex items-center gap-1.5 text-[10px] font-black text-sentinel-danger uppercase tracking-widest hover:underline">
        <MessageSquare size={12} />
        Join Comms
      </button>
    </div>
  </div>
);

const CrowdAlertsView = ({ incidents = [], onAddAlert }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto p-8 pt-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-sentinel-danger uppercase tracking-[0.2em] mb-2 block">Community Intelligence</span>
            <h1 className="text-4xl font-black text-white italic tracking-tight">Crowd-Sourced Alerts</h1>
          </div>
          
          <button 
            onClick={onAddAlert}
            className="flex items-center gap-2 px-8 py-4 bg-sentinel-danger text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:scale-105 hover:bg-red-500 transition-all shadow-2xl shadow-red-500/20"
          >
            <Plus size={18} />
            Report Incident
          </button>
        </header>

        {incidents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-[3rem]">
             <Users size={64} className="text-gray-800 mb-4" />
             <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No active reports in your sector</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {incidents.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CrowdAlertsView;
