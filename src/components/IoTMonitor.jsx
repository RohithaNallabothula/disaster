import React, { useState } from 'react';
import { Radio, Brain, AlertTriangle, CheckCircle, RefreshCw, Zap } from 'lucide-react';

const SensorCard = ({ sensor }) => (
  <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4 hover:border-sentinel-info/20 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-sentinel-info/10 rounded-lg text-sentinel-info">
        <Radio size={18} />
      </div>
      <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
        sensor.status === 'Critical' ? 'bg-sentinel-danger/20 text-sentinel-danger animate-pulse' :
        sensor.status === 'Warning'  ? 'bg-sentinel-warning/20 text-sentinel-warning' :
                                        'bg-sentinel-success/20 text-sentinel-success'
      }`}>
        {sensor.status}
      </div>
    </div>
    
    <div className="space-y-1 mb-4">
      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">{sensor.type} Node</p>
      <h3 className="text-white font-bold text-lg leading-none">{sensor.id}</h3>
    </div>

    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
      <div>
        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Live Feed</p>
        <p className="text-sm font-mono font-bold text-white">
          {typeof sensor.value === 'number' ? sensor.value.toFixed(4) : sensor.value}
          <span className="text-[10px] text-gray-500 ml-1">{sensor.unit}</span>
        </p>
      </div>
      <div className="text-right">
        <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Node ID</p>
        <p className="text-sm font-mono font-bold text-gray-400">{sensor.id}</p>
      </div>
    </div>
  </div>
);

const IoTMonitor = ({ sensors = [] }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const runAIAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setAnalysis(null);
    try {
      const token = localStorage.getItem('sentinel_token');
      const res = await fetch('http://localhost:5000/api/sensors/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sensorReadings: sensors })
      });
      if (!res.ok) throw new Error('Analysis request failed');
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError('Groq AI analysis failed. Check server connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto p-8 pt-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-sentinel-info uppercase tracking-[0.2em] mb-2 block">IoT Edge Computing</span>
            <h1 className="text-4xl font-black text-white italic tracking-tight">Active Sensor Network</h1>
          </div>
          <div className="flex gap-4 items-center">
             <div className="bg-sentinel-800 border border-white/5 rounded-2xl px-6 py-3 text-center">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-1">Total Nodes</p>
                <p className="text-2xl font-black text-white italic">{sensors.length}</p>
             </div>
             <div className="bg-sentinel-success/10 border border-sentinel-success/20 rounded-2xl px-6 py-3 text-center">
                <p className="text-[10px] text-sentinel-success font-black uppercase mb-1">Health Index</p>
                <p className="text-2xl font-black text-white italic">98%</p>
             </div>
             {/* Groq AI Analysis Button */}
             <button
               onClick={runAIAnalysis}
               disabled={isAnalyzing || sensors.length === 0}
               className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl text-[10px] uppercase tracking-[0.15em] hover:scale-105 transition-all shadow-2xl shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
             >
               {isAnalyzing ? (
                 <><RefreshCw size={16} className="animate-spin" /> Analyzing...</>
               ) : (
                 <><Brain size={16} /> Run AI Analysis</>
               )}
             </button>
          </div>
        </header>

        {/* Groq AI Analysis Panel */}
        {(analysis || error || isAnalyzing) && (
          <div className={`mb-10 rounded-[2rem] p-6 border ${
            error ? 'bg-sentinel-danger/10 border-sentinel-danger/20' :
                    'bg-gradient-to-br from-purple-900/40 to-indigo-900/30 border-purple-500/20'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                <Brain size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Groq LLaMA-3 · SENTINEL-AI</p>
                <h3 className="text-white font-bold text-sm">Threat Analysis Report</h3>
              </div>
              {analysis?.timestamp && (
                <span className="ml-auto text-[10px] font-mono text-gray-500">{new Date(analysis.timestamp).toLocaleTimeString()}</span>
              )}
            </div>

            {isAnalyzing && (
              <div className="flex items-center gap-3 text-purple-400">
                <RefreshCw size={16} className="animate-spin" />
                <p className="text-xs font-bold">Sending data to Groq LLaMA-3 for analysis...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sentinel-danger text-xs font-bold">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}

            {analysis?.analysis && (
              <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-mono bg-black/20 rounded-xl p-4 border border-white/5">
                {analysis.analysis}
              </div>
            )}
          </div>
        )}

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sensors.map(s => (
            <SensorCard key={s.id} sensor={s} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default IoTMonitor;
