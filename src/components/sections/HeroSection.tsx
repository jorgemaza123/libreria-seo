"use client"

import { useState } from 'react';
import {
  Backpack,
  Laptop,
  FileText,
  Gift,
  Star,
  MapPin,
  Truck,
  MessageCircle,
  Phone,
  Code,
  Printer,
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWhatsApp } from '@/hooks/use-whatsapp';

type CategoryKey = 'escolar' | 'tecnologia' | 'tramites' | 'regalos';

interface CategoryData {
  id: CategoryKey;
  label: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  title: string;
  description: string;
  buttonText: string;
  buttonEmoji: string;
  features: string[];
  whatsappMessage: string;
}

const categories: CategoryData[] = [
  {
    id: 'escolar',
    label: 'Escolar',
    icon: <Backpack className="w-5 h-5" />,
    emoji: '🎒',
    color: 'text-amber-400',
    bgColor: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/50',
    title: 'Sube tu lista o cotiza tus maquetas y manualidades',
    description: 'Útiles escolares, papelería, cuadernos, mochilas y todo lo que necesitas para el colegio.',
    buttonText: 'Subir Pedido Escolar',
    buttonEmoji: '📷',
    features: ['Listas escolares completas', 'Maquetas y manualidades', 'Útiles de oficina'],
    whatsappMessage: '¡Hola! 📚 Quiero cotizar mi lista escolar. Adjunto la foto de mi lista.',
  },
  {
    id: 'tecnologia',
    label: 'Tecnología',
    icon: <Laptop className="w-5 h-5" />,
    emoji: '💻',
    color: 'text-cyan-400',
    bgColor: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500/50',
    title: 'Soporte técnico de computadoras y Desarrollo de Sistemas Web',
    description: 'Reparación de laptops, PCs, formateo, desarrollo web profesional y sistemas a medida.',
    buttonText: 'Cotizar Soporte/Web',
    buttonEmoji: '🔧',
    features: ['Reparación de laptops/PCs', 'Desarrollo web y sistemas', 'Mantenimiento preventivo'],
    whatsappMessage: '¡Hola! 💻 Necesito soporte técnico o cotizar un desarrollo web.',
  },
  {
    id: 'tramites',
    label: 'Trámites',
    icon: <FileText className="w-5 h-5" />,
    emoji: '📄',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500/50',
    title: 'RENIEC, SUNAT, Antecedentes y Copias al instante',
    description: 'Gestión de trámites online, impresiones, copias, escaneos y documentación oficial.',
    buttonText: 'Gestionar Trámite',
    buttonEmoji: '📄',
    features: ['Trámites RENIEC y SUNAT', 'Antecedentes policiales', 'Impresiones y copias'],
    whatsappMessage: '¡Hola! 📄 Necesito ayuda con un trámite online.',
  },
  {
    id: 'regalos',
    label: 'Regalos',
    icon: <Gift className="w-5 h-5" />,
    emoji: '🎁',
    color: 'text-pink-400',
    bgColor: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500/50',
    title: 'Sublimados y detalles personalizados para toda ocasión',
    description: 'Tazas, polos, cojines personalizados y regalos únicos para cualquier celebración.',
    buttonText: 'Personalizar Regalo',
    buttonEmoji: '🎨',
    features: ['Tazas y polos sublimados', 'Cojines personalizados', 'Regalos corporativos'],
    whatsappMessage: '¡Hola! 🎁 Quiero cotizar un regalo personalizado.',
  },
];

