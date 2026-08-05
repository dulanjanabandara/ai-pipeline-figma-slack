export type NodeType = 'ingest' | 'transform' | 'llm' | 'guardrail' | 'tool' | 'output';

export interface PipelineNode {
  id: string;
  name: string;
  type: NodeType;
  status: 'idle' | 'running' | 'success' | 'error';
  latencyMs: number;
  tokensUsed?: number;
  config: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    endpoint?: string;
    fallbackNodeId?: string;
    promptTemplate?: string;
    validationSchema?: string;
  };
  x: number;
  y: number;
}

export interface PipelineEdge {
  id: string;
  from: string;
  to: string;
  active: boolean;
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  nodeId: string;
  nodeName: string;
  level: 'info' | 'warn' | 'success' | 'error';
  message: string;
  latency?: number;
}

export interface PipelinePreset {
  id: string;
  title: string;
  description: string;
  category: string;
  nodes: PipelineNode[];
  edges: PipelineEdge[];
}
