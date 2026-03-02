"use client"

import type { ComponentType } from 'react'
import { useSiteContent } from '@/contexts/SiteContentContext'
import type { HeroPriorityMode } from '@/contexts/SiteContentContext'
import { useDeepScrollIntent } from '@/hooks/use-deep-scroll-intent'

// Layout
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { InteractiveWidgets } from '@/components/layout/InteractiveWidgets'
import { CountdownBar } from '@/components/landing/CountdownBar'

// Campaign Heroes — uno por modo de campaña
import { SchoolHero } from '@/components/landing/SchoolHero'
import { SublimationHero } from '@/components/landing/SublimationHero'
import { ServicesConversionHero } from '@/components/landing/ServicesConversionHero'

// Home sections — siempre presentes debajo del hero
import { SchoolPacksSection } from '@/components/sections/SchoolPacksSection'
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { CatalogsSection } from '@/components/sections/CatalogsSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { TrustSection } from '@/components/sections/TrustSection'

import { CustomPrintingSection } from '@/components/sections/CustomPrintingSection'

// ============================================
// CAMPAIGN CONFIG — motor central de campañas
//
// Cada entrada define TODO lo que necesita un modo:
//   hero         → componente que se renderiza
//   countdown    → barra FOMO (solo si hay deadline)
//   primaryEvent → evento Meta Pixel / GTM activo
//   goal         → descripción del objetivo (logging / docs)
//
// Para agregar un nuevo modo:
//   1. Crear el componente Hero en /components/landing/
//   2. Añadir la entrada aquí
//   3. Activar el modo desde /admin/contenido
//   Sin tocar ningún otro archivo.
// ============================================

interface CampaignCountdown {
  targetDate: string
  text: string
  subtext: string
}

interface CampaignEntry {
  hero: ComponentType
  countdown?: CampaignCountdown
  primaryEvent: string
  goal: string
}

const CAMPAIGN_CONFIG: Partial<Record<HeroPriorityMode, CampaignEntry>> = {
  school: {
    hero: SchoolHero,
    countdown: {
      targetDate: '2026-03-15T23:59:59',
      text: 'Campaña Escolar hasta 15 de marzo',
      subtext: 'Envío GRATIS en compras mayores a S/200',
    },
    primaryEvent: 'SchoolListLead',
    goal: 'Capturar listas escolares por WhatsApp',
  },

  sublimation: {
    hero: SublimationHero,
    primaryEvent: 'SublimationLead',
    goal: 'Cotizaciones de sublimación y personalización',
  },

  services: {
    hero: ServicesConversionHero,
    primaryEvent: 'MultiServiceLead',
    goal: 'Multi-consulta rápida — útiles, sublimación, trámites',
  },

  // Futuros modos — descomentar cuando el Hero esté listo:
  // tramites: {
  //   hero: TramitesHero,
  //   primaryEvent: 'TramitesLead',
  //   goal: 'Consultas de trámites RENIEC/SUNAT y copias',
  // },
  // navidad: {
  //   hero: NavidadHero,
  //   countdown: { targetDate: '2026-12-24T23:59:59', text: '...', subtext: '...' },
  //   primaryEvent: 'NavidadLead',
  //   goal: 'Ventas de regalos navideños personalizados',
  // },
  // regalos: {
  //   hero: RegalosHero,
  //   primaryEvent: 'RegalosLead',
  //   goal: 'Pedidos de regalos personalizados',
  // },
  // 'black-friday': {
  //   hero: BlackFridayHero,
  //   countdown: { targetDate: '...', text: '...', subtext: '...' },
  //   primaryEvent: 'BlackFridayLead',
  //   goal: 'Conversiones de oferta Black Friday',
  // },
}

// Fallback: si el modo no tiene config, muestra ServicesConversionHero
const DEFAULT_CAMPAIGN: CampaignEntry = {
  hero: ServicesConversionHero,
  primaryEvent: 'MultiServiceLead',
  goal: 'Modo por defecto',
}

// ============================================
// HOME CLIENT WRAPPER
// Lee campaignMode del CMS → resuelve el config
// → renderiza countdown + hero + secciones fijas
// ============================================
export function HomeClientWrapper() {
  const { effectiveContent } = useSiteContent()
  const campaignMode = effectiveContent.hero.priorityMode ?? 'services'

  const campaign = CAMPAIGN_CONFIG[campaignMode] ?? DEFAULT_CAMPAIGN
  const ActiveHero = campaign.hero

  // 🔑 Hace que primaryEvent sea REAL, no solo documentación.
  // Cuando el usuario lee ≥80% de la página, Meta recibe:
  //   DeepScrollIntent { campaign_mode, primary_event, scroll_depth }
  // → audiencia de retargeting: "vio la campaña escolar pero no convirtió"
  useDeepScrollIntent({
    campaignMode,
    primaryEvent: campaign.primaryEvent,
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Countdown FOMO — solo si la campaña activa tiene deadline */}
      {campaign.countdown && (
        <CountdownBar
          targetDate={campaign.countdown.targetDate}
          text={campaign.countdown.text}
          subtext={campaign.countdown.subtext}
        />
      )}

      <Navbar />

      <main className="flex flex-col gap-0">
        {/* Hero dinámico — controlado por CMS */}
        <ActiveHero />

        {/* Secciones fijas de la Home */}
        <SchoolPacksSection />
        <CategoriesSection />
        <ProductsSection />
        <CatalogsSection />
        <ServicesSection />
        <CustomPrintingSection />
        <TestimonialsSection />
        <TrustSection />
      </main>

      <Footer />
      <InteractiveWidgets />
    </div>
  )
}
