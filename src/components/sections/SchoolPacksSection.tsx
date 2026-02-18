"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Check, Star, Crown, Leaf,
  MessageCircle, Sparkles, Zap, ChevronRight,
} from "lucide-react"
import { useWhatsApp } from "@/hooks/use-whatsapp"

// ============================================================
// MICRO-URGENCY
// ============================================================
const URGENCY_MSGS = [
  "Stock limitado esta semana",
  "Entrega rápida garantizada",
  "Incluye todo lo solicitado",
  "+ 100 padres ya cotizaron",
] as const

const REASSURANCE = [
  "Respuesta en < 5 min",
  "Lista completa en 24h",
  "Te ayudamos por WhatsApp",
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
    return () => { clearInterval(iv); if (swap) clearTimeout(swap) }
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
  savings:        string | null
  priceSub:       string
  socialProof:    string
  features:       readonly string[]
  whatsAppMsg:    string
  urgencyOffset:  number
  compareKey:     string
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
    savings:        null,
    priceSub:       "El menor precio del mercado",
    socialProof:    "🔥 +80 padres cotizaron este pack",
    features: [
      "Cuadernos universitarios",
      "Lápices y lapiceros",
      "Regla, borrador y tajador",
      "Folder y archivador",
    ],
    whatsAppMsg:   "Pack Económico",
    urgencyOffset: 0,
    compareKey:    "Precio mínimo",
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
    savings:        "Ahorra S/ 40 hoy",
    priceSub:       "Marcas Artesco, College y más",
    socialProof:    "🔥 +100 padres cotizaron este pack esta semana",
    features: [
      "Todo el Pack Económico",
      "Marcas Artesco y College",
      "Cuadernos Navarrete",
      "Forrado de cuadernos al minimo precio",
      "Stickers personalizados",
    ],
    whatsAppMsg:   "Pack Estándar",
    urgencyOffset: 1,
    compareKey:    "El más completo",
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
    savings:        "Ahorra S/ 61 hoy",
    priceSub:       "Prismacolor, Minerva, Standford",
    socialProof:    "🔥 +60 padres cotizaron este pack",
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
    compareKey:    "Sin límites",
  },
]

// Mobile order: Estándar first
const PACKS_MOBILE: readonly PackDef[] = [PACKS[1], PACKS[0], PACKS[2]]

// ============================================================
// PACK CARD
// ============================================================
function PackCard({ pack, index = 0 }: { pack: PackDef; index?: number }) {
  const { getWhatsAppUrl }             = useWhatsApp()
  const { text: urgencyText, visible } = useMicroUrgency(pack.urgencyOffset)
  const cardRef                        = useRef<HTMLDivElement>(null)
  const [entered, setEntered]          = useState(false)
  const [hovered, setHovered]          = useState(false)
  const [ripple, setRipple]            = useState<{ x: number; y: number; key: number } | null>(null)
  const supportsHover                  = useRef(false)

  useEffect(() => {
    supportsHover.current = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  }, [])

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const delay = setTimeout(() => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { setEntered(true); obs.disconnect() } },
        { threshold: 0.08 }
      )
      obs.observe(el)
      return () => obs.disconnect()
    }, index * 90)
    return () => clearTimeout(delay)
  }, [index])

  useEffect(() => {
    if (!ripple) return
    const t = setTimeout(() => setRipple(null), 600)
    return () => clearTimeout(t)
  }, [ripple])

  const isHoverActive = hovered && supportsHover.current
  // 1.03 resting scale for highlighted — subtle, doesn't crowd snap items
  const scale      = pack.highlighted ? (isHoverActive ? 1.07 : 1.03) : (isHoverActive ? 1.025 : 1)
  const translateY = isHoverActive ? -10 : pack.highlighted ? -3 : 0

  const boxShadow = isHoverActive
    ? `0 40px 80px -12px ${pack.glowHover}, 0 0 0 2px ${pack.glowColor}`
    : pack.highlighted
    ? `0 24px 56px -8px ${pack.glowColor}, 0 0 0 1.5px ${pack.glowColor}`
    : `0 8px 32px -8px ${pack.glowColor}`

  const handleCtaClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() })
    window.open(
      getWhatsAppUrl(`Hola! Me interesa el ${pack.whatsAppMsg}`),
      "_blank",
      "noopener,noreferrer"
    )
  }

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
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% -10%,${pack.glowColor} 0%,transparent 68%)`,
          opacity:    isHoverActive ? 0.45 : 0.2,
          transition: "opacity 0.35s ease",
        }}
      />

      {pack.highlighted && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0 pack-pulse-ring"
          style={{ boxShadow: `inset 0 0 0 1.5px ${pack.glowColor}` }}
        />
      )}

      {/* ── GRADIENT HEADER — compact (-17% height) ── */}
      <div className="relative z-10 p-4 sm:p-5" style={{ background: pack.headerGradient }}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/25">
            <pack.Icon className="w-3 h-3 text-white flex-shrink-0" />
            <span className="text-white text-[10px] font-bold tracking-widest uppercase leading-none">
              {pack.tagline}
            </span>
          </div>
          {pack.highlighted && (
            <div className="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-lg flex-shrink-0">
              <Star className="w-2.5 h-2.5 fill-orange-500 text-orange-500" />
              <span className="text-orange-600 text-[10px] font-extrabold leading-none whitespace-nowrap">
                Más elegido
              </span>
            </div>
          )}
        </div>

        {/* Price — before name so it's visible in the horizontal peek strip */}
        <div className="flex items-baseline gap-2 mb-1">
          <span
            className="font-black text-white leading-none"
            style={{ fontSize: pack.highlighted ? "1.85rem" : "1.7rem" }}
          >
            {pack.priceLabel}
          </span>
          {pack.oldPrice !== null && (
            <span className="text-white/55 text-[0.85rem] font-medium line-through leading-none">
              S/ {pack.oldPrice}
            </span>
          )}
        </div>

        <h3 className="text-[1.05rem] font-bold text-white/85 tracking-tight leading-tight mb-1">
          Pack {pack.name}
        </h3>

        {pack.savings && (
          <div className="inline-flex items-center gap-1 bg-white/25 rounded-full px-2 py-0.5 mb-0.5">
            <span className="text-white text-[10px] font-bold leading-none">✦ {pack.savings}</span>
          </div>
        )}

        <p className="text-white/70 text-[11px] mt-0.5 leading-snug">{pack.priceSub}</p>
      </div>

      {/* ── BODY ── */}
      <div className="flex flex-col flex-1 p-5 gap-3.5 relative z-10">
        <ul className="space-y-2.5 flex-1">
          {pack.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground leading-snug">
              <span
                className="mt-[1px] w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center"
                style={{ background: pack.checkBg }}
              >
                <Check className="w-[10px] h-[10px]" style={{ color: pack.checkColor }} strokeWidth={3.5} />
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="h-px bg-border/50" />

        {/* Micro-urgency */}
        <div
          className="flex items-center gap-2 py-2 px-3 rounded-xl bg-muted/60 border border-border/40"
          style={{ minHeight: 36 }}
        >
          <Zap className="w-3 h-3 flex-shrink-0" style={{ color: pack.accentColor }} />
          <span
            className="text-xs font-semibold text-muted-foreground"
            style={{ opacity: visible ? 1 : 0, transition: "opacity 0.35s ease" }}
          >
            {urgencyText}
          </span>
        </div>

        {/* CTA with ripple */}
        <button
          onClick={handleCtaClick}
          aria-label={`Cotizar ${pack.name} por WhatsApp`}
          className="relative overflow-hidden w-full min-h-[52px] rounded-2xl text-white font-bold text-[0.95rem] flex items-center justify-center gap-2 shadow-lg transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97] group"
          style={{ background: pack.btnGradient }}
        >
          {pack.id === "premium" && (
            <span className="shine-sweep absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none" />
          )}
          {ripple && (
            <span
              key={ripple.key}
              className="pack-ripple absolute rounded-full bg-white/30 pointer-events-none"
              style={{ width: 100, height: 100, left: ripple.x - 50, top: ripple.y - 50 }}
            />
          )}
          <MessageCircle className="w-[18px] h-[18px] transition-transform duration-200 group-hover:scale-110" />
          Cotizar Ahora
        </button>

        {/* Social proof */}
        <p className="text-center text-[11px] text-muted-foreground leading-tight">
          {pack.socialProof}
        </p>

        {/* Reassurance — reduces purchase anxiety */}
        <div className="grid grid-cols-3 gap-1 pt-0.5 border-t border-border/30">
          {REASSURANCE.map(t => (
            <div key={t} className="flex flex-col items-center text-center gap-0.5 py-1">
              <Check className="w-3 h-3 text-green-500" />
              <span className="text-[9.5px] text-muted-foreground leading-tight">{t}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// MOBILE SLIDER
// ============================================================
function MobileSlider() {
  const scrollRef                     = useRef<HTMLDivElement>(null)
  const hintDone                      = useRef(false)
  const t1Ref                         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t2Ref                         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [showArrow, setShowArrow]     = useState(true)

  // ── Hint: 60px scroll → pause 250ms → back ──
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('packs_hint')) {
      hintDone.current = true
      return
    }
    const el = scrollRef.current
    if (!el) return

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hintDone.current) return
      obs.disconnect()
      hintDone.current = true
      sessionStorage.setItem('packs_hint', '1')

      t1Ref.current = setTimeout(() => {
        el.scrollTo({ left: 60, behavior: 'smooth' })
        // ~400ms for 60px scroll + 250ms pause = 650ms
        t2Ref.current = setTimeout(() => {
          el.scrollTo({ left: 0, behavior: 'smooth' })
        }, 650)
      }, 800)
    }, { threshold: 0.6 })

    obs.observe(el)
    return () => {
      obs.disconnect()
      if (t1Ref.current !== null) clearTimeout(t1Ref.current)
      if (t2Ref.current !== null) clearTimeout(t2Ref.current)
    }
  }, [])

  // ── Scroll tracking ──
  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const slotWidth = el.scrollWidth / PACKS_MOBILE.length
    const idx = Math.min(Math.round(el.scrollLeft / slotWidth), PACKS_MOBILE.length - 1)
    setActiveIdx(idx)
    setShowArrow(idx < PACKS_MOBILE.length - 1)
  }, [])

  // ── Dot / tab → scroll to card ──
  const scrollToCard = useCallback((idx: number) => {
    const el = scrollRef.current
    if (!el) return
    const slotWidth = el.scrollWidth / PACKS_MOBILE.length
    el.scrollTo({ left: slotWidth * idx, behavior: 'smooth' })
  }, [])

  return (
    <div className="relative lg:hidden">

      {/* ── "COMPARA LOS 3 PACKS" + tab selector ── */}
      <div className="text-center mb-5">
        <p className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase mb-3">
          Compara los 3 packs
        </p>
        <div
          className="inline-flex items-center gap-1.5 p-1 rounded-2xl bg-muted/60 border border-border/40"
          role="tablist"
          aria-label="Seleccionar pack"
        >
          {PACKS_MOBILE.map((pack, i) => (
            <button
              key={pack.id}
              role="tab"
              aria-selected={i === activeIdx}
              onClick={() => scrollToCard(i)}
              className="flex flex-col items-center px-2.5 py-2 rounded-xl transition-all duration-300 min-w-[72px]"
              style={
                i === activeIdx
                  ? { background: pack.accentColor, color: '#fff', boxShadow: `0 2px 8px ${pack.glowColor}` }
                  : { color: 'var(--muted-foreground)' }
              }
            >
              {/* Pack name + star */}
              <span className="flex items-center gap-0.5 text-[12px] font-bold leading-none">
                {pack.name}
                {pack.highlighted && (
                  <Star
                    className="w-2.5 h-2.5 flex-shrink-0"
                    style={{ fill: i === activeIdx ? '#fff' : pack.accentColor, color: i === activeIdx ? '#fff' : pack.accentColor }}
                  />
                )}
              </span>
              {/* Price — comparison hook */}
              <span
                className="text-[10px] font-semibold leading-none mt-0.5"
                style={{ opacity: i === activeIdx ? 0.9 : 0.6 }}
              >
                {pack.priceLabel.replace('Desde ', '')}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Comparison row — matrix perception ── */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {PACKS_MOBILE.map((pack, i) => (
          <button
            key={pack.id}
            onClick={() => scrollToCard(i)}
            className="flex flex-col items-center text-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-300"
            style={{
              background:  i === activeIdx ? pack.checkBg : 'transparent',
              border:      `1px solid ${i === activeIdx ? pack.borderColor : 'rgba(0,0,0,0.06)'}`,
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: i === activeIdx ? pack.accentColor : pack.checkBg }}
            >
              <Check
                className="w-3 h-3"
                style={{ color: i === activeIdx ? '#fff' : pack.checkColor }}
                strokeWidth={3}
              />
            </span>
            <span
              className="text-[10px] font-semibold leading-tight"
              style={{
                color:   i === activeIdx ? pack.checkColor : 'var(--muted-foreground)',
                opacity: i === activeIdx ? 1 : 0.55,
              }}
            >
              {pack.compareKey}
            </span>
          </button>
        ))}
      </div>

      {/* ── Right fade + nav arrow ── */}
      <div className="absolute right-0 top-[172px] bottom-[80px] w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {showArrow && (
        <button
          onClick={() => scrollToCard(activeIdx + 1)}
          aria-label="Ver siguiente pack"
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-background/85 dark:bg-card/85 backdrop-blur-md border border-border/50 shadow-lg flex items-center justify-center nav-arrow-bounce"
          style={{ marginTop: 20 }}
        >
          <ChevronRight className="w-4 h-4 text-foreground/70" />
        </button>
      )}

      {/* ── Scroll container ── */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="packs-scroll-x flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 pb-4 -mx-4 px-4"
        role="list"
      >
        {PACKS_MOBILE.map((pack, i) => (
          <div
            key={pack.id}
            role="listitem"
            className="snap-start snap-always flex-shrink-0 w-[75vw] min-w-[260px] max-w-[320px]"
          >
            <PackCard pack={pack} index={i} />
          </div>
        ))}
        <div className="flex-shrink-0 w-4" aria-hidden />
      </div>

      {/* ── Progress: "Pack X de 3" pill ── */}
      <div className="flex flex-col items-center gap-1.5 mt-5">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/70 border border-border/40 shadow-sm overflow-hidden">
          {/* Colored dot for current pack */}
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 transition-colors duration-300"
            style={{ background: PACKS_MOBILE[activeIdx].accentColor }}
          />
          {/* Counter with slide-up animation on change */}
          <span
            key={activeIdx}
            className="text-xs font-semibold text-foreground pack-counter-in"
          >
            Pack {activeIdx + 1} de 3 — {PACKS_MOBILE[activeIdx].name}
          </span>
        </div>

        {/* Dot strip */}
        <div className="flex items-center gap-2" role="tablist" aria-label="Pack activo">
          {PACKS_MOBILE.map((pack, i) => (
            <button
              key={pack.id}
              role="tab"
              aria-selected={i === activeIdx}
              aria-label={`Pack ${pack.name}`}
              onClick={() => scrollToCard(i)}
              style={{
                background:  i === activeIdx ? pack.accentColor : undefined,
                transition:  "all 0.35s cubic-bezier(0.34,1.4,0.64,1)",
              }}
              className={`rounded-full ${
                i === activeIdx
                  ? 'w-6 h-2.5 shadow-md'
                  : 'w-2.5 h-2.5 bg-muted-foreground/25 hover:bg-muted-foreground/45'
              }`}
            />
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground/60 flex items-center gap-1">
          Desliza para comparar
          <ChevronRight className="w-3 h-3" />
        </p>
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
      <style jsx global>{`
        @keyframes packPulse {
          0%, 100% { opacity: 0.45; }
          50%       { opacity: 1; }
        }
        .pack-pulse-ring { animation: packPulse 2.6s ease-in-out infinite; }

        @keyframes shineSweep {
          0%   { transform: translateX(-180%) skewX(-12deg); }
          6%   { transform: translateX(340%)  skewX(-12deg); }
          100% { transform: translateX(340%)  skewX(-12deg); }
        }
        .shine-sweep { animation: shineSweep 14s ease-in-out infinite; }

        @keyframes packRipple {
          from { transform: scale(0); opacity: 0.55; }
          to   { transform: scale(5); opacity: 0; }
        }
        .pack-ripple { animation: packRipple 0.6s ease-out forwards; }

        /* Progress counter: fade + slide 5px up */
        @keyframes packCounterIn {
          from { opacity: 0; transform: translateY(5px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pack-counter-in { animation: packCounterIn 0.25s ease-out; }

        /* Nav arrow: gentle horizontal nudge every 2s */
        @keyframes navArrowBounce {
          0%, 70%, 100% { transform: translateX(0) translateY(-50%); }
          35%            { transform: translateX(3px) translateY(-50%); }
        }
        .nav-arrow-bounce { animation: navArrowBounce 2s ease-in-out infinite; }

        .packs-scroll-x::-webkit-scrollbar { display: none; }
        .packs-scroll-x { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <section
        id="packs"
        className="py-20 lg:py-28 relative overflow-hidden"
        aria-labelledby="packs-title"
      >
        {/* Top border line — section delimiter */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/70 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />

        {/* Section tinted background */}
        <div className="absolute inset-0 bg-muted/[0.035] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60 pointer-events-none" />

        {/* Center glow blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse,rgba(249,115,22,0.06) 0%,rgba(236,72,153,0.05) 45%,rgba(147,51,234,0.05) 100%)",
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">

          {/* ── HEADER ── */}
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25">
              <Sparkles className="w-4 h-4" />
              Packs Escolares 2026
            </div>

            <h2
              id="packs-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-fuchsia-600 bg-clip-text text-transparent"
            >
              Elige el pack ideal para el año escolar
            </h2>

            <p className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto">
              3 opciones claras según tu presupuesto. Lista completa en 24 h.
            </p>
          </div>

          {/* ── MOBILE ── */}
          <MobileSlider />

          {/* ── DESKTOP ── */}
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
            {["Sin pago anticipado", "Cotización gratis en minutos", "Delivery disponible"].map(t => (
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
