"use client"

import { useCallback } from 'react'
import { useSiteContent } from '@/contexts/SiteContentContext'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackSchoolListLead } from '@/lib/analytics'
import { FadeIn } from '@/components/ui/motion'
import { MessageSquare, ChevronRight, Check, BookOpen } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// ============================================
// SCHOOL HERO — Hero section for Campaña Escolar
// Reutilizable: Home (/) + /listas-escolares
// No duplica código. Solo la sección hero.
// ============================================

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
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-green-500/5">
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">

          {/* Campaign Badge */}
          <FadeIn delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6 border border-primary/20">
              <BookOpen className="w-4 h-4" />
              {schoolContent?.heroBadge || 'Campaña Escolar 2026'}
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={0.1}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold text-foreground leading-[1.1] mb-5">
              {schoolContent?.heroTitle || (
                <>
                  Tu lista escolar completa en 24 horas.{' '}
                  <span className="text-primary">Sin colas. Sin estrés.</span>
                </>
              )}
            </h1>
          </FadeIn>

          {/* Subtitle */}
          <FadeIn delay={0.2}>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              {schoolContent?.heroSubtitle || (
                <>
                  Envíanos la lista por WhatsApp y recibe todo listo para usar.
                  <br className="hidden sm:block" />
                  Con opción económica, intermedia o premium. Entrega a domicilio.
                </>
              )}
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Primary: WhatsApp */}
              <button
                onClick={handlePrimaryClick}
                {...primaryCtaProps}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
              >
                <MessageSquare className="w-5 h-5" />
                {schoolContent?.heroPrimaryCTA || 'Enviar mi lista ahora'}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary: Go to full landing */}
              <Link
                href="/listas-escolares"
                onClick={() => trackEvent('hero_cta_click', { metadata: { type: 'home_school_secondary' } })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border text-foreground font-semibold text-lg rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 min-h-[56px]"
              >
                {schoolContent?.heroSecondaryCTA || 'Ver opciones de precios'}
              </Link>
            </div>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={0.35}>
            <p className="mt-5 text-sm text-muted-foreground">
              Más de <span className="font-bold text-foreground">40 familias</span> ya separaron su lista esta semana
            </p>
          </FadeIn>

          {/* Trust Bullets */}
          <FadeIn delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-sm text-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                Forrado disponible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                Stickers personalizados
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-green-500" />
                Envío gratis desde S/200
              </span>
            </div>
          </FadeIn>

          {/* Hero Image (optional, from CMS) */}
          {schoolContent?.heroImage && (
            <FadeIn delay={0.5}>
              <div className="mt-12 relative aspect-video max-w-2xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={schoolContent.heroImage}
                  alt="Útiles escolares Librería CHROMA"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 672px"
                />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
