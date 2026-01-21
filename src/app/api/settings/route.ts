import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// GET: Obtener todas las configuraciones
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convertimos el array de filas en un objeto simple: { site_content: {...}, theme: {...} }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const settings = (data || []).reduce((acc: any, item: any) => {
      acc[item.key] = item.value
      return acc
    }, {})

    return NextResponse.json({ settings })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// POST: Guardar una configuración específica
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { key, value } = body

    if (!key || !value) {
      return NextResponse.json({ error: 'Key y Value son requeridos' }, { status: 400 })
    }

    // Usamos UPSERT (Insertar o Actualizar si existe)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ setting: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}