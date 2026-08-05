import React from 'react';
import { ExecutionLog } from '../types';

interface ExecutionConsoleProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({ logs, onClearLogs }) => {
  const getLevelStyle = (level: ExecutionLog['level']) => {
    switch (level) {
      case 'info':
        return 'text-slate-400';
      case 'warn':
        return 'text-amber-400';
      case 'success':
        return 'text-emerald-400 font-semibold';
      case 'error':
        return 'text-rose-400 font-bold';
    }
  };

  return (
    <div className="bg-slate-950/95 border border-slate-800/80 rounded-xl overflow-hidden font-mono text-xs flex flex-col h-full shadow-xl">
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
          </div>
          <span className="text-xs font-semibold text-slate-300 ml-2">Live Execution Stream</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">{logs.length} Events</span>
          <button
            onClick={onClearLogs}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition bg-slate-800 px-2 py-0.5 rounded"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-4 space-y-1.5 overflow-y-auto max-h-[220px] font-mono text-[11px] leading-relaxed select-text">
        {logs.length === 0 ? (
          <p className="text-slate-600 italic">No execution logs yet. Click "Execute Pipeline" to start real-time telemetry.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/50 p-0.5 rounded transition">
              <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
              <span className="text-cyan-400 font-medium shrink-0">[{log.nodeName}]</span>
              <span className={`grow ${getLevelStyle(log.level)}`}>{log.message}</span>
              {log.latency && (
                <span className="text-slate-500 shrink-0 font-mono">+{log.latency}ms</span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
