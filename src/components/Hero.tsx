import { ArrowRight, Terminal, Share2, Activity } from 'lucide-react';
import CarbonGlobe from './CarbonGlobe';

const Hero = () => {
  return (
    <div className="relative pt-44 pb-24 lg:pt-60 lg:pb-40 overflow-hidden min-h-screen flex items-center">
      {/* Background Globe Wrapper - Fully visible */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none translate-y-24 md:translate-y-32 opacity-90">
        <div className="w-full max-w-6xl">
          <CarbonGlobe />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/50 border border-slate-700/50 text-emerald-400 text-xs font-bold mb-10 backdrop-blur-md animate-fade-in shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="uppercase tracking-[0.2em]">Live: 14.2k Nodes Connected</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white mb-8 leading-[1.05] animate-slide-up drop-shadow-2xl">
          THE WORLD'S FIRST <br />
          <span className="text-gradient">CARBON-AWARE</span> GRID
        </h1>
        
        <p className="max-w-3xl mx-auto text-xl text-slate-400 mb-12 leading-relaxed animate-fade-in delay-200 font-medium drop-shadow-lg">
          Stop wasting idle CPU cycles. ComputePool orchestrates decentralized infrastructure 
          with trustless verification and real-time carbon intensity tracking.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in delay-300">
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-emerald-500 text-slate-950 px-10 py-5 rounded-2xl font-black text-lg hover:bg-emerald-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all active:scale-95 group">
            START CONTRIBUTING
            <Terminal className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          </button>
          
          <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-slate-900/80 text-white px-10 py-5 rounded-2xl font-black text-lg border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800 transition-all active:scale-95">
            <Share2 className="h-5 w-5 text-emerald-400" />
            EXPLORE NETWORK
          </button>
        </div>

        {/* Floating stats cards positioned below the main quote */}
        <div className="mt-24 flex flex-wrap justify-center gap-6 animate-fade-in delay-500">
           {[
             { label: 'Active Jobs', val: '2,481' },
             { label: 'Network Hash', val: '840 TH/s' },
             { label: 'CO2 Saved', val: '4.2 Tons' }
           ].map((stat) => (
             <div key={stat.label} className="bg-slate-950/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-3xl min-w-[180px] shadow-2xl border-t-emerald-500/50">
               <p className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
               <p className="text-3xl font-black text-white">{stat.val}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
