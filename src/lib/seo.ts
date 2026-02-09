// SEO Configuration and Utilities
// Prepared for dynamic meta tags, structured data, and local SEO

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
  siteUrl: "https://libreriachroma.com",
  defaultTitle: "Librería Chroma | Útiles, Trámites, Soporte Técnico y Sistemas en Lima",
  defaultDescription: "Tu centro de servicios en Villa María del Triunfo, Lima. Útiles escolares, papelería, impresiones, trámites virtuales (RENIEC, SUNAT, antecedentes), sublimación personalizada, soporte técnico de PC/laptops, desarrollo de sistemas ERP, páginas web y facturación electrónica. Atención personalizada en VMT.",
  defaultImage: "/og-image.jpg",
  twitterHandle: "@libreriaCHROMA",
  locale: "es_PE", // Ajustado para Perú
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
  openingHoursSpecification: config.openingHours.map((hours) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: hours.split(" ")[0],
    opens: hours.split(" ")[1]?.split("-")[0],
    closes: hours.split(" ")[1]?.split("-")[1],
  })),
  url: seoConfig.siteUrl,
  sameAs: [
    "https://facebook.com/libreriaCHROMA",
    "https://instagram.com/libreriaCHROMA",
  ],
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