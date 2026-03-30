import { type ReactNode } from 'react';

interface VantaBackgroundProps {
  children: ReactNode;
}

const VantaBackground = ({ children }: VantaBackgroundProps) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-[#050505]">
      {/* CSS-Only High-Tech Grid Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Horizontal Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20"></div>
        
        {/* Animated Moving Glows */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-[150px] animate-pulse delay-700"></div>
      </div>

      {/* Main Content Overlay */}
      <div className="relative z-10 w-full">
        {children}
      </div>

      <style>{`
        body {
          background-color: #050505;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default VantaBackground;
