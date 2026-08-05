import React from 'react';
import { PipelineNode } from '../types';

interface NodeInspectorProps {
  node: PipelineNode | null;
  onUpdateNodeConfig: (nodeId: string, updatedConfig: Partial<PipelineNode['config']>) => void;
}

export const NodeInspector: React.FC<NodeInspectorProps> = ({
  node,
  onUpdateNodeConfig,
}) => {
  if (!node) {
    return (
      <div className="h-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-6 flex flex-col items-center justify-center text-center text-slate-500">
        <svg className="w-10 h-10 mb-3 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p className="text-xs font-mono">Select any node on the graph to inspect and configure runtime parameters.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between overflow-y-auto space-y-4">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-wider">Node Inspector</span>
            <h3 className="text-base font-bold text-slate-100">{node.name}</h3>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-900 border border-slate-700 text-slate-300">
            ID: {node.id}
          </span>
        </div>

        {/* Execution Metrics Summary */}
        <div className="grid grid-cols-2 gap-2 my-4">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
            <p className="text-[10px] text-slate-400 font-mono">Status</p>
            <p className="text-xs font-bold capitalize text-emerald-400 mt-0.5">{node.status}</p>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 text-left">
            <p className="text-[10px] text-slate-400 font-mono">Latency</p>
            <p className="text-xs font-bold text-cyan-400 mt-0.5">{node.latencyMs} ms</p>
          </div>
        </div>

        {/* Config Form */}
        <div className="space-y-3 font-mono text-xs">
          {node.config.model !== undefined && (
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">LLM Model Engine</label>
              <select
                value={node.config.model}
                onChange={(e) => onUpdateNodeConfig(node.id, { model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none text-xs"
              >
                <option value="gpt-4o-mini">gpt-4o-mini (Fast Router)</option>
                <option value="claude-3-5-sonnet">claude-3-5-sonnet (Agent Reasoner)</option>
                <option value="deepseek-r1-distill">deepseek-r1-distill (Logic Fallback)</option>
                <option value="text-embedding-3-large">text-embedding-3-large</option>
              </select>
            </div>
          )}

          {node.config.temperature !== undefined && (
            <div>
              <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                <span>Temperature</span>
                <span className="text-cyan-400 font-bold">{node.config.temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={node.config.temperature}
                onChange={(e) => onUpdateNodeConfig(node.id, { temperature: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {node.config.endpoint !== undefined && (
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">API Webhook Endpoint</label>
              <input
                type="text"
                value={node.config.endpoint}
                onChange={(e) => onUpdateNodeConfig(node.id, { endpoint: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:border-cyan-400 focus:outline-none text-xs font-mono"
              />
            </div>
          )}

          {node.config.promptTemplate !== undefined && (
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Prompt Template & Directives</label>
              <textarea
                rows={4}
                value={node.config.promptTemplate}
                onChange={(e) => onUpdateNodeConfig(node.id, { promptTemplate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-200 focus:border-cyan-400 focus:outline-none text-xs font-mono leading-normal"
              />
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex items-center justify-between">
        <span>Auto-save enabled</span>
        <span className="text-emerald-400">✓ Graph Sync Ready</span>
      </div>
    </div>
  );
};
