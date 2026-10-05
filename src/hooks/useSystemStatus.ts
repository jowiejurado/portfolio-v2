import { useEffect, useState, useSyncExternalStore } from 'react'

interface BatteryManager extends EventTarget {
  charging: boolean
  level: number
  chargingTime: number
  dischargingTime: number
}

export interface BatteryStatus {
  supported: boolean
  level: number // 0–100
  charging: boolean
  /** seconds until empty/full, or null when unknown */
  eta: number | null
}

/** Battery Status API with a graceful "AC power" fallback (Firefox/Safari). */
export function useBattery(): BatteryStatus {
  const [status, setStatus] = useState<BatteryStatus>({ supported: false, level: 100, charging: true, eta: null })

  useEffect(() => {
    const nav = navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
    if (!nav.getBattery) return
    let battery: BatteryManager | null = null
    const update = () => {
      if (!battery) return
      const eta = battery.charging ? battery.chargingTime : battery.dischargingTime
      setStatus({
        supported: true,
        level: Math.round(battery.level * 100),
        charging: battery.charging,
        eta: Number.isFinite(eta) && eta > 0 ? eta : null,
      })
    }
    const events = ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']
    nav.getBattery().then((b) => {
      battery = b
      update()
      events.forEach((e) => b.addEventListener(e, update))
    }).catch(() => {})
    return () => {
      if (battery) events.forEach((e) => battery!.removeEventListener(e, update))
    }
  }, [])

  return status
}

type Connection = EventTarget & { effectiveType?: string; type?: string; downlink?: number }

function getConnection(): Connection | undefined {
  return (navigator as Navigator & { connection?: Connection }).connection
}

function subscribeNetwork(cb: () => void) {
  window.addEventListener('online', cb)
  window.addEventListener('offline', cb)
  const c = getConnection()
  c?.addEventListener('change', cb)
  return () => {
    window.removeEventListener('online', cb)
    window.removeEventListener('offline', cb)
    c?.removeEventListener('change', cb)
  }
}

function networkSnapshot() {
  const c = getConnection()
  return `${navigator.onLine ? 1 : 0}|${c?.effectiveType ?? ''}|${c?.type ?? ''}|${c?.downlink ?? ''}`
}

export interface NetworkStatus {
  online: boolean
  effectiveType: string | null
  /** 'wifi' | 'ethernet' | 'cellular' | … when the browser exposes it */
  type: string | null
  downlink: number | null
}

export function useNetwork(): NetworkStatus {
  const snap = useSyncExternalStore(subscribeNetwork, networkSnapshot)
  const [online, effectiveType, type, downlink] = snap.split('|')
  return {
    online: online === '1',
    effectiveType: effectiveType || null,
    type: type || null,
    downlink: downlink ? Number(downlink) : null,
  }
}
