import { Shield, Zap, Globe, Cpu, Leaf, Network } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: 'Sustainability First',
    description: 'Dynamic task routing based on real-time grid carbon intensity data from Electricity Maps API.',
    color: 'emerald'
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Encapsulated Security',
    description: 'Every job runs in an isolated, immutable Docker container with zero access to your local files.',
    color: 'cyan'
  },
  {
    icon: <Network className="h-8 w-8" />,
    title: 'Mesh Distribution',
    description: 'Proprietary p2p protocol ensures low-latency task delivery and robust node discovery.',
    color: 'blue'
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: 'Idle Detection',
    description: 'Intelligent resource sensing only activates when your machine is truly idle. Zero impact on UX.',
    color: 'indigo'
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Atomic Results',
    description: 'Consensus-based result verification ensures 99.9% accuracy for every batch of computations.',
    color: 'purple'
  },
  {
    icon: <Globe className="h-8 w-8" />,
    title: 'Global Sovereignty',
    description: 'Decentralized ownership means no single point of failure and censorship-resistant compute.',
    color: 'teal'
  },
];

const Features = () => {
  return (
    <section id="features" className="py-32 bg-slate-950 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
        <div className="text-center mb-24">
          <h2 className="text-emerald-400 font-black tracking-widest uppercase text-sm mb-4">Core Infrastructure</h2>
          <p className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
            BUILT FOR THE FUTURE <br /> OF <span className="text-gradient">COMPUTING</span>
          </p>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
            Our technology stack combines decentralized verification with sustainable 
            resource allocation for enterprise-grade performance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-slate-900/50 backdrop-blur-md p-10 rounded-[2.5rem] border border-slate-800 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl overflow-hidden"
            >
              {/* Card Hover Glow */}
              <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"></div>
              
              <div className={`w-16 h-16 bg-slate-950/50 rounded-2xl flex items-center justify-center mb-8 border border-slate-700 group-hover:border-${feature.color}-500/50 group-hover:bg-${feature.color}-500/10 transition-all duration-500 text-slate-400 group-hover:text-emerald-400`}>
                {feature.icon}
              </div>
              
              <h3 className="text-2xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                {feature.description}
              </p>
              
              <div className="mt-8 flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Learn More <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
