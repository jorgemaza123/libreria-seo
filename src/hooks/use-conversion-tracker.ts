"use client"

import { useCallback, useEffect, useRef } from 'react'

// ============================================
// CONVERSION TRACKING HOOK
// Tracks user actions for analytics
// Stores in Supabase conversion_events table
// ============================================

export type ConversionEventType =
  | 'hero_cta_click'
  | 'tier_click'
  | 'addon_click'
  | 'whatsapp_redirect'
  | 'scroll_depth_50'
  | 'scroll_depth_90'
  | 'page_view'
  | 'school_list_landing_view'
  | 'service_landing_view'
  | 'product_view'
  | 'cart_add'
  | 'cart_checkout'
  | 'catalog_download'

interface TrackEventOptions {
  metadata?: Record<string, unknown>
}

async function sendEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  try {
    await fetch('/api/conversion-events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: eventType,
        metadata: {
          ...metadata,
          url: typeof window !== 'undefined' ? window.location.pathname : '',
          timestamp: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        },
      }),
    })
  } catch {
    // Silent fail - tracking should never break UX
  }
}

export function useConversionTracker() {
  const scrollTracked = useRef({ depth50: false, depth90: false })

  // Track a conversion event
  const trackEvent = useCallback(
    (eventType: ConversionEventType, options?: TrackEventOptions) => {
      sendEvent(eventType, options?.metadata || {})
    },
    []
  )

  // Track scroll depth automatically
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight <= 0) return

      const scrollPercent = (window.scrollY / scrollHeight) * 100

      if (scrollPercent >= 50 && !scrollTracked.current.depth50) {
        scrollTracked.current.depth50 = true
        sendEvent('scroll_depth_50', { depth: 50 })
      }

      if (scrollPercent >= 90 && !scrollTracked.current.depth90) {
        scrollTracked.current.depth90 = true
        sendEvent('scroll_depth_90', { depth: 90 })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { trackEvent }
}

// Standalone track function for non-hook contexts
export { sendEvent as trackConversionEvent }
