import React, { useState, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PipelineCanvas } from './components/PipelineCanvas';
import { NodeInspector } from './components/NodeInspector';
import { ExecutionConsole } from './components/ExecutionConsole';
import { PipelinePresetsModal } from './components/PipelinePresets';
import { PipelineNode, PipelineEdge, ExecutionLog, PipelinePreset } from './types';

const PRESETS: PipelinePreset[] = [
  {
    id: 'rag-agent',
    title: 'RAG Document Intelligence & Fallback Router',
    category: 'Enterprise RAG',
    description: 'Ingests PDF/Text documents, generates vector embeddings, routes through Claude 3.5 with fallback to DeepSeek logic guardrails.',
    nodes: [
      {
        id: 'n1',
        name: 'Document Webhook Ingestion',
        type: 'ingest',
        status: 'idle',
        latencyMs: 12,
        config: { endpoint: 'https://api.nexus.ai/v1/ingest/docs' },
        x: 40,
        y: 180,
      },
      {
        id: 'n2',
        name: 'Vector Embeddings Engine',
        type: 'transform',
        status: 'idle',
        latencyMs: 45,
        config: { model: 'text-embedding-3-large' },
        x: 300,
        y: 80,
      },
      {
        id: 'n3',
        name: 'Agentic LLM Router',
        type: 'llm',
        status: 'idle',
        latencyMs: 120,
        config: { model: 'claude-3-5-sonnet', temperature: 0.2, promptTemplate: 'Extract technical requirements and output valid JSON.' },
        x: 300,
        y: 280,
      },
      {
        id: 'n4',
        name: 'Guardrail Schema Validator',
        type: 'guardrail',
        status: 'idle',
        latencyMs: 18,
        config: { validationSchema: 'Strict JSON Schema v4' },
        x: 560,
        y: 180,
      },
      {
        id: 'n5',
        name: 'Production Webhook Sink',
        type: 'output',
        status: 'idle',
        latencyMs: 8,
        config: { endpoint: 'https://app.nexus.ai/v1/outputs/callback' },
        x: 820,
        y: 180,
      },
    ],
    edges: [
      { id: 'e1', from: 'n1', to: 'n2', active: false },
      { id: 'e2', from: 'n1', to: 'n3', active: false },
      { id: 'e3', from: 'n2', to: 'n4', active: false },
      { id: 'e4', from: 'n3', to: 'n4', active: false },
      { id: 'e5', from: 'n4', to: 'n5', active: false },
    ],
  },
  {
    id: 'financial-fraud',
    title: 'Realtime Fraud & Compliance Monitoring',
    category: 'FinTech',
    description: 'High-speed transaction event ingestion, anomaly score validation, and automated compliance policy triggering.',
    nodes: [
      {
        id: 'fn1',
        name: 'Stream Ingestion (Kafka)',
        type: 'ingest',
        status: 'idle',
        latencyMs: 8,
        config: { endpoint: 'kafka://stream.finance.internal/tx' },
        x: 40,
        y: 180,
      },
      {
        id: 'fn2',
        name: 'Feature Extractor',
        type: 'transform',
        status: 'idle',
        latencyMs: 15,
        config: { endpoint: 'internal://features/v2' },
        x: 300,
        y: 180,
      },
      {
        id: 'fn3',
        name: 'Risk Agent Evaluator',
        type: 'llm',
        status: 'idle',
        latencyMs: 85,
        config: { model: 'gpt-4o-mini', temperature: 0.0, promptTemplate: 'Evaluate fraud score 0.0 to 1.0 based on anomaly vectors.' },
        x: 560,
        y: 180,
      },
      {
        id: 'fn4',
        name: 'Block Trigger Sink',
        type: 'output',
        status: 'idle',
        latencyMs: 5,
        config: { endpoint: 'https://api.nexus.ai/v1/fraud/action' },
        x: 820,
        y: 180,
      },
    ],
    edges: [
      { id: 'fe1', from: 'fn1', to: 'fn2', active: false },
      { id: 'fe2', from: 'fn2', to: 'fn3', active: false },
      { id: 'fe3', from: 'fn3', to: 'fn4', active: false },
    ],
  }
];