export function HeroSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('escolar');
  const { getWhatsAppUrl, getPhoneUrl } = useWhatsApp();

  const currentCategory = categories.find(c => c.id === activeCategory)!;

  const handleCTAClick = () => {
    window.open(getWhatsAppUrl(currentCategory.whatsappMessage), '_blank');
  };

  return (
    <section
      id="hero"
      className="relative min-h-[85vh] flex items-center pt-8 pb-16 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 hero-pattern" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cta/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Title & Description */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 text-primary rounded-full text-sm font-bold border border-primary/30">
                <Star className="w-4 h-4 fill-current" />
                
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6 animate-fade-up stagger-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-5xl font-heading font-extrabold leading-[1.1] tracking-tight">
                Soluciones Integrales{' '}
                <span className="text-primary">frente a tu Colegio</span>:{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Librería, Tecnología
                </span>{' '}
                y Trámites
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed">
                Ahorra tiempo. Resolvemos tus{' '}
                <span className="text-foreground font-semibold">tareas escolares</span>,{' '}
                <span className="text-foreground font-semibold">trámites urgentes</span> y{' '}
                <span className="text-foreground font-semibold">problemas tecnológicos</span> en un solo lugar.
              </p>
            </div>

            {/* Location Badge */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start animate-fade-up stagger-2">
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-border">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Frente al Colegio Estela Maris</span>
              </div>
              <div className="flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-2 rounded-full shadow-sm border border-border">
                <Truck className="w-4 h-4 text-whatsapp" />
                <span className="text-sm font-semibold">Delivery en VMT</span>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-up stagger-3">
              <Button
                size="lg"
                className="bg-whatsapp hover:bg-whatsapp/90 text-whatsapp-foreground font-bold shadow-lg shadow-whatsapp/20"
                asChild
              >
                <a
                  href={getWhatsAppUrl('Hola! Quiero información sobre sus productos y servicios')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  WhatsApp Directo
                </a>
              </Button>
              <Button variant="outline" size="lg" className="font-bold border-2" asChild>
                <a href={getPhoneUrl()}>
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </a>
              </Button>
            </div>
          </div>

          {/* Right Side - Interactive Panel */}
          <div className="animate-fade-up stagger-2">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-cta/20 to-transparent rounded-full blur-2xl" />

              {/* Glassmorphism Panel */}
              <div className="relative bg-card/60 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Animated Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory.bgColor} opacity-10 transition-all duration-700`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />

                {/* Category Pills/Tabs - Enhanced for accessibility */}
                <div className="relative p-4 border-b border-border/30">
                  <div className="flex flex-wrap gap-2.5 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`
                          relative flex items-center gap-2 px-5 py-3 rounded-full font-bold text-base
                          transition-all duration-300 transform overflow-hidden
                          ${activeCategory === category.id
                            ? `bg-gradient-to-r ${category.bgColor} text-white shadow-lg scale-105 ring-2 ring-white/20`
                            : 'bg-card/90 text-foreground/80 dark:text-muted-foreground hover:text-foreground hover:bg-card hover:scale-102 border-2 border-border/60 shadow-sm'
                          }
                        `}
                      >
                        {/* Active indicator animation */}
                        {activeCategory === category.id && (
                          <span className="absolute inset-0 bg-white/10 animate-pulse" />
                        )}
                        <span className={`relative transition-transform duration-300 text-lg ${activeCategory === category.id ? 'scale-110' : ''}`}>
                          {category.emoji}
                        </span>
                        <span className="relative">{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="relative p-6 md:p-8 min-h-[350px]">
                  {/* Category Icon with enhanced animation */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      {/* Glow ring */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory.bgColor} rounded-2xl blur-xl opacity-40 animate-pulse`} />
                      <div className={`
                        relative w-24 h-24 rounded-2xl bg-gradient-to-br ${currentCategory.bgColor}
                        flex items-center justify-center shadow-2xl transform transition-all duration-500
                        hover:scale-110 hover:rotate-3
                      `}>
                        {activeCategory === 'escolar' && <Backpack className="w-12 h-12 text-white drop-shadow-lg" />}
                        {activeCategory === 'tecnologia' && <Code className="w-12 h-12 text-white drop-shadow-lg" />}
                        {activeCategory === 'tramites' && <Printer className="w-12 h-12 text-white drop-shadow-lg" />}
                        {activeCategory === 'regalos' && <Palette className="w-12 h-12 text-white drop-shadow-lg" />}
                      </div>
                    </div>
                  </div>

                  {/* Title & Description - Enhanced for better readability */}
                  <div className="text-center space-y-4 mb-6">
                    <h3 className="text-xl md:text-2xl lg:text-[1.65rem] font-heading font-extrabold text-foreground leading-tight drop-shadow-sm">
                      {currentCategory.title}
                    </h3>
                    <p className="text-foreground/80 dark:text-foreground/70 text-base md:text-lg font-medium max-w-sm mx-auto leading-relaxed">
                      {currentCategory.description}
                    </p>
                  </div>

                  {/* Features List - Enhanced with better contrast and larger text */}
                  <div className="flex flex-wrap justify-center gap-2.5 mb-6">
                    {currentCategory.features.map((feature, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 rounded-full text-sm font-bold bg-amber-100 dark:bg-card/80 backdrop-blur-sm border-2 border-amber-600 dark:border-primary/50 text-amber-900 dark:text-primary shadow-sm transition-all duration-300 hover:scale-105 animate-fade-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  {/* Main CTA Button - Enhanced */}
                  <Button
                    onClick={handleCTAClick}
                    size="lg"
                    className={`
                      w-full h-14 bg-gradient-to-r ${currentCategory.bgColor}
                      hover:opacity-90 hover:scale-[1.02] text-white font-bold text-lg
                      shadow-xl transition-all duration-300 group
                      relative overflow-hidden
                    `}
                  >
                    {/* Shine effect on hover */}
                    <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                    <span className="relative flex items-center justify-center gap-2">
                      <span className="text-xl group-hover:scale-110 transition-transform">{currentCategory.buttonEmoji}</span>
                      {currentCategory.buttonText}
                    </span>
                  </Button>

                  {/* Quick stats - Enhanced for better readability */}
                  <div className="flex justify-center gap-6 mt-4 text-sm text-foreground/70 dark:text-muted-foreground font-medium">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                      Respuesta inmediata
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      4.9 en atención
                    </span>
                  </div>
                </div>

                {/* Highlight for Technology - Enhanced */}
                {activeCategory !== 'tecnologia' && (
                  <div className="absolute top-4 right-4">
                    
                  </div>
                )}
              </div>

              {/* Floating Rating Card */}
              
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}