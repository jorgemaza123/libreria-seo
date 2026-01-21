import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 1. GET (Leer Todas)
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Mapeo a camelCase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviews = (data || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      role: r.role,
      avatar: r.avatar,
      rating: r.rating,
      comment: r.comment,
      date: r.date,
      service: r.service,
      isActive: r.is_active
    }))

    return NextResponse.json(reviews)
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
      .from('reviews')
      .insert({
        name: body.name,
        role: body.role,
        avatar: body.avatar,
        rating: body.rating,
        comment: body.comment,
        date: body.date,
        service: body.service,
        is_active: true
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}