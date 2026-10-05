import { useSyncExternalStore } from 'react'

/** One shared 1s ticker for every clock on screen. */
const listeners = new Set<() => void>()
let now = Date.now()
let timer: number | undefined

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (timer === undefined) {
    const tick = () => {
      now = Date.now()
      listeners.forEach((l) => l())
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000))
    }
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000))
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && timer !== undefined) {
      clearTimeout(timer)
      timer = undefined
    }
  }
}

/**
 * Returns the current time, re-rendering once per `resolution`
 * (1s when seconds are shown, otherwise once a minute).
 */
export function useClock(resolution: 'second' | 'minute' = 'minute') {
  const step = resolution === 'second' ? 1000 : 60000
  const bucket = useSyncExternalStore(subscribe, () => Math.floor(now / step))
  return new Date(bucket * step)
}
