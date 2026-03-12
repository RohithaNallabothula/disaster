import React from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Map as MapIcon, 
  Radio, 
  Activity, 
  Wind, 
  Users, 
  Package, 
  Settings,
  ChevronRight
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      active 
        ? 'bg-sentinel-700 text-white shadow-lg shadow-black/20' 
        : 'text-gray-400 hover:text-white hover:bg-sentinel-800'
    }`}
  >
    <Icon size={20} />
    <span className="flex-1 text-left font-medium">{label}</span>
    {active && <ChevronRight size={16} />}
  </button>
);

const Sidebar = ({ incidents, onAlertClick, currentView, onNavigate, user, onLogout }) => {
  return (
    <div className="w-80 bg-sentinel-900 border-r border-white/5 flex flex-col h-full">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sentinel-danger rounded-lg">
            <Shield className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white italic">SENTINEL</h1>
            <p className="text-[10px] text-sentinel-danger font-bold uppercase tracking-[0.2em]">Response Platform</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <div className="bg-sentinel-800/50 p-4 rounded-2xl mb-6 border border-white/5">
           <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-sentinel-danger/20 flex items-center justify-center text-sentinel-danger font-black text-xs">
                {user?.name?.[0] || 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-white tracking-tight">{user?.name}</p>
                <p className="text-[10px] text-gray-500 font-bold uppercase">{user?.role}</p>
              </div>
           </div>
           <button 
            onClick={onLogout}
            className="w-full mt-3 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-bold text-gray-500 hover:text-white transition-all uppercase tracking-widest"
           >
            Decommission Link
           </button>
        </div>

        <div className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2 px-4">Navigation</div>
        <SidebarItem 
          icon={MapIcon} 
          label="GIS Dashboard" 
          active={currentView === 'dashboard'} 
          onClick={() => onNavigate('dashboard')}
        />
        <SidebarItem 
          icon={Radio} 
          label="IoT Sensors" 
          active={currentView === 'sensors'}
          onClick={() => onNavigate('sensors')}
        />
        <SidebarItem 
          icon={Activity} 
          label="Conflict Monitor" 
          active={currentView === 'conflict'}
          onClick={() => onNavigate('conflict')}
        />
        <SidebarItem 
          icon={Wind} 
          label="CBRN Plume" 
          active={currentView === 'plume'}
          onClick={() => onNavigate('plume')}
        />
        <SidebarItem 
          icon={Users} 
          label="Crowd Alerts" 
          active={currentView === 'alerts'}
          onClick={() => onNavigate('alerts')} 
        />
        <SidebarItem 
          icon={Package} 
          label="Resource Registry" 
          active={currentView === 'resources'}
          onClick={() => onNavigate('resources')}
        />
        
        <div className="pt-6 pb-2 px-4">
          <div className="text-[10px] uppercase font-bold text-sentinel-danger tracking-widest flex items-center gap-2">
            <AlertTriangle size={12} />
            Live Incidents
          </div>
        </div>
        
        {incidents.map(incident => {
          const typeColors = {
            Seismic: 'bg-orange-500/20 text-orange-400',
            Cyclone: 'bg-blue-500/20 text-blue-400',
            Tsunami: 'bg-cyan-500/20 text-cyan-400',
            Flood: 'bg-sky-500/20 text-sky-400',
            Wildfire: 'bg-amber-500/20 text-amber-400',
            Volcanic: 'bg-red-600/20 text-red-400',
            Nuclear: 'bg-green-500/20 text-green-400',
            CBRN: 'bg-yellow-500/20 text-yellow-400',
            Industrial: 'bg-purple-500/20 text-purple-400',
            Terrorism: 'bg-red-500/20 text-red-500',
          };
          const colorClass = typeColors[incident.type] || 'bg-red-500/20 text-red-400';
          return (
            <div key={incident.id} className="mx-4 p-3 bg-sentinel-800/50 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${colorClass}`}>{incident.type}</span>
                <span className="text-[10px] text-gray-500">{new Date(incident.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              <h3 className="text-xs font-bold text-white truncate">{incident.title}</h3>
              <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{incident.description}</p>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/5 bg-sentinel-900/50">
        <SidebarItem icon={Settings} label="System Config" />
      </div>
    </div>
  );
};

export default Sidebar;
