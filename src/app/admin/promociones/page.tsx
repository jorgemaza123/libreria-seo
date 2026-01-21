"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Calendar, Percent, Tag, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'

// Definimos la interfaz localmente para evitar conflictos
interface Promotion {
  id: string
  title: string
  description: string
  image: string
  discount: number
  discountType: 'percentage' | 'fixed'
  startDate: string
  endDate: string
  isActive: boolean
}

export default function PromocionesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
  })

  // Cargar promociones
  const loadPromotions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/promotions')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data.promotions || [])
      }
    } catch (error) {
      toast.error('Error al cargar promociones')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPromotions()
  }, [])

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id)
    setIsAdding(true) // Reutilizamos el formulario
    setFormData({
      title: promo.title || '',
      description: promo.description || '',
      image: promo.image || '',
      discount: promo.discount || 0,
      discountType: promo.discountType || 'percentage',
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
    })
  }

  const resetForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ title: '', description: '', image: '', discount: 0, discountType: 'percentage', startDate: '', endDate: '' })
  }

  const handleSave = async () => {
    if (!formData.title.trim()) return toast.error('El título es requerido')

    setIsSaving(true)
    try {
      const url = editingId ? `/api/promotions/${editingId}` : '/api/promotions'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingId ? 'Promoción actualizada' : 'Promoción creada')
        resetForm()
        await loadPromotions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al guardar')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return
    try {
      const response = await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success('Promoción eliminada')
        await loadPromotions()
      } else {
        toast.error('Error al eliminar')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    // Optimista
    const newStatus = !currentStatus
    setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p))

    try {
      await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: newStatus }),
      })
    } catch (error) {
      toast.error('Error al cambiar estado')
      loadPromotions() // Revertir
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Promociones</h2>
          <p className="text-muted-foreground">
            Gestiona las ofertas especiales
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={loadPromotions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          {!isAdding && (
             <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" /> Nueva
             </Button>
          )}
        </div>
      </div>

      {/* Formulario */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-lg">
          <h3 className="font-bold text-lg">{editingId ? 'Editar Promoción' : 'Nueva Promoción'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  placeholder="Ej: ¡Regreso a Clases!"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Descuento</label>
                    <input
                      type="number"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                      className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                    >
                      <option value="percentage">Porcentaje (%)</option>
                      <option value="fixed">Monto Fijo (S/)</option>
                    </select>
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Inicio</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Fin</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Imagen Banner</label>
                    <ImageUploader
                        value={formData.image}
                        // Corrección para evitar error de null
                        onChange={(url) => setFormData({ ...formData, image: url || '' })} 
                        imageType="banner"
                        aspectRatio="16:9"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Descripción</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background h-[80px] resize-none"
                        placeholder="Detalles de la oferta..."
                    />
                </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4 border-t border-border">
             <Button variant="outline" onClick={resetForm}>Cancelar</Button>
             <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2"/>}
                Guardar
             </Button>
          </div>
        </div>
      )}

      {/* Grid de Promociones */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <div className="col-span-full text-center py-12">Cargando promociones...</div>
        ) : promotions.length === 0 && !isAdding ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed">
               <Tag className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
               <p>No hay promociones activas.</p>
               <Button variant="link" onClick={() => setIsAdding(true)}>Crear una ahora</Button>
            </div>
        ) : (
            promotions.map((promo) => (
              <div key={promo.id} className={`bg-card rounded-xl overflow-hidden border border-border group hover:shadow-md transition-all ${!promo.isActive ? 'opacity-75 bg-muted/20' : ''}`}>
                <div className="relative h-40 bg-muted">
                  {promo.image ? (
                    <Image src={promo.image} alt={promo.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-secondary">
                        <Tag className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  
                  {/* Badge de Descuento */}
                  {promo.discount > 0 && (
                    <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 shadow-sm">
                      {promo.discountType === 'percentage' ? (
                        <><Percent className="w-3 h-3" /> {promo.discount}%</>
                      ) : (
                        <><Tag className="w-3 h-3" /> S/{promo.discount}</>
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg leading-tight">{promo.title}</h3>
                        <Switch checked={promo.isActive} onCheckedChange={() => toggleActive(promo.id, promo.isActive)} />
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
                        {promo.description || 'Sin descripción'}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 bg-muted/50 p-2 rounded">
                        <Calendar className="w-3 h-3" />
                        {promo.startDate && promo.endDate 
                            ? `${promo.startDate} al ${promo.endDate}` 
                            : 'Fecha indefinida'}
                    </div>

                    <div className="flex gap-2 justify-end border-t border-border pt-3">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(promo)}>
                            <Edit className="w-4 h-4 mr-1" /> Editar
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(promo.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}