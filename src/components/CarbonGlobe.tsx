import { useEffect, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

const CarbonGlobe = () => {
  const globeRef = useRef<any>();

  // Generate 20 random compute nodes with brighter colors
  const gData = useMemo(() => [...Array(20).keys()].map(() => {
    const isLowCarbon = Math.random() > 0.4;
    return {
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: isLowCarbon ? Math.random() * 2 + 1.5 : Math.random() * 0.8 + 0.5,
      color: isLowCarbon ? ['#10b981', '#34d399', '#00ff99'][Math.floor(Math.random() * 3)] : '#475569',
      label: isLowCarbon ? 'LOW CARBON NODE' : 'STANDARD NODE'
    };
  }), []);

  useEffect(() => {
    if (globeRef.current) {
      // Faster rotation for more energy
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 3.0; 
      globeRef.current.controls().enableZoom = false;
    }
  }, []);

  return (
    <div className="w-full h-[600px] md:h-[800px] flex items-center justify-center cursor-grab active:cursor-grabbing drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">
      <Globe
        ref={globeRef}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor="#10b981"
        atmosphereDaylightAlpha={0.3} // Increased for better visibility
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        ringsData={gData}
        ringColor={(d: any) => d.color}
        ringMaxRadius={(d: any) => d.size * 6}
        ringPropagationSpeed={3}
        ringRepeat={4}

        labelsData={gData}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lng}
        labelText={(d: any) => ""}
        labelDotRadius={(d: any) => d.size * 0.6}
        labelColor={(d: any) => d.color}
        labelResolution={2}
      />
    </div>
  );
};

export default CarbonGlobe;
