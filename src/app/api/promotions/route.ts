import { NextRequest, NextResponse } from 'next/server'

// Disable caching for this API route
export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { mockPromotions } from '@/lib/mock-data'
import type { Database } from '@/lib/supabase/types'

type PromotionInsert = Database['public']['Tables']['promotions']['Insert']

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    console.log('[API/promotions] GET - Cargando promociones...')
    if (!isSupabaseConfigured()) {
      console.log('[API/promotions] Supabase no configurado, usando mock data')
      return NextResponse.json({ promotions: mockPromotions })
    }

    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching promotions:', error)
      // Fallback to mock data if table doesn't exist
      return NextResponse.json({ promotions: mockPromotions })
    }

    console.log('[API/promotions] Datos recibidos de Supabase:', data?.length || 0, 'promociones')

    // Transform DB data to match frontend format
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const promotions = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image,
      discount: p.discount,
      discountType: p.discount_type,
      startDate: p.start_date,
      endDate: p.end_date,
      isActive: p.is_active,
    }))

    return NextResponse.json({ promotions: promotions.length > 0 ? promotions : mockPromotions })
  } catch (error) {
    console.error('Error in promotions API:', error)
    return NextResponse.json({ promotions: mockPromotions })
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
    const supabase = await createClient()

    const insertData: PromotionInsert = {
      title: body.title,
      description: body.description || '',
      image: body.image || '',
      discount: body.discount,
      discount_type: body.discountType || body.discount_type || 'percentage',
      start_date: body.startDate || body.start_date || new Date().toISOString().split('T')[0],
      end_date: body.endDate || body.end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: body.isActive ?? body.is_active ?? true,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('promotions')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ promotion: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
