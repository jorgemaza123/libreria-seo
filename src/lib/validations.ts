import { z } from 'zod'

// ============================================
// ZOD VALIDATION SCHEMAS
// For all API route inputs
// ============================================

// Products
export const createProductSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  slug: z.string().optional(),
  description: z.string().optional().default(''),
  price: z.number().positive('Precio debe ser mayor a 0'),
  sale_price: z.number().positive().nullable().optional(),
  sku: z.string().optional().default(''),
  category_id: z.string().uuid().optional().nullable(),
  stock: z.number().int().min(0).optional().default(0),
  image: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  is_active: z.boolean().optional().default(true),
  is_featured: z.boolean().optional().default(false),
})

export const updateProductSchema = createProductSchema.partial()

// Categories
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  slug: z.string().optional(),
  icon: z.string().optional().default(''),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  gallery: z.array(z.string()).optional().default([]),
  is_active: z.boolean().optional().default(true),
  order: z.number().int().optional(),
})

export const updateCategorySchema = createCategorySchema.partial()

// Services
export const createServiceSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  slug: z.string().optional(),
  description: z.string().optional().default(''),
  short_description: z.string().optional().default(''),
  icon: z.string().optional().default(''),
  price: z.string().optional().default(''),
  is_active: z.boolean().optional().default(true),
  order: z.number().int().optional(),
})

// Promotions
export const createPromotionSchema = z.object({
  title: z.string().min(1, 'Título es requerido'),
  description: z.string().optional().default(''),
  image: z.string().optional().default(''),
  discount: z.number().min(0).optional(),
  discount_type: z.enum(['percentage', 'fixed']).optional().default('percentage'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  is_active: z.boolean().optional().default(true),
})

// Reviews
export const createReviewSchema = z.object({
  name: z.string().min(1, 'Nombre es requerido'),
  role: z.string().optional().default(''),
  avatar: z.string().optional().default(''),
  rating: z.number().int().min(1).max(5).default(5),
  comment: z.string().min(1, 'Comentario es requerido'),
  date: z.string().optional(),
  service: z.string().optional().default(''),
  is_active: z.boolean().optional().default(true),
})

// Settings
export const settingsSchema = z.object({
  key: z.string().min(1, 'Key es requerido'),
  value: z.unknown(),
})

// Conversion Events
export const conversionEventSchema = z.object({
  event_type: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
})

// Utility: validate and return parsed data or error response
export function validateBody<T>(schema: z.ZodSchema<T>, data: unknown):
  { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data)
  if (result.success) {
    return { success: true, data: result.data }
  }
  const errors = result.error.issues.map(i => i.message).join(', ')
  return { success: false, error: errors }
}
