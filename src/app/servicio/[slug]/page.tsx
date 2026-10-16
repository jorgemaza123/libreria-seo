import type { Metadata } from 'next'
import { createPublicClient } from '@/lib/supabase/server'
import { ServiceLanding } from './ServiceLanding'
import { notFound } from 'next/navigation'
import { generateBreadcrumbSchema, generateFAQSchema, seoConfig } from '@/lib/seo'

export const revalidate = 3600

interface Props {
  params: Promise<{ slug: string }>
}

async function getService(slug: string) {
  try {
    const supabase = createPublicClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('services')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) return null
    return {
      id: data.id,
      title: data.title || data.name,
      name: data.name || data.title,
      slug: data.slug,
      description: data.description || '',
      shortDescription: data.short_description || '',
      icon: data.icon || '',
      price: data.price || '',
      image: data.image || '',
      isActive: data.is_active ?? true,
    }
  } catch {
    return null
  }
}

async function getServiceFAQs(serviceSlug: string) {
  try {
    const supabase = createPublicClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('faqs')
      .select('*')
      .eq('category', serviceSlug)
      .eq('is_active', true)
      .order('order', { ascending: true })
    return data || []
  } catch {
    return []
  }
}

async function getReviews(serviceName: string) {
  try {
    const supabase = createPublicClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('reviews')
      .select('*')
      .eq('is_active', true)
      .eq('service', serviceName)
      .order('created_at', { ascending: false })
      .limit(6)
    return data || []
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const service = await getService(slug)
  if (!service) return { title: 'Servicio no encontrado' }

  return {
    title: service.title,
    description: service.shortDescription || service.description?.slice(0, 160),
    alternates: {
      canonical: `/servicio/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | Librería CHROMA`,
      description: service.shortDescription || service.description?.slice(0, 160),
      type: 'website',
      locale: 'es_PE',
      url: `${seoConfig.siteUrl}/servicio/${service.slug}`,
      images: service.image ? [service.image] : [seoConfig.defaultImage],
    },
  }
}

export default async function ServicioPage({ params }: Props) {
  const { slug } = await params
  const service = await getService(slug)

  if (!service) notFound()

  const [faqs, reviews] = await Promise.all([
    getServiceFAQs(slug),
    getReviews(service.title),
  ])

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Inicio', url: seoConfig.siteUrl },
    { name: 'Servicios', url: `${seoConfig.siteUrl}/#servicios` },
    { name: service.title, url: `${seoConfig.siteUrl}/servicio/${service.slug}` },
  ])
  const faqSchema = faqs.length > 0
    ? generateFAQSchema(faqs.map((faq: Record<string, unknown>) => ({
        question: faq.question as string,
        answer: faq.answer as string,
      })))
    : null

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <ServiceLanding
        service={service}
        faqs={faqs.map((f: Record<string, unknown>) => ({
          id: f.id as string,
          question: f.question as string,
          answer: f.answer as string,
        }))}
        reviews={reviews.map((r: Record<string, unknown>) => ({
          id: r.id as string,
          name: r.name as string,
          role: (r.role || '') as string,
          avatar: (r.avatar || '') as string,
          rating: (r.rating || 5) as number,
          comment: (r.comment || '') as string,
        }))}
      />
    </>
  )
}
