import type { Metadata } from "next";
import { Nunito, Quicksand } from "next/font/google";
import { Providers } from "@/components/providers/Providers";
import { seoConfig, generateLocalBusinessSchema, generateFAQSchema } from "@/lib/seo";
import { CONTACT, BUSINESS_INFO, BUSINESS_HOURS } from "@/lib/constants";
import { mockFAQs } from "@/lib/mock-data";
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

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.siteUrl),
  title: {
    default: seoConfig.defaultTitle,
    template: `%s | ${seoConfig.siteName}`,
  },
  description: seoConfig.defaultDescription,
  keywords: [
    "librería",
    "útiles escolares",
    "papelería",
    "impresiones",
    "copias",
    "soporte técnico",
    "SJL",
    "San Juan de Lurigancho",
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
    images: [
      {
        url: seoConfig.defaultImage,
        width: 1200,
        height: 630,
        alt: seoConfig.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultTitle,
    description: seoConfig.defaultDescription,
    images: [seoConfig.defaultImage],
    creator: seoConfig.twitterHandle,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <body className={`${quicksand.variable} ${nunito.variable} font-body antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}