import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Layers3,
  MapPin,
  MessageCircle,
  PackageCheck,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SchoolWorkQuoteForm } from "@/components/school-work/SchoolWorkQuoteForm";
import { schoolWorkPages, type SchoolWorkPage } from "@/data/seo/schoolWorkArchitecture";
import { BUSINESS_INFO } from "@/lib/constants";
import { generateBreadcrumbSchema, generateFAQSchema, seoConfig } from "@/lib/seo";

interface SchoolWorkLandingProps {
  page: SchoolWorkPage;
}

const serviceIcons = [Layers3, BookOpenCheck, Sparkles, ClipboardList, PackageCheck, GraduationCap];

export function SchoolWorkLanding({ page }: SchoolWorkLandingProps) {
  const breadcrumbItems = [
    { name: "Inicio", url: seoConfig.siteUrl },
    ...(page.slug === "trabajos-escolares"
      ? []
      : [{ name: "Trabajos escolares", url: `${seoConfig.siteUrl}/trabajos-escolares` }]),
    { name: page.h1, url: `${seoConfig.siteUrl}/${page.slug}` },
  ];

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);
  const faqSchema = generateFAQSchema(page.faqs);
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.metaTitle,
    description: page.metaDescription,
    url: `${seoConfig.siteUrl}/${page.slug}`,
    provider: {
      "@type": "LocalBusiness",
      "@id": seoConfig.siteUrl,
      name: BUSINESS_INFO.name,
    },
    areaServed: {
      "@type": "City",
      name: "Lima Metropolitana",
    },
    serviceType: page.quoteType,
  };

  const relatedPages = page.relatedSlugs
    .map((slug) => schoolWorkPages[slug])
    .filter((related): related is SchoolWorkPage => Boolean(related));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />

      <Navbar />

      <main>
        <section className="relative overflow-hidden border-b border-white/5 pb-16 pt-8 sm:pb-20 sm:pt-12 lg:pb-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[12%] top-8 h-72 w-72 rounded-full bg-primary/10 blur-[110px]" />
            <div className="absolute right-[8%] top-40 h-80 w-80 rounded-full bg-cyan-500/8 blur-[130px]" />
          </div>

          <div className="container relative z-10 mx-auto px-4 sm:px-6">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li><Link href="/" className="transition-colors hover:text-primary">Inicio</Link></li>
                {page.slug !== "trabajos-escolares" && (
                  <>
                    <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                    <li><Link href="/trabajos-escolares" className="transition-colors hover:text-primary">Trabajos escolares</Link></li>
                  </>
                )}
                <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
                <li aria-current="page" className="text-slate-200">{page.eyebrow}</li>
              </ol>
            </nav>

            <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
              <div>
                <div className="section-kicker mb-5">
                  <MapPin className="h-4 w-4" />
                  {page.eyebrow}
                </div>
                <h1 className="max-w-4xl font-heading text-4xl font-extrabold leading-[1.06] text-white sm:text-5xl lg:text-6xl">
                  {page.h1}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-200 sm:text-xl">
                  {page.lead}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="min-h-14 rounded-2xl px-7 text-base font-bold shadow-lg shadow-primary/20">
                    <a href="#cotizar">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      {page.primaryCta}
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="min-h-14 rounded-2xl px-7 text-base font-semibold">
                    <a href="#opciones">
                      Ver opciones
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </a>
                  </Button>
                </div>

                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Cotización según alcance</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Inicial, primaria y secundaria</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Coordinación por WhatsApp</span>
                </div>
              </div>

              <aside className="surface-panel p-6 sm:p-8" aria-label="Respuesta rápida">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Respuesta directa</p>
                <p className="text-base leading-8 text-slate-100 sm:text-lg">{page.directAnswer}</p>
                <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/8 p-4">
                  <p className="text-sm font-semibold text-white">Atención coordinada desde {BUSINESS_INFO.address.district}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    La cobertura y forma de entrega se confirman según el distrito y el pedido.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section id="opciones" className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 max-w-3xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Opciones reales</p>
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{page.servicesTitle}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{page.servicesIntro}</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {page.services.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                const content = (
                  <>
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{service.description}</p>
                    {service.href && (
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                        Ver información <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </>
                );

                return service.href ? (
                  <Link key={service.title} href={service.href} className="surface-card group flex min-h-64 flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
                    {content}
                  </Link>
                ) : (
                  <article key={service.title} className="surface-card flex min-h-64 flex-col p-6">{content}</article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-black/15 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-10 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Mapa del tema</p>
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{page.topicsTitle}</h2>
            </div>
            <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
              {page.topicGroups.map((group) => (
                <article key={group.title} className="surface-card p-6">
                  <h3 className="font-heading text-xl font-bold text-white">{group.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {group.items.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:gap-14">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Guía útil</p>
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{page.guideTitle}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{page.guideIntro}</p>
              <div className="mt-8 space-y-4">
                {page.guideSteps.map((step, index) => (
                  <article key={step.title} className="surface-card flex gap-4 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-base font-extrabold text-primary-foreground">{index + 1}</span>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white">{step.title}</h3>
                      <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <article className="surface-panel p-6 sm:p-8">
                <h2 className="font-heading text-2xl font-bold text-white">Datos para cotizar mejor</h2>
                <ul className="mt-5 space-y-3">
                  {page.requirements.map((requirement) => (
                    <li key={requirement} className="flex items-start gap-3 text-sm leading-6 text-slate-200">
                      <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </article>

              {page.levels.map((level) => (
                <article key={level.title} className="surface-card p-6">
                  <h3 className="font-heading text-xl font-bold text-white">{level.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{level.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/5 bg-black/15 py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6">
            <SchoolWorkQuoteForm defaultType={page.quoteType} sourceSlug={page.slug} />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="container mx-auto grid gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-primary">Antes de cotizar</p>
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">Preguntas frecuentes sobre {page.eyebrow.toLowerCase()}</h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                Respuestas breves para decidir qué información enviar y qué alcance consultar.
              </p>
            </div>
            <div className="space-y-3">
              {page.faqs.map((faq) => (
                <details key={faq.question} className="surface-card group p-5 open:border-primary/30">
                  <summary className="cursor-pointer list-none pr-8 font-heading text-lg font-bold text-white marker:hidden">
                    {faq.question}
                  </summary>
                  <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/5 pb-20 pt-14">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">Siguiente paso</p>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">Temas relacionados</h2>
              </div>
              <Link href="/trabajos-escolares" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                Ver todos los trabajos <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedPages.map((related) => (
                <Link key={related.slug} href={`/${related.slug}`} className="surface-card group p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/35">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">{related.eyebrow}</p>
                  <h3 className="mt-3 font-heading text-lg font-bold leading-snug text-white">{related.h1}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 group-hover:text-primary">
                    Abrir página <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
