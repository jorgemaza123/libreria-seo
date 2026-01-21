import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// 1. GET (Leer Catálogos)
export async function GET() {
  try {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Mapeo snake_case -> camelCase para el frontend
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catalogs = (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      season: c.season,
      year: c.year,
      fileUrl: c.file_url,
      coverImage: c.cover_image,
      pageCount: c.page_count,
      isNew: c.is_new,
      isActive: c.is_active,
      downloads: c.downloads
    }))

    return NextResponse.json({ catalogs })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 2. POST (Crear Catálogo)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .insert({
        title: body.title,
        description: body.description,
        season: body.season,
        year: body.year,
        file_url: body.fileUrl,
        cover_image: body.coverImage,
        page_count: body.pageCount,
        is_new: body.isNew,
        is_active: body.isActive ?? true,
        downloads: 0
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ catalog: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 3. PUT (Editar Catálogo)
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.season !== undefined) updateData.season = body.season
    if (body.year !== undefined) updateData.year = body.year
    if (body.fileUrl !== undefined) updateData.file_url = body.fileUrl
    if (body.coverImage !== undefined) updateData.cover_image = body.coverImage
    if (body.pageCount !== undefined) updateData.page_count = body.pageCount
    if (body.isNew !== undefined) updateData.is_new = body.isNew
    if (body.isActive !== undefined) updateData.is_active = body.isActive

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('catalogs')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ catalog: data })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// 4. DELETE (Borrar Catálogo)
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('catalogs')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ message: 'Catálogo eliminado' })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}