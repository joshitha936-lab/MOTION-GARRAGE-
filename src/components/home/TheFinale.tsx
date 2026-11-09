import React from 'react';
import { ChevronRight, ArrowUpRight, ShieldCheck, Sparkles, Cpu, Award } from 'lucide-react';

interface TheFinaleProps {
  onOpenLicenses: () => void;
}

export const TheFinale: React.FC<TheFinaleProps> = ({ onOpenLicenses }) => {
  return (
    <section className="relative w-full py-28 px-4 md:px-8 bg-[#08090c] overflow-hidden border-t border-white/5">
      {/* Background Graphic Accents */}
      <div className="absolute inset-0 bg-radial from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Verification Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950 border border-cyan-400/30 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-8 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <Award className="w-4 h-4" />
          <span>AUTHENTIC AUTOMOTIVE DIGITAL SHOWROOM</span>
        </div>

        {/* Striking Final Heading */}
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black text-white font-display uppercase tracking-tight max-w-5xl leading-[0.95] mb-6">
          DRIVEN BY REALITY. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-slate-400">
            ENGINEERED FOR SCREEN.
          </span>
        </h2>

        {/* Manifesto */}
        <p className="max-w-2xl text-slate-300 text-sm md:text-base font-sans font-light tracking-wide mb-12 leading-relaxed">
          Motion Garage honors the genuine heritage of motorsport by featuring actual 3D vehicle geometries, authentic factory paints, and real driving footage. No shortcuts. No procedural drawings. Just pure automotive thrill.
        </p>

        {/* Metric Highlights Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl mb-12">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-2xl md:text-3xl font-black font-display text-cyan-400 block mb-1">
              4
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              Authentic 3D Models
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-2xl md:text-3xl font-black font-display text-white block mb-1">
              100%
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              CC-BY Documented
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-2xl md:text-3xl font-black font-display text-cyan-400 block mb-1">
              4K FPV
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              Pursuit Drone Tracks
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-2xl md:text-3xl font-black font-display text-orange-400 block mb-1">
              ZERO
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300">
              Synthetic AI Cars
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <a
            href="#studio"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold font-mono tracking-wider transition-all duration-300 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            <span>RE-ENTER 360° STUDIO</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenLicenses}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-mono tracking-wider transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>VIEW ASSET PROVENANCE</span>
          </button>
        </div>
      </div>
    </section>
  );
};
