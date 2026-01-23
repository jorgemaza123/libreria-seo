import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 1. GET (Leer Categorías)
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('categories')
      .select('*')
      .order('order', { ascending: true })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // MAPEO DE DATOS (Conservamos tu lógica is_active -> isActive)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const categories = (data || []).map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
        image: category.image,
        gallery: category.gallery || [], // <--- NUEVO: Leemos la galería
        isActive: category.is_active,
        order: category.order
    }))

    return NextResponse.json({ categories })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. POST (Crear Categoría)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Lógica original de ordenamiento
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: lastItem } = await (supabase as any)
        .from('categories')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)
        .single()
    
    const newOrder = (lastItem?.order || 0) + 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('categories')
      .insert({
        name: body.name,
        slug: body.slug,
        icon: body.icon,
        description: body.description,
        image: body.image,
        gallery: body.gallery || [], // <--- NUEVO: Guardamos galería
        is_active: body.isActive ?? true,
        order: newOrder
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ category: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 3. PUT (Editar Categoría)
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

        // Construcción dinámica del objeto update (Tu lógica original mejorada)
        const updateData: any = {}
        if (body.name !== undefined) updateData.name = body.name
        if (body.slug !== undefined) updateData.slug = body.slug
        if (body.icon !== undefined) updateData.icon = body.icon
        if (body.description !== undefined) updateData.description = body.description
        if (body.image !== undefined) updateData.image = body.image
        if (body.gallery !== undefined) updateData.gallery = body.gallery // <--- NUEVO
        
        if (body.isActive !== undefined) {
            updateData.is_active = body.isActive
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('categories')
            .update(updateData)
            .eq('id', id)
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        return NextResponse.json({ category: data })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// 4. DELETE (Exactamente igual al original)
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        return NextResponse.json({ message: 'Categoría eliminada' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}