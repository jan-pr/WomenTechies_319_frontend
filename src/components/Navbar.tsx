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
          <div className="px-6 py-8" />
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
