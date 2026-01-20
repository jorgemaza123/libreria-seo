"use client"

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Upload, FileText, Download, Calendar, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Catalog {
  id: string
  title: string
  description: string
  season: string
  year: string
  fileUrl: string
  coverImage: string
  pageCount: number
  isNew: boolean
  isActive: boolean
  downloads: number
}

const defaultCatalogs: Catalog[] = [
  {
    id: '1',
    title: 'Catálogo Escolar 2025',
    description: 'Lista completa de útiles escolares, mochilas, loncheras y más.',
    season: 'Regreso a Clases',
    year: '2025',
    fileUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop',
    pageCount: 24,
    isNew: true,
    isActive: true,
    downloads: 156,
  },
  {
    id: '2',
    title: 'Catálogo de Servicios',
    description: 'Todos nuestros servicios: impresiones, sublimación, trámites y más.',
    season: 'Todo el año',
    year: '2025',
    fileUrl: '',
    coverImage: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
    pageCount: 12,
    isNew: false,
    isActive: true,
    downloads: 89,
  },
]

const seasonOptions = [
  'Regreso a Clases',
  'Verano',
  'Día de la Madre',
  'Fiestas Patrias',
  'Navidad',
  'Todo el año',
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

// Componente para subir PDF
function PdfUploader({
  value,
  onChange,
  disabled
}: {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Solo se permiten archivos PDF')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      toast.error('El archivo es muy grande. Máximo 50MB.')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'libreria-central/catalogs')

      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir el archivo')
      }

      onChange(data.secureUrl)
      toast.success('PDF subido correctamente')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al subir el PDF')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Archivo PDF</label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground">Subiendo PDF...</p>
          </div>
        ) : value ? (
          <div className="flex flex-col items-center gap-2 py-2">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
            <p className="text-sm text-emerald-600 font-medium">PDF subido</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-primary hover:underline"
            >
              Ver PDF →
            </a>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-2">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra un PDF aquí o <span className="text-primary font-medium">haz clic para seleccionar</span>
            </p>
            <p className="text-xs text-muted-foreground">Máximo 50MB</p>
          </div>
        )}
      </div>

      {/* URL alternativa */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>O pega un enlace:</span>
      </div>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        placeholder="https://drive.google.com/..."
        disabled={disabled || isUploading}
      />
    </div>
  )
}

