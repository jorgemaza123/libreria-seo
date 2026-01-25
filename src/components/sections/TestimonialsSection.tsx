"use client";

import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight, User, MessageSquare } from 'lucide-react';
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
    <section
      id="testimonios"
      className="py-12 md:py-16 lg:py-20 relative overflow-hidden bg-muted/40"
      aria-labelledby="testimonials-title"
    >
      {/* Fondo luminoso */}
      <div className="absolute -top-32 -right-32 w-[420px] h-[420px] bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] bg-violet-500/10 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <header className="text-center mb-10 space-y-3">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-violet-500/15 text-primary font-semibold text-sm shadow-sm">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            Testimonios Reales
          </span>
          <h2
            id="testimonials-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold"
          >
            Clientes que <span className="text-primary">Confían</span> en Nosotros
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Opiniones auténticas que reflejan nuestro compromiso
          </p>
        </header>

        {/* Carrusel */}
        <div className="relative" role="region" aria-label="Carrusel de testimonios">
          {reviews.length > 3 && (
            <>
              <Button
                variant="outline"
                onClick={goToPrev}
                aria-label="Testimonio anterior"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 z-10
                           w-11 h-11 sm:w-12 sm:h-12 rounded-full
                           bg-card/90 backdrop-blur shadow-lg hover:shadow-primary/30"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="outline"
                onClick={goToNext}
                aria-label="Siguiente testimonio"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 z-10
                           w-11 h-11 sm:w-12 sm:h-12 rounded-full
                           bg-card/90 backdrop-blur shadow-lg hover:shadow-primary/30"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </>
          )}

          <div className={`grid gap-5 lg:gap-6 px-2 sm:px-4 md:px-8 ${
            reviews.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' :
            reviews.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
            'grid-cols-1 md:grid-cols-3'
          }`}>
            {getVisibleTestimonials().map((t, index) => (
              <article
                key={`${t.id}-${index}`}
                className={`relative rounded-2xl p-5 sm:p-6 bg-card/90 backdrop-blur border
                transition-all duration-500
                ${index === 1 && reviews.length >= 3
                  ? 'md:scale-105 border-primary/40 shadow-xl shadow-primary/20'
                  : 'border-border/50 shadow-md hover:shadow-lg'}`}
              >
                {/* Quote icon */}
                <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-primary/20 mb-3" aria-hidden="true" />

                {/* Rating */}
                <div className="flex gap-1 mb-4" role="img" aria-label={`Calificación: ${t.rating} de 5 estrellas`}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <blockquote className="text-base sm:text-lg text-foreground mb-6 leading-relaxed line-clamp-4">
                  "{t.comment}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-border pt-4">
                  {t.avatar ? (
                    <Image
                      src={t.avatar}
                      alt={`Foto de ${t.name}`}
                      width={52}
                      height={52}
                      className="rounded-full ring-2 ring-primary/30 object-cover"
                    />
                  ) : (
                    <div className="w-13 h-13 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/30">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-sm text-muted-foreground mt-3 text-right">
                  {t.date || 'Cliente reciente'}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Indicadores - Más grandes y accesibles */}
        {reviews.length > 3 && (
          <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Indicadores de testimonios">
            {reviews.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(i);
                }}
                className={`h-3 rounded-full transition-all ${
                  i === currentIndex
                    ? 'w-10 bg-primary shadow-md shadow-primary/40'
                    : 'w-3 bg-primary/30 hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-10">
          <Button
            size="lg"
            variant="outline"
            className="min-h-[52px] px-6 text-base font-bold group hover:border-primary/50 hover:bg-primary/5"
            onClick={() => window.open('https://g.page/r/CTEzRDOAaeWtEBM/review', '_blank')}
          >
            <MessageSquare className="mr-2 h-5 w-5 group-hover:text-primary transition-colors" />
            Déjanos tu Opinión en Google
          </Button>
        </div>
      </div>
    </section>
  );
}
