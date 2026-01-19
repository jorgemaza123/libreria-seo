import { createClient } from '../server'
import type { Database } from '../types'

type Service = Database['public']['Tables']['services']['Row']
type ServiceInsert = Database['public']['Tables']['services']['Insert']
type ServiceUpdate = Database['public']['Tables']['services']['Update']

export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })

  if (error) throw error
  return data as Service[]
}

export async function getServiceBySlug(slug: string): Promise<Service> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('services')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as Service
}

export async function getServiceById(id: string): Promise<Service> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Service
}

export async function createService(service: ServiceInsert): Promise<Service> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('services')
    .insert(service)
    .select()
    .single()

  if (error) throw error
  return data as Service
}

export async function updateService(id: string, service: ServiceUpdate): Promise<Service> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('services')
    .update({ ...service, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Service
}

export async function deleteService(id: string): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('services')
    .delete()
    .eq('id', id)

  if (error) throw error
}
