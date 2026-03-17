"use client"

import { useState, useEffect, useCallback } from 'react'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { useConversionCTA } from '@/hooks/use-conversion-cta'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { trackMultiServiceLead } from '@/lib/analytics'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import { HeroImageBackdrop } from '@/components/landing/HeroImageBackdrop'
import {
  Backpack,
  Check,
  ChevronRight,
  FileText,
  MessageSquare,
  Palette,
  Printer,
  Scissors,
  ShieldCheck,
  Store,
  Truck,
  Zap,
} from 'lucide-react'

const URGENCY_MESSAGES = [
  'Cotizamos por WhatsApp en minutos',
  'Manda tu lista o tu archivo sin salir de casa',
  'Recojo en tienda o delivery local',
  'Atencion clara para escolares, padres y adultos mayores',
] as const

const SERVICE_CARDS = [
  {
    id: 'school',
    Icon: Backpack,
    shortcutLabel: 'Listas',
    colorBg: 'bg-amber-500/12',
    colorText: 'text-amber-300',
    borderHover: 'hover:border-amber-400/40',
    btnColor: 'bg-amber-500 hover:bg-amber-400 text-slate-950',
    title: 'Listas y utiles escolares',
    bullets: [
      'Cotizacion por foto de tu lista',
      'Inicial, primaria y secundaria',
      'Opciones segun tu presupuesto',
    ],
    cta: 'Enviar mi lista',
    msgType: 'school_list' as const,
    msgPayload: {},
  },
  {
    id: 'prints',
    Icon: Printer,
    shortcutLabel: 'Impresiones',
    colorBg: 'bg-sky-500/12',
    colorText: 'text-sky-300',
    borderHover: 'hover:border-sky-400/40',
    btnColor: 'bg-sky-500 hover:bg-sky-400 text-slate-950',
    title: 'Impresiones, tareas e investigaciones',
    bullets: [
      'Envianos tu archivo por WhatsApp',
      'Blanco y negro o a color',
      'Ideal para tareas, investigaciones y separatas',
    ],
    cta: 'Imprimir mi archivo',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'impresiones y PDF' },
  },
  {
    id: 'projects',
    Icon: Scissors,
    shortcutLabel: 'Maquetas',
    colorBg: 'bg-fuchsia-500/12',
    colorText: 'text-fuchsia-300',
    borderHover: 'hover:border-fuchsia-400/40',
    btnColor: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950',
    title: 'Maquetas y trabajos',
    bullets: [
      'Cartulinas, tecnopor, silicona y mas',
      'Materiales para exposiciones escolares',
      'Te ayudamos a resolver el pedido rapido',
    ],
    cta: 'Consultar maqueta',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'maquetas y trabajos escolares' },
  },
  {
    id: 'tramites',
    Icon: FileText,
    shortcutLabel: 'Tramites',
    colorBg: 'bg-emerald-500/12',
    colorText: 'text-emerald-300',
    borderHover: 'hover:border-emerald-400/40',
    btnColor: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950',
    title: 'Tramites, copias y escaneos',
    bullets: [
      'RENIEC, SUNAT y formularios',
      'Fotocopias y escaneos rapidos',
      'Atencion clara y sin vueltas',
    ],
    cta: 'Consultar tramite',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'tramites, copias y escaneos' },
  },
  {
    id: 'gifts',
    Icon: Palette,
    shortcutLabel: 'Regalos',
    colorBg: 'bg-violet-500/12',
    colorText: 'text-violet-300',
    borderHover: 'hover:border-violet-400/40',
    btnColor: 'bg-violet-500 hover:bg-violet-400 text-slate-950',
    title: 'Estampados y regalos',
    bullets: [
      'Polos, tazas, cojines y detalles',
      'Disenos personalizados desde 1 unidad',
      'Ideal para colegio, negocio o regalo',
    ],
    cta: 'Cotizar regalo',
    msgType: 'service_inquiry' as const,
    msgPayload: { serviceName: 'estampados y regalos personalizados' },
  },
] as const

