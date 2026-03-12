import React, { useState } from 'react';
import { Send, MapPin, Camera, AlertOctagon, X } from 'lucide-react';

const AlertForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    type: 'General',
    title: '',
    description: '',
    location: '',
    severity: 'Medium'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      location: [34.0522 + (Math.random() - 0.5) * 0.1, -118.2437 + (Math.random() - 0.5) * 0.1] // Randomize near center
    });
    onClose();
  };

  return (
    <div className="bg-sentinel-800 rounded-2xl border border-white/10 p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2 text-sentinel-danger">
          <AlertOctagon size={24} />
          <h2 className="text-xl font-bold text-white">Submit Public Alert</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Disaster Type</label>
          <select 
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="w-full bg-sentinel-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 transition-all"
          >
            <optgroup label="🌍 Natural Disasters">
              <option>Seismic</option>
              <option>Flood</option>
              <option>Wildfire</option>
              <option>Cyclone</option>
              <option>Tsunami</option>
              <option>Volcanic</option>
              <option>Landslide</option>
              <option>Drought</option>
            </optgroup>
            <optgroup label="⚠️ Man-Made / Technological">
              <option>CBRN</option>
              <option>Nuclear</option>
              <option>Industrial</option>
              <option>Terrorism</option>
              <option>Conflict</option>
              <option>Infrastructure</option>
              <option>Oil Spill</option>
            </optgroup>
            <option>General</option>
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Alert Title</label>
          <input 
            type="text"
            required
            placeholder="e.g., Gas leak detected on Main St"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full bg-sentinel-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 transition-all placeholder:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Description</label>
          <textarea 
            required
            rows={3}
            placeholder="Provide details about the situation..."
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full bg-sentinel-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 transition-all placeholder:text-gray-600 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button type="button" className="flex items-center justify-center gap-2 bg-sentinel-700/50 hover:bg-sentinel-700 text-gray-300 py-2.5 rounded-xl border border-white/5 transition-all text-xs font-bold">
            <MapPin size={16} />
            Auto GPS
          </button>
          <button type="button" className="flex items-center justify-center gap-2 bg-sentinel-700/50 hover:bg-sentinel-700 text-gray-300 py-2.5 rounded-xl border border-white/5 transition-all text-xs font-bold">
            <Camera size={16} />
            Add Image
          </button>
        </div>

        <button 
          type="submit" 
          className="w-full bg-sentinel-danger hover:bg-red-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Send size={18} />
          Broadcast Alert
        </button>
      </form>
    </div>
  );
};

export default AlertForm;
