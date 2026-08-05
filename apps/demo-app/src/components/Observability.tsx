import React, { useState } from 'react';
import { IconActivity, IconShieldCheck, IconCpu, IconDatabase } from './Icons';

export const Observability: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');

  return (
    <section id="observability" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider mb-2">
            <IconActivity className="w-4 h-4" /> Telemetry & Tracing
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Real-Time Observability Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Sub-millisecond trace breakdowns, token cost attribution, and hallucination scores across every model execution.
          </p>
        </div>

        {/* Time Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
          {(['1h', '24h', '7d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">p99 Request Latency</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">142.8 <span className="text-xs text-slate-400 font-sans font-normal">ms</span></h3>
            </div>
            <span className="px-2 py-1 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
              -18.4% vs baseline
            </span>
          </div>
          {/* Micro Latency Sparkline Mock Visual */}
          <div className="h-12 flex items-end gap-1 pt-2">
            {[40, 55, 35, 70, 45, 90, 60, 40, 80, 50, 65, 30, 42, 38, 95, 50, 40].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="flex-1 bg-gradient-to-t from-cyan-900 to-cyan-400 rounded-t-sm hover:opacity-100 transition-opacity opacity-80"
              />
            ))}
          </div>
        </div>

        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Token Throughput</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">8.4M <span className="text-xs text-slate-400 font-sans font-normal">tokens/min</span></h3>
            </div>
            <span className="px-2 py-1 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-mono">
              Active Stream
            </span>
          </div>
          <div className="h-12 flex items-end gap-1 pt-2">
            {[30, 45, 60, 75, 80, 85, 90, 80, 70, 85, 95, 88, 92, 85, 90, 96, 100].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="flex-1 bg-gradient-to-t from-teal-900 to-teal-400 rounded-t-sm opacity-80"
              />
            ))}
          </div>
        </div>

        <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Guardrail Shield</p>
              <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">99.98% <span className="text-xs text-slate-400 font-sans font-normal">clean</span></h3>
            </div>
            <span className="px-2 py-1 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">
              0 PII Leaks
            </span>
          </div>
          <div className="h-12 flex items-end gap-1 pt-2">
            {[100, 100, 100, 98, 100, 100, 100, 100, 100, 99, 100, 100, 100, 100, 100, 100, 100].map((h, idx) => (
              <div
                key={idx}
                style={{ height: `${h}%` }}
                className="flex-1 bg-gradient-to-t from-emerald-900 to-emerald-400 rounded-t-sm opacity-80"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Trace Waterfall Diagram */}
      <div className="bg-[#0B0F19] border border-slate-800 rounded-2xl p-6 shadow-2xl font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-cyan-400">
            <IconCpu className="w-4 h-4" /> Execution Trace Waterfall (Trace ID: #tr_8f9210a4)
          </div>
          <span className="text-slate-400 text-[11px]">Total Request Duration: <strong className="text-white">168ms</strong></span>
        </div>

        <div className="mt-6 space-y-4 text-xs">
          {/* Trace Bar 1 */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>1. Ingest JSON & Authentication</span>
              <span className="text-slate-200">12ms (0ms - 12ms)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '7%' }} className="bg-cyan-500 h-full rounded-full" />
            </div>
          </div>

          {/* Trace Bar 2 */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>2. Vector Embeddings & Hybrid Search (Pinecone)</span>
              <span className="text-slate-200">28ms (12ms - 40ms)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '7%' }} className="invisible" />
              <div style={{ width: '17%' }} className="bg-teal-400 h-full rounded-full" />
            </div>
          </div>

          {/* Trace Bar 3 */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>3. Smart Model Dispatch & TTFT (Claude 3.5 Sonnet)</span>
              <span className="text-slate-200">110ms (40ms - 150ms)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '24%' }} className="invisible" />
              <div style={{ width: '65%' }} className="bg-emerald-400 h-full rounded-full" />
            </div>
          </div>

          {/* Trace Bar 4 */}
          <div>
            <div className="flex justify-between text-slate-400 mb-1 text-[11px]">
              <span>4. Toxicity & Guardrail Post-Process</span>
              <span className="text-slate-200">18ms (150ms - 168ms)</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden flex">
              <div style={{ width: '89%' }} className="invisible" />
              <div style={{ width: '11%' }} className="bg-indigo-400 h-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
