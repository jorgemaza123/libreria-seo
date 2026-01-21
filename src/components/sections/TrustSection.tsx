"use client"

import { useMemo } from 'react';
import { Store, Truck, CreditCard, Shield, Clock, MapPin } from 'lucide-react';
import { useSiteContent } from '@/contexts/SiteContentContext'; // <--- CONECTADO

// 1. Diccionario de Iconos
// Esto permite que la Base de Datos guarde el nombre "Store" y React sepa qué pintar
const ICON_MAP: Record<string, any> = {
  Store,
  Truck,
  CreditCard,
  Shield,
  Clock,
  MapPin
};

// 2. Datos por Defecto (Tu diseño original)
const DEFAULT_TRUST = [
  {
    iconName: 'Store', // Guardamos el nombre como string
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
    hasLogos: true, // Lógica especial para mostrar logos
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

  // 3. Fusión de Datos
  const trustItems = useMemo(() => {
    // Intentamos leer 'trust' de la base de datos
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbTrust = (effectiveContent as any)?.trust;

    // Si hay datos en la DB, los usamos. Si no, usamos el default.
    if (dbTrust && Array.isArray(dbTrust) && dbTrust.length > 0) {
      return dbTrust;
    }
    return DEFAULT_TRUST;
  }, [effectiveContent]);

  return (
    <section className="py-6 bg-secondary text-secondary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {trustItems.map((item: any, index: number) => {
            // Buscamos el componente del ícono en nuestro mapa
            // Si viene de DB como string "Store", lo convierte al icono real.
            // Si no encuentra el icono, usa Store por defecto.
            const IconComponent = ICON_MAP[item.iconName] || ICON_MAP['Store'];
            
            return (
              <div
                key={index}
                className={`
                  flex flex-col items-center text-center p-4 rounded-xl transition-all
                  ${item.highlight 
                    ? 'bg-primary/20 border border-primary/30' 
                    : 'hover:bg-secondary-foreground/5'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-xl flex items-center justify-center mb-3
                  ${item.highlight 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary-foreground/10 text-secondary-foreground'
                  }
                `}>
                  <IconComponent className="w-7 h-7" />
                </div>
                <p className="font-bold text-lg leading-tight">{item.title}</p>
                <p className="text-secondary-foreground/70 text-sm">{item.subtitle}</p>
                
                {/* Yape/Plin logos */}
                {item.hasLogos && (
                  <div className="flex gap-2 mt-2">
                    <div className="w-10 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-[8px] font-bold shadow-sm">
                      YAPE
                    </div>
                    <div className="w-10 h-6 bg-teal-500 rounded flex items-center justify-center text-white text-[8px] font-bold shadow-sm">
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