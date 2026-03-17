"use client"

import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import Image from 'next/image'

export function CustomPrintingSection() {
  const externalUrl = "https://www.chromaestampados.com/"

  const benefits = [
    "Polos, tazas, gorras y regalos personalizados",
    "Diseños desde 1 unidad",
    "Colores duraderos y buena definicion",
    "Atencion rapida por WhatsApp",
    "Ideal para colegio, negocio o regalo",
  ]

  return (
    <section id="estampados-personalizados" className="overflow-hidden border-t border-white/5 bg-background py-14 sm:py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full lg:flex-1"
          >
            <div className="glass-card group relative z-10 mx-auto w-full max-w-[560px] overflow-hidden rounded-[1.75rem] border border-white/10 p-2 shadow-2xl sm:rounded-3xl">
              <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-muted sm:aspect-square">
                <Image
                  src="/panelestampados.avif"
                  alt="Servicio de estampados personalizados en Lima"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            <div className="absolute -left-6 -top-6 -z-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl sm:-left-12 sm:-top-12 sm:h-64 sm:w-64" />
            <div className="absolute -bottom-6 -right-6 -z-10 h-40 w-40 rounded-full bg-pink-500/5 blur-3xl sm:-bottom-12 sm:-right-12 sm:h-64 sm:w-64" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full space-y-6 lg:flex-1 lg:space-y-8"
          >
            <div className="space-y-4">
              <span className="section-kicker">Regalos y estampados</span>
              <h2 className="text-2xl font-heading font-extrabold leading-tight sm:text-4xl lg:text-5xl">
                Personaliza polos, tazas y regalos <span className="text-primary">sin hacerlo complicado</span>
              </h2>
              <div className="space-y-4 text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
                <p>
                  Si quieres un regalo, una prenda para tu negocio o un detalle para el colegio,
                  entra a nuestro catalogo especializado de estampados.
                </p>
                <p>
                  Encontraras modelos, ideas y opciones faciles de cotizar.
                  Si ya tienes una idea, tambien puedes escribirnos y la revisamos contigo.
                </p>
                <a
                  href={externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-semibold text-primary transition-all hover:underline decoration-primary/30 underline-offset-4"
                >
                  Ver sitio de estampados
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="group flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3 sm:rounded-none sm:border-0 sm:bg-transparent sm:p-0"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium leading-relaxed sm:text-base">{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Button
                size="lg"
                className="group h-auto min-h-[54px] w-full px-5 py-4 text-base font-bold shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] sm:w-auto sm:px-8 sm:text-lg"
                asChild
              >
                <a href={externalUrl} target="_blank" rel="noopener noreferrer">
                  Ver catalogo completo de estampados
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
