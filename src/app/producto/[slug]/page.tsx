import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Check, ChevronRight, Package, Truck, Shield } from 'lucide-react';
import { ProductActions } from './ProductActions';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ChatBot } from '@/components/chat/ChatBot';
import { mockProducts } from '@/lib/mock-data';
import { seoConfig, generateProductSchema } from '@/lib/seo';
import { AddToCartButton } from './add-to-cart-button';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

async function getProduct(slug: string) {
  try {
    const supabase = await createClient();

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

    if (error) {
      console.error('Supabase query error:', error.message);
      return mockProducts.find((p) => p.slug === slug) || null;
    }

    if (!data) {
      return mockProducts.find((p) => p.slug === slug) || null;
    }

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
    console.error('Error fetching product from Supabase:', error);
    return mockProducts.find((p) => p.slug === slug) || null;
  }
}

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

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug: string) => ({ slug }));
}

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

        <main className="pt-20 pb-40 md:pb-16">
          <div className="container mx-auto px-4 max-w-7xl">

            <nav className="mb-6 md:mb-8" aria-label="Breadcrumb">
              <ol className="flex items-center gap-1.5 md:gap-2 text-sm md:text-base flex-wrap">
                <li>
                  <Link
                    href="/"
                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-0.5"
                  >
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                </li>
                <li>
                  <Link
                    href={`/?category=${product.categorySlug}#productos`}
                    className="text-muted-foreground hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-1 py-0.5"
                  >
                    {product.category}
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight className="w-4 h-4 text-muted-foreground/60" />
                </li>
                <li>
                  <span className="text-foreground font-medium px-1 py-0.5" aria-current="page">
                    {product.name}
                  </span>
                </li>
              </ol>
            </nav>

            <div className="grid md:grid-cols-2 gap-6 md:gap-10 lg:gap-16">

              <section className="space-y-4" aria-label="Galería de imágenes del producto">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted shadow-lg">
                  {hasDiscount && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-4 py-2 bg-destructive text-destructive-foreground text-base md:text-lg font-bold rounded-full shadow-lg">
                        -{discountPercent}% OFF
                      </span>
                    </div>
                  )}
                  {product.isFeatured && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-full shadow-lg">
                        Destacado
                      </span>
                    </div>
                  )}
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={`${product.name} - Imagen principal del producto`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <Package className="w-24 h-24 opacity-30" />
                    </div>
                  )}
                </div>

                {images.length > 1 && (
                  <div
                    className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin"
                    role="list"
                    aria-label="Miniaturas de imágenes adicionales"
                  >
                    {images.map((img, index) => (
                      <button
                        key={index}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border-2 border-muted hover:border-primary focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative flex-shrink-0 transition-all duration-200"
                        aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                      >
                        <Image
                          src={img}
                          alt={`${product.name} - Vista ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="space-y-5 md:space-y-6" aria-label="Información del producto">

                <header>
                  <span className="inline-block text-sm md:text-base text-primary font-semibold uppercase tracking-wide mb-2">
                    {product.category}
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold leading-tight">
                    {product.name}
                  </h1>
                </header>

                <div className="flex items-center gap-3 flex-wrap">
                  <div
                    className="flex items-center gap-0.5"
                    role="img"
                    aria-label="Calificación: 4 de 5 estrellas"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 md:w-6 md:h-6 ${
                          i < 4
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-muted-foreground/40'
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-base md:text-lg">(24 reseñas)</span>
                </div>

                <div className="bg-muted/50 rounded-2xl p-4 md:p-6 space-y-2">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary">
                      S/ {(product.salePrice || product.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <span className="text-xl md:text-2xl text-muted-foreground line-through">
                        S/ {product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {hasDiscount && product.salePrice && (
                    <p className="text-base md:text-lg text-green-600 dark:text-green-400 font-semibold">
                      ¡Ahorras S/ {(product.price - product.salePrice).toFixed(2)}!
                    </p>
                  )}
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground/80 text-lg md:text-xl leading-relaxed">
                    {product.description}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 py-2">
                  {product.stock !== undefined && (
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-base md:text-lg font-medium">
                        {product.stock > 0
                          ? `${product.stock} disponibles`
                          : 'Agotado'}
                      </span>
                    </div>
                  )}
                  <p className="text-base text-muted-foreground">
                    SKU: <span className="font-mono">{product.sku}</span>
                  </p>
                </div>

                <div className="hidden md:block">
                  <AddToCartButton product={product} />
                </div>

                <ProductActions
                  productId={product.id}
                  productName={product.name}
                  productSlug={product.slug}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Truck className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Envío rápido</p>
                      <p className="text-xs text-muted-foreground">24-48 horas</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Shield className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Garantía</p>
                      <p className="text-xs text-muted-foreground">30 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                    <Check className="w-6 h-6 text-primary flex-shrink-0" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-sm">Calidad</p>
                      <p className="text-xs text-muted-foreground">Certificada</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          <div className="md:hidden fixed bottom-[72px] left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border p-3 shadow-2xl z-40">
            <AddToCartButton product={product} isSticky />
          </div>
        </main>

        <Footer />
        <ChatBot />
      </div>
    </>
  );
}
