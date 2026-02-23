import { Metadata } from 'next';
import { HomeClientWrapper } from '@/components/home/HomeClientWrapper';
import { seoConfig } from '@/lib/seo';

export const metadata: Metadata = {
  title: seoConfig.defaultTitle,
  description: seoConfig.defaultDescription,
  // Canonical explícito: evita que /?category=* sea indexado como página separada
  alternates: {
    canonical: seoConfig.siteUrl,
  },
  openGraph: {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    locale: seoConfig.locale,
    type: 'website',
    url: seoConfig.siteUrl,
    // og:image auto-generado por src/app/opengraph-image.tsx
  },
};

// Server component — exports metadata, renders client wrapper
export default function Home() {
  return <HomeClientWrapper />;
}
