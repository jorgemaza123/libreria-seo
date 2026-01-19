"use client"

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockProducts, mockCategories } from '@/lib/mock-data'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.categorySlug === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold">Productos</h2>
          <p className="text-muted-foreground">
            Gestiona el catálogo de productos
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-xl p-4 border border-border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Todas las categorías</option>
            {mockCategories.map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium">Producto</th>
                <th className="text-left p-4 font-medium hidden sm:table-cell">Categoría</th>
                <th className="text-left p-4 font-medium">Precio</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Stock</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Estado</th>
                <th className="text-right p-4 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-muted/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{product.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">
                    <span className="px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      {product.salePrice ? (
                        <>
                          <p className="font-bold text-primary">S/ {product.salePrice.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground line-through">
                            S/ {product.price.toFixed(2)}
                          </p>
                        </>
                      ) : (
                        <p className="font-bold">S/ {product.price.toFixed(2)}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`${product.stock && product.stock > 10 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {product.stock || 'N/A'}
                    </span>
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.isActive
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/productos/${product.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No se encontraron productos
          </div>
        )}
      </div>
    </div>
  )
}
