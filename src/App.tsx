/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Snowflake, Sparkles, Layers, Terminal, Waves, Info, Clock, Thermometer } from 'lucide-react';
import { SimulationType } from './types';
import ParticleCanvas from './components/ParticleCanvas';

interface SimulationLog {
  id: string;
  time: string;
  event: string;
  type: SimulationType;
}

export default function App() {
  const [activeType, setActiveType] = useState<SimulationType>('none');
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [logs, setLogs] = useState<SimulationLog[]>([]);

  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const addLog = (event: string, type: SimulationType) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        time: timestamp,
        event,
        type,
      },
      ...prev.slice(0, 5), // keep last 6 logs for status display
    ]);
  };

  const triggerSimulation = (type: SimulationType) => {
    // Clear any existing active countdown
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Set active stats
    if (type === 'snowflakes') {
      addLog('Snowflakes cascade simulation initialized', 'snowflakes');
    } else if (type === 'balloons') {
      addLog('Balloons thermal ascent simulation initialized', 'balloons');
    }

    setActiveType(type);
    setIsActive(true);
    setTimeLeft(5.0);
    startTimeRef.current = Date.now();

    // Start precision interval tracking
    intervalRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, 5.0 - elapsed);
      
      // Update with single-decimal high fidelity countdown
      setTimeLeft(Math.round(remaining * 10) / 10);

      if (remaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsActive(false);
        setActiveType('none');
        setTimeLeft(0);
        addLog('Atmospheric simulation cycle completed', 'none');
      }
    }, 50);
  };

  // Percentage of remaining time (for the elegant progress bar)
  const progressPercent = (timeLeft / 5.0) * 100;

  return (
    <div id="main-container" className="h-screen w-screen bg-slate-50 flex flex-col font-sans text-slate-900 overflow-hidden relative select-none">
      
      {/* Dynamic atmospheric simulation background */}
      <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
        <ParticleCanvas type={activeType} timeLeft={timeLeft} isActive={isActive} />
      </div>

      {/* Header component styled in elegant "Professional Polish" Slate-900 theme */}
      <header id="app-header" className="h-16 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-8 shrink-0 z-55">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight uppercase">AeroSim Control Terminal</span>
        </div>
        
        <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-widest text-slate-400">
          <span className="text-indigo-400 border-b-2 border-indigo-400 py-5 flex items-center gap-1">
            <Waves className="h-3 w-3" /> Atmosphere
          </span>
          <span className="hover:text-white cursor-pointer py-5 transition-colors font-sans hover:border-b-2 hover:border-white">Simulation</span>
          <span className="hover:text-white cursor-pointer py-5 transition-colors font-sans hover:border-b-2 hover:border-white">Analytics</span>
          <span className="hover:text-white cursor-pointer py-5 transition-colors font-mono tracking-normal leading-none flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            STATION-2026
          </span>
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-slate-500 font-mono">SYSTEM STATUS</span>
            <span className="text-[11px] text-green-400 font-bold tracking-wide">OPTIMIZED</span>
          </div>
          <div className="w-10 h-10 border border-slate-700 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" stroke="currentColor" />
            </svg>
          </div>
        </div>
      </header>

      {/* Main Grid Section */}
      <main id="app-main" className="flex-grow grid grid-cols-12 gap-0 z-20 overflow-y-auto lg:overflow-hidden">
        
        {/* Left Side Panel: Environment Metrics & Guide */}
        <aside id="sidebar-panel" className="order-2 lg:order-1 col-span-12 lg:col-span-3 border-t lg:border-t-0 lg:border-b-0 lg:border-r border-slate-200 bg-white p-6 flex flex-col justify-between lg:overflow-y-auto shrink-0">
          <div className="space-y-6">
            <div>
              <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">Environment Metrics</h3>
              
              <div className="space-y-4">
                
                {/* Metric 1 - Static Density */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Static Density</div>
                    <div id="metric-static-density" className="text-lg font-semibold text-slate-800 mt-0.5">1.225 kg/m³</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Waves className="h-4 w-4 text-indigo-500" />
                  </div>
                </div>

                {/* Metric 2 - Ambient Temp */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Ambient Temp</div>
                    <div id="metric-ambient-temp" className="text-lg font-semibold text-slate-800 mt-0.5">15.0°C</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Thermometer className="h-4 w-4 text-rose-500" />
                  </div>
                </div>

                {/* Metric 3 - Active State */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase">Simulation Status</div>
                    <div id="metric-simulation-status" className="text-lg font-semibold text-slate-800 mt-0.5">
                      {isActive ? `${timeLeft.toFixed(1)}s` : 'STANDBY'}
                    </div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    {isActive ? (
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    ) : (
                      <Clock className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Static Simulated Controls Guide */}
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
              <h4 className="text-indigo-900 text-xs font-bold flex items-center gap-1.5 mb-2">
                <Info className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                Simulation Guide
              </h4>
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                Select an environmental preset toggle below to dispatch premium localized particle flows. Stream durations are set to automatically settle after 5-second precision cycles.
              </p>
            </div>
          </div>

          {/* Real-time Logger integration at bottom of left sidebar */}
          <div className="mt-8 pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center space-x-1 px-1 text-[9px] font-bold tracking-wider text-slate-400 uppercase">
              <Terminal className="h-3 w-3 text-slate-400" />
              <span>Diagnostic Stream Logs</span>
            </div>
            
            <div id="log-list" className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 h-36 overflow-y-auto font-mono text-[10px] text-slate-600 divide-y divide-slate-100/60 scrollbar-none">
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-[10px]">
                  <span>System standby. Ready to log...</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="py-1.5 flex items-start justify-between gap-1">
                    <div className="truncate">
                      <span className="text-slate-400">[{log.time}]</span> <span className="text-slate-700 font-medium">{log.event}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </aside>

        {/* Central Workplace Section */}
        <section id="workplace-stage" className="order-1 lg:order-2 col-span-12 lg:col-span-9 p-6 sm:p-12 flex flex-col items-center justify-center bg-slate-50/50 relative overflow-hidden min-h-[480px] lg:min-h-0">
          
          {/* Pristine Premium Card Container */}
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden z-40">
            
            {/* Elegant Header Area */}
            <div className="p-8 border-b border-slate-100 text-center bg-gradient-to-r from-slate-50 to-white">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Atmospheric Particle Dispatch</h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">Execute local environmental simulations via the secure terminal buttons below.</p>
            </div>

            {/* Simulated Buttons Dispatch Tray */}
            <div className="p-10 sm:p-12 flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-16">
              
              {/* Trigger Snowflakes */}
              <button
                id="trigger-snowflakes"
                onClick={() => triggerSimulation('snowflakes')}
                className="group flex flex-col items-center gap-4 transition-all hover:-translate-y-1 focus:outline-none"
              >
                <div className={`w-28 h-28 bg-white border rounded-3xl flex items-center justify-center shadow-md transition-all duration-300 group-active:scale-95 ${
                  activeType === 'snowflakes'
                    ? 'border-indigo-500 shadow-xl shadow-indigo-100 bg-indigo-50/20'
                    : 'border-slate-200 group-hover:border-indigo-400 group-hover:shadow-indigo-100'
                }`}>
                  <Snowflake className={`w-12 h-12 transition-all duration-300 ${
                    activeType === 'snowflakes' ? 'text-indigo-600 rotate-45' : 'text-slate-300 group-hover:text-indigo-500'
                  }`} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  activeType === 'snowflakes' ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-600'
                }`}>
                  Snowflakes
                </span>
              </button>

              {/* Trigger Balloons */}
              <button
                id="trigger-balloons"
                onClick={() => triggerSimulation('balloons')}
                className="group flex flex-col items-center gap-4 transition-all hover:-translate-y-1 focus:outline-none"
              >
                <div className={`w-28 h-28 bg-white border rounded-3xl flex items-center justify-center shadow-md transition-all duration-300 group-active:scale-95 ${
                  activeType === 'balloons'
                    ? 'border-rose-400 shadow-xl shadow-rose-100 bg-rose-50/20'
                    : 'border-slate-200 group-hover:border-rose-400 group-hover:shadow-rose-100'
                }`}>
                  <Sparkles className={`w-12 h-12 transition-all duration-300 ${
                    activeType === 'balloons' ? 'text-rose-500 scale-110' : 'text-slate-300 group-hover:text-rose-500'
                  }`} />
                </div>
                <span className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                  activeType === 'balloons' ? 'text-rose-600' : 'text-slate-500 group-hover:text-rose-600'
                }`}>
                  Balloons
                </span>
              </button>

            </div>

            {/* Interactive Timer HUD when simulation is active */}
            {isActive && (
              <div className="px-8 sm:px-12 pb-8 animate-fade-in">
                <div className="bg-slate-50 rounded-2xl border border-slate-100 p-4 transition-all duration-300">
                  <div className="flex items-center justify-between text-xs font-mono font-bold tracking-wider text-slate-500 mb-2.5">
                    <span className="flex items-center gap-1.5 uppercase">
                      <span className={`h-2 w-2 rounded-full animate-pulse ${activeType === 'snowflakes' ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                      {activeType === 'snowflakes' ? 'Cascade: Snowflakes Active' : 'Thermal: Balloons Active'}
                    </span>
                    <span id="countdown-readout" className="text-slate-700 font-mono text-[11px] uppercase bg-slate-200/60 px-2 py-0.5 rounded">
                      {timeLeft.toFixed(1)}s remaining
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/80 rounded-full overflow-hidden">
                    <div
                      id="timer-progress-bar"
                      className={`h-full transition-all duration-75 rounded-full ${
                        activeType === 'snowflakes' ? 'bg-indigo-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Status Panel matching design footer (Custom integrated state log) */}
            <div className="bg-slate-900 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isActive ? 'bg-indigo-400' : 'bg-green-500'}`}></div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  {isActive ? 'Simulation Dispatch Active' : 'Simulation Node Standby'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">v4.2.1-stable</span>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}
