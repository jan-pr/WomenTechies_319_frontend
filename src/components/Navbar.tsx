import { useState } from 'react';
import { Menu, X, Cpu } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-[92%] left-1/2 -translate-x-1/2 top-4 bg-slate-900/40 backdrop-blur-xl z-50 border border-slate-700/50 rounded-2xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <Cpu className="h-6 w-6 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">
              COMPUTE<span className="text-emerald-400">POOL</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-10">
            {['Network', 'Features', 'Eco-Stats', 'Docs'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-slate-400 hover:text-emerald-400 text-sm font-semibold transition-colors tracking-wide"
              >
                {item}
              </a>
            ))}
            <button className="bg-emerald-500 text-slate-950 px-6 py-2 rounded-xl font-bold hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all active:scale-95 text-sm uppercase tracking-wider">
              Launch Console
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-emerald-400 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-slate-900/90 backdrop-blur-2xl border-t border-slate-700/50 rounded-b-2xl animate-fade-in">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {['Network', 'Features', 'Eco-Stats', 'Docs'].map((item) => (
              <a key={item} href="#" className="block px-4 py-3 text-slate-400 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-xl transition-all font-medium">
                {item}
              </a>
            ))}
            <button className="w-full text-center px-4 py-4 bg-emerald-500 text-slate-950 rounded-xl font-black mt-4 shadow-lg shadow-emerald-500/20">
              LAUNCH CONSOLE
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
