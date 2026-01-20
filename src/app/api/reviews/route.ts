import { NextRequest, NextResponse } from 'next/server'

// Mock data para cuando Supabase no está configurado
const mockReviews = [
  {
    id: '1',
    customer_name: 'María García',
    customer_email: null,
    avatar_url: null,
    rating: 5,
    comment: '¡Excelente atención! Encontré todo lo que necesitaba para el regreso a clases de mis hijos. Los precios muy accesibles y el personal muy amable.',
    product_id: null,
    service_id: null,
    is_featured: true,
    is_verified: true,
    is_active: true,
    source: 'google',
    response: null,
    responded_at: null,
  },
  {
    id: '2',
    customer_name: 'Carlos Rodríguez',
    customer_email: null,
    avatar_url: null,
    rating: 5,
    comment: 'El servicio de impresiones es el mejor de la zona. Rápido, económico y de buena calidad. 100% recomendado.',
    product_id: null,
    service_id: null,
    is_featured: true,
    is_verified: true,
    is_active: true,
    source: 'google',
    response: null,
    responded_at: null,
  },
  {
    id: '3',
    customer_name: 'Ana López',
    customer_email: null,
    avatar_url: null,
    rating: 4,
    comment: 'Buena variedad de productos. Me gusta que tienen artículos de oficina que no encuentro en otros lugares.',
    product_id: null,
    service_id: null,
    is_featured: false,
    is_verified: true,
    is_active: true,
    source: 'website',
    response: null,
    responded_at: null,
  },
  {
    id: '4',
    customer_name: 'Pedro Martínez',
    customer_email: null,
    avatar_url: null,
    rating: 5,
    comment: 'Llevo años comprando aquí. La atención siempre es excelente y los precios muy competitivos.',
    product_id: null,
    service_id: null,
    is_featured: true,
    is_verified: true,
    is_active: true,
    source: 'google',
    response: null,
    responded_at: null,
  },
  {
    id: '5',
    customer_name: 'Laura Sánchez',
    customer_email: null,
    avatar_url: null,
    rating: 5,
    comment: 'Me encanta el servicio de sublimación. Hicieron mis tazas personalizadas y quedaron perfectas. ¡Volveré!',
    product_id: null,
    service_id: null,
    is_featured: false,
    is_verified: true,
    is_active: true,
    source: 'website',
    response: null,
    responded_at: null,
  },
]

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const all = searchParams.get('all') // Para el admin, obtener todas incluso las inactivas

    if (!isSupabaseConfigured()) {
      let reviews = mockReviews
      if (featured === 'true') {
        reviews = reviews.filter(r => r.is_featured)
      }
      return NextResponse.json({ reviews })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    // Si no es para admin, solo mostrar las activas
    if (all !== 'true') {
      query = query.eq('is_active', true)
    }

    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      // Fallback a mock data
      let reviews = mockReviews
      if (featured === 'true') {
        reviews = reviews.filter(r => r.is_featured)
      }
      return NextResponse.json({ reviews })
    }

    return NextResponse.json({ reviews: data })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ reviews: mockReviews })
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
      .from('reviews')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review: data }, { status: 201 })
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
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ review: data })
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
      .from('reviews')
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
