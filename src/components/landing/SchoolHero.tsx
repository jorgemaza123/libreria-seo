"use client"

import { useCallback } from 'react'
import { useSiteContent } from '@/contexts/SiteContentContext'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackSchoolListLead } from '@/lib/analytics'
import { FadeIn } from '@/components/ui/motion'
import { HeroImageBackdrop } from '@/components/landing/HeroImageBackdrop'
import { BookOpen, Check, MessageSquare } from 'lucide-react'
import Link from 'next/link'

export function SchoolHero() {
  const { effectiveContent } = useSiteContent()
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()

  const schoolContent = effectiveContent?.hero?.schoolLanding
  const phone = getWhatsAppNumber()

  const primaryCtaProps = useConversionCTA({ campaignMode: 'school', source: 'home_school_primary' })

  const handlePrimaryClick = useCallback(() => {
    trackEvent('hero_cta_click', { metadata: { type: 'home_school_primary' } })
    trackSchoolListLead({ source: 'home_hero' })
    const url = generateWhatsAppURL('school_list', {}, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  return (
    <section id="hero" className="relative isolate flex min-h-[90vh] w-full flex-col justify-center overflow-hidden bg-background-dark sm:min-h-[85vh]">
      <HeroImageBackdrop />

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />
        <div className="absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px]" />
      </div>

      <div className="container relative z-20 mx-auto flex flex-col items-center px-6 py-12 sm:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-6 text-center sm:gap-8">
          <FadeIn delay={0}>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg backdrop-blur-md sm:text-xs">
              {schoolContent?.heroBadge || 'Campana escolar lista para cotizar'}
            </span>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
              Envia tu lista escolar.
              <br />
              <span className="text-primary text-gradient drop-shadow-md">Nosotros la armamos por ti.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-200 sm:text-xl">
              {schoolContent?.heroSubtitle || (
                <>
                  Manda la foto de la lista por WhatsApp y recibe utiles, cuadernos,
                  forrado y entrega rapida sin hacer colas.
                </>
              )}
            </p>
          </FadeIn>

          <FadeIn delay={0.3} className="w-full sm:w-auto">
            <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
              <button
                onClick={handlePrimaryClick}
                {...primaryCtaProps}
                className="group relative inline-flex min-h-[64px] w-full items-center justify-center gap-3 rounded-2xl bg-primary px-10 py-5 text-lg font-extrabold uppercase tracking-wider text-primary-foreground shadow-[0_0_40px_rgba(34,197,94,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_56px_rgba(34,197,94,0.38)] sm:w-auto sm:text-xl"
              >
                <MessageSquare className="h-6 w-6 fill-current" />
                {schoolContent?.heroPrimaryCTA || 'Cotizar por WhatsApp'}
              </button>

              <Link
                href="#productos"
                className="inline-flex min-h-[64px] w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-card px-8 py-5 text-lg font-semibold text-white shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-accent sm:w-auto"
              >
                Ver productos
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.4} className="mt-4 w-full sm:mt-8">
            <div className="grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
              <div className="glass-card flex items-center gap-3 rounded-2xl p-4 sm:p-5">
                <div className="shrink-0 rounded-xl bg-primary/10 p-2 text-primary sm:p-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Cotizacion rapida</h3>
                  <p className="text-xs text-slate-300">Te respondemos con una opcion clara.</p>
                </div>
              </div>

              <div className="glass-card flex items-center gap-3 rounded-2xl p-4 sm:p-5">
                <div className="shrink-0 rounded-xl bg-primary/10 p-2 text-primary sm:p-3">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Explicacion simple</h3>
                  <p className="text-xs text-slate-300">Ideal para padres, alumnos y adultos mayores.</p>
                </div>
              </div>

              <div className="glass-card relative flex items-center gap-3 overflow-hidden rounded-2xl p-4 sm:p-5">
                <div className="shrink-0 rounded-xl bg-primary/10 p-2 text-primary sm:p-3">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Recojo o delivery</h3>
                  <p className="text-xs text-slate-300">Lo recibes listo o lo recoges en tienda.</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
