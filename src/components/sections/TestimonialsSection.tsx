"use client"

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
  isActive: boolean; // Cambiado a camelCase para coincidir con la API
}

export function TestimonialsSection() {
  // Estado inicial VACÍO (Sin mocks)
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 1. Cargar Reseñas Reales
  useEffect(() => {
    setMounted(true);
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews', { next: { revalidate: 0 } });
        if (res.ok) {
          const data = await res.json();
          // Filtramos solo las activas
          const activeReviews = (data || []).filter((r: Review) => r.isActive);
          setReviews(activeReviews);
        }
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      }
    }
    loadReviews();
  }, []);

  // 2. Lógica del Carrusel
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

  // Obtener las visibles (Manejo circular)
  const getVisibleTestimonials = () => {
    if (reviews.length === 0) return [];
    
    // Si hay menos de 3 reseñas, las mostramos todas sin repetir
    if (reviews.length < 3) {
        return reviews;
    }

    const visible = [];
    const count = 3; 
    for (let i = 0; i < count; i++) {
      const index = (currentIndex + i) % reviews.length;
      visible.push(reviews[index]);
    }
    return visible;
  };

  if (!mounted) return null;

  // Si no hay reseñas activas, ocultamos la sección
  if (reviews.length === 0) return null;

  return (
    <section id="testimonios" className="py-12 md:py-16 bg-muted/30 relative overflow-hidden">
       {/* Decoración de fondo */}
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary" />
            Lo que dicen nuestros clientes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Confianza que se siente
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación.
          </p>
          
          {/* Google Rating Badge */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-1 bg-card px-4 py-2 rounded-full shadow-sm border border-border/50">
              <span className="font-bold">Google</span>
              <span className="text-yellow-500 ml-2">★★★★★</span>
              <span className="text-sm font-bold">4.9</span>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons (Solo si hay más de 3 reseñas) */}
          {reviews.length > 3 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 hidden md:flex bg-card shadow-lg hover:bg-primary hover:text-primary-foreground"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 hidden md:flex bg-card shadow-lg hover:bg-primary hover:text-primary-foreground"
                onClick={goToNext}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Testimonials Grid/Flex */}
          <div className={`grid gap-6 px-4 md:px-8 ${
              reviews.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : 
              reviews.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' : 
              'grid-cols-1 md:grid-cols-3'
          }`}>
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={`bg-card rounded-2xl p-6 shadow-lg card-elevated transition-all duration-500 border border-border/50 ${
                  index === 1 && reviews.length >= 3 ? 'md:scale-105 md:shadow-xl border-primary/20 relative z-10' : ''
                }`}
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-primary/30" />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {testimonial.service || 'Cliente'}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground mb-6 leading-relaxed min-h-[80px] line-clamp-4">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 border-t border-border pt-4">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-foreground leading-tight">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-2 text-right">{testimonial.date || 'Reciente'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        {reviews.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
                <button
                key={index}
                onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                    ? 'w-8 bg-primary'
                    : 'w-2 bg-primary/30 hover:bg-primary/50'
                }`}
                />
            ))}
            </div>
        )}

        {/* CTA */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">¿Ya eres nuestro cliente?</p>
          <Button variant="outline" size="lg" className="group" asChild>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Star className="mr-2 h-4 w-4 group-hover:fill-yellow-400 group-hover:text-yellow-400 transition-colors" />
              Déjanos tu reseña en Google
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}