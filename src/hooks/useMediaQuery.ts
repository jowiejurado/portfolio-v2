import { useSyncExternalStore } from 'react'
import { MOBILE_BP } from '@/store/layout'

export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    },
    () => window.matchMedia(query).matches,
  )
}

export const useIsMobile = () => useMediaQuery(`(max-width: ${MOBILE_BP - 1}px)`)

/** Re-render on viewport resize (rAF-throttled). */
let vpVersion = 0
const vpListeners = new Set<() => void>()
let raf = 0
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(() => {
      vpVersion++
      vpListeners.forEach((l) => l())
    })
  })
}
export function useViewportVersion() {
  return useSyncExternalStore(
    (cb) => {
      vpListeners.add(cb)
      return () => vpListeners.delete(cb)
    },
    () => vpVersion,
  )
}
