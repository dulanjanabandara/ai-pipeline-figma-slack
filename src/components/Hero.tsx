import React from 'react';

interface HeroProps {
  onStartBuilding: () => void;
  onLoadPreset: () => void;
  onViewMetrics: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartBuilding,
  onLoadPreset,
  onViewMetrics
}) => {
  return (
    <section className="relative overflow-hidden bg-[#070A0F] py-16 px-6 lg:px-12 border-b border-cyan-500/20 shadow-2xl">
      {/* Ambient background glow grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a15_1px,transparent_1px),linear-gradient(to_bottom,#0f172a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-blue-600/10 to-emerald-500/20 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center justify-center space-y-6">
        
        {/* Brand/Product Name HERO LEVEL */}
        <div className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-widest uppercase shadow-inner">
          <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>NEXUS PIPELINE AI v3.8 • AUTONOMOUS EXECUTION ENGINE</span>
        </div>

        {/* One Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-100 max-w-4xl leading-none">
          Automate, Train, and Deploy Autonomous AI Pipelines at <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Hyperscale</span>
        </h1>

        {/* One Supporting Sentence */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl font-normal leading-relaxed">
          Unify data ingestion, vector embeddings, fine-tuning, and edge model deployment into a single visual execution graph with real-time telemetry.
        </p>

        {/* One CTA Group */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartBuilding}
            className="px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold rounded-lg shadow-lg shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 text-sm"
          >
            <span>Launch Interactive Canvas</span>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          <button
            onClick={onLoadPreset}
            className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-cyan-300 font-semibold rounded-lg border border-cyan-500/30 transition-all text-sm flex items-center space-x-2 shadow-md hover:border-cyan-400"
          >
            <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Explore Preset Workflows</span>
          </button>

          <button
            onClick={onViewMetrics}
            className="px-6 py-3.5 bg-slate-900/40 hover:bg-slate-800 text-slate-300 font-medium rounded-lg border border-slate-800 hover:border-slate-700 transition text-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4 stroke-current fill-none" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>View Live System Telemetry</span>
          </button>
        </div>

        {/* Live system indicators bar */}
        <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl text-left border-t border-slate-800/80 mt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Cluster Throughput</p>
            <p className="text-lg font-bold text-slate-200 font-mono">142,500 <span className="text-xs text-cyan-400 font-sans">tok/s</span></p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">GPU Memory Active</p>
            <p className="text-lg font-bold text-slate-200 font-mono">76.4 <span className="text-xs text-cyan-400 font-sans">GB / 80GB</span></p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Pipeline Latency</p>
            <p className="text-lg font-bold text-slate-200 font-mono">18.4 <span className="text-xs text-emerald-400 font-sans">ms</span></p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">Accuracy Score</p>
            <p className="text-lg font-bold text-slate-200 font-mono">98.92% <span className="text-xs text-emerald-400 font-sans">RAGAS</span></p>
          </div>
        </div>
      </div>
    </section>
  );
};
