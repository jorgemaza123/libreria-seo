"use client";

import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Review {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
  isActive: boolean;
}

export function TestimonialsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews', { next: { revalidate: 0 } });
        if (res.ok) {
          const data = await res.json();
          const activeReviews = (data || []).filter((r: Review) => r.isActive);
          setReviews(activeReviews);
        }
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      }
    }
    loadReviews();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || reviews.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, reviews.length]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const getVisibleTestimonials = () => {
    if (reviews.length < 3) return reviews;
    return [0, 1, 2].map(i => reviews[(currentIndex + i) % reviews.length]);
  };

  if (!mounted || reviews.length === 0) return null;

  return (
    <section id="testimonios" className="py-14 md:py-20 relative overflow-hidden bg-muted/40">
      {/* Fondo luminoso */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-violet-500/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-primary/15 to-violet-500/15 text-primary font-semibold mb-4 shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Testimonios reales
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-extrabold">
            Clientes que <span className="text-primary">confían</span> en nosotros
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-3">
            Opiniones auténticas que reflejan nuestro compromiso.
          </p>
        </div>

        {/* Carrusel */}
        <div className="relative">
          {reviews.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-card/80 backdrop-blur shadow-lg hover:shadow-primary/30"
                onClick={goToPrev}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-card/80 backdrop-blur shadow-lg hover:shadow-primary/30"
                onClick={goToNext}
              >
                <ChevronRight />
              </Button>
            </>
          )}

          <div className={`grid gap-6 px-4 md:px-8 ${
            reviews.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
            reviews.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {getVisibleTestimonials().map((t, index) => (
              <div
                key={`${t.id}-${index}`}
                className={`relative rounded-2xl p-6 bg-card/80 backdrop-blur border
                transition-all duration-500
                ${index === 1 && reviews.length >= 3
                  ? 'md:scale-105 border-primary/40 shadow-xl shadow-primary/20'
                  : 'border-border/50 shadow-md hover:shadow-lg'}`}
              >
                {/* Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                <Quote className="w-8 h-8 text-primary/30 mb-3" />

                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-foreground mb-6 leading-relaxed line-clamp-4">
                  “{t.comment}”
                </p>

                <div className="flex items-center gap-4 border-t border-border pt-4">
                  {t.avatar ? (
                    <Image src={t.avatar} alt={t.name} width={48} height={48}
                      className="rounded-full ring-2 ring-primary/30 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/30">
                      <User className="text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 text-right">
                  {t.date || 'Reciente'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        {reviews.length > 3 && (
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-2 rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-8 bg-primary shadow-md shadow-primary/40'
                    : 'w-2 bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="outline"
            className="group hover:border-primary/50 hover:bg-primary/5"
            onClick={() => window.open('https://g.page/r/CTEzRDOAaeWtEBM/review', '_blank')}
          >
            <Star className="mr-2 h-4 w-4 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-colors" />
            Califícanos en Google
          </Button>
        </div>
      </div>
    </section>
  );
}
