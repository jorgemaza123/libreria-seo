import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createReviewSchema, validateBody } from '@/lib/validations'

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

// 2. POST (Crear Nueva) — público, pero validado y siempre inactivo hasta aprobación admin
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validación con Zod antes de tocar la base de datos
    const validation = validateBody(createReviewSchema, body)
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const { name, role, avatar, rating, comment, date, service } = validation.data

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('reviews')
      .insert({
        name,
        role,
        avatar,
        rating,
        comment,
        date,
        service,
        is_active: false, // Requiere aprobación del admin antes de publicarse
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}