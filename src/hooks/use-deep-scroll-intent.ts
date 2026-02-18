"use client"

import { useEffect, useRef } from 'react'
import { trackDeepScrollIntent } from '@/lib/analytics'

// ============================================
// useDeepScrollIntent
//
// Fires DeepScrollIntent ONCE when the user scrolls
// past `threshold` (default 80%) on the current page.
//
// Used in HomeClientWrapper to wire `campaign.primaryEvent`
// to real tracking — bridging the config to the pixel.
//
// Resets when campaignMode changes (page-level campaign swap).
// ============================================

interface DeepScrollOptions {
  /** Scroll fraction to trigger (0–1). Default: 0.8 (80%). */
  threshold?: number
  /** Campaign mode active when the intent was detected. */
  campaignMode?: string
  /** The primary conversion event associated with this mode. */
  primaryEvent?: string
}

export function useDeepScrollIntent({
  threshold = 0.8,
  campaignMode = 'services',
  primaryEvent,
}: DeepScrollOptions = {}) {
  const fired = useRef(false)

  // Reset if the campaign changes mid-session (CMS preview mode)
  useEffect(() => {
    fired.current = false
  }, [campaignMode])

  useEffect(() => {
    const handleScroll = () => {
      if (fired.current) return

      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable <= 0) return

      const pct = window.scrollY / scrollable
      if (pct >= threshold) {
        fired.current = true
        trackDeepScrollIntent({
          campaign_mode: campaignMode,
          primary_event: primaryEvent ?? 'unknown',
          scroll_depth: Math.round(pct * 100),
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold, campaignMode, primaryEvent])
}
