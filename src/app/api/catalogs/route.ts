import { NextRequest, NextResponse } from 'next/server'

// Mock data para cuando Supabase no está configurado
const mockCatalogs = [
  {
    id: '1',
    title: 'Catálogo Escolar 2025',
    description: 'Lista completa de útiles escolares, mochilas, loncheras y más.',
    season: 'Regreso a Clases',
    year: '2025',
    file_url: null,
    cover_image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    page_count: 24,
    is_new: true,
    is_active: true,
    downloads: 156,
  },
  {
    id: '2',
    title: 'Catálogo de Servicios',
    description: 'Todos nuestros servicios: impresiones, sublimación, trámites y más.',
    season: 'Todo el año',
    year: '2025',
    file_url: null,
    cover_image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    page_count: 12,
    is_new: false,
    is_active: true,
    downloads: 89,
  },
  {
    id: '3',
    title: 'Ofertas de Temporada',
    description: 'Promociones especiales y descuentos del mes.',
    season: 'Enero 2025',
    year: '2025',
    file_url: null,
    cover_image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop',
    page_count: 8,
    is_new: false,
    is_active: true,
    downloads: 45,
  },
]

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ catalogs: mockCatalogs })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      // Fallback a mock data si hay error
      return NextResponse.json({ catalogs: mockCatalogs })
    }

    return NextResponse.json({ catalogs: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ catalogs: mockCatalogs })
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ catalog: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body as { id: string; [key: string]: unknown }

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ catalog: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('catalogs')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
