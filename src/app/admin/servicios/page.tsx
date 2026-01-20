"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Save, X, ArrowUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Service {
  id: string
  name: string
  description: string
  price: string
  icon: string
  color: string
  popular: boolean
  isActive: boolean
}

const defaultServices: Service[] = [
  {
    id: '1',
    name: 'Impresiones y Copias',
    description: 'Impresiones a color, B/N, copias, anillados, escaneos.',
    price: 'Desde S/ 0.10',
    icon: 'Printer',
    color: 'from-blue-500 to-blue-600',
    popular: true,
    isActive: true,
  },
  {
    id: '2',
    name: 'Soporte Técnico',
    description: 'Reparación de laptops, PCs, formateo, mantenimiento.',
    price: 'Desde S/ 30',
    icon: 'Laptop',
    color: 'from-violet-500 to-violet-600',
    popular: false,
    isActive: true,
  },
  {
    id: '3',
    name: 'Sublimación',
    description: 'Polos, tazas, gorras, llaveros personalizados.',
    price: 'Desde S/ 15',
    icon: 'Shirt',
    color: 'from-pink-500 to-pink-600',
    popular: true,
    isActive: true,
  },
  {
    id: '4',
    name: 'Trámites Online',
    description: 'SUNAT, ATU, RENIEC, AFP, brevetes y más.',
    price: 'Desde S/ 15',
    icon: 'FileCheck',
    color: 'from-emerald-500 to-emerald-600',
    popular: false,
    isActive: true,
  },
  {
    id: '5',
    name: 'Diseño Gráfico',
    description: 'Logos, banners, tarjetas, invitaciones.',
    price: 'Desde S/ 20',
    icon: 'Palette',
    color: 'from-amber-500 to-amber-600',
    popular: false,
    isActive: true,
  },
  {
    id: '6',
    name: 'Recargas y Pagos',
    description: 'Recargas celulares, pagos de servicios.',
    price: 'Sin comisión',
    icon: 'Smartphone',
    color: 'from-teal-500 to-teal-600',
    popular: false,
    isActive: true,
  },
]

const iconOptions = ['Printer', 'Laptop', 'Shirt', 'FileCheck', 'Palette', 'Smartphone', 'Package', 'Camera', 'Wrench']
const colorOptions = [
  { name: 'Azul', value: 'from-blue-500 to-blue-600' },
  { name: 'Violeta', value: 'from-violet-500 to-violet-600' },
  { name: 'Rosa', value: 'from-pink-500 to-pink-600' },
  { name: 'Esmeralda', value: 'from-emerald-500 to-emerald-600' },
  { name: 'Ámbar', value: 'from-amber-500 to-amber-600' },
  { name: 'Teal', value: 'from-teal-500 to-teal-600' },
  { name: 'Rojo', value: 'from-red-500 to-red-600' },
  { name: 'Indigo', value: 'from-indigo-500 to-indigo-600' },
]

export default function ServiciosPage() {
  const [services, setServices] = useState<Service[]>(defaultServices)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    icon: 'Package',
    color: 'from-blue-500 to-blue-600',
    popular: false,
  })

  const handleEdit = (service: Service) => {
    setEditingId(service.id)
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      icon: service.icon,
      color: service.color,
      popular: service.popular,
    })
  }

  const handleSave = (id: string) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, ...formData } : s
    ))
    setEditingId(null)
    toast.success('Servicio actualizado')
  }

  const handleAdd = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: formData.price,
      icon: formData.icon,
      color: formData.color,
      popular: formData.popular,
      isActive: true,
    }
    setServices(prev => [...prev, newService])
    setIsAdding(false)
    setFormData({ name: '', description: '', price: '', icon: 'Package', color: 'from-blue-500 to-blue-600', popular: false })
    toast.success('Servicio agregado')
  }

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este servicio?')) {
      setServices(prev => prev.filter(s => s.id !== id))
      toast.success('Servicio eliminado')
    }
  }

  const toggleActive = (id: string) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, isActive: !s.isActive } : s
    ))
  }

  const togglePopular = (id: string) => {
    setServices(prev => prev.map(s =>
      s.id === id ? { ...s, popular: !s.popular } : s
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold">Servicios</h2>
          <p className="text-muted-foreground">
            Gestiona los servicios de la sección &quot;Más que una Librería&quot;
          </p>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </Button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-card rounded-xl p-6 border border-border space-y-4">
          <h3 className="font-bold">Nuevo Servicio</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Impresiones y Copias"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Precio</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Ej: Desde S/ 0.10"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                rows={2}
                placeholder="Descripción del servicio..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icono</label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color</label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="w-4 h-4 rounded border-input"
              />
              <label htmlFor="popular" className="text-sm font-medium">Marcar como Popular</label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" onClick={() => {
              setIsAdding(false)
              setFormData({ name: '', description: '', price: '', icon: 'Package', color: 'from-blue-500 to-blue-600', popular: false })
            }}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className={`bg-card rounded-xl p-6 border border-border ${
              !service.isActive ? 'opacity-50' : ''
            }`}
          >
            {editingId === service.id ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  placeholder="Nombre"
                />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  rows={2}
                  placeholder="Descripción"
                />
                <input
                  type="text"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-input bg-background text-sm"
                  placeholder="Precio"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSave(service.id)}>
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center`}>
                    <span className="text-white text-lg font-bold">
                      {service.icon.charAt(0)}
                    </span>
                  </div>
                  {service.popular && (
                    <span className="bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full text-[10px] font-bold">
                      POPULAR
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                <p className="text-primary font-bold mb-4">{service.price}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleActive(service.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        service.isActive
                          ? 'bg-emerald-500/10 text-emerald-600'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {service.isActive ? 'Activo' : 'Inactivo'}
                    </button>
                    <button
                      onClick={() => togglePopular(service.id)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        service.popular
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      Popular
                    </button>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(service)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(service.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
        <p className="text-sm text-blue-600 dark:text-blue-400">
          <strong>Nota:</strong> Los servicios editados aquí se mostrarán en la sección &quot;Más que una Librería&quot; de la página principal. Al hacer clic en cualquier servicio, el cliente será redirigido a WhatsApp con un mensaje predefinido.
        </p>
      </div>
    </div>
  )
}
