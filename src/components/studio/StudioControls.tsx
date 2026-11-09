import React, { useState } from 'react';
import type {
  CameraAngle,
  PaintOption,
  VehicleData,
  WheelOption,
} from '../../types/vehicle';
import { engineSound } from './EngineSound';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  Compass,
  Maximize2,
  Crosshair,
  Gauge,
  Sparkles,
} from 'lucide-react';

interface StudioControlsProps {
  vehicles: VehicleData[];
  selectedVehicle: VehicleData;
  onSelectVehicle: (vehicle: VehicleData) => void;
  activeAngle: CameraAngle;
  onSelectAngle: (angle: CameraAngle) => void;
  activePaint: PaintOption;
  onSelectPaint: (paint: PaintOption) => void;
  activeWheel: WheelOption;
  onSelectWheel: (wheel: WheelOption) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
  showHotspots: boolean;
  onToggleHotspots: () => void;
  onResetCamera: () => void;
}

export const StudioControls: React.FC<StudioControlsProps> = ({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  activeAngle,
  onSelectAngle,
  activePaint,
  onSelectPaint,
  activeWheel,
  onSelectWheel,
  autoRotate,
  onToggleAutoRotate,
  showHotspots,
  onToggleHotspots,
  onResetCamera,
}) => {
  const [engineActive, setEngineActive] = useState(false);
  const [revving, setRevving] = useState(false);

  const angleOptions: { id: CameraAngle; label: string; iconLabel: string }[] = [
    { id: 'front', label: 'Front', iconLabel: 'FR' },
    { id: 'frontLeftThreeQuarter', label: 'Front-Left 3/4', iconLabel: 'FL' },
    { id: 'leftProfile', label: 'Left Profile', iconLabel: 'LP' },
    { id: 'rearLeftThreeQuarter', label: 'Rear-Left 3/4', iconLabel: 'RL' },
    { id: 'rear', label: 'Rear', iconLabel: 'RR' },
    { id: 'rearRightThreeQuarter', label: 'Rear-Right 3/4', iconLabel: 'RR3/4' },
    { id: 'rightProfile', label: 'Right Profile', iconLabel: 'RP' },
    { id: 'frontRightThreeQuarter', label: 'Front-Right 3/4', iconLabel: 'FR3/4' },
    { id: 'top', label: 'Roof', iconLabel: 'RF' },
    ...(selectedVehicle.hasCockpitView
      ? [{ id: 'cockpit' as CameraAngle, label: 'Cockpit', iconLabel: 'IN' }]
      : []),
  ];

  const handleToggleEngine = () => {
    if (engineActive) {
      engineSound.stop();
      setEngineActive(false);
      setRevving(false);
    } else {
      const type = selectedVehicle.id.includes('lamborghini')
        ? 'v12'
        : selectedVehicle.id.includes('ferrari')
        ? 'v8'
        : selectedVehicle.id.includes('bmw')
        ? 'i6'
        : 'flat6';
      engineSound.start(type);
      setEngineActive(true);
    }
  };

  const handleStartRev = () => {
    if (!engineActive) {
      handleToggleEngine();
    }
    engineSound.rev(0.95);
    setRevving(true);
  };

  const handleStopRev = () => {
    engineSound.idle();
    setRevving(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-10">
      {/* Top Bar: Vehicle Selector & Technical Badges */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pointer-events-auto">
        {/* Vehicle Switcher Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-2xl overflow-x-auto max-w-full">
          {vehicles.map((v) => {
            const isSelected = v.id === selectedVehicle.id;
            return (
              <button
                key={v.id}
                onClick={() => onSelectVehicle(v)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {v.brand} {v.name.split(' ')[1] || v.name}
              </button>
            );
          })}
        </div>

        {/* Engine Sound Synthesizer & Utility Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Start Engine / Rev Throttle Pedal */}
          <div className="flex items-center rounded-full bg-slate-950/80 border border-white/10 p-1 backdrop-blur-xl shadow-2xl">
            <button
              onClick={handleToggleEngine}
              title={engineActive ? 'Stop Engine' : 'Ignite Engine'}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-300 cursor-pointer ${
                engineActive
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(255,85,0,0.5)]'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {engineActive ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 animate-pulse text-white" />
                  <span className="tracking-widest uppercase font-bold text-[11px]">RUNNING</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                  <span className="tracking-widest uppercase font-semibold text-[11px]">IGNITE</span>
                </>
              )}
            </button>

            {engineActive && (
              <button
                onMouseDown={handleStartRev}
                onMouseUp={handleStopRev}
                onTouchStart={handleStartRev}
                onTouchEnd={handleStopRev}
                className={`ml-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono uppercase font-bold transition-all duration-150 cursor-pointer select-none ${
                  revving
                    ? 'bg-orange-600 text-white scale-95 shadow-[0_0_20px_rgba(255,85,0,0.8)]'
                    : 'bg-white/10 text-orange-400 hover:bg-white/20'
                }`}
              >
                REV THROTTLE
              </button>
            )}
          </div>

          {/* Turntable Auto-Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            title={autoRotate ? 'Pause Rotation' : 'Auto Turntable'}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              autoRotate
                ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Compass className={`w-4 h-4 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>

          {/* Hotspots Toggle */}
          <button
            onClick={onToggleHotspots}
            title={showHotspots ? 'Hide Engineering Hotspots' : 'Show Engineering Hotspots'}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 backdrop-blur-xl cursor-pointer ${
              showHotspots
                ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                : 'bg-slate-950/80 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Reset Camera */}
          <button
            onClick={onResetCamera}
            title="Reset Camera View"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-950/80 border border-white/10 text-slate-400 hover:text-white backdrop-blur-xl transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Live Telemetry HUD (Left Side) */}
      <div className="hidden lg:flex flex-col gap-2 pointer-events-auto max-w-xs animate-in fade-in slide-in-from-left duration-300">
        <div className="p-4 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-semibold flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5" />
              FACTORY TELEMETRY
            </span>
            <span className="text-[10px] font-mono text-slate-400">{selectedVehicle.year}</span>
          </div>

          <div>
            <h3 className="text-sm font-extrabold text-white font-display tracking-tight">
              {selectedVehicle.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-sans mt-0.5 line-clamp-2">
              {selectedVehicle.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">0-60 MPH</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{selectedVehicle.specs.acceleration}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">TOP SPEED</span>
              <span className="text-xs font-mono font-bold text-white">{selectedVehicle.specs.topSpeed}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">POWER</span>
              <span className="text-xs font-mono font-bold text-white">{selectedVehicle.specs.power}</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-400 block">DRIVETRAIN</span>
              <span className="text-xs font-mono font-bold text-cyan-300">{selectedVehicle.specs.drivetrain.split(' ')[0]}</span>
            </div>
          </div>

          {/* Model Attribution Badge */}
          <div className="text-[10px] text-slate-500 border-t border-white/5 pt-2 flex items-center justify-between">
            <span>Model: {selectedVehicle.attribution.author}</span>
            <span className="text-cyan-400/80 font-mono">{selectedVehicle.attribution.license}</span>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Angle Presets & Paint Swatches */}
      <div className="flex flex-col gap-3 pointer-events-auto w-full max-w-4xl mx-auto items-center">
        {/* Camera Views Selector Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950/85 border border-white/10 backdrop-blur-xl shadow-2xl overflow-x-auto max-w-full">
          {angleOptions.map((ang) => {
            const isSelected = activeAngle === ang.id;
            return (
              <button
                key={ang.id}
                onClick={() => onSelectAngle(ang.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {ang.label}
              </button>
            );
          })}
        </div>

        {/* Paint Colors & Wheel Swatches Floating Strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-2.5 rounded-2xl bg-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
          {/* Real Factory Paint Swatches */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden sm:inline">
              PAINT:
            </span>
            <div className="flex items-center gap-2">
              {selectedVehicle.availablePaints.map((paint) => {
                const isSelected = activePaint.id === paint.id;
                return (
                  <button
                    key={paint.id}
                    onClick={() => onSelectPaint(paint)}
                    title={`${paint.name} (${paint.finish})`}
                    className={`relative w-6 h-6 rounded-full transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-cyan-400 scale-125 shadow-[0_0_12px_rgba(0,240,255,0.6)]'
                        : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: paint.hex }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white shadow" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-medium text-slate-200 ml-1 hidden md:inline">
              {activePaint.name}
            </span>
          </div>

          {/* Wheel Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase hidden sm:inline">
              WHEEL:
            </span>
            <div className="flex items-center gap-1.5">
              {selectedVehicle.availableWheels.map((wheel) => {
                const isSelected = activeWheel.id === wheel.id;
                return (
                  <button
                    key={wheel.id}
                    onClick={() => onSelectWheel(wheel)}
                    title={`${wheel.name} - ${wheel.finish}`}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                        : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
                    }`}
                  >
                    {wheel.finish.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
