"use client"

import { useCallback } from 'react'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackSublimationLead } from '@/lib/analytics'
import { FadeIn } from '@/components/ui/motion'
import { MessageSquare, ChevronRight, Check, Palette } from 'lucide-react'

// ============================================
// SUBLIMATION HERO — Hero for sublimation campaign
// Fires SublimationLead on CTA click
// ============================================

export function SublimationHero() {
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const phone = getWhatsAppNumber()

  const primaryCtaProps = useConversionCTA({ campaignMode: 'sublimation', source: 'sublimation_hero_primary' })

  const handlePrimaryClick = useCallback(() => {
    trackEvent('hero_cta_click', { metadata: { type: 'sublimation_hero_primary' } })
    trackSublimationLead({ source: 'home_hero' })
    const url = generateWhatsAppURL('service_inquiry', { serviceName: 'sublimación y personalización' }, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-purple-500/5 via-background to-pink-500/5">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Campaign Badge */}
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-sm font-bold mb-6 border border-purple-500/20">
              <Palette className="w-4 h-4" />
              Sublimación &amp; Personalización
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold text-foreground leading-[1.1] mb-5">
              Personaliza todo lo que imaginas.{' '}
              <span className="text-purple-600 dark:text-purple-400">
                Colores que no se van.
              </span>
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Polos, tazas, cojines, libretas y más. Sublimación de alta calidad con entrega rápida.
              <br className="hidden sm:block" />
              Diseños para empresas, equipos deportivos y regalos especiales.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary: WhatsApp */}
              <button
                onClick={handlePrimaryClick}
                {...primaryCtaProps}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg rounded-2xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
              >
                <MessageSquare className="w-5 h-5" />
                Cotizar personalización
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary: services page */}
              <a
                href="/servicio"
                onClick={() => trackEvent('hero_cta_click', { metadata: { type: 'sublimation_hero_secondary' } })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border text-foreground font-semibold text-lg rounded-2xl hover:border-purple-500/40 hover:bg-purple-500/5 transition-all duration-300 min-h-[56px]"
              >
                Ver catálogo de productos
              </a>
            </div>
          </FadeIn>

          {/* BLOQUE 5 — Prueba social */}
          <FadeIn delay={0.35}>
            <p className="mt-5 text-sm text-muted-foreground">
              Más de <span className="font-bold text-foreground">200 diseños</span> entregados
              · pedidos para empresas, colegios y eventos
            </p>
          </FadeIn>

          {/* BLOQUE 4 — Trust bullets */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-500" />
                Desde 1 unidad
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-500" />
                Entrega en 48–72 horas
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-purple-500" />
                Colores vibrantes y duraderos
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
