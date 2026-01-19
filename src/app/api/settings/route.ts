import { NextRequest, NextResponse } from 'next/server'
import type { Json } from '@/lib/supabase/types'

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      // Return empty settings if Supabase is not configured
      return NextResponse.json({ settings: {} })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('site_settings')
      .select('*')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Convert array to key-value object
    const settings = (data ?? []).reduce((acc: Record<string, Json>, setting: { key: string; value: Json }) => {
      acc[setting.key] = setting.value
      return acc
    }, {})

    return NextResponse.json({ settings })
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
    const { key, value } = body as { key: string; value: Json }

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('site_settings')
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'key',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ setting: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