export const App: React.FC = () => {
  const [activePreset, setActivePreset] = useState<PipelinePreset>(PRESETS[0]);
  const [nodes, setNodes] = useState<PipelineNode[]>(PRESETS[0].nodes);
  const [edges, setEdges] = useState<PipelineEdge[]>(PRESETS[0].edges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('n3');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isPresetsOpen, setIsPresetsOpen] = useState<boolean>(false);

  const graphRef = useRef<HTMLDivElement>(null);

  const handleSelectPreset = (preset: PipelinePreset) => {
    setActivePreset(preset);
    setNodes(preset.nodes);
    setEdges(preset.edges);
    setSelectedNodeId(preset.nodes[0]?.id || null);
    setLogs([]);
  };

  const handleUpdateNodeConfig = (nodeId: string, updatedConfig: Partial<PipelineNode['config']>) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, config: { ...node.config, ...updatedConfig } } : node
      )
    );
  };

  const handleRunPipeline = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setLogs([]);

    const addLog = (nodeId: string, nodeName: string, level: ExecutionLog['level'], message: string, latency?: number) => {
      const newLog: ExecutionLog = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 }),
        nodeId,
        nodeName,
        level,
        message,
        latency,
      };
      setLogs((prev) => [newLog, ...prev]);
    };

    addLog('system', 'GRAPH RUNNER', 'info', 'Initializing pipeline graph execution...');

    // Sequentially simulate node execution
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      
      // Mark active edge
      setEdges((prev) =>
        prev.map((e) => (e.to === node.id ? { ...e, active: true } : e))
      );

      // Set node to running
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'running' } : n))
      );

      addLog(node.id, node.name, 'info', `Executing node transformation payload...`);

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Set node to success
      setNodes((prev) =>
        prev.map((n) => (n.id === node.id ? { ...n, status: 'success' } : n))
      );

      addLog(node.id, node.name, 'success', `Node execution completed successfully`, node.latencyMs);
    }

    addLog('system', 'GRAPH RUNNER', 'success', 'All pipeline nodes finished with status 200 OK.');
    setIsExecuting(false);
  };

  const handleResetGraph = () => {
    setNodes(activePreset.nodes.map((n) => ({ ...n, status: 'idle' })));
    setEdges(activePreset.edges.map((e) => ({ ...e, active: false })));
    setLogs([]);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || null;

  const scrollToGraph = () => {
    graphRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans border-t-2 border-cyan-500">
      <Navbar
        activePresetName={activePreset.title}
        isExecuting={isExecuting}
        onRunPipeline={handleRunPipeline}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onReset={handleResetGraph}
      />

      <main className="grow flex flex-col">
        {/* Single Composition Hero Section */}
        <Hero
          onStartDemo={handleRunPipeline}
          onScrollToGraph={scrollToGraph}
        />

        {/* Interactive Canvas & Workspace Section */}
        <section ref={graphRef} className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-100 flex items-center gap-2 uppercase tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow shadow-cyan-400/50" />
                Interactive DAG Orchestrator
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Visual representation of active nodes, logic branches, and telemetry metrics.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunPipeline}
                disabled={isExecuting}
                className="px-3.5 py-1.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-medium transition"
              >
                ⚡ Trigger Fast Dry-Run
              </button>
            </div>
          </div>

          {/* Main Visual Canvas & Node Inspector Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PipelineCanvas
                nodes={nodes}
                edges={edges}
                selectedNodeId={selectedNodeId}
                onSelectNode={(id) => setSelectedNodeId(id)}
              />
            </div>

            <div className="h-[520px]">
              <NodeInspector
                node={selectedNode}
                onUpdateNodeConfig={handleUpdateNodeConfig}
              />
            </div>
          </div>

          {/* Bottom Telemetry Console */}
          <div className="h-56">
            <ExecutionConsole logs={logs} onClearLogs={() => setLogs([])} />
          </div>
        </section>
      </main>

      {/* Preset Blueprints Modal */}
      {isPresetsOpen && (
        <PipelinePresetsModal
          presets={PRESETS}
          activePresetId={activePreset.id}
          onSelectPreset={handleSelectPreset}
          onClose={() => setIsPresetsOpen(false)}
        />
      )}

      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        NEXUS AI PIPELINE CORE ENGINE v3.4 // Self-contained Interactive Visual DAG Builder
      </footer>
    </div>
  );
};

export default App;
