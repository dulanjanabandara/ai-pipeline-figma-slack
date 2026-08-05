import React, { useState } from 'react';
import {
  IconPlay,
  IconPause,
  IconRefresh,
  IconCheckCircle,
  IconSliders,
  IconTerminal,
  IconDatabase,
  IconCpu,
  IconShieldCheck,
  IconZap
} from './Icons';

interface NodeItem {
  id: string;
  type: 'ingest' | 'chunk' | 'vector' | 'router' | 'guardrail' | 'stream';
  title: string;
  sub: string;
  status: 'idle' | 'running' | 'success' | 'warning';
  latency: string;
  tokens?: string;
  config: Record<string, string | number | boolean>;
}

const INITIAL_NODES: NodeItem[] = [
  {
    id: 'node-1',
    type: 'ingest',
    title: 'Data Ingestion Node',
    sub: 'Webhook / S3 / Postgres JSON',
    status: 'success',
    latency: '8 ms',
    config: {
      source: 'Postgres CDC Trigger',
      batchSize: 512,
      autoRetry: true
    }
  },
  {
    id: 'node-2',
    type: 'chunk',
    title: 'Semantic Tokenizer',
    sub: 'Adaptive Chunking (512 tokens)',
    status: 'success',
    latency: '14 ms',
    config: {
      strategy: 'RecursiveCharacter',
      chunkOverlap: 64,
      maxTokens: 512
    }
  },
  {
    id: 'node-3',
    type: 'vector',
    title: 'Hybrid Retrieval',
    sub: 'Pinecone Vector + BM25 Rerank',
    status: 'success',
    latency: '22 ms',
    config: {
      vectorDB: 'Pinecone Serverless',
      topK: 8,
      hybridAlpha: 0.75
    }
  },
  {
    id: 'node-4',
    type: 'router',
    title: 'LLM Smart Router',
    sub: 'Claude 3.5 Sonnet / GPT-4o Fallback',
    status: 'idle',
    latency: '120 ms',
    tokens: '1,420 tokens',
    config: {
      primaryModel: 'claude-3-5-sonnet',
      fallbackModel: 'gpt-4o-mini',
      temperature: 0.2,
      maxOutputTokens: 1024
    }
  },
  {
    id: 'node-5',
    type: 'guardrail',
    title: 'Enterprise Guardrails',
    sub: 'PII Scrubbing & Toxicity Check',
    status: 'idle',
    latency: '11 ms',
    config: {
      piiMasking: true,
      jailbreakDetection: 'High Sensitivity',
      hallucinationScore: '> 0.88'
    }
  },
  {
    id: 'node-6',
    type: 'stream',
    title: 'Client SSE Stream',
    sub: 'Sub-millisecond Token Push',
    status: 'idle',
    latency: '2 ms',
    config: {
      compression: 'gzip',
      protocol: 'Server-Sent Events'
    }
  }
];

