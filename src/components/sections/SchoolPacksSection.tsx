"use client"

import { useState, useEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Check, Star, Crown, Leaf,
  MessageCircle, Sparkles, Zap,
} from "lucide-react"
import { useWhatsApp } from "@/hooks/use-whatsapp"

// ============================================================
// MICRO-URGENCY — rotativa por card, stagger por offset
// ============================================================
const URGENCY_MSGS = [
  "Stock limitado esta semana",
  "Entrega rápida garantizada",
  "Incluye todo lo solicitado",
  "+ 100 padres ya cotizaron",
] as const

function useMicroUrgency(offset = 0) {
  const [idx, setIdx]         = useState(offset % URGENCY_MSGS.length)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout> | null = null
    const iv = setInterval(() => {
      setVisible(false)
      swap = setTimeout(() => {
        setIdx(i => (i + 1) % URGENCY_MSGS.length)
        setVisible(true)
      }, 350)
    }, 4_500)
    return () => {
      clearInterval(iv)
      if (swap !== null) clearTimeout(swap)
    }
  }, [])

  return { text: URGENCY_MSGS[idx], visible }
}

// ============================================================
// PACK DATA
// ============================================================
type PackDef = {
  id:             string
  name:           string
  tagline:        string
  Icon:           LucideIcon
  headerGradient: string
  glowColor:      string
  glowHover:      string
  btnGradient:    string
  checkBg:        string
  checkColor:     string
  accentColor:    string
  borderColor:    string
  highlighted:    boolean
  priceLabel:     string
  oldPrice:       number | null
  priceSub:       string
  features:       readonly string[]
  whatsAppMsg:    string
  urgencyOffset:  number
}

const PACKS: readonly PackDef[] = [
  {
    id:             "economico",
    name:           "Económico",
    tagline:        "Ahorro Máximo",
    Icon:           Leaf,
    headerGradient: "linear-gradient(135deg,#22c55e 0%,#059669 100%)",
    glowColor:      "rgba(34,197,94,0.4)",
    glowHover:      "rgba(34,197,94,0.65)",
    btnGradient:    "linear-gradient(135deg,#22c55e 0%,#059669 100%)",
    checkBg:        "rgba(34,197,94,0.14)",
    checkColor:     "#22c55e",
    accentColor:    "#22c55e",
    borderColor:    "rgba(34,197,94,0.28)",
    highlighted:    false,
    priceLabel:     "Desde S/ 150",
    oldPrice:       null,
    priceSub:       "El menor precio del mercado",
    features: [
      "Cuadernos universitarios",
      "Lápices y lapiceros",
      "Regla, borrador y tajador",
      "Folder y archivador",
    ],
    whatsAppMsg:   "Pack Económico",
    urgencyOffset: 0,
  },
  {
    id:             "estandar",
    name:           "Estándar",
    tagline:        "Más Vendido",
    Icon:           Star,
    headerGradient: "linear-gradient(135deg,#f97316 0%,#dc2626 100%)",
    glowColor:      "rgba(249,115,22,0.48)",
    glowHover:      "rgba(249,115,22,0.78)",
    btnGradient:    "linear-gradient(135deg,#f97316 0%,#dc2626 100%)",
    checkBg:        "rgba(249,115,22,0.14)",
    checkColor:     "#f97316",
    accentColor:    "#f97316",
    borderColor:    "rgba(249,115,22,0.38)",
    highlighted:    true,
    priceLabel:     "Desde S/ 200",
    oldPrice:       240,
    priceSub:       "Marcas Artesco, College y más",
    features: [
      "Todo el Pack Económico",
      "Marcas Artesco y College",
      "Cuadernos Navarrete",
      "Forrado de cuadernos al minimo precio",
      "Stickers personalizados",
    ],
    whatsAppMsg:   "Pack Estándar",
    urgencyOffset: 1,
  },
  {
    id:             "premium",
    name:           "Premium",
    tagline:        "Full Pro",
    Icon:           Crown,
    headerGradient: "linear-gradient(135deg,#9333ea 0%,#c026d3 100%)",
    glowColor:      "rgba(147,51,234,0.38)",
    glowHover:      "rgba(147,51,234,0.68)",
    btnGradient:    "linear-gradient(135deg,#9333ea 0%,#c026d3 100%)",
    checkBg:        "rgba(147,51,234,0.14)",
    checkColor:     "#9333ea",
    accentColor:    "#9333ea",
    borderColor:    "rgba(147,51,234,0.28)",
    highlighted:    false,
    priceLabel:     "Desde S/ 249",
    oldPrice:       310,
    priceSub:       "Prismacolor, Minerva, Standford",
    features: [
      "Todo el Pack Estándar",
      "Marcas Prismacolor y Minerva",
      "Standford premium",
      "Delivery a domicilio gratis",
      "Regalos personalizados",
      "Atención prioritaria",
    ],
    whatsAppMsg:   "Pack Premium",
    urgencyOffset: 2,
  },
]

