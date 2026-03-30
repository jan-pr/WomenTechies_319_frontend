import { useState } from 'react';
import { Menu, X, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full top-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
              <Cpu className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="text-xl font-light tracking-[0.2em] text-white">
              COMPUTE<span className="font-bold text-emerald-400">POOL</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-12">
            {['Network', 'Features', 'Docs'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase()}`} 
                className="text-slate-400 hover:text-white text-xs font-bold uppercase tracking-[0.2em] transition-colors"
              >
                {item}
              </a>
            ))}
            <Link to="/submit" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-500 hover:text-slate-950 transition-all duration-500">
              Launch Console
            </Link>
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
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-white/5"
        >
          <div className="px-6 py-8 space-y-4">
            {['Network', 'Features', 'Docs'].map((item) => (
              <a key={item} href="#" className="block text-slate-400 hover:text-emerald-400 font-bold text-xs uppercase tracking-[0.2em]">
                {item}
              </a>
            ))}
            <button className="w-full text-center py-4 bg-emerald-500 text-slate-950 rounded-xl font-black text-xs tracking-widest uppercase mt-6">
              LAUNCH CONSOLE
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
