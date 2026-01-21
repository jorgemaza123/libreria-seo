"use client"

import { useMemo } from 'react';
import Image from 'next/image';
import { Check, Star, Crown, Leaf, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';
import { useSiteContent } from '@/contexts/SiteContentContext'; // <--- CONECTADO

// 1. Datos de respaldo (Fallback) por si no has creado Packs en el Admin
const fallbackPacks = [
  {
    id: 'economico',
    name: 'Económico',
    tagline: 'Ahorro Máximo',
    tagIcon: Leaf,
    tagColor: 'bg-accent text-accent-foreground',
    price: 89,
    priceDisplay: 'S/ 89',
    description: 'Productos genéricos de buena calidad para familias que buscan el mejor precio.',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400&h=300&fit=crop',
    features: ['Cuadernos genéricos', 'Lápices y colores básicos', 'Borrador y tajador', 'Regla y goma'],
    highlighted: false,
  },
  {
    id: 'estandar',
    name: 'Estándar',
    tagline: 'Más Vendido',
    tagIcon: Star,
    tagColor: 'bg-primary text-primary-foreground',
    price: 149,
    priceDisplay: 'S/ 149',
    description: 'Marcas reconocidas con excelente relación calidad-precio. La elección de la mayoría.',
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=300&fit=crop',
    features: ['Cuadernos Loro, Justus', 'Colores Faber Castell', 'Lápices Mongol', 'Plumones Artesco', 'Estuche completo'],
    highlighted: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    tagline: 'Máxima Durabilidad',
    tagIcon: Crown,
    tagColor: 'bg-cta text-cta-foreground',
    price: 249,
    priceDisplay: 'S/ 249',
    description: 'Las mejores marcas del mercado. Útiles que duran todo el año escolar.',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop',
    features: ['Cuadernos Standford Premium', 'Colores Prismacolor', 'Set completo Faber Castell', 'Mochila ergonómica', 'Lonchera térmica'],
    highlighted: false,
  },
];

export function SchoolPacksSection() {
  const { getWhatsAppUrl } = useWhatsApp();
  const { effectiveContent } = useSiteContent();

  const handleSelectPack = (packName: string) => {
    window.open(
      getWhatsAppUrl(`¡Hola! Me interesa el ${packName} para mi lista escolar. ¿Pueden darme más información?`),
      '_blank'
    );
  };

  // 2. FUSIÓN DE DATOS INTELIGENTE
  const packs = useMemo(() => {
    // Buscamos productos que tengan "Pack" en el nombre
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
const dbProducts = ((effectiveContent as any)?.products || []) as any[];
    const packProducts = dbProducts.filter(p => 
      p.is_active && p.name.toLowerCase().includes('pack')
    );

    // Si encontramos packs en la DB, los transformamos al formato visual
    if (packProducts.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return packProducts.map((product: any) => {
        const nameLower = product.name.toLowerCase();
        
        // Lógica automática para asignar íconos y colores según el nombre o precio
        let style = { icon: Star, color: 'bg-primary text-primary-foreground', tagline: 'Recomendado' };
        
        if (nameLower.includes('econ') || nameLower.includes('básico') || product.price < 100) {
           style = { icon: Leaf, color: 'bg-accent text-accent-foreground', tagline: 'Ahorro Máximo' };
        } else if (nameLower.includes('premium') || nameLower.includes('pro') || product.price > 200) {
           style = { icon: Crown, color: 'bg-cta text-cta-foreground', tagline: 'Máxima Calidad' };
        }

        // Convertimos la descripción (texto plano) en lista de características (separando por saltos de línea)
        const featuresList = product.description 
          ? product.description.split('\n').filter((line: string) => line.trim().length > 0).slice(0, 6)
          : ['Ver detalles en tienda'];

        return {
          id: product.id,
          name: product.name.replace('Pack', '').trim(), // Limpiamos el nombre para que no diga "Pack Pack"
          tagline: style.tagline,
          tagIcon: style.icon,
          tagColor: style.color,
          price: product.price,
          priceDisplay: `S/ ${product.price}`,
          description: featuresList[0] || 'Pack escolar completo', // Usamos la primera línea como descripción corta si no hay más
          image: product.image || fallbackPacks[1].image, // Imagen por defecto si falta
          features: featuresList,
          highlighted: product.is_featured || nameLower.includes('estándar') // Destacamos si es featured o estándar
        };
      }).sort((a, b) => a.price - b.price); // Ordenamos por precio
    }

    // Si no hay packs en DB, devolvemos el fallback
    return fallbackPacks;
  }, [effectiveContent]);

  return (
    <section id="packs" className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold animate-fade-down">
            🎒 Packs Escolares
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold animate-fade-up">
            Elige tu Pack y <span className="text-primary">Ahorra Tiempo</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Armamos tu lista completa según tu presupuesto. 
            <strong className="text-foreground"> Solo envíanos la lista del colegio.</strong>
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packs.map((pack, index) => {
            const TagIcon = pack.tagIcon;
            return (
              <div
                key={pack.id}
                className={`
                  relative bg-card rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl animate-fade-up
                  ${pack.highlighted 
                    ? 'ring-4 ring-primary scale-105 z-10' 
                    : 'hover:scale-[1.02]'
                  }
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={pack.image}
                    alt={`Pack ${pack.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
                  
                  {/* Tag */}
                  <div className={`absolute top-4 left-4 ${pack.tagColor} px-3 py-1.5 rounded-full flex items-center gap-1.5 text-sm font-bold shadow-lg z-10`}>
                    <TagIcon className="w-4 h-4" />
                    {pack.tagline}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-2xl font-heading font-bold text-foreground">
                      Pack {pack.name}
                    </h3>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-primary">
                      {pack.priceDisplay}
                    </span>
                    <span className="text-muted-foreground text-sm">
                      aprox.
                    </span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-4">
                    {pack.features.map((feature: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-accent flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPack(pack.name)}
                    className={`w-full font-bold ${
                      pack.highlighted
                        ? 'bg-gradient-to-r from-primary to-cta hover:from-primary/90 hover:to-cta/90'
                        : ''
                    }`}
                    variant={pack.highlighted ? 'default' : 'outline'}
                    size="lg"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Cotizar Pack
                  </Button>
                </div>

                {/* Recommended badge for highlighted */}
                {pack.highlighted && (
                  <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground px-4 py-1 text-xs font-bold rounded-bl-xl rounded-tr-3xl shadow-lg z-20">
                    ⭐ RECOMENDADO
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 animate-fade-up" style={{ animationDelay: '0.4s' }}>
          <p className="text-muted-foreground mb-4">
            ¿Tienes una lista específica? Envíala y te armamos el presupuesto exacto.
          </p>
          <Button
            size="lg"
            className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground font-bold shadow-lg"
            asChild
          >
            <a
              href={getWhatsAppUrl('Hola! Quiero enviar mi lista escolar para cotización')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              Enviar Mi Lista por WhatsApp
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}