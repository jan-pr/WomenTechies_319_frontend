import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import NetworkStats from './components/NetworkStats';
import VantaBackground from './components/VantaBackground';
import SubmitTask from './components/SubmitTask';
import ExploreTask from './components/ExploreTask';

function DocsSection() {
  const docsItems = [
    {
      title: 'Landing Page',
      text: 'The home route introduces the platform, shows the overview stats strip, highlights project features, and links into the active workflows.',
    },
    {
      title: 'Submit Route',
      text: 'The submit page registers a contributor node, stores the generated node id in the UI, and starts a recurring heartbeat request while the node stays online.',
    },
    {
      title: 'Explore Route',
      text: 'The explore page collects workload details, posts a job to the backend, requests assignment, and then renders the selected node details returned by the current flow.',
    },
  ];

  return (
    <section id="docs" className="py-24 relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-emerald-400 mb-4">Docs</p>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Current project flow</h2>
          <p className="mt-5 text-lg text-slate-400 leading-relaxed">
            This section documents what the app already does today so visitors can understand the available routes before opening a workflow.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {docsItems.map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-white/10 bg-slate-900/35 p-8 backdrop-blur-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-400">{item.title}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingPage() {
  return (
    <>
      <Hero />
      <NetworkStats />
      <Features />
      <DocsSection />
      
      {/* Futuristic CTA Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="p-16 rounded-[3rem] bg-slate-900/40 backdrop-blur-md border border-slate-800 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"></div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              READY TO SCALE <br /> <span className="text-gradient-premium font-bold">INFINITELY?</span>
            </h2>
            <p className="text-slate-400 text-xl mb-12 max-w-2xl mx-auto font-medium">
              Join the largest decentralized carbon-aware compute network on the planet. 
              Deploy your first task in under 3 minutes.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link to="/submit" className="bg-emerald-500 text-slate-950 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                GET STARTED NOW
              </Link>
              <button className="bg-slate-800/80 text-white px-12 py-5 rounded-2xl font-black text-lg border border-slate-700 hover:bg-slate-700 transition-all backdrop-blur-sm">
                VIEW DOCUMENTATION
              </button>
            </div>
          </div>
        </div>
      </section>
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
                
                <div className="flex gap-12">
                  {['Github', 'Twitter', 'Discord', 'Network'].map(link => (
                    <a key={link} href="#" className="text-slate-500 hover:text-emerald-400 font-bold text-xs uppercase tracking-widest transition-colors">
                      {link}
                    </a>
                  ))}
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
