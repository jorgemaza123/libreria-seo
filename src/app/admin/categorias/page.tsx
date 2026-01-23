"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, GripVertical, Loader2 } from 'lucide-react'
import { IconPicker } from '@/components/admin/IconPicker'
import * as LucideIcons from 'lucide-react' 
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
// IMPORTANTE: Asegúrate de importar MultiImageUploader aquí
import { ImageUploader, MultiImageUploader } from '@/components/admin/ImageUploader'
import type { Category } from '@/lib/types'

// Helper para renderizar iconos
const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon = (LucideIcons as any)[name]
  if (!Icon) return <LucideIcons.HelpCircle className={className} />
  return <Icon className={className} />
}

// Extendemos la interfaz localmente por si tu archivo types.ts no tiene gallery aún
interface ExtendedCategory extends Category {
  gallery?: string[];
}

interface CategoryFormData {
  name: string
  slug: string
  icon: string
  description: string
  image: string
  gallery: string[] // <--- NUEVO CAMPO
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    icon: 'Backpack',
    description: '',
    image: '',
    gallery: [], // <--- Inicializamos vacío
  })

  // 1. Cargar Categorías
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error(error)
      toast.error('Error al cargar categorías')
    } finally {
      setIsLoading(false)
    }
  }

  // Preparar formulario para Editar
  const handleEdit = (category: ExtendedCategory) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || 'HelpCircle',
      description: category.description || '',
      image: category.image || '',
      gallery: category.gallery || [], // <--- Cargamos la galería existente
    })
    setIsAdding(false)
  }

  // Guardar Cambios (Editar)
  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
        const res = await fetch(`/api/categories?id=${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })

        if (res.ok) {
            toast.success('Categoría actualizada')
            setEditingId(null)
            fetchCategories()
        } else {
            toast.error('Error al actualizar')
        }
    } catch (error) {
        toast.error('Error de conexión')
    } finally {
        setIsSaving(false)
    }
  }

  // Crear Nueva Categoría
  const handleAdd = async () => {
    if (!formData.name) return toast.error("El nombre es obligatorio")
    
    setIsSaving(true)
    try {
        const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
        
        const res = await fetch('/api/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, slug, isActive: true })
        })

        if (res.ok) {
            toast.success('Categoría creada')
            setIsAdding(false)
            setFormData({ name: '', slug: '', icon: 'Backpack', description: '', image: '', gallery: [] })
            fetchCategories()
        } else {
            toast.error('Error al crear')
        }
    } catch (error) {
        toast.error('Error de conexión')
    } finally {
        setIsSaving(false)
    }
  }

  // Eliminar (Igual al original)
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro? Esto podría afectar a los productos de esta categoría.')) return
    try {
        const res = await fetch(`/api/categories?id=${id}`, { method: 'DELETE' })
        if (res.ok) {
            toast.success('Categoría eliminada')
            fetchCategories()
        } else {
            toast.error('Error al eliminar')
        }
    } catch (error) {
        toast.error('Error de conexión')
    }
  }

  // Activar / Desactivar (Igual al original)
  const toggleActive = async (category: Category) => {
    const newStatus = !category.isActive
    setCategories(prev => prev.map(c => c.id === category.id ? { ...c, isActive: newStatus } : c))

    try {
        await fetch(`/api/categories?id=${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: newStatus }) 
        })
    } catch (error) {
        toast.error('Error al cambiar estado')
        fetchCategories()
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Categorías</h2>
          <p className="text-muted-foreground">
            Gestiona las categorías de productos y sus iconos
          </p>
        </div>
        <Button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ name: '', slug: '', icon: 'Backpack', description: '', image: '', gallery: [] }) }} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Formulario de Creación */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-lg">
          <h3 className="font-bold text-lg">Nueva Categoría</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Nombre *</label>
                    <input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                        placeholder="Ej: Útiles Escolares"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Icono</label>
                    <IconPicker 
                        value={formData.icon} 
                        onChange={(val) => setFormData({...formData, icon: val})} 
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                        rows={3}
                    />
                </div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Imagen del Modal</label>
                    <ImageUploader 
                        value={formData.image}
                        onChange={(url) => setFormData({ ...formData, image: url || '' })}
                        imageType="category"
                        aspectRatio="3:2"
                    />
                </div>
                <div>
                    {/* NUEVO: Soporte para Galería */}
                    <label className="block text-sm font-medium mb-2">Galería de Imágenes</label>
                    <MultiImageUploader
                        value={formData.gallery}
                        onChange={(urls) => setFormData({ ...formData, gallery: urls })}
                        imageType="category"
                        maxImages={10}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Sube varias fotos para mostrar en el modal.</p>
                </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              <X className="w-4 h-4 mr-2" /> Cancelar
            </Button>
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2"/> : <Save className="w-4 h-4 mr-2" />}
              Guardar Categoría
            </Button>
          </div>
        </div>
      )}

      {/* Lista de Categorías */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
          <div className="col-span-1 text-center">Ord.</div>
          <div className="col-span-1 text-center">Icono</div>
          <div className="col-span-3">Nombre</div>
          <div className="col-span-3">Descripción</div>
          <div className="col-span-2 text-center">Estado</div>
          <div className="col-span-2 text-right">Acciones</div>
        </div>

        {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Cargando categorías...</div>
        ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay categorías registradas.</div>
        ) : (
            categories.map((category) => (
            <div key={category.id} className="grid grid-cols-12 gap-4 p-4 border-t border-border items-center hover:bg-muted/20 transition-colors">
                {editingId === category.id ? (
                // --- MODO EDICIÓN (Mejorado para Galería) ---
                <>
                    <div className="col-span-1 text-center"><GripVertical className="w-5 h-5 mx-auto text-muted-foreground" /></div>
                    <div className="col-span-1 flex justify-center">
                        <div className="w-10">
                            <IconPicker value={formData.icon} onChange={(val) => setFormData({...formData, icon: val})} />
                        </div>
                    </div>
                    <div className="col-span-3 space-y-2">
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-input"
                        />
                        <div className="text-xs text-muted-foreground">Editando {formData.name}...</div>
                    </div>
                    <div className="col-span-3">
                        <input
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-2 py-1 rounded border border-input"
                        />
                    </div>
                    
                    {/* Panel Expandido para editar imágenes cómodamente */}
                    <div className="col-span-4 col-start-2 mt-4 bg-muted/50 p-4 rounded-lg border border-border">
                        <h4 className="text-sm font-bold mb-3">Imágenes de la Categoría</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium mb-1">Imagen Principal</label>
                                <ImageUploader 
                                    value={formData.image} 
                                    onChange={(url) => setFormData({...formData, image: url || ''})} 
                                    imageType="category"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1">Galería</label>
                                <MultiImageUploader 
                                    value={formData.gallery} 
                                    onChange={(urls) => setFormData({...formData, gallery: urls})} 
                                    imageType="category"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-4 pt-2 border-t border-border/50">
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4 mr-2" /> Cancelar</Button>
                            <Button size="sm" onClick={() => handleSave(category.id)} disabled={isSaving}><Save className="w-4 h-4 mr-2" /> Guardar Cambios</Button>
                        </div>
                    </div>
                </>
                ) : (
                // --- MODO LECTURA ---
                <>
                    <div className="col-span-1 text-center text-xs text-muted-foreground">{category.order || '-'}</div>
                    <div className="col-span-1 text-center flex justify-center">
                        <DynamicIcon name={category.icon || 'HelpCircle'} className="w-5 h-5 text-primary" />
                    </div>
                    <div className="col-span-3 flex items-center gap-2">
                        {category.image && <img src={category.image} className="w-8 h-8 rounded object-cover border border-border" alt="" />}
                        <span className="font-medium">{category.name}</span>
                        {/* Indicador de cuántas fotos hay en galería */}
                        {category.gallery && category.gallery.length > 0 && (
                            <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded ml-1 font-bold">
                                +{category.gallery.length}
                            </span>
                        )}
                    </div>
                    <div className="col-span-3 text-sm text-muted-foreground truncate">
                        {category.description || '-'}
                    </div>
                    <div className="col-span-2 text-center">
                        <button
                            onClick={() => toggleActive(category)}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            category.isActive
                                ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                        >
                            {category.isActive ? 'Activo' : 'Inactivo'}
                        </button>
                    </div>
                    <div className="col-span-2 flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(category)}>
                            <Edit className="w-4 h-4 text-muted-foreground" />
                        </Button>
                        <Button size="sm" variant="ghost" className="hover:bg-destructive/10" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                    </div>
                </>
                )}
            </div>
            ))
        )}
      </div>
    </div>
  )
}