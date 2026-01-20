import { NextRequest, NextResponse } from 'next/server'
import { uploadPdf, deleteFile } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string | null
    const tags = formData.get('tags') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      )
    }

    // Validate file type - only PDFs
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Solo se permiten archivos PDF' },
        { status: 400 }
      )
    }

    // Validate file size (max 50MB for PDFs)
    const maxSize = 50 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 50MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:application/pdf;base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await uploadPdf(base64, {
      folder: folder || 'libreria-central/catalogs',
      tags: tags ? tags.split(',') : ['catalog', 'pdf'],
    })

    return NextResponse.json({
      success: true,
      publicId: result.publicId,
      url: result.url,
      secureUrl: result.secureUrl,
      pages: result.pages,
    })
  } catch (error) {
    console.error('Error uploading PDF:', error)
    return NextResponse.json(
      { error: 'Error al subir el PDF. Verifica la configuración de Cloudinary.' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json(
        { error: 'No se proporcionó el ID del archivo' },
        { status: 400 }
      )
    }

    const success = await deleteFile(publicId, 'raw')

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo eliminar el archivo' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting PDF:', error)
    return NextResponse.json(
      { error: 'Error al eliminar el archivo' },
      { status: 500 }
    )
  }
}
