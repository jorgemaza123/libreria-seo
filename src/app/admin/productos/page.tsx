"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Search, Pencil, Trash2, Package, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function ProductsPage() {
  // Estado para guardar los productos reales de la DB
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // 1. Cargar productos al entrar a la página
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      if (response.ok) {
        const data = await response.json()
        
        // CORRECCIÓN CLAVE: Extraemos el array dentro de 'products'
        if (data.products && Array.isArray(data.products)) {
           setProducts(data.products)
        } else if (Array.isArray(data)) {
           setProducts(data)
        } else {
           setProducts([])
        }
      } else {
        toast.error("No se pudieron cargar los productos")
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  // 2. Función para eliminar productos reales
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Producto eliminado correctamente')
        // Recargamos la lista para que desaparezca
        fetchProducts() 
      } else {
        const error = await response.json()
        toast.error(error.error || 'Error al eliminar')
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor')
    }
  }

  // 3. Filtrado en el cliente (Buscador)
  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold">Productos</h1>
          <p className="text-muted-foreground">Gestiona el catálogo de tu tienda</p>
        </div>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
          <Link href="/admin/productos/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Tabla y Buscador */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        {/* Barra de búsqueda */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o SKU..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
           <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"/>
             <p>Cargando productos...</p>
           </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Package className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No se encontraron productos</p>
            <p className="text-sm">Agrega uno nuevo para empezar.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-left">
                  <th className="py-4 px-4 font-medium text-muted-foreground">Producto</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground hidden md:table-cell">Categoría</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground">Precio</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground hidden sm:table-cell">Stock</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground hidden sm:table-cell">Estado</th>
                  <th className="py-4 px-4 font-medium text-muted-foreground text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0 relative">
                          {product.image ? (
                             /* eslint-disable-next-line @next/next/no-img-element */
                             <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover"
                             />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <ImageIcon className="w-5 h-5 opacity-30" />
                             </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground truncate max-w-[200px]">{product.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">SKU: {product.sku || '---'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <Badge variant="outline" className="font-normal">
                        {/* Manejo seguro de la categoría si viene como objeto o nula */}
                        {product.category?.name || 'Sin categoría'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium">S/ {Number(product.price).toFixed(2)}</span>
                        {product.sale_price && (
                          <span className="text-xs text-muted-foreground line-through">
                            S/ {Number(product.sale_price).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        (product.stock || 0) < 10 
                          ? 'bg-destructive/10 text-destructive' 
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {product.stock || 0} unid.
                      </span>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <Badge variant={product.is_active ? 'default' : 'secondary'} className={product.is_active ? 'bg-emerald-600 hover:bg-emerald-700' : ''}>
                        {product.is_active ? 'Activo' : 'Borrador'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary" asChild>
                          <Link href={`/admin/productos/${product.id}`}>
                            <Pencil className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}