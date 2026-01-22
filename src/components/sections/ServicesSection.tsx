"use client"

import {
  Printer,
  Laptop,
  FileCheck,
  Palette,
  ArrowRight,
  Shirt,
  Smartphone,
  BookOpen,
  Code,
  LucideIcon,
  Wrench,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { useSiteContent } from '@/contexts/SiteContentContext';

/* ---------------------------------- */
/* Icon Map */
/* ---------------------------------- */
const iconMap: Record<string, LucideIcon> = {
  Printer,
  Laptop,
  FileCheck,
  Palette,
  Shirt,
  Smartphone,
  BookOpen,
  Code,
  Wrench,
  Shield,
};

const borderColors = [
  'border-blue-400/40',
  'border-violet-400/40',
  'border-pink-400/40',
  'border-emerald-400/40',
  'border-amber-400/40',
  'border-teal-400/40',
];

const iconGradients = [
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-pink-500 to-pink-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-teal-500 to-teal-600',
];

export function ServicesSection() {
  const { getWhatsAppUrl } = useWhatsApp();
  const { services } = useSiteContent();

  const activeServices = services
    .filter((s) => s.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (activeServices.length === 0) return null;

  return (
    <section id="servicios" className="py-10 md:py-16 bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-6 space-y-2">
          <span className="inline-block px-3 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold">
            Servicios
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold">
            Más que una <span className="text-primary">Librería</span>
          </h2>
        </div>

        {/* Grid → 2 por fila en mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {activeServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || BookOpen;
            const borderClass = borderColors[index % borderColors.length];
            const gradientClass = iconGradients[index % iconGradients.length];

            return (
              <button
                key={service.id}
                onClick={() =>
                  window.open(
                    getWhatsAppUrl(
                      `¡Hola! Me interesa el servicio de ${service.name}.`
                    ),
                    '_blank'
                  )
                }
                className={`
                  group relative flex flex-col text-left
                  bg-card rounded-xl
                  border ${borderClass}
                  p-4 sm:p-5
                  transition-all duration-300
                  hover:-translate-y-0.5 hover:shadow-md
                  active:scale-95
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-11 h-11 sm:w-12 sm:h-12
                    rounded-lg
                    bg-gradient-to-br ${gradientClass}
                    flex items-center justify-center
                    shadow-sm
                    transition-transform
                    group-hover:scale-110
                  `}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>

                {/* Content */}
                <div className="mt-3 flex-grow">
                  <h3 className="font-semibold text-sm sm:text-base leading-tight">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm mt-1 line-clamp-2">
                    {service.shortDescription || service.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-primary font-bold text-sm sm:text-base">
                    {service.price || 'Cotizar'}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-cta text-primary-foreground font-bold shadow-lg"
            asChild
          >
            <a
              href={getWhatsAppUrl('Hola, quiero información sobre sus servicios')}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar Servicio
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>

      </div>
    </section>
  );
}
