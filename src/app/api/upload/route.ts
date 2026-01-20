import { NextRequest, NextResponse } from 'next/server'
import { uploadImage, deleteImage } from '@/lib/cloudinary'

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

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de archivo no válido. Use JPG, PNG, WebP o GIF.' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB.' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload to Cloudinary
    const result = await uploadImage(base64, {
      folder: folder || 'libreria-central',
      tags: tags ? tags.split(',') : undefined,
    })

    return NextResponse.json({
      success: true,
      publicId: result.publicId,
      url: result.url,
      secureUrl: result.secureUrl,
    })
  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
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
        { error: 'No se proporcionó el ID de la imagen' },
        { status: 400 }
      )
    }

    const success = await deleteImage(publicId)

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo eliminar la imagen' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la imagen' },
      { status: 500 }
    )
  }
}
