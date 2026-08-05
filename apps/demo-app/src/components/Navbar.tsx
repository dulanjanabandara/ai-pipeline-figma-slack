import React from 'react';
import { IconZap, IconActivity, IconSparkles, IconGitBranch } from './Icons';

interface NavbarProps {
  onOpenStudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenStudio }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#07090E]/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-500 p-0.5 shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-[#0B0F19] rounded-[10px] flex items-center justify-center text-cyan-400 font-black text-lg">
              <IconZap className="w-5 h-5 fill-cyan-400/20 stroke-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-white font-mono">SYNAPSE<span className="text-cyan-400">.AI</span></span>
              <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                v3.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 -mt-0.5 hidden sm:block">Enterprise AI Pipeline Engine</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#canvas" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <IconGitBranch className="w-3.5 h-3.5 text-cyan-400" />
            Pipeline Studio
          </a>
          <a href="#observability" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <IconActivity className="w-3.5 h-3.5 text-emerald-400" />
            Live Traces
          </a>
          <a href="#estimator" className="hover:text-cyan-400 transition-colors">
            Cost & Performance
          </a>
          <a href="#integrations" className="hover:text-cyan-400 transition-colors">
            Integrations
          </a>
        </nav>

        {/* Status + CTA */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Cluster: 99.998% Uptime
          </div>

          <button
            onClick={onOpenStudio}
            className="relative group overflow-hidden rounded-lg p-px font-semibold text-xs transition-all shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30 active:scale-95"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative block px-4 py-2 bg-[#0B0F19] rounded-[7px] text-white group-hover:bg-opacity-90 transition-all flex items-center gap-2 font-mono">
              <IconSparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Launch Studio</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
