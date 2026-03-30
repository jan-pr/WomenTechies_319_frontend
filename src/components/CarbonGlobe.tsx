import { useEffect, useRef, useMemo, useState } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const CarbonGlobe = () => {
  const globeRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Generate the 20 compute nodes with glowing rings (Same as before)
  const gData = useMemo(() => [...Array(20).keys()].map(() => {
    const isLowCarbon = Math.random() > 0.4;
    return {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: isLowCarbon ? Math.random() * 2 + 1.2 : Math.random() * 0.7 + 0.4,
      color: isLowCarbon ? ['#10b981', '#34d399', '#05ffa1'][Math.floor(Math.random() * 3)] : '#475569',
    };
  }), []);

  useEffect(() => {
    if (mounted && globeRef.current) {
      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 2.5; 
          controls.enableZoom = false;
        }
        
        const globeMaterial = globeRef.current.getGlobeMaterial();
        if (globeMaterial) {
          globeMaterial.bumpScale = 10;
          globeMaterial.specular = new THREE.Color('#10b981');
          globeMaterial.shininess = 20;
        }
      } catch (e) {
        console.error("Globe init error:", e);
      }
    }
  }, [mounted]);

  if (!mounted) return <div className="w-full h-full bg-slate-900/20 rounded-full animate-pulse" />;

  return (
    <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing drop-shadow-[0_0_100px_rgba(16,185,129,0.3)]">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#10b981"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        width={1000}
        height={1000}
        
        // Glowing Rings (Compute Nodes)
        ringsData={gData}
        ringColor={(d: any) => d.color}
        ringMaxRadius={(d: any) => d.size * 6}
        ringPropagationSpeed={3}

        // Node Dots
        labelsData={gData}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={() => ""}
        labelDotRadius={(d: any) => d.size * 0.8}
        labelColor={(d: any) => d.color}
        labelResolution={2}
      />
    </div>
  );
};

export default CarbonGlobe;
