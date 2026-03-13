import React, { useState } from 'react';

const SEVERITY_COLORS = {
  Critical:  { band: '#EF4444', bg: 'rgba(239,68,68,0.05)',  badge: '#EF4444',  text: '#fff' },
  High:      { band: '#F59E0B', bg: 'rgba(245,158,11,0.05)', badge: '#F59E0B',  text: '#fff' },
  Medium:    { band: '#06B6D4', bg: 'rgba(6,182,212,0.04)',  badge: '#06B6D4',  text: '#fff' },
  Low:       { band: '#10B981', bg: 'rgba(16,185,129,0.04)', badge: '#10B981',  text: '#fff' },
};

const TYPE_ICONS = {
  CBRN:           'warning',
  Seismic:        'vibration',
  Cyclone:        'cyclone',
  Tsunami:        'waves',
  Flood:          'water_drop',
  Wildfire:       'local_fire_department',
  Volcanic:       'volcano',
  Nuclear:        'radiation',
  Industrial:     'factory',
  Terrorism:      'swords',
  Infrastructure: 'construction',
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
};

const Sidebar = ({ incidents = [], onAlertClick }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = incidents.filter(inc =>
    inc.title?.toLowerCase().includes(search.toLowerCase()) ||
    inc.type?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside
      id="sentinel-sidebar"
      className="relative flex flex-col flex-shrink-0 z-40"
      style={{
        width: collapsed ? 64 : 320,
        backgroundColor: '#111827',
        borderRight: '1px solid #1E293B',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
      }}
    >
      {/* ── EXPANDED CONTENT ── */}
      {!collapsed && (
        <div className="sidebar-content flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ borderBottom: '1px solid #1E293B' }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: '#64748B', fontFamily: 'Rajdhani, sans-serif' }}
            >
              Incidents
            </h3>
            <button
              onClick={onAlertClick}
              className="p-1 rounded transition-colors hover:brightness-125"
              title="Add Alert"
              style={{ color: '#64748B' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>tune</span>
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-3 flex-shrink-0" style={{ backgroundColor: 'rgba(10,15,30,0.5)' }}>
            <div className="relative">
              <span
                className="material-symbols-outlined absolute left-3 top-2.5"
                style={{ color: '#64748B', fontSize: '16px' }}
              >
                search
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search sectors..."
                className="w-full rounded py-2 pl-9 pr-3 text-xs outline-none focus:ring-1"
                style={{
                  backgroundColor: '#111827',
                  border: '1px solid #1E293B',
                  color: '#F1F5F9',
                  fontFamily: 'Source Sans 3, sans-serif',
                  '--tw-ring-color': '#06B6D4',
                }}
              />
            </div>
          </div>

          {/* Incident list */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-xs" style={{ color: '#64748B' }}>
                No incidents found
              </div>
            )}
            {filtered.map(inc => {
              const sev = inc.severity || 'Medium';
              const colors = SEVERITY_COLORS[sev] || SEVERITY_COLORS.Medium;
              const icon = TYPE_ICONS[inc.type] || 'warning';
              return (
                <div
                  key={inc.id}
                  className="p-4 cursor-pointer transition-colors hover:brightness-110 border-b"
                  style={{
                    backgroundColor: colors.bg,
                    borderLeft: `4px solid ${colors.band}`,
                    borderBottomColor: '#1E293B',
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter"
                      style={{ backgroundColor: colors.badge, color: colors.text }}
                    >
                      {sev}
                    </span>
                    <span className="text-[10px]" style={{ color: '#64748B' }}>
                      {timeAgo(inc.timestamp)}
                    </span>
                  </div>
                  <h4
                    className="text-sm font-bold mb-1 truncate"
                    style={{ color: '#F1F5F9', fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    {inc.title}
                  </h4>
                  {inc.description && (
                    <p className="text-xs mb-3 line-clamp-2" style={{ color: '#64748B' }}>
                      {inc.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" style={{ color: colors.band }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>{icon}</span>
                      <span className="text-[10px] font-bold">{inc.type?.toUpperCase()}</span>
                    </div>
                    {inc.location && (
                      <div className="flex items-center gap-1" style={{ color: '#64748B' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>location_on</span>
                        <span className="text-[10px]">
                          {inc.location[0]?.toFixed(2)}, {inc.location[1]?.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer CTA */}
          <div className="p-4 flex-shrink-0" style={{ borderTop: '1px solid #1E293B' }}>
            <button
              onClick={onAlertClick}
              className="w-full font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all hover:brightness-110"
              style={{
                backgroundColor: '#06B6D4',
                color: '#0A0F1E',
                fontFamily: 'Rajdhani, sans-serif',
                boxShadow: '0 4px 15px rgba(6,182,212,0.2)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add_alert</span>
              DEPLOY ASSETS
            </button>
          </div>
        </div>
      )}

      {/* ── COLLAPSED ICON-ONLY STATE ── */}
      {collapsed && (
        <div className="sidebar-icon-only flex flex-col items-center py-4 gap-5 w-full h-full">
          <button className="p-2 transition-colors hover:brightness-125" style={{ color: '#06B6D4' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>warning</span>
          </button>
          <button className="p-2 transition-colors hover:brightness-125" style={{ color: '#64748B' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>swords</span>
          </button>
          <button className="p-2 transition-colors hover:brightness-125" style={{ color: '#64748B' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>water_drop</span>
          </button>
          <div className="mt-auto p-2">
            <button
              onClick={onAlertClick}
              className="w-10 h-10 flex items-center justify-center rounded-full transition-all hover:brightness-110"
              style={{ backgroundColor: '#06B6D4', color: '#0A0F1E' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            </button>
          </div>
        </div>
      )}

      {/* ── COLLAPSE TOGGLE BUTTON ── */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="absolute top-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center rounded-full z-50 transition-colors hover:brightness-110"
        style={{
          right: -12,
          backgroundColor: '#111827',
          border: '1px solid #1E293B',
          color: '#64748B',
        }}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
          {collapsed ? 'chevron_right' : 'chevron_left'}
        </span>
      </button>
    </aside>
  );
};

export default Sidebar;
