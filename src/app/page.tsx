import { Metadata } from 'next';
import { HomeClientWrapper } from '@/components/home/HomeClientWrapper';
import { seoConfig } from '@/lib/seo';

/**
 * generateMetadata dinámico: recibe searchParams pero los IGNORA intencionalmente.
 *
 * Por qué es necesario vs export const metadata (estático):
 * - Con metadata estático, Next.js genera el canonical una sola vez en build.
 * - Con generateMetadata, el canonical se evalúa por cada variante de URL.
 * - Resultado: /?category=papeleria, /?category=utiles-escolares, etc.
 *   TODAS reciben <link rel="canonical" href="https://www.libreriachroma.com/">
 *   en lugar de apuntarse a sí mismas.
 * - Esto elimina el contenido duplicado reportado en Google Search Console.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[]>>
}): Promise<Metadata> {
  // Consumimos searchParams para que Next.js sepa que esta función
  // es dinámica (se evalúa por request), pero los ignoramos a propósito.
  void searchParams

  return {
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    alternates: {
      // Canonical siempre apunta a la URL limpia, sin query params
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
  }
}

// Server component — exports metadata, renders client wrapper
export default function Home() {
  return <HomeClientWrapper />;
}
