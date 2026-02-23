// SEO Configuration and Utilities
// Prepared for dynamic meta tags, structured data, and local SEO
import { SOCIAL_MEDIA } from '@/lib/constants'

export interface SEOConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultImage: string;
  twitterHandle?: string;
  locale: string;
}

export const seoConfig: SEOConfig = {
  siteName: "Librería CHROMA",
  siteUrl: "https://www.libreriachroma.com",
  defaultTitle: "Librería Chroma | Útiles Escolares, Trámites y Soporte Técnico en VMT",
  defaultDescription: "Tu librería de confianza en Villa María del Triunfo. Útiles escolares, impresiones, trámites RENIEC/SUNAT, sublimación personalizada y soporte técnico. ¡Frente al Colegio Estela Maris, atendemos por WhatsApp!",
  defaultImage: "/opengraph-image",
  twitterHandle: "@libreriaCHROMA",
  locale: "es_PE",
};

// LocalBusiness Schema for Google
export const generateLocalBusinessSchema = (config: {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  phone: string;
  email: string;
  openingHours: string[];
  priceRange: string;
  image: string;
  geo: { latitude: number; longitude: number };
}) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": seoConfig.siteUrl,
  name: config.name,
  description: config.description,
  image: config.image,
  telephone: config.phone,
  email: config.email,
  priceRange: config.priceRange,
  address: {
    "@type": "PostalAddress",
    streetAddress: config.address.street,
    addressLocality: config.address.city,
    addressRegion: config.address.state,
    postalCode: config.address.postalCode,
    addressCountry: config.address.country,
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: config.geo.latitude,
    longitude: config.geo.longitude,
  },
  openingHoursSpecification: config.openingHours.map((hours) => {
    const [dayPart, timePart] = hours.split(" ")
    const [opens, closes] = timePart.split("-")
    const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    let dayOfWeek: string[]
    if (dayPart.includes("-")) {
      const [startDay, endDay] = dayPart.split("-")
      const startIdx = ALL_DAYS.indexOf(startDay)
      const endIdx = ALL_DAYS.indexOf(endDay)
      dayOfWeek = ALL_DAYS.slice(startIdx, endIdx + 1)
    } else {
      dayOfWeek = [dayPart]
    }
    return { "@type": "OpeningHoursSpecification", dayOfWeek, opens, closes }
  }),
  url: seoConfig.siteUrl,
  sameAs: [
    SOCIAL_MEDIA.facebook,
    SOCIAL_MEDIA.instagram,
    SOCIAL_MEDIA.tiktok,
  ].filter(Boolean),
});

// Product Schema for individual products
export const generateProductSchema = (product: {
  name: string;
  description: string;
  image: string;
  price: number;
  salePrice?: number;
  sku: string;
  category: string;
  inStock: boolean;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  sku: product.sku,
  category: product.category,
  offers: {
    "@type": "Offer",
    price: product.salePrice || product.price,
    priceCurrency: "PEN", // Ajustado a Soles
    availability: product.inStock
      ? "https://schema.org/InStock"
      : "https://schema.org/OutOfStock",
    seller: {
      "@type": "Organization",
      name: seoConfig.siteName,
    },
  },
});

// FAQ Schema for chatbot/FAQ section
export const generateFAQSchema = (faqs: { question: string; answer: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});

// Breadcrumb Schema
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});