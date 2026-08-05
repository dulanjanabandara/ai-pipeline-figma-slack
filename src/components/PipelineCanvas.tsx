import React from 'react';
import { PipelineNode, PipelineEdge } from '../types';

interface PipelineCanvasProps {
  nodes: PipelineNode[];
  edges: PipelineEdge[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

export const PipelineCanvas: React.FC<PipelineCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}) => {
  const getTypeBadgeStyle = (type: PipelineNode['type']) => {
    switch (type) {
      case 'ingest':
        return 'bg-blue-950/80 text-blue-400 border-blue-800/60';
      case 'transform':
        return 'bg-purple-950/80 text-purple-400 border-purple-800/60';
      case 'llm':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/60';
      case 'guardrail':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'tool':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-800/60';
      case 'output':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
    }
  };

  const getStatusIndicator = (status: PipelineNode['status']) => {
    switch (status) {
      case 'running':
        return <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" title="Executing" />;
      case 'success':
        return <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow shadow-emerald-400/50" title="Success" />;
      case 'error':
        return <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow shadow-rose-500/50" title="Error" />;
      default:
        return <span className="w-2.5 h-2.5 rounded-full bg-slate-600" title="Idle" />;
    }
  };

  return (
    <div className="relative w-full h-[520px] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden shadow-2xl group">
      {/* Grid Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Top Bar Overlay */}
      <div className="absolute top-3 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-300 backdrop-blur pointer-events-auto">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>DAG Canvas View</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">{nodes.length} Active Nodes</span>
        </div>
        <div className="text-xs text-slate-500 font-mono bg-slate-900/80 border border-slate-800/60 px-2.5 py-1 rounded backdrop-blur">
          Click any node to open Inspector
        </div>
      </div>

      {/* SVG Canvas for Edges */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          // Node visual dimensions: width 220, height 90
          const startX = fromNode.x + 220;
          const startY = fromNode.y + 45;
          const endX = toNode.x;
          const endY = toNode.y + 45;
          const dx = Math.abs(endX - startX) / 2;
          const path = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

          return (
            <g key={edge.id}>
              {/* Background trace line */}
              <path
                d={path}
                fill="none"
                stroke="#1e293b"
                strokeWidth="3"
              />
              {/* Active flowing gradient path */}
              <path
                d={path}
                fill="none"
                stroke={edge.active ? "url(#edgeGradient)" : "#334155"}
                strokeWidth={edge.active ? "2.5" : "1.5"}
                className={edge.active ? "animate-dash" : ""}
              />
            </g>
          );
        })}
      </svg>

      {/* Render Canvas Nodes */}
      <div className="relative w-full h-full p-6 z-10">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <div
              key={node.id}
              onClick={() => onSelectNode(node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: '220px',
              }}
              className={`absolute cursor-pointer transition-all duration-200 rounded-xl p-3.5 border backdrop-blur-md shadow-lg ${
                isSelected
                  ? 'bg-slate-900/95 border-cyan-400 ring-2 ring-cyan-500/30 shadow-cyan-500/10 scale-105 z-30'
                  : node.status === 'running'
                  ? 'bg-slate-900/90 border-emerald-400/80 ring-1 ring-emerald-400/30 z-20'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900 z-10'
              }`}
            >
              {/* Top Header Row */}
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getTypeBadgeStyle(node.type)}`}>
                  {node.type}
                </span>
                <div className="flex items-center gap-1.5">
                  {getStatusIndicator(node.status)}
                  <span className="text-[11px] font-mono text-slate-400">{node.latencyMs > 0 ? `${node.latencyMs}ms` : '--'}</span>
                </div>
              </div>

              {/* Node Title */}
              <h3 className="text-xs font-semibold text-slate-100 truncate mb-1">
                {node.name}
              </h3>

              {/* Details subtitle */}
              <p className="text-[11px] font-mono text-slate-400 truncate">
                {node.config.model || node.config.endpoint || 'Configured Node'}
              </p>

              {/* Interactive Port Anchors */}
              <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-cyan-400 shadow" />
              <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-900 border-2 border-emerald-400 shadow" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
