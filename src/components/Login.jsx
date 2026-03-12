import React, { useState } from 'react';
import { Shield, Lock, User, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data);
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection refused. Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (role) => {
    if (role === 'Commander') {
      setUsername('commander');
      setPassword('password123');
    } else {
      setUsername('responder');
      setPassword('securePass!');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-sentinel-900 font-sans p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-sentinel-danger/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-10 group">
          <div className="inline-block p-4 bg-sentinel-danger/10 border border-sentinel-danger/20 rounded-3xl mb-6 shadow-2xl shadow-red-500/10 group-hover:scale-110 transition-transform duration-500">
            <Shield className="text-sentinel-danger" size={48} />
          </div>
          <h1 className="text-5xl font-black italic tracking-tighter text-white mb-2">S E N T I N E L</h1>
          <p className="text-xs uppercase tracking-[0.4em] font-bold text-sentinel-danger">Central Coordination Hub</p>
        </div>

        <div className="bg-sentinel-800/50 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Authorized Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text"
                  required
                  placeholder="e.g. j.riggs"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-sentinel-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 transition-all placeholder:text-gray-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-4">Access Credentials</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-sentinel-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sentinel-danger/50 transition-all placeholder:text-gray-600 font-medium"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in shake duration-300">
                <AlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-xs font-bold text-red-500 italic">{error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-sentinel-danger hover:bg-red-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-red-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  INITIALIZE UPLINK
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 ">
            <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 italic">Fast Demo Access</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleDemoLogin('Commander')}
                className="py-3 px-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-gray-300 transition-all uppercase tracking-tighter"
              >
                Commander Staging
              </button>
              <button 
                onClick={() => handleDemoLogin('Responder')}
                className="py-3 px-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-[10px] font-black text-gray-300 transition-all uppercase tracking-tighter"
              >
                Responder Node
              </button>
            </div>
          </div>
        </div>
        
        <p className="text-center mt-8 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] leading-relaxed">
          Government Use Only • Restricted Access • v2.0-STABLE
        </p>
      </div>
    </div>
  );
};

export default Login;
