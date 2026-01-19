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
import { CONTACT, getWhatsAppUrl, getPhoneUrl } from '@/lib/constants';

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
  
  const currentCategory = categories.find(c => c.id === activeCategory)!;

  const handleCTAClick = () => {
    window.open(getWhatsAppUrl(currentCategory.whatsappMessage), '_blank');
  };

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center pt-28 pb-16 overflow-hidden"
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
                +20 años sirviendo a familias de VMT
              </div>
            </div>

            {/* Main Title */}
            <div className="space-y-6 animate-fade-up stagger-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.2rem] xl:text-5xl font-heading font-extrabold leading-[1.1] tracking-tight">
                Soluciones Integrales{' '}
                <span className="text-primary">frente a tu Colegio</span>:{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  Papelería, Tecnología
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
              {/* Glassmorphism Panel */}
              <div className="relative bg-card/40 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${currentCategory.bgColor} opacity-5 transition-all duration-500`} />
                
                {/* Category Pills/Tabs */}
                <div className="relative p-4 border-b border-border/50">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`
                          flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm
                          transition-all duration-300 transform
                          ${activeCategory === category.id 
                            ? `bg-gradient-to-r ${category.bgColor} text-white shadow-lg scale-105` 
                            : 'bg-card/60 text-muted-foreground hover:text-foreground hover:bg-card border border-border/50'
                          }
                        `}
                      >
                        <span>{category.emoji}</span>
                        <span>{category.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Content Area */}
                <div className="relative p-6 md:p-8 min-h-[350px]">
                  {/* Category Icon */}
                  <div className="flex justify-center mb-6">
                    <div className={`
                      w-24 h-24 rounded-2xl bg-gradient-to-br ${currentCategory.bgColor}
                      flex items-center justify-center shadow-xl transform transition-all duration-500
                      animate-scale-in
                    `}>
                      {activeCategory === 'escolar' && <Backpack className="w-12 h-12 text-white" />}
                      {activeCategory === 'tecnologia' && <Code className="w-12 h-12 text-white" />}
                      {activeCategory === 'tramites' && <Printer className="w-12 h-12 text-white" />}
                      {activeCategory === 'regalos' && <Palette className="w-12 h-12 text-white" />}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="text-center space-y-4 mb-6">
                    <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground leading-tight">
                      {currentCategory.title}
                    </h3>
                    <p className="text-muted-foreground text-sm md:text-base max-w-sm mx-auto">
                      {currentCategory.description}
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {currentCategory.features.map((feature, i) => (
                      <span 
                        key={i}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold bg-card border ${currentCategory.borderColor} ${currentCategory.color}`}
                      >
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  {/* Main CTA Button */}
                  <Button 
                    onClick={handleCTAClick}
                    size="lg" // Next.js UI no suele tener 'xl' por defecto, usa 'lg' o configúralo
                    className={`
                      w-full h-12 bg-gradient-to-r ${currentCategory.bgColor} 
                      hover:opacity-90 text-white font-bold text-lg 
                      shadow-xl transition-all duration-300
                    `}
                  >
                    <span className="mr-2 text-xl">{currentCategory.buttonEmoji}</span>
                    {currentCategory.buttonText}
                  </Button>
                </div>

                {/* Highlight for Technology */}
                {activeCategory !== 'tecnologia' && (
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => setActiveCategory('tecnologia')}
                      className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs font-bold rounded-full border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors animate-pulse"
                    >
                      <Laptop className="w-3 h-3" />
                      Soporte Tech
                    </button>
                  </div>
                )}
              </div>

              {/* Floating Stats Cards */}
              <div className="absolute -top-4 -left-4 bg-card rounded-2xl p-3 shadow-xl animate-float border border-border/50 hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-whatsapp/10 rounded-xl flex items-center justify-center">
                    <span className="text-lg">✅</span>
                  </div>
                  <div>
                    <p className="font-bold text-foreground text-sm">+500 familias</p>
                    <p className="text-xs text-muted-foreground">confían en nosotros</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-card rounded-2xl p-3 shadow-xl animate-float border border-border/50 hidden md:block" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">★★★★★</span>
                  <span className="font-bold text-sm">4.9</span>
                  <span className="text-xs text-muted-foreground">(523)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}