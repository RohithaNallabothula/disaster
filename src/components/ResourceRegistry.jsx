import React from 'react';
import { Truck, Users, Droplets, Heart, Zap, Search, ArrowUpRight } from 'lucide-react';

const ResourceCard = ({ type, name, status, count, location }) => {
  const statusColor = {
    'Available': 'text-green-500 bg-green-500/10',
    'Dispatched': 'text-blue-500 bg-blue-500/10',
    'Standby': 'text-yellow-500 bg-yellow-500/10',
    'Maintenance': 'text-red-500 bg-red-500/10'
  }[status] || 'text-gray-500 bg-gray-500/10';

  const Icon = {
    'Medical': Heart,
    'Logistics': Truck,
    'Personnel': Users,
    'Water': Droplets,
    'Power': Zap
  }[type] || Truck;

  return (
    <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-xl ${statusColor}`}>
          <Icon size={24} />
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${statusColor}`}>
          {status}
        </span>
      </div>
      <div>
        <h3 className="text-white font-bold mb-1">{name}</h3>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <span className="font-bold text-gray-300">{count}</span> units • {location}
        </p>
      </div>
      <button className="w-full mt-4 py-2 text-xs font-bold text-gray-400 group-hover:text-white bg-white/5 group-hover:bg-sentinel-700 rounded-xl transition-all flex items-center justify-center gap-2">
        Dispatch Details
        <ArrowUpRight size={14} />
      </button>
    </div>
  );
};

const ResourceRegistry = () => {
  const resources = [
    { type: 'Medical', name: 'Mobile Clinic Alpha', status: 'Available', count: 4, location: 'Sector 4' },
    { type: 'Personnel', name: 'HAZMAT Team 2', status: 'Dispatched', count: 12, location: 'Downtown' },
    { type: 'Logistics', name: 'Supply Convoy 7', status: 'Standby', count: 8, location: 'Central Hub' },
    { type: 'Water', name: 'Purification Unit B', status: 'Available', count: 2, location: 'Sector 9' },
    { type: 'Medical', name: 'Ambulance Fleet C', status: 'Standby', count: 18, location: 'Regional Medical Center' },
    { type: 'Power', name: 'Mobile Grid Gen', status: 'Maintenance', count: 1, location: 'Base' }
  ];

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-sentinel-danger uppercase tracking-[0.2em] mb-2 block">Logistics & Support</span>
            <h1 className="text-4xl font-black text-white italic tracking-tight">Resource Registry</h1>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter resources..." 
              className="bg-sentinel-800 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 w-64 transition-all"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((res, i) => (
            <ResourceCard key={i} {...res} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourceRegistry;
