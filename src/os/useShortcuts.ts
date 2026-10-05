import { useEffect } from 'react'
import { useOS } from '@/store/useOS'
import { selectFocusedId } from '@/store/windowsSlice'

/**
 * Global GNOME shortcuts.
 *  Super (tap)        → Activities / app grid
 *  Super+↑ / ← / →    → maximize / tile left / tile right
 *  Super+↓ / Super+H  → restore / minimize
 *  Ctrl+Alt+T         → Terminal
 *  Alt+F4, Ctrl+Q     → close focused window
 */
export function useShortcuts() {
  useEffect(() => {
    let superAlone = false

    const onDown = (e: KeyboardEvent) => {
      const s = useOS.getState()
      if (s.phase !== 'desktop') return
      if (e.key === 'Meta' || e.key === 'OS') {
        superAlone = true
        return
      }
      superAlone = false
      const focused = selectFocusedId(s)

      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault()
        s.openApp('terminal')
        return
      }
      if ((e.altKey && e.key === 'F4') || (e.ctrlKey && e.key.toLowerCase() === 'q')) {
        if (focused) {
          e.preventDefault()
          s.closeWindow(focused)
        }
        return
      }
      if (e.metaKey && focused) {
        const win = s.windows[focused]
        const act: Record<string, () => void> = {
          ArrowUp: () => !win.maximized && s.toggleMaximize(focused),
          ArrowDown: () => (win.maximized ? s.toggleMaximize(focused) : win.tiled ? s.tileWindow(focused, null) : s.minimizeWindow(focused)),
          ArrowLeft: () => s.tileWindow(focused, 'left'),
          ArrowRight: () => s.tileWindow(focused, 'right'),
          h: () => s.minimizeWindow(focused),
        }
        const fn = act[e.key]
        if (fn) {
          e.preventDefault()
          fn()
        }
      }
    }

    const onUp = (e: KeyboardEvent) => {
      if ((e.key === 'Meta' || e.key === 'OS') && superAlone) {
        const s = useOS.getState()
        if (s.phase === 'desktop') s.setOverview(!s.overviewOpen)
      }
      superAlone = false
    }

    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)
    return () => {
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
    }
  }, [])
}
