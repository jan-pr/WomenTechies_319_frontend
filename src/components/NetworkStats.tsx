import { Zap, Globe, Leaf, Cpu } from 'lucide-react';

const NetworkStats = () => {
  const stats = [
    { label: 'CO2 OFFSET', value: '428.4 TONS', icon: <Leaf className="h-4 w-4" /> },
    { label: 'GRID INTENSITY', value: '42g/kWh', icon: <Zap className="h-4 w-4" /> },
    { label: 'ACTIVE NODES', value: '14,291', icon: <Globe className="h-4 w-4" /> },
    { label: 'TOTAL COMPUTE', value: '840.2 TH/s', icon: <Cpu className="h-4 w-4" /> },
  ];

  return (
    <div className="relative z-20 -mt-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="relative group">
          {/* Glowing Border Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-cyan-500/50 to-emerald-500/50 rounded-2xl blur opacity-30 group-hover:opacity-75 transition duration-1000 animate-pulse"></div>
          
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-2xl overflow-hidden">
            <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-800">
              {stats.map((stat, i) => (
                <div key={i} className="flex-1 px-8 py-6 flex items-center justify-between group/item hover:bg-emerald-500/5 transition-colors">
                  <div>
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-white group-hover/item:text-emerald-300 transition-colors">{stat.value}</p>
                  </div>
                  <div className="text-slate-500 group-hover/item:text-emerald-400 transition-colors">
                    {stat.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Scrolling Ticker for Carbon Saved */}
            <div className="bg-emerald-500/10 border-t border-emerald-500/20 py-3 overflow-hidden whitespace-nowrap">
              <div className="flex animate-[ticker_40s_linear_infinite] gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400/80">
                {Array(6).fill(null).map((_, i) => (
                  <span key={i} className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    LIVE_FEED: [NODE_721] OFFSET 0.42kg CO2 • [NODE_882] OFFSET 1.12kg CO2 • [NODE_109] OFFSET 0.08kg CO2 • SYSTEM_STATUS: CARBON_OPTIMIZED
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default NetworkStats;
