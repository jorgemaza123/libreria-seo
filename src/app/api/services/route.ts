import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 1. GET (Leer Servicios)
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('services')
      .select('*')
      // .eq('is_active', true) <--- ELIMINADO: El admin necesita ver inactivos
      .order('order', { ascending: true })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ services: data || [] })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. POST (Crear Servicio)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Calcular orden automático
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: lastItem } = await (supabase as any)
        .from('services')
        .select('order')
        .order('order', { ascending: false })
        .limit(1)
        .single()
    
    const newOrder = (lastItem?.order || 0) + 1

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('services')
      .insert({
        title: body.title, // Ojo: en BD es 'title', en tu form asegúrate de mandar 'title'
        slug: body.slug,
        description: body.description,
        icon: body.icon,
        price: body.price,
        is_active: body.isActive ?? true,
        order: newOrder
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ service: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 3. PUT (Editar Servicio)
export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase as any)
            .from('services')
            .update({
                title: body.title,
                slug: body.slug,
                description: body.description,
                icon: body.icon,
                price: body.price,
                is_active: body.isActive
            })
            .eq('id', id)
            .select()
            .single()

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        return NextResponse.json({ service: data })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// 4. DELETE (Borrar Servicio)
export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient()
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from('services')
            .delete()
            .eq('id', id)

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })

        return NextResponse.json({ message: 'Servicio eliminado' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}