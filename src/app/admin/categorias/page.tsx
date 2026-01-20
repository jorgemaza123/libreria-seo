"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X, GripVertical, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockCategories } from '@/lib/mock-data'
import { toast } from 'sonner'
import type { Category } from '@/lib/types'

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    description: '',
    image: '',
  })

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon || '',
      description: category.description || '',
      image: category.image || '',
    })
  }

  const handleSave = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id
        ? { ...cat, ...formData }
        : cat
    ))
    setEditingId(null)
    toast.success('Categoría actualizada')
  }

  const handleAdd = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      icon: formData.icon,
      description: formData.description,
      image: formData.image,
      order: categories.length + 1,
      isActive: true,
    }
    setCategories(prev => [...prev, newCategory])
    setIsAdding(false)
    setFormData({ name: '', slug: '', icon: '', description: '', image: '' })
    toast.success('Categoría agregada')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta categoría?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id))
      toast.success('Categoría eliminada')
    }
  }

  const toggleActive = (id: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Categorías</h2>
          <p className="text-muted-foreground">
            Gestiona las categorías de productos y sus imágenes para los modales
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold">Nueva Categoría</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Útiles Escolares"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icono (emoji)</label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: 📚"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                placeholder="Descripción de la categoría..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">URL de Imagen (para el modal)</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" onClick={() => {
              setIsAdding(false)
              setFormData({ name: '', slug: '', icon: '', description: '', image: '' })
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 font-medium text-sm">
          <div className="col-span-1"></div>
          <div className="col-span-1">Icono</div>
          <div className="col-span-3">Nombre</div>
          <div className="col-span-3">Descripción</div>
          <div className="col-span-2">Estado</div>
          <div className="col-span-2">Acciones</div>
        </div>

        {categories.map((category) => (
          <div key={category.id} className="grid grid-cols-12 gap-4 p-4 border-t border-border items-center">
            {editingId === category.id ? (
              <>
                <div className="col-span-1">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="col-span-1">
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-input bg-background text-2xl text-center"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-input bg-background"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-2 py-1 rounded border border-input bg-background"
                  />
                </div>
                <div className="col-span-2"></div>
                <div className="col-span-2 flex gap-2">
                  <Button size="sm" onClick={() => handleSave(category.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="col-span-1">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                </div>
                <div className="col-span-1 text-2xl">{category.icon}</div>
                <div className="col-span-3 font-medium">{category.name}</div>
                <div className="col-span-3 text-sm text-muted-foreground truncate">
                  {category.description || '-'}
                </div>
                <div className="col-span-2">
                  <button
                    onClick={() => toggleActive(category.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      category.isActive
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {category.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <div className="col-span-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Tip:</strong> Agrega imágenes a cada categoría para mostrarlas en los modales de la página principal. Los usuarios verán estas imágenes al hacer clic en los botones de categoría.
        </p>
      </div>
    </div>
  )
}
