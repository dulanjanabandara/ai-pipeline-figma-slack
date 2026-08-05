import React from 'react';

interface NavbarProps {
  activeTab: 'canvas' | 'console' | 'metrics' | 'presets';
  setActiveTab: (tab: 'canvas' | 'console' | 'metrics' | 'presets') => void;
  isExecuting: boolean;
  onRunPipeline: () => void;
  onResetPipeline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isExecuting,
  onRunPipeline,
  onResetPipeline
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F17]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
      {/* Left: Cluster & Workspace status */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold tracking-wider text-cyan-400 uppercase">Cluster ID: us-east-h100-04</span>
              <span className="px-1.5 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 font-mono">HEALTHY</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Workspace: Production AI Engine / Pipeline-09A</span>
          </div>
        </div>
      </div>

      {/* Middle: Tab Navigation */}
      <nav className="flex items-center bg-slate-900/80 p-1 rounded-lg border border-slate-800 space-x-1">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'canvas' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Workflow Visualizer
        </button>
        <button
          onClick={() => setActiveTab('console')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'console' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Live Telemetry & Logs
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'metrics' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          GPU & Model Metrics
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'presets' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Preset Library
        </button>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onResetPipeline}
          disabled={isExecuting}
          className="px-3 py-1.5 text-xs text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded border border-slate-700 transition font-medium"
        >
          Reset Graph
        </button>
        <button
          onClick={onRunPipeline}
          disabled={isExecuting}
          className={`px-4 py-1.5 text-xs font-bold rounded flex items-center space-x-2 transition shadow-lg ${isExecuting ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-not-allowed animate-pulse' : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-cyan-500/20'}`}
        >
          {isExecuting ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-amber-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Executing Pipeline...</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Execute Pipeline Run</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
