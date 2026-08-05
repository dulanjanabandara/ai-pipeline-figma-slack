import React, { useState } from 'react';
import { IconDatabase, IconCpu, IconShieldCheck, IconLayers } from './Icons';

interface Integration {
  name: string;
  category: 'Vector DB' | 'LLM Provider' | 'Observability' | 'Storage';
  desc: string;
  status: 'Native' | 'Partner' | 'Beta';
}

const INTEGRATIONS: Integration[] = [
  { name: 'Pinecone', category: 'Vector DB', desc: 'Serverless vector retrieval with hybrid dense & sparse vectors.', status: 'Native' },
  { name: 'Qdrant', category: 'Vector DB', desc: 'High-performance vector search engine with payload filtering.', status: 'Native' },
  { name: 'Anthropic Claude', category: 'LLM Provider', desc: 'Full support for Claude 3.5 Sonnet, Haiku, and Opus reasoning.', status: 'Native' },
  { name: 'OpenAI GPT-4o', category: 'LLM Provider', desc: 'Structured JSON outputs & multimodal vision streaming.', status: 'Native' },
  { name: 'DeepSeek R1', category: 'LLM Provider', desc: 'Cost-effective open reasoning model with step-by-step trace.', status: 'Native' },
  { name: 'Datadog', category: 'Observability', desc: 'Telemetry exporter for metrics, APM spans, and cost tags.', status: 'Partner' },
  { name: 'Snowflake', category: 'Storage', desc: 'Direct data warehouse extraction & CDC stream listeners.', status: 'Partner' },
  { name: 'Weights & Biases', category: 'Observability', desc: 'Model evaluation benchmarks and dataset version tracking.', status: 'Partner' }
];

export const Integrations: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'LLM Provider', 'Vector DB', 'Observability', 'Storage'];

  const filtered = filter === 'All' 
    ? INTEGRATIONS 
    : INTEGRATIONS.filter((item) => item.category === filter);

  return (
    <section id="integrations" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <IconLayers className="w-4 h-4" /> Ecosystem & Connectors
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Native Enterprise Integrations
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Connect your existing data stores, model endpoints, and observability stack in 1-click.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 rounded-lg border transition-all ${
                filter === cat
                  ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.name}
            className="p-5 rounded-2xl bg-[#0B0F19] border border-slate-800 hover:border-slate-700 hover:bg-slate-900/60 transition-all flex flex-col justify-between group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/50">
                  {item.category}
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                  {item.status}
                </span>
              </div>
              <h3 className="text-base font-bold text-white font-mono group-hover:text-cyan-400 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Zero-latency hook</span>
              <span className="text-cyan-400 group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
