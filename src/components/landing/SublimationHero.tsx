"use client"

import { useCallback } from 'react'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackSublimationLead } from '@/lib/analytics'
import { FadeIn } from '@/components/ui/motion'
import { HeroImageBackdrop } from '@/components/landing/HeroImageBackdrop'
import { Check, ChevronRight, MessageSquare, Palette } from 'lucide-react'

export function SublimationHero() {
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const phone = getWhatsAppNumber()

  const primaryCtaProps = useConversionCTA({ campaignMode: 'sublimation', source: 'sublimation_hero_primary' })

  const handlePrimaryClick = useCallback(() => {
    trackEvent('hero_cta_click', { metadata: { type: 'sublimation_hero_primary' } })
    trackSublimationLead({ source: 'home_hero' })
    const url = generateWhatsAppURL('service_inquiry', { serviceName: 'sublimacion y personalizacion' }, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-background-dark">
      <HeroImageBackdrop />

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-violet-500/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full bg-pink-500/8 blur-3xl" />
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-4xl text-center">
          <FadeIn delay={0}>
            <div className="section-kicker mb-6 border-violet-400/20 bg-violet-500/10 text-violet-200">
              <Palette className="h-4 w-4" />
              Estampados y regalos personalizados
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mb-5 text-3xl font-heading font-extrabold leading-[1.08] text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
              Personaliza polos, tazas y regalos.
              <span className="mt-2 block text-violet-300">Facil de pedir y facil de entender.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Diseños claros, cantidades desde 1 unidad y atencion rapida para colegio,
              negocio, regalo o evento.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={handlePrimaryClick}
                {...primaryCtaProps}
                className="group inline-flex min-h-[56px] items-center justify-center gap-3 rounded-2xl bg-violet-500 px-8 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-400 hover:shadow-xl"
              >
                <MessageSquare className="h-5 w-5" />
                Cotizar personalizacion
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#estampados-personalizados"
                onClick={() => trackEvent('hero_cta_click', { metadata: { type: 'sublimation_hero_secondary' } })}
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl border border-white/12 bg-card px-8 py-4 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:border-violet-400/40 hover:bg-accent"
              >
                Ver ejemplos
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.35}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-violet-300" />
                Desde 1 unidad
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-violet-300" />
                Colores duraderos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-4 w-4 text-violet-300" />
                Atencion por WhatsApp
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
