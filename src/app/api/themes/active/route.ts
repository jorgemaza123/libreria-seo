import { NextResponse } from 'next/server'

const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ theme: null })
    }

    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()

    // Buscar el tema activo (sin filtro de fechas para simplificar)
    const { data, error } = await supabase
      .from('seasonal_themes')
      .select('*')
      .eq('is_active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching active theme:', error)
      return NextResponse.json({ theme: null })
    }

    return NextResponse.json({ theme: data || null })
  } catch (error) {
    console.error('Error in active theme route:', error)
    return NextResponse.json({ theme: null })
  }
}
