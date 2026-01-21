"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Calendar, Download, FileText, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
// Importamos tus componentes
import { ImageUploader } from '@/components/admin/ImageUploader'
import { PdfUploader } from '@/components/admin/PdfUploader'

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

const seasonOptions = [
  'Regreso a Clases', 'Verano', 'Día de la Madre', 'Fiestas Patrias',
  'Navidad', 'Todo el año', 'Ofertas Mensuales'
]

export default function CatalogosPage() {
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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

  // 1. Cargar datos reales
  useEffect(() => {
    fetchCatalogs()
  }, [])

  const fetchCatalogs = async () => {
    try {
      const res = await fetch('/api/catalogs')
      if (res.ok) {
        const data = await res.json()
        setCatalogs(data.catalogs || [])
      }
    } catch (error) {
      toast.error('Error al cargar catálogos')
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Preparar edición
  const handleEdit = (catalog: Catalog) => {
    setEditingId(catalog.id)
    setFormData({
      title: catalog.title,
      description: catalog.description || '',
      season: catalog.season || '',
      year: catalog.year || '',
      fileUrl: catalog.fileUrl || '',
      coverImage: catalog.coverImage || '',
      pageCount: catalog.pageCount || 1,
      isNew: catalog.isNew,
    })
    setIsAdding(true)
  }

  const resetForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      title: '', description: '', season: 'Regreso a Clases',
      year: new Date().getFullYear().toString(), fileUrl: '', coverImage: '', pageCount: 1, isNew: true
    })
  }

  // 3. Guardar (Crear o Editar)
  const handleSave = async () => {
    if (!formData.title) return toast.error('El título es obligatorio')
    if (!formData.fileUrl) return toast.error('Debes subir un archivo PDF')

    setIsSaving(true)
    try {
      const url = editingId ? `/api/catalogs?id=${editingId}` : '/api/catalogs'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, isActive: true })
      })

      if (res.ok) {
        toast.success(editingId ? 'Catálogo actualizado' : 'Catálogo creado')
        resetForm()
        fetchCatalogs()
      } else {
        toast.error('Error al guardar')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  // 4. Eliminar
  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este catálogo?')) return
    try {
      await fetch(`/api/catalogs?id=${id}`, { method: 'DELETE' })
      toast.success('Catálogo eliminado')
      fetchCatalogs()
    } catch (error) { toast.error('Error al eliminar') }
  }

  // 5. Activar/Desactivar
  const toggleActive = async (catalog: Catalog) => {
    // Optimista
    const newStatus = !catalog.isActive
    setCatalogs(prev => prev.map(c => c.id === catalog.id ? { ...c, isActive: newStatus } : c))
    
    try {
        await fetch(`/api/catalogs?id=${catalog.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: newStatus })
        })
    } catch (error) {
        toast.error('Error al cambiar estado')
        fetchCatalogs()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Catálogos PDF</h2>
          <p className="text-muted-foreground">Sube tus listas de útiles y catálogos descargables</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchCatalogs} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo Catálogo
                </Button>
            )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-lg">
          <h3 className="font-bold text-lg">{editingId ? 'Editar Catálogo' : 'Nuevo Catálogo'}</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Columna Izquierda: Datos */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  placeholder="Ej: Lista Escolar 2026"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Temporada</label>
                    <select
                        value={formData.season}
                        onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    >
                        {seasonOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Año</label>
                    <input
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background h-[100px] resize-none"
                  placeholder="Describe qué contiene este catálogo..."
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                 <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id="isNew"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({...formData, isNew: e.target.checked})}
                        className="w-4 h-4 rounded border-primary text-primary"
                    />
                    <label htmlFor="isNew" className="text-sm font-medium cursor-pointer">Marcar como Nuevo</label>
                 </div>
                 <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Páginas:</label>
                    <input 
                        type="number"
                        min="1"
                        value={formData.pageCount}
                        onChange={(e) => setFormData({...formData, pageCount: parseInt(e.target.value) || 1})}
                        className="w-16 px-2 py-1 rounded border border-input bg-background text-center"
                    />
                 </div>
              </div>
            </div>

            {/* Columna Derecha: Archivos */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Archivo PDF *</label>
                    <PdfUploader 
                        value={formData.fileUrl} 
                        onChange={(url) => setFormData({ ...formData, fileUrl: url || '' })} 
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-medium mb-2">Imagen de Portada (Opcional)</label>
                    <ImageUploader 
                        value={formData.coverImage} 
                        onChange={(url) => setFormData({ ...formData, coverImage: url || '' })} 
                        imageType="banner"
                        aspectRatio="3:2" 
                    />
                </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t border-border">
            <Button variant="outline" onClick={resetForm}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
              Guardar
            </Button>
          </div>
        </div>
      )}

      {/* Grid de Catálogos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <div className="col-span-full text-center py-12">Cargando catálogos...</div>
        ) : catalogs.length === 0 && !isAdding ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed">
               <FileText className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
               <p>No has subido ningún catálogo todavía.</p>
               <Button variant="link" onClick={() => setIsAdding(true)}>Subir PDF</Button>
            </div>
        ) : (
            catalogs.map((catalog) => (
              <div key={catalog.id} className={`bg-card rounded-xl overflow-hidden border border-border group hover:shadow-md transition-all ${!catalog.isActive ? 'opacity-60' : ''}`}>
                <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                  {catalog.coverImage ? (
                    <Image src={catalog.coverImage} alt={catalog.title} fill className="object-cover transition-transform group-hover:scale-105" />
                  ) : (
                    <div className="text-center p-4">
                        <FileText className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                        <span className="text-xs text-muted-foreground">Sin portada</span>
                    </div>
                  )}
                  
                  {catalog.isNew && (
                    <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded shadow-sm">
                        NUEVO
                    </span>
                  )}
                  
                  <div className="absolute top-3 right-3">
                     <Switch checked={catalog.isActive} onCheckedChange={() => toggleActive(catalog)} className="data-[state=checked]:bg-emerald-500" />
                  </div>
                </div>

                <div className="p-4">
                    <h3 className="font-bold text-lg leading-tight mb-1 truncate" title={catalog.title}>{catalog.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                        <Calendar className="w-3 h-3" /> {catalog.season} {catalog.year}
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-border mt-2">
                        <a 
                            href={catalog.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-primary flex items-center hover:underline"
                        >
                            <Download className="w-3 h-3 mr-1" /> Descargar PDF
                        </a>
                        
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(catalog)}>
                                <Edit className="w-3 h-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive hover:bg-destructive/10" onClick={() => handleDelete(catalog.id)}>
                                <Trash2 className="w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}