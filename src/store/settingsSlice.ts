import type { StateCreator } from 'zustand'
import type { AccentId, AppId, DesktopIconSize, DockPosition, ThemePref, WallpaperId } from './types'
import type { OSState } from './useOS'
import { DOCK_ICON_DEFAULT } from './layout'

export interface Settings {
  theme: ThemePref
  accent: AccentId
  wallpaper: WallpaperId
  clock24h: boolean
  showSeconds: boolean
  showWeekday: boolean
  showBatteryPercent: boolean
  animations: boolean
  bootSplash: boolean
  desktopIcons: boolean
  desktopIconSize: DesktopIconSize
  /** Dock icon size in px (Ubuntu Dock's "Icon size" slider) */
  dockIconSize: number
  /** Screen edge for the dock on desktop widths */
  dockPosition: DockPosition
  welcomed: boolean
  pinned: AppId[]
}

export interface SettingsSlice {
  settings: Settings
  setSettings: (patch: Partial<Settings>) => void
  togglePin: (appId: AppId) => void
}

export const DEFAULT_PINNED: AppId[] = [
  'about',
  'projects',
  'experience',
  'github',
  'games',
  'contact',
  'files',
  'terminal',
]

export const createSettingsSlice: StateCreator<OSState, [], [], SettingsSlice> = (set) => ({
  settings: {
    theme: 'system',
    accent: 'orange',
    wallpaper: 'resolute',
    clock24h: false,
    showSeconds: false,
    showWeekday: true,
    showBatteryPercent: true,
    animations: true,
    bootSplash: true,
    desktopIcons: true,
    desktopIconSize: 'standard',
    dockIconSize: DOCK_ICON_DEFAULT,
    dockPosition: 'left',
    welcomed: false,
    pinned: DEFAULT_PINNED,
  },
  setSettings(patch) {
    set((s) => ({ settings: { ...s.settings, ...patch } }))
  },
  togglePin(appId) {
    set((s) => {
      const pinned = s.settings.pinned.includes(appId)
        ? s.settings.pinned.filter((a) => a !== appId)
        : [...s.settings.pinned, appId]
      return { settings: { ...s.settings, pinned } }
    })
  },
})
