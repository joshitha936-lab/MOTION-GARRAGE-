import React, { useState } from 'react';
import { VEHICLES } from '../../data/vehicles';
import type { VehicleData } from '../../types/vehicle';
import { Zap, Gauge, Flame, Shield, ArrowUpRight, Check, Eye } from 'lucide-react';

interface CollectionProps {
  onSelectForStudio: (vehicle: VehicleData) => void;
  onSelectForBuild: (vehicle: VehicleData) => void;
}

export const Collection: React.FC<CollectionProps> = ({
  onSelectForStudio,
  onSelectForBuild,
}) => {
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [activeModalVehicle, setActiveModalVehicle] = useState<VehicleData | null>(null);

  const brands = ['all', 'Porsche', 'Ferrari', 'Lamborghini', 'BMW M'];

  const filteredVehicles =
    filterBrand === 'all'
      ? VEHICLES
      : VEHICLES.filter((v) => v.brand.toLowerCase().includes(filterBrand.toLowerCase()));

  return (
    <section id="collection" className="relative w-full py-24 px-4 md:px-8 bg-[#08090c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                SECTION 02 // CURATED REAL VEHICLES
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
              The Collection
            </h2>
            <p className="text-slate-400 text-sm font-sans mt-2 max-w-xl">
              Authentic factory supercars and sports coupes with documented provenance, verified physics geometries, and accurate power specifications.
            </p>
          </div>

          {/* Brand Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-slate-950 border border-white/10 backdrop-blur-xl overflow-x-auto">
            {brands.map((b) => (
              <button
                key={b}
                onClick={() => setFilterBrand(b)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 capitalize cursor-pointer whitespace-nowrap ${
                  filterBrand === b
                    ? 'bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {b === 'all' ? 'All Vehicles' : b}
              </button>
            ))}
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group relative rounded-3xl bg-slate-950/70 border border-white/10 overflow-hidden hover:border-cyan-400/50 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col"
            >
              {/* Media Container with Real Photography */}
              <div className="relative w-full h-72 md:h-80 overflow-hidden bg-slate-900">
                <img
                  src={vehicle.poster}
                  alt={vehicle.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-cyan-400 text-[11px] font-mono font-semibold tracking-wider backdrop-blur-md">
                    {vehicle.category}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-white text-xs font-mono font-bold tracking-wider backdrop-blur-md">
                    {vehicle.basePrice} MSRP
                  </span>
                </div>

                {/* Quick 3D View Hover Pill */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex items-end p-6">
                  <div className="w-full flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-0.5">
                        {vehicle.brand}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-white font-display tracking-tight">
                        {vehicle.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Grid */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono tracking-wider mb-1 uppercase">
                      <Zap className="w-3 h-3 text-cyan-400" />
                      <span>POWER</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-white">
                      {vehicle.specs.power.split('@')[0]}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono tracking-wider mb-1 uppercase">
                      <Gauge className="w-3 h-3 text-cyan-400" />
                      <span>0-60 MPH</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-cyan-400">
                      {vehicle.specs.acceleration.split(' ')[0]}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono tracking-wider mb-1 uppercase">
                      <Flame className="w-3 h-3 text-orange-400" />
                      <span>TOP SPEED</span>
                    </div>
                    <span className="text-sm font-bold font-mono text-white">
                      {vehicle.specs.topSpeed.split(' ')[0]}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-sans leading-relaxed border-t border-white/5 pt-4">
                  <span className="font-semibold text-slate-300">Powertrain: </span>
                  {vehicle.specs.engine} • {vehicle.specs.transmission}
                </div>

                {/* Model Attribution Verification */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 border-t border-white/5 pt-3">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    Asset by {vehicle.attribution.author}
                  </span>
                  <span className="text-cyan-400/80 bg-cyan-400/10 px-2 py-0.5 rounded">
                    {vehicle.attribution.license}
                  </span>
                </div>

                {/* Card CTA Actions */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href="#studio"
                    onClick={() => onSelectForStudio(vehicle)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold font-mono tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>INSPECT 3D</span>
                  </a>

                  <a
                    href="#your-build"
                    onClick={() => onSelectForBuild(vehicle)}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-mono tracking-wider transition-all hover:border-cyan-400/50 cursor-pointer"
                  >
                    <span>CONFIGURE</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