// Mobile: Estándar primero para máximo impacto en primer vistazo
const PACKS_MOBILE: readonly PackDef[] = [PACKS[1], PACKS[0], PACKS[2]]

// ============================================================
// PACK CARD
// ============================================================
function PackCard({ pack, index = 0 }: { pack: PackDef; index?: number }) {
  const { getWhatsAppUrl }              = useWhatsApp()
  const { text: urgencyText, visible }  = useMicroUrgency(pack.urgencyOffset)
  const cardRef                         = useRef<HTMLDivElement>(null)
  const [entered, setEntered]           = useState(false)
  const [hovered, setHovered]           = useState(false)
  // True only on devices with real hover (mouse/trackpad) — disables tap-jump on mobile
  const supportsHover                   = useRef(false)

  useEffect(() => {
    supportsHover.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  // Scroll-triggered entrance with stagger
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const delay = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) { setEntered(true); obs.disconnect() }
        },
        { threshold: 0.08 }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }, index * 90)
    return () => clearTimeout(delay)
  }, [index])

  const isHoverActive = hovered && supportsHover.current
  const scale      = pack.highlighted ? (isHoverActive ? 1.07 : 1.05) : (isHoverActive ? 1.025 : 1)
  const translateY = isHoverActive ? -10 : pack.highlighted ? -4 : 0

  const boxShadow = isHoverActive
    ? `0 40px 80px -12px ${pack.glowHover}, 0 0 0 2px ${pack.glowColor}`
    : pack.highlighted
    ? `0 24px 56px -8px ${pack.glowColor}, 0 0 0 1.5px ${pack.glowColor}`
    : `0 8px 32px -8px ${pack.glowColor}`

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity:     entered ? 1 : 0,
        transform:   `translateY(${entered ? translateY : 30}px) scale(${entered ? scale : 0.96})`,
        boxShadow,
        borderColor: pack.borderColor,
        borderWidth: pack.highlighted ? "2px" : "1.5px",
        borderStyle: "solid",
        transition:  `
          opacity 0.5s ease ${index * 0.09}s,
          transform 0.45s cubic-bezier(0.34,1.4,0.64,1),
          box-shadow 0.3s ease
        `,
      }}
      className="relative flex flex-col h-full rounded-3xl overflow-hidden bg-card"
    >
      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% -10%,${pack.glowColor} 0%,transparent 68%)`,
          opacity:    isHoverActive ? 0.45 : 0.2,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Highlighted: pulsing border ring */}
      {pack.highlighted && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0 pack-pulse-ring"
          style={{ boxShadow: `inset 0 0 0 1.5px ${pack.glowColor}` }}
        />
      )}

      {/* ── GRADIENT HEADER ─────────────────────── */}
      <div
        className="relative z-10 p-5 sm:p-6"
        style={{ background: pack.headerGradient }}
      >
        {/* Badge row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/25">
            <pack.Icon className="w-3.5 h-3.5 text-white flex-shrink-0" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase leading-none">
              {pack.tagline}
            </span>
          </div>

          {pack.highlighted && (
            <div className="flex items-center gap-1 bg-white rounded-full px-2.5 py-1 shadow-lg">
              <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
              <span className="text-orange-600 text-[11px] font-extrabold leading-none">TOP</span>
            </div>
          )}
        </div>

        {/* Pack name */}
        <h3 className="text-[1.6rem] font-extrabold text-white tracking-tight leading-tight mb-2">
          Pack {pack.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2.5">
          <span className="text-[2rem] font-black text-white leading-none">
            {pack.priceLabel}
          </span>
          {pack.oldPrice !== null && (
            <span className="text-white/55 text-[1rem] font-medium line-through leading-none">
              S/ {pack.oldPrice}
            </span>
          )}
        </div>

        <p className="text-white/70 text-xs mt-1.5 leading-snug">{pack.priceSub}</p>
      </div>

      {/* ── BODY ────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5 gap-4 relative z-10">

        {/* Feature list */}
        <ul className="space-y-2.5 flex-1">
          {pack.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-snug">
              <span
                className="mt-[1px] w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: pack.checkBg }}
              >
                <Check
                  className="w-[10px] h-[10px]"
                  style={{ color: pack.checkColor }}
                  strokeWidth={3.5}
                />
              </span>
              {f}
            </li>
          ))}
        </ul>

        {/* Divider */}
        <div className="h-px bg-border/50" />

        {/* Micro-urgency badge */}
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-xl bg-muted/60 border border-border/40"
          style={{ minHeight: 36 }}
        >
          <Zap
            className="w-3 h-3 flex-shrink-0"
            style={{ color: pack.accentColor }}
          />
          <span
            className="text-xs font-semibold text-muted-foreground"
            style={{
              opacity:    visible ? 1 : 0,
              transition: "opacity 0.35s ease",
            }}
          >
            {urgencyText}
          </span>
        </div>

        {/* CTA */}
        <button
          onClick={() =>
            window.open(
              getWhatsAppUrl(`Hola! Me interesa el ${pack.whatsAppMsg}`),
              "_blank",
              "noopener,noreferrer"
            )
          }
          aria-label={`Cotizar ${pack.name} por WhatsApp`}
          className="relative overflow-hidden w-full min-h-[52px] rounded-2xl text-white font-bold text-[0.95rem] flex items-center justify-center gap-2 shadow-lg transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.98] group"
          style={{ background: pack.btnGradient }}
        >
          {/* Shine sweep — Premium only */}
          {pack.id === "premium" && (
            <span className="shine-sweep absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none" />
          )}

          <MessageCircle className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
          Cotizar Ahora
        </button>
      </div>
    </div>
  )
}

// ============================================================
// SECTION
// ============================================================
export function SchoolPacksSection() {
  return (
    <>
      {/* ── Global keyframes ── */}
      <style jsx global>{`
        @keyframes packPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }
        .pack-pulse-ring {
          animation: packPulse 2.6s ease-in-out infinite;
        }
        @keyframes shineSweep {
          0%   { transform: translateX(-180%) skewX(-12deg); }
          6%   { transform: translateX(340%)  skewX(-12deg); }
          100% { transform: translateX(340%)  skewX(-12deg); }
        }
        .shine-sweep {
          animation: shineSweep 14s ease-in-out infinite;
        }
        .packs-scroll-x::-webkit-scrollbar { display: none; }
        .packs-scroll-x { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <section
        id="packs"
        className="py-16 lg:py-24 relative overflow-hidden"
        aria-labelledby="packs-title"
      >
        {/* Section atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse,rgba(249,115,22,0.06) 0%,rgba(236,72,153,0.05) 45%,rgba(147,51,234,0.05) 100%)",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">

          {/* ── HEADER ── */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25">
              <Sparkles className="w-4 h-4" />
              Packs Escolares 2026
            </div>

            <h2
              id="packs-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent"
            >
              Elige tu Pack Ideal
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
              Lista escolar completa en 24 h — elige el nivel que mejor se adapte.
            </p>
          </div>

          {/* ── MOBILE: horizontal snap scroll, Estándar first ── */}
          <div className="relative lg:hidden">
            {/* Fade edges — indicate more cards to swipe */}
            <div className="absolute left-0 top-0 bottom-5 w-6 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-5 w-6 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

          <div
            className="packs-scroll-x flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-5 -mx-4 px-6"
            role="list"
          >
            {PACKS_MOBILE.map((pack, i) => (
              <div
                key={pack.id}
                role="listitem"
                className="snap-center snap-always flex-shrink-0 w-[82vw] min-w-[290px] max-w-[320px]"
              >
                <PackCard pack={pack} index={i} />
              </div>
            ))}
          </div>
          </div>{/* end mobile wrapper */}

          {/* ── DESKTOP: 3-col, Estándar slightly larger via scale ── */}
          <div
            className="hidden lg:grid grid-cols-3 gap-6 xl:gap-8 items-start"
            role="list"
          >
            {PACKS.map((pack, i) => (
              <div key={pack.id} role="listitem">
                <PackCard pack={pack} index={i} />
              </div>
            ))}
          </div>

          {/* ── Trust bar ── */}
          <div className="mt-10 flex items-center justify-center flex-wrap gap-x-6 gap-y-1.5 text-sm text-muted-foreground">
            {[
              "Sin pago anticipado",
              "Cotización gratis en minutos",
              "Delivery disponible",
            ].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                {t}
              </span>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}
