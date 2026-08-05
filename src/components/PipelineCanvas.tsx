import React from 'react';
import { PipelineNode } from '../types';

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onAddNode: () => void;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  onAddNode
}) => {
  const getStatusBadge = (status: PipelineNode['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-mono font-semibold flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            <span>SUCCESS</span>
          </span>
        );
      case 'running':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded font-mono font-semibold flex items-center space-x-1 animate-pulse">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
            <span>PROCESSING</span>
          </span>
        );
      case 'queued':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded font-mono flex items-center space-x-1">
            <span>QUEUED</span>
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-0.5 text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded font-mono flex items-center space-x-1">
            <span>FAILED</span>
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-slate-400 border border-slate-700 rounded font-mono">
            IDLE
          </span>
        );
    }
  };

  return (
    <div className="relative w-full min-h-[580px] bg-[#0B0F17] rounded-xl border border-slate-800/80 p-6 shadow-2xl flex flex-col justify-between overflow-x-auto">
      {/* Grid Pattern Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none rounded-xl"></div>
      
      {/* Top Canvas Controls */}
      <div className="relative z-10 flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]"></span>
          <h2 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider">Visual Pipeline Execution Graph</h2>
          <span className="text-xs text-slate-500 font-mono">({nodes.length} Nodes Configured)</span>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400 font-mono">Auto-sync: <span className="text-emerald-400 font-bold">ENABLED</span></span>
          <button
            onClick={onAddNode}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-200 border border-slate-700 hover:border-cyan-500/50 rounded flex items-center space-x-1.5 transition"
          >
            <span>+ Add Step</span>
          </button>
        </div>
      </div>

      {/* Interactive Node Canvas Flow */}
      <div className="relative z-10 flex flex-nowrap items-center space-x-6 overflow-x-auto py-8 px-2 min-w-full">
        {nodes.map((node, index) => {
          const isSelected = node.id === selectedNodeId;
          return (
            <React.Fragment key={node.id}>
              {/* Node Card */}
              <div
                onClick={() => onSelectNode(node.id)}
                className={`relative group shrink-0 w-72 rounded-xl p-5 cursor-pointer transition-all duration-200 border ${isSelected ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.25)]' : 'bg-slate-900/80 hover:bg-slate-900 border-slate-800 hover:border-slate-700 shadow-lg'}`}
              >
                {/* Top header of node card */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                      <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Step 0{index + 1}</p>
                      <h3 className="text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">{node.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center justify-between my-3 text-xs">
                  {getStatusBadge(node.status)}
                  <span className="text-[11px] font-mono text-slate-400">{node.category}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4 font-sans">
                  {node.description}
                </p>

                {/* Progress bar if running or completed */}
                {node.status === 'running' || node.status === 'completed' ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>Progress</span>
                      <span>{node.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700/50">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${node.status === 'completed' ? 'bg-emerald-400' : 'bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse'}`}
                        style={{ width: `${node.progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : null}

                {/* Output schema preview tag */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[180px] text-slate-400">Out: {node.outputSchema}</span>
                  <span className="text-cyan-400 hover:underline">Inspect →</span>
                </div>
              </div>

              {/* Flow Connector Line between nodes */}
              {index < nodes.length - 1 && (
                <div className="shrink-0 flex items-center justify-center px-1 text-slate-600">
                  <div className="relative flex items-center">
                    <div className={`h-0.5 w-8 ${nodes[index].status === 'completed' ? 'bg-cyan-500/80' : 'bg-slate-800'}`}></div>
                    <svg className={`w-4 h-4 -ml-1 ${nodes[index].status === 'completed' ? 'text-cyan-400' : 'text-slate-700'}`} fill=