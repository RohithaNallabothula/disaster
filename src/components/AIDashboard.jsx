import React, { useState, useRef, useEffect } from 'react';

// ── Colour constants matching the reference ──────────────────────────────────
const C = {
  bg:      '#0A0F1E',
  surface: '#111827',
  border:  '#1E293B',
  primary: '#06B6D4',
  secondary:'#F59E0B',
  danger:  '#EF4444',
  success: '#10B981',
  muted:   '#64748B',
  text:    '#F1F5F9',
};

// ── Static initial messages ──────────────────────────────────────────────────
const INITIAL_AI_MESSAGES = [
  {
    id: 1, from: 'ai',
    lines: [
      '> INITIALIZING CONTEXTUAL AWARENESS...',
      '> SECTOR 7: DEGRADING ATMOSPHERIC CONDITIONS DETECTED.',
      '> ACTIVE ASSETS: 14 UNITS DEPLOYED.',
      '> STANDING BY FOR COMMAND OVERRIDE OR QUERY.',
    ],
  },
  {
    id: 2, from: 'user',
    text: 'Requesting current health status of Medical Unit 4 (MEDEVAC).',
  },
  {
    id: 3, from: 'ai',
    lines: [
      '> UNIT 4 STATUS: NOMINAL.',
      '> POSITION: 4.2KM SOUTH OF LZ ALPHA.',
      '> FUEL: 62% | PERSONNEL: GREEN.',
    ],
    link: '> GENERATE PROJECTED TRAJECTORY?',
  },
];

const COMMS_TABS = ['COMMAND', 'FIELD OPS', 'MEDICAL', 'EXTERNAL'];
const TAB_ICONS  = ['campaign', 'map', 'emergency', 'groups'];

const COMMS_MESSAGES = [
  { id: 1, role: 'HQ-LEAD',        color: C.primary,  time: '08:02:14', text: 'Weather advisory upgraded to Level 4. All external units transition to protocol Delta-3. Secure non-essential assets.' },
  { id: 2, role: 'FIELD-CAP-ALPHA',color: C.muted,    time: '08:04:30', text: 'Copy HQ. Alpha team relocating to shelter sub-level 3. Peripheral sensors failing.' },
  { id: 3, type: 'system', text: 'SAT-LINK 8 established. Uplink latency: 24ms.' },
  { id: 4, role: 'MED-CHIEF',      color: C.danger,   time: '08:07:55', text: 'Critical shortage: Requesting immediate AI reroute of Logistics-1 for supply drop in Sector 4.', actions: ['APPROVE DISPATCH', 'DETAILS'] },
  { id: 5, role: 'SENTINEL-AI',    color: C.primary,  time: '08:10:12', text: 'Recalculating optimal route for Logistics-1. Avoiding high-wind corridors in Sector 4. ETA: 12m.' },
];

const CHIPS = ['Analyze evacuation routes', 'Resource audit', 'Casualty projection'];

// ── Sub-components ────────────────────────────────────────────────────────────

