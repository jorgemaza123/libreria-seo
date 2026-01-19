import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured') === 'true'
    const categoryId = searchParams.get('categoryId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    if (!isSupabaseConfigured()) {
      // Return mock data when Supabase is not configured
      let products = [...mockProducts]
      if (featured) {
        products = products.filter(p => p.isFeatured)
      }
      if (categoryId) {
        products = products.filter(p => p.categorySlug === categoryId)
      }
      if (offset && limit) {
        products = products.slice(offset, offset + limit)
      } else if (limit) {
        products = products.slice(0, limit)
      }
      return NextResponse.json({ products })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (featured) {
      query = query.eq('is_featured', true)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (limit) {
      query = query.limit(limit)
    }

    if (offset && limit) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ products: data })
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

    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
