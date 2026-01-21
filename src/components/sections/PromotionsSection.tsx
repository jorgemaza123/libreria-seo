"use client"

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Flame, Gift, Zap, ArrowRight, MessageCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/constants';

// --- INTERFAZ LOCAL (Coincide con tu API) ---
interface Promotion {
  id: string
  title: string
  description: string
  image: string
  discount: number
  discountType: 'percentage' | 'fixed'
  startDate: string
  endDate: string
  isActive: boolean
}

// Flash deals (Hardcoded por ahora como pediste)
const flashDeals = [
  {
    id: 'flash-1',
    title: 'Pack Escolar Completo',
    originalPrice: 150,
    salePrice: 89,
    discount: 41,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=300&h=300&fit=crop',
    sold: 73,
    stock: 100,
  },
  {
    id: 'flash-2',
    title: 'Sublimación: 3 Polos',
    originalPrice: 120,
    salePrice: 75,
    discount: 38,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=300&h=300&fit=crop',
    sold: 45,
    stock: 60,
  },
];

export function PromotionsSection() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mounted, setMounted] = useState(false);

  // 1. CARGAR PROMOCIONES REALES DE LA API
  useEffect(() => {
    setMounted(true); // Para evitar hidratación incorrecta
    async function fetchPromos() {
      try {
        const res = await fetch('/api/promotions', { next: { revalidate: 0 } });
        if (res.ok) {
          const data = await res.json();
          // Solo mostramos las activas
          const active = (data.promotions || []).filter((p: Promotion) => p.isActive);
          setPromotions(active);
        }
      } catch (error) {
        console.error("Error cargando promociones:", error);
      }
    }
    fetchPromos();
  }, []);

  const nextSlide = useCallback(() => {
    if (promotions.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % promotions.length);
  }, [promotions.length]);

  const prevSlide = () => {
    if (promotions.length === 0) return;
    setCurrentSlide(
      (prev) => (prev - 1 + promotions.length) % promotions.length
    );
  };

  // Auto-advance slides
  useEffect(() => {
    if (promotions.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, promotions.length]);

  if (!mounted) return null; // Evitar flash de hidratación
  
  // Si no hay promociones activas, no mostramos nada
  if (promotions.length === 0) return null;

  return (
    <section id="promociones" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* --- CARRUSEL PRINCIPAL (Base de Datos) --- */}
        <div className="relative max-w-5xl mx-auto mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-xl md:text-2xl font-heading font-bold">Promociones de Temporada</h3>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-2xl bg-muted relative group">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {promotions.map((promo) => (
                <div key={promo.id} className="w-full flex-shrink-0 relative">
                  <div className="aspect-[21/9] md:aspect-[21/8] relative overflow-hidden bg-gray-900">
                    
                    {/* SOLUCIÓN AL ERROR DE IMAGEN VACÍA */}
                    {promo.image ? (
                        <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        priority
                        className="object-cover opacity-60"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-80" />
                    )}
                    
                    {/* Overlay degradado siempre visible para legibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="p-8 md:p-12 max-w-2xl space-y-4">
                        {promo.discount > 0 && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-base font-bold animate-pulse shadow-lg">
                            <Flame className="w-4 h-4" />
                            {promo.discountType === 'percentage'
                              ? `${promo.discount}% DESCUENTO`
                              : `AHORRA S/${promo.discount}`}
                          </span>
                        )}
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight">
                          {promo.title}
                        </h3>
                        <p className="text-white/90 text-sm md:text-lg max-w-lg line-clamp-3">
                          {promo.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
                          <Button size="lg" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-none font-bold" asChild>
                            <a
                              href={getWhatsAppUrl(`Hola! Me interesa la promoción: ${promo.title}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="mr-2 w-5 h-5" />
                              Lo quiero
                            </a>
                          </Button>
                          {(promo.endDate) && (
                             <div className="flex items-center gap-2 text-white/80 text-sm bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
                               <Clock className="w-4 h-4" />
                               Válido hasta: {promo.endDate}
                             </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {promotions.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 text-white backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- FLASH DEALS (Hardcoded / Estáticos) --- */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl md:text-2xl font-heading font-bold">Ofertas Relámpago</h3>
              <span className="px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full text-xs font-bold uppercase tracking-wider">
                Stock Limitado
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute top-2 left-2 z-10 px-2 py-1 bg-destructive text-destructive-foreground rounded text-xs font-bold">
                  -{deal.discount}%
                </div>

                <div className="aspect-square relative bg-muted">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-3 space-y-2">
                  <h4 className="font-semibold text-sm line-clamp-2 leading-tight">
                    {deal.title}
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-destructive">
                      S/{deal.salePrice}
                    </span>
                    <span className="text-xs text-muted-foreground line-through mb-1">
                      S/{deal.originalPrice}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div 
                        className="bg-orange-500 h-full rounded-full" 
                        style={{ width: `${(deal.sold / deal.stock) * 100}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-right">
                    {deal.sold} vendidos
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}