import React, { useState } from 'react';
import { Crosshair, ZoomIn, X, ChevronRight, ShieldCheck, Cpu, Wind, Disc, Compass } from 'lucide-react';

interface DetailItem {
  id: string;
  category: string;
  title: string;
  vehicle: string;
  image: string;
  metric: string;
  icon: React.ElementType;
  description: string;
  engineeringSpecs: { label: string; value: string }[];
  attribution: string;
}

const DETAIL_ITEMS: DetailItem[] = [
  {
    id: 'brakes',
    category: 'CHASSIS & BRAKING',
    title: 'Porsche Ceramic Composite Brakes (PCCB)',
    vehicle: 'Porsche 911 (992) Architecture',
    image: '/images/detail-caliper-wheel.jpg',
    metric: '410 mm / 0 FADE',
    icon: Disc,
    description:
      'Internally vented and cross-drilled ceramic composite brake discs measuring 410 mm front and 390 mm rear. Paired with yellow 6-piston aluminum monobloc fixed calipers, delivering zero thermal fade across extreme continuous track sessions.',
    engineeringSpecs: [
      { label: 'Disc Diameter', value: '410 mm Front / 390 mm Rear' },
      { label: 'Caliper Architecture', value: '6-Piston Monobloc Aluminum' },
      { label: 'Weight Reduction', value: '50% Lighter than cast iron' },
      { label: 'Operating Thermal Range', value: 'Up to 1,000° C' },
    ],
    attribution: 'Wikimedia Commons (CC BY 2.0)',
  },
  {
    id: 'aero',
    category: 'ACTIVE AERODYNAMICS',
    title: 'Motorsport Swan-Neck Rear Wing & Diffuser',
    vehicle: 'Porsche 911 GT3 RS 4.0',
    image: '/images/detail-aero-wing.jpg',
    metric: '860 KG DOWNFORCE',
    icon: Wind,
    description:
      'High-mounted swan-neck carbon fiber rear wing that leaves the underside airflow completely undisturbed. Aerodynamic wing angle is continuously managed with active hydraulic actuators providing DRS drag-reduction functionality.',
    engineeringSpecs: [
      { label: 'Max Downforce', value: '860 kg @ 285 km/h' },
      { label: 'Wing Material', value: 'Autoclaved Twill Carbon Fiber' },
      { label: 'Active Control', value: 'Hydraulically Actuated DRS' },
      { label: 'Efficiency Ratio', value: 'Low drag-to-downforce quotient' },
    ],
    attribution: 'Wikimedia Commons (CC BY-SA 3.0)',
  },
  {
    id: 'cockpit',
    category: 'ERGONOMICS & TELEMETRY',
    title: 'Driver-Centric M Digital Cockpit & Wheel',
    vehicle: 'BMW M4 Competition (G82)',
    image: '/images/bmw-m4-interior.jpg',
    metric: 'DUAL M-MODE BUTTONS',
    icon: Cpu,
    description:
      'Pure driver-focused cockpit featuring an Alcantara contoured sports steering wheel, crimson anodized M1 and M2 programmable engine mapping switches, carbon shift paddles, and lightweight carbon bucket seats.',
    engineeringSpecs: [
      { label: 'Steering Wheel', value: 'M Sport with Carbon Inlays' },
      { label: 'Dynamic Switches', value: 'M1 / M2 Instant Setup' },
      { label: 'Seat Weight', value: '-21 lbs vs Standard Sport Seats' },
      { label: 'Instrumentation', value: 'Track Telemetry Drift Analyzer' },
    ],
    attribution: 'Wikimedia Commons (CC BY-SA 4.0)',
  },
  {
    id: 'wheels',
    category: 'UNSPRUNG MASS',
    title: 'Center-Lock Forged Lightweight Alloys',
    vehicle: 'Lamborghini Aventador & Porsche RS',
    image: '/images/detail-aventador-wheel.jpg',
    metric: '20" / 21" STAGGERED',
    icon: Compass,
    description:
      'Precision-milled aerospace-grade aluminum forgings paired with high-performance Pirelli P Zero Corsa track compounds. Drastically reduces rotating rotational inertia for razor-sharp turn-in and feedback.',
    engineeringSpecs: [
      { label: 'Front Dimensions', value: '20 x 9.5J' },
      { label: 'Rear Dimensions', value: '21 x 12.5J' },
      { label: 'Locking Mechanism', value: 'Anodized Motorsport Center Nut' },
      { label: 'Tire Compound', value: 'Pirelli P Zero Corsa' },
    ],
    attribution: 'Wikimedia Commons (CC BY 2.0)',
  },
];

export const TheDetails: React.FC = () => {
  const [activeItem, setActiveItem] = useState<DetailItem>(DETAIL_ITEMS[0]);
  const [modalImage, setModalImage] = useState<string | null>(null);

  return (
    <section id="details" className="relative w-full py-24 px-4 md:px-8 bg-[#07080a] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                SECTION 04 // ENGINEERING MACRO PHOTOGRAPHY
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
              The Details
            </h2>
            <p className="text-slate-400 text-sm font-sans mt-2 max-w-xl">
              Authentic macro-photography and engineering close-ups documenting actual carbon weave patterns, caliper castings, cockpit instruments, and aero profiling.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-full bg-slate-950 border border-white/10 backdrop-blur-xl">
            <span className="text-xs font-mono text-slate-400 px-3">
              ZERO AI OR PROCEDURAL IMAGES
            </span>
          </div>
        </div>

        {/* Interactive Feature Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Tab Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {DETAIL_ITEMS.map((item) => {
              const isSelected = activeItem.id === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 border-cyan-400/80 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
                      : 'bg-slate-950/50 border-white/5 hover:border-white/20 hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase flex items-center gap-1.5">
                      <IconComponent className="w-3.5 h-3.5" />
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {item.metric}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-white font-display mb-1">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                    {item.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Active High-Res Photo & Technical Breakdown */}
          <div className="lg:col-span-7 flex flex-col rounded-3xl bg-slate-950/80 border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl">
            {/* Image viewer with zoom trigger */}
            <div className="relative w-full h-[360px] md:h-[420px] bg-black overflow-hidden group">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30 pointer-events-none" />

              {/* Attribution and Zoom button */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => setModalImage(activeItem.image)}
                  className="p-2.5 rounded-full bg-slate-900/80 border border-white/20 text-white hover:text-cyan-400 hover:border-cyan-400 backdrop-blur-md transition-all shadow-lg cursor-pointer"
                  title="Enlarge high-resolution image"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block mb-1">
                    {activeItem.vehicle}
                  </span>
                  <h4 className="text-xl font-black text-white font-display">
                    {activeItem.title}
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-white/10 backdrop-blur-md">
                  {activeItem.attribution}
                </span>
              </div>
            </div>

            {/* Technical Spec Matrix */}
            <div className="p-6 md:p-8 space-y-6">
              <p className="text-sm leading-relaxed text-slate-300 font-sans">
                {activeItem.description}
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                {activeItem.engineeringSpecs.map((spec, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                      {spec.label}
                    </span>
                    <span className="text-xs font-mono font-bold text-white">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
        >
          <button
            onClick={() => setModalImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-slate-900 border border-white/20 text-white hover:text-cyan-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={modalImage}
            alt="Macro detail"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl border border-white/10 shadow-2xl"
          />
        </div>
      )}
    </section>
  );
};
