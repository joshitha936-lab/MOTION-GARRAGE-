import React, { useState } from 'react';
import { VEHICLES } from '../../data/vehicles';
import type { PaintOption, VehicleData, WheelOption } from '../../types/vehicle';
import confetti from 'canvas-confetti';
import {
  Check,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Gauge,
  Sliders,
  DollarSign,
  Layers,
} from 'lucide-react';

interface YourBuildProps {
  initialVehicle?: VehicleData;
  onSendToStudio?: (vehicle: VehicleData, paint: PaintOption, wheel: WheelOption) => void;
}

interface PerformancePackage {
  id: string;
  name: string;
  price: number;
  description: string;
}

const PERFORMANCE_PACKAGES: PerformancePackage[] = [
  {
    id: 'pccb-brakes',
    name: 'Carbon-Ceramic Braking System',
    price: 8900,
    description: '410mm drilled ceramic composite rotors with 6-piston fixed aluminum calipers.',
  },
  {
    id: 'aero-carbon',
    name: 'Motorsport Carbon Aero Wing & Splitter',
    price: 5400,
    description: 'Dry twill autoclave carbon aerodynamic splitter, rear wing endplates, and underfloor diffuser.',
  },
  {
    id: 'sport-chrono',
    name: 'Dynamic Chrono & Track Telemetry Package',
    price: 2790,
    description: 'High-precision lap trigger, dashboard analogue stopwatch, and steering wheel mode switch.',
  },
  {
    id: 'titanium-exhaust',
    name: 'Lightweight Inconel / Titanium Sport Exhaust',
    price: 6200,
    description: 'Active valve-controlled titanium exhaust system saving 14 kg with distinctive acoustic tone.',
  },
];

interface InteriorTrim {
  id: string;
  name: string;
  price: number;
  description: string;
}

const INTERIOR_TRIMS: InteriorTrim[] = [
  {
    id: 'alcantara-carbon',
    name: 'Full Race-Tex Alcantara & Twill Carbon',
    price: 3850,
    description: 'Steering wheel, seat centers, roofliner in Alcantara with matte carbon console trim.',
  },
  {
    id: 'bucket-seats',
    name: 'Carbon Fiber Lightweight Motorsport Buckets',
    price: 4900,
    description: 'One-piece carbon fiber seat shells saving 22 lbs with 6-point harness pass-throughs.',
  },
  {
    id: 'extended-leather',
    name: 'Nappa Semi-Aniline Leather with Contrast Stitch',
    price: 2400,
    description: 'Hand-stitched leather on dashboard, door panels, and center tunnel in electric cyan stitch.',
  },
];

