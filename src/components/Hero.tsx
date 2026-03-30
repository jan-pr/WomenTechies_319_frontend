import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import CarbonGlobe from './CarbonGlobe';

const Hero = () => {
  return (
    <div className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col lg:flex-row items-center justify-between relative">
        
        {/* Left Side: Text Content */}
        <div className="relative z-20 flex-1 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold mb-8 backdrop-blur-md"
          >
            <Activity className="h-4 w-4 animate-pulse" />
            <span className="uppercase tracking-[0.2em]">Global Mesh Online</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-8xl font-light tracking-tight text-white mb-6 leading-tight drop-shadow-2xl"
          >
            Powering the future <br />
            <span className="text-gradient-premium font-bold">Decentralized & Green.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-lg text-lg text-slate-400 mb-10 leading-relaxed font-light drop-shadow-lg"
          >
            Stop wasting idle CPU cycles. ComputePool orchestrates decentralized infrastructure 
            with trustless verification and real-time carbon tracking.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 relative z-30"
          >
            <button className="relative group w-full sm:w-auto overflow-hidden bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-semibold text-sm tracking-widest uppercase hover:bg-emerald-500 hover:text-slate-950 transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.05)] animate-float">
              CONTRIBUTE
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            
            <button className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-semibold text-sm tracking-widest uppercase hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-500 animate-float delay-100">
              EXPLORE
            </button>
          </motion.div>
        </div>

        {/* Right Side: Massive Half Globe Mockup */}
        <div className="absolute -right-1/4 top-1/2 -translate-y-1/2 w-full lg:w-[1200px] h-[1200px] z-0 flex items-center justify-center opacity-80 pointer-events-none">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Subtle Glow behind the half globe */}
            <div className="absolute inset-0 bg-vignette opacity-40 scale-150 pointer-events-none blur-3xl"></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 200 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full h-full"
            >
              <CarbonGlobe />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
