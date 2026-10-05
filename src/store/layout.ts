import type { Bounds, DockPosition } from './types'

/** GNOME top bar height */
export const TOPBAR_H = 32
/** Ubuntu Dock icon size bounds (px); the dock grows with its icons */
export const DOCK_ICON_MIN = 24
export const DOCK_ICON_MAX = 56
export const DOCK_ICON_DEFAULT = 36

/** Dock button and panel widths for an icon size (36 → 54px buttons in a 68px panel) */
export const dockItemSize = (icon: number) => icon + 18
export const dockWidth = (icon: number) => icon + 32

/** Current Ubuntu Dock thickness and edge (panel mode); kept in sync with settings by useOS */
let DOCK_W = dockWidth(DOCK_ICON_DEFAULT)
let DOCK_POS: DockPosition = 'left'
export function setDockLayout(icon: number, position: DockPosition) {
  DOCK_W = dockWidth(icon)
  DOCK_POS = position
}
/** Dock height when it moves to the bottom on small screens */
export const DOCK_H_MOBILE = 64
export const MOBILE_BP = 768
/** Below this width (phones and tablets) windows open full screen. */
export const TABLET_BP = 1024

export const MIN_W = 360
export const MIN_H = 240

export function isCompactViewport(width = window.innerWidth) {
  return width < TABLET_BP
}

export function isMobileViewport(width = window.innerWidth) {
  return width < MOBILE_BP
}

/** Screen edge the dock sits on right now: phones always use the bottom. */
export function dockSide(width = window.innerWidth): DockPosition {
  return isMobileViewport(width) ? 'bottom' : DOCK_POS
}

/** Area windows may occupy: below the top bar and beside (or above) the dock. */
export function getWorkArea(): Bounds {
  const vw = window.innerWidth
  const vh = window.innerHeight
  if (isMobileViewport(vw)) {
    return { x: 0, y: TOPBAR_H, w: vw, h: vh - TOPBAR_H - DOCK_H_MOBILE }
  }
  if (DOCK_POS === 'bottom') return { x: 0, y: TOPBAR_H, w: vw, h: vh - TOPBAR_H - DOCK_W }
  if (DOCK_POS === 'right') return { x: 0, y: TOPBAR_H, w: vw - DOCK_W, h: vh - TOPBAR_H }
  return { x: DOCK_W, y: TOPBAR_H, w: vw - DOCK_W, h: vh - TOPBAR_H }
}

export function clampBounds(b: Bounds, area = getWorkArea()): Bounds {
  const w = Math.min(Math.max(b.w, MIN_W), area.w)
  const h = Math.min(Math.max(b.h, MIN_H), area.h)
  // keep at least the headerbar reachable
  const x = Math.min(Math.max(b.x, area.x - w + 120), area.x + area.w - 120)
  const y = Math.min(Math.max(b.y, area.y), area.y + area.h - 46)
  return { x, y, w, h }
}

export function tileBounds(side: 'left' | 'right', area = getWorkArea()): Bounds {
  const half = Math.round(area.w / 2)
  return side === 'left'
    ? { x: area.x, y: area.y, w: half, h: area.h }
    : { x: area.x + half, y: area.y, w: area.w - half, h: area.h }
}