export const YourBuild: React.FC<YourBuildProps> = ({
  initialVehicle = VEHICLES[0],
  onSendToStudio,
}) => {
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData>(initialVehicle);
  const [selectedPaint, setSelectedPaint] = useState<PaintOption>(initialVehicle.defaultPaint);
  const [selectedWheel, setSelectedWheel] = useState<WheelOption>(initialVehicle.availableWheels[0]);
  const [selectedPackages, setSelectedPackages] = useState<string[]>(['pccb-brakes']);
  const [selectedInterior, setSelectedInterior] = useState<string>('alcantara-carbon');
  const [exportSuccess, setExportSuccess] = useState<boolean>(false);

  // When vehicle changes, reset default paint and wheels
  const handleSelectVehicle = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setSelectedPaint(vehicle.defaultPaint);
    setSelectedWheel(vehicle.availableWheels[0]);
  };

  const togglePackage = (pkgId: string) => {
    setSelectedPackages((prev) =>
      prev.includes(pkgId) ? prev.filter((id) => id !== pkgId) : [...prev, pkgId]
    );
  };

  // Base price parse
  const basePriceNum = parseInt(selectedVehicle.basePrice.replace(/[^0-9]/g, '')) || 138500;
  const wheelPriceNum =
    selectedWheel.priceDelta.includes('+$')
      ? parseInt(selectedWheel.priceDelta.replace(/[^0-9]/g, ''))
      : 0;
  const packagesTotal = selectedPackages.reduce((acc, id) => {
    const pkg = PERFORMANCE_PACKAGES.find((p) => p.id === id);
    return acc + (pkg ? pkg.price : 0);
  }, 0);
  const interiorPkg = INTERIOR_TRIMS.find((t) => t.id === selectedInterior);
  const interiorPriceNum = interiorPkg ? interiorPkg.price : 0;
  const destinationFee = 1650;
  const grandTotal = basePriceNum + wheelPriceNum + packagesTotal + interiorPriceNum + destinationFee;

  const handleExportBuild = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f0ff', '#ffffff', '#ff5500'],
    });

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 4000);

    // Create downloadable spec card
    const buildSummary = `
========================================
MOTION GARAGE // OFFICIAL BUILD SHEET
========================================
VEHICLE: ${selectedVehicle.name} (${selectedVehicle.year})
BRAND: ${selectedVehicle.brand}
POWERTRAIN: ${selectedVehicle.specs.engine}
TRANSMISSION: ${selectedVehicle.specs.transmission}
POWER: ${selectedVehicle.specs.power}
ACCELERATION: ${selectedVehicle.specs.acceleration}
TOP SPEED: ${selectedVehicle.specs.topSpeed}

EXTERIOR FINISH:
- Color: ${selectedPaint.name} (${selectedPaint.finish.toUpperCase()})
- Hex Code: ${selectedPaint.hex}

WHEELS & TIRES:
- Specification: ${selectedWheel.name} (${selectedWheel.finish})
- Delta: ${selectedWheel.priceDelta}

PERFORMANCE & AERO PACKAGES:
${selectedPackages.map((id) => `- ${PERFORMANCE_PACKAGES.find((p) => p.id === id)?.name}`).join('\n')}

INTERIOR TRIM:
- ${interiorPkg?.name}

FINANCIAL BREAKDOWN:
- Base Vehicle MSRP: $${basePriceNum.toLocaleString()}
- Wheel Option: +$${wheelPriceNum.toLocaleString()}
- Performance Packages: +$${packagesTotal.toLocaleString()}
- Interior Package: +$${interiorPriceNum.toLocaleString()}
- Destination & Delivery: $${destinationFee.toLocaleString()}
----------------------------------------
ESTIMATED TOTAL MSRP: $${grandTotal.toLocaleString()}
----------------------------------------
ASSET CREDITS:
3D Model: ${selectedVehicle.attribution.author} (${selectedVehicle.attribution.license})
Source: ${selectedVehicle.attribution.source}
Generated via MOTION GARAGE
========================================
`;

    const blob = new Blob([buildSummary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MotionGarage-Build-${selectedVehicle.id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="your-build" className="relative w-full py-24 px-4 md:px-8 bg-[#07080a] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                SECTION 06 // SPECIFICATION CONFIGURATOR
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
              Your Build
            </h2>
            <p className="text-slate-400 text-sm font-sans mt-2 max-w-xl">
              Select authentic factory finishes, lightweight center-lock alloys, carbon aero kits, and generate your build specification.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-950 border border-white/10 backdrop-blur-xl">
            <span className="text-xs font-mono text-cyan-400 px-3">
              LIVE MSRP SPEC GENERATOR
            </span>
          </div>
        </div>

        {/* Configurator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Options Configuration */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* Step 1: Base Vehicle Selection */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  01 // CHOOSE CHASSIS PLATFORM
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedVehicle.category}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {VEHICLES.map((veh) => {
                  const isSelected = veh.id === selectedVehicle.id;
                  return (
                    <button
                      key={veh.id}
                      onClick={() => handleSelectVehicle(veh)}
                      className={`p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        {veh.brand}
                      </span>
                      <h4 className="text-xs font-bold text-white font-display my-1">
                        {veh.name.split(' ')[1] || veh.name}
                      </h4>
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        {veh.basePrice}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Exterior Paint Selection */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  02 // FACTORY PAINT SPECIFICATION
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {selectedPaint.name} • {selectedPaint.finish.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectedVehicle.availablePaints.map((paint) => {
                  const isSelected = selectedPaint.id === paint.id;
                  return (
                    <button
                      key={paint.id}
                      onClick={() => setSelectedPaint(paint)}
                      className={`p-3 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full shadow-inner border border-white/20 shrink-0"
                        style={{ backgroundColor: paint.hex }}
                      />
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white font-display">
                          {paint.name}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {paint.finish}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Wheels Selection */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  03 // FORGED WHEELS & FINISH
                </span>
                <span className="text-xs font-mono text-slate-200">
                  {selectedWheel.priceDelta}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedVehicle.availableWheels.map((wheel) => {
                  const isSelected = selectedWheel.id === wheel.id;
                  return (
                    <button
                      key={wheel.id}
                      onClick={() => setSelectedWheel(wheel)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ backgroundColor: wheel.color }}
                        />
                        <div className="flex flex-col text-left">
                          <span className="text-xs font-bold text-white font-display">
                            {wheel.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {wheel.finish}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        {wheel.priceDelta}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Aerodynamics & Performance */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  04 // MOTORSPORT DYNAMICS & AERO
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {selectedPackages.length} Selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PERFORMANCE_PACKAGES.map((pkg) => {
                  const isChecked = selectedPackages.includes(pkg.id);
                  return (
                    <button
                      key={pkg.id}
                      onClick={() => togglePackage(pkg.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isChecked
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-xs font-bold text-white font-display">
                          {pkg.name}
                        </h5>
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isChecked
                              ? 'bg-cyan-400 border-cyan-400 text-black'
                              : 'border-white/30'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-sans mb-3 line-clamp-2">
                        {pkg.description}
                      </p>
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        +${pkg.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 5: Interior Cockpit Trim */}
            <div className="p-6 rounded-3xl bg-slate-950/70 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono tracking-widest uppercase text-cyan-400 font-bold">
                  05 // COCKPIT & SEAT TRIMS
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {INTERIOR_TRIMS.map((trim) => {
                  const isSelected = selectedInterior === trim.id;
                  return (
                    <button
                      key={trim.id}
                      onClick={() => setSelectedInterior(trim.id)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-white font-display">
                          {trim.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-sans">
                          {trim.description}
                        </span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 ml-4">
                        +${trim.price.toLocaleString()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Live MSRP Summary & Spec Sheet Card */}
          <div className="lg:col-span-5 sticky top-24 flex flex-col gap-4">
            <div className="p-6 md:p-8 rounded-3xl bg-slate-950 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                    BUILD SPECIFICATION
                  </span>
                  <h3 className="text-2xl font-black text-white font-display mt-0.5">
                    {selectedVehicle.name}
                  </h3>
                </div>
                <div
                  className="w-8 h-8 rounded-full border-2 border-white/20 shadow-md"
                  style={{ backgroundColor: selectedPaint.hex }}
                  title={selectedPaint.name}
                />
              </div>

              {/* Vehicle Specs Grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 block text-[9px] uppercase">Engine</span>
                  <span className="text-slate-200 font-semibold">{selectedVehicle.specs.engine.split(' ')[0]} {selectedVehicle.specs.engine.split(' ')[1]}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 block text-[9px] uppercase">Power</span>
                  <span className="text-cyan-400 font-bold">{selectedVehicle.specs.power.split('@')[0]}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 block text-[9px] uppercase">Acceleration</span>
                  <span className="text-white font-bold">{selectedVehicle.specs.acceleration}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                  <span className="text-slate-500 block text-[9px] uppercase">Top Speed</span>
                  <span className="text-white font-bold">{selectedVehicle.specs.topSpeed}</span>
                </div>
              </div>

              {/* Price Calculation Matrix */}
              <div className="space-y-2.5 text-xs font-mono border-t border-white/10 pt-4">
                <div className="flex justify-between text-slate-300">
                  <span>Base Vehicle MSRP</span>
                  <span>${basePriceNum.toLocaleString()}</span>
                </div>
                {wheelPriceNum > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>{selectedWheel.finish} Wheel</span>
                    <span className="text-cyan-400">+${wheelPriceNum.toLocaleString()}</span>
                  </div>
                )}
                {packagesTotal > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Aero & Track Options</span>
                    <span className="text-cyan-400">+${packagesTotal.toLocaleString()}</span>
                  </div>
                )}
                {interiorPriceNum > 0 && (
                  <div className="flex justify-between text-slate-300">
                    <span>Interior Trim Spec</span>
                    <span className="text-cyan-400">+${interiorPriceNum.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Destination & Handling</span>
                  <span>${destinationFee.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-baseline pt-4 border-t border-white/10">
                  <span className="text-sm font-bold text-white uppercase font-display">
                    ESTIMATED MSRP
                  </span>
                  <span className="text-2xl font-black text-cyan-400 font-display">
                    ${grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Interactive Actions */}
              <div className="space-y-3 pt-2">
                <a
                  href="#studio"
                  onClick={() => {
                    if (onSendToStudio) {
                      onSendToStudio(selectedVehicle, selectedPaint, selectedWheel);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  <span>INSPECT SPEC IN 360° STUDIO</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button
                  onClick={handleExportBuild}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs tracking-wider transition-all hover:border-cyan-400/50 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>EXPORT BUILD SHEET (.TXT)</span>
                </button>

                {exportSuccess && (
                  <div className="p-3 rounded-xl bg-cyan-400/10 border border-cyan-400/40 text-cyan-400 text-xs font-mono text-center animate-in fade-in">
                    Build specification generated & downloaded successfully!
                  </div>
                )}
              </div>

              {/* Provenance note */}
              <div className="text-[10px] text-slate-500 font-mono border-t border-white/5 pt-3 flex items-center justify-between">
                <span>Model Asset: {selectedVehicle.attribution.author}</span>
                <span className="text-cyan-400">{selectedVehicle.attribution.license}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
