import { NextRequest, NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

// 1. GET (Leer Productos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const featured = searchParams.get('featured') === 'true'
    const categoryId = searchParams.get('categoryId')
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined

    if (!isSupabaseConfigured()) {
      let products = [...mockProducts]
      if (id) return NextResponse.json({ product: products.find(p => p.id === id) })
      return NextResponse.json({ products })
    }

    const supabase = await createClient()

    if (id) {
      // Validamos si es UUID para evitar error 500 en Postgres
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      
      if (!isUUID) {
         // Si piden ID "1" y estamos en DB real, no existe. Devolvemos 404.
         return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      
      if (error) return NextResponse.json({ error: error.message }, { status: 404 })
      return NextResponse.json({ product: data })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = (supabase as any)
      .from('products')
      .select(`*, category:categories(id, name, slug)`)
      .order('created_at', { ascending: false })

    if (featured) query = query.eq('is_featured', true)
    if (categoryId) query = query.eq('category_id', categoryId)
    if (limit) query = query.limit(limit)
    if (offset && limit) query = query.range(offset, offset + limit - 1)

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ products: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. POST (Crear Producto)
export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })

    const supabase = await createClient()
    const body = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('products')
      .insert([{
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        sale_price: body.sale_price,
        sku: body.sku,
        category_id: body.category_id,
        stock: body.stock,
        image: body.image,
        gallery: body.gallery,
        is_active: body.is_active,
        is_featured: body.is_featured
      }])
      .select()
      .single()

    if (error) {
        // Manejo de duplicados
        if (error.code === '23505') {
            return NextResponse.json({ error: 'Ya existe un producto con ese nombre/slug.' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ product: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 3. PUT (Editar Producto)
export async function PUT(request: NextRequest) {
    try {
      if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
  
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

      const supabase = await createClient()
      const body = await request.json()
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any)
        .from('products')
        .update({
          name: body.name,
          slug: body.slug,
          description: body.description,
          price: body.price,
          sale_price: body.sale_price ?? body.salePrice,
          sku: body.sku,
          category_id: body.category_id ?? body.categoryId,
          stock: body.stock,
          image: body.image,
          gallery: body.gallery,
          is_active: body.is_active ?? body.isActive,
          is_featured: body.is_featured ?? body.isFeatured,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
  
      if (error) {
        // Manejo de duplicados (mismo que en POST)
        if (error.code === '23505') {
          return NextResponse.json({ error: 'Ya existe otro producto con ese slug.' }, { status: 409 })
        }
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ product: data })
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// 4. DELETE (Borrar Producto)
export async function DELETE(request: NextRequest) {
    try {
      if (!isSupabaseConfigured()) return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
  
      const { searchParams } = new URL(request.url)
      const id = searchParams.get('id')
      if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  
      const supabase = await createClient()
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', id)
  
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
      return NextResponse.json({ message: 'Producto eliminado' })
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}