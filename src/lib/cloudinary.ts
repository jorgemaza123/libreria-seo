import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary (for server-side use)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

// Image transformation presets
export const imagePresets = {
  thumbnail: {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  card: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  product: {
    width: 600,
    height: 600,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  banner: {
    width: 1200,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  hero: {
    width: 1920,
    height: 1080,
    crop: 'fill',
    quality: 'auto',
    format: 'auto',
  },
  og: {
    width: 1200,
    height: 630,
    crop: 'fill',
    quality: 'auto',
    format: 'jpg',
  },
} as const

export type ImagePreset = keyof typeof imagePresets

// Helper to generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  preset: ImagePreset | { width: number; height: number }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    console.warn('Cloudinary cloud name not configured')
    return publicId
  }

  const transformation = typeof preset === 'string' ? imagePresets[preset] : preset

  const transformationString = [
    `w_${transformation.width}`,
    `h_${transformation.height}`,
    'c_fill',
    'q_auto',
    'f_auto',
  ].join(',')

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`
}

// Upload image to Cloudinary (server-side only)
export async function uploadImage(
  file: Buffer | string,
  options?: {
    folder?: string
    publicId?: string
    tags?: string[]
  }
): Promise<{ publicId: string; url: string; secureUrl: string }> {
  const result = await cloudinary.uploader.upload(
    typeof file === 'string' ? file : `data:image/png;base64,${file.toString('base64')}`,
    {
      folder: options?.folder || 'libreria-central',
      public_id: options?.publicId,
      tags: options?.tags,
      resource_type: 'image',
    }
  )

  return {
    publicId: result.public_id,
    url: result.url,
    secureUrl: result.secure_url,
  }
}

// Delete image from Cloudinary (server-side only)
export async function deleteImage(publicId: string): Promise<boolean> {
  const result = await cloudinary.uploader.destroy(publicId)
  return result.result === 'ok'
}

// Get image info
export async function getImageInfo(publicId: string) {
  return cloudinary.api.resource(publicId)
}
