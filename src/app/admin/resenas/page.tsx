"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Star, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  rating: number
  comment: string
  date: string
  service: string
  isActive: boolean
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'María García',
    role: 'Dueña de negocio',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Excelente servicio! Me ayudaron con los trámites de mi negocio y la atención fue rapidísima. Los recomiendo al 100%.',
    date: 'Hace 2 días',
    service: 'Trámites Online',
    isActive: true,
  },
  {
    id: '2',
    name: 'Carlos Mendoza',
    role: 'Estudiante universitario',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Los mejores precios en útiles escolares de todo SJL. La sublimación de mi polo quedó increíble, muy buena calidad.',
    date: 'Hace 1 semana',
    service: 'Sublimación',
    isActive: true,
  },
  {
    id: '3',
    name: 'Ana Lucía Pérez',
    role: 'Profesora',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    comment: 'Siempre vengo aquí para mis impresiones y copias. El servicio es rápido y el precio es muy accesible. ¡Muy recomendado!',
    date: 'Hace 3 días',
    service: 'Impresiones',
    isActive: true,
  },
]

const serviceOptions = [
  'Útiles Escolares',
  'Impresiones',
  'Sublimación',
  'Trámites Online',
  'Soporte Técnico',
  'Diseño Gráfico',
  'Recargas y Pagos',
  'Otro',
]

export default function ResenasPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(defaultTestimonials)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    rating: 5,
    comment: '',
    date: 'Hace poco',
    service: 'Útiles Escolares',
  })

  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      avatar: testimonial.avatar,
      rating: testimonial.rating,
      comment: testimonial.comment,
      date: testimonial.date,
      service: testimonial.service,
    })
  }

  const handleSave = (id: string) => {
    setTestimonials(prev => prev.map(t =>
      t.id === id ? { ...t, ...formData } : t
    ))
    setEditingId(null)
    toast.success('Reseña actualizada')
  }

  const handleAdd = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: formData.name,
      role: formData.role,
      avatar: formData.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: formData.rating,
      comment: formData.comment,
      date: formData.date,
      service: formData.service,
      isActive: true,
    }
    setTestimonials(prev => [newTestimonial, ...prev])
    setIsAdding(false)
    setFormData({
      name: '',
      role: '',
      avatar: '',
      rating: 5,
      comment: '',
      date: 'Hace poco',
      service: 'Útiles Escolares',
    })
    toast.success('Reseña agregada')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta reseña?')) {
      setTestimonials(prev => prev.filter(t => t.id !== id))
      toast.success('Reseña eliminada')
    }
  }

  const toggleActive = (id: string) => {
    setTestimonials(prev => prev.map(t =>
      t.id === id ? { ...t, isActive: !t.isActive } : t
    ))
  }

  const RatingStars = ({ rating, onChange }: { rating: number; onChange?: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          disabled={!onChange}
          className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Reseñas y Testimonios</h2>
          <p className="text-muted-foreground">
            Gestiona las reseñas que se muestran en la página principal
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Reseña
        </Button>
      </div>

      {/* Info sobre Google Reviews */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <h4 className="font-bold text-blue-600 dark:text-blue-400 mb-2">
          ¿Cómo funcionan las reseñas de Google?
        </h4>
        <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
          Las reseñas de Google se publican en Google Maps y no se pueden eliminar directamente desde aquí.
          Solo puedes responder a ellas o reportarlas si violan las políticas de Google.
          Esta sección gestiona los <strong>testimonios internos</strong> que se muestran en tu página web,
          los cuales puedes agregar, editar y eliminar libremente.
        </p>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold">Nueva Reseña</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre del cliente</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Profesión/Ocupación</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Estudiante, Contador, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Servicio/Producto</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {serviceOptions.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fecha (texto)</label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Hace 2 días, Hace 1 semana"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Calificación</label>
              <RatingStars rating={formData.rating} onChange={(r) => setFormData({ ...formData, rating: r })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL de foto (opcional)</label>
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="https://..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Comentario</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={3}
                placeholder="El comentario del cliente..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!formData.name || !formData.comment}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" onClick={() => {
              setIsAdding(false)
              setFormData({
                name: '',
                role: '',
                avatar: '',
                rating: 5,
                comment: '',
                date: 'Hace poco',
                service: 'Útiles Escolares',
              })
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`bg-card rounded-xl p-6 border border-border ${
              !testimonial.isActive ? 'opacity-50' : ''
            }`}
          >
            {editingId === testimonial.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  placeholder="Ocupación"
                />
                <textarea
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  rows={3}
                  placeholder="Comentario"
                />
                <RatingStars rating={formData.rating} onChange={(r) => setFormData({ ...formData, rating: r })} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(testimonial.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {testimonial.avatar ? (
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-muted px-2 py-1 rounded-full">
                    {testimonial.service}
                  </span>
                </div>

                {/* Rating */}
                <RatingStars rating={testimonial.rating} />

                {/* Comment */}
                <p className="text-sm mt-3 mb-4 line-clamp-3">
                  &ldquo;{testimonial.comment}&rdquo;
                </p>

                {/* Date */}
                <p className="text-xs text-muted-foreground mb-4">{testimonial.date}</p>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <button
                    onClick={() => toggleActive(testimonial.id)}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      testimonial.isActive
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {testimonial.isActive ? 'Visible' : 'Oculto'}
                  </button>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(testimonial)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(testimonial.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {testimonials.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <p className="text-muted-foreground">No hay reseñas. ¡Agrega tu primera reseña!</p>
        </div>
      )}
    </div>
  )
}
