import { createClient } from '../server'
import type { Database, Json } from '../types'

type SiteSetting = Database['public']['Tables']['site_settings']['Row']

export async function getSiteSettings(): Promise<Record<string, Json>> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('site_settings')
    .select('*')

  if (error) throw error

  // Convert array to object with key-value pairs
  return (data as SiteSetting[]).reduce((acc, setting) => {
    acc[setting.key] = setting.value
    return acc
  }, {} as Record<string, Json>)
}

export async function getSiteSetting(key: string): Promise<Json | null> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .single()

  if (error) throw error
  return data?.value ?? null
}

export async function setSiteSetting(key: string, value: Json): Promise<SiteSetting> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('site_settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'key',
    })
    .select()
    .single()

  if (error) throw error
  return data as SiteSetting
}

export async function deleteSiteSetting(key: string): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('site_settings')
    .delete()
    .eq('key', key)

  if (error) throw error
}

// Specific settings helpers
export async function getContactInfo(): Promise<Json | null> {
  return getSiteSetting('contact_info')
}

export async function getSiteContent(): Promise<Json | null> {
  return getSiteSetting('site_content')
}

export async function getNavigationItems(): Promise<Json | null> {
  return getSiteSetting('navigation')
}
