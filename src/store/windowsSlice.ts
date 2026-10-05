import type { StateCreator } from 'zustand'
import { appManifest } from '@/apps/manifest'
import { clampBounds, getWorkArea, isCompactViewport, isMobileViewport } from './layout'
import type { AppId, Bounds, TileSide, WindowState } from './types'
import type { OSState } from './useOS'

export interface WindowsSlice {
  windows: Record<string, WindowState>
  order: string[]
  zTop: number
  openApp: (appId: AppId, props?: Record<string, unknown>) => string
  closeWindow: (id: string) => void
  removeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  tileWindow: (id: string, side: TileSide | null) => void
  setBounds: (id: string, bounds: Bounds) => void
  setWindowTitle: (id: string, title: string) => void
  quitApp: (appId: AppId) => void
  /** Dock click: open, focus, or minimize depending on state */
  activateApp: (appId: AppId) => void
}

let seq = 0
const CASCADE = 32

function initialBounds(appId: AppId, openCount: number): Bounds {
  const area = getWorkArea()
  const { defaultSize } = appManifest[appId]
  const w = Math.min(defaultSize.w, area.w - 48)
  const h = Math.min(defaultSize.h, area.h - 48)
  const offset = (openCount % 6) * CASCADE
  const x = Math.min(area.x + Math.round((area.w - w) / 2) + offset - CASCADE, area.x + area.w - w - 8)
  // keep the whole window on screen: shift up first, never past the top bar
  const y = Math.max(
    area.y + 8,
    Math.min(area.y + Math.round((area.h - h) / 2.4) + offset - CASCADE / 2, area.y + area.h - h - 8),
  )
  return clampBounds({ x: Math.max(area.x + 8, x), y, w, h: Math.min(h, area.h - 16) })
}

export const createWindowsSlice: StateCreator<OSState, [], [], WindowsSlice> = (set, get) => ({
  windows: {},
  order: [],
  zTop: 10,

  openApp(appId, props) {
    const meta = appManifest[appId]
    if (meta.presentation === 'overlay') {
      get().setOverlay(appId)
      return ''
    }
    const state = get()
    if (meta.singleton) {
      const existing = state.order.find((id) => state.windows[id].appId === appId && !state.windows[id].closing)
      if (existing) {
        if (props) {
          set((s) => ({
            windows: { ...s.windows, [existing]: { ...s.windows[existing], props } },
          }))
        }
        get().focusWindow(existing)
        return existing
      }
    }
    const id = `${appId}-${++seq}`
    const z = state.zTop + 1
    const win: WindowState = {
      id,
      appId,
      title: (props?.title as string) ?? meta.title,
      bounds: initialBounds(appId, state.order.length),
      z,
      minimized: false,
      // phones and tablets open windows full screen; desktops get a floating window
      maximized: isCompactViewport(),
      tiled: null,
      closing: false,
      props,
    }
    set((s) => ({
      windows: { ...s.windows, [id]: win },
      order: [...s.order, id],
      zTop: z,
      overviewOpen: false,
    }))
    return id
  },

  closeWindow(id) {
    const win = get().windows[id]
    if (!win || win.closing) return
    set((s) => ({ windows: { ...s.windows, [id]: { ...win, closing: true } } }))
    const instant = !get().settings.animations
    window.setTimeout(() => get().removeWindow(id), instant ? 0 : 220)
  },

  removeWindow(id) {
    set((s) => {
      const windows = { ...s.windows }
      delete windows[id]
      return { windows, order: s.order.filter((o) => o !== id) }
    })
  },

  focusWindow(id) {
    const s = get()
    const win = s.windows[id]
    if (!win) return
    if (win.z === s.zTop && !win.minimized) return
    // keep window z-indices well below shell overlays (app grid sits at 9000)
    if (s.zTop > 8000) {
      const ranked = [...s.order].sort((a, b) => s.windows[a].z - s.windows[b].z)
      const windows = { ...s.windows }
      ranked.forEach((wid, i) => (windows[wid] = { ...windows[wid], z: 10 + i }))
      const z = 10 + ranked.length
      windows[id] = { ...windows[id], z, minimized: false }
      set({ zTop: z, windows })
      return
    }
    const z = s.zTop + 1
    set({
      zTop: z,
      windows: { ...s.windows, [id]: { ...win, z, minimized: false } },
    })
  },

  minimizeWindow(id) {
    set((s) => ({ windows: { ...s.windows, [id]: { ...s.windows[id], minimized: true } } }))
  },

  toggleMaximize(id) {
    if (isMobileViewport()) return
    set((s) => {
      const win = s.windows[id]
      const z = s.zTop + 1
      return {
        zTop: z,
        windows: { ...s.windows, [id]: { ...win, z, maximized: !win.maximized, tiled: null } },
      }
    })
  },

  tileWindow(id, side) {
    if (isMobileViewport()) return
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], tiled: side, maximized: false } },
    }))
  },

  setBounds(id, bounds) {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], bounds: clampBounds(bounds), maximized: false, tiled: null },
      },
    }))
  },

  setWindowTitle(id, title) {
    set((s) => (s.windows[id] ? { windows: { ...s.windows, [id]: { ...s.windows[id], title } } } : s))
  },

  quitApp(appId) {
    const s = get()
    s.order.filter((id) => s.windows[id].appId === appId).forEach((id) => s.closeWindow(id))
  },

  activateApp(appId) {
    const s = get()
    const mine = s.order.filter((id) => s.windows[id].appId === appId && !s.windows[id].closing)
    if (mine.length === 0) {
      s.openApp(appId)
      return
    }
    const top = mine.reduce((a, b) => (s.windows[a].z > s.windows[b].z ? a : b))
    const topWin = s.windows[top]
    const isFocused = !topWin.minimized && topWin.z === s.zTop
    if (isFocused) {
      // Ubuntu Dock default: click on focused app minimizes it
      mine.forEach((id) => s.minimizeWindow(id))
    } else {
      s.focusWindow(top)
    }
    set({ overviewOpen: false })
  },
})

/** Highest-z visible window id, or null */
export function selectFocusedId(s: OSState): string | null {
  let best: WindowState | null = null
  for (const id of s.order) {
    const w = s.windows[id]
    if (w.minimized || w.closing) continue
    if (!best || w.z > best.z) best = w
  }
  return best?.id ?? null
}
