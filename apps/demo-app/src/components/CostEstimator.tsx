import React, { useState } from 'react';
import { IconSliders, IconZap, IconCheckCircle } from './Icons';

export const CostEstimator: React.FC = () => {
  const [monthlyReqs, setMonthlyReqs] = useState<number>(2500000); // 2.5 million
  const [avgTokens, setAvgTokens] = useState<number>(1200);
  const [smartRoutingEnabled, setSmartRoutingEnabled] = useState<boolean>(true);

  // Cost calculations (approx raw vs smart routed)
  const totalTokens = (monthlyReqs * avgTokens) / 1000000; // In Millions
  const rawCost = totalTokens * 3.50; // Average blend cost ($3.50 / M tokens)
  const smartRoutedCost = smartRoutingEnabled ? rawCost * 0.38 : rawCost; // 62% savings via caching & tiering
  const monthlySavings = rawCost - smartRoutedCost;

  return (
    <section id="estimator" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-mono mb-3 border border-cyan-800/50">
          <IconSliders className="w-3.5 h-3.5" /> ROI & Smart Routing Simulator
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Reduce Model Spend by up to <span className="text-cyan-400">62%</span>
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Synapse automatically caches context windows, routes low-complexity prompts to smaller models, and deduplicates embeddings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0B0F19] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
        {/* Sliders Input Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Monthly Requests Slider */}
          <div>
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Monthly Request Volume</span>
              <span className="text-cyan-400 font-extrabold text-sm">{(monthlyReqs / 1000000).toFixed(1)} Million reqs</span>
            </div>
            <input
              type="range"
              min="500000"
              max="20000000"
              step="500000"
              value={monthlyReqs}
              onChange={(e) => setMonthlyReqs(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Average Tokens per Request */}
          <div>
            <div className="flex justify-between items-center mb-2 font-mono text-xs">
              <span className="text-slate-300 font-bold uppercase tracking-wider">Average Tokens / Request</span>
              <span className="text-teal-400 font-extrabold text-sm">{avgTokens} tokens</span>
            </div>
            <input
              type="range"
              min="200"
              max="8000"
              step="200"
              value={avgTokens}
              onChange={(e) => setAvgTokens(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-400"
            />
          </div>

          {/* Smart Routing Toggle */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/50">
                <IconZap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-mono">Synapse Smart Cascade Routing</h4>
                <p className="text-xs text-slate-400">Semantic Caching + Dynamic Model Tiering</p>
              </div>
            </div>

            <button
              onClick={() => setSmartRoutingEnabled(!smartRoutingEnabled)}
              className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                smartRoutingEnabled
                  ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
              }`}
            >
              {smartRoutingEnabled ? 'ACTIVE' : 'DISABLED'}
            </button>
          </div>
        </div>

        {/* Output Cost Comparison Card */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-700/80 rounded-2xl p-6 text-center relative overflow-hidden">
          <div className="text-xs text-slate-400 uppercase font-mono tracking-wider mb-2">Estimated Monthly Model Spend</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-white tracking-tight">
            ${smartRoutedCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            <span className="text-xs text-slate-400 font-sans font-normal"> /mo</span>
          </div>

          {smartRoutingEnabled && (
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-mono font-bold">
              <IconCheckCircle className="w-4 h-4" />
              Saving ~${monthlySavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} / month
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-800 text-left space-y-2 text-xs text-slate-300 font-mono">
            <div className="flex justify-between">
              <span className="text-slate-400">Raw API Spend:</span>
              <span className="line-through text-slate-500">${rawCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cache Hit Rate:</span>
              <span className="text-cyan-400">42.1%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">P99 Latency Reduction:</span>
              <span className="text-emerald-400">-110ms</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
