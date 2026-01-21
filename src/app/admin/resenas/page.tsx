"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X, Star, User, Loader2, RefreshCw } from 'lucide-react'
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

const serviceOptions = [
  'Útiles Escolares', 'Impresiones', 'Sublimación',
  'Trámites Online', 'Soporte Técnico', 'Diseño Gráfico',
  'Recargas y Pagos', 'Otro',
]

export default function ResenasPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    avatar: '',
    rating: 5,
    comment: '',
    date: 'Hace poco',
    service: 'Útiles Escolares',
  })

  // 1. Cargar Reseñas Reales
  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/reviews')
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data || [])
      }
    } catch (error) {
      toast.error('Error al cargar reseñas')
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Preparar Edición
  const handleEdit = (testimonial: Testimonial) => {
    setEditingId(testimonial.id)
    setIsAdding(true)
    setFormData({
      name: testimonial.name,
      role: testimonial.role || '',
      avatar: testimonial.avatar || '',
      rating: testimonial.rating,
      comment: testimonial.comment,
      date: testimonial.date || 'Hace poco',
      service: testimonial.service || 'Otro',
    })
  }

  const resetForm = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({
      name: '', role: '', avatar: '', rating: 5,
      comment: '', date: 'Hace poco', service: 'Útiles Escolares'
    })
  }

  // 3. Guardar (Crear o Editar)
  const handleSave = async () => {
    if (!formData.name || !formData.comment) return toast.error("Nombre y comentario obligatorios")

    setIsSaving(true)
    try {
      const url = editingId ? `/api/reviews/${editingId}` : '/api/reviews'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        toast.success(editingId ? 'Reseña actualizada' : 'Reseña creada')
        resetForm()
        fetchReviews()
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
    if (!confirm('¿Eliminar esta reseña?')) return
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      toast.success('Reseña eliminada')
      fetchReviews()
    } catch (error) { toast.error('Error al eliminar') }
  }

  // 5. Activar/Desactivar
  const toggleActive = async (testimonial: Testimonial) => {
    const newStatus = !testimonial.isActive
    setTestimonials(prev => prev.map(t => t.id === testimonial.id ? { ...t, isActive: newStatus } : t))
    
    try {
        await fetch(`/api/reviews/${testimonial.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: newStatus })
        })
    } catch (error) {
        toast.error('Error al cambiar estado')
        fetchReviews()
    }
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
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'
            }`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Reseñas</h2>
          <p className="text-muted-foreground">Testimonios de clientes en tu web</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={fetchReviews} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            {!isAdding && (
                <Button onClick={() => setIsAdding(true)}>
                <Plus className="w-4 h-4 mr-2" /> Nueva Reseña
                </Button>
            )}
        </div>
      </div>

      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-lg">
          <h3 className="font-bold text-lg">{editingId ? 'Editar Reseña' : 'Nueva Reseña'}</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre Cliente *</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="Ej: Juan Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Rol / Ocupación</label>
              <input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="Ej: Estudiante"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Servicio</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
              >
                {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Calificación</label>
              <div className="pt-2"><RatingStars rating={formData.rating} onChange={(r) => setFormData({...formData, rating: r})} /></div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Comentario *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background h-24 resize-none"
                placeholder="Opinión del cliente..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
                <div>
                    <label className="block text-sm font-medium mb-2">Fecha (Texto)</label>
                    <input
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                        placeholder="Ej: Hace 2 días"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">URL Avatar (Opcional)</label>
                    <input
                        value={formData.avatar}
                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                        placeholder="https://..."
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
            <div className="col-span-full text-center py-12">Cargando reseñas...</div>
        ) : testimonials.length === 0 && !isAdding ? (
            <div className="col-span-full text-center py-12 bg-muted/30 rounded-xl border border-dashed">
               <p className="text-muted-foreground">No hay reseñas registradas.</p>
            </div>
        ) : (
            testimonials.map((t) => (
              <div key={t.id} className={`bg-card rounded-xl p-6 border border-border group hover:shadow-md transition-all ${!t.isActive ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {t.avatar ? (
                      <Image src={t.avatar} alt={t.name} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary"><User className="w-5 h-5"/></div>
                    )}
                    <div>
                      <h4 className="font-bold text-sm">{t.name}</h4>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(t)}><Edit className="w-3 h-3"/></Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => handleDelete(t.id)}><Trash2 className="w-3 h-3"/></Button>
                  </div>
                </div>

                <RatingStars rating={t.rating} />
                <p className="text-sm mt-3 mb-3 italic text-muted-foreground line-clamp-3">"{t.comment}"</p>
                
                <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
                    <span className="text-xs bg-muted px-2 py-1 rounded">{t.service}</span>
                    <button 
                        onClick={() => toggleActive(t)}
                        className={`text-xs px-2 py-1 rounded font-medium ${t.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                        {t.isActive ? 'Visible' : 'Oculto'}
                    </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}