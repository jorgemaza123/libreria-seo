// ============================================
// ANALYTICS — GTM + Meta Pixel
// ============================================

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
    fbq: (...args: unknown[]) => void
    gtag: (...args: unknown[]) => void
  }
}

// ── Plataformas ──────────────────────────────

export const GTM_ID        = process.env.NEXT_PUBLIC_GTM_ID        || ''
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ''

export function pushToDataLayer(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !GTM_ID) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...data })
}

export function trackMetaEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !META_PIXEL_ID || !window.fbq) return
  window.fbq('track', eventName, params)
}

export function trackMetaCustomEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !META_PIXEL_ID || !window.fbq) return
  window.fbq('trackCustom', eventName, params)
}

export function trackAnalyticsEvent(eventName: string, params: Record<string, unknown> = {}) {
  pushToDataLayer(eventName, params)
  trackMetaEvent(eventName, params)
}

// ============================================
// CONTEXT HELPERS
// ============================================

/**
 * time_segment — franja horaria del lead.
 *   morning   → 06:00–11:59
 *   afternoon → 12:00–19:59
 *   night     → 20:00–05:59
 * Uso: descubrir cuándo convierte mejor cada campaña
 * y ajustar presupuesto de pauta por franja.
 */
export function getTimeSegment(): 'morning' | 'afternoon' | 'night' {
  const h = new Date().getHours()
  if (h >= 6  && h < 12) return 'morning'
  if (h >= 12 && h < 20) return 'afternoon'
  return 'night'
}

/**
 * device_type — dispositivo del usuario.
 * Usa window.innerWidth (más fiable que userAgent para este fin).
 * Uso: saber si los leads escolares vienen de mobile o desktop
 * y ajustar creativos por dispositivo.
 */
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop'
  const w = window.innerWidth
  if (w < 768)  return 'mobile'
  if (w < 1024) return 'tablet'
  return 'desktop'
}

/**
 * frequency_segment — 1ra visita vs recurrente.
 * Usa localStorage como proxy ligero (sin backend).
 * También devuelve visit_count para ltv_segment.
 *
 * Uso: Meta puede mostrar anuncio diferente a quien
 * ya visitó 3 veces vs alguien que llega por primera vez.
 *
 * IMPORTANTE: se cachea a nivel de módulo para que múltiples
 * eventos en la misma sesión no incrementen el contador.
 * localStorage solo se escribe UNA vez por carga de página.
 */
let _cachedFrequency: { frequency_segment: 'new' | 'returning'; visit_count: number } | null = null

function getFrequencyData(): { frequency_segment: 'new' | 'returning'; visit_count: number } {
  if (typeof window === 'undefined') return { frequency_segment: 'new', visit_count: 1 }
  if (_cachedFrequency !== null) return _cachedFrequency
  try {
    const key   = 'lc_vc'   // visit count — clave corta para reducir storage
    const count = parseInt(localStorage.getItem(key) || '0', 10) + 1
    localStorage.setItem(key, String(count))
    _cachedFrequency = {
      frequency_segment: count === 1 ? 'new' : 'returning',
      visit_count: count,
    }
    return _cachedFrequency
  } catch {
    _cachedFrequency = { frequency_segment: 'new', visit_count: 1 }
    return _cachedFrequency
  }
}

/**
 * ltv_segment — LTV estimado por frecuencia de visita.
 * No es LTV real (requiere historial de compras).
 * Es una señal proxy basada en engagement recurrente:
 *   cold → 1 visita      (nuevo, no calificado)
 *   warm → 2–3 visitas   (interesado, considera)
 *   hot  → 4+ visitas    (alta intención de compra)
 *
 * Recalibrar con datos reales a los 30–50 leads.
 */
function getLTVSegment(visitCount: number): 'cold' | 'warm' | 'hot' {
  if (visitCount >= 4) return 'hot'
  if (visitCount >= 2) return 'warm'
  return 'cold'
}

