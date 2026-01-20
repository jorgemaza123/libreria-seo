"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ImageUploader, MultiImageUploader } from '@/components/admin/ImageUploader'
import { toast } from 'sonner'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductFormData {
  name: string
  slug: string
  description: string
  price: string
  salePrice: string
  sku: string
  categoryId: string
  stock: string
  image: string
  gallery: string[]
  isActive: boolean
  isFeatured: boolean
}

const initialFormData: ProductFormData = {
  name: '',
  slug: '',
  description: '',
  price: '',
  salePrice: '',
  sku: '',
  categoryId: '',
  stock: '',
  image: '',
  gallery: [],
  isActive: true,
  isFeatured: false,
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProductFormData>(initialFormData)
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories')
        if (response.ok) {
          const data = await response.json()
          setCategories(data.categories || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }
    loadCategories()
  }, [])

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido')
      return
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || generateSlug(formData.name),
          description: formData.description,
          price: parseFloat(formData.price),
          sale_price: formData.salePrice ? parseFloat(formData.salePrice) : null,
          sku: formData.sku,
          category_id: formData.categoryId || null,
          stock: formData.stock ? parseInt(formData.stock) : null,
          image: formData.image,
          is_active: formData.isActive,
          is_featured: formData.isFeatured,
        }),
      })

      if (response.ok) {
        toast.success('Producto creado correctamente')
        router.push('/admin/productos')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al crear el producto')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error('Error al crear el producto')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/productos">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-heading font-bold">Nuevo Producto</h2>
          <p className="text-muted-foreground">
            Agrega un nuevo producto al catálogo
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h3 className="font-heading font-bold">Información Básica</h3>

              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Cuaderno A4 Cuadriculado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="cuaderno-a4-cuadriculado"
                />
                <p className="text-xs text-muted-foreground">
                  Se genera automáticamente del nombre
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe el producto..."
                  rows={4}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h3 className="font-heading font-bold">Precios e Inventario</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio Regular (S/) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="10.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salePrice">Precio de Oferta (S/)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value }))}
                    placeholder="8.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Código</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                    placeholder="CUAD-A4-001"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="100"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h3 className="font-heading font-bold">Imágenes</h3>

              <div className="space-y-2">
                <Label>Imagen Principal</Label>
                <ImageUploader
                  value={formData.image}
                  onChange={(url) => setFormData(prev => ({ ...prev, image: url || '' }))}
                  imageType="product"
                  aspectRatio="1:1"
                />
              </div>

              <div className="space-y-2">
                <Label>Galería de Imágenes</Label>
                <MultiImageUploader
                  value={formData.gallery}
                  onChange={(urls) => setFormData(prev => ({ ...prev, gallery: urls }))}
                  imageType="product"
                  maxImages={6}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h3 className="font-heading font-bold">Organización</h3>

              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Status */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <h3 className="font-heading font-bold">Estado</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isActive">Producto Activo</Label>
                  <p className="text-xs text-muted-foreground">
                    Visible en la tienda
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="isFeatured">Producto Destacado</Label>
                  <p className="text-xs text-muted-foreground">
                    Mostrar en la página principal
                  </p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-4">
              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Guardar Producto
              </Button>

              <Button type="button" variant="outline" className="w-full" asChild>
                <Link href="/admin/productos">
                  Cancelar
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
