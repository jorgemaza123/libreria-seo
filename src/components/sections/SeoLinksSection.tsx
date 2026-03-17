"use client"

import Link from 'next/link'
import { ArrowRight, FileText, Printer, Scissors, Sparkles, Target } from 'lucide-react'
import { seoPagesConfig } from '@/data/seo/seoPagesConfig'

const FEATURED_SLUGS = [
  'listas-escolares-completas-sin-salir-de-casa',
  'impresion-de-trabajos-y-pdf-por-whatsapp',
  'materiales-para-maquetas-y-trabajos',
  'forrado-de-cuadernos-y-etiquetas-personalizadas',
  'fotocopias-y-escaneos-rapidos',
  'necesito-utiles-urgente',
] as const

const iconMap = {
  utiles: Target,
  servicios: Printer,
  arte: Sparkles,
} as const

export function SeoLinksSection() {
  const pages = Object.values(seoPagesConfig)
  const featuredPages = FEATURED_SLUGS.map((slug) => seoPagesConfig[slug]).filter(Boolean)
  const featuredSet = new Set(featuredPages.map((page) => page.slug))
  const otherPages = pages.filter((page) => !featuredSet.has(page.slug))

  return (
    <section className="relative overflow-hidden bg-background py-20">
      <div className="absolute left-0 top-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <div className="section-kicker mb-4">
            <FileText className="h-4 w-4" />
            Soluciones rapidas
          </div>
          <h2 className="mb-4 text-3xl font-heading font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
            Resuelve tu pedido en menos pasos.
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Aqui estan las consultas mas comunes para utiles, impresiones, maquetas,
            forrado y tramites. Elegimos primero las que mas convierten, sin ocultar tus enlaces SEO.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featuredPages.map((page) => {
            const Icon = iconMap[page.categoryHint] || Target

            return (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="surface-card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-xl"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300">
                    {page.categoryHint}
                  </span>
                </div>

                <h3 className="mb-3 text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
                  {page.h1Title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {page.subtitle}
                </p>

                <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir solucion
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>

        <div className="surface-card mx-auto mt-8 max-w-6xl p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Scissors className="h-4 w-4 text-primary" />
            Mas busquedas utiles
          </div>
          <div className="flex flex-wrap gap-2.5">
            {otherPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-primary/35 hover:text-primary"
              >
                {page.h1Title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
