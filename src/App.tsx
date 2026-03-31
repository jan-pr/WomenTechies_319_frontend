import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import NetworkStats from './components/NetworkStats';
import VantaBackground from './components/VantaBackground';
import SubmitTask from './components/SubmitTask';
import ExploreTask from './components/ExploreTask';

function LandingPage() {
  return (
    <>
      <Hero />
      <NetworkStats />
      <Features />
    </>
  );
}

function App() {
  return (
    <Router>
      <VantaBackground>
        <div className="min-h-screen text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-400 relative">
          <Navbar />
          <main className="relative z-10">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/submit" element={<SubmitTask />} />
              <Route path="/explore" element={<ExploreTask />} />
            </Routes>
          </main>

          {/* Dark Minimal Footer */}
          <footer className="bg-slate-950/60 backdrop-blur-md py-20 border-t border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex flex-col items-center md:items-start gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-tighter text-white">
                      COMPUTE<span className="text-emerald-400">POOL</span>
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
                    Decentralized High Performance Computing
                  </p>
                </div>

                <div className="text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] text-center md:text-right">
                  © 2026 ComputePool Protocol <br />
                  All Nodes Verified • Carbon Neutral Ops
                </div>
              </div>
            </div>
          </footer>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </VantaBackground>
    </Router>
  );
}

export default App;
