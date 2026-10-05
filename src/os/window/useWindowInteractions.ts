import { useCallback, useRef, type PointerEvent as RPointerEvent, type RefObject } from 'react'
import { MIN_H, MIN_W, getWorkArea } from '@/store/layout'
import type { Bounds } from '@/store/types'
import { useOS } from '@/store/useOS'
import { useSnap, zoneAt } from './snap'

export type ResizeDir = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

function apply(el: HTMLElement, b: Bounds) {
  el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`
  el.style.width = `${b.w}px`
  el.style.height = `${b.h}px`
}

/**
 * Drag and resize write straight to the DOM while the pointer moves and
 * commit to the store once on release — no React renders per frame.
 */
export function useWindowInteractions(id: string, elRef: RefObject<HTMLElement | null>, current: () => Bounds) {
  const raf = useRef(0)

  const onDragStart = useCallback(
    (e: RPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return
      if ((e.target as HTMLElement).closest('button, input, a, [data-no-drag]')) return
      const el = elRef.current
      if (!el) return
      const state = useOS.getState()
      const win = state.windows[id]
      if (!win || window.innerWidth < 768) return

      const startX = e.clientX
      const startY = e.clientY
      let start = current()
      let detached = !(win.maximized || win.tiled)
      let moved = false
      const target = e.currentTarget
      target.setPointerCapture(e.pointerId)

      const onMove = (ev: PointerEvent) => {
        const dx = ev.clientX - startX
        const dy = ev.clientY - startY
        if (!moved && Math.hypot(dx, dy) < 4) return
        moved = true
        el.dataset.dragging = 'true'
        if (!detached) {
          // GNOME: dragging a maximized/tiled window restores it under the cursor
          const restored = win.bounds
          const ratio = (startX - start.x) / start.w
          start = {
            w: restored.w,
            h: restored.h,
            x: startX - restored.w * ratio,
            y: start.y,
          }
          useOS.setState((s) => ({
            windows: { ...s.windows, [id]: { ...s.windows[id], maximized: false, tiled: null } },
          }))
          detached = true
        }
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
          const area = getWorkArea()
          const next = {
            ...start,
            x: start.x + dx,
            y: Math.max(area.y, start.y + dy),
          }
          apply(el, next)
          useSnap.getState().set(zoneAt(ev.clientX, ev.clientY))
        })
      }

      const onUp = (ev: PointerEvent) => {
        cancelAnimationFrame(raf.current)
        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerup', onUp)
        target.removeEventListener('pointercancel', onUp)
        delete el.dataset.dragging
        const zone = useSnap.getState().zone
        useSnap.getState().set(null)
        if (!moved) return
        const area = getWorkArea()
        const final = {
          ...start,
          x: start.x + (ev.clientX - startX),
          y: Math.max(area.y, start.y + (ev.clientY - startY)),
        }
        const { setBounds, toggleMaximize, tileWindow } = useOS.getState()
        setBounds(id, final)
        if (zone === 'max') toggleMaximize(id)
        else if (zone) tileWindow(id, zone)
      }

      target.addEventListener('pointermove', onMove)
      target.addEventListener('pointerup', onUp)
      target.addEventListener('pointercancel', onUp)
    },
    [id, elRef, current],
  )

  const onResizeStart = useCallback(
    (dir: ResizeDir) => (e: RPointerEvent<HTMLElement>) => {
      if (e.button !== 0) return
      e.stopPropagation()
      const el = elRef.current
      if (!el) return
      const start = current()
      const sx = e.clientX
      const sy = e.clientY
      const target = e.currentTarget
      target.setPointerCapture(e.pointerId)
      el.dataset.dragging = 'true'
      let last = start

      const compute = (ev: PointerEvent): Bounds => {
        const area = getWorkArea()
        const dx = ev.clientX - sx
        const dy = ev.clientY - sy
        let { x, y, w, h } = start
        if (dir.includes('e')) w = Math.max(MIN_W, start.w + dx)
        if (dir.includes('s')) h = Math.max(MIN_H, start.h + dy)
        if (dir.includes('w')) {
          w = Math.max(MIN_W, start.w - dx)
          x = start.x + (start.w - w)
        }
        if (dir.includes('n')) {
          const ny = Math.max(area.y, start.y + dy)
          h = Math.max(MIN_H, start.h + (start.y - ny))
          y = start.y + (start.h - h)
        }
        return { x, y, w, h }
      }

      const onMove = (ev: PointerEvent) => {
        cancelAnimationFrame(raf.current)
        raf.current = requestAnimationFrame(() => {
          last = compute(ev)
          apply(el, last)
        })
      }
      const onUp = (ev: PointerEvent) => {
        cancelAnimationFrame(raf.current)
        target.removeEventListener('pointermove', onMove)
        target.removeEventListener('pointerup', onUp)
        target.removeEventListener('pointercancel', onUp)
        delete el.dataset.dragging
        last = compute(ev)
        useOS.getState().setBounds(id, last)
      }
      target.addEventListener('pointermove', onMove)
      target.addEventListener('pointerup', onUp)
      target.addEventListener('pointercancel', onUp)
    },
    [id, elRef, current],
  )

  return { onDragStart, onResizeStart }
}
