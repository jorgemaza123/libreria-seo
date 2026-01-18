"use client"

import Image from 'next/image';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'María García',
    role: 'Dueña de negocio',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Excelente servicio! Me ayudaron con los trámites de mi negocio y la atención fue rapidísima. Los recomiendo al 100%.',
    date: 'Hace 2 días',
    service: 'Trámites Online',
  },
  {
    id: 2,
    name: 'Carlos Mendoza',
    role: 'Estudiante universitario',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Los mejores precios en útiles escolares de todo SJL. La sublimación de mi polo quedó increíble, muy buena calidad.',
    date: 'Hace 1 semana',
    service: 'Sublimación',
  },
  {
    id: 3,
    name: 'Ana Lucía Pérez',
    role: 'Profesora',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Siempre vengo aquí para mis impresiones y copias. El servicio es rápido y el precio es muy accesible. ¡Muy recomendado!',
    date: 'Hace 3 días',
    service: 'Impresiones',
  },
  {
    id: 4,
    name: 'Roberto Sánchez',
    role: 'Emprendedor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Me repararon la laptop súper rápido y a un precio justo. El técnico fue muy profesional y me explicó todo el proceso.',
    date: 'Hace 5 días',
    service: 'Soporte Técnico',
  },
  {
    id: 5,
    name: 'Patricia Flores',
    role: 'Contadora',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Me ayudaron con todos mis trámites de SUNAT sin complicaciones. El personal es muy amable y conocen bien su trabajo.',
    date: 'Hace 1 semana',
    service: 'Trámites Online',
  },
  {
    id: 6,
    name: 'Diego Vargas',
    role: 'Diseñador gráfico',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'La calidad de impresión es excelente. Mis diseños quedaron perfectos y los colores son muy fieles. Volveré siempre.',
    date: 'Hace 4 días',
    service: 'Impresiones',
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  // Get visible testimonials for carousel
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonios" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-primary" />
            Lo que dicen nuestros clientes
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4">
            Más de <span className="text-gradient">500+ clientes</span> satisfechos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            No lo decimos nosotros, lo dicen nuestros clientes. Lee sus experiencias reales.
          </p>
          
          {/* Google Rating */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="flex items-center gap-1 bg-card px-4 py-2 rounded-full shadow-sm">
              <span className="font-bold">Google</span>
              <span className="text-yellow-500 ml-2">★★★★★</span>
              <span className="text-sm font-bold">4.9</span>
              <span className="text-xs text-muted-foreground">(523 reseñas)</span>
            </div>
          </div>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
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

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className={`bg-card rounded-2xl p-6 shadow-lg card-elevated transition-all duration-500 ${
                  index === 1 ? 'md:scale-105 md:shadow-xl border-2 border-primary/20' : ''
                }`}
              >
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-4">
                  <Quote className="w-8 h-8 text-primary/30" />
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {testimonial.service}
                  </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                {/* Date */}
                <p className="text-xs text-muted-foreground mt-4">{testimonial.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
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

        {/* CTA */}
        <div className="text-center mt-12">
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