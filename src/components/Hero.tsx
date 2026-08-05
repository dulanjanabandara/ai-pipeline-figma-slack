import React from 'react';

interface HeroProps {
  onStartDemo: () => void;
  onScrollToGraph: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartDemo, onScrollToGraph }) => {
  return (
    <section className="relative overflow-hidden py-16 px-6 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
      {/* Glowing atmospheric backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/4 right-10 w-[400px] h-[200px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {/* Brand identity expression */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 shadow-inner font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-extrabold tracking-wider text-emerald-400 uppercase">NEXUS AI PIPELINE PLATFORM</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Autonomous Graph Orchestration</span>
        </div>

        {/* Brand/Product Hero Heading */}
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-200 to-cyan-300 uppercase">
          NEXUS PIPELINE
        </h1>

        {/* Headline */}
        <p className="text-xl sm:text-2xl font-semibold text-slate-200 max-w-3xl mx-auto leading-snug">
          Orchestrate multi-modal agentic AI workflows with deterministic latency and automatic fallback guards.
        </p>

        {/* Supporting sentence */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Transform raw vector embeddings, structured API inputs, and LLM reasoning steps into production-ready execution chains in seconds.
        </p>

        {/* CTA Group */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartDemo}
            className="px-6 py-3 rounded-lg font-bold text-sm bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Run Live Pipeline Simulation
          </button>

          <button
            onClick={onScrollToGraph}
            className="px-6 py-3 rounded-lg font-semibold text-sm bg-slate-900 text-slate-200 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 transition flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Inspect Node Graph Canvas
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Avg Latency: <strong className="text-emerald-400 font-semibold">142ms</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
};
