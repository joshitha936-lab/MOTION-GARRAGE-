import React, { Suspense, useState, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { useProgress } from '@react-three/drei';
import * as THREE from 'three';
import { VEHICLES } from '../../data/vehicles';
import type { CameraAngle, Hotspot, PaintOption, VehicleData, WheelOption } from '../../types/vehicle';
import { StudioEnvironment } from './StudioEnvironment';
import { CameraController } from './CameraController';
import { CarModel } from './CarModel';
import { HotspotMarker } from './HotspotMarker';
import { StudioControls } from './StudioControls';
import { AlertCircle, RefreshCw, X, Crosshair } from 'lucide-react';

// DOM-level loading overlay outside Canvas (prevents React 19 Suspense HTML unmounting bugs)
const StudioLoadingOverlay: React.FC = () => {
  const { progress, active, item } = useProgress();

  if (!active && progress >= 100) return null;

  return (
    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300">
      <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/90 border border-cyan-500/30 backdrop-blur-xl shadow-2xl min-w-64">
        <div className="relative w-14 h-14 flex items-center justify-center mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20 animate-ping" />
          <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold text-cyan-400">
            {Math.round(progress)}%
          </span>
        </div>
        <span className="text-xs font-mono uppercase tracking-widest text-slate-300 mb-1">
          CALIBRATING 3D ASSET
        </span>
        <span className="text-[10px] font-mono text-slate-500 max-w-[200px] truncate">
          {item.split('/').pop() || 'Loading vehicle geometry...'}
        </span>
      </div>
    </div>
  );
};

// Error Boundary for WebGL/3D fallback
interface Props {
  children: ReactNode;
  fallback: ReactNode;
}
interface State {
  hasError: boolean;
}
class WebGLErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL / 3D Canvas error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface StudioSceneProps {
  initialVehicle?: VehicleData;
  initialPaint?: PaintOption;
  initialWheel?: WheelOption;
}

export const StudioScene: React.FC<StudioSceneProps> = ({
  initialVehicle = VEHICLES[0],
  initialPaint,
  initialWheel,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData>(initialVehicle);
  const [activeAngle, setActiveAngle] = useState<CameraAngle>('frontLeftThreeQuarter');
  const [activePaint, setActivePaint] = useState<PaintOption>(initialPaint || initialVehicle.defaultPaint);
  const [activeWheel, setActiveWheel] = useState<WheelOption>(initialWheel || initialVehicle.availableWheels[0]);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);

  // Sync when initialVehicle prop changes from other sections
  React.useEffect(() => {
    if (initialVehicle && initialVehicle.id !== selectedVehicle.id) {
      setSelectedVehicle(initialVehicle);
      setActivePaint(initialPaint || initialVehicle.defaultPaint);
      setActiveWheel(initialWheel || initialVehicle.availableWheels[0]);
      setActiveAngle('frontLeftThreeQuarter');
      setSelectedHotspot(null);
    }
  }, [initialVehicle, initialPaint, initialWheel]);

  // When vehicle changes, update defaults
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setActivePaint(vehicle.defaultPaint);
    setActiveWheel(vehicle.availableWheels[0]);
    setActiveAngle('frontLeftThreeQuarter');
    setSelectedHotspot(null);
  };

  const handleResetCamera = () => {
    setActiveAngle('frontLeftThreeQuarter');
    setAutoRotate(false);
    setSelectedHotspot(null);
  };

  // 2D Photographic fallback if WebGL cannot initialize
  const renderFallback = () => (
    <div className="relative w-full h-[650px] md:h-[750px] bg-slate-950 flex flex-col items-center justify-center p-8 rounded-2xl border border-white/10 text-center">
      <img
        src={selectedVehicle.poster}
        alt={selectedVehicle.name}
        className="max-h-[400px] object-contain rounded-xl mb-6 shadow-2xl"
      />
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-2">
        <AlertCircle className="w-4 h-4" />
        <span>Hardware WebGL Acceleration Fallback Mode</span>
      </div>
      <p className="text-slate-400 text-xs max-w-md mb-4">
        Viewing genuine photography of {selectedVehicle.name} ({selectedVehicle.attribution.license}).
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 rounded-full bg-cyan-400 text-black text-xs font-bold font-mono flex items-center gap-2"
      >
        <RefreshCw className="w-3.5 h-3.5" /> Reload 3D Studio
      </button>
    </div>
  );

  return (
    <section id="studio" className="relative w-full py-16 px-4 md:px-8 bg-[#07080a] overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 studio-radial-bg pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-30 pointer-events-none" />

      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              SECTION 03 // 360° SHOWROOM STUDIO
            </span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white font-display tracking-tight uppercase">
            Interactive Vehicle Assets
          </h2>
        </div>
        <p className="text-slate-400 text-xs md:text-sm max-w-md font-sans">
          Authentic 3D vehicle geometries with factory paint finishes, engineering hotspots, and multi-angle camera transitions.
        </p>
      </div>

      {/* Interactive 3D Canvas Container */}
      <div className="relative w-full max-w-7xl mx-auto h-[620px] md:h-[750px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950">
        <WebGLErrorBoundary fallback={renderFallback()}>
          <StudioLoadingOverlay />

          <Canvas
            shadows
            camera={{ position: [3.5, 1.25, 3.5], fov: 42 }}
            dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 2, 2)]}
            gl={{
              antialias: true,
              alpha: false,
              powerPreference: 'high-performance',
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.05,
            }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            <color attach="background" args={['#08090c']} />
            <fog attach="fog" args={['#08090c', 9, 24]} />

            <StudioEnvironment />

            <CameraController
              vehicle={selectedVehicle}
              activeAngle={activeAngle}
              autoRotate={autoRotate}
            />

            <Suspense fallback={null}>
              <CarModel
                vehicle={selectedVehicle}
                activePaint={activePaint}
                activeWheel={activeWheel}
                isRotating={autoRotate}
              />

              {showHotspots &&
                selectedVehicle.hotspots.map((hotspot) => (
                  <HotspotMarker
                    key={hotspot.id}
                    hotspot={hotspot}
                    onSelect={(h) => setSelectedHotspot(h)}
                    isSelected={selectedHotspot?.id === hotspot.id}
                  />
                ))}
            </Suspense>
          </Canvas>

          {/* Active Hotspot Info Card */}
          {selectedHotspot && (
            <div className="absolute top-20 right-4 md:right-8 z-20 w-72 p-4 rounded-2xl bg-slate-950/95 border border-cyan-500/40 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5 font-bold">
                  <Crosshair className="w-3.5 h-3.5" />
                  {selectedHotspot.category}
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <h4 className="text-xs font-bold text-white mb-1 tracking-tight font-display">
                {selectedHotspot.title}
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-300 font-sans">
                {selectedHotspot.subtitle}
              </p>
            </div>
          )}

          {/* Interactive HUD Controls Overlay */}
          <StudioControls
            vehicles={VEHICLES}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={handleSelectVehicle}
            activeAngle={activeAngle}
            onSelectAngle={setActiveAngle}
            activePaint={activePaint}
            onSelectPaint={setActivePaint}
            activeWheel={activeWheel}
            onSelectWheel={setActiveWheel}
            autoRotate={autoRotate}
            onToggleAutoRotate={() => setAutoRotate(!autoRotate)}
            showHotspots={showHotspots}
            onToggleHotspots={() => setShowHotspots(!showHotspots)}
            onResetCamera={handleResetCamera}
          />
        </WebGLErrorBoundary>
      </div>
    </section>
  );
};
