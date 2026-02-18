"use client"

import { CONTACT } from './constants'

// ============================================
// WHATSAPP CONVERSION ENGINE
// Centralized WhatsApp URL generation with
// prefilled structured messages + tracking
// ============================================

export type WhatsAppMessageType =
  | 'school_list'
  | 'school_tier'
  | 'school_addon'
  | 'product_inquiry'
  | 'service_inquiry'
  | 'cart_checkout'
  | 'general'
  | 'quote'
  | 'custom'

export type SchoolTier = 'ECONÓMICO' | 'MEDIO' | 'PREMIUM'

export type SchoolAddon =
  | 'Forrado básico'
  | 'Forrado personalizado (sublimado 10x10)'
  | 'Entrega rápida'
  | 'Maquetas escolares'

export interface WhatsAppPayload {
  tier?: SchoolTier
  addons?: SchoolAddon[]
  delivery?: 'Delivery' | 'Recojo en tienda'
  productName?: string
  serviceName?: string
  cartItems?: Array<{ name: string; quantity: number; price: number }>
  customMessage?: string
  grade?: string
  school?: string
}

// Message templates with structured prefilled content
const MESSAGE_TEMPLATES: Record<WhatsAppMessageType, (payload: WhatsAppPayload) => string> = {
  school_list: (payload) => {
    const parts = [
      `Hola Librería CHROMA, quiero enviar mi lista escolar.`,
    ]
    if (payload.grade) parts.push(`Grado: ${payload.grade}`)
    if (payload.school) parts.push(`Colegio: ${payload.school}`)
    if (payload.tier) parts.push(`Modalidad: ${payload.tier}`)
    if (payload.addons?.length) parts.push(`Extras: ${payload.addons.join(', ')}`)
    if (payload.delivery) parts.push(`Entrega: ${payload.delivery}`)
    parts.push(`\nAdjunto mi lista de útiles.`)
    return parts.join('\n')
  },

  school_tier: (payload) => {
    const parts = [
      `Hola Librería CHROMA, quiero cotizar lista escolar.`,
      `Modalidad: ${payload.tier || 'MEDIO'}`,
    ]
    if (payload.addons?.length) parts.push(`Extras: ${payload.addons.join(', ')}`)
    if (payload.delivery) parts.push(`Entrega: ${payload.delivery}`)
    return parts.join('\n')
  },

  school_addon: (payload) => {
    return [
      `Hola Librería CHROMA, quiero cotizar un servicio adicional.`,
      `Servicio: ${payload.addons?.[0] || 'Forrado'}`,
      `¿Cuál es el precio?`,
    ].join('\n')
  },

  product_inquiry: (payload) => {
    return `Hola Librería CHROMA, me interesa el producto: ${payload.productName}. ¿Está disponible?`
  },

  service_inquiry: (payload) => {
    return `Hola Librería CHROMA, quisiera información sobre el servicio de: ${payload.serviceName}.`
  },

  cart_checkout: (payload) => {
    if (!payload.cartItems?.length) {
      return 'Hola Librería CHROMA, quiero hacer un pedido.'
    }
    const itemsList = payload.cartItems
      .map((item) => `• ${item.name} x${item.quantity} - S/${(item.price * item.quantity).toFixed(2)}`)
      .join('\n')
    const total = payload.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    return [
      `Hola Librería CHROMA, quiero hacer un pedido:`,
      ``,
      itemsList,
      ``,
      `Total: S/${total.toFixed(2)}`,
      ``,
      `¿Está disponible?`,
    ].join('\n')
  },

  general: () => {
    return 'Hola Librería CHROMA, me gustaría obtener más información sobre sus productos y servicios.'
  },

  quote: () => {
    return 'Hola Librería CHROMA, me gustaría solicitar una cotización.'
  },

  custom: (payload) => {
    return payload.customMessage || 'Hola Librería CHROMA'
  },
}

/**
 * Generate a WhatsApp URL with a prefilled structured message
 */
export function generateWhatsAppURL(
  type: WhatsAppMessageType,
  payload: WhatsAppPayload = {},
  phoneNumber?: string
): string {
  const phone = phoneNumber || CONTACT.whatsapp
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '')
  const message = MESSAGE_TEMPLATES[type](payload)
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
}

/**
 * Open WhatsApp with tracking - fires conversion event before redirect
 */
export async function openWhatsApp(
  type: WhatsAppMessageType,
  payload: WhatsAppPayload = {},
  phoneNumber?: string
): Promise<void> {
  // Track the conversion event
  try {
    await trackConversionEvent('whatsapp_redirect', {
      message_type: type,
      ...payload,
    })
  } catch {
    // Don't block redirect if tracking fails
  }

  const url = generateWhatsAppURL(type, payload, phoneNumber)
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Inline tracking to avoid circular dependency
async function trackConversionEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    await fetch('/api/conversion-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: eventType, metadata }),
    })
  } catch {
    // Silent fail - don't block UX for tracking
  }
}
