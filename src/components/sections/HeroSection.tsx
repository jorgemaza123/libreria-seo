"use client";

import { useState, useMemo } from "react";
import {
  Backpack,
  Code,
  Printer,
  Palette,
  MapPin,
  Truck,
  Star,
  MessageCircle,
  Phone,
  Send,
  Wrench,
  FileText,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useSiteContent } from "@/contexts/SiteContentContext";

type CategoryKey = "escolar" | "tecnologia" | "tramites" | "regalos";

/* ================= CONFIG ================= */

const CATEGORY_STYLES = {
  escolar: {
    emoji: "🎒",
    bgColor: "from-orange-500 to-amber-500",
    // Icono para el botón de acción
    actionIcon: <Send className="w-5 h-5" />,
    icon: <Backpack className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md" />,
  },
  tecnologia: {
    emoji: "💻",
    bgColor: "from-cyan-500 to-blue-600",
    actionIcon: <Wrench className="w-5 h-5" />,
    icon: <Code className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md" />,
  },
  tramites: {
    emoji: "📄",
    bgColor: "from-emerald-500 to-green-600",
    actionIcon: <FileText className="w-5 h-5" />,
    icon: <Printer className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md" />,
  },
  regalos: {
    emoji: "🎁",
    bgColor: "from-pink-500 to-rose-600",
    actionIcon: <Gift className="w-5 h-5" />,
    icon: <Palette className="w-10 h-10 lg:w-12 lg:h-12 text-white drop-shadow-md" />,
  },
};

const DEFAULT_HERO = {
  title: "Soluciones Integrales frente a tu Colegio",
  // Subtítulo más corto para móvil
  subtitle: "Ahorra tiempo. Útiles escolares, tecnología y trámites en un solo lugar.",
  subtitleShort: "Útiles, tecnología y trámites en un solo lugar",
  location: "Ubicados frente al Colegio Estela Maris",
  categories: {
    escolar: {
      title: "Útiles y Listas Escolares",
      // Texto simplificado y directo para adultos mayores
      buttonText: "Pedir por WhatsApp",
      features: ["Listas completas", "Maquetas", "Oficina"],
      whatsappMessage: "¡Hola! 📚 Quiero cotizar mi lista escolar.",
    },
    tecnologia: {
      title: "Soporte Técnico",
      buttonText: "Solicitar Ayuda",
      features: ["PC y laptops", "Sistemas web"],
      whatsappMessage: "¡Hola! 💻 Necesito soporte técnico.",
    },
    tramites: {
      title: "Trámites y Copias",
      buttonText: "Consultar Ahora",
      features: ["RENIEC", "SUNAT", "Copias"],
      whatsappMessage: "¡Hola! 📄 Necesito ayuda con un trámite.",
    },
    regalos: {
      title: "Regalos Personalizados",
      buttonText: "Hacer mi Pedido",
      features: ["Tazas", "Polos", "Fotos"],
      whatsappMessage: "¡Hola! 🎁 Quiero un regalo personalizado.",
    },
  },
};

