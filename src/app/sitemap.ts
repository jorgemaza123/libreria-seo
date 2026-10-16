import type { MetadataRoute } from 'next'
import { seoPagesConfig } from '@/data/seo/seoPagesConfig'
import { schoolWorkPages } from '@/data/seo/schoolWorkArchitecture'
import { seoConfig } from '@/lib/seo'
import { createPublicClient } from '@/lib/supabase/server'

// Cuando uses Supabase, importa los datos dinámicos
// import { getProducts, getCategories, getServices } from '@/lib/supabase/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl

  // Páginas estáticas principales
  // NOTA: NO incluir URLs con fragmentos hash (#productos, #servicios, etc.)
  // Google no puede indexarlas como páginas independientes.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/listas-escolares`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
  ]

  const seoLandingPages: MetadataRoute.Sitemap = Object.values(seoPagesConfig).map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.82,
  }))

  const schoolWorkLandingPages: MetadataRoute.Sitemap = Object.values(schoolWorkPages).map((page) => ({
    url: `${baseUrl}/${page.slug}`,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'weekly',
    priority: page.slug === 'trabajos-escolares' ? 0.95 : 0.9,
  }))

  let productPages: MetadataRoute.Sitemap = []
  let servicePages: MetadataRoute.Sitemap = []

  try {
    const supabase = createPublicClient()
    const [productsResult, servicesResult] = await Promise.all([
      supabase.from('products').select('slug, updated_at').eq('is_active', true),
      supabase.from('services').select('slug, updated_at').eq('is_active', true),
    ])

    const products = (productsResult.data || []) as Array<{ slug: string; updated_at: string | null }>
    const services = (servicesResult.data || []) as Array<{ slug: string; updated_at: string | null }>

    productPages = products.map((product) => ({
      url: `${baseUrl}/producto/${product.slug}`,
      lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.65,
    }))

    servicePages = services.map((service) => ({
      url: `${baseUrl}/servicio/${service.slug}`,
      lastModified: service.updated_at ? new Date(service.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.72,
    }))
  } catch {
    // El sitemap principal sigue siendo válido si Supabase no responde durante el build.
  }

  // TODO: Cuando tengas Supabase configurado, agregar páginas dinámicas
  // const products = await getProducts()
  // const productPages: MetadataRoute.Sitemap = products.map((product) => ({
  //   url: `${baseUrl}/productos/${product.slug}`,
  //   lastModified: new Date(product.updatedAt),
  //   changeFrequency: 'weekly',
  //   priority: 0.6,
  // }))

  // const categories = await getCategories()
  // const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
  //   url: `${baseUrl}/categorias/${category.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }))

  return [
    ...staticPages,
    ...schoolWorkLandingPages,
    ...seoLandingPages,
    ...productPages,
    ...servicePages,
  ]
}
