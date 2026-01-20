"use client"

import { Printer, Laptop, FileCheck, Palette, ArrowRight, Shirt, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';

const services = [
  {
    id: 1,
    name: 'Impresiones y Copias',
    description: 'Impresiones a color, B/N, copias, anillados, escaneos.',
    price: 'Desde S/ 0.10',
    icon: Printer,
    color: 'from-blue-500 to-blue-600',
    popular: true,
  },
  {
    id: 2,
    name: 'Soporte Técnico',
    description: 'Reparación de laptops, PCs, formateo, mantenimiento.',
    price: 'Desde S/ 30',
    icon: Laptop,
    color: 'from-violet-500 to-violet-600',
    popular: false,
  },
  {
    id: 3,
    name: 'Sublimación',
    description: 'Polos, tazas, gorras, llaveros personalizados.',
    price: 'Desde S/ 15',
    icon: Shirt,
    color: 'from-pink-500 to-pink-600',
    popular: true,
  },
  {
    id: 4,
    name: 'Trámites Online',
    description: 'SUNAT, ATU, RENIEC, AFP, brevetes y más.',
    price: 'Desde S/ 15',
    icon: FileCheck,
    color: 'from-emerald-500 to-emerald-600',
    popular: false,
  },
  {
    id: 5,
    name: 'Diseño Gráfico',
    description: 'Logos, banners, tarjetas, invitaciones.',
    price: 'Desde S/ 20',
    icon: Palette,
    color: 'from-amber-500 to-amber-600',
    popular: false,
  },
  {
    id: 6,
    name: 'Recargas y Pagos',
    description: 'Recargas celulares, pagos de servicios.',
    price: 'Sin comisión',
    icon: Smartphone,
    color: 'from-teal-500 to-teal-600',
    popular: false,
  },
];

export function ServicesSection() {
  const { getWhatsAppUrl } = useWhatsApp();

  const handleServiceClick = (serviceName: string) => {
    window.open(
      getWhatsAppUrl(`¡Hola! Me interesa el servicio de ${serviceName}. ¿Pueden darme más información?`),
      '_blank'
    );
  };

  return (
    <section id="servicios" className="py-12 sm:py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold">
            💼 Servicios Adicionales
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold">
            Más que una <span className="text-primary">Librería</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Todo lo que necesitas en un solo lugar. Ahorra tiempo y dinero.
          </p>
        </div>

        {/* Services Grid - Mobile First */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.name)}
                className="group relative bg-card rounded-2xl p-6 shadow-sm card-elevated text-left transition-all hover:ring-2 hover:ring-primary/50 flex flex-col h-full"
              >
                {/* Popular badge */}
                {service.popular && (
                  <div className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-[10px] font-bold">
                    POPULAR
                  </div>
                )}

                <div className="space-y-4 flex flex-col h-full">
                  {/* Icon with gradient */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-grow">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Price highlight */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-primary font-bold text-lg">
                      {service.price}
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-8 sm:mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-primary to-cta hover:from-primary/90 hover:to-cta/90 text-primary-foreground font-bold shadow-lg"
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