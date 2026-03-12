import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MapLayer from './components/MapContainer';
import AlertForm from './components/AlertForm';
import ResourceRegistry from './components/ResourceRegistry';
import ConflictMonitor from './components/ConflictMonitor';
import IoTMonitor from './components/IoTMonitor';
import PlumeModeler from './components/PlumeModeler';
import CrowdAlertsView from './components/CrowdAlertsView';
import Login from './components/Login';
import { mockDataService, DISASTER_TYPES, SEVERITY_LEVELS } from './services/mockDataService';
import { mlEngine } from './services/mlEngine';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [satelliteRegions, setSatelliteRegions] = useState([]);
  const [isAlertFormOpen, setIsAlertFormOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check for existing session
    const savedToken = localStorage.getItem('sentinel_token');
    const savedUser = localStorage.getItem('sentinel_user');
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

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sentinel_token');
    localStorage.removeItem('sentinel_user');
  };

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      // Load incidents and satellite regions from mock service
      setIncidents(mockDataService.getIncidents());
      setSatelliteRegions(mockDataService.getSatelliteRegions());

      // Fetch sensors from backend
      try {
        const res = await fetch('http://localhost:5000/api/sensors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSensors(data);
        }
      } catch (err) {
        console.error('Failed to load sensors from backend:', err);
      }
    };

    fetchData();

    // Poll sensors from backend every 5s to simulate real-time updates
    const sensorInterval = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:5000/api/sensors', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setSensors(data);
        }
      } catch (err) {
        console.error('Sensor poll failed:', err);
      }

      // Occasional random alert
      if (Math.random() > 0.8) {
        const newAlert = {
          id: Date.now(),
          type: DISASTER_TYPES.INFRASTRUCTURE,
          title: 'Infrastructure Anomaly Detected',
          location: [34.0522 + (Math.random() - 0.5) * 0.1, -118.2437 + (Math.random() - 0.5) * 0.1],
          severity: SEVERITY_LEVELS.MEDIUM,
          timestamp: new Date().toISOString(),
          description: 'Automated monitoring detected structural vibration on Bridge 04.'
        };
        setIncidents(prev => [newAlert, ...prev.slice(0, 9)]);
      }
    }, 5000);

    return () => clearInterval(sensorInterval);
  }, [token]);

  const handleNewAlert = (alert) => {
    setIncidents(prev => [alert, ...prev]);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-sentinel-900 font-sans antialiased text-gray-100">
      {/* Sidebar Navigation */}
      <Sidebar 
        incidents={incidents} 
        onAlertClick={() => setIsAlertFormOpen(true)}
        currentView={currentView}
        onNavigate={setCurrentView}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-full">
        {/* Alert Form Overlay */}
        {isAlertFormOpen && (
          <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <AlertForm 
              onSubmit={handleNewAlert}
              onClose={() => setIsAlertFormOpen(false)}
            />
          </div>
        )}
        {/* Top Header Overlay (Glassmorphism) */}
        <header className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between p-4 bg-sentinel-800/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-sentinel-danger uppercase tracking-wider">Active Monitoring</span>
              <span className="text-sm font-bold text-white">Zone 01: Los Angeles Metro Area</span>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-300">Satellite Comms: Nominal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-300">IoT Network: 322 Active Nodes</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-xs font-medium text-gray-400 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
            Real-time Feed: <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </header>

        {/* GIS Map Context or Module View */}
        <div className="flex-1 w-full h-full relative z-0">
          {currentView === 'dashboard' ? (
            <MapLayer 
              incidents={incidents} 
              sensors={sensors} 
              satelliteRegions={satelliteRegions} 
            />
          ) : currentView === 'resources' ? (
            <ResourceRegistry />
          ) : currentView === 'conflict' ? (
            <ConflictMonitor incidents={incidents} />
          ) : currentView === 'sensors' ? (
            <IoTMonitor sensors={sensors} />
          ) : currentView === 'alerts' ? (
            <CrowdAlertsView 
              incidents={incidents} 
              onAddAlert={() => setIsAlertFormOpen(true)} 
            />
          ) : (
            <PlumeModeler />
          )}
        </div>

        {/* Bottom Metrics Bar (Optional) */}
        <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] w-2/3 max-w-4xl p-4 bg-sentinel-800/80 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl flex items-center justify-between">
           <div className="flex items-center gap-4 border-r border-white/10 pr-6 mr-6">
              <div className="p-2 bg-sentinel-danger/20 rounded-lg text-sentinel-danger">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Critical Threats</p>
                <p className="text-sm font-bold text-white">02 Active</p>
              </div>
           </div>
           
           <div className="flex-1 grid grid-cols-3 gap-8">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Resource Load</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-1.5">
                  <div className="h-full w-[45%] bg-blue-500 rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Network Stability</p>
                <div className="h-1.5 w-full bg-white/10 rounded-full mt-1.5">
                  <div className="h-full w-[92%] bg-sentinel-success rounded-full" />
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Response Latency</p>
                <p className="text-sm font-bold text-white mt-1">42ms</p>
              </div>
           </div>
        </footer>
      </main>
    </div>
  );
}

// Simple AlertTriangle for the footer until lucide is fully used
const AlertTriangle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>
  </svg>
);

export default App;
