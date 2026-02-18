"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CountdownBar } from '@/components/landing/CountdownBar'
import { useSiteContent } from '@/contexts/SiteContentContext'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { generateWhatsAppURL, type SchoolTier } from '@/lib/whatsapp'
import { trackSchoolListLead } from '@/lib/analytics'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import {
  MessageSquare,
  FileText,
  PackageCheck,
  Truck,
  ShieldCheck,
  Store,
  Star,
  ChevronRight,
  Sparkles,
  Crown,
  Coins,
  Scissors,
  Palette,
  Zap,
  Box,
  Check,
  BookOpen,
} from 'lucide-react'
import Image from 'next/image'

// ============================================
// SCHOOL LIST LANDING - HIGH CONVERSION
// FOMO countdown + dynamic WhatsApp CTA
// Meta Pixel SchoolListLead event
// ============================================

interface Review {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  comment: string
  service: string
  isActive: boolean
}

export function SchoolListLanding() {
  const { effectiveContent } = useSiteContent()
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const [reviews, setReviews] = useState<Review[]>([])
  const [scrollPastThreshold, setScrollPastThreshold] = useState(false)
  const [shouldShake, setShouldShake] = useState(false)
  const shakeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const schoolContent = effectiveContent?.hero?.schoolLanding
  const phone = getWhatsAppNumber()

  // Load reviews
  useEffect(() => {
    trackEvent('school_list_landing_view')
    async function loadReviews() {
      try {
        const res = await fetch('/api/reviews')
        if (res.ok) {
          const data = await res.json()
          const activeReviews = (Array.isArray(data) ? data : data.reviews || [])
            .filter((r: Review) => r.isActive)
          setReviews(activeReviews)
        }
      } catch { /* silent */ }
    }
    loadReviews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Dynamic WhatsApp button: detect scroll >= 90%
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return
      const pct = (window.scrollY / scrollHeight) * 100
      setScrollPastThreshold(pct >= 90)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Shake animation every 10s when past threshold
  useEffect(() => {
    if (scrollPastThreshold) {
      shakeIntervalRef.current = setInterval(() => {
        setShouldShake(true)
        setTimeout(() => setShouldShake(false), 600)
      }, 10_000)
      // Trigger immediately once
      setShouldShake(true)
      setTimeout(() => setShouldShake(false), 600)
    } else {
      if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current)
      setShouldShake(false)
    }
    return () => {
      if (shakeIntervalRef.current) clearInterval(shakeIntervalRef.current)
    }
  }, [scrollPastThreshold])

  // School list WhatsApp click — fires SchoolListLead pixel
  const handleSchoolListClick = useCallback((source: string, tier?: SchoolTier) => {
    trackEvent('hero_cta_click', { metadata: { type: source, tier } })

    // THE MONEY EVENT — Meta Pixel custom
    trackSchoolListLead({ source, tier: tier || 'general' })

    const url = tier
      ? generateWhatsAppURL('school_tier', { tier }, phone)
      : generateWhatsAppURL('school_list', {}, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  const handleTierClick = useCallback((tier: SchoolTier) => {
    trackEvent('tier_click', { metadata: { tier } })
    trackSchoolListLead({ source: 'tier_card', tier })
    const url = generateWhatsAppURL('school_tier', { tier }, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  const handleAddonClick = useCallback((addon: string) => {
    trackEvent('addon_click', { metadata: { addon } })
    const url = generateWhatsAppURL('school_addon', { addons: [addon as never] }, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }, [trackEvent, phone])

  return (
    <div className="min-h-screen bg-background">
      {/* ==========================================
          URGENCY COUNTDOWN BAR (FOMO)
          ========================================== */}
      <CountdownBar
        targetDate="2026-03-15T23:59:59"
        text="Campaña Escolar hasta 15 de marzo"
        subtext="Envío GRATIS en compras mayores a S/200"
      />

      <Navbar />

      {/* ==========================================
          SECTION 1: HERO — Emotion + Decision
          ========================================== */}
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

            {/* HEADLINE — Direct, clear, emotional */}
            <FadeIn delay={0.1}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-heading font-extrabold text-foreground leading-[1.1] mb-5">
                {schoolContent?.heroTitle || (
                  <>Tu lista escolar completa en 24 horas.{' '}
                    <span className="text-primary">Sin colas. Sin estrés.</span>
                  </>
                )}
              </h1>
            </FadeIn>

            {/* SUBTITLE — Benefit stack */}
            <FadeIn delay={0.2}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
                {schoolContent?.heroSubtitle || (
                  <>
                    Envíanos la lista por WhatsApp y recibe todo listo para usar.<br className="hidden sm:block" />
                    Con opción económica, intermedia o premium. Entrega a domicilio.
                  </>
                )}
              </p>
            </FadeIn>

            {/* CTA BUTTONS */}
            <FadeIn delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* PRIMARY CTA — Green WhatsApp */}
                <button
                  onClick={() => handleSchoolListClick('hero_primary')}
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
                >
                  <MessageSquare className="w-5 h-5" />
                  {schoolContent?.heroPrimaryCTA || 'Enviar mi lista ahora'}
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* SECONDARY CTA — Scroll to tiers */}
                <button
                  onClick={() => {
                    trackEvent('hero_cta_click', { metadata: { type: 'secondary_how' } })
                    document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-border text-foreground font-semibold text-lg rounded-2xl hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 min-h-[56px]"
                >
                  {schoolContent?.heroSecondaryCTA || 'Ver cómo funciona'}
                </button>
              </div>
            </FadeIn>

            {/* SOCIAL PROOF — below buttons */}
            <FadeIn delay={0.35}>
              <p className="mt-5 text-sm text-muted-foreground">
                Más de <span className="font-bold text-foreground">40 familias</span> ya separaron su lista esta semana
              </p>
            </FadeIn>

            {/* TRUST BULLETS — below CTA */}
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

            {/* Hero Image */}
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

      {/* ==========================================
          SECTION 2: HOW IT WORKS
          ========================================== */}
      <section id="como-funciona" className="py-16 sm:py-20 bg-muted/30 scroll-mt-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
                ¿Cómo funciona?
              </h2>
              <p className="text-muted-foreground">Tan fácil como 1, 2, 3</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '1',
                icon: FileText,
                title: 'Envía tu lista',
                description: 'Toma una foto de la lista del colegio y envíala por WhatsApp. Así de simple.',
                color: 'bg-blue-500/10 text-blue-600',
              },
              {
                step: '2',
                icon: MessageSquare,
                title: 'Recibe cotización',
                description: 'Te respondemos con el presupuesto exacto según la modalidad que elijas: económica, media o premium.',
                color: 'bg-green-500/10 text-green-600',
              },
              {
                step: '3',
                icon: PackageCheck,
                title: 'Recibe todo listo',
                description: 'Entregamos en tu casa o recoge en tienda. Todo empacado y listo para usar.',
                color: 'bg-purple-500/10 text-purple-600',
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="relative text-center p-6 rounded-2xl bg-card border border-border/50">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                    {item.step}
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.color} mb-4 mt-2`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* CTA after steps */}
          <FadeIn delay={0.3}>
            <div className="text-center mt-10">
              <button
                onClick={() => handleSchoolListClick('after_steps')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:-translate-y-0.5 min-h-[52px]"
              >
                <MessageSquare className="w-5 h-5" />
                Enviar mi lista ahora
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ==========================================
          SECTION 3: PRICING TIERS
          ========================================== */}
      <section id="pricing-tiers" className="py-16 sm:py-20 scroll-mt-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
                Elige tu modalidad
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Tres opciones para cada presupuesto. Todas incluyen la lista completa.
              </p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* ECONÓMICO */}
            <StaggerItem>
              <div className="relative rounded-2xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Económico</h3>
                    <p className="text-sm text-muted-foreground">Máximo ahorro</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Marcas nacionales de buena calidad a precio accesible. La mejor relación calidad-precio.
                </p>
                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Marcas ejemplo:</p>
                  <p className="text-sm text-foreground">Layconsa, Alpha, Vinifan, David, Artesco</p>
                </div>
                <button
                  onClick={() => handleTierClick('ECONÓMICO')}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-all duration-300 hover:shadow-md min-h-[48px] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Cotizar Económico
                </button>
              </div>
            </StaggerItem>

            {/* MEDIO — POPULAR */}
            <StaggerItem>
              <div className="relative rounded-2xl border-2 border-primary bg-card p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full ring-1 ring-primary/20">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full shadow-md whitespace-nowrap">
                  MÁS POPULAR
                </div>
                <div className="flex items-center gap-3 mb-4 mt-2">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Medio</h3>
                    <p className="text-sm text-muted-foreground">Equilibrio perfecto</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Marcas reconocidas con buena durabilidad. El favorito de nuestros clientes año tras año.
                </p>
                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Marcas ejemplo:</p>
                  <p className="text-sm text-foreground">Faber-Castell, Standford, Atlas, Vinifan, Artesco</p>
                </div>
                <button
                  onClick={() => handleTierClick('MEDIO')}
                  className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-md min-h-[48px] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Cotizar Medio
                </button>
              </div>
            </StaggerItem>

            {/* PREMIUM */}
            <StaggerItem>
              <div className="relative rounded-2xl border border-amber-400/30 bg-gradient-to-b from-amber-50/50 to-card dark:from-amber-950/20 dark:to-card p-6 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground">Premium</h3>
                    <p className="text-sm text-muted-foreground">Máxima calidad</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  Las mejores marcas importadas y nacionales premium. Máxima durabilidad y rendimiento.
                </p>
                <div className="space-y-2 mb-6 flex-1">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Marcas ejemplo:</p>
                  <p className="text-sm text-foreground">Faber-Castell premium, Stabilo, Pilot, Staedtler, Paper Mate</p>
                </div>
                <button
                  onClick={() => handleTierClick('PREMIUM')}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-300 hover:shadow-md min-h-[48px] flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Cotizar Premium
                </button>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* ==========================================
          SECTION 4: ADD-ONS
          ========================================== */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-3">
                Servicios adicionales
              </h2>
              <p className="text-muted-foreground">Completa tu pedido con estos extras</p>
            </div>
          </FadeIn>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              {
                icon: Scissors,
                title: 'Forrado básico',
                description: 'Forrado con vinifan estándar para todos tus cuadernos',
                color: 'bg-blue-500/10 text-blue-600',
              },
              {
                icon: Palette,
                title: 'Forrado personalizado',
                description: 'Sublimado 10x10 con el diseño que tu hijo elija',
                color: 'bg-pink-500/10 text-pink-600',
              },
              {
                icon: Zap,
                title: 'Entrega rápida',
                description: 'Recibe tu pedido en 24-48 horas con prioridad',
                color: 'bg-amber-500/10 text-amber-600',
              },
              {
                icon: Box,
                title: 'Maquetas escolares',
                description: 'Maquetas y trabajos manuales listos para presentar',
                color: 'bg-purple-500/10 text-purple-600',
              },
            ].map((addon) => (
              <StaggerItem key={addon.title}>
                <button
                  onClick={() => handleAddonClick(addon.title)}
                  className="w-full text-left rounded-2xl border border-border/50 bg-card p-5 hover:shadow-md hover:border-primary/30 transition-all duration-300 group"
                >
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${addon.color} mb-3`}>
                    <addon.icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {addon.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {addon.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                    Cotizar <ChevronRight className="w-3 h-3" />
                  </span>
                </button>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ==========================================
          SECTION 5: TRUST SIGNALS + TESTIMONIALS
          ========================================== */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          {/* Trust badges */}
          <FadeIn>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-16">
              {[
                { icon: Truck, label: 'Envío gratis desde S/200', sublabel: 'A todo VMT y zonas cercanas' },
                { icon: Store, label: 'Negocio local de confianza', sublabel: '+10 años en Villa María del Triunfo' },
                { icon: ShieldCheck, label: 'Productos originales', sublabel: 'Garantía de calidad certificada' },
              ].map((badge) => (
                <div key={badge.label} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/30">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <badge.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{badge.label}</p>
                    <p className="text-xs text-muted-foreground">{badge.sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Testimonials */}
          {reviews.length > 0 && (
            <div>
              <FadeIn>
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-center text-foreground mb-8">
                  Lo que dicen nuestros clientes
                </h3>
              </FadeIn>

              <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {reviews.slice(0, 6).map((review) => (
                  <StaggerItem key={review.id}>
                    <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        {review.avatar ? (
                          <Image
                            src={review.avatar}
                            alt={review.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                            {review.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-sm text-foreground">{review.name}</p>
                          {review.role && (
                            <p className="text-xs text-muted-foreground">{review.role}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-3">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          )}
        </div>
      </section>

      {/* ==========================================
          SECTION 6: FINAL CTA (LARGE)
          ========================================== */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-white mb-4">
                ¿Listo para enviar tu lista escolar?
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                No pierdas tiempo buscando tienda por tienda. Envía tu lista y recibe todo armado en 24 horas.
              </p>
              <button
                onClick={() => handleSchoolListClick('final_cta')}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-green-700 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[56px]"
              >
                <MessageSquare className="w-6 h-6" />
                Enviar mi lista por WhatsApp
                <ChevronRight className="w-5 h-5" />
              </button>
              <p className="mt-4 text-sm text-white/60">
                Respondemos en menos de 10 minutos
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      {/* ==========================================
          STICKY MOBILE WHATSAPP CTA
          Dynamic text at 90% scroll + shake
          ========================================== */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-50 p-3
          bg-background/80 backdrop-blur-lg border-t border-border/50
          md:hidden safe-area-bottom
          transition-all duration-300
          ${scrollPastThreshold ? 'pb-4' : ''}
        `}
      >
        <button
          onClick={() => handleSchoolListClick('sticky_mobile')}
          className={`
            w-full px-6 bg-green-500 hover:bg-green-600 text-white font-bold
            rounded-2xl shadow-lg shadow-green-500/25
            flex items-center justify-center gap-2
            transition-all duration-300
            ${scrollPastThreshold ? 'py-5 text-base min-h-[56px]' : 'py-4 text-sm min-h-[52px]'}
            ${shouldShake ? 'animate-shake' : ''}
          `}
        >
          <MessageSquare className="w-5 h-5" />
          {scrollPastThreshold
            ? 'Ya casi terminas — envía tu lista ahora'
            : 'Enviar mi lista por WhatsApp'
          }
        </button>
      </div>

      {/* Shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-3px); }
          30%, 70% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  )
}