function AiMessage({ msg }) {
  return (
    <div className="flex gap-4">
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${C.primary}22`, border: `1px solid ${C.primary}66` }}>
        <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 20 }}>smart_toy</span>
      </div>
      <div className="space-y-2 max-w-[85%]">
        <p className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: C.primary, fontFamily: 'Rajdhani, sans-serif' }}>
          SENTINEL_CORE_V2.0
        </p>
        <div className="p-4 rounded-xl shadow-lg"
          style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
          <p className="text-sm leading-relaxed" style={{ fontFamily: 'Courier New, monospace', color: C.text }}>
            {msg.lines.map((l, i) => (
              <span key={i}>{l}<br /></span>
            ))}
            {msg.link && (
              <span className="font-bold underline cursor-pointer" style={{ color: C.primary }}>
                {msg.link}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

function UserMessage({ msg }) {
  return (
    <div className="flex gap-4 justify-end">
      <div className="space-y-2 max-w-[85%] text-right">
        <p className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: C.muted, fontFamily: 'Rajdhani, sans-serif' }}>
          INCIDENT COMMANDER
        </p>
        <div className="p-4 rounded-xl" style={{ backgroundColor: `${C.border}55` }}>
          <p className="text-sm" style={{ color: C.text }}>{msg.text}</p>
        </div>
      </div>
      {/* Avatar */}
      <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
        <span className="material-symbols-outlined" style={{ color: C.muted, fontSize: 20 }}>person</span>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
const AIDashboard = () => {
  const [messages, setMessages]     = useState(INITIAL_AI_MESSAGES);
  const [inputVal, setInputVal]     = useState('');
  const [activeTab, setActiveTab]   = useState(0);
  const [broadcast, setBroadcast]   = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const val = inputVal.trim();
    if (!val) return;
    const userMsg = { id: Date.now(), from: 'user', text: val };
    const aiMsg   = {
      id: Date.now() + 1, from: 'ai',
      lines: [
        '> PROCESSING REQUEST...',
        `> QUERY: "${val.toUpperCase()}"`,
        '> CROSS-REFERENCING FIELD DATA...',
        '> NO CRITICAL ANOMALIES DETECTED. STANDING BY.',
      ],
    };
    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInputVal('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" style={{ backgroundColor: C.bg, color: C.text }}>

      {/* ── MAIN SPLIT LAYOUT ── */}
      <main className="flex flex-1 overflow-hidden">

        {/* ════════════════════════════════════════════════════
            LEFT PANEL — AI ASSISTANT
        ════════════════════════════════════════════════════ */}
        <section className="flex flex-col w-1/2 relative" style={{ borderRight: `1px solid ${C.border}`, backgroundColor: C.bg }}>

          {/* Panel Header */}
          <div className="flex justify-between items-center p-4 flex-shrink-0"
            style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: `${C.surface}80` }}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ color: C.primary }}>psychology</span>
              <h3 className="text-lg font-bold tracking-widest uppercase"
                style={{ fontFamily: 'Rajdhani, sans-serif', color: C.text }}>
                SENTINEL AI ASSISTANT
              </h3>
            </div>
            <div className="flex items-center gap-3">
              {/* SITREP GEN button */}
              <button className="flex items-center gap-2 px-3 py-1 rounded text-[11px] font-bold transition-all hover:brightness-110"
                style={{ backgroundColor: `${C.primary}1A`, border: `1px solid ${C.primary}4D`, color: C.primary, fontFamily: 'Rajdhani, sans-serif' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>auto_awesome</span>
                SITREP GEN
              </button>
              {/* AI READY indicator */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: C.success }} />
                <span className="text-[10px] font-bold uppercase" style={{ color: C.success, fontFamily: 'Rajdhani, sans-serif' }}>
                  AI_READY
                </span>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>
            {messages.map(msg =>
              msg.from === 'ai'
                ? <AiMessage key={msg.id} msg={msg} />
                : <UserMessage key={msg.id} msg={msg} />
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chips + Input Bar */}
          <div className="p-6 flex-shrink-0" style={{ borderTop: `1px solid ${C.border}`, backgroundColor: `${C.surface}CC` }}>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-4">
              {CHIPS.map(chip => (
                <button key={chip}
                  onClick={() => setInputVal(chip)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:brightness-110"
                  style={{ border: `1px solid ${C.border}`, backgroundColor: C.bg, color: C.text }}>
                  {chip}
                </button>
              ))}
            </div>
            {/* Input field */}
            <div className="relative">
              <input
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tactical command..."
                className="w-full py-4 pl-4 pr-16 text-sm rounded-xl outline-none transition-all"
                style={{
                  backgroundColor: C.bg,
                  border: `1px solid ${C.border}`,
                  color: C.text,
                  fontFamily: 'Courier New, monospace',
                }}
              />
              <button onClick={handleSend}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg flex items-center justify-center transition-all hover:brightness-110"
                style={{ backgroundColor: C.primary, color: C.bg, boxShadow: `0 4px 12px ${C.primary}33` }}>
                <span className="material-symbols-outlined font-bold" style={{ fontSize: 18 }}>send</span>
              </button>
            </div>
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            RIGHT PANEL — COMMS HUB
        ════════════════════════════════════════════════════ */}
        <section className="flex flex-col w-1/2" style={{ backgroundColor: C.bg }}>

          {/* Tabs */}
          <div className="flex flex-shrink-0" style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.surface }}>
            {COMMS_TABS.map((tab, i) => {
              const isActive = activeTab === i;
              return (
                <button key={tab}
                  onClick={() => setActiveTab(i)}
                  className="flex-1 py-4 flex flex-col items-center transition-colors"
                  style={{
                    borderBottom: isActive ? `2px solid ${C.primary}` : '2px solid transparent',
                    backgroundColor: isActive ? `${C.primary}0D` : 'transparent',
                  }}>
                  <span className="material-symbols-outlined mb-1"
                    style={{ color: isActive ? C.primary : C.muted, fontSize: 22 }}>
                    {TAB_ICONS[i]}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-widest"
                    style={{ color: isActive ? C.primary : C.muted, fontFamily: 'Rajdhani, sans-serif' }}>
                    {tab}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Comms content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent` }}>

            {/* OP Header card */}
            <div className="flex justify-between items-center p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${C.danger}1A`, border: `1px solid ${C.danger}4D` }}>
                  <span className="material-symbols-outlined" style={{ color: C.danger }}>priority_high</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-widest"
                    style={{ color: C.text, fontFamily: 'Rajdhani, sans-serif' }}>
                    OP: NIGHTFALL
                  </h4>
                  <p className="text-[10px]" style={{ color: C.muted }}>Update: 4m ago by HQ-Lead</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all hover:brightness-110"
                style={{ backgroundColor: C.secondary, color: C.bg, boxShadow: `0 4px 12px ${C.secondary}1A`, fontFamily: 'Rajdhani, sans-serif' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>auto_awesome</span>
                AUTO-SITREP
              </button>
            </div>

            {/* Message feed */}
            <div className="space-y-1">
              {COMMS_MESSAGES.map(msg => {
                if (msg.type === 'system') {
                  return (
                    <div key={msg.id} className="mx-2 p-3 rounded-lg flex items-center gap-3"
                      style={{ backgroundColor: `${C.surface}66`, border: `1px solid ${C.border}` }}>
                      <span className="material-symbols-outlined" style={{ color: C.muted, fontSize: 18 }}>settings_remote</span>
                      <p className="text-[11px] italic" style={{ color: C.muted }}>{msg.text}</p>
                    </div>
                  );
                }
                return (
                  <div key={msg.id}
                    className="p-4 rounded-xl transition-all group"
                    style={{ borderLeft: '2px solid transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = `${C.surface}99`; e.currentTarget.style.borderLeftColor = C.primary; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderLeftColor = 'transparent'; }}>
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest"
                        style={{ color: msg.color, fontFamily: 'Rajdhani, sans-serif' }}>
                        {msg.role}
                      </span>
                      <span className="text-[10px]" style={{ color: C.muted }}>{msg.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: `${C.text}E6` }}>{msg.text}</p>
                    {msg.actions && (
                      <div className="mt-3 flex gap-2">
                        <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                          style={{ color: C.primary, border: `1px solid ${C.primary}4D`, backgroundColor: `${C.primary}1A`, fontFamily: 'Rajdhani, sans-serif' }}>
                          {msg.actions[0]}
                        </button>
                        <button className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all hover:brightness-110"
                          style={{ color: C.muted, border: `1px solid ${C.border}`, fontFamily: 'Rajdhani, sans-serif' }}>
                          {msg.actions[1]}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Broadcast Input */}
          <div className="p-4 flex-shrink-0" style={{ borderTop: `1px solid ${C.border}`, backgroundColor: C.surface }}>
            <div className="flex gap-3 items-center p-2 pr-3 rounded-xl transition-all"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.border}` }}>
              <button className="p-2 transition-colors hover:brightness-125" style={{ color: C.muted }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>attach_file</span>
              </button>
              <textarea
                value={broadcast}
                onChange={e => setBroadcast(e.target.value)}
                placeholder="Broadcast to Command channel..."
                rows={1}
                className="flex-1 bg-transparent text-sm resize-none py-2 h-10 overflow-hidden outline-none"
                style={{ color: C.text, border: 'none' }}
              />
              <button className="p-2 rounded-lg transition-colors hover:brightness-125"
                style={{ color: C.primary }}>
                <span className="material-symbols-outlined font-bold" style={{ fontSize: 20 }}>send</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── STATUS BAR ── */}
      <footer className="flex justify-between items-center px-6 py-2 flex-shrink-0"
        style={{ backgroundColor: C.surface, borderTop: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-6">
          {[
            { color: C.success,    label: 'Uplink: STABLE' },
            { color: C.primary,    label: 'Encryption: AES-256' },
            { color: C.secondary,  label: 'Latency: 24MS' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: C.muted, fontFamily: 'Rajdhani, sans-serif' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <div className="text-[10px] tracking-[0.2em] uppercase font-mono" style={{ color: C.muted }}>
          2024 SENTINEL DEFENSE SYSTEMS // [SECURE PROTOCOL]
        </div>
      </footer>
    </div>
  );
};

export default AIDashboard;