const TRUST_BADGES = [
  { Icon: Store, label: 'Frente al colegio', sub: 'Ubicacion facil de encontrar' },
  { Icon: Truck, label: 'Recojo o delivery', sub: 'Rapido para VMT y zonas cercanas' },
  { Icon: ShieldCheck, label: 'Atencion confiable', sub: 'Explicamos claro y sin tecnicismos' },
] as const

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function ServicesConversionHero() {
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const phone = getWhatsAppNumber()

  const [urgencyIdx, setUrgencyIdx] = useState(0)
  const [urgencyVisible, setUrgencyVisible] = useState(true)
  const [isMobileShortcutCollapsed, setIsMobileShortcutCollapsed] = useState(false)

  useEffect(() => {
    let swap: ReturnType<typeof setTimeout> | null = null
    const intervalId = setInterval(() => {
      setUrgencyVisible(false)
      swap = setTimeout(() => {
        setUrgencyIdx((idx) => (idx + 1) % URGENCY_MESSAGES.length)
        setUrgencyVisible(true)
      }, 220)
    }, 4200)

    return () => {
      clearInterval(intervalId)
      if (swap !== null) clearTimeout(swap)
    }
  }, [])

  useEffect(() => {
    const updateShortcutState = () => {
      const nextState = window.innerWidth < 640 && window.scrollY > 46
      setIsMobileShortcutCollapsed((current) => (current === nextState ? current : nextState))
    }

    updateShortcutState()
    window.addEventListener('scroll', updateShortcutState, { passive: true })
    window.addEventListener('resize', updateShortcutState)

    return () => {
      window.removeEventListener('scroll', updateShortcutState)
      window.removeEventListener('resize', updateShortcutState)
    }
  }, [])

  const handleServiceClick = useCallback(
    (serviceId: string, msgType: typeof SERVICE_CARDS[number]['msgType'], msgPayload: object) => {
      trackEvent('hero_cta_click', { metadata: { type: 'services_card', service: serviceId } })
      trackMultiServiceLead({ source: 'home_hero_card', service: serviceId })
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

  const scrollToServiceCard = useCallback(
    (serviceId: string) => {
      const target = document.getElementById(`hero-service-${serviceId}`)

      trackEvent('hero_cta_click', { metadata: { type: 'services_shortcut', service: serviceId } })

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    },
    [trackEvent],
  )

  return (
    <section id="hero" className="relative isolate overflow-hidden bg-background-dark">
      <HeroImageBackdrop />

      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-[500px] w-[500px] rounded-full bg-sky-500/8 blur-3xl" />
      </div>

      <div className="container relative z-20 mx-auto px-4 pt-8 pb-12 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto mb-8 w-full max-w-[360px] text-left sm:mb-10 sm:max-w-3xl sm:text-center">
          <FadeIn delay={0}>
            <div className="section-kicker mb-3 mr-auto max-w-full justify-start text-left text-[11px] leading-tight sm:mx-auto sm:mb-4 sm:max-w-none sm:justify-center sm:text-center sm:text-sm">
              <Store className="h-4 w-4" />
              <span className="sm:hidden">Libreria, impresiones y tramites</span>
              <span className="hidden sm:inline">Libreria, impresiones, maquetas y tramites en un solo lugar</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.05}>
            <div
              className={`mb-4 inline-flex max-w-full items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1.5 text-[11px] font-semibold leading-tight text-green-300 transition-opacity duration-300 sm:mb-5 sm:max-w-none sm:text-xs ${
                urgencyVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Zap className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="sm:hidden">Atencion clara y rapida por WhatsApp</span>
              <span className="hidden sm:inline">{URGENCY_MESSAGES[urgencyIdx]}</span>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="mb-4 w-full text-[2.4rem] font-heading font-extrabold leading-[1.02] tracking-tight text-foreground sm:mx-auto sm:mb-5 sm:max-w-3xl sm:text-4xl sm:leading-[1.08] md:text-5xl lg:text-6xl">
              <span className="sm:hidden">Tareas, impresiones, maquetas y regalos.</span>
              <span className="hidden sm:inline">Hacemos tus tareas, impresiones, investigaciones, maquetas y regalos.</span>
              <span className="mt-2 block text-primary sm:hidden">Tambien stickers, tazas y tramites.</span>
              <span className="mt-2 hidden text-primary sm:block">Tambien stickers, polos, tazas y tramites.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.18}>
            <p className="mb-6 w-full text-sm leading-relaxed text-muted-foreground sm:mx-auto sm:mb-7 sm:max-w-2xl sm:text-lg">
              <span className="sm:hidden">Atendemos Inicial, Primaria y Secundaria por WhatsApp, con explicacion clara y recojo rapido.</span>
              <span className="hidden sm:inline">
                Soluciones profesionales para Inicial, Primaria y Secundaria. Olvida las noches de estres y deja en
                nuestras manos tu confianza.
              </span>
            </p>
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="flex w-full flex-col items-stretch justify-center gap-3 sm:mx-auto sm:max-w-none sm:flex-row sm:items-center">
              <button
                onClick={handlePrimaryClick}
                {...primaryCtaProps}
                className="group inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/92 hover:shadow-xl sm:min-h-[58px] sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                <WhatsAppGlyph className="h-5 w-5" />
                Cotizar ahora por WhatsApp
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="#productos"
                onClick={() => trackEvent('hero_cta_click', { metadata: { type: 'services_secondary_products' } })}
                className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-sm transition-all duration-300 hover:border-primary/40 hover:bg-accent sm:min-h-[58px] sm:w-auto sm:px-8 sm:py-4"
              >
                Ver productos y materiales
              </a>
            </div>
          </FadeIn>

          <FadeIn delay={0.28}>
            <div
              className={`mt-4 grid grid-cols-2 gap-2 transition-all duration-500 sm:hidden ${
                isMobileShortcutCollapsed ? 'pointer-events-none -translate-y-2 opacity-0 scale-[0.96]' : 'translate-y-0 opacity-100 scale-100'
              }`}
            >
              {SERVICE_CARDS.map((service, index) => (
                <button
                  key={`shortcut-${service.id}`}
                  type="button"
                  onClick={() => scrollToServiceCard(service.id)}
                  className={`flex min-h-[54px] items-center gap-2 rounded-full border border-white/10 bg-black/26 px-3 py-2.5 text-left text-[13px] font-semibold text-white/90 shadow-[0_10px_28px_rgba(0,0,0,0.16)] backdrop-blur-md transition-all duration-300 active:scale-[0.98] ${
                    index === SERVICE_CARDS.length - 1 ? 'col-span-2' : ''
                  }`}
                >
                  <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full ${service.colorBg}`}>
                    <service.Icon className={`h-4 w-4 ${service.colorText}`} />
                  </span>
                  <span>{service.shortcutLabel}</span>
                </button>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="mt-5 hidden flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground sm:flex">
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Cotizacion rapida
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Respuesta humana
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-primary" />
                Explicacion simple
              </span>
            </div>
          </FadeIn>
        </div>

        <StaggerContainer
          className={`mx-auto mb-10 grid max-w-6xl grid-cols-1 gap-4 transition-all duration-500 sm:grid-cols-2 sm:transition-none xl:grid-cols-5 ${
            isMobileShortcutCollapsed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-95'
          }`}
        >
          {SERVICE_CARDS.map((service) => (
            <StaggerItem key={service.id}>
              <div
                id={`hero-service-${service.id}`}
                className={`surface-card group flex h-full flex-col p-5 transition-all duration-500 ${service.borderHover} ${
                  isMobileShortcutCollapsed ? 'rounded-[30px] translate-y-0 opacity-100' : 'rounded-[40px] translate-y-5 opacity-90'
                } hover:-translate-y-0.5 hover:shadow-xl sm:rounded-3xl sm:translate-y-0 sm:opacity-100`}
              >
                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${service.colorBg}`}>
                  <service.Icon className={`h-6 w-6 ${service.colorText}`} />
                </div>

                <h3 className="mb-3 text-lg font-heading font-bold leading-tight text-foreground">{service.title}</h3>

                <ul className="mb-5 flex-1 space-y-2">
                  {service.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
                      <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      {bullet}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleServiceClick(service.id, service.msgType, service.msgPayload)}
                  className={`inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold shadow-md transition-all duration-300 hover:shadow-lg ${service.btnColor}`}
                >
                  <MessageSquare className="h-4 w-4" />
                  {service.cta}
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2}>
          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {TRUST_BADGES.map(({ Icon, label, sub }) => (
                <div key={label} className="surface-card flex items-center gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold leading-tight text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <a
                href="#servicios"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:underline"
              >
                Ver mas servicios y detalles
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
