"use client"

import { useState } from 'react';
import { X, MapPin, Truck, Phone } from 'lucide-react';

export function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] py-2.5 px-4 bg-gradient-to-r from-primary via-primary to-cta text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center gap-6 relative">
        {/* Main Message */}
        <div className="flex items-center gap-6 text-sm md:text-base font-semibold">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline">📍 Ubicados frente al <strong>Colegio Estela Maris</strong></span>
            <span className="sm:hidden">📍 Frente a Estela Maris</span>
          </div>
          
          <span className="hidden md:inline text-primary-foreground/40">|</span>
          
          <div className="hidden md:flex items-center gap-2">
            <Truck className="w-5 h-5" />
            <span>🛵 Delivery Seguro en todo VMT</span>
          </div>
        </div>

        {/* Phone - Always visible */}
        <a 
          href="tel:+51987654321" 
          className="hidden lg:flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors font-bold"
        >
          <Phone className="w-4 h-4" />
          987 654 321
        </a>

        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/20 rounded-full transition-colors"
          aria-label="Cerrar banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}