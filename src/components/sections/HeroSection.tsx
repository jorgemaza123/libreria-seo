"use client";

import { useState, useMemo } from "react";
import {
  Backpack,
  FileText,
  Gift,
  Star,
  MapPin,
  Truck,
  MessageCircle,
  Phone,
  Code,
  Printer,
  Palette,
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
    buttonEmoji: "📷",
    icon: <Backpack className="w-12 h-12 text-white" />,
  },
  tecnologia: {
    emoji: "💻",
    bgColor: "from-cyan-500 to-blue-600",
    buttonEmoji: "🔧",
    icon: <Code className="w-12 h-12 text-white" />,
  },
  tramites: {
    emoji: "📄",
    bgColor: "from-emerald-500 to-green-600",
    buttonEmoji: "📄",
    icon: <Printer className="w-12 h-12 text-white" />,
  },
  regalos: {
    emoji: "🎁",
    bgColor: "from-pink-500 to-rose-600",
    buttonEmoji: "🎨",
    icon: <Palette className="w-12 h-12 text-white" />,
  },
};

const DEFAULT_HERO = {
  title: "Soluciones Integrales frente a tu Colegio",
  subtitle:
    "Ahorra tiempo. Útiles escolares, tecnología y trámites en un solo lugar.",
  location: "Ubicados frente al Colegio Estela Maris",
  categories: {
    escolar: {
      title: "Sube tu lista o cotiza tus maquetas",
      buttonText: "Subir Pedido Escolar",
      features: ["Listas completas", "Maquetas", "Útiles de oficina"],
      whatsappMessage: "¡Hola! 📚 Quiero cotizar mi lista escolar.",
    },
    tecnologia: {
      title: "Soporte técnico y desarrollo web",
      buttonText: "Cotizar Soporte",
      features: ["PC y laptops", "Sistemas web"],
      whatsappMessage: "¡Hola! 💻 Necesito soporte técnico.",
    },
    tramites: {
      title: "Trámites y copias",
      buttonText: "Gestionar Trámite",
      features: ["RENIEC", "SUNAT", "Copias"],
      whatsappMessage: "¡Hola! 📄 Necesito ayuda con un trámite.",
    },
    regalos: {
      title: "Regalos personalizados",
      buttonText: "Personalizar Regalo",
      features: ["Tazas", "Polos"],
      whatsappMessage: "¡Hola! 🎁 Quiero un regalo personalizado.",
    },
  },
};

export function HeroSection() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryKey>("escolar");

  const { getWhatsAppUrl, getPhoneUrl } = useWhatsApp();
  const { effectiveContent } = useSiteContent();

  const heroData = useMemo(() => {
    const dbHero: any = effectiveContent?.hero || {};
    const categories = (
      Object.keys(CATEGORY_STYLES) as CategoryKey[]
    ).map((key) => ({
      id: key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      ...CATEGORY_STYLES[key],
      ...(dbHero.categories?.[key] ||
        DEFAULT_HERO.categories[key]),
    }));

    return {
      title: dbHero.title || DEFAULT_HERO.title,
      subtitle: dbHero.subtitle || DEFAULT_HERO.subtitle,
      location: dbHero.location || DEFAULT_HERO.location,
      categories,
    };
  }, [effectiveContent]);

  const current = heroData.categories.find(
    (c) => c.id === activeCategory
  )!;

  return (
    <section
      className="
        relative
        bg-background
        pt-4
        lg:pt-16
        lg:min-h-[85vh]
        flex
        lg:items-center
      "
    >
      <div className="container mx-auto px-4">

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

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* ===== LEFT DESKTOP ===== */}
          <div className="hidden lg:block space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 font-bold">
              <Star className="w-4 h-4 fill-current" />
              Tu aliado escolar y de oficina
            </div>

            <h1 className="text-5xl font-extrabold leading-tight">
              {heroData.title}
            </h1>

            <p className="text-xl max-w-xl text-muted-foreground">
              {heroData.subtitle}
            </p>

            <div className="flex gap-4">
              <Button asChild size="lg">
                <a
                  href={getWhatsAppUrl(
                    "Hola! Quiero información"
                  )}
                  target="_blank"
                >
                  <MessageCircle className="mr-2" />
                  WhatsApp
                </a>
              </Button>

              <Button variant="outline" size="lg" asChild>
                <a href={getPhoneUrl()}>
                  <Phone className="mr-2" />
                  Llamar
                </a>
              </Button>
            </div>
          </div>

          {/* ===== CARD (BOTH) ===== */}
          <div className="relative bg-card/90 backdrop-blur rounded-3xl p-6 lg:p-10 shadow-xl">

            {/* MOBILE BADGE */}
            <div className="lg:hidden flex justify-between text-xs mb-4">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Estela Maris
              </span>
              <span className="text-muted-foreground">
                Tu librería de confianza
              </span>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {heroData.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                    activeCategory === cat.id
                      ? `bg-gradient-to-r ${cat.bgColor} text-white`
                      : "bg-muted"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div
                className={`w-24 h-24 rounded-2xl flex items-center justify-center bg-gradient-to-r ${current.bgColor}`}
              >
                {current.icon}
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-center mb-3">
              {current.title}
            </h3>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {current.features.map((f: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-muted font-semibold"
                >
                  ✓ {f}
                </span>
              ))}
            </div>

            <Button
              onClick={() =>
                window.open(
                  getWhatsAppUrl(current.whatsappMessage),
                  "_blank"
                )
              }
              className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${current.bgColor}`}
            >
              {current.buttonEmoji} {current.buttonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
