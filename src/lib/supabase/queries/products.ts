import { createClient } from '../server'
import type { Database } from '../types'

type Product = Database['public']['Tables']['products']['Row']
type ProductInsert = Database['public']['Tables']['products']['Insert']
type ProductUpdate = Database['public']['Tables']['products']['Update']
type ProductWithCategory = Product & {
  category?: { id: string; name: string; slug: string } | null
}

export async function getProducts(options?: {
  featured?: boolean
  categoryId?: string
  limit?: number
  offset?: number
}): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query = (supabase as any)
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  if (options?.categoryId) {
    query = query.eq('category_id', options.categoryId)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) throw error
  return data as ProductWithCategory[]
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, order)
    `)
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug),
      images:product_images(id, url, alt, order)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createProduct(product: ProductInsert): Promise<Product> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .insert(product)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function updateProduct(id: string, product: ProductUpdate): Promise<Product> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .update({ ...product, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('products')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function searchProducts(query: string): Promise<ProductWithCategory[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('products')
    .select(`
      *,
      category:categories(id, name, slug)
    `)
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .limit(20)

  if (error) throw error
  return data as ProductWithCategory[]
}
