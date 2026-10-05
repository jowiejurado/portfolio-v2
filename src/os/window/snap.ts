import { create } from 'zustand'
import type { Bounds } from '@/store/types'
import { getWorkArea, tileBounds } from '@/store/layout'

export type SnapZone = 'max' | 'left' | 'right' | null

/** Transient UI state for the snap preview while a window is dragged. */
export const useSnap = create<{ zone: SnapZone; set: (z: SnapZone) => void }>((set) => ({
  zone: null,
  set: (zone) => set((s) => (s.zone === zone ? s : { zone })),
}))

const EDGE = 6

export function zoneAt(px: number, py: number): SnapZone {
  const area = getWorkArea()
  if (py <= area.y + EDGE - 2) return 'max'
  if (px <= area.x + EDGE) return 'left'
  if (px >= area.x + area.w - EDGE) return 'right'
  return null
}

export function zoneBounds(zone: Exclude<SnapZone, null>): Bounds {
  return zone === 'max' ? getWorkArea() : tileBounds(zone)
}
