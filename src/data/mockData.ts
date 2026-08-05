import { PipelinePreset, PipelineNode, LogEntry } from '../types';

export const DEFAULT_PIPELINE_NODES: PipelineNode[] = [
  {
    id: 'node-1',
    name: 'Multi-Source Data Ingestion',
    category: 'ingestion',
    status: 'completed',
    progress: 100,
    icon: 'Database',
    description: 'Ingests unstructured docs, S3 buckets, PostgreSQL tables, and Web Crawls.',
    config: {
      sourceType: 'Hybrid S3 + Postgres',
      chunkSize: 1024,
      overlap: 128,
      deduplication: true
    },
    inputSchema: 'Raw Multi-Format Streams (PDF, HTML, JSON)',
    outputSchema: 'Cleaned Document Chunks v2.4',
    latencyMs: 142,
    memoryUsageMb: 512
  },
  {
    id: 'node-2',
    name: 'Semantic Chunking & Cleansing',
    category: 'transformation',
    status: 'completed',
    progress: 100,
    icon: 'Scissors',
    description: 'Applies token boundary optimization, PII masking, and language filtering.',
    config: {
      piiMasking: true,
      minTokenLength: 32,
      languageFilter: 'en, es, de, fr',
      qualityScoreThreshold: 0.85
    },
    inputSchema: 'Cleaned Document Chunks',
    outputSchema: 'Sanitized Vector Batches',
    latencyMs: 88,
    memoryUsageMb: 820
  },
  {
    id: 'node-3',
    name: 'Dense Vector Embedding',
    category: 'embedding',
    status: 'running',
    progress: 68,
    icon: 'Cpu',
    description: 'Generates high-dimensional embedding vectors using BGE-Large-v1.5.',
    config: {
      modelName: 'bge-large-en-v1.5',
      dimensions: 1024,
      batchSize: 256,
      normalizeEmbeddings: true
    },
    inputSchema: 'Sanitized Vector Batches',
    outputSchema: '1024-d Dense Tensors',
    latencyMs: 310,
    memoryUsageMb: 2450
  },
  {
    id: 'node-4',
    name: 'LoRA Adapter Fine-Tuning',
    category: 'training',
    status: 'queued',
    progress: 0,
    icon: 'Layers',
    description: 'Fine-tunes Llama-3-8B parameter weights using quantized low-rank adaptation.',
    config: {
      baseModel: 'Meta-Llama-3-8B-Instruct',
      loraRank: 64,
      loraAlpha: 128,
      learningRate: 0.0002,
      epochs: 3
    },
    inputSchema: '1024-d Dense Tensors + Target Pairs',
    outputSchema: 'LoRA Weights Adapter (.safetensors)',
    latencyMs: 0,
    memoryUsageMb: 0
  },
  {
    id: 'node-5',
    name: 'RAG Triplet Evaluation',
    category: 'evaluation',
    status: 'idle',
    progress: 0,
    icon: 'BarChart2',
    description: 'Measures Context Precision, Context Recall, Faithfulness, and Answer Relevance.',
    config: {
      evaluatorModel: 'GPT-4o-Mini-Judge',
      sampleRatio: 0.25,
      faithfulnessThreshold: 0.92
    },
    inputSchema: 'Adapter + Test Queries',
    outputSchema: 'RAGAS Performance Diagnostic Score',
    latencyMs: 0,
    memoryUsageMb: 0
  },
  {
    id: 'node-6',
    name: 'vLLM TensorRT Endpoint Deploy',
    category: 'deployment',
    status: 'idle',
    progress: 0,
    icon: 'Zap',
    description: 'Compiles TensorRT-LLM engine and deploys to auto-scaling vLLM server cluster.',
    config: {
      targetGPU: 'NVIDIA H100 SXM5',
      maxNumSeqs: 512,
      gpuMemoryUtilization: 0.90,
      autoScalingMin: 2,
      autoScalingMax: 16
    },
    inputSchema: 'Compiled TensorRT Model',
    outputSchema: 'gRPC / Open-AI Compatible Endpoint',
    latencyMs: 0,
    memoryUsageMb: 0
  }
];

export const PIPELINE_PRESETS: PipelinePreset[] = [
  {
    id: 'preset-rag',
    name: 'Enterprise RAG & Hybrid Vector Indexing',
    category: 'Retrieval Augmented Generation',
    description: 'Automated document ingestion pipeline with hybrid sparse/dense embeddings, chunk deduplication, and vector index sync.',
    estimatedCost: '$0.42 / 1M Tokens',
    targetModel: 'BGE-Large + Qdrant Vector Cluster',
    nodes: DEFAULT_PIPELINE_NODES.slice(0, 3)
  },
  {
    id: 'preset-dpo',
    name: 'Llama-3 Fine-Tuning & DPO Alignment',
    category: 'Model Optimization',
    description: 'End-to-end synthetic preference data generation, QLoRA adapter training, and automated benchmarking.',
    estimatedCost: '$4.80 / Training Hour',
    targetModel: 'Llama-3.1-70B-Instruct-v2',
    nodes: DEFAULT_PIPELINE_NODES
  },
  {
    id: 'preset-agent',
    name: 'Autonomous Agent Tool-Use Evaluator',
    category: 'Agent Benchmarking',
    description: 'Generates synthetic multi-turn tool calling traces and benchmarks model action fidelity against ground truth.',
    estimatedCost: '$1.15 / Run',
    targetModel: 'Claude-3.5-Sonnet-Distilled',
    nodes: [DEFAULT_PIPELINE_NODES[0], DEFAULT_PIPELINE_NODES[3], DEFAULT_PIPELINE_NODES[4], DEFAULT_PIPELINE_NODES[5]]
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  { id: 'log-1', timestamp: '10:42:01.002', level: 'info', nodeId: 'node-1', nodeName: 'Multi-Source Data Ingestion', message: 'Connected to AWS S3 bucket: s3://enterprise-kb-prod-v4/' },
  { id: 'log-2', timestamp: '10:42:03.418', level: 'info', nodeId: 'node-1', nodeName: 'Multi-Source Data Ingestion', message: 'Ingested 42,890 documents (PDF: 30k, HTML: 12.8k).' },
  { id: 'log-3', timestamp: '10:42:05.109', level: 'success', nodeId: 'node-1', nodeName: 'Multi-Source Data Ingestion', message: 'Deduplication completed. Reduced document count by 14.2%.' },
  { id: 'log-4', timestamp: '10:42:06.001', level: 'info', nodeId: 'node-2', nodeName: 'Semantic Chunking & Cleansing', message: 'Starting token-aware boundary chunking (size: 1024, overlap: 128)...' },
  { id: 'log-5', timestamp: '10:42:08.871', level: 'success', nodeId: 'node-2', nodeName: 'Semantic Chunking & Cleansing', message: 'Masked 1,420 PII instances (email, API keys, names).' },
  { id: 'log-6', timestamp: '10:42:09.150', level: 'info', nodeId: 'node-3', nodeName: 'Dense Vector Embedding', message: 'Initializing BGE-Large-v1.5 model on TensorRT GPU cluster...' },
  { id: 'log-7', timestamp: '10:42:12.304', level: 'info', nodeId: 'node-3', nodeName: 'Dense Vector Embedding', message: 'Processing vector batch 142/200 (68% complete, 14,200 tokens/sec)...' }
];