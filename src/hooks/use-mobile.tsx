import { useSyncExternalStore } from "react"

// Breakpoint values matching tailwind.config.ts
const BREAKPOINTS = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

// Utility to get current breakpoint
function getBreakpoint(width: number): Breakpoint {
  if (width < BREAKPOINTS.xs) return 'xs'
  if (width < BREAKPOINTS.sm) return 'sm'
  if (width < BREAKPOINTS.md) return 'md'
  if (width < BREAKPOINTS.lg) return 'lg'
  if (width < BREAKPOINTS.xl) return 'xl'
  return '2xl'
}

// Store for window width
const widthStore = {
  getSnapshot: () => {
    if (typeof window === 'undefined') return 0
    return window.innerWidth
  },
  getServerSnapshot: () => 0,
  subscribe: (callback: () => void) => {
    if (typeof window === 'undefined') return () => {}
    window.addEventListener('resize', callback)
    return () => window.removeEventListener('resize', callback)
  },
}

// Hook to get current window width (SSR-safe)
export function useWindowWidth() {
  return useSyncExternalStore(
    widthStore.subscribe,
    widthStore.getSnapshot,
    widthStore.getServerSnapshot
  )
}

// Hook to check if is mobile (< md)
export function useIsMobile() {
  const width = useWindowWidth()
  return width < BREAKPOINTS.md
}

// Hook to get current breakpoint name
export function useBreakpoint(): Breakpoint {
  const width = useWindowWidth()
  return getBreakpoint(width)
}

// Hook to check if current breakpoint matches or is smaller than given
export function useBreakpointDown(breakpoint: Breakpoint) {
  const width = useWindowWidth()
  return width < BREAKPOINTS[breakpoint]
}

// Hook to check if current breakpoint matches or is larger than given
export function useBreakpointUp(breakpoint: Breakpoint) {
  const width = useWindowWidth()
  return width >= BREAKPOINTS[breakpoint]
}

// Hook to check if current breakpoint is between two values
export function useBreakpointBetween(min: Breakpoint, max: Breakpoint) {
  const width = useWindowWidth()
  return width >= BREAKPOINTS[min] && width < BREAKPOINTS[max]
}

// Export breakpoints for use in other components
export { BREAKPOINTS }
