import { useEffect, useRef, useMemo } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';

type GlobeNode = {
  lat: number;
  lng: number;
  size: number;
  color: string;
};

type GlobeMaterialHandle = GlobeMethods & {
  getGlobeMaterial?: () => THREE.MeshPhongMaterial;
};

const glowPalette = ['#10b981', '#34d399', '#05ffa1'] as const;

const createSeededRandom = (seed: number) => {
  let value = seed;

  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
};

const buildGlobeNodes = (count: number): GlobeNode[] => {
  const random = createSeededRandom(319);

  return Array.from({ length: count }, () => {
    const isLowCarbon = random() > 0.4;
    return {
      lat: (random() - 0.5) * 180,
      lng: (random() - 0.5) * 360,
      size: isLowCarbon ? random() * 2 + 1.2 : random() * 0.7 + 0.4,
      color: isLowCarbon ? glowPalette[Math.floor(random() * glowPalette.length)] : '#475569',
    };
  });
};

const CarbonGlobe = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  // Generate the 20 compute nodes with glowing rings (Same as before)
  const gData = useMemo(() => buildGlobeNodes(20), []);

  useEffect(() => {
    if (globeRef.current) {
      try {
        const controls = globeRef.current.controls();
        if (controls) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 2.5; 
          controls.enableZoom = false;
        }
        
        const globeMaterial = (globeRef.current as GlobeMaterialHandle).getGlobeMaterial?.();
        if (globeMaterial) {
          globeMaterial.bumpScale = 10;
          globeMaterial.specular = new THREE.Color('#10b981');
          globeMaterial.shininess = 20;
        }
      } catch (e) {
        console.error("Globe init error:", e);
      }
    }
  }, []);

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
        ringColor={(d: object) => (d as GlobeNode).color}
        ringMaxRadius={(d: object) => (d as GlobeNode).size * 6}
        ringPropagationSpeed={3}

        // Node Dots
        labelsData={gData}
        labelLat={(d: object) => (d as GlobeNode).lat}
        labelLng={(d: object) => (d as GlobeNode).lng}
        labelText={() => ''}
        labelDotRadius={(d: object) => (d as GlobeNode).size * 0.8}
        labelColor={(d: object) => (d as GlobeNode).color}
        labelResolution={2}
      />
    </div>
  );
};

export default CarbonGlobe;
