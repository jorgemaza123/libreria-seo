// ============================================
// CENTRALIZED DATABASE MAPPER
// snake_case (Supabase) <-> camelCase (Frontend)
// ============================================

type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${Lowercase<T>}${CamelToSnake<U>}`
    : `${Lowercase<T>}_${CamelToSnake<U>}`
  : S

/**
 * Convert a camelCase string to snake_case
 */
export function toSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Convert a snake_case string to camelCase
 */
export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

/**
 * Convert object keys from snake_case to camelCase
 */
export function mapFromDB<T extends Record<string, unknown>>(
  obj: Record<string, unknown>
): T {
  if (!obj || typeof obj !== 'object') return obj as T

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = toCamelCase(key)
    // Don't recurse into arrays or nested objects that are jsonb columns
    result[camelKey] = value
  }
  return result as T
}

/**
 * Convert object keys from camelCase to snake_case
 */
export function mapToDB(obj: Record<string, unknown>): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') return obj

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = toSnakeCase(key)
    result[snakeKey] = value
  }
  return result
}

/**
 * Map an array of DB records to frontend objects
 */
export function mapArrayFromDB<T extends Record<string, unknown>>(
  arr: Record<string, unknown>[]
): T[] {
  return arr.map((item) => mapFromDB<T>(item))
}

/**
 * Standard product mapper from Supabase to frontend
 */
export function mapProduct(raw: Record<string, unknown>) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description || '',
    price: raw.price,
    salePrice: raw.sale_price,
    sku: raw.sku || '',
    category: (raw.category as Record<string, string>)?.name || '',
    categorySlug: (raw.category as Record<string, string>)?.slug || '',
    stock: raw.stock || 0,
    image: raw.image || '',
    gallery: raw.gallery || [],
    isActive: raw.is_active,
    isFeatured: raw.is_featured,
    createdAt: raw.created_at,
    updatedAt: raw.updated_at,
  }
}

/**
 * Standard category mapper
 */
export function mapCategory(raw: Record<string, unknown>) {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    icon: raw.icon || '',
    description: raw.description || '',
    image: raw.image || '',
    gallery: raw.gallery || [],
    order: raw.order || 0,
    isActive: raw.is_active ?? true,
  }
}

/**
 * Standard service mapper
 */
export function mapService(raw: Record<string, unknown>) {
  return {
    id: raw.id,
    name: raw.name || raw.title,
    title: raw.title || raw.name,
    slug: raw.slug,
    description: raw.description || '',
    shortDescription: raw.short_description || '',
    icon: raw.icon || '',
    price: raw.price || '',
    image: raw.image || '',
    isActive: raw.is_active ?? true,
    order: raw.order || 0,
  }
}

/**
 * Standard promotion mapper
 */
export function mapPromotion(raw: Record<string, unknown>) {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description || '',
    image: raw.image || '',
    discount: raw.discount,
    discountType: raw.discount_type,
    startDate: raw.start_date,
    endDate: raw.end_date,
    isActive: raw.is_active ?? true,
  }
}

/**
 * Standard review mapper
 */
export function mapReview(raw: Record<string, unknown>) {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role || '',
    avatar: raw.avatar || '',
    rating: raw.rating || 5,
    comment: raw.comment || '',
    date: raw.date || '',
    service: raw.service || '',
    isActive: raw.is_active ?? true,
  }
}
