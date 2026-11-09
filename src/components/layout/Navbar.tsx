import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenLicenses?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLicenses }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Collection', href: '#collection', num: '01' },
    { label: '360° Studio', href: '#studio', num: '02' },
    { label: 'Engineering Details', href: '#details', num: '03' },
    { label: 'On The Road', href: '#on-road', num: '04' },
    { label: 'Configurator', href: '#your-build', num: '05' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#08090c]/90 border-b border-white/10 backdrop-blur-xl py-3 shadow-2xl'
          : 'bg-gradient-to-b from-black/80 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Brand Monogram */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-cyan-400 flex items-center justify-center font-display font-black text-cyan-400 text-sm tracking-tighter group-hover:bg-cyan-400 group-hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            MG
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-lg md:text-xl tracking-wider text-white flex items-center gap-1">
              MOTION<span className="text-cyan-400">GARAGE</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase -mt-1 hidden sm:block">
              REAL CARS. REAL MODELS.
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-cyan-400 transition-colors"
            >
              <span className="text-[10px] text-slate-500 group-hover:text-cyan-400/70 transition-colors">
                {link.num}
              </span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenLicenses && (
            <button
              onClick={onOpenLicenses}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Asset Registry</span>
            </button>
          )}

          <a
            href="#your-build"
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-bold font-mono tracking-wider transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            <span>BUILD VEHICLE</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-slate-200"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#08090c]/98 border-b border-white/10 px-6 py-6 backdrop-blur-2xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2 text-sm font-mono uppercase text-slate-200 border-b border-white/5"
              >
                <span>{link.label}</span>
                <span className="text-cyan-400 text-xs">{link.num}</span>
              </a>
            ))}

            <div className="pt-4 flex flex-col gap-2.5">
              {onOpenLicenses && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLicenses();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-slate-300"
                >
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Asset Licenses & Attributions
                </button>
              )}
              <a
                href="#your-build"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-cyan-400 text-black font-bold font-mono text-xs shadow-lg"
              >
                BUILD YOUR SPEC
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
