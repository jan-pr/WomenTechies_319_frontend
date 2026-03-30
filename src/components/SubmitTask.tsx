import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Zap, Search, CheckCircle, ArrowRight, ArrowLeft, Loader2, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';

const SubmitTask = () => {
  const [step, setStep] = useState(1);
  const [cpu, setCpu] = useState(2);
  const [ram, setRam] = useState(4);
  const [isFinding, setIsFinding] = useState(false);
  const [foundNodes, setFoundNodes] = useState(0);

  // Real-time carbon offset calculation (simulated)
  const carbonOffset = ((cpu * 0.42) + (ram * 0.15)).toFixed(2);

  useEffect(() => {
    if (isFinding) {
      const interval = setInterval(() => {
        setFoundNodes(prev => (prev < 12 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isFinding]);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 items-start">
        
        {/* Left Side: Multi-step Form */}
        <div className="flex-1 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: "33%" }}
                animate={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="mb-10 flex justify-between items-center">
              <h2 className="text-3xl font-black text-white tracking-tight">
                {step === 1 && "Basic Configuration"}
                {step === 2 && "Resource Allocation"}
                {step === 3 && "Optimization"}
              </h2>
              <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
                Step {step} of 3
              </span>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Task Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Model Training v2"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Docker Image URL</label>
                    <div className="relative">
                      <Database className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <input 
                        type="text" 
                        placeholder="docker.io/library/alpine:latest"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-mono text-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-10"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Required CPU Cores</label>
                      <span className="text-3xl font-black text-white">{cpu} <span className="text-sm text-slate-500 font-bold uppercase">Cores</span></span>
                    </div>
                    <input 
                      type="range" min="1" max="32" value={cpu} 
                      onChange={(e) => setCpu(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">RAM Reservation</label>
                      <span className="text-3xl font-black text-white">{ram} <span className="text-sm text-slate-500 font-bold uppercase">GB</span></span>
                    </div>
                    <input 
                      type="range" min="1" max="128" value={ram} 
                      onChange={(e) => setRam(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-3xl flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                      <Leaf className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Estimated Carbon Offset</p>
                      <p className="text-2xl font-black text-white">{carbonOffset} kg CO2 <span className="text-xs text-slate-500 font-bold uppercase">/ Hour</span></p>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Priority Level</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['Standard', 'Urgent', 'Instant'].map((p) => (
                        <button key={p} className="bg-white/5 border border-white/10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:border-emerald-500/50 hover:text-white transition-all">
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <div className="flex items-center gap-4 text-emerald-400 mb-4">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-xs font-black uppercase tracking-widest">Pre-Execution Summary</span>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Your task will be distributed across {cpu * 4} optimized mesh nodes. 
                      Estimated completion time is 12m 42s with zero peak-load grid impact.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex justify-between items-center">
              {step > 1 ? (
                <button onClick={prevStep} className="flex items-center gap-3 text-slate-400 hover:text-white font-black text-xs uppercase tracking-widest transition-all">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
              ) : (
                <Link to="/" className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">Cancel</Link>
              )}
              
              {step < 3 ? (
                <button onClick={nextStep} className="bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white transition-all flex items-center gap-3">
                  Next Step <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button 
                  onClick={() => setIsFinding(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  DEPLOY TO MESH
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Side: Simulation Panel */}
        <div className="w-full lg:w-[380px] space-y-8">
          <div className="bg-slate-950/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 overflow-hidden relative group">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Mesh Simulation</h3>
            
            <div className="relative h-64 flex items-center justify-center mb-8">
              {/* Radar Pulse */}
              <div className="absolute w-48 h-48 border border-emerald-500/20 rounded-full animate-ping"></div>
              <div className="absolute w-32 h-32 border border-emerald-500/30 rounded-full animate-ping delay-300"></div>
              <div className="absolute w-16 h-16 border border-emerald-500/40 rounded-full animate-pulse"></div>
              
              <div className="relative z-10 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                {isFinding ? <Loader2 className="h-6 w-6 text-slate-950 animate-spin" /> : <Search className="h-6 w-6 text-slate-950" />}
              </div>

              {/* Simulated Nodes Dots */}
              {isFinding && [...Array(foundNodes)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute w-2 h-2 bg-emerald-400 rounded-full"
                  style={{
                    top: `${Math.random() * 80 + 10}%`,
                    left: `${Math.random() * 80 + 10}%`
                  }}
                />
              ))}
            </div>

            <div className="space-y-4 text-center">
              <p className="text-sm font-black text-white uppercase tracking-widest">
                {isFinding ? "Finding Green Nodes..." : "Ready for Mesh Discovery"}
              </p>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-emerald-500"
                  animate={isFinding ? { width: "100%" } : { width: "0%" }}
                  transition={{ duration: 10 }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                <span>Verified: {foundNodes}</span>
                <span>Latency: 12ms</span>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-slate-900 to-black">
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
              <Zap className="h-5 w-5" />
              <span className="text-xs font-black uppercase tracking-widest">Power Insight</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed font-medium">
              By choosing <span className="text-white">ComputePool</span>, you are preventing 
              the emission of {((cpu + ram) * 1.2).toFixed(1)}kg of carbon compared to traditional 
              hyperscale cloud providers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitTask;
