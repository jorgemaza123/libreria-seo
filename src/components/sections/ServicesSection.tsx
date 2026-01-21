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
  Wrench, // <--- NUEVO: Para soporte técnico
  Shield  // <--- NUEVO: Por si usas escudo en trámites
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { useSiteContent } from '@/contexts/SiteContentContext';

// Mapeo de nombres de la BD a Componentes Visuales
const iconMap: Record<string, LucideIcon> = {
  Printer: Printer,
  Laptop: Laptop,
  FileCheck: FileCheck, // Usado para Trámites
  Palette: Palette,     // Usado para Diseño
  Shirt: Shirt,         // Usado para Sublimación
  Smartphone: Smartphone,
  BookOpen: BookOpen,   // Usado para Monografías
  Code: Code,
  Wrench: Wrench,       // Usado para Soporte Técnico
  Shield: Shield
};

const defaultColors = [
  'from-blue-500 to-blue-600',
  'from-violet-500 to-violet-600',
  'from-pink-500 to-pink-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-teal-500 to-teal-600',
];

export function ServicesSection() {
  const { getWhatsAppUrl } = useWhatsApp();
  // Conectamos a los datos reales de Supabase
  const { services } = useSiteContent();

  const handleServiceClick = (serviceName: string) => {
    window.open(
      getWhatsAppUrl(`¡Hola! Me interesa el servicio de ${serviceName}. ¿Pueden darme más información?`),
      '_blank'
    );
  };

  // Filtrar activos y ordenar
  const activeServices = services
    .filter(s => s.isActive)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Si no hay servicios, no mostramos nada
  if (activeServices.length === 0) return null;

  return (
    <section id="servicios" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-bold animate-fade-down">
            Servicios Adicionales
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold animate-fade-up">
            Más que una <span className="text-primary">Librería</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up">
            Todo lo que necesitas en un solo lugar. Ahorra tiempo y dinero.
          </p>
        </div>

        {/* Grid de Servicios */}
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {activeServices.map((service, index) => {
            // Buscamos el icono en el mapa, si no existe usamos BookOpen
            const IconComponent = iconMap[service.icon] || BookOpen;
            const colorClass = defaultColors[index % defaultColors.length];

            return (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.name)}
                className="group relative bg-card rounded-2xl p-6 shadow-sm card-elevated text-left transition-all hover:ring-2 hover:ring-primary/50 flex flex-col h-full animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="space-y-4 flex flex-col h-full">
                  {/* Icono con gradiente */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>

                  {/* Contenido */}
                  <div className="flex-grow">
                    <h3 className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
                      {service.shortDescription || service.description}
                    </p>
                  </div>

                  {/* Precio y Flecha */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-primary font-bold text-lg">
                      {service.price || 'Cotizar'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Botón Final */}
        <div className="text-center mt-8 sm:mt-12 animate-fade-up">
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