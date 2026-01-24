import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Check } from 'lucide-react';
import { ProductActions } from './ProductActions';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chat/ChatBot';
import { mockProducts } from '@/lib/mock-data';
import { seoConfig, generateProductSchema } from '@/lib/seo';
import { AddToCartButton } from './add-to-cart-button';
import { createClient } from '@/lib/supabase/server';

// Forzar renderizado dinámico para cargar productos de Supabase
export const dynamic = 'force-dynamic';

// Helper para obtener producto desde Supabase con tolerancia a fallos
async function getProduct(slug: string) {
  try {
    const supabase = await createClient();

    // Consulta tolerante a duplicados: usa limit(1).maybeSingle()
    // Esto evita errores si hay múltiples productos con el mismo slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('slug', slug)
      .limit(1)
      .maybeSingle();

    // Si hay error de conexión o consulta, loguear y continuar al fallback
    if (error) {
      console.error('Supabase query error:', error.message);
      return mockProducts.find((p) => p.slug === slug) || null;
    }

    // Si no se encontró el producto en Supabase, intentar fallback
    if (!data) {
      return mockProducts.find((p) => p.slug === slug) || null;
    }

    // Normalizar campos de snake_case a camelCase para compatibilidad con UI
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      price: Number(data.price) || 0,
      salePrice: data.sale_price ? Number(data.sale_price) : undefined,
      sku: data.sku || '',
      category: data.category?.name || 'Sin categoría',
      categorySlug: data.category?.slug || '',
      stock: data.stock ?? 0,
      image: data.image || '',
      gallery: data.gallery || [],
      isActive: data.is_active ?? true,
      isFeatured: data.is_featured ?? false,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch (error) {
    // Capturar cualquier excepción inesperada y usar fallback
    console.error('Error fetching product from Supabase:', error);
    return mockProducts.find((p) => p.slug === slug) || null;
  }
}

// Helper para obtener todos los slugs de productos (para generateStaticParams)
async function getAllProductSlugs() {
  try {
    const supabase = await createClient();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('products')
      .select('slug')
      .eq('is_active', true);

    if (error || !data) {
      return mockProducts.map((p) => p.slug);
    }

    return data.map((p: { slug: string }) => p.slug);
  } catch {
    return mockProducts.map((p) => p.slug);
  }
}

// 1. Generar rutas estáticas para productos (SSG híbrido)
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

// 2. Generar Metadata SEO dinámica
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.name} | ${seoConfig.siteName}`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.image ? [product.image] : [],
      url: `${seoConfig.siteUrl}/producto/${product.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount && product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const images = [product.image, ...(product.gallery || [])].filter(Boolean);

  // Schema.org para Google
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    salePrice: product.salePrice,
    sku: product.sku,
    category: product.category,
    inStock: (product.stock ?? 0) > 0,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                    Inicio
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li>
                  <Link
                    href={`/#productos?category=${product.categorySlug}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {product.category}
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li className="text-foreground font-medium">{product.name}</li>
              </ol>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-square rounded-2xl overflow-hidden bg-muted relative">
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      Sin imagen
                    </div>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <div
                        key={index}
                        className="w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent hover:border-primary relative flex-shrink-0 cursor-pointer"
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - Imagen ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {hasDiscount && (
                    <span className="px-3 py-1 bg-destructive text-destructive-foreground text-sm font-bold rounded-full">
                      -{discountPercent}% OFF
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full">
                      Destacado
                    </span>
                  )}
                </div>

                {/* Title & Category */}
                <div>
                  <span className="text-sm text-primary font-medium uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-heading font-bold mt-2">
                    {product.name}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < 4
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">(24 reseñas)</span>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-primary">
                      S/ {(product.salePrice || product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl text-muted-foreground line-through">
                        S/ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && product.salePrice && (
                    <p className="text-sm text-destructive font-medium">
                      ¡Ahorras S/ {(product.price - product.salePrice).toFixed(2)}!
                    </p>
                  )}
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>

                {/* Stock */}
                {product.stock !== undefined && (
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm">
                      {product.stock > 0
                        ? `${product.stock} unidades disponibles`
                        : 'Agotado'}
                    </span>
                  </div>
                )}

                {/* SKU */}
                <p className="text-sm text-muted-foreground">
                  SKU: {product.sku}
                </p>

                {/* Add to Cart Section (Client Component) */}
                <AddToCartButton product={product} />

                {/* Actions - Favoritos y Compartir (Client Component) */}
                <ProductActions
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                />
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <ChatBot />
      </div>
    </>
  );
}
