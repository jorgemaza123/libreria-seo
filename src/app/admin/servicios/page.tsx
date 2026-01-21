"use client"

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, X, Loader2, Sparkles, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Switch } from '@/components/ui/switch'
import { DynamicIcon } from '@/components/DynamicIcon' // <--- Importamos la magia

interface Service {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  icon: string
  price: string
  isActive: boolean
  order: number
}

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    short_description: '',
    icon: '',
    price: '',
  })

  // Cargar Servicios
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services')
      if (res.ok) {
        const data = await res.json()
        const mappedData = (data.services || []).map((item: any) => ({
            ...item,
            isActive: item.is_active
        }))
        setServices(mappedData)
      }
    } catch (error) {
      toast.error('Error al cargar servicios')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      slug: service.slug,
      description: service.description || '',
      short_description: service.short_description || '',
      icon: service.icon || 'Star', // Valor por defecto si no hay icono
      price: service.price || '',
    })
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: '', slug: '', description: '', short_description: '', icon: '', price: '' })
  }

  const handleSave = async () => {
    if (!formData.name) return toast.error("El nombre es obligatorio")

    setIsSaving(true)
    try {
        const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const payload = {
            ...formData,
            slug,
            isActive: true 
        }

        const url = editingId ? `/api/services?id=${editingId}` : '/api/services'
        const method = editingId ? 'PUT' : 'POST'

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (res.ok) {
            toast.success(editingId ? 'Servicio actualizado' : 'Servicio creado')
            handleCancel()
            fetchServices()
        } else {
            toast.error('Error al guardar')
        }
    } catch (error) {
        toast.error('Error de conexión')
    } finally {
        setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar servicio?')) return
    try {
        await fetch(`/api/services?id=${id}`, { method: 'DELETE' })
        toast.success('Servicio eliminado')
        fetchServices()
    } catch (error) { toast.error('Error al eliminar') }
  }

  const toggleActive = async (service: Service) => {
    const newStatus = !service.isActive
    setServices(prev => prev.map(s => s.id === service.id ? { ...s, isActive: newStatus } : s))
    await fetch(`/api/services?id=${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...service, isActive: newStatus })
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Servicios</h2>
          <p className="text-muted-foreground">Administra tus servicios</p>
        </div>
        {!isAdding && (
            <Button onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4 mr-2" /> Nuevo Servicio
            </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4 shadow-lg">
          <h3 className="font-bold text-lg">{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Nombre del Servicio *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                        placeholder="Ej: Impresiones"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 flex justify-between">
                            Nombre del Icono
                            <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-xs text-primary flex items-center hover:underline">
                                Ver lista <ExternalLink className="w-3 h-3 ml-1"/>
                            </a>
                        </label>
                        <div className="flex gap-2">
                             {/* Previsualización del Icono */}
                            <div className="w-10 h-10 rounded border flex items-center justify-center bg-muted">
                                <DynamicIcon name={formData.icon || 'HelpCircle'} className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                value={formData.icon}
                                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                                placeholder="Ej: Printer"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Escribe el nombre en inglés (Printer, Zap, Home...)</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Precio (Texto)</label>
                        <input
                            type="text"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                            placeholder="Ej: Desde S/0.10"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Descripción Corta</label>
                    <input
                        type="text"
                        value={formData.short_description}
                        onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-input bg-background"
                        placeholder="Resumen para la tarjeta..."
                    />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium mb-2">Descripción Completa</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-input bg-background h-[150px] resize-none"
                    placeholder="Detalles del servicio..."
                />
            </div>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4 mr-2" />}
              Guardar
            </Button>
          </div>
        </div>
      )}

      {/* Grid de Servicios */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
            <div className="col-span-full text-center py-12">Cargando...</div>
        ) : services.map((service) => (
            <div key={service.id} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        {/* Aquí usamos el Icono Dinámico */}
                        <DynamicIcon name={service.icon} className="w-6 h-6" />
                    </div>
                    <Switch checked={service.isActive} onCheckedChange={() => toggleActive(service)} />
                </div>
                
                <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-[40px]">
                    {service.short_description || service.description}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="font-mono text-sm font-medium">{service.price}</span>
                    <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(service)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDelete(service.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  )
}