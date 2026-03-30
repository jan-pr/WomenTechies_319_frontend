import { Shield, Zap, Cpu, Leaf, Network } from 'lucide-react';

const features = [
  { icon: <Leaf className="h-8 w-8" />, title: 'Eco Routing' },
  { icon: <Shield className="h-8 w-8" />, title: 'Docker Security' },
  { icon: <Network className="h-8 w-8" />, title: 'Mesh P2P' },
  { icon: <Cpu className="h-8 w-8" />, title: 'Idle Sensing' },
  { icon: <Zap className="h-8 w-8" />, title: 'Fast Verify' },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-slate-900/30 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center min-w-[180px]"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
