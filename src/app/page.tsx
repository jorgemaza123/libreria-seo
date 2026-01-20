import { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TopBanner } from '@/components/layout/TopBanner';
import { StickyContactBar } from '@/components/layout/StickyContactBar';
import { HeroSection } from '@/components/sections/HeroSection';
import { SchoolPacksSection } from '@/components/sections/SchoolPacksSection';
import { TrustSection } from '@/components/sections/TrustSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { PromotionsSection } from '@/components/sections/PromotionsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CategoriesSection } from '@/components/sections/CategoriesSection';
import { CatalogsSection } from '@/components/sections/CatalogsSection';
import { ChatBot } from '@/components/chat/ChatBot';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { FloatingCart } from '@/components/cart/FloatingCart';
import { ExitIntentPopup } from '@/components/ui/ExitIntentPopup';
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
      <TopBanner />
      <Navbar />

      <main>
        <HeroSection />
        <TrustSection />
        <CategoriesSection />
        <SchoolPacksSection />
        <ProductsSection />
        <PromotionsSection />
        <ServicesSection />
        <CatalogsSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Interactive Elements */}
      <ChatBot />
      <CartDrawer />
      <FloatingCart />
      <StickyContactBar />
      <ExitIntentPopup />
    </div>
  );
}