// Componente para subir imagen de portada
function ImageUploader({
  value,
  onChange,
  disabled
}: {
  value: string
  onChange: (url: string) => void
  disabled?: boolean
}) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      toast.error('Solo se permiten imágenes (JPG, PNG, WebP, GIF)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen es muy grande. Máximo 10MB.')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'libreria-central/catalog-covers')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen')
      }

      onChange(data.secureUrl)
      toast.success('Imagen subida correctamente')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Error al subir la imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleUpload(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleUpload(file)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Imagen de portada</label>

      {/* Preview + Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer transition-all
          ${isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}
          ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isUploading}
        />

        {value ? (
          <div className="relative h-32">
            <Image
              src={value}
              alt="Portada"
              fill
              className="object-cover"
            />
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
            )}
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Subiendo...</p>
              </>
            ) : (
              <>
                <Upload className="w-6 h-6 text-muted-foreground" />
                <p className="text-xs text-muted-foreground text-center px-2">
                  Arrastra una imagen o haz clic
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* URL alternativa */}
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        placeholder="O pega URL de imagen..."
        disabled={disabled || isUploading}
      />
    </div>
  )
}

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>(defaultCatalogs)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    season: 'Regreso a Clases',
    year: new Date().getFullYear().toString(),
    fileUrl: '',
    coverImage: '',
    pageCount: 1,
    isNew: true,
  })

  const handleEdit = (catalog: Catalog) => {
    setEditingId(catalog.id)
    setFormData({
      title: catalog.title,
      description: catalog.description,
      season: catalog.season,
      year: catalog.year,
      fileUrl: catalog.fileUrl,
      coverImage: catalog.coverImage,
      pageCount: catalog.pageCount,
      isNew: catalog.isNew,
    })
  }

  const handleSave = (id: string) => {
    setCatalogs(prev => prev.map(c =>
      c.id === id ? { ...c, ...formData } : c
    ))
    setEditingId(null)
    toast.success('Catálogo actualizado')
  }

  const handleAdd = () => {
    const newCatalog: Catalog = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      season: formData.season,
      year: formData.year,
      fileUrl: formData.fileUrl,
      coverImage: formData.coverImage || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop',
      pageCount: formData.pageCount,
      isNew: formData.isNew,
      isActive: true,
      downloads: 0,
    }
    setCatalogs(prev => [newCatalog, ...prev])
    setIsAdding(false)
    setFormData({
      title: '',
      description: '',
      season: 'Regreso a Clases',
      year: new Date().getFullYear().toString(),
      fileUrl: '',
      coverImage: '',
      pageCount: 1,
      isNew: true,
    })
    toast.success('Catálogo agregado')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este catálogo?')) {
      setCatalogs(prev => prev.filter(c => c.id !== id))
      toast.success('Catálogo eliminado')
    }
  }

  const toggleActive = (id: string) => {
    setCatalogs(prev => prev.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    ))
  }

  const toggleNew = (id: string) => {
    setCatalogs(prev => prev.map(c =>
      c.id === id ? { ...c, isNew: !c.isNew } : c
    ))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      season: 'Regreso a Clases',
      year: new Date().getFullYear().toString(),
      fileUrl: '',
      coverImage: '',
      pageCount: 1,
      isNew: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Catálogos PDF</h2>
          <p className="text-muted-foreground">
            Gestiona los catálogos descargables por temporada
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Catálogo
        </Button>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Nuevo:</strong> Ahora puedes arrastrar y soltar tus PDFs directamente.
          También puedes subir la imagen de portada arrastrándola al área correspondiente.
        </p>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold text-lg">Nuevo Catálogo</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Columna izquierda - Datos */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Ej: Catálogo Escolar 2025"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  rows={3}
                  placeholder="Descripción del catálogo..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Temporada</label>
                  <select
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {seasonOptions.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Año</label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="2025"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nº de páginas</label>
                  <input
                    type="number"
                    value={formData.pageCount}
                    onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                    min="1"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="w-4 h-4 rounded border-input"
                    />
                    <span className="text-sm font-medium">Marcar como NUEVO</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Columna derecha - Archivos */}
            <div className="space-y-4">
              <PdfUploader
                value={formData.fileUrl}
                onChange={(url) => setFormData({ ...formData, fileUrl: url })}
              />

              <ImageUploader
                value={formData.coverImage}
                onChange={(url) => setFormData({ ...formData, coverImage: url })}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <Button onClick={handleAdd} disabled={!formData.title}>
              <Save className="w-4 h-4 mr-2" />
              Guardar Catálogo
            </Button>
            <Button variant="outline" onClick={() => { setIsAdding(false); resetForm() }}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Catalogs Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {catalogs.map((catalog) => (
          <div
            key={catalog.id}
            className={`bg-card rounded-xl overflow-hidden border border-border ${
              !catalog.isActive ? 'opacity-50' : ''
            }`}
          >
            {/* Cover */}
            <div className="relative h-40 bg-muted">
              {catalog.coverImage ? (
                <Image
                  src={catalog.coverImage}
                  alt={catalog.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FileText className="w-16 h-16 text-muted-foreground/30" />
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {catalog.isNew && (
                  <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full">
                    NUEVO
                  </span>
                )}
                <span className="px-2 py-0.5 bg-card/90 text-foreground text-[10px] font-medium rounded-full flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {catalog.season}
                </span>
              </div>
              {/* Downloads count */}
              <div className="absolute bottom-3 right-3">
                <span className="px-2 py-0.5 bg-card/90 text-foreground text-[10px] font-medium rounded-full flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  {catalog.downloads} descargas
                </span>
              </div>
            </div>

            {editingId === catalog.id ? (
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  placeholder="Título"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  rows={2}
                  placeholder="Descripción"
                />
                <PdfUploader
                  value={formData.fileUrl}
                  onChange={(url) => setFormData({ ...formData, fileUrl: url })}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(catalog.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{catalog.title}</h3>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{catalog.description}</p>
                <p className="text-xs text-muted-foreground mb-3">{catalog.pageCount} páginas • {catalog.year}</p>

                {/* File status */}
                <div className={`text-xs px-2 py-1 rounded mb-3 flex items-center gap-1 ${
                  catalog.fileUrl
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-amber-500/10 text-amber-600'
                }`}>
                  {catalog.fileUrl ? (
                    <>
                      <CheckCircle className="w-3 h-3" />
                      <span>PDF subido</span>
                      <a
                        href={catalog.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-auto hover:underline"
                      >
                        Ver →
                      </a>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3" />
                      <span>Sin archivo PDF</span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex gap-1">
                    <button
                      onClick={() => toggleActive(catalog.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        catalog.isActive
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {catalog.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => toggleNew(catalog.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        catalog.isNew
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      Nuevo
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(catalog)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(catalog.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {catalogs.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <FileText className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">No hay catálogos. ¡Crea tu primer catálogo!</p>
        </div>
      )}
    </div>
  )
}
