import { createClient } from '../server'
import type { Database } from '../types'

type SeasonalTheme = Database['public']['Tables']['seasonal_themes']['Row']
type SeasonalThemeInsert = Database['public']['Tables']['seasonal_themes']['Insert']
type SeasonalThemeUpdate = Database['public']['Tables']['seasonal_themes']['Update']

export async function getSeasonalThemes(): Promise<SeasonalTheme[]> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .select('*')
    .order('start_date', { ascending: true })

  if (error) throw error
  return data as SeasonalTheme[]
}

export async function getActiveTheme(): Promise<SeasonalTheme | null> {
  const supabase = await createClient()
  const now = new Date().toISOString()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .select('*')
    .eq('is_active', true)
    .lte('start_date', now)
    .gte('end_date', now)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows found
  return data as SeasonalTheme | null
}

export async function getThemeById(id: string): Promise<SeasonalTheme> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as SeasonalTheme
}

export async function getThemeBySlug(slug: string): Promise<SeasonalTheme> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) throw error
  return data as SeasonalTheme
}

export async function createTheme(theme: SeasonalThemeInsert): Promise<SeasonalTheme> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .insert(theme)
    .select()
    .single()

  if (error) throw error
  return data as SeasonalTheme
}

export async function updateTheme(id: string, theme: SeasonalThemeUpdate): Promise<SeasonalTheme> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .update({ ...theme, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as SeasonalTheme
}

export async function deleteTheme(id: string): Promise<void> {
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('seasonal_themes')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function activateTheme(id: string): Promise<SeasonalTheme> {
  const supabase = await createClient()

  // First, deactivate all themes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any)
    .from('seasonal_themes')
    .update({ is_active: false })
    .neq('id', id)

  // Then activate the selected theme
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from('seasonal_themes')
    .update({ is_active: true, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as SeasonalTheme
}
