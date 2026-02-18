"use client"

import { useCallback, useEffect, useRef } from 'react'
import { trackCTAInteraction } from '@/lib/analytics'

// ============================================
// useConversionCTA
//
// Añade dos señales de hesitación a cualquier CTA:
//
//   hover_intent (desktop)
//     → usuario mantuvo el cursor 2 s sobre el botón
//     → indica consideración sin decisión final
//
//   touch_intent (mobile)
//     → primer contacto táctil, antes del click
//     → detecta cuando WhatsApp podría haberse bloqueado
//
// Uso:
//   const ctaProps = useConversionCTA({ campaignMode: 'school', source: 'hero_primary' })
//   <button onClick={handleClick} {...ctaProps}>...</button>
//
// Meta filtra: CTAInteraction SIN LeadEvent = hesitadores.
// Esos son el retargeting más valioso.
// ============================================

interface ConversionCTAOptions {
  campaignMode: string
  source: string
  /** Delay en ms para hover intent. Default: 2000 (2 s). */
  hoverDelay?: number
}

export function useConversionCTA({
  campaignMode,
  source,
  hoverDelay = 2_000,
}: ConversionCTAOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cancel pending timer on unmount — prevents ghost events on fast navigation
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    timerRef.current = setTimeout(() => {
      trackCTAInteraction({
        interaction_type: 'hover_intent',
        campaign_mode:    campaignMode,
        source,
      })
    }, hoverDelay)
  }, [campaignMode, source, hoverDelay])

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleTouchStart = useCallback(() => {
    trackCTAInteraction({
      interaction_type: 'touch_intent',
      campaign_mode:    campaignMode,
      source,
    })
  }, [campaignMode, source])

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
  }
}
