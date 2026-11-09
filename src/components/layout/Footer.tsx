import React from 'react';
import { ArrowUp, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenLicenses: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLicenses }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#050608] border-t border-white/10 pt-16 pb-12 px-4 md:px-8 text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-12 border-b border-white/5">
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl text-white tracking-wider flex items-center gap-1.5">
              MOTION<span className="text-cyan-400">GARAGE</span>
            </span>
            <p className="text-xs text-slate-400 font-mono mt-1">
              REAL CARS. REAL MODELS. CINEMATIC EXPERIENCE.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono">
            <a href="#collection" className="hover:text-cyan-400 transition-colors">
              The Collection
            </a>
            <a href="#studio" className="hover:text-cyan-400 transition-colors">
              360° Studio
            </a>
            <a href="#details" className="hover:text-cyan-400 transition-colors">
              The Details
            </a>
            <a href="#on-road" className="hover:text-cyan-400 transition-colors">
              On The Road
            </a>
            <a href="#your-build" className="hover:text-cyan-400 transition-colors">
              Configurator
            </a>
            <button
              onClick={onOpenLicenses}
              className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Asset Licenses
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Real Vehicle Provenance and Attribution Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs font-mono">
          <div>
            <h5 className="text-white font-bold uppercase mb-2 text-[11px] tracking-wider">
              Porsche 911 Carrera 4S
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              3D model by Lionsharp Studios on Sketchfab via PlayCanvas Web Components. Licensed under CC BY-SA 4.0.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold uppercase mb-2 text-[11px] tracking-wider">
              Ferrari 458 Italia / 296 GTB
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              3D model by vicent091036. Official Three.js automotive showcase asset under Creative Commons Attribution.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold uppercase mb-2 text-[11px] tracking-wider">
              Lamborghini Aventador LP700-4
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              3D model by Arion Digital on Sketchfab via Showcase 01 WebGL project. Licensed under CC BY 4.0.
            </p>
          </div>

          <div>
            <h5 className="text-white font-bold uppercase mb-2 text-[11px] tracking-wider">
              BMW M4 Competition (G82)
            </h5>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              3D model by 𝙎𝙍𝙏 𝙋𝙚𝙧𝙛𝙤𝙢𝙖𝙣𝙘𝙚™ on Sketchfab via Car Mod SaaS repository. Licensed under CC BY 4.0.
            </p>
          </div>
        </div>

        {/* Bottom copyright notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-600 pt-6 border-t border-white/5">
          <span>
            © {new Date().getFullYear()} MOTION GARAGE. All trademarks, vehicle names, and brand emblems remain the intellectual property of their respective manufacturers.
          </span>
          <span className="flex items-center gap-1">
            Built with React, Three.js & WebGL
          </span>
        </div>
      </div>
    </footer>
  );
};
