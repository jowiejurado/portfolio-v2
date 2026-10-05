import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createSettingsSlice, type SettingsSlice } from './settingsSlice'
import { createSystemSlice, MIN_BRIGHTNESS, type SystemSlice } from './systemSlice'
import { createWindowsSlice, type WindowsSlice } from './windowsSlice'
import { setDockLayout } from './layout'

export type OSState = WindowsSlice & SystemSlice & SettingsSlice

export const STORAGE_KEY = 'jowie-os'

export const useOS = create<OSState>()(
  persist(
    (...a) => ({
      ...createWindowsSlice(...a),
      ...createSystemSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      // Only preferences survive reloads; windows and session are runtime state.
      partialize: (s) => ({
        settings: s.settings,
        system: { volume: s.system.volume, muted: s.system.muted, brightness: s.system.brightness },
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<OSState>
        return {
          ...current,
          settings: { ...current.settings, ...p.settings },
          system: {
            ...current.system,
            ...p.system,
            brightness: Math.max(MIN_BRIGHTNESS, p.system?.brightness ?? current.system.brightness),
          },
        }
      },
    },
  ),
)

// work-area math lives outside React; keep its dock size and edge matched to the settings
const syncDock = (s: OSState) => setDockLayout(s.settings.dockIconSize, s.settings.dockPosition)
syncDock(useOS.getState())
useOS.subscribe(syncDock)

/** Imperative helpers for apps and non-React code */
export const os = {
  open: (...args: Parameters<OSState['openApp']>) => useOS.getState().openApp(...args),
  notify: (...args: Parameters<OSState['notify']>) => useOS.getState().notify(...args),
}
