import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowDown, ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';

interface HeroVideoOption {
  id: string;
  title: string;
  subtitle: string;
  src: string;
  poster: string;
  vehicle: string;
}

const HERO_VIDEOS: HeroVideoOption[] = [
  {
    id: 'porsche-alpine',
    title: 'Porsche 911 Targa Alpine Pass',
    subtitle: '4K FPV Drone mountain tracking footage',
    src: '/videos/porsche-hero.webm',
    poster: '/posters/hero-poster.jpg',
    vehicle: 'Porsche 911 Targa',
  },
  {
    id: 'ferrari-canyon',
    title: 'Ferrari F430 Spider Canyon Chase',
    subtitle: 'High-speed coastal tracking shot',
    src: '/videos/ferrari-drive.webm',
    poster: '/posters/ferrari-poster.jpg',
    vehicle: 'Ferrari F430 Spider',
  },
  {
    id: 'hypercar-f80',
    title: 'Monterey Hypercar Showcase',
    subtitle: 'Factory aerodynamic walkaround footage',
    src: '/videos/hypercar-f80.webm',
    poster: '/posters/ferrari-poster.jpg',
    vehicle: 'Ferrari F80 Concept',
  },
  {
    id: 'diablo-v12',
    title: 'Lamborghini Diablo Restomod',
    subtitle: 'Atmospheric V12 engineering tribute',
    src: '/videos/lamborghini-diablo.webm',
    poster: '/posters/lamborghini-poster.jpg',
    vehicle: 'Lamborghini Diablo',
  },
];

export const Hero: React.FC = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inViewRef = useRef<boolean>(true);

  const activeVideo = HERO_VIDEOS[activeVideoIndex];

  // IntersectionObserver: automatically pause video when scrolled out of viewport
  useEffect(() => {
    const sectionEl = sectionRef.current;
    if (!sectionEl) return;

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
          // Offscreen: pause immediately to conserve GPU & video decoder bandwidth
          videoRef.current.pause();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, [isPlaying]);

  // Video track change
  useEffect(() => {
    if (videoRef.current) {
      setIsVideoLoaded(false);
      setIsBuffering(true);
      videoRef.current.load();
      if (inViewRef.current && isPlaying) {
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [activeVideoIndex]);

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

  return (
    <section
      ref={sectionRef}
      className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden bg-black"
    >
      {/* Background Cinematic Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          poster={activeVideo.poster}
          onLoadedData={() => {
            setIsVideoLoaded(true);
            setIsBuffering(false);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
            isVideoLoaded ? 'opacity-85' : 'opacity-40'
          }`}
        >
          <source src={activeVideo.src} type="video/webm" />
          {/* Fallback image if video fails to play */}
          <img
            src={activeVideo.poster}
            alt={activeVideo.title}
            className="w-full h-full object-cover"
          />
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute top-6 right-6 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-cyan-400/30 text-cyan-400 text-xs font-mono backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>BUFFERING HD</span>
          </div>
        )}

        {/* Cinematic Vignette & Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/40 to-[#08090c]/90 pointer-events-none" />
        <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full pt-20 flex flex-col items-center text-center">
        {/* Verification Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-cyan-400/40 text-cyan-400 text-xs font-mono tracking-widest uppercase mb-6 backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.2)] animate-in fade-in slide-in-from-bottom duration-500">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>AUTHENTIC AUTOMOTIVE ASSETS // 100% REAL VEHICLES</span>
        </div>

        {/* Main Title Heading with Clipping and Masking typography */}
        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black font-display tracking-tighter text-white uppercase leading-[0.9] mb-4 select-none">
          MOTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-slate-400">GARAGE</span>
        </h1>

        {/* Subtitle / Manifesto */}
        <p className="max-w-2xl text-slate-300 text-sm md:text-lg font-sans font-light tracking-wide mb-8 leading-relaxed">
          Real cars. Authentic 3D models. Genuine manufacturer engineering. Experience the pinnacle of automotive craftsmanship with real-time 360° inspection and track dynamics.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
          <a
            href="#studio"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold font-mono tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(0,240,255,0.4)] hover:shadow-[0_0_40px_rgba(0,240,255,0.7)] hover:scale-105 cursor-pointer"
          >
            <span>LAUNCH 360° STUDIO</span>
            <ChevronRight className="w-4 h-4" />
          </a>

          <a
            href="#collection"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/20 text-white text-sm font-mono tracking-wider backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/60 cursor-pointer"
          >
            <span>THE COLLECTION</span>
          </a>
        </div>

        {/* Footage Switcher & Interactive Video Controls Bar */}
        <div className="w-full max-w-4xl p-3 rounded-2xl bg-slate-950/85 border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Active footage description */}
          <div className="flex items-center gap-3 text-left w-full md:w-auto">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-cyan-400 text-black hover:bg-cyan-300 transition-colors shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer"
              title={isPlaying ? 'Pause Footage' : 'Play Footage'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
            <button
              onClick={toggleMute}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 border border-white/10 transition-colors shrink-0 cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                ACTIVE FOOTAGE // {activeVideo.vehicle}
              </span>
              <span className="text-xs font-semibold text-white tracking-tight truncate max-w-[220px]">
                {activeVideo.title}
              </span>
            </div>
          </div>

          {/* Video Scene Switcher Buttons */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto justify-start md:justify-end">
            {HERO_VIDEOS.map((vid, idx) => (
              <button
                key={vid.id}
                onClick={() => setActiveVideoIndex(idx)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-mono tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeVideoIndex === idx
                    ? 'bg-white/20 text-white border border-cyan-400 font-bold shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-white bg-white/5 border border-transparent'
                }`}
              >
                0{idx + 1} // {vid.vehicle.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Down Scroll Indicator */}
      <a
        href="#collection"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors group cursor-pointer"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase text-slate-500 group-hover:text-cyan-400 transition-colors">
          EXPLORE
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce text-cyan-400" />
      </a>
    </section>
  );
};
