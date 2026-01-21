// Constantes centralizadas del sitio
// Este archivo contiene toda la información de contacto y configuración general

export const CONTACT = {
  whatsapp: '932371532',
  whatsappFormatted: '+51 932 371 532',
  phone: '+51 932 371 532',
  email: 'contacto@libreriahyj.com',
} as const;

export const BUSINESS_INFO = {
  name: 'Librería H & J',
  shortName: 'Librería H & J',
  description: 'Tu librería de confianza en VMT. Útiles escolares, papelería, impresiones, copias, servicios de tecnología y más.',
  address: {
    street: 'Av. D 204, Villa María del Triunfo 15816 ',
    district: 'Villa María del triunfo',
    city: 'Lima',
    state: 'Lima',
    postalCode: '15822',
    country: 'Perú',
    full: 'Av. D 204, Villa María del Triunfo 15816 , Lima, Perú',
  },
  coordinates: {
    lat: -12.202957305021904,
    lng: -76.92599508810437,
  },
  priceRange: '$$',
} as const;

export const BUSINESS_HOURS = {
  weekdays: {
    label: 'Lunes a Viernes',
    hours: '7:00 AM - 7:00 PM',
    opens: '07:00',
    closes: '19:00',
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
  facebook: 'https://facebook.com/libreriahyj',
  instagram: 'https://instagram.com/libreriahyj',
  tiktok: 'https://tiktok.com/@libreriahyj',
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
