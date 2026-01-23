"use client"

import { useState, useRef } from 'react'
import { Upload, FileText, X, Loader2, FileCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface PdfUploaderProps {
  value?: string | null
  onChange: (url: string | null) => void
  folder?: string
  className?: string
  disabled?: boolean
}

export function PdfUploader({
  value,
  onChange,
  folder = 'libreria-central/catalogs',
  className,
  disabled = false,
}: PdfUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF.')
      return
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB límite
      toast.error('El archivo es muy grande. Máximo 50MB.')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      // Usamos el mismo endpoint de subida
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Error al subir el PDF')

      const data = await response.json()
      onChange(data.secureUrl) // O data.url dependiendo de tu API
      toast.success('PDF subido correctamente')
    } catch (error) {
      console.error(error)
      toast.error('Error al subir el archivo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setIsDragging(true)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {value ? (
        // Vista previa del PDF cargado
        <div className="relative rounded-lg border border-border bg-muted p-4 flex items-center gap-4">
          <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Documento PDF Cargado</p>
            <a href={value} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline">
              Ver archivo
            </a>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={() => onChange(null)}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        // Zona de carga
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-lg border-2 border-dashed transition-all cursor-pointer h-32',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary/50 hover:bg-muted/50',
            disabled && 'opacity-50 cursor-not-allowed',
            'flex flex-col items-center justify-center gap-2 p-4'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Subiendo PDF...</p>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Subir catálogo PDF</p>
                <p className="text-xs text-muted-foreground mt-1">Máx. 50MB</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}