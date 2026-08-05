import React from 'react';

interface NavbarProps {
  activePresetName: string;
  isExecuting: boolean;
  onRunPipeline: () => void;
  onOpenPresets: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePresetName,
  isExecuting,
  onRunPipeline,
  onOpenPresets,
  onReset
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-lg shadow-cyan-500/20">
          NX
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Nexus Core Engine</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-cyan-950 text-cyan-300 border border-cyan-800/50">
              v3.4-prod
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono">Preset: <span className="text-slate-200 font-medium">{activePresetName}</span></p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenPresets}
          className="px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 hover:border-slate-500 hover:text-white transition flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
          Switch Pipeline Blueprint
        </button>

        <button
          onClick={onReset}
          disabled={isExecuting}
          className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 bg-slate-900/60 border border-slate-800 hover:text-slate-200 transition disabled:opacity-50"
        >
          Reset Graph
        </button>

        <button
          onClick={onRunPipeline}
          disabled={isExecuting}
          className={`px-4 py-1.5 rounded-md text-xs font-semibold text-slate-950 transition flex items-center gap-2 shadow-md ${
            isExecuting
              ? 'bg-emerald-500/50 cursor-not-allowed text-slate-900'
              : 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-emerald-500/25 active:scale-95'
          }`}
        >
          {isExecuting ? (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
              Executing Graph...
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Execute Pipeline
            </>
          )}
        </button>
      </div>
    </header>
  );
};
