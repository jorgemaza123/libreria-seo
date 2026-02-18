"use client"

import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useWhatsApp } from '@/hooks/use-whatsapp'
import { useConversionTracker } from '@/hooks/use-conversion-tracker'
import { generateWhatsAppURL } from '@/lib/whatsapp'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion'
import { DynamicIcon } from '@/components/DynamicIcon'
import {
  MessageSquare,
  ChevronRight,
  ChevronDown,
  Star,
  ShieldCheck,
  Clock,
  Award,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface ServiceData {
  id: string
  title: string
  name: string
  slug: string
  description: string
  shortDescription: string
  icon: string
  price: string
  image: string
  isActive: boolean
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Review {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  comment: string
}

interface ServiceLandingProps {
  service: ServiceData
  faqs: FAQ[]
  reviews: Review[]
}

export function ServiceLanding({ service, faqs, reviews }: ServiceLandingProps) {
  const { getWhatsAppNumber } = useWhatsApp()
  const { trackEvent } = useConversionTracker()
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const phone = getWhatsAppNumber()

  useEffect(() => {
    trackEvent('service_landing_view', { metadata: { service: service.slug } })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service.slug])

  const handleWhatsAppClick = () => {
    trackEvent('whatsapp_redirect', { metadata: { service: service.slug, source: 'service_landing' } })
    const url = generateWhatsAppURL('service_inquiry', { serviceName: service.title }, phone)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <FadeIn direction="right">
              <div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-6">
                  <DynamicIcon name={service.icon} className="w-7 h-7" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-foreground leading-tight mb-4">
                  {service.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {service.shortDescription || service.description}
                </p>
                {service.price && (
                  <p className="text-2xl font-bold text-primary mb-6">
                    {service.price}
                  </p>
                )}
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-green-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 min-h-[56px]"
                >
                  <MessageSquare className="w-5 h-5" />
                  Solicitar por WhatsApp
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </FadeIn>

            {service.image && (
              <FadeIn direction="left" delay={0.2}>
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </section>

      {/* Description */}
      {service.description && service.description !== service.shortDescription && (
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <FadeIn>
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
                  Sobre este servicio
                </h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  {service.description.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Trust signals */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { icon: Clock, label: 'Respuesta rápida', sub: 'Te cotizamos en minutos' },
              { icon: ShieldCheck, label: 'Calidad garantizada', sub: 'Materiales de primera' },
              { icon: Award, label: '+10 años de experiencia', sub: 'Negocio local de confianza' },
            ].map((item) => (
              <StaggerItem key={item.label}>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-2xl font-heading font-bold text-center text-foreground mb-8">
                Preguntas frecuentes
              </h2>
            </FadeIn>
            <div className="max-w-2xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <FadeIn key={faq.id}>
                  <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                    <button
                      onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-5 text-left min-h-[48px]"
                    >
                      <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      {reviews.length > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <FadeIn>
              <h2 className="text-2xl font-heading font-bold text-center text-foreground mb-8">
                Opiniones de clientes
              </h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {reviews.map((review) => (
                <StaggerItem key={review.id}>
                  <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      {review.avatar ? (
                        <Image src={review.avatar} alt={review.name} width={40} height={40} className="rounded-full object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                          {review.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-sm text-foreground">{review.name}</p>
                        {review.role && <p className="text-xs text-muted-foreground">{review.role}</p>}
                      </div>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/30'}`} />
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
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-primary-foreground mb-4">
                ¿Necesitas {service.title.toLowerCase()}?
              </h2>
              <p className="text-primary-foreground/80 mb-8 text-lg">
                Escríbenos por WhatsApp y te atendemos al instante
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-primary font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 min-h-[56px]"
              >
                <MessageSquare className="w-6 h-6" />
                Solicitar por WhatsApp
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/80 backdrop-blur-lg border-t border-border/50 md:hidden safe-area-bottom">
        <button
          onClick={handleWhatsAppClick}
          className="w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl shadow-lg shadow-green-500/25 flex items-center justify-center gap-2 min-h-[52px]"
        >
          <MessageSquare className="w-5 h-5" />
          Solicitar por WhatsApp
        </button>
      </div>
    </div>
  )
}
