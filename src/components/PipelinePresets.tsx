import React from 'react';
import { PipelinePreset } from '../types';

interface PipelinePresetsProps {
  presets: PipelinePreset[];
  activePresetId: string;
  onSelectPreset: (preset: PipelinePreset) => void;
  onClose: () => void;
}

export const PipelinePresetsModal: React.FC<PipelinePresetsProps> = ({
  presets,
  activePresetId,
  onSelectPreset,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 relative">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Select AI Pipeline Blueprint</h2>
            <p className="text-xs text-slate-400">Choose a pre-configured multi-modal workflow graph.</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800 border border-slate-700"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {presets.map((preset) => {
            const isSelected = preset.id === activePresetId;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`p-4 rounded-xl border cursor-pointer transition flex items-start justify-between ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-400 ring-1 ring-cyan-400/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800/60 uppercase">
                      {preset.category}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-100">{preset.title}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{preset.description}</p>
                  <p className="text-[11px] font-mono text-slate-500">
                    Nodes: {preset.nodes.map((n) => n.name).join(' → ')}
                  </p>
                </div>
                {isSelected && (
                  <span className="text-xs font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded border border-cyan-800 shrink-0 ml-3">
                    Active
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