/**
 * withPageContext — enriquece TODOS los eventos automáticamente.
 * Un solo lugar de verdad → cero repetición en los trackers.
 *
 * Payload completo por evento:
 *   page_path         → /  |  /listas-escolares  |  etc.
 *   timestamp         → ISO 8601
 *   time_segment      → morning | afternoon | night
 *   device_type       → mobile | tablet | desktop
 *   frequency_segment → new | returning
 *   visit_count       → número de visitas (localStorage)
 *   ltv_segment       → cold | warm | hot
 */
function withPageContext(params: Record<string, unknown>): Record<string, unknown> {
  const { frequency_segment, visit_count } = getFrequencyData()
  return {
    ...params,
    page_path:         typeof window !== 'undefined' ? window.location.pathname : '',
    timestamp:         new Date().toISOString(),
    time_segment:      getTimeSegment(),
    device_type:       getDeviceType(),
    frequency_segment,
    visit_count,
    ltv_segment:       getLTVSegment(visit_count),
  }
}

// ============================================
// EVENTOS DE CONVERSIÓN — por modo de campaña
//
// value = valor promedio estimado del lead (S/).
// Meta usa esto para optimizar calidad, no volumen:
//   value: 40 → Meta busca leads que valen S/40+
//   value:  1 → Meta optimiza cantidad sin filtro
// ============================================

/**
 * SchoolListLead — clic en CTA de lista escolar.
 * value: 40 → ticket promedio estimado campaña escolar.
 */
export function trackSchoolListLead(metadata: Record<string, unknown> = {}) {
  const params = withPageContext({
    campaign:      'escolar_2026',
    campaign_mode: 'school',
    value:         40,
    currency:      'PEN',
    ...metadata,
  })
  trackMetaCustomEvent('SchoolListLead', params)
  pushToDataLayer('SchoolListLead', params)
}

/**
 * SublimationLead — clic en CTA de sublimación.
 * value: 60 → ticket promedio sublimación (polos, tazas, etc.).
 */
export function trackSublimationLead(metadata: Record<string, unknown> = {}) {
  const params = withPageContext({
    campaign:      'sublimacion_2026',
    campaign_mode: 'sublimation',
    value:         60,
    currency:      'PEN',
    ...metadata,
  })
  trackMetaCustomEvent('SublimationLead', params)
  pushToDataLayer('SublimationLead', params)
}

/**
 * MultiServiceLead — clic en CTA modo servicios.
 * value: 30 → consulta general, menor certeza de ticket.
 * `service` identifica cuál de las 3 cards se tocó.
 */
export function trackMultiServiceLead(metadata: Record<string, unknown> = {}) {
  const params = withPageContext({
    campaign:      'multi_service',
    campaign_mode: 'services',
    value:         30,
    currency:      'PEN',
    ...metadata,
  })
  trackMetaCustomEvent('MultiServiceLead', params)
  pushToDataLayer('MultiServiceLead', params)
}

/**
 * DeepScrollIntent — usuario leyó ≥80% de la página.
 * value: 15 → señal de alta intención sin conversión.
 * Audiencia ideal: retargeting "warm" → recordatorio suave.
 * Payload: campaign_mode + primary_event + scroll_depth.
 */
export function trackDeepScrollIntent(metadata: Record<string, unknown> = {}) {
  const params = withPageContext({
    value: 15,
    currency: 'PEN',
    ...metadata,
  })
  trackMetaCustomEvent('DeepScrollIntent', params)
  pushToDataLayer('DeepScrollIntent', params)
}

/**
 * CTAInteraction — señal de hesitación/consideración.
 * Se dispara ANTES de que el usuario decida hacer clic:
 *   hover_intent → estuvo 2s sobre el botón (desktop)
 *   touch_intent → primer toque en mobile (antes del click)
 *
 * value: 8 → micro-señal de intención.
 * Audiencia: personas que "casi" convirtieron → retargeting agresivo.
 * Filtro Meta: CTAInteraction SIN LeadEvent = dudaron.
 */
export function trackCTAInteraction(metadata: Record<string, unknown> = {}) {
  const params = withPageContext({
    value:            8,
    currency:         'PEN',
    interaction_type: 'hover_intent',
    ...metadata,
  })
  trackMetaCustomEvent('CTAInteraction', params)
  pushToDataLayer('CTAInteraction', params)
}