export const PipelineCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<NodeItem[]>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-4');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testPrompt, setTestPrompt] = useState<string>("Summarize enterprise security SLA and compute query latency metrics.");
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Synapse Pipeline Studio initialized.',
    '[READY] All 6 execution nodes linked and healthy.',
    '[IDLE] Awaiting prompt execution trigger...'
  ]);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  const runPipelineExecution = () => {
    setIsRunning(true);
    setLogs((prev) => [
      ...prev,
      `[EXECUTE] Triggered pipeline execution with input: "${testPrompt.slice(0, 30)}..."`,
      '[NODE: 1] Data Ingestion completed in 8ms.',
      '[NODE: 2] Semantic Tokenizer split 1,420 tokens.',
      '[NODE: 3] Hybrid Retrieval fetched Top 8 vectors from Pinecone.'
    ]);

    // Animate nodes sequentially
    setNodes((prev) =>
      prev.map((n) => (n.id === 'node-1' || n.id === 'node-2' || n.id === 'node-3' ? { ...n, status: 'success' } : { ...n, status: 'running' }))
    );

    setTimeout(() => {
      setNodes((prev) =>
        prev.map((n) => ({ ...n, status: 'success' }))
      );
      setIsRunning(false);
      setLogs((prev) => [
        ...prev,
        '[NODE: 4] LLM Smart Router dispatched to Claude 3.5 Sonnet (TTFT: 110ms).',
        '[NODE: 5] PII Scrubbing passed. Hallucination check 0.96 clean.',
        '[NODE: 6] Response stream closed successfully.',
        '[SUCCESS] Full pipeline execution time: 177ms | Cost: $0.0028'
      ]);
    }, 1800);
  };

  const updateConfig = (key: string, value: any) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedNodeId) {
          return {
            ...n,
            config: {
              ...n.config,
              [key]: value
            }
          };
        }
        return n;
      })
    );
  };

  return (
    <section id="canvas" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <IconZap className="w-4 h-4" /> Visual DAG Engine
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Interactive Pipeline Studio
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Inspect, tweak, and test your multi-stage AI workflow in real-time. Click any node to customize parameters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNodes(INITIAL_NODES);
              setLogs(['[SYSTEM] Reset pipeline to default configuration.']);
            }}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <IconRefresh className="w-3.5 h-3.5" /> Reset DAG
          </button>
          <button
            onClick={runPipelineExecution}
            disabled={isRunning}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all font-mono ${
              isRunning
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:opacity-95 shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <IconPlay className="w-4 h-4 fill-current" />
                <span>Run Test Execution</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual Graph Canvas (8 cols) */}
        <div className="lg:col-span-8 bg-[#0B0F19] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden bg-linear-grid">
          {/* Canvas Top Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-white font-semibold">dag_prod_rag_v3.json</span>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>6 Active Nodes</span>
              <span>Target Latency: &lt; 200ms</span>
            </div>
          </div>

          {/* Test Prompt Input Box */}
          <div className="mt-4 mb-6 p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="text-xs text-cyan-400 font-mono font-semibold flex items-center gap-1.5 shrink-0">
              <span>TEST INPUT:</span>
            </div>
            <input
              type="text"
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              placeholder="Enter prompt query to test routing..."
            />
          </div>

          {/* DAG Visual Nodes List */}
          <div className="space-y-3.5 relative">
            {/* Connector Beam Line */}
            <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500 via-teal-500 to-emerald-500/40 z-0 hidden sm:block" />

            {nodes.map((node, idx) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative z-10 p-4 rounded-xl transition-all cursor-pointer border backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-slate-900/95 border-cyan-500 ring-1 ring-cyan-500/50 shadow-lg shadow-cyan-950/50'
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Step Number Badge */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-colors ${
                        node.status === 'running'
                          ? 'bg-cyan-500 text-slate-950 animate-pulse'
                          : node.status === 'success'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{node.title}</span>
                        {node.type === 'router' && (
                          <span className="px-2 py-0.2 text-[10px] bg-cyan-950 text-cyan-300 rounded border border-cyan-800/60 font-mono">
                            SMART ROUTE
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{node.sub}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {node.tokens && (
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {node.tokens}
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-cyan-400 font-medium bg-slate-950/80 px-2.5 py-1 rounded border border-cyan-950">
                      {node.latency}
                    </span>
                    {node.status === 'success' && (
                      <IconCheckCircle className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Live Execution Logs Stream */}
          <div className="mt-6 p-4 rounded-xl bg-[#07090E] border border-slate-800 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-slate-400">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
                <IconTerminal className="w-3.5 h-3.5 text-cyan-400" /> Live Execution Log Stream
              </div>
              <span className="text-[10px] text-slate-500">WebSocket Connected</span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto font-mono text-[11px]">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-slate-600 select-none">&gt;</span>
                  <span
                    className={`${
                      log.includes('[SUCCESS]')
                        ? 'text-emerald-400 font-semibold'
                        : log.includes('[EXECUTE]')
                        ? 'text-cyan-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Node Inspector & Config Panel (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
              <IconSliders className="w-4 h-4 text-cyan-400" /> Node Inspector
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {selectedNode.id}
            </span>
          </div>

          <div className="mb-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 font-mono">{selectedNode.title}</div>
            <p className="text-xs text-slate-400 mt-0.5">{selectedNode.sub}</p>
          </div>

          {/* Parameters Form Controls */}
          <div className="space-y-4 text-xs font-mono">
            {Object.entries(selectedNode.config).map(([key, value]) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-slate-400 text-[11px] capitalize">
                  {key.replace(/([A-Z])/g, ' $1')}
                </label>
                {typeof value === 'boolean' ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-300">State: {value ? 'Enabled' : 'Disabled'}</span>
                    <button
                      onClick={() => updateConfig(key, !value)}
                      className={`px-3 py-1 rounded text-[10px] font-bold transition-colors ${
                        value ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {value ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ) : typeof value === 'number' ? (
                  <input
                    type="number"
                    step="0.05"
                    value={value}
                    onChange={(e) => updateConfig(key, parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={value as string}
                    onChange={(e) => updateConfig(key, e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Quick Metrics Badge */}
          <div className="mt-6 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Execution Latency:</span>
              <span className="text-emerald-400 font-mono font-bold">{selectedNode.latency}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Guardrail Policy:</span>
              <span className="text-slate-200 font-mono font-semibold">SOC2 + HIPAA</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Cold Start:</span>
              <span className="text-cyan-400 font-mono">0.00 ms (Hot)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
