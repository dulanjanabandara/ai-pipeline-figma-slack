export type NodeStatus = 'idle' | 'running' | 'completed' | 'failed' | 'queued';

export interface PipelineNode {
  id: string;
  name: string;
  category: 'ingestion' | 'transformation' | 'embedding' | 'training' | 'evaluation' | 'deployment';
  status: NodeStatus;
  progress: number;
  icon: string;
  description: string;
  config: Record<string, string | number | boolean>;
  inputSchema: string;
  outputSchema: string;
  latencyMs?: number;
  memoryUsageMb?: number;
}

export interface PipelinePreset {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: PipelineNode[];
  estimatedCost: string;
  targetModel: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  nodeId?: string;
  nodeName?: string;
  message: string;
}

export interface RunMetrics {
  gpuUtilization: number;
  throughputTokensSec: number;
  activeNodes: number;
  totalDurationSec: number;
  valLoss: number[];
  trainingEpoch: number;
  totalEpochs: number;
}