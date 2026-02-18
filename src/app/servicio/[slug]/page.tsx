import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ServiceLanding } from './ServiceLanding'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

async function getService(slug: string) {
  try {
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    const supabase = await createClient()
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
    title: `${service.title} | Librería CHROMA`,
    description: service.shortDescription || service.description?.slice(0, 160),
    openGraph: {
      title: `${service.title} | Librería CHROMA`,
      description: service.shortDescription || service.description?.slice(0, 160),
      type: 'website',
      locale: 'es_PE',
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

  return (
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
  )
}
