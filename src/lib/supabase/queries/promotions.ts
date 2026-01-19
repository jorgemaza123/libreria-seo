import { createClient } from '../server'
import type { Database } from '../types'

type Promotion = Database['public']['Tables']['promotions']['Row']
type PromotionInsert = Database['public']['Tables']['promotions']['Insert']
type PromotionUpdate = Database['public']['Tables']['promotions']['Update']

export async function getPromotions(): Promise<Promotion[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .gte('end_date', new Date().toISOString())
    .order('start_date', { ascending: true })

  if (error) throw error
  return data as Promotion[]
}

export async function getActivePromotions(): Promise<Promotion[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('promotions')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .gte('end_date', now)
    .order('start_date', { ascending: true })

  if (error) throw error
  return data as Promotion[]
}

export async function getPromotionById(id: string): Promise<Promotion> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('promotions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Promotion
}

export async function createPromotion(promotion: PromotionInsert): Promise<Promotion> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('promotions')
    .insert(promotion)
    .select()
    .single()

  if (error) throw error
  return data as Promotion
}

export async function updatePromotion(id: string, promotion: PromotionUpdate): Promise<Promotion> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('promotions')
    .update({ ...promotion, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Promotion
}

export async function deletePromotion(id: string): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('promotions')
    .delete()
    .eq('id', id)

  if (error) throw error
}
