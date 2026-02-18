import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// POST: Track a conversion event
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { event_type, metadata } = body

    if (!event_type) {
      return NextResponse.json({ error: 'event_type is required' }, { status: 400 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('conversion_events')
      .insert({
        event_type,
        metadata: metadata || {},
      })

    if (error) {
      // Table might not exist yet - fail silently in production
      console.error('Conversion tracking error:', error.message)
      return NextResponse.json({ success: false })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false })
  }
}

// GET: Retrieve conversion events (for admin analytics)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const limit = parseInt(searchParams.get('limit') || '1000')

    const since = new Date()
    since.setDate(since.getDate() - days)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('conversion_events')
      .select('*')
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return NextResponse.json({ events: [], error: error.message })
    }

    return NextResponse.json({ events: data || [] })
  } catch {
    return NextResponse.json({ events: [] })
  }
}
