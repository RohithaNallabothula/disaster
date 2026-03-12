import React from 'react';
import { Wind, Sliders, Play, RotateCcw, ShieldAlert, ThermometerSnowflake } from 'lucide-react';

const PlumeModeler = () => {
  return (
    <div className="flex-1 h-full overflow-y-auto p-8 pt-32 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold text-sentinel-warning uppercase tracking-[0.2em] mb-2 block">Predictive Modeler</span>
            <h1 className="text-4xl font-black text-white italic tracking-tight">CBRN Dispersion Analysis</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3 bg-sentinel-warning text-sentinel-900 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
              <Play size={16} fill="currentColor" />
              Run Simulation
            </button>
            <button className="p-3 bg-sentinel-800 border border-white/5 rounded-2xl text-gray-400 hover:text-white transition-all">
              <RotateCcw size={20} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-sentinel-800 border border-white/5 rounded-[2.5rem] p-8 aspect-video relative overflow-hidden group">
               <div className="absolute inset-0 bg-sentinel-900/50 flex items-center justify-center">
                  <div className="text-center group-hover:scale-110 transition-transform duration-700">
                    <Wind size={64} className="text-sentinel-warning/20 mb-4 mx-auto animate-pulse" />
                    <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Canvas: Spatial Grid 01</p>
                  </div>
               </div>
               {/* Decorative Grid */}
               <div className="absolute inset-0 opacity-10 pointer-events-none" 
                    style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-2">Stability Class</p>
                <p className="text-xl font-black text-white italic uppercase">Pasquill F</p>
              </div>
              <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] text-gray-500 font-black uppercase mb-2">Inversion Height</p>
                <p className="text-xl font-black text-white italic">420m</p>
              </div>
              <div className="bg-sentinel-800 border border-white/5 rounded-2xl p-4 text-sentinel-warning">
                <p className="text-[10px] text-sentinel-warning/50 font-black uppercase mb-2">Scrub Velocity</p>
                <p className="text-xl font-black italic">0.45 m/s</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="bg-sentinel-800/50 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-6">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-8 flex items-center gap-2">
                   <Sliders size={16} className="text-sentinel-warning" />
                   Vector Inputs
                </h4>
                <div className="space-y-6">
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                         <span>Wind Direction</span>
                         <span className="text-white font-mono">225° SW</span>
                      </div>
                      <div className="h-1.5 w-full bg-sentinel-900 rounded-full">
                         <div className="h-full w-[62%] bg-sentinel-warning rounded-full shadow-[0_0_10px_#f59e0b]" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                         <span>Velocity</span>
                         <span className="text-white font-mono">14.2 m/s</span>
                      </div>
                      <div className="h-1.5 w-full bg-sentinel-900 rounded-full">
                         <div className="h-full w-[45%] bg-sentinel-warning rounded-full shadow-[0_0_10px_#f59e0b]" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black uppercase text-gray-500">
                         <span>Release Yield</span>
                         <span className="text-white font-mono">2.5 kg/s</span>
                      </div>
                      <div className="h-1.5 w-full bg-sentinel-900 rounded-full">
                         <div className="h-full w-[20%] bg-sentinel-warning rounded-full shadow-[0_0_10px_#f59e0b]" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="bg-sentinel-warning rounded-[2rem] p-6 shadow-2xl shadow-yellow-500/10">
                <h4 className="text-xs font-bold text-sentinel-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <ShieldAlert size={16} />
                   Safety Factor
                </h4>
                <p className="text-sentinel-900/80 text-[10px] font-bold leading-relaxed italic">
                  Critical exposure zone predicted to reach Sector 04 within 12 minutes. Evacuation orders recommended.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlumeModeler;