export function HeroSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("escolar");

  const { getWhatsAppUrl, getPhoneUrl } = useWhatsApp();
  const { effectiveContent } = useSiteContent();

  const heroData = useMemo(() => {
    const dbHero: any = effectiveContent?.hero || {};
    const categories = (Object.keys(CATEGORY_STYLES) as CategoryKey[]).map((key) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      ...CATEGORY_STYLES[key],
      ...(dbHero.categories?.[key] || DEFAULT_HERO.categories[key]),
    }));

    return {
      title: dbHero.title || DEFAULT_HERO.title,
      subtitle: dbHero.subtitle || DEFAULT_HERO.subtitle,
      subtitleShort: dbHero.subtitleShort || DEFAULT_HERO.subtitleShort,
      location: dbHero.location || DEFAULT_HERO.location,
      categories,
    };
  }, [effectiveContent]);

  const current = heroData.categories.find((c) => c.id === activeCategory)!;

  return (
    <section
      className="relative bg-background pt-4 pb-6 lg:pt-16 lg:pb-0 lg:min-h-[85vh] flex lg:items-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* ===== Ambient Light (GPU Optimizado) ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-[300px] h-[300px] lg:-top-32 lg:-left-32 lg:w-[420px] lg:h-[420px] bg-primary/20 rounded-full blur-3xl transform-gpu will-change-transform opacity-60 lg:opacity-100" />
        <div className="absolute top-1/4 -right-20 w-[250px] h-[250px] lg:top-1/3 lg:-right-32 lg:w-[360px] lg:h-[360px] bg-fuchsia-500/20 rounded-full blur-3xl transform-gpu will-change-transform opacity-60 lg:opacity-100" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* ===== ENCABEZADO MÓVIL - Visible above the fold ===== */}
        <div className="lg:hidden text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-sm font-semibold mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span>Frente al Colegio Estela Maris</span>
          </div>
          {/* H1 VISIBLE EN MÓVIL - Crítico para SEO y UX */}
          <h1
            id="hero-title"
            className="text-2xl sm:text-3xl font-extrabold leading-tight mb-2"
          >
            {heroData.title}
          </h1>
          <p className="text-base text-muted-foreground">
            {heroData.subtitleShort}
          </p>
        </div>

        {/* ===== DESKTOP HEADER ===== */}
        <div className="hidden lg:flex justify-center mb-8 gap-6 text-sm font-medium">
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {heroData.location}
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-4 h-4" />
            Delivery seguro en todo VMT
          </span>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
          {/* ===== LEFT DESKTOP ===== */}
          <div className="hidden lg:block space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 font-bold shadow-sm">
              <Star className="w-4 h-4 fill-current" />
              Tu aliado escolar y de oficina
            </div>

            <h1
              id="hero-title-desktop"
              className="text-5xl font-extrabold leading-tight tracking-tight"
            >
              {heroData.title}
            </h1>

            <p className="text-xl max-w-xl text-muted-foreground">
              {heroData.subtitle}
            </p>

            <div className="flex gap-4">
              <Button
                asChild
                size="lg"
                className="shadow-lg hover:scale-105 transition-transform text-base"
              >
                <a
                  href={getWhatsAppUrl("Hola! Quiero información")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-2 w-5 h-5" />
                  WhatsApp
                </a>
              </Button>

              <Button
                variant="outline"
                size="lg"
                asChild
                className="shadow-sm hover:bg-muted/50 text-base"
              >
                <a href={getPhoneUrl()}>
                  <Phone className="mr-2 w-5 h-5" />
                  Llamar
                </a>
              </Button>
            </div>
          </div>

          {/* ===== CARD INTERACTIVA ===== */}
          <div className="relative bg-card/95 backdrop-blur-md rounded-2xl lg:rounded-3xl p-5 sm:p-6 lg:p-10 shadow-2xl border border-border/50 transform-gpu">

            {/* ===== TABS DE CATEGORÍA - MEJORADOS PARA ACCESIBILIDAD ===== */}
            <nav aria-label="Categorías de servicios" className="mb-6">
              <div
                className="flex flex-wrap justify-center gap-3 lg:gap-2"
                role="tablist"
              >
                {heroData.categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                    aria-controls={`panel-${cat.id}`}
                    // MEJORA: Área táctil mínima de 44px, texto más grande
                    className={`
                      min-h-[48px] px-4 sm:px-5 py-2.5
                      rounded-full text-base font-bold
                      transition-all duration-300
                      touch-manipulation select-none
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${
                        activeCategory === cat.id
                          ? `bg-gradient-to-r ${cat.bgColor} text-white shadow-lg scale-105`
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">{cat.emoji}</span>
                      <span className="hidden sm:inline">{cat.label}</span>
                    </span>
                  </button>
                ))}
              </div>
            </nav>

            {/* ===== CONTENIDO DE CATEGORÍA ===== */}
            <div
              id={`panel-${activeCategory}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeCategory}`}
            >
              {/* Icono Principal */}
              <div className="flex justify-center mb-5">
                <div className="relative">
                  <div
                    className={`absolute inset-0 rounded-2xl blur-xl opacity-40 bg-gradient-to-r ${current.bgColor} transform-gpu`}
                    aria-hidden="true"
                  />
                  <div
                    className={`
                      relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl
                      bg-gradient-to-r ${current.bgColor}
                      flex items-center justify-center shadow-xl
                      transform-gpu transition-colors duration-300
                    `}
                  >
                    {current.icon}
                  </div>
                </div>
              </div>

              {/* Título de categoría - TAMAÑO MEJORADO */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-4 min-h-[2rem] flex items-center justify-center">
                {current.title}
              </h2>

              {/* Features - TAMAÑO MEJORADO */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
                {current.features.map((f: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm font-semibold rounded-full bg-muted/70 border border-border shadow-sm"
                  >
                    <span className="text-primary mr-1">✓</span>
                    {f}
                  </span>
                ))}
              </div>

              {/* ===== BOTÓN PRINCIPAL - MEJORADO PARA ADULTOS MAYORES ===== */}
              <Button
                onClick={() => window.open(getWhatsAppUrl(current.whatsappMessage), "_blank")}
                aria-label={`${current.buttonText} - Abre WhatsApp`}
                className={`
                  relative w-full
                  min-h-[56px] lg:min-h-[60px]
                  text-lg lg:text-xl font-bold
                  bg-gradient-to-r ${current.bgColor}
                  shadow-xl overflow-hidden group
                  focus:outline-none focus:ring-4 focus:ring-white/50
                `}
              >
                {/* Efecto hover */}
                <span
                  className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                  aria-hidden="true"
                />
                {/* Contenido del botón con icono claro */}
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {current.actionIcon}
                  <span>{current.buttonText}</span>
                  <MessageCircle className="w-5 h-5 opacity-80" />
                </span>
              </Button>

              {/* Texto de ayuda adicional para adultos mayores */}
              <p className="text-center text-sm text-muted-foreground mt-3">
                Toca el botón y te atendemos por WhatsApp
              </p>
            </div>
          </div>
        </div>

        {/* ===== BOTONES MÓVILES FIJOS - Above the fold ===== */}
        <div className="lg:hidden flex gap-3 mt-6">
          <Button
            asChild
            size="lg"
            className="flex-1 min-h-[52px] text-base font-bold shadow-lg"
          >
            <a
              href={getWhatsAppUrl("Hola! Quiero información")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              WhatsApp
            </a>
          </Button>

          <Button
            variant="outline"
            size="lg"
            asChild
            className="min-h-[52px] px-6 text-base font-bold shadow-sm"
          >
            <a href={getPhoneUrl()}>
              <Phone className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
