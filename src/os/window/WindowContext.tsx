import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

export interface WindowCtx {
  windowId: string
  focused: boolean
  slots: { start: HTMLElement | null; title: HTMLElement | null; end: HTMLElement | null; sidebar: HTMLElement | null }
  /** width of the sidebar pane when the app uses a split headerbar */
  setSplit: (width: number | null) => void
}

export const WindowContext = createContext<WindowCtx | null>(null)

export function useWindow() {
  const ctx = useContext(WindowContext)
  if (!ctx) throw new Error('useWindow must be used inside a window')
  return ctx
}

/**
 * libadwaita-style headerbar content. Apps render their own controls into
 * the window's headerbar: <HeaderBar start={…} title={…} end={…} />.
 * Omitting `title` keeps the window title.
 *
 * `split` + `sidebar` turn it into an AdwNavigationSplitView header: a
 * sidebar header of `split` px (holding `sidebar`) beside the content header.
 */
export function HeaderBar({
  start,
  title,
  end,
  sidebar,
  split,
}: {
  start?: ReactNode
  title?: ReactNode
  end?: ReactNode
  sidebar?: ReactNode
  split?: number | null
}) {
  const { slots, setSplit } = useWindow()
  useEffect(() => {
    setSplit(split ?? null)
    return () => setSplit(null)
  }, [split, setSplit])
  return (
    <>
      {start && slots.start && createPortal(start, slots.start)}
      {title && slots.title && createPortal(title, slots.title)}
      {end && slots.end && createPortal(end, slots.end)}
      {sidebar && slots.sidebar && createPortal(sidebar, slots.sidebar)}
    </>
  )
}
