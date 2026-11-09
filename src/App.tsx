import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { Collection } from './components/home/Collection';
import { StudioScene } from './components/studio/StudioScene';
import { TheDetails } from './components/home/TheDetails';
import { OnTheRoad } from './components/home/OnTheRoad';
import { YourBuild } from './components/home/YourBuild';
import { TheFinale } from './components/home/TheFinale';
import { Footer } from './components/layout/Footer';
import { AssetRegistryModal } from './components/common/AssetRegistryModal';
import { VEHICLES } from './data/vehicles';
import type { PaintOption, VehicleData, WheelOption } from './types/vehicle';

export const App: React.FC = () => {
  const [selectedStudioVehicle, setSelectedStudioVehicle] = useState<VehicleData>(VEHICLES[0]);
  const [selectedStudioPaint, setSelectedStudioPaint] = useState<PaintOption | undefined>(undefined);
  const [selectedStudioWheel, setSelectedStudioWheel] = useState<WheelOption | undefined>(undefined);
  const [selectedBuildVehicle, setSelectedBuildVehicle] = useState<VehicleData>(VEHICLES[0]);
  const [licensesModalOpen, setLicensesModalOpen] = useState<boolean>(false);

  const handleSelectForStudio = (vehicle: VehicleData) => {
    setSelectedStudioVehicle(vehicle);
    setSelectedStudioPaint(vehicle.defaultPaint);
    setSelectedStudioWheel(vehicle.availableWheels[0]);
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectForBuild = (vehicle: VehicleData) => {
    setSelectedBuildVehicle(vehicle);
    const buildEl = document.getElementById('your-build');
    if (buildEl) {
      buildEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendBuildToStudio = (vehicle: VehicleData, paint: PaintOption, wheel: WheelOption) => {
    setSelectedStudioVehicle(vehicle);
    setSelectedStudioPaint(paint);
    setSelectedStudioWheel(wheel);
    const studioEl = document.getElementById('studio');
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#08090c] text-slate-100 flex flex-col selection:bg-cyan-400 selection:text-black">
      {/* Fixed Sticky Header Navigation */}
      <Navbar onOpenLicenses={() => setLicensesModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* Section 01: Hero Real Automotive Video with bold Motion Garage typography */}
        <Hero />

        {/* Section 02: The Collection - Authentic real vehicles gallery */}
        <Collection
          onSelectForStudio={handleSelectForStudio}
          onSelectForBuild={handleSelectForBuild}
        />

        {/* Section 03: 360° Studio - Interactive authentic 3D vehicle models */}
        <StudioScene
          initialVehicle={selectedStudioVehicle}
          initialPaint={selectedStudioPaint}
          initialWheel={selectedStudioWheel}
        />

        {/* Section 04: The Details - Macro photography of brakes, aero, and cockpit */}
        <TheDetails />

        {/* Section 05: On The Road - Actual licensed driving videos & FPV drone tracking */}
        <OnTheRoad />

        {/* Section 06: Your Build - Dynamic vehicle configurator & Build Sheet exporter */}
        <YourBuild
          initialVehicle={selectedBuildVehicle}
          onSendToStudio={handleSendBuildToStudio}
        />

        {/* Section 07: The Finale - Striking typography, automotive manifesto */}
        <TheFinale onOpenLicenses={() => setLicensesModalOpen(true)} />
      </main>

      {/* Footer with documented CC-BY vehicle provenance */}
      <Footer onOpenLicenses={() => setLicensesModalOpen(true)} />

      {/* Asset Provenance & Creative Commons Licensing Registry Modal */}
      <AssetRegistryModal
        isOpen={licensesModalOpen}
        onClose={() => setLicensesModalOpen(false)}
      />
    </div>
  );
};

export default App;
