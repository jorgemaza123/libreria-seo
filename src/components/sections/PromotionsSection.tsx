"use client"

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Flame, Gift, Zap, MessageCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/constants';

// --- INTERFAZ LOCAL ---
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

// Flash deals (Hardcoded)
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

  useEffect(() => {
    setMounted(true);
    async function fetchPromos() {
      try {
        const res = await fetch('/api/promotions', { next: { revalidate: 0 } });
        if (res.ok) {
          const data = await res.json();
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
    setCurrentSlide((prev) => (prev - 1 + promotions.length) % promotions.length);
  };

  useEffect(() => {
    if (promotions.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, promotions.length]);

  if (!mounted) return null;
  if (promotions.length === 0) return null;

  return (
    <section
      id="promociones"
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden"
      aria-labelledby="promotions-title"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header Principal */}
        <header className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-semibold">
            <Tag className="w-4 h-4" />
            Ofertas Especiales
          </span>
          <h2
            id="promotions-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-bold"
          >
            <span className="text-destructive">Promociones</span> del Mes
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras ofertas por tiempo limitado
          </p>
        </header>

        {/* --- CARRUSEL PRINCIPAL --- */}
        <div className="relative max-w-5xl mx-auto mb-12 lg:mb-16">
          <div className="flex items-center gap-3 mb-5">
            <Gift className="w-6 h-6 text-primary" />
            <h3 className="text-lg sm:text-xl font-bold">Promociones de Temporada</h3>
          </div>

          <div className="overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl bg-muted relative group">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              role="region"
              aria-label="Carrusel de promociones"
            >
              {promotions.map((promo, index) => (
                <div
                  key={promo.id}
                  className="w-full flex-shrink-0 relative"
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} de ${promotions.length}: ${promo.title}`}
                >
                  <div className="aspect-[16/9] sm:aspect-[21/9] relative overflow-hidden bg-gray-900">
                    {promo.image ? (
                      <Image
                        src={promo.image}
                        alt={promo.title}
                        fill
                        priority={index === 0}
                        className="object-cover opacity-60"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-80" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="p-6 sm:p-8 lg:p-12 max-w-2xl space-y-4">
                        {promo.discount > 0 && (
                          <span className="inline-flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-full text-sm sm:text-base font-bold shadow-lg">
                            <Flame className="w-4 h-4" />
                            {promo.discountType === 'percentage'
                              ? `${promo.discount}% DESCUENTO`
                              : `AHORRA S/${promo.discount}`}
                          </span>
                        )}
                        <h3 className="text-xl sm:text-3xl lg:text-4xl font-heading font-bold text-white leading-tight">
                          {promo.title}
                        </h3>
                        <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-lg line-clamp-2 sm:line-clamp-3">
                          {promo.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-2">
                          <Button
                            size="lg"
                            className="min-h-[52px] bg-green-600 hover:bg-green-700 text-white font-bold text-base"
                            asChild
                          >
                            <a
                              href={getWhatsAppUrl(`Hola! Me interesa la promoción: ${promo.title}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="mr-2 w-5 h-5" />
                              Lo Quiero
                            </a>
                          </Button>
                          {promo.endDate && (
                            <div className="flex items-center gap-2 text-white/90 text-sm bg-black/40 px-4 py-2 rounded-full">
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

            {/* Navigation Arrows - Grandes y Accesibles */}
            {promotions.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  aria-label="Promoción anterior"
                  className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-black/50 text-white backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Siguiente promoción"
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-black/50 text-white backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all opacity-70 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Indicadores de slide */}
            {promotions.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    aria-label={`Ir a promoción ${index + 1}`}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- FLASH DEALS --- */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-lg sm:text-xl font-bold">Ofertas Relámpago</h3>
              <span className="hidden sm:inline-block px-3 py-1.5 bg-yellow-500/10 text-yellow-600 rounded-full text-sm font-bold">
                Stock Limitado
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {flashDeals.map((deal) => (
              <article
                key={deal.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                {/* Badge descuento */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1.5 bg-destructive text-destructive-foreground rounded-full text-sm font-bold">
                  -{deal.discount}%
                </div>

                {/* Imagen */}
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                  <h4 className="font-bold text-base sm:text-lg line-clamp-2 leading-tight">
                    {deal.title}
                  </h4>

                  {/* Precios */}
                  <div className="flex items-end gap-2">
                    <span className="text-xl sm:text-2xl font-bold text-destructive">
                      S/{deal.salePrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through mb-0.5">
                      S/{deal.originalPrice}
                    </span>
                  </div>

                  {/* Barra de stock */}
                  <div>
                    <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-orange-500 h-full rounded-full transition-all"
                        style={{ width: `${(deal.sold / deal.stock) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {deal.sold} vendidos de {deal.stock}
                    </p>
                  </div>

                  {/* Botón de acción */}
                  <Button
                    className="w-full min-h-[48px] font-bold bg-primary hover:bg-primary/90"
                    asChild
                  >
                    <a
                      href={getWhatsAppUrl(`Hola! Me interesa: ${deal.title} a S/${deal.salePrice}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Consultar
                    </a>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
