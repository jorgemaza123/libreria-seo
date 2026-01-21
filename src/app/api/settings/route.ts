import { NextRequest, NextResponse } from 'next/server'
import type { Json } from '@/lib/supabase/types'

// Disable caching for this API route
export const dynamic = 'force-dynamic'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    console.log('[API/settings] GET - Cargando configuración...')
    if (!isSupabaseConfigured()) {
      console.log('[API/settings] Supabase no configurado, retornando settings vacíos')
      // Return empty settings if Supabase is not configured
      return NextResponse.json({ settings: {} })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) {
      console.error('[API/settings] Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API/settings] Datos recibidos de Supabase:', data?.length || 0, 'settings')

    // Convert array to key-value object
    const settings = (data ?? []).reduce((acc: Record<string, Json>, setting: { key: string; value: Json }) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    console.log('[API/settings] Settings procesados, keys:', Object.keys(settings))
    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[API/settings] POST - Guardando configuración...')
    if (!isSupabaseConfigured()) {
      console.log('[API/settings] Supabase no configurado')
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { key, value } = body as { key: string; value: Json }
    console.log('[API/settings] Guardando key:', key)

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
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

    if (error) {
      console.error('[API/settings] Error guardando:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API/settings] Configuración guardada exitosamente')
    return NextResponse.json({ setting: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
