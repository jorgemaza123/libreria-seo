import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TopBanner } from '@/components/layout/TopBanner';
import { StickyContactBar } from '@/components/layout/StickyContactBar';
import { HeroSection } from '@/components/sections/HeroSection';
import { SchoolPacksSection } from '@/components/sections/SchoolPacksSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ProductsSection } from '@/components/sections/ProductsSection'; // Usaremos esto para el grid de productos
import { ServicesSection } from '@/components/sections/ServicesSection';
// import { PromotionsSection } from '@/components/sections/PromotionsSection'; // Oculto por ahora
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { CatalogsSection } from '@/components/sections/CatalogsSection';
import { ChatBot } from '@/components/chat/ChatBot';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [
      {
        url: seoConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
    locale: seoConfig.locale,
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/*<TopBanner />  */}
      <Navbar />

      <main className="flex flex-col gap-0"> {/* Eliminamos gap default para controlar espaciado en componentes */}
        
        {/* 1. HERO: Nombre y botones directos (WhatsApp/Llamar) */}
        <HeroSection />

        {/* 2. SERVICIOS PRINCIPALES (Compacto): Monografías, Trabajos, etc. */}
        {/* Usamos ServicesSection aquí para dar prioridad a los servicios */}
        <ServicesSection />

        {/* 3. PRODUCTOS DESTACADOS: Grid 2x2 para búsqueda rápida */}
        <ProductsSection />

        {/* 4. CATÁLOGOS: Mensaje llamativo "Descarga nuestros catálogos" */}
        <CatalogsSection />

        {/* 5. PACKS ESCOLARES: Botones que abren Modal (Ahorra espacio) */}
        <SchoolPacksSection />

        {/* 6. CATEGORÍAS: Grid compacto de accesos directos */}
        <CategoriesSection />

        {/* 7. TESTIMONIOS */}
        <TestimonialsSection />

        {/* 8. CONFIANZA: "Años en el barrio" (Antes del footer) */}
        <TrustSection />
      </main>

      <Footer />

      {/* Interactive Elements */}
      <ChatBot />
      <CartDrawer />
      <FloatingCart />
      <StickyContactBar />
    </div>
  );
}