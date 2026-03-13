import React, { useState, useEffect } from 'react';
import AIDashboard from './components/AIDashboard';
import MapLayer from './components/MapContainer';
import BlastCalculator from './components/BlastCalculator';
import CBRNModule from './components/CBRNModule';
import ConflictIntel from './components/ConflictIntel';
import DataSourceMonitor from './components/DataSourceMonitor';
import IncidentManagement from './components/IncidentManagement';
import ResourceRegistry from './components/ResourceRegistry';
import LiveMonitor from './components/LiveMonitor';
import Login from './components/Login';
import { mockDataService, DISASTER_TYPES, SEVERITY_LEVELS } from './services/mockDataService';

const C = {
  bg:      '#0A0F1E',
  surface: '#111827',
  border:  '#1E293B',
  primary: '#06B6D4',
  muted:   '#64748B',
  text:    '#F1F5F9',
  danger:  '#EF4444',
  success: '#10B981',
};

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'DASHBOARD'     },
  { id: 'live',        label: 'LIVE MONITOR'  },
  { id: 'incidents',   label: 'INCIDENTS'     },
  { id: 'map',         label: 'TACTICAL MAP'  },
  { id: 'resources',   label: 'RESOURCES'     },
  { id: 'blast',       label: 'BLAST CALC'    },
  { id: 'cbrn',        label: 'CBRN'          },
  { id: 'intel',       label: 'CONFLICT INTEL'},
  { id: 'datasources', label: 'DATA SOURCES'  },
];

function App() {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [sensors, setSensors]   = useState([]);
  const [satelliteRegions, setSatelliteRegions] = useState([]);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    const savedToken = localStorage.getItem('sentinel_token');
    const savedUser  = localStorage.getItem('sentinel_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (data) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('sentinel_token', data.token);
    localStorage.setItem('sentinel_user', JSON.stringify(data.user));
  };

  useEffect(() => {
    if (!token) return;
    setIncidents(mockDataService.getIncidents());
    setSatelliteRegions(mockDataService.getSatelliteRegions());
    const poll = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sensors', {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(2000),
        });
        if (res.ok) setSensors(await res.json());
      } catch {}
      if (Math.random() > 0.85) {
        setIncidents(prev => [{
          id: Date.now(), type: DISASTER_TYPES.INFRASTRUCTURE,
          title: 'Infrastructure Anomaly Detected',
          location: [34.0522 + (Math.random()-0.5)*0.1, -118.2437 + (Math.random()-0.5)*0.1],
          severity: SEVERITY_LEVELS.MEDIUM, timestamp: new Date().toISOString(),
          description: 'Automated monitoring detected structural vibration on Bridge 04.',
        }, ...prev.slice(0, 9)]);
      }
    }, 5000);
    return () => clearInterval(poll);
  }, [token]);

  if (!user) return <Login onLogin={handleLogin} />;

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':   return <AIDashboard />;
      case 'live':        return <LiveMonitor />;
      case 'incidents':   return <IncidentManagement />;
      case 'map':         return <MapLayer incidents={incidents} sensors={sensors} satelliteRegions={satelliteRegions} onDeployAssets={() => {}} />;
      case 'resources':   return <ResourceRegistry />;
      case 'blast':       return <BlastCalculator />;
      case 'cbrn':        return <CBRNModule />;
      case 'intel':       return <ConflictIntel />;
      case 'datasources': return <DataSourceMonitor />;
      default:            return <AIDashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden"
      style={{ backgroundColor: C.bg, color: C.text, fontFamily: 'Source Sans 3, sans-serif' }}>

      {/* ── TOP NAVIGATION BAR ── */}
      <header className="flex items-center justify-between px-6 py-3 flex-shrink-0 z-50"
        style={{ backgroundColor: C.surface, borderBottom: `1px solid ${C.border}` }}>

        {/* Left: logo + nav */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 shrink-0" style={{ color: C.primary }}>
            <span className="material-symbols-outlined text-3xl">shield_with_heart</span>
            <h2 className="text-xl font-bold tracking-wider uppercase"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: C.text }}>
              SENTINEL
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            {NAV_ITEMS.map(item => {
              const isActive = currentView === item.id;
              return (
                <button key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className="text-xs font-semibold pb-1 transition-colors whitespace-nowrap"
                  style={isActive
                    ? { color: C.primary, borderBottom: `2px solid ${C.primary}`, fontFamily: 'Rajdhani, sans-serif' }
                    : { color: C.muted, borderBottom: '2px solid transparent', fontFamily: 'Rajdhani, sans-serif' }}>
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: search + controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative hidden lg:flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-lg" style={{ color: C.muted }}>search</span>
            <input
              placeholder="Search intel database..."
              className="w-52 rounded text-sm pl-10 py-1.5 pr-3 outline-none transition-all"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text }}
            />
          </div>
          <button className="relative p-2 rounded transition-colors"
            style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text }}>
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: C.danger }} />
          </button>
          <button className="p-2 rounded transition-colors"
            style={{ backgroundColor: C.bg, border: `1px solid ${C.border}`, color: C.text }}>
            <span className="material-symbols-outlined text-xl">contrast</span>
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{ backgroundColor: `${C.primary}22`, border: `1px solid ${C.primary}66`, color: C.primary }}>
            {user?.name?.[0] || 'C'}
          </div>
        </div>
      </header>

      {/* ── CONTENT AREA ── */}
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
}

export default App;
