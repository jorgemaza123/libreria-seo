// Constantes centralizadas del sitio
// Este archivo contiene toda la información de contacto y configuración general

export const CONTACT = {
  whatsapp: '51987654321',
  whatsappFormatted: '+51 987 654 321',
  phone: '+51 987 654 321',
  email: 'contacto@libreriacentral.pe',
} as const;

export const BUSINESS_INFO = {
  name: 'Librería Central',
  shortName: 'Librería Central',
  description: 'Tu librería de confianza en SJL. Útiles escolares, papelería, impresiones, copias, servicios de tecnología y más.',
  address: {
    street: 'Av. Principal #123',
    district: 'San Juan de Lurigancho',
    city: 'Lima',
    state: 'Lima',
    postalCode: '15001',
    country: 'Perú',
    full: 'Av. Principal #123, San Juan de Lurigancho, Lima, Perú',
  },
  coordinates: {
    lat: -11.9679,
    lng: -77.0023,
  },
  priceRange: '$$',
} as const;

export const BUSINESS_HOURS = {
  weekdays: {
    label: 'Lunes a Viernes',
    hours: '8:00 AM - 8:00 PM',
    opens: '08:00',
    closes: '20:00',
  },
  saturday: {
    label: 'Sábados',
    hours: '9:00 AM - 6:00 PM',
    opens: '09:00',
    closes: '18:00',
  },
  sunday: {
    label: 'Domingos',
    hours: '10:00 AM - 2:00 PM',
    opens: '10:00',
    closes: '14:00',
  },
} as const;

export const SOCIAL_MEDIA = {
  facebook: 'https://facebook.com/libreriacentral',
  instagram: 'https://instagram.com/libreriacentral',
  tiktok: 'https://tiktok.com/@libreriacentral',
} as const;

// Helpers para URLs
export const getWhatsAppUrl = (message?: string) => {
  const baseUrl = `https://wa.me/${CONTACT.whatsapp}`;
  if (message) {
    return `${baseUrl}?text=${encodeURIComponent(message)}`;
  }
  return baseUrl;
};

export const getPhoneUrl = () => `tel:${CONTACT.whatsapp}`;

export const getEmailUrl = (subject?: string) => {
  const baseUrl = `mailto:${CONTACT.email}`;
  if (subject) {
    return `${baseUrl}?subject=${encodeURIComponent(subject)}`;
  }
  return baseUrl;
};

export const getGoogleMapsUrl = () => {
  const { lat, lng } = BUSINESS_INFO.coordinates;
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

// Mensajes predeterminados de WhatsApp
export const WHATSAPP_MESSAGES = {
  general: '¡Hola! Me gustaría obtener más información sobre sus productos y servicios.',
  product: (productName: string) => `¡Hola! Me interesa el producto: ${productName}. ¿Está disponible?`,
  cart: (items: string) => `¡Hola! Me gustaría hacer un pedido:\n\n${items}`,
  service: (serviceName: string) => `¡Hola! Quisiera información sobre el servicio de: ${serviceName}`,
  quote: '¡Hola! Me gustaría solicitar una cotización.',
} as const;
