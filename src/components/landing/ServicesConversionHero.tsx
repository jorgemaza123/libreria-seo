"use client"

import { useState, useEffect, useCallback } from 'react'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackMultiServiceLead } from '@/lib/analytics'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  MessageSquare, ChevronRight, Check, Zap,
  Backpack, Palette, FileText,
  Store, Truck, ShieldCheck,
} from 'lucide-react'

// ============================================
// SERVICES CONVERSION HERO
// Modo "services": centro de soluciones rápidas.
// Estructura 6-bloques completa.
// Micro-urgencia rotativa sin librerías.
// Tracking: MultiServiceLead con service_id.
// ============================================

// ── Micro-urgencia rotativa ──────────────────
// Psicología: presencia + demanda + accesibilidad
// Rotación fade cada 4.5 s, sin librerías pesadas.
const URGENCY_MESSAGES = [
  'Respuestas en menos de 10 minutos',
  'Alta demanda esta semana',
  'Horario extendido hoy',
  'Cotización sin compromiso',
] as const

// ── 3 accesos directos visuales ─────────────
const SERVICE_CARDS = [
  {
    id: 'school',
    Icon: Backpack,
    colorBg:     'bg-amber-500/10',
    colorText:   'text-amber-600 dark:text-amber-400',
    borderHover: 'hover:border-amber-400/40',
    btnColor:    'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25',
    title: 'Útiles y Listas Escolares',
    bullets: ['Listas completas en 24 h', 'Económico / Medio / Premium', 'Forrado y stickers incluidos'],
    cta: 'Cotizar mi lista',
    msgType: 'school_list' as const,
    msgPayload: {},
  },
  {
    id: 'sublimation',
    Icon: Palette,
    colorBg:     'bg-purple-500/10',
    colorText:   'text-purple-600 dark:text-purple-400',
    borderHover: 'hover:border-purple-400/40',
    btnColor:    'bg-purple-600 hover:bg-purple-700 shadow-purple-500/25',
    title: 'Sublimación y Regalos',
    bullets: ['Polos, tazas, cojines y más', 'Diseños 100 % personalizados', 'Desde 1 unidad'],
    cta: 'Cotizar diseño',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'sublimación y personalización' },
  },
  {
    id: 'tramites',
    Icon: FileText,
    colorBg:     'bg-emerald-500/10',
    colorText:   'text-emerald-600 dark:text-emerald-400',
    borderHover: 'hover:border-emerald-400/40',
    btnColor:    'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/25',
    title: 'Trámites y Copias',
    bullets: ['RENIEC, SUNAT y módulos', 'Fotocopias e impresiones', 'Rápido y económico'],
    cta: 'Consultar ahora',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'trámites y copias' },
  },
] as const

const TRUST_BADGES = [
  { Icon: Truck,       label: 'Delivery a domicilio',    sub: 'Todo VMT y zonas cercanas' },
  { Icon: Store,       label: '+10 años de experiencia', sub: 'Negocio local de confianza' },
  { Icon: ShieldCheck, label: 'Productos originales',    sub: 'Garantía de calidad' },
]

