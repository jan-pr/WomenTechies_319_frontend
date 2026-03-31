import { Shield, Zap, Cpu, Leaf, Network } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="h-8 w-8" />,
    title: 'Carbon Zone Input',
    description: 'Contributors can register a node by entering a carbon zone before deployment.',
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: 'Heartbeat Updates',
    description: 'Online contributor nodes post recurring heartbeat data to keep availability current.',
  },
  {
    icon: <Network className="h-8 w-8" />,
    title: 'Task Upload Flow',
    description: 'The explore workspace collects a task label, repository URL, entry file, upload, and notes.',
  },
  {
    icon: <Cpu className="h-8 w-8" />,
    title: 'Node Assignment',
    description: 'The frontend walks through job submission, assignment, and node lookup against the backend.',
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: 'Reserved Execution View',
    description: 'Assigned node details are shown after the backend finishes the scheduling flow.',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-14">
          <p className="text-xs font-black text-emerald-400 uppercase tracking-[0.25em] mb-4">Project Features</p>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Built from the flows already present in this project</h2>
          <p className="mt-5 text-slate-400 text-base md:text-lg leading-relaxed">
            These cards describe the current contributor and workload flows implemented across the landing page, submit page, and explore page.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-slate-900/30 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 hover:-translate-y-2 flex flex-col items-center text-center w-full max-w-[360px]"
            >
              <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-500">
                {feature.icon}
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{feature.title}</h3>
              <p className="mt-4 text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
