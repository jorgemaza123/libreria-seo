"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Star, Crown, Leaf, MessageCircle, Sparkles } from "lucide-react";
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
    price: 89,
    priceDisplay: "S/ 89",
    image:
      "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400",
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
    price: 149,
    priceDisplay: "S/ 149",
    image:
      "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400",
    features: ["Faber Castell", "Plumones", "Estuche"],
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
    priceDisplay: "S/ 249",
    image:
      "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400",
    features: ["Prismacolor", "Mochila", "Lonchera"],
    highlighted: false,
  },
];

export function SchoolPacksSection() {
  const { getWhatsAppUrl } = useWhatsApp();
  const { effectiveContent } = useSiteContent();
  const [activePack, setActivePack] = useState<any | null>(null);

  const packs = useMemo(() => fallbackPacks, []);

  return (
    <section className="py-12 lg:py-16 bg-gradient-to-b from-background to-muted/40">
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10 space-y-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold animate-pulse">
            <Sparkles className="w-4 h-4" />
            Packs Escolares
          </span>

          <h2 className="text-3xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-400 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent animate-gradient">
            Elige tu Pack Ideal
          </h2>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Más rápido, más fácil, más completo.
          </p>
        </div>

        {/* MOBILE BUTTONS */}
        <div className="space-y-5 lg:hidden">
          {packs.map((pack) => {
            const Icon = pack.tagIcon;
            return (
              <button
                key={pack.id}
                onClick={() => setActivePack(pack)}
                className={`
                  w-full rounded-2xl p-5 text-left
                  bg-gradient-to-r ${pack.tagColor}
                  text-white font-bold
                  shadow-xl ${pack.glow}
                  animate-fade-up
                  hover:scale-[1.03]
                  active:scale-95
                  transition-all
                `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg flex items-center gap-2">
                      <Icon className="w-5 h-5 animate-bounce" />
                      Pack {pack.name}
                    </p>
                    <p className="text-2xl font-extrabold">
                      {pack.priceDisplay}
                    </p>
                  </div>
                  <span className="animate-pulse">Ver</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* DESKTOP CARDS */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {packs.map((pack) => {
            const Icon = pack.tagIcon;
            return (
              <div
                key={pack.id}
                className={`
                  relative rounded-3xl overflow-hidden
                  bg-gradient-to-br ${pack.tagColor}
                  text-white shadow-2xl ${pack.glow}
                  hover:scale-105 hover:rotate-[0.5deg]
                  transition-all duration-500
                `}
              >
                <Image
                  src={pack.image}
                  alt={pack.name}
                  width={400}
                  height={250}
                  className="object-cover opacity-80"
                />

                <div className="p-6 space-y-4 backdrop-blur-sm bg-black/30">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 animate-pulse" />
                    <span className="font-bold">{pack.tagline}</span>
                  </div>

                  <h3 className="text-3xl font-extrabold">
                    Pack {pack.name}
                  </h3>

                  <p className="text-3xl font-black">
                    {pack.priceDisplay}
                  </p>

                  <ul className="space-y-2 text-sm">
                    {pack.features.map((f, i) => (
                      <li key={i} className="flex gap-2">
                        <Check className="w-4 h-4 text-white" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() =>
                      window.open(
                        getWhatsAppUrl(
                          `Hola! Me interesa el Pack ${pack.name}`
                        ),
                        "_blank"
                      )
                    }
                    className="w-full bg-whatsapp hover:bg-whatsapp/90 text-white shadow-lg"
                  >
                    <MessageCircle className="mr-2 w-5 h-5" />
                    Cotizar Ahora
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <Dialog open={!!activePack} onOpenChange={() => setActivePack(null)}>
        {activePack && (
          <DialogContent className="max-w-lg rounded-3xl bg-gradient-to-br from-black/80 to-black/60 text-white backdrop-blur-xl animate-zoom-in">
            <DialogHeader>
              <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
                Pack {activePack.name}
              </DialogTitle>
            </DialogHeader>

            <Image
              src={activePack.image}
              alt={activePack.name}
              width={400}
              height={250}
              className="rounded-xl shadow-xl"
            />

            <ul className="space-y-3 mt-4">
              {activePack.features.map((f: string, i: number) => (
                <li key={i} className="flex gap-3">
                  <Check className="w-5 h-5 text-green-400 animate-pulse" />
                  {f}
                </li>
              ))}
            </ul>

            <Button
              className="mt-6 w-full bg-whatsapp text-white shadow-[0_0_30px_rgba(37,211,102,0.7)] hover:scale-105 transition"
              onClick={() =>
                window.open(
                  getWhatsAppUrl(
                    `Hola! Me interesa el Pack ${activePack.name}`
                  ),
                  "_blank"
                )
              }
            >
              <MessageCircle className="mr-2 w-5 h-5 animate-bounce" />
              Cotizar por WhatsApp
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
