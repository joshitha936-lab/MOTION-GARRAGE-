import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Compass,
  Radio,
  ShieldCheck,
  Video,
} from 'lucide-react';

interface RoadClip {
  id: string;
  title: string;
  vehicle: string;
  src: string;
  poster: string;
  location: string;
  telemetry: {
    lens: string;
    altitude: string;
    trackingMode: string;
    speedEstimate: string;
  };
  attribution: {
    creator: string;
    license: string;
    source: string;
  };
}

const ROAD_CLIPS: RoadClip[] = [
  {
    id: 'porsche-mountain',
    title: 'Porsche 911 Targa Mountain Pursuit',
    vehicle: 'Porsche 911 Targa (Twin Vehicle Pace)',
    src: '/videos/porsche-hero.webm',
    poster: '/posters/hero-poster.jpg',
    location: 'Alpine Mountain Passes // Elevation 1,840m',
    telemetry: {
      lens: 'Ultra-wide 12mm Low-Distortion FPV',
      altitude: '15 - 45m Dynamic AGL',
      trackingMode: 'High-G 3D Chase Camera',
      speedEstimate: '110 - 165 km/h',
    },
    attribution: {
      creator: 'SE FPV',
      license: 'CC BY 3.0',
      source: 'Wikimedia Commons / YouTube Open Media',
    },
  },
  {
    id: 'ferrari-canyon',
    title: 'Ferrari F430 Spider Canyon Tracking',
    vehicle: 'Ferrari F430 Spider (Rosso Corsa)',
    src: '/videos/ferrari-drive.webm',
    poster: '/posters/ferrari-poster.jpg',
    location: 'Coastal Ridge Road // European Route',
    telemetry: {
      lens: '14mm Cinelifter FPV Gimbal',
      altitude: '8 - 25m Dynamic Chase',
      trackingMode: 'Rear Quarter & Lateral Tracking',
      speedEstimate: '135 - 190 km/h',
    },
    attribution: {
      creator: 'SE FPV',
      license: 'CC BY 3.0',
      source: 'Wikimedia Commons / YouTube Open Media',
    },
  },
  {
    id: 'hypercar-f80',
    title: 'Monterey Hypercar Aerodynamics Unveil',
    vehicle: 'Ferrari F80 Concept Track Vehicle',
    src: '/videos/hypercar-f80.webm',
    poster: '/posters/ferrari-poster.jpg',
    location: 'Monterey Car Week Track Paddock',
    telemetry: {
      lens: '24-70mm f/2.8 Gimbal Telephoto',
      altitude: 'Ground Level Steadicam',
      trackingMode: 'Full 360° Aero Inspection',
      speedEstimate: 'Stationary / Dynamic Idle',
    },
    attribution: {
      creator: 'Monterey Media',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons Open Video',
    },
  },
  {
    id: 'diablo-eccentrica',
    title: 'Lamborghini Diablo V12 Restomod',
    vehicle: 'Lamborghini Diablo Titanium Restomod',
    src: '/videos/lamborghini-diablo.webm',
    poster: '/posters/lamborghini-poster.jpg',
    location: 'Monterey Peninsula Showcase',
    telemetry: {
      lens: '35mm Prime Cinema Glass',
      altitude: 'Driver Eye-Level Tracking',
      trackingMode: 'Acoustic & Engineering Profiling',
      speedEstimate: 'Low-Speed Pacing',
    },
    attribution: {
      creator: 'Monterey Showcase',
      license: 'CC BY-SA 4.0',
      source: 'Wikimedia Commons Open Video',
    },
  },
];

