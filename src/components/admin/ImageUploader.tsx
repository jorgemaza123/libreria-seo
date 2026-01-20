"use client"

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Loader2, Image as ImageIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export type ImageType = 'product' | 'banner' | 'hero' | 'logo' | 'category' | 'general'

interface ImageUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  folder?: string
  imageType?: ImageType
  className?: string
  aspectRatio?: '1:1' | '16:9' | '4:3' | '3:2' | 'auto'
  maxSize?: number // in MB
  disabled?: boolean
}

const aspectRatioClasses = {
  '1:1': 'aspect-square',
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '3:2': 'aspect-[3/2]',
  'auto': 'aspect-auto min-h-[200px]',
}

const imageTypeLabels: Record<ImageType, string> = {
  product: 'Imagen de producto',
  banner: 'Banner',
  hero: 'Imagen Hero',
  logo: 'Logo',
  category: 'Imagen de categoría',
  general: 'Imagen',
}

export function ImageUploader({
  value,
  onChange,
  folder = 'libreria-central',
  imageType = 'general',
  className,
  aspectRatio = '1:1',
  maxSize = 10,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Tipo de archivo no válido. Use JPG, PNG, WebP o GIF.')
      return
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`El archivo es demasiado grande. Máximo ${maxSize}MB.`)
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', `${folder}/${imageType}`)
      formData.append('tags', imageType)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al subir la imagen')
      }

      const data = await response.json()
      onChange(data.secureUrl)
      toast.success('Imagen subida correctamente')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }, [folder, imageType, maxSize, onChange])

  const handleDelete = useCallback(async () => {
    if (!value) return

    // Extract public ID from URL
    const urlParts = value.split('/')
    const uploadIndex = urlParts.indexOf('upload')
    if (uploadIndex === -1) {
      onChange(null)
      return
    }

    // Get everything after 'upload/...' and remove extension
    const publicIdWithVersion = urlParts.slice(uploadIndex + 1).join('/')
    // Remove version if present (v1234567890/)
    const publicId = publicIdWithVersion.replace(/^v\d+\//, '').replace(/\.[^/.]+$/, '')

    try {
      const response = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        console.warn('Could not delete from Cloudinary, removing reference only')
      }

      onChange(null)
      toast.success('Imagen eliminada')
    } catch (error) {
      console.error('Delete error:', error)
      onChange(null)
      toast.success('Referencia eliminada')
    }
  }, [value, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) {
      setIsDragging(true)
    }
  }, [disabled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (disabled) return

    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }, [disabled, handleUpload])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }, [handleUpload])

  const openFilePicker = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click()
    }
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        // Image preview
        <div className={cn(
          'relative rounded-lg overflow-hidden border border-border bg-muted',
          aspectRatioClasses[aspectRatio]
        )}>
          <img
            src={value}
            alt={imageTypeLabels[imageType]}
            className="w-full h-full object-cover"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={openFilePicker}
              disabled={disabled || isUploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              Cambiar
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              disabled={disabled || isUploading}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>
      ) : (
        // Upload zone
        <div
          onClick={openFilePicker}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-all cursor-pointer',
            aspectRatioClasses[aspectRatio],
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed',
            'flex flex-col items-center justify-center gap-2 p-4'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragging ? 'Suelta la imagen aquí' : `Subir ${imageTypeLabels[imageType].toLowerCase()}`}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Arrastra o haz clic para seleccionar
                </p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG, WebP, GIF (máx. {maxSize}MB)
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

// Multi-image uploader for galleries
interface MultiImageUploaderProps {
  value: string[]
  onChange: (urls: string[]) => void
  folder?: string
  imageType?: ImageType
  maxImages?: number
  className?: string
  disabled?: boolean
}

export function MultiImageUploader({
  value = [],
  onChange,
  folder = 'libreria-central',
  imageType = 'product',
  maxImages = 10,
  className,
  disabled = false,
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (files: FileList) => {
    if (value.length + files.length > maxImages) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    setIsUploading(true)
    const newUrls: string[] = []

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', `${folder}/${imageType}`)
        formData.append('tags', imageType)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          newUrls.push(data.secureUrl)
        }
      }

      if (newUrls.length > 0) {
        onChange([...value, ...newUrls])
        toast.success(`${newUrls.length} imagen(es) subida(s)`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Error al subir algunas imágenes')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index)
    onChange(newUrls)
  }

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newUrls = [...value]
    const [removed] = newUrls.splice(fromIndex, 1)
    newUrls.splice(toIndex, 0, removed)
    onChange(newUrls)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
          >
            <img
              src={url}
              alt={`Imagen ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Image number badge */}
            <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center">
              {index + 1}
            </div>

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={disabled}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Reorder buttons */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => handleReorder(index, index - 1)}
                  className="w-6 h-6 rounded bg-black/70 text-white text-xs flex items-center justify-center"
                >
                  ←
                </button>
              )}
              {index < value.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleReorder(index, index + 1)}
                  className="w-6 h-6 rounded bg-black/70 text-white text-xs flex items-center justify-center"
                >
                  →
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add more button */}
        {value.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled || isUploading}
            className={cn(
              'aspect-square rounded-lg border-2 border-dashed border-border',
              'flex flex-col items-center justify-center gap-2',
              'hover:border-primary/50 hover:bg-muted/50 transition-all',
              (disabled || isUploading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Agregar</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={(e) => e.target.files && handleUpload(e.target.files)}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <p className="text-xs text-muted-foreground">
        {value.length} de {maxImages} imágenes. Arrastra para reordenar.
      </p>
    </div>
  )
}
