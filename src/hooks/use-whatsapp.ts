"use client"

import { useSiteContent } from '@/contexts/SiteContentContext';
import { CONTACT } from '@/lib/constants';

// Función para limpiar el número de teléfono (quitar espacios, +, etc.)
function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[\s\-\+\(\)]/g, '');
}

// Hook para obtener funciones de WhatsApp con número dinámico
export function useWhatsApp() {
  const { effectiveContent } = useSiteContent();

  // Obtener el número de WhatsApp del contexto o fallback a constantes
  const getWhatsAppNumber = (): string => {
    const contextNumber = effectiveContent?.contact?.whatsapp;
    if (contextNumber && contextNumber.trim()) {
      return cleanPhoneNumber(contextNumber);
    }
    return CONTACT.whatsapp;
  };

  const getWhatsAppUrl = (message?: string): string => {
    const number = getWhatsAppNumber();
    const baseUrl = `https://wa.me/${number}`;
    if (message) {
      return `${baseUrl}?text=${encodeURIComponent(message)}`;
    }
    return baseUrl;
  };

  const getPhoneNumber = (): string => {
    const contextPhone = effectiveContent?.contact?.phone;
    if (contextPhone && contextPhone.trim()) {
      return contextPhone;
    }
    return CONTACT.phone;
  };

  const getPhoneUrl = (): string => {
    const number = getWhatsAppNumber();
    return `tel:+${number}`;
  };

  return {
    getWhatsAppUrl,
    getWhatsAppNumber,
    getPhoneNumber,
    getPhoneUrl,
  };
}
