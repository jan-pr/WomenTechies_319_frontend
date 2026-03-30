import { useEffect, useRef, useState, ReactNode } from 'react';
import * as THREE from 'three';
// @ts-ignore
import NET from 'vanta/dist/vanta.net.min';

interface VantaBackgroundProps {
  children: ReactNode;
}

const VantaBackground = ({ children }: VantaBackgroundProps) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    (window as any).THREE = THREE;

    let effect: any = null;

    const initVanta = () => {
      if (!effect && vantaRef.current) {
        try {
          effect = NET({
            el: vantaRef.current,
            THREE: THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x10b981,
            backgroundColor: 0x050505, // Much darker charcoal for high contrast
            points: 12.00,
            maxDistance: 22.00,
            spacing: 16.00,
            showDots: false
          });
          setVantaEffect(effect);
        } catch (err) {
          console.error("Vanta initialization failed:", err);
        }
      }
    };

    const timer = setTimeout(initVanta, 100);

    return () => {
      clearTimeout(timer);
      if (effect) effect.destroy();
    };
  }, []);

  return (
    <div 
      ref={vantaRef} 
      className="min-h-screen w-full relative overflow-hidden bg-[#050505]"
    >
      <div className="relative z-10 w-full">
        {children}
      </div>

      <style>{`
        .vanta-canvas {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          z-index: 0 !important;
        }
      `}</style>
    </div>
  );
};

export default VantaBackground;
