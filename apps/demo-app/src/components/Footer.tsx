import React from 'react';
import { IconZap, IconShieldCheck, IconArrowRight } from './Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#05070B] border-t border-slate-800/80 pt-16 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0B0F19] to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden mb-16 text-center">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
          
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
            Ready to supercharge your AI Pipeline performance?
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
            Get started in under 5 minutes with our visual studio or developer SDK.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-xl shadow-cyan-500/20 hover:opacity-95 transition-all flex items-center gap-2 font-mono">
              <span>Get Free API Key</span>
              <IconArrowRight className="w-4 h-4 text-slate-950" />
            </button>
            <button className="px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition-all font-mono">
              Read Developer Docs
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
                <IconZap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base text-white font-mono tracking-wider">SYNAPSE.AI</span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed mb-4">
              The enterprise orchestration & evaluation runtime for complex LLM workflows, context window management, and zero-data retention pipelines.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <IconShieldCheck className="w-4 h-4 text-emerald-400" /> SOC2 Type II Certified | ISO 27001 | HIPAA
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider font-mono mb-3 text-[11px]">Product</h4>
            <ul className="space-y-2.5">
              <li><a href="#canvas" className="hover:text-cyan-400 transition-colors">Pipeline Studio</a></li>
              <li><a href="#observability" className="hover:text-cyan-400 transition-colors">Live Tracing</a></li>
              <li><a href="#estimator" className="hover:text-cyan-400 transition-colors">Smart Router</a></li>
              <li><a href="#integrations" className="hover:text-cyan-400 transition-colors">Connector Hub</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider font-mono mb-3 text-[11px]">Developers</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Python SDK</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">TypeScript SDK</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">REST API Spec</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">GitHub Repo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase tracking-wider font-mono mb-3 text-[11px]">Company</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Enterprise Security</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Status Page</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-4">
          <div>&copy; {new Date().getFullYear()} Synapse AI Inc. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <span>Cluster Region: us-east-1</span>
            <span>Latency: 12ms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
