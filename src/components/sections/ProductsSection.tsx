"use client"

import { useState, useMemo, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye, Star, Search, Filter, ChevronDown, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';
import { useSearch } from '@/contexts/SearchContext';
import { useSiteContent } from '@/contexts/SiteContentContext';
import type { Product } from '@/lib/types';

// Placeholder para productos sin imagen
const PLACEHOLDER_IMAGE = '/placeholder-product.svg';

// Helper para localStorage de favoritos
const FAVORITES_KEY = 'libreria-favorites';
function getFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  // Verificar si hay imagen válida
  const hasValidImage = product.image && product.image.trim() !== '' && !imageError;

  // Cargar estado de favoritos desde localStorage
  useEffect(() => {
    const favorites = getFavorites();
    setIsFavorite(favorites.includes(product.id));
  }, [product.id]);

  // Toggle favorito
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const favorites = getFavorites();

    if (isFavorite) {
      const updated = favorites.filter(id => id !== product.id);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setIsFavorite(false);
      toast.success('Eliminado de favoritos');
    } else {
      const updated = [...favorites, product.id];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      setIsFavorite(true);
      toast.success('Agregado a favoritos', {
        description: product.name,
      });
    }
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface-dark/90 shadow-sm transition-shadow card-elevated glass-card hover:shadow-lg">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-surface-dark border-b border-white/5">
        {hasValidImage ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          /* Placeholder cuando no hay imagen */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <Package className="w-16 h-16 text-muted-foreground/30" />
            <span className="text-xs text-muted-foreground/50 mt-2">Sin imagen</span>
          </div>
        )}

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

        {/* Quick Actions - Alto contraste para cualquier fondo */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
          {/* Botón Favoritos */}
          <button
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            className={`w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-900/80 text-white hover:bg-slate-900'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Botón Ver Producto */}
          <Link
            href={`/producto/${product.slug}`}
            aria-label="Ver producto"
            className="w-10 h-10 bg-background-dark/90 backdrop-blur-md border border-white/10 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-background-dark transition-all duration-200"
          >
            <Eye className="w-5 h-5" />
          </Link>
        </div>

      </div>

      {/* Content */}
      <div className="flex flex-grow flex-col space-y-2 bg-background/20 p-4 backdrop-blur-sm">
        <span className="text-[11px] text-primary/80 font-bold uppercase tracking-widest">
          {product.category}
        </span>
        <h3 className="font-display font-semibold text-base text-slate-100 line-clamp-2 group-hover:text-primary transition-colors flex-grow leading-tight">
          <Link href={`/producto/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${
                i < 4 ? 'fill-primary text-primary' : 'text-slate-600'
              }`}
            />
          ))}
          <span className="text-[12px] text-slate-400 font-medium ml-1.5">(24)</span>
        </div>

        <div className="mt-auto border-t border-white/5 pt-3">
          <div className="mb-3 flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-xl font-bold text-white">
                  S/{product.salePrice?.toFixed(2)}
                </span>
                <span className="text-sm text-slate-500 line-through font-medium">
                  S/{product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-white">
                S/{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              className="h-11 flex-1 rounded-xl bg-primary font-bold text-background-dark shadow-lg shadow-primary/20 hover:bg-primary/90"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="mr-2 w-5 h-5" />
              Cotizar
            </Button>
            <Button
              variant="outline"
              asChild
              className="h-11 rounded-xl px-4"
            >
              <Link href={`/producto/${product.slug}`}>
                <Eye className="w-4 h-4" />
                <span className="sr-only">Ver producto</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function ProductsSection() {
  const { searchQuery, setSearchQuery, clearSearch } = useSearch();
  const { products, categories } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Función para extraer categoría de la URL
  const getCategoryFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const url = new URL(window.location.href);
    return url.searchParams.get('category');
  }, []);

  // Efecto para leer categoría de la URL al cargar y cuando cambia
  useEffect(() => {
    const handleUrlChange = () => {
      const categoryFromUrl = getCategoryFromUrl();
      if (categoryFromUrl) {
        setSelectedCategory(categoryFromUrl);
        setShowAllProducts(true); // Mostrar todos los productos de esa categoría

        // Scroll suave a la sección de productos
        setTimeout(() => {
          const productsSection = document.getElementById('productos');
          if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    // Ejecutar al montar
    handleUrlChange();

    // Escuchar cambios en el hash/URL (para navegación desde modales)
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [getCategoryFromUrl]);

  // Productos destacados - mostrar todos
  const featuredProducts = useMemo(() => {
    return products.filter((p) => p.isActive && p.isFeatured);
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => p.isActive);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.categorySlug === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, products]);

  // Show first 12 products or all if showAllProducts is true
  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 12);

  return (
    <section id="productos" className="py-16 md:py-24 bg-background-dark relative">
      <div className="absolute inset-0 bg-primary/5 pattern-dots pointer-events-none opacity-50 mix-blend-overlay"></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Productos Destacados - Una sola línea */}
        {featuredProducts.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-10 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-bold tracking-widest uppercase">
                Los Más Vendidos
              </span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold">
                Productos <span className="text-primary">Destacados</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Nuestros productos más populares y recomendados
              </p>
            </div>

            {/* Grid responsive para productos destacados */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Catálogo Completo */}
        <div className="text-center mb-10 space-y-4">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-full text-sm font-bold tracking-widest uppercase">
            Catálogo Completo
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-extrabold text-white">
            Todos Nuestros <span className="text-primary text-gradient">Productos</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light">
            Descubre nuestra selección de productos de alta calidad para el regreso a clases
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card rounded-2xl p-5 shadow-2xl mb-10 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col md:flex-row gap-4 relative z-10">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar utiles, papeleria o material"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-base"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-12 pr-12 py-4 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-w-[240px] text-base cursor-pointer"
              >
                <option value="all">Todas las categorías</option>
                {categories.filter(c => c.isActive).map((category) => (
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

        {/* Products Grid - Centrado en última fila */}
        {displayedProducts.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6">
            {displayedProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-up w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] xl:w-[calc(20%-19px)]"
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
                clearSearch();
                setSelectedCategory('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}

        {/* Show More / CTA */}
        <div className="text-center mt-8 space-y-4">
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
