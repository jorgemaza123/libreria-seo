"use client"

import { useState, useMemo } from 'react';
import Image from 'next/image'; // IMPORTANTE: Optimización de imágenes
import Link from 'next/link';   // IMPORTANTE: Navegación rápida
import { ShoppingCart, Heart, Eye, Star, Search, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { mockProducts, mockCategories, mockSiteContent } from '@/lib/mock-data';
import type { Product } from '@/lib/types';

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount && product.salePrice // Verificación adicional de tipos
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  return (
    <article className="group bg-card rounded-xl overflow-hidden shadow-sm card-elevated hover:shadow-lg transition-shadow h-full flex flex-col">
      {/* Image Container - Next.js Optimized */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {hasDiscount && (
            <span className="px-2 py-0.5 bg-destructive text-destructive-foreground text-xs font-bold rounded">
              -{discountPercent}%
            </span>
          )}
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-bold rounded">
              Destacado
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button className="w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-md">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-background/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button variant="default" size="sm" className="w-full font-bold" onClick={() => addToCart(product)}>
            <ShoppingCart className="w-4 h-4 mr-1" />
            Cotizar
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-1 flex flex-col flex-grow">
        <span className="text-xs text-primary font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-heading font-semibold text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors flex-grow">
          <Link href={`/producto/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${
                i < 4 ? 'fill-primary text-primary' : 'text-muted-foreground'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">(24)</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 pt-1 mt-auto">
          {hasDiscount ? (
            <>
              <span className="text-lg font-bold text-primary">
                S/{product.salePrice?.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground line-through">
                S/{product.price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-foreground">
              S/{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductsSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllProducts, setShowAllProducts] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = mockProducts.filter((p) => p.isActive);

    // Filter by category
    if (selectedCategory !== 'all') {
      products = products.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return products;
  }, [searchQuery, selectedCategory]);

  // Show first 12 products or all if showAllProducts is true
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 12);

  return (
    <section id="productos" className="py-12 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
            🛒 Catálogo Completo
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
            {mockSiteContent.productsTitle}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {mockSiteContent.productsSubtitle}
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-card rounded-xl p-4 shadow-sm mb-8 border border-border">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-10 pr-10 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all min-w-[200px]"
              >
                <option value="all">Todas las categorías</option>
                {mockCategories.filter(c => c.isActive).map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-3 text-sm text-muted-foreground">
            Mostrando {displayedProducts.length} de {filteredProducts.length} productos
          </div>
        </div>

        {/* Products Grid */}
        {displayedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up h-full"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.5)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Show More / CTA */}
        <div className="text-center mt-10 space-y-4">
          {!showAllProducts && filteredProducts.length > 12 && (
            <Button
              size="lg"
              onClick={() => setShowAllProducts(true)}
              className="min-w-[250px] font-bold"
            >
              Ver Todos los Productos ({filteredProducts.length})
            </Button>
          )}
          
          {showAllProducts && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowAllProducts(false)}
              className="min-w-[250px]"
            >
              Mostrar menos
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}