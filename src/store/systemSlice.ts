import type { StateCreator } from 'zustand'
import type { AppId, Notification, SessionPhase } from './types'
import type { OSState } from './useOS'

/** Brightness never drops below this, so the screen can't go fully dark. */
export const MIN_BRIGHTNESS = 20

export interface SystemSlice {
  system: {
    volume: number
    muted: boolean
    brightness: number
    wifi: boolean
    dnd: boolean
  }
  setSystem: (patch: Partial<SystemSlice['system']>) => void

  phase: SessionPhase
  setPhase: (phase: SessionPhase) => void
  overviewOpen: boolean
  setOverview: (open: boolean) => void
  powerDialogOpen: boolean
  /** an app shown as a full-screen overlay (e.g. the Contact lanyard) */
  overlayApp: AppId | null
  setOverlay: (appId: AppId | null) => void
  setPowerDialog: (open: boolean) => void

  notifications: Notification[]
  banner: Notification | null
  notify: (n: Omit<Notification, 'id' | 'time'>) => void
  dismissBanner: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

let nseq = 0

export const createSystemSlice: StateCreator<OSState, [], [], SystemSlice> = (set) => ({
  system: {
    volume: 62,
    muted: false,
    brightness: 100,
    wifi: true,
    dnd: false,
  },
  setSystem(patch) {
    const next = { ...patch }
    if (next.brightness !== undefined) next.brightness = Math.min(100, Math.max(MIN_BRIGHTNESS, next.brightness))
    set((s) => ({ system: { ...s.system, ...next } }))
  },

  phase: 'boot',
  setPhase(phase) {
    set({ phase, overviewOpen: false })
  },
  overviewOpen: false,
  setOverview(open) {
    set({ overviewOpen: open })
  },
  powerDialogOpen: false,
  overlayApp: null,
  setOverlay(appId) {
    set({ overlayApp: appId, overviewOpen: false })
  },
  setPowerDialog(open) {
    set({ powerDialogOpen: open })
  },

  notifications: [],
  banner: null,
  notify(n) {
    const full: Notification = { ...n, id: `n${++nseq}`, time: Date.now() }
    set((s) => ({
      notifications: [full, ...s.notifications].slice(0, 30),
      banner: s.system.dnd ? s.banner : full,
    }))
  },
  dismissBanner() {
    set({ banner: null })
  },
  removeNotification(id) {
    set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) }))
  },
  clearNotifications() {
    set({ notifications: [] })
  },
})
