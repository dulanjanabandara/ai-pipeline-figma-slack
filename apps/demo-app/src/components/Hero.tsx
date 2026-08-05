import React from 'react';
import { IconZap, IconArrowRight, IconActivity, IconShieldCheck, IconDatabase, IconCpu } from './Icons';

interface HeroProps {
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern">
      {/* Subtle Glowing Background Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-teal-500/10 to-indigo-500/0 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-10 right-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Brand/Product Name Hero Display */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 mb-6 text-xs text-slate-300 shadow-xl backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono uppercase tracking-widest text-cyan-400 font-bold">SYNAPSE AI ENGINE</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">Next-Gen Multi-Model AI Orchestration</span>
        </div>

        {/* One Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08] max-w-5xl mx-auto">
          Orchestrate, evaluate, and deploy sub-millisecond{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            AI pipelines at scale.
          </span>
        </h1>

        {/* One Supporting Sentence */}
        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          A high-throughput orchestration runtime for LLM routing, chunking, hybrid vector retrieval, and enterprise guardrail enforcement.
        </p>

        {/* One CTA Group */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 group"
          >
            <span>Deploy Pipeline Studio</span>
            <IconArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#canvas"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 backdrop-blur-md"
          >
            <IconZap className="w-4 h-4 text-cyan-400" />
            <span>Inspect Interactive Execution</span>
          </a>
        </div>

        {/* Real-time Hero Engine Highlights bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/60 text-cyan-400 border border-cyan-800/40">
              <IconZap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Average Latency</div>
              <div className="text-base font-bold font-mono text-white">14.2 ms</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
              <IconDatabase className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Throughput</div>
              <div className="text-base font-bold font-mono text-white">48.5k req/s</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
              <IconShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Guardrail Pass</div>
              <div className="text-base font-bold font-mono text-emerald-400">99.94%</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60 backdrop-blur-sm flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/60 text-amber-400 border border-amber-800/40">
              <IconCpu className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400">Supported Models</div>
              <div className="text-base font-bold font-mono text-white">50+ LLMs & Embeds</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
