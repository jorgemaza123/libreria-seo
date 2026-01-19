import { MetadataRoute } from 'next'
import { seoConfig } from '@/lib/seo'

// Cuando uses Supabase, importa los datos dinámicos
// import { getProducts, getCategories, getServices } from '@/lib/supabase/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = seoConfig.siteUrl

  // Páginas estáticas principales
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/#productos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#servicios`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/#promociones`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/#contacto`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

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
    // ...productPages,
    // ...categoryPages,
  ]
}
