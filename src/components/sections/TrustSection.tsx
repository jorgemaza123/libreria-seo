"use client"

import { useMemo } from 'react';
import { Store, Truck, CreditCard, Shield, Clock, MapPin, Award } from 'lucide-react';
import { useSiteContent } from '@/contexts/SiteContentContext';

// Diccionario de Iconos
const ICON_MAP: Record<string, any> = {
  Store,
  Truck,
  CreditCard,
  Shield,
  Clock,
  MapPin,
  Award,
};

// Datos por Defecto
const DEFAULT_TRUST = [
  {
    iconName: 'Store',
    title: 'Años',
    subtitle: 'en el barrio',
    highlight: true,
    hasLogos: false
  },
  {
    iconName: 'Truck',
    title: 'Envío por vecinos',
    subtitle: 'de confianza',
    highlight: false,
    hasLogos: false
  },
  {
    iconName: 'CreditCard',
    title: 'Yape y Plin',
    subtitle: 'aceptados',
    highlight: false,
    hasLogos: true,
  },
  {
    iconName: 'Shield',
    title: 'Productos',
    subtitle: 'originales',
    highlight: false,
    hasLogos: false
  },
  {
    iconName: 'Clock',
    title: 'Entrega',
    subtitle: 'mismo día',
    highlight: false,
    hasLogos: false
  },
  {
    iconName: 'MapPin',
    title: 'Frente a',
    subtitle: 'Estela Maris',
    highlight: false,
    hasLogos: false
  },
];

export function TrustSection() {
  const { effectiveContent } = useSiteContent();

  const trustItems = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbTrust = (effectiveContent as any)?.trust;

    if (dbTrust && Array.isArray(dbTrust) && dbTrust.length > 0) {
      return dbTrust;
    }
    return DEFAULT_TRUST;
  }, [effectiveContent]);

  return (
    <section
      className="py-8 md:py-10 bg-secondary text-secondary-foreground overflow-hidden"
      aria-label="Razones para confiar en nosotros"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header opcional para móvil */}
        <div className="text-center mb-6 lg:hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            <Award className="w-4 h-4" />
            ¿Por qué elegirnos?
          </div>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5"
          role="list"
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {trustItems.map((item: any, index: number) => {
            const IconComponent = ICON_MAP[item.iconName] || ICON_MAP['Store'];

            return (
              <div
                key={index}
                role="listitem"
                className={`
                  flex flex-col items-center text-center
                  p-4 sm:p-5 rounded-2xl transition-all
                  ${item.highlight
                    ? 'bg-primary/20 border-2 border-primary/30'
                    : 'hover:bg-secondary-foreground/5 border-2 border-transparent'
                  }
                `}
              >
                {/* Icono */}
                <div
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-3
                    ${item.highlight
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary-foreground/10 text-secondary-foreground'
                    }
                  `}
                  aria-hidden="true"
                >
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                {/* Textos - Tamaños mejorados */}
                <p className="font-bold text-base sm:text-lg leading-tight">
                  {item.title}
                </p>
                <p className="text-secondary-foreground/80 text-sm sm:text-base mt-0.5">
                  {item.subtitle}
                </p>

                {/* Yape/Plin logos - Más grandes y legibles */}
                {item.hasLogos && (
                  <div className="flex gap-2 mt-3">
                    <div className="px-3 py-1.5 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                      YAPE
                    </div>
                    <div className="px-3 py-1.5 bg-teal-500 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-md">
                      PLIN
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
