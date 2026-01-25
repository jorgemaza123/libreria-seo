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
  Shield,
  MessageCircle,
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
  'border-blue-400/50',
  'border-violet-400/50',
  'border-pink-400/50',
  'border-emerald-400/50',
  'border-amber-400/50',
  'border-teal-400/50',
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
    <section
      id="servicios"
      className="py-12 md:py-16 lg:py-20 bg-background"
      aria-labelledby="services-title"
    >
      <div className="container mx-auto px-4 sm:px-6">

        {/* Header */}
        <header className="text-center mb-8 lg:mb-12 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold">
            Nuestros Servicios
          </span>
          <h2
            id="services-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold"
          >
            Más que una <span className="text-primary">Librería</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas en un solo lugar
          </p>
        </header>

        {/* Grid de Servicios - Responsive */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6"
          role="list"
        >
          {activeServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || BookOpen;
            const borderClass = borderColors[index % borderColors.length];
            const gradientClass = iconGradients[index % iconGradients.length];

            return (
              <article
                key={service.id}
                role="listitem"
                className={`
                  group relative flex flex-col
                  bg-card rounded-2xl
                  border-2 ${borderClass}
                  p-5 sm:p-6
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                  hover:-translate-y-1
                `}
              >
                {/* Icon */}
                <div
                  className={`
                    w-14 h-14 sm:w-16 sm:h-16
                    rounded-xl
                    bg-gradient-to-br ${gradientClass}
                    flex items-center justify-center
                    shadow-md
                    transition-transform duration-300
                    group-hover:scale-110
                  `}
                  aria-hidden="true"
                >
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>

                {/* Content */}
                <div className="mt-4 flex-grow">
                  <h3 className="font-bold text-lg sm:text-xl leading-tight mb-2">
                    {service.name}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-3">
                    {service.shortDescription || service.description}
                  </p>
                </div>

                {/* Footer con Precio y Botón */}
                <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between gap-3">
                  <span className="text-primary font-bold text-base sm:text-lg">
                    {service.price || 'Consultar'}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="min-h-[44px] px-4 font-semibold group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() =>
                      window.open(
                        getWhatsAppUrl(`¡Hola! Me interesa el servicio de ${service.name}.`),
                        '_blank'
                      )
                    }
                    aria-label={`Consultar sobre ${service.name} por WhatsApp`}
                  >
                    Consultar
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Principal */}
        <div className="text-center mt-10 lg:mt-14">
          <div className="bg-muted/50 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-lg sm:text-xl font-bold mb-2">
              ¿No encuentras lo que buscas?
            </h3>
            <p className="text-muted-foreground mb-4">
              Escríbenos y te ayudamos con cualquier servicio
            </p>
            <Button
              size="lg"
              className="min-h-[56px] px-8 text-lg font-bold shadow-lg hover:scale-105 transition-transform"
              asChild
            >
              <a
                href={getWhatsAppUrl('Hola, quiero información sobre sus servicios')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>

      </div>
    </section>
  );
}
