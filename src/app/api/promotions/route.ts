import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 1. GET (Leer Todas)
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('promotions')
      .select('*')
      // .eq('is_active', true) <--- ELIMINADO: Queremos ver TODAS en el admin
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Mapeamos snake_case (BD) a camelCase (Frontend)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promotions = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      discount: p.discount,
      discountType: p.discount_type, // Mapeo importante
      startDate: p.start_date,       // Mapeo importante
      endDate: p.end_date,           // Mapeo importante
      isActive: p.is_active,
    }))

    return NextResponse.json({ promotions })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. POST (Crear Nueva)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('promotions')
      .insert({
        title: body.title,
        description: body.description,
        image: body.image,
        discount: body.discount,
        discount_type: body.discountType, // camelCase -> snake_case
        start_date: body.startDate || null,
        end_date: body.endDate || null,
        is_active: body.isActive ?? true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ promotion: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}