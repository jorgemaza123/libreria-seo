"use client"

import { useMemo } from 'react'
import { Award, Clock, CreditCard, MapPin, Shield, Store, Truck } from 'lucide-react'
import { useSiteContent } from '@/contexts/SiteContentContext'

const ICON_MAP: Record<string, any> = {
  Store,
  Truck,
  CreditCard,
  Shield,
  Clock,
  MapPin,
  Award,
}

const DEFAULT_TRUST = [
  {
    iconName: 'Store',
    title: 'años',
    subtitle: 'atendiendo en la zona',
    highlight: true,
    hasLogos: false,
  },
  {
    iconName: 'Truck',
    title: 'Recojo o delivery',
    subtitle: 'segun tu comodidad',
    highlight: false,
    hasLogos: false,
  },
  {
    iconName: 'CreditCard',
    title: 'Yape y Plin',
    subtitle: 'pagos rapidos',
    highlight: false,
    hasLogos: true,
  },
  {
    iconName: 'Shield',
    title: 'Atencion clara',
    subtitle: 'sin complicarte',
    highlight: false,
    hasLogos: false,
  },
  {
    iconName: 'Clock',
    title: 'Respuesta',
    subtitle: 'por WhatsApp',
    highlight: false,
    hasLogos: false,
  },
  {
    iconName: 'MapPin',
    title: 'Frente al',
    subtitle: 'Colegio Estela Maris',
    highlight: false,
    hasLogos: false,
  },
]

export function TrustSection() {
  const { effectiveContent } = useSiteContent()

  const trustItems = useMemo(() => {
    const dbTrust = (effectiveContent as any)?.trust
    if (dbTrust && Array.isArray(dbTrust) && dbTrust.length > 0) {
      return dbTrust
    }
    return DEFAULT_TRUST
  }, [effectiveContent])

  return (
    <section className="overflow-hidden border-b border-white/5 bg-background py-8 text-white md:py-10" aria-label="Razones para confiar en nosotros">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-6 text-center lg:hidden">
          <div className="section-kicker">
            <Award className="h-4 w-4" />
            Por que elegirnos
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-5 sm:grid-cols-3 lg:grid-cols-6" role="list">
          {trustItems.map((item: any, index: number) => {
            const IconComponent = ICON_MAP[item.iconName] || ICON_MAP.Store

            return (
              <div
                key={index}
                role="listitem"
                className={`glass-card flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
                  item.highlight
                    ? 'scale-[1.02] border-primary/40 bg-primary/15 shadow-xl shadow-primary/10'
                    : 'border-white/10 bg-surface-dark/80 hover:border-white/20'
                }`}
              >
                <div
                  className={`mb-3 flex h-14 w-14 items-center justify-center rounded-xl sm:h-16 sm:w-16 ${
                    item.highlight
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                  aria-hidden="true"
                >
                  <IconComponent className="h-7 w-7 sm:h-8 sm:w-8" />
                </div>

                <p className="text-base font-bold leading-tight sm:text-lg">{item.title}</p>
                <p className="mt-0.5 text-sm text-secondary-foreground/80 sm:text-base">{item.subtitle}</p>

                {item.hasLogos && (
                  <div className="mt-3 flex gap-2">
                    <div className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-md sm:text-sm">
                      YAPE
                    </div>
                    <div className="rounded-lg bg-teal-500 px-3 py-1.5 text-xs font-bold text-white shadow-md sm:text-sm">
                      PLIN
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
