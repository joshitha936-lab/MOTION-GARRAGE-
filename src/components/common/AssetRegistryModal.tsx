import React from 'react';
import { X, ExternalLink, ShieldCheck, Box, Video, Camera, FileText } from 'lucide-react';

interface AssetRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssetRegistryModal: React.FC<AssetRegistryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const assets = {
    models: [
      {
        name: 'Porsche 911 Carrera 4S (992)',
        author: 'Lionsharp Studios',
        file: '/models/porsche-911-carrera-4s.glb',
        size: '4.05 MB',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        source: 'Sketchfab / PlayCanvas Web Components',
        notes: 'Original geometric vehicle mesh preserving Carrera body contours, badges, and wheels.',
      },
      {
        name: 'Ferrari 458 Italia / 296 GTB Showcase',
        author: 'vicent091036',
        file: '/models/ferrari.glb',
        size: '1.68 MB',
        license: 'CC BY (Creative Commons)',
        licenseUrl: 'https://sketchfab.com/models/57bf6cc56931426e87494f554df1dab6',
        source: 'Official Three.js Examples Repository',
        notes: 'Draco compressed, individual body paint materials, wheel pivots, and ambient occlusion contact shadow.',
      },
      {
        name: 'Lamborghini Aventador LP700-4',
        author: 'Arion Digital',
        file: '/models/lamborghini.glb',
        size: '2.60 MB',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        source: 'Sketchfab / Showcase 01 WebGL Repository',
        notes: 'V12 hypercar model featuring scissor door seams, active rear wing geometry, and hexagonal intakes.',
      },
      {
        name: 'BMW M4 Competition Coupe (G82)',
        author: '𝙎𝙍𝙏 𝙋𝙚𝙧𝙛𝙤𝙢𝙖𝙣𝙘𝙚™',
        file: '/models/bmw-m4.glb',
        size: '3.88 MB',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        source: 'Sketchfab / Car Mod SaaS Project',
        notes: 'Factory M kidney grilles, M carbon aerodynamic roof, quad M exhaust, and M alloy wheels.',
      },
    ],
    videos: [
      {
        title: 'Two Porsche 911 Targas Alpine Mountain Run',
        creator: 'SE FPV',
        file: '/videos/porsche-hero.webm',
        size: '14.1 MB',
        license: 'CC BY 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
        source: 'Wikimedia Commons (File:Two_Porsche_911_Targa_driving_as_viewed_from_FPV_drone.webm)',
      },
      {
        title: 'Ferrari F430 Spider Canyon Tracking',
        creator: 'SE FPV',
        file: '/videos/ferrari-drive.webm',
        size: '6.8 MB',
        license: 'CC BY 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
        source: 'Wikimedia Commons (File:Ferrari_F430_Spider_driving_as_viewed_from_FPV_drone.webm)',
      },
      {
        title: 'Monterey Hypercar Aerodynamics Unveil',
        creator: 'Monterey Media',
        file: '/videos/hypercar-f80.webm',
        size: '789 KB',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        source: 'Wikimedia Commons (File:2025-08-15_Monterey_Ferrari_F80.webm)',
      },
      {
        title: 'Lamborghini Diablo Titanium Restomod',
        creator: 'Monterey Showcase',
        file: '/videos/lamborghini-diablo.webm',
        size: '1.17 MB',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        source: 'Wikimedia Commons (File:2025-08-14_Monterey_Diablo_Eccentrica.webm)',
      },
    ],
    images: [
      {
        title: 'Porsche 911 GT3 RS (992) Track Car',
        source: 'Wikimedia Commons (File:Porsche_911_GT3_RS_(2023).jpg)',
        license: 'CC BY-SA 4.0',
      },
      {
        title: 'Ferrari 296 GTB Berlinetta',
        source: 'Wikimedia Commons (File:Ferrari_296_GTB.jpg)',
        license: 'CC BY-SA 4.0',
      },
      {
        title: 'Lamborghini Aventador LP700-4 Frontal Shot',
        source: 'Wikimedia Commons (File:Lamborghini_Aventador_front_(21007916946).jpg)',
        license: 'CC BY 2.0',
      },
      {
        title: 'BMW M4 Digital Cockpit & M Steering Wheel',
        source: 'Wikimedia Commons (File:BMW_M4_Coupe_interior.jpg)',
        license: 'CC BY-SA 4.0',
      },
      {
        title: 'Porsche PCCB Carbon Ceramic Brake Calipers',
        source: 'Wikimedia Commons (File:Porsche_Panamera_Turbo_S_(US)_(6361618809).jpg)',
        license: 'CC BY 2.0',
      },
      {
        title: 'Porsche GT3 RS Swan-Neck Carbon Wing',
        source: 'Wikimedia Commons (File:Porsche_911_GT3_RS_4.0_IAA_rear.jpg)',
        license: 'CC BY-SA 3.0',
      },
    ],
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950 border border-cyan-400/30 p-6 md:p-8 shadow-2xl text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-400/10 text-cyan-400 border border-cyan-400/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
                Authentic Asset & Licensing Registry
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Every 3D model, video clip, and photo is genuine real-world media under documented Creative Commons licenses.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Vehicle Models */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Box className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                Authentic 3D Vehicle Models (GLB / glTF)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assets.models.map((m, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white font-display">{m.name}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                        {m.license}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">Author: {m.author}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{m.notes}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/5 mt-3">
                    <span>Source: {m.source}</span>
                    <a
                      href={m.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      License <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Videos */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Video className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                Actual Licensed Driving Footage (WebM / MP4)
              </h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {assets.videos.map((v, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white font-display">{v.title}</span>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                        {v.license}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans mt-1">Filmed by: {v.creator}</p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-3 border-t border-white/5 mt-3">
                    <span className="truncate max-w-[200px]">{v.source}</span>
                    <a
                      href={v.licenseUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
                    >
                      License <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Photography */}
          <div className="border-t border-white/10 pt-6">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                High-Resolution Engineering Photography
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs font-mono">
              {assets.images.map((img, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-slate-200 block font-semibold mb-1">{img.title}</span>
                  <span className="text-[10px] text-cyan-400/80">{img.license}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Integrity Guarantee: No AI vehicle hallucination or procedural approximation.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-bold text-xs"
          >
            Close Registry
          </button>
        </div>
      </div>
    </div>
  );
};
