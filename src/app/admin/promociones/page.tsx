"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Calendar, Percent, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockPromotions } from '@/lib/mock-data'
import { toast } from 'sonner'
import type { Promotion } from '@/lib/types'

export default function PromocionesPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: 0,
    discountType: 'percentage' as 'percentage' | 'fixed',
    startDate: '',
    endDate: '',
  })

  const handleEdit = (promo: Promotion) => {
    setEditingId(promo.id)
    setFormData({
      title: promo.title,
      description: promo.description,
      image: promo.image || '',
      discount: promo.discount || 0,
      discountType: promo.discountType || 'percentage',
      startDate: promo.startDate || '',
      endDate: promo.endDate || '',
    })
  }

  const handleSave = (id: string) => {
    setPromotions(prev => prev.map(p =>
      p.id === id ? { ...p, ...formData } : p
    ))
    setEditingId(null)
    toast.success('Promoción actualizada')
  }

  const handleAdd = () => {
    const newPromo: Promotion = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      image: formData.image,
      discount: formData.discount,
      discountType: formData.discountType,
      startDate: formData.startDate,
      endDate: formData.endDate,
      isActive: true,
    }
    setPromotions(prev => [...prev, newPromo])
    setIsAdding(false)
    setFormData({ title: '', description: '', image: '', discount: 0, discountType: 'percentage', startDate: '', endDate: '' })
    toast.success('Promoción agregada')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta promoción?')) {
      setPromotions(prev => prev.filter(p => p.id !== id))
      toast.success('Promoción eliminada')
    }
  }

  const toggleActive = (id: string) => {
    setPromotions(prev => prev.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Promociones</h2>
          <p className="text-muted-foreground">
            Gestiona las promociones y ofertas especiales
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Promoción
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold">Nueva Promoción</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: ¡Regreso a Clases!"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de Imagen</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
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
            <Button onClick={handleAdd}>
              <Save className="w-4 h-4 mr-2" />
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
                  <Button size="sm" onClick={() => handleSave(promo.id)}>
                    <Save className="w-4 h-4" />
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
                    onClick={() => toggleActive(promo.id)}
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
    </div>
  )
}
