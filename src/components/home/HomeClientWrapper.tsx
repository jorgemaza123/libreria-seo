"use client"

import { useSiteContent } from '@/contexts/SiteContentContext'
import type { HeroPriorityMode } from '@/contexts/SiteContentContext'
import { useDeepScrollIntent } from '@/hooks/use-deep-scroll-intent'
import { homeHeroCampaigns } from '@/data/campaigns'

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
import { CategoriesSection } from '@/components/sections/CategoriesSection'
import { ProductsSection } from '@/components/sections/ProductsSection'
import { CatalogsSection } from '@/components/sections/CatalogsSection'
import { ServicesSection } from '@/components/sections/ServicesSection'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { SeoLinksSection } from "@/components/sections/SeoLinksSection";
import { TrustSection } from '@/components/sections/TrustSection'
import { ContactSection } from '@/components/sections/ContactSection'

import { CustomPrintingSection } from '@/components/sections/CustomPrintingSection'
import { SchoolWorkCampaignSection } from '@/components/sections/SchoolWorkCampaignSection'

const HERO_COMPONENTS: Partial<Record<HeroPriorityMode, typeof ServicesConversionHero>> = {
  school: SchoolHero,
  sublimation: SublimationHero,
  services: ServicesConversionHero,
}

// ============================================
// HOME CLIENT WRAPPER
// Lee campaignMode del CMS → resuelve el config
// → renderiza countdown + hero + secciones fijas
// ============================================
export function HomeClientWrapper() {
  const { effectiveContent } = useSiteContent()
  const campaignMode = effectiveContent.hero.priorityMode ?? 'services'

  const campaign = homeHeroCampaigns[campaignMode as keyof typeof homeHeroCampaigns]
    ?? homeHeroCampaigns.services
  const ActiveHero = HERO_COMPONENTS[campaignMode] ?? ServicesConversionHero

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
        <SchoolWorkCampaignSection />
        <TrustSection />
        {/* <SchoolPacksSection /> - Ocultado temporalmente por UX Focus */}
        <CategoriesSection />
        <ServicesSection />
        <ProductsSection />
        <CatalogsSection />
        <SeoLinksSection />
        <CustomPrintingSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />
      <InteractiveWidgets />
    </div>
  )
}
