"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Calendar, Percent, Tag, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'
import type { Promotion } from '@/lib/types'

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

  // Cargar promociones desde la API
  const loadPromotions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/promotions')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data.promotions || [])
      }
    } catch (error) {
      console.error('Error loading promotions:', error)
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

  const handleSave = async (id: string) => {
    setIsSaving(true)
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          discount: formData.discount,
          discountType: formData.discountType,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      })

      if (response.ok) {
        toast.success('Promoción actualizada')
        setEditingId(null)
        await loadPromotions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al actualizar')
      }
    } catch (error) {
      console.error('Error saving promotion:', error)
      toast.error('Error al guardar')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdd = async () => {
    if (!formData.title.trim()) {
      toast.error('El título es requerido')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          image: formData.image,
          discount: formData.discount,
          discountType: formData.discountType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: true,
        }),
      })

      if (response.ok) {
        toast.success('Promoción creada')
        setIsAdding(false)
        setFormData({ title: '', description: '', image: '', discount: 0, discountType: 'percentage', startDate: '', endDate: '' })
        await loadPromotions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al crear promoción')
      }
    } catch (error) {
      console.error('Error adding promotion:', error)
      toast.error('Error al crear promoción')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta promoción?')) return

    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Promoción eliminada')
        await loadPromotions()
      } else {
        toast.error('Error al eliminar')
      }
    } catch (error) {
      console.error('Error deleting promotion:', error)
      toast.error('Error al eliminar')
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (response.ok) {
        toast.success(currentStatus ? 'Promoción desactivada' : 'Promoción activada')
        await loadPromotions()
      }
    } catch (error) {
      console.error('Error toggling promotion:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Promociones de Temporada</h2>
          <p className="text-muted-foreground">
            Gestiona las promociones y ofertas especiales que aparecen en la web
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPromotions} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold">Nueva Promoción</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: ¡Regreso a Clases!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Imagen</label>
              <ImageUploader
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url || '' })}
                imageType="banner"
                aspectRatio="16:9"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                placeholder="Descripción de la promoción..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Descuento</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                  className="flex-1 px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="0"
                />
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                  className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="percentage">%</option>
                  <option value="fixed">S/</option>
                </select>
              </div>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Inicio</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha Fin</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Guardar
            </Button>
            <Button variant="outline" onClick={() => {
              setIsAdding(false)
              setFormData({ title: '', description: '', image: '', discount: 0, discountType: 'percentage', startDate: '', endDate: '' })
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Promotions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <div
                key={promo.id}
                className={`bg-card rounded-xl overflow-hidden border border-border ${
                  !promo.isActive ? 'opacity-50' : ''
                }`}
              >
                {/* Image */}
                {promo.image && (
                  <div className="relative h-40 bg-muted">
                    <Image
                      src={promo.image}
                      alt={promo.title}
                      fill
                      className="object-cover"
                    />
                    {promo.discount && promo.discount > 0 && (
                      <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                        {promo.discountType === 'percentage' ? (
                          <>
                            <Percent className="w-4 h-4" />
                            -{promo.discount}%
                          </>
                        ) : (
                          <>
                            <Tag className="w-4 h-4" />
                            -S/{promo.discount}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {editingId === promo.id ? (
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
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={formData.discount}
                        onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                        className="w-20 px-3 py-2 rounded border border-input bg-background text-sm"
                        placeholder="0"
                      />
                      <select
                        value={formData.discountType}
                        onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed' })}
                        className="px-3 py-2 rounded border border-input bg-background text-sm"
                      >
                        <option value="percentage">%</option>
                        <option value="fixed">S/</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleSave(promo.id)} disabled={isSaving}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{promo.description}</p>

                    {(promo.startDate || promo.endDate) && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4" />
                        {promo.startDate && promo.endDate
                          ? `${promo.startDate} - ${promo.endDate}`
                          : promo.startDate || promo.endDate
                        }
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <button
                        onClick={() => toggleActive(promo.id, promo.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          promo.isActive
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {promo.isActive ? 'Activa' : 'Inactiva'}
                      </button>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => handleEdit(promo)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(promo.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {promotions.length === 0 && (
            <div className="text-center py-12 bg-muted/50 rounded-xl">
              <p className="text-muted-foreground">No hay promociones. ¡Crea tu primera promoción!</p>
            </div>
          )}
        </>
      )}

      {/* Info Box */}
      <div className="bg-muted/50 rounded-xl p-6 border border-border">
        <h3 className="font-heading font-bold mb-2">Cómo funcionan las promociones</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>1. Las promociones activas aparecen en la sección "Promociones de Temporada" de la página principal</li>
          <li>2. Puedes agregar un descuento en porcentaje (%) o monto fijo (S/)</li>
          <li>3. Las fechas de inicio y fin son opcionales pero ayudan a mostrar la urgencia</li>
          <li>4. Las promociones inactivas no se muestran en la web pública</li>
          <li>5. Los cambios se reflejan inmediatamente al recargar la página</li>
        </ul>
      </div>
    </div>
  )
}
