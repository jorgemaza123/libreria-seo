"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Star, Crown, Leaf, MessageCircle, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWhatsApp } from "@/hooks/use-whatsapp";
import { useSiteContent } from "@/contexts/SiteContentContext";

/* ---------------- FALLBACK ---------------- */
const fallbackPacks = [
  {
    id: "economico",
    name: "Económico",
    tagline: "Ahorro Máximo",
    tagIcon: Leaf,
    tagColor: "from-green-400 to-emerald-500",
    glow: "shadow-green-500/40",
    price: 150,
    priceDisplay: "El menor precio de cada producto",
    image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400",
    features: ["Cuadernos", "Lápices", "Regla", "Borrador"],
    highlighted: false,
  },
  {
    id: "estandar",
    name: "Estándar",
    tagline: "Más Vendido",
    tagIcon: Star,
    tagColor: "from-orange-400 to-pink-500",
    glow: "shadow-orange-500/50",
    price: 200,
    priceDisplay: "Marcas reconocidas y calidad",
    image: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400",
    features: ["Artesco", "College", "Navarrete"],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Full Pro",
    tagIcon: Crown,
    tagColor: "from-purple-500 to-fuchsia-600",
    glow: "shadow-fuchsia-500/50",
    price: 249,
    priceDisplay: "Lo mejor en calidad para ti",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
    features: ["Prismacolor", "Minerva", "Standford", "Envíos a domicilio", "Regalos personalizados"],
    highlighted: false,
  },
];

export function SchoolPacksSection() {
  const { getWhatsAppUrl } = useWhatsApp();
  const { effectiveContent } = useSiteContent();
  const [activePack, setActivePack] = useState<any | null>(null);

  const packs = useMemo(() => fallbackPacks, []);

  return (
    <section
      id="packs"
      className="py-12 lg:py-20 bg-gradient-to-b from-background to-muted/40"
      aria-labelledby="packs-title"
    >
      <div className="container mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <header className="text-center mb-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            Packs Escolares
          </span>

          <h2
            id="packs-title"
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent"
          >
            Elige tu Pack Ideal
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto">
            Más rápido, más fácil, más completo
          </p>
        </header>

        {/* MOBILE BUTTONS */}
        <div className="space-y-4 lg:hidden" role="list">
          {packs.map((pack) => {
            const Icon = pack.tagIcon;
            return (
              <button
                key={pack.id}
                role="listitem"
                onClick={() => setActivePack(pack)}
                aria-label={`Ver detalles del Pack ${pack.name}`}
                className={`
                  w-full rounded-2xl p-5 sm:p-6 text-left
                  min-h-[100px]
                  bg-gradient-to-r ${pack.tagColor}
                  text-white font-bold
                  shadow-xl ${pack.glow}
                  hover:scale-[1.02]
                  active:scale-98
                  transition-all duration-300
                  focus:outline-none focus:ring-4 focus:ring-white/30
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-lg sm:text-xl flex items-center gap-2">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      Pack {pack.name}
                    </p>
                    <p className="text-base sm:text-lg font-medium opacity-90">
                      {pack.priceDisplay}
                    </p>
                  </div>
                  <ChevronRight className="w-6 h-6 opacity-80" />
                </div>
              </button>
            );
          })}
        </div>

        {/* DESKTOP CARDS */}
        <div className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8" role="list">
          {packs.map((pack) => {
            const Icon = pack.tagIcon;
            return (
              <article
                key={pack.id}
                role="listitem"
                className={`
                  relative rounded-3xl overflow-hidden
                  bg-gradient-to-br ${pack.tagColor}
                  text-white shadow-2xl ${pack.glow}
                  hover:scale-105 hover:rotate-[0.3deg]
                  transition-all duration-500
                `}
              >
                <Image
                  src={pack.image}
                  alt={`Imagen del Pack ${pack.name}`}
                  width={400}
                  height={250}
                  className="object-cover opacity-80 w-full"
                />

                <div className="p-6 space-y-4 backdrop-blur-sm bg-black/30">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span className="font-bold text-base">{pack.tagline}</span>
                  </div>

                  <h3 className="text-2xl xl:text-3xl font-extrabold">
                    Pack {pack.name}
                  </h3>

                  <p className="text-lg font-semibold opacity-90">
                    {pack.priceDisplay}
                  </p>

                  <ul className="space-y-2">
                    {pack.features.map((f, i) => (
                      <li key={i} className="flex gap-2 text-base">
                        <Check className="w-5 h-5 text-white flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() =>
                      window.open(
                        getWhatsAppUrl(`Hola! Me interesa el Pack ${pack.name}`),
                        "_blank"
                      )
                    }
                    aria-label={`Cotizar Pack ${pack.name} por WhatsApp`}
                    className="w-full min-h-[52px] text-base font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Cotizar Ahora
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={!!activePack} onOpenChange={() => setActivePack(null)}>
        {activePack && (
          <DialogContent
            className="max-w-lg rounded-3xl bg-gradient-to-br from-black/90 to-black/80 text-white backdrop-blur-xl border-white/10"
            aria-describedby="pack-description"
          >
            <DialogHeader>
              <DialogTitle className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Pack {activePack.name}
              </DialogTitle>
            </DialogHeader>

            <Image
              src={activePack.image}
              alt={`Imagen del Pack ${activePack.name}`}
              width={400}
              height={250}
              className="rounded-xl shadow-xl w-full"
            />

            <p id="pack-description" className="text-base text-white/80">
              {activePack.priceDisplay}
            </p>

            <ul className="space-y-3 mt-2">
              {activePack.features.map((f: string, i: number) => (
                <li key={i} className="flex gap-3 text-base">
                  <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className="mt-4 w-full min-h-[56px] text-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-xl"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(`Hola! Me interesa el Pack ${activePack.name}`),
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 w-5 h-5" />
              Cotizar por WhatsApp
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
