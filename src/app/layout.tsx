import type { Metadata } from "next";
import { Nunito, Quicksand, Lexend } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { AnalyticsScripts } from "@/components/analytics/AnalyticsScripts";
import { seoConfig, generateLocalBusinessSchema, generateFAQSchema } from "@/lib/seo";
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS } from "@/lib/constants";
import { mockFAQs } from "@/lib/mock-data";
import { getSiteContent } from "@/lib/supabase/queries/site-settings";
import "./globals.css";

// Configuración de fuentes optimizada
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: [
    "librería Villa María del Triunfo",
    "útiles escolares VMT",
    "papelería Lima",
    "impresiones Villa María del Triunfo",
    "trámites RENIEC SUNAT Lima",
    "sublimación personalizada VMT",
    "soporte técnico PC laptops Lima",
    "desarrollo web Lima Perú",
    "librería Estela Maris",
    "útiles escolares baratos Lima",
    "RENIEC",
    "SUNAT",
    "RUC",
    "Clave Sol",
    "antecedentes policiales",
    "tazas personalizadas",
    "polos personalizados",
    "Villa María del Triunfo",
    "VMT",
    "Lima",
    "Perú",
  ],
  authors: [{ name: seoConfig.siteName }],
  creator: seoConfig.siteName,
  openGraph: {
    type: "website",
    locale: seoConfig.locale,
    url: seoConfig.siteUrl,
    siteName: seoConfig.siteName,
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    // og:image auto-generado por src/app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    creator: seoConfig.twitterHandle,
    // twitter:image auto-generado por src/app/opengraph-image.tsx
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Schema LocalBusiness para Google
const localBusinessSchema = generateLocalBusinessSchema({
  name: BUSINESS_INFO.name,
  description: BUSINESS_INFO.description,
  address: {
    street: BUSINESS_INFO.address.street,
    city: BUSINESS_INFO.address.city,
    state: BUSINESS_INFO.address.state,
    postalCode: BUSINESS_INFO.address.postalCode,
    country: BUSINESS_INFO.address.country,
  },
  phone: CONTACT.phone,
  email: CONTACT.email,
  openingHours: [
    `Monday-Friday ${BUSINESS_HOURS.weekdays.opens}-${BUSINESS_HOURS.weekdays.closes}`,
    `Saturday ${BUSINESS_HOURS.saturday.opens}-${BUSINESS_HOURS.saturday.closes}`,
    `Sunday ${BUSINESS_HOURS.sunday.opens}-${BUSINESS_HOURS.sunday.closes}`,
  ],
  priceRange: BUSINESS_INFO.priceRange,
  image: `${seoConfig.siteUrl}/og-image.jpg`,
  geo: {
    latitude: BUSINESS_INFO.coordinates.lat,
    longitude: BUSINESS_INFO.coordinates.lng,
  },
});

// Schema FAQ para Google
const faqSchema = generateFAQSchema(
  mockFAQs.filter(f => f.isActive).map(f => ({
    question: f.question,
    answer: f.answer,
  }))
);

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch server-side para que el primer render tenga el contenido correcto del CMS
  // evitando el flash de contenido por defecto en el Hero (mejora LCP)
  let initialSiteContent: unknown = null
  try {
    initialSiteContent = await getSiteContent()
  } catch {
    // Si Supabase no está disponible, el provider usa defaultContent como fallback
  }

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body className={`${quicksand.variable} ${nunito.variable} ${lexend.variable} font-display antialiased`}>
        <Providers initialSiteContent={initialSiteContent}>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </Providers>
        <AnalyticsScripts />
      </body>
    </html>
  );
}