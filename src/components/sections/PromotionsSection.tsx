"use client"

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Clock, Flame, Gift, Zap, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSiteContent } from '@/contexts/SiteContentContext';
import { getWhatsAppUrl } from '@/lib/constants';

// Countdown hook - Solo calcula después de que la página carga en el navegador
function useCountdown(hours: number) {
  const [mounted, setMounted] = useState(false);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  // Marcar como montado y establecer el tiempo final solo en el cliente
  useEffect(() => {
    setMounted(true);
    const end = new Date();
    end.setHours(end.getHours() + hours);
    setEndTime(end);
  }, [hours]);

  // Calcular el tiempo restante
  const calculateTimeLeft = useCallback(() => {
    if (!endTime) return { hours: 0, minutes: 0, seconds: 0 };
    const difference = endTime.getTime() - new Date().getTime();
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24) + Math.floor(difference / (1000 * 60 * 60 * 24)) * 24,
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }, [endTime]);

  // Iniciar el intervalo solo después de montar
  useEffect(() => {
    if (!mounted || !endTime) return;

    // Calcular inmediatamente al montar
    setTimeLeft(calculateTimeLeft());

    // Luego actualizar cada segundo
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [mounted, endTime, calculateTimeLeft]);

  return { timeLeft, mounted };
}

// Flash deals data - estos se pueden mover a la base de datos en el futuro
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
  {
    id: 'flash-3',
    title: 'Mantenimiento PC',
    originalPrice: 80,
    salePrice: 45,
    discount: 44,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=300&h=300&fit=crop',
    sold: 28,
    stock: 50,
  },
  {
    id: 'flash-4',
    title: '100 Impresiones Color',
    originalPrice: 50,
    salePrice: 30,
    discount: 40,
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=300&h=300&fit=crop',
    sold: 156,
    stock: 200,
  },
];

export function PromotionsSection() {
  const { promotions } = useSiteContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const activePromotions = promotions.filter((p) => p.isActive);
  const { timeLeft, mounted } = useCountdown(8); // 8 hours flash sale

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % activePromotions.length);
  }, [activePromotions.length]);

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + activePromotions.length) % activePromotions.length
    );
  };

  // Auto-advance slides
  useEffect(() => {
    if (activePromotions.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, activePromotions.length]);

  if (activePromotions.length === 0) return null;

  return (
    <section id="promociones" className="py-12 md:py-16 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-destructive/5 via-transparent to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-destructive/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header with urgency */}
        <div className="text-center mb-12 space-y-6">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-full animate-pulse">
            <Flame className="w-5 h-5" />
            <span className="font-bold uppercase tracking-wide">Ofertas que vuelan</span>
            <Flame className="w-5 h-5" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold">
          </h2>

          
        </div>

        {/* Flash Deals Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h3 className="text-xl md:text-2xl font-heading font-bold">Flash Deals</h3>
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-medium">
                Solo hoy
              </span>
            </div>
            <Button variant="ghost" className="group">
              Ver todo <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {flashDeals.map((deal) => (
              <div
                key={deal.id}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Discount badge */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-destructive text-destructive-foreground rounded-full text-sm font-bold">
                  -{deal.discount}%
                </div>

                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <Image
                    src={deal.image}
                    alt={deal.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h4 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                    {deal.title}
                  </h4>

                  {/* Prices */}
                  <div className="flex items-center gap-2">
                    <span className="text-lg md:text-xl font-bold text-destructive">
                      S/ {deal.salePrice}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      S/ {deal.originalPrice}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-destructive to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${(deal.sold / deal.stock) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-destructive font-semibold">{deal.sold}</span> vendidos
                    </p>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-destructive to-orange-500 hover:from-destructive/90 hover:to-orange-500/90"
                    asChild
                  >
                    <a
                      href={getWhatsAppUrl(`Hola! Me interesa: ${deal.title} a S/${deal.salePrice}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="mr-2 w-4 h-4" />
                      ¡Lo quiero!
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Gift className="w-6 h-6 text-primary" />
              <h3 className="text-xl md:text-2xl font-heading font-bold">Promociones Especiales</h3>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-2xl bg-muted">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {activePromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="w-full flex-shrink-0 relative"
                >
                  <div className="aspect-[21/9] md:aspect-[21/8] relative overflow-hidden">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      sizes="(max-width: 1200px) 100vw, 1200px"
                      className="object-cover"
                      priority={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/70 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 flex items-center">
                      <div className="p-8 md:p-12 max-w-xl space-y-4">
                        {promo.discount && promo.discount > 0 && (
                          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-destructive text-destructive-foreground rounded-full text-lg font-bold animate-pulse">
                            <Flame className="w-5 h-5" />
                            {promo.discountType === 'percentage'
                              ? `${promo.discount}% OFF`
                              : `S/${promo.discount} OFF`}
                          </span>
                        )}
                        <h3 className="text-2xl md:text-4xl lg:text-5xl font-heading font-bold text-white">
                          {promo.title}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg">
                          {promo.description}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
                          <Button size="lg" className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground border-none" asChild>
                            <a
                              href={getWhatsAppUrl(`Hola! Me interesa la promoción: ${promo.title}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <MessageCircle className="mr-2 w-5 h-5" />
                              Aprovechar ahora
                            </a>
                          </Button>
                          <div className="flex items-center gap-2 text-white/80 text-sm bg-white/10 px-4 py-2 rounded-full">
                            <Clock className="w-4 h-4" />
                            Tiempo limitado
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {activePromotions.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card hover:scale-110 transition-all shadow-lg z-20"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card hover:scale-110 transition-all shadow-lg z-20"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {activePromotions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-primary w-10'
                    : 'bg-muted-foreground/30 w-3 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>
        </div>

       
      </div>
    </section>
  );
}
