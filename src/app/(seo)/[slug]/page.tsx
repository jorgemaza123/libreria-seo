import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Palette,
  Printer,
  ShoppingBag,
  Store,
  Zap,
} from 'lucide-react'
import { seoPagesConfig } from '@/data/seo/seoPagesConfig'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'

const DEFAULT_WHATSAPP = '51963725458'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const config = seoPagesConfig[resolvedParams.slug]

  if (!config) return {}

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    alternates: {
      canonical: `https://www.libreriachroma.com/${config.slug}`,
    },
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      locale: 'es_PE',
      type: 'website',
      url: `https://www.libreriachroma.com/${config.slug}`,
    },
  }
}

export async function generateStaticParams() {
  return Object.keys(seoPagesConfig).map((slug) => ({ slug }))
}

export default async function SeoLandingPage({ params }: PageProps) {
  const resolvedParams = await params
  const pageData = seoPagesConfig[resolvedParams.slug]

  if (!pageData) {
    notFound()
  }

  const phoneToUse = DEFAULT_WHATSAPP
  const rawMessage = pageData.whatsappMessage || 'Hola, necesito informacion.'
  const wppUrl = `https://wa.me/${phoneToUse}?text=${encodeURIComponent(rawMessage)}`
  const browseHref = pageData.categoryHint === 'servicios' ? '/#servicios' : '/#productos'
  const CategoryIcon =
    pageData.categoryHint === 'servicios'
      ? Printer
      : pageData.categoryHint === 'arte'
      ? Palette
      : ShoppingBag

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-white/5 bg-background py-16 sm:py-20 lg:py-24">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/8 blur-[120px]" />
            <div className="absolute -bottom-20 -right-20 h-[420px] w-[420px] rounded-full bg-sky-500/8 blur-[120px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-4xl text-center">
              <div className="section-kicker mb-4">
                <Store className="h-4 w-4" />
                Solucion local y rapida
              </div>

              <h1 className="mb-5 text-3xl font-heading font-extrabold leading-[1.08] text-white sm:text-4xl lg:text-6xl">
                {pageData.h1Title}
              </h1>

              <p className="mx-auto mb-8 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                {pageData.subtitle}
              </p>

              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="min-h-[56px] rounded-2xl px-8 text-lg font-bold shadow-lg shadow-primary/25"
                  asChild
                >
                  <a href={wppUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Solicitar por WhatsApp
                  </a>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="min-h-[56px] rounded-2xl px-8 text-lg font-semibold"
                  asChild
                >
                  <Link href={browseHref}>
                    Ver opciones
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-primary" />
                  Respuesta rapida
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Explicacion simple
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CategoryIcon className="h-4 w-4 text-primary" />
                  Atencion en tienda y por WhatsApp
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto mb-10 max-w-3xl text-center">
              <h2 className="mb-3 text-2xl font-heading font-bold text-white sm:text-3xl">
                Lo que resolvemos contigo
              </h2>
              <p className="text-muted-foreground">
                Cada punto responde a una duda o necesidad frecuente de nuestros clientes.
              </p>
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
              {pageData.painPoints.map((point, index) => (
                <div key={point} className="surface-card p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {index === 0 ? (
                      <Zap className="h-6 w-6" />
                    ) : index === 1 ? (
                      <CategoryIcon className="h-6 w-6" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6" />
                    )}
                  </div>
                  <p className="text-base leading-relaxed text-slate-100">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 bg-background py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="surface-panel mx-auto max-w-3xl p-8 text-center sm:p-10">
              <h2 className="mb-3 text-2xl font-heading font-bold text-white sm:text-3xl">
                ¿Quieres resolverlo hoy?
              </h2>
              <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Escríbenos por WhatsApp y te orientamos paso a paso para que sepas qué pedir, cuánto cuesta y cómo recogerlo.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button size="lg" className="min-h-[56px] rounded-2xl px-8 text-lg font-bold shadow-lg" asChild>
                  <a href={wppUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Hablar por WhatsApp
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="min-h-[56px] rounded-2xl px-8 text-lg font-semibold" asChild>
                  <Link href="/">
                    Volver al inicio
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
