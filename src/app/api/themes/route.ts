import { NextRequest, NextResponse } from 'next/server'

// Disable caching for this API route
export const dynamic = 'force-dynamic'

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET(request: NextRequest) {
  try {
    console.log('[API/themes] GET - Cargando temas...')
    if (!isSupabaseConfigured()) {
      console.log('[API/themes] Supabase no configurado')
      return NextResponse.json({ themes: [] })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Verificar si hay filtro por slug
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('seasonal_themes')
      .select('*')
      .order('created_at', { ascending: false })

    if (slug) {
      query = query.eq('slug', slug)
    }

    const { data, error } = await query

    if (error) {
      console.error('[API/themes] Error:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log('[API/themes] Temas cargados:', data?.length || 0)
    return NextResponse.json({ themes: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Si el tema se va a activar, desactivar todos los demás primero
    if (body.is_active === true) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('seasonal_themes')
        .update({ is_active: false })
        .eq('is_active', true)
    }

    // Verificar si ya existe un tema con el mismo slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: existing } = await (supabase as any)
      .from('seasonal_themes')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existing) {
      // Actualizar el existente
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('seasonal_themes')
        .update({
          name: body.name,
          primary_color: body.primary_color,
          secondary_color: body.secondary_color,
          accent_color: body.accent_color,
          banner_image: body.banner_image,
          is_active: body.is_active ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ theme: data })
    }

    // Crear nuevo tema
    const now = new Date()
    const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('seasonal_themes')
      .insert({
        name: body.name,
        slug: body.slug,
        primary_color: body.primary_color,
        secondary_color: body.secondary_color,
        accent_color: body.accent_color,
        banner_image: body.banner_image || null,
        is_active: body.is_active ?? false,
        start_date: now.toISOString(),
        end_date: oneYearLater.toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ theme: data }, { status: 201 })
  } catch (error) {
    console.error('Error creating theme:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
