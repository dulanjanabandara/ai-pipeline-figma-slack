import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PipelineCanvas } from './components/PipelineCanvas';
import { Observability } from './components/Observability';
import { CostEstimator } from './components/CostEstimator';
import { Integrations } from './components/Integrations';
import { Footer } from './components/Footer';

export function App() {
  const scrollToStudio = () => {
    const el = document.getElementById('canvas');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Header Navigation */}
      <Navbar onOpenStudio={scrollToStudio} />

      <main className="flex-grow">
        {/* Hero Section with Brand Focus and Core CTAs */}
        <Hero onExploreClick={scrollToStudio} />

        {/* Visual Pipeline DAG Canvas & Interactive Inspector */}
        <PipelineCanvas />

        {/* Real-Time Observability & Waterfall Traces */}
        <Observability />

        {/* Cost & Latency ROI Estimator Tool */}
        <CostEstimator />

        {/* Enterprise Integrations Grid */}
        <Integrations />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
