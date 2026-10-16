"use client"

import Link from "next/link"
import {
  ArrowRight,
  BookOpenCheck,
  Boxes,
  CalendarCheck2,
  FileText,
  FlaskConical,
  Presentation,
  Printer,
  Scissors,
} from "lucide-react"
import { seoPagesConfig } from "@/data/seo/seoPagesConfig"

const needLinks = [
  {
    title: "Necesito una maqueta",
    description: "Ciencias, geografía, historia, ambiente y estructuras para inicial, primaria o secundaria.",
    href: "/maquetas-escolares-lima",
    icon: Boxes,
  },
  {
    title: "Necesito un trabajo escolar",
    description: "Encuentra el formato adecuado según el tema, el curso y lo que debes presentar.",
    href: "/trabajos-escolares",
    icon: BookOpenCheck,
  },
  {
    title: "Tengo Día del Logro",
    description: "Opciones para explicar un aprendizaje, presentar un proyecto o preparar un panel.",
    href: "/dia-del-logro",
    icon: CalendarCheck2,
  },
  {
    title: "Necesito un proyecto de ciencia",
    description: "Experimentos, prototipos, informe, panel y apoyo visual para la exposición.",
    href: "/proyectos-de-ciencia",
    icon: FlaskConical,
  },
  {
    title: "Tengo que exponer",
    description: "Paneles, papelotes, rótulos, infografías, líneas de tiempo y material visual.",
    href: "/material-para-exposiciones",
    icon: Presentation,
  },
  {
    title: "Necesito imprimir material",
    description: "Envía tu PDF o referencia por WhatsApp y consulta formato, cantidad y fecha.",
    href: "/impresion-de-trabajos-y-pdf-por-whatsapp",
    icon: Printer,
  },
] as const

const secondarySlugs = [
  "listas-escolares-completas-sin-salir-de-casa",
  "materiales-para-maquetas-y-trabajos",
  "forrado-de-cuadernos-y-etiquetas-personalizadas",
  "fotocopias-y-escaneos-rapidos",
  "necesito-utiles-urgente",
] as const

export function SeoLinksSection() {
  const secondaryPages = secondarySlugs.map((slug) => seoPagesConfig[slug]).filter(Boolean)

  return (
    <section className="relative overflow-hidden bg-background py-20" aria-labelledby="needs-title">
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="pointer-events-none absolute -right-48 top-24 h-[520px] w-[520px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-3xl">
          <div className="section-kicker mb-4">
            <FileText className="h-4 w-4" />
            Empieza por lo que necesitas
          </div>
          <h2 id="needs-title" className="font-heading text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
            ¿Qué trabajo tienes que resolver?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Elige una necesidad. Verás opciones, ejemplos y los datos que debes enviar para recibir una cotización útil.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {needLinks.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="surface-card group flex min-h-60 flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{item.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Ver opciones
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>

        <div className="surface-card mx-auto mt-8 max-w-6xl p-6">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <Scissors className="h-4 w-4 text-primary" aria-hidden="true" />
            Otras soluciones frecuentes
          </div>
          <div className="flex flex-wrap gap-2.5">
            {secondaryPages.map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {page.h1Title}
              </Link>
            ))}
            <Link href="/lapbooks-escolares" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Lapbooks escolares
            </Link>
            <Link href="/tripticos-escolares" className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 transition-colors hover:border-primary/35 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Trípticos escolares
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
