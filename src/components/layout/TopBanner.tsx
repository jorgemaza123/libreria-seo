"use client"

import { useState, useEffect } from 'react';
import { X, MapPin, Truck, Phone, ChevronDown } from 'lucide-react';

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Comunicar el estado al CSS custom property para que otros componentes puedan usarlo
  useEffect(() => {
    document.documentElement.style.setProperty('--top-banner-height', isVisible ? '44px' : '0px');
    return () => {
      document.documentElement.style.setProperty('--top-banner-height', '0px');
    };
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsAnimating(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`sticky top-0 left-0 right-0 z-[60] py-2.5 px-4 bg-gradient-to-r from-primary via-primary to-cta text-primary-foreground transition-all duration-300 ${
        isAnimating ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between gap-4">
        {/* Main Message */}
        <div className="flex items-center gap-4 md:gap-6 text-sm md:text-base font-semibold flex-1 justify-center">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
            <span className="hidden sm:inline">Ubicados frente al <strong>Colegio Estela Maris</strong></span>
            <span className="sm:hidden text-xs">Frente a Estela Maris</span>
          </div>

          <span className="hidden md:inline text-primary-foreground/40">|</span>

          <div className="hidden md:flex items-center gap-2">
            <Truck className="w-5 h-5 flex-shrink-0" />
            <span>Delivery Seguro en todo VMT</span>
          </div>
        </div>

        {/* Phone - Always visible */}
        <a
          href="tel:+51932371532"
          className="hidden lg:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors font-bold flex-shrink-0"
        >
          <Phone className="w-4 h-4" />
          932 371 532
        </a>

        {/* Close button - más visible */}
        <button
          onClick={handleClose}
          className="flex items-center gap-1 px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full transition-all text-xs font-medium flex-shrink-0 group"
          aria-label="Cerrar banner"
        >
          <span className="hidden sm:inline">Cerrar</span>
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        </button>
      </div>

      {/* Indicador visual de que hay más contenido abajo */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <ChevronDown className="w-4 h-4 text-primary animate-bounce opacity-50" />
      </div>
    </div>
  );
}