export function ServicesConversionHero() {
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const phone = getWhatsAppNumber()

  // ── Micro-urgencia rotativa ───────────────
  const [urgencyIdx, setUrgencyIdx] = useState(0)
  const [urgencyVisible, setUrgencyVisible] = useState(true)

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout> | null = null
    const iv = setInterval(() => {
      // Fade out → swap text → fade in
      setUrgencyVisible(false)
      swap = setTimeout(() => {
        setUrgencyIdx(i => (i + 1) % URGENCY_MESSAGES.length)
        setUrgencyVisible(true)
      }, 300)
    }, 4_500)
    return () => {
      clearInterval(iv)
      if (swap !== null) clearTimeout(swap)
    }
  }, [])

  // ── Handlers ─────────────────────────────
  const handleServiceClick = useCallback(
    (serviceId: string, msgType: typeof SERVICE_CARDS[number]['msgType'], msgPayload: object) => {
      trackEvent('hero_cta_click', { metadata: { type: 'services_card', service: serviceId } })
      trackMultiServiceLead({ source: 'home_hero', service: serviceId })
      const url = generateWhatsAppURL(msgType, msgPayload, phone)
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    [trackEvent, phone],
  )

  const primaryCtaProps = useConversionCTA({ campaignMode: 'services', source: 'services_hero_primary' })

  const handlePrimaryClick = useCallback(() => {
    trackEvent('hero_cta_click', { metadata: { type: 'services_primary' } })
    trackMultiServiceLead({ source: 'home_hero_primary' })
    const url = generateWhatsAppURL('general', {}, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 relative z-10">

        <div className="max-w-3xl mx-auto text-center mb-12">

          {/* BLOQUE 1 — Posicionamiento estático */}
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-4 border border-primary/20">
              <Store className="w-4 h-4" />
              Todo en un solo lugar · Frente al colegio
            </div>
          </FadeIn>

          {/* MICRO-URGENCIA ROTATIVA — sin countdown duro */}
          <FadeIn delay={0.05}>
            <div
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                bg-green-500/10 text-green-700 dark:text-green-400
                text-xs font-semibold border border-green-500/20 mb-5
                transition-opacity duration-300
                ${urgencyVisible ? 'opacity-100' : 'opacity-0'}
              `}
            >
              <Zap className="w-3 h-3 flex-shrink-0" />
              {URGENCY_MESSAGES[urgencyIdx]}
            </div>
          </FadeIn>

          {/* BLOQUE 2 — Promesa fuerte */}
          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-foreground leading-[1.1] mb-5">
              Útiles, sublimación y trámites.{' '}
              <span className="text-primary">Sin vueltas, sin esperas.</span>
            </h1>
          </FadeIn>

          {/* BLOQUE 3 — Beneficio concreto */}
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Atendemos todo lo que tu familia necesita: desde la lista escolar
              hasta el regalo personalizado.
            </p>
          </FadeIn>

          {/* BLOQUE 4 — CTA primario sobre el fold */}
          <FadeIn delay={0.25}>
            <button
              onClick={handlePrimaryClick}
              {...primaryCtaProps}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
            >
              <MessageSquare className="w-5 h-5" />
              Consultar por WhatsApp
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </FadeIn>

          {/* Barra de confianza compacta — justo bajo el CTA */}
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" />
                +5 000 familias atendidas
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" />
                +10 años en VMT
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-primary" />
                Respuesta inmediata por WhatsApp
              </span>
            </div>
          </FadeIn>
        </div>

        {/* BLOQUE 5 — 3 Accesos directos visuales */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-14">
          {SERVICE_CARDS.map((svc) => (
            <StaggerItem key={svc.id}>
              <div className={`
                group flex flex-col h-full rounded-2xl border border-border/50 bg-card
                p-6 shadow-sm transition-all duration-300
                hover:shadow-lg ${svc.borderHover} hover:-translate-y-0.5
              `}>
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${svc.colorBg} mb-4`}>
                  <svc.Icon className={`w-6 h-6 ${svc.colorText}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">
                  {svc.title}
                </h3>

                {/* Bullets */}
                <ul className="space-y-1.5 mb-6 flex-1">
                  {svc.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>

                {/* Per-service CTA — fires MultiServiceLead with service_id */}
                <button
                  onClick={() => handleServiceClick(svc.id, svc.msgType, svc.msgPayload)}
                  className={`
                    w-full flex items-center justify-center gap-2
                    py-3 px-5 rounded-xl text-white font-semibold text-sm
                    ${svc.btnColor} shadow-lg
                    transition-all duration-300 hover:shadow-xl min-h-[44px]
                  `}
                >
                  <MessageSquare className="w-4 h-4" />
                  {svc.cta}
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* BLOQUE 6 — Trust signals + CTA secundario estratégico */}
        <FadeIn delay={0.2}>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {TRUST_BADGES.map(({ Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground leading-tight">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA secundario: profundiza en el catálogo */}
            <div className="text-center">
              <a
                href="/servicio"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-4 transition-colors"
              >
                Ver todos los servicios disponibles
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