export const OnTheRoad: React.FC = () => {
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef<boolean>(false);

  const activeClip = ROAD_CLIPS[activeClipIndex];

  // IntersectionObserver: only play when scrolled into view, pause when offscreen
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        inViewRef.current = entry.isIntersecting;
        if (!videoRef.current) return;

        if (entry.isIntersecting) {
          if (isPlaying) {
            videoRef.current.play().catch(() => {});
          }
        } else {
          // Offscreen: pause immediately to prevent CPU/GPU overload
          videoRef.current.pause();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      setIsBuffering(true);
      videoRef.current.load();
      if (inViewRef.current && isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeClipIndex]);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgressPercent(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <section id="on-road" className="relative w-full py-24 px-4 md:px-8 bg-[#08090c] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                SECTION 05 // LICENSED AUTOMOTIVE FOOTAGE
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
              On The Road
            </h2>
            <p className="text-slate-400 text-sm font-sans mt-2 max-w-xl">
              Authentic high-speed pursuit and aerodynamic drone tracking videos of real supercars carved into mountain passes and coastal asphalt.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-400/10 px-4 py-2 rounded-full border border-cyan-400/20">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>REAL ROAD DYNAMICS // ZERO RENDERED CGI</span>
          </div>
        </div>

        {/* Video Theatre Player */}
        <div
          ref={containerRef}
          className="relative w-full rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl flex flex-col group"
        >
          {/* Main Video Frame */}
          <div className="relative w-full aspect-video max-h-[640px] bg-slate-950 flex items-center justify-center overflow-hidden">
            <video
              ref={videoRef}
              src={activeClip.src}
              poster={activeClip.poster}
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              onTimeUpdate={handleTimeUpdate}
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
              onLoadedData={() => setIsBuffering(false)}
              className="w-full h-full object-cover"
            />

            {/* Buffering Indicator */}
            {isBuffering && (
              <div className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/30 text-cyan-400 text-xs font-mono backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>STREAMING FOOTAGE</span>
              </div>
            )}

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Telemetry HUD Overlay (Top-Left) */}
            <div className="absolute top-6 left-6 p-3.5 rounded-xl bg-slate-950/85 border border-white/10 backdrop-blur-xl hidden sm:flex flex-col gap-1.5 text-left">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold border-b border-white/10 pb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>FPV TELEMETRY</span>
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                <span className="text-slate-500">OPTICS: </span>{activeClip.telemetry.lens}
              </div>
              <div className="text-[11px] font-mono text-slate-300">
                <span className="text-slate-500">ALTITUDE: </span>{activeClip.telemetry.altitude}
              </div>
              <div className="text-[11px] font-mono text-cyan-300">
                <span className="text-slate-500">PACE: </span>{activeClip.telemetry.speedEstimate}
              </div>
            </div>

            {/* Center Play Watermark on Pause */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-cyan-400/90 flex items-center justify-center shadow-[0_0_40px_rgba(0,240,255,0.6)] text-black hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </button>
            )}

            {/* Bottom Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-3">
              {/* Progress Scrub Bar */}
              <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-cyan-400 shadow-[0_0_10px_#00f0ff] transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2.5 rounded-full bg-cyan-400 text-black hover:bg-cyan-300 transition-colors shadow-lg cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                  </button>

                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-white font-display tracking-tight">
                      {activeClip.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {activeClip.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
                    {activeClip.attribution.creator} ({activeClip.attribution.license})
                  </span>
                  <button
                    onClick={toggleFullscreen}
                    className="p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors cursor-pointer"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Video Clip Switcher Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-3 bg-slate-950 border-t border-white/10">
            {ROAD_CLIPS.map((clip, idx) => {
              const isSelected = activeClipIndex === idx;
              return (
                <button
                  key={clip.id}
                  onClick={() => setActiveClipIndex(idx)}
                  className={`p-3 rounded-xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                      : 'bg-slate-950/50 border-white/5 hover:border-white/20 hover:bg-slate-900/50'
                  }`}
                >
                  <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                    SCENE 0{idx + 1}
                  </span>
                  <h4 className="text-xs font-bold text-white font-display truncate mt-1">
                    {clip.vehicle}
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono mt-1">
                    {clip.attribution.license}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
