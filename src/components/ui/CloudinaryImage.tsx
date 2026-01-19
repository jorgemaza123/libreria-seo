"use client"

import { CldImage } from 'next-cloudinary'
import type { CldImageProps } from 'next-cloudinary'

interface CloudinaryImageProps extends Omit<CldImageProps, 'src'> {
  src: string
  fallbackSrc?: string
}

export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  fallbackSrc,
  className,
  ...props
}: CloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  // If Cloudinary is not configured or src is a full URL, use regular img
  if (!cloudName || src.startsWith('http://') || src.startsWith('https://')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src || fallbackSrc}
        alt={alt}
        width={typeof width === 'number' ? width : undefined}
        height={typeof height === 'number' ? height : undefined}
        className={className}
        loading="lazy"
      />
    )
  }

  return (
    <CldImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto"
      {...props}
    />
  )
}

// Responsive image component with automatic sizing
interface ResponsiveCloudinaryImageProps {
  src: string
  alt: string
  className?: string
  aspectRatio?: '1:1' | '4:3' | '16:9' | '21:9'
  priority?: boolean
  sizes?: string
}

export function ResponsiveCloudinaryImage({
  src,
  alt,
  className,
  aspectRatio = '1:1',
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
}: ResponsiveCloudinaryImageProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  const aspectRatios = {
    '1:1': { width: 400, height: 400 },
    '4:3': { width: 400, height: 300 },
    '16:9': { width: 400, height: 225 },
    '21:9': { width: 400, height: 171 },
  }

  const dimensions = aspectRatios[aspectRatio]

  // If Cloudinary is not configured or src is a full URL, use regular img
  if (!cloudName || src.startsWith('http://') || src.startsWith('https://')) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
      />
    )
  }

  return (
    <CldImage
      src={src}
      alt={alt}
      width={dimensions.width}
      height={dimensions.height}
      className={className}
      crop="fill"
      gravity="auto"
      format="auto"
      quality="auto"
      sizes={sizes}
      priority={priority}
    />
  )
}
