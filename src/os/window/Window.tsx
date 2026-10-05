import { memo, Suspense, useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { appComponents } from '@/apps/registry'
import { appManifest } from '@/apps/manifest'
import { Spinner } from '@/components/Spinner'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useViewportVersion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { dockSide, getWorkArea, isMobileViewport, tileBounds } from '@/store/layout'
import { useOS } from '@/store/useOS'
import { selectFocusedId } from '@/store/windowsSlice'
import type { Bounds } from '@/store/types'
import { CloseGlyph, MaximizeGlyph, MinimizeGlyph, RestoreGlyph } from '../icons/glyphs'
import { AppErrorBoundary } from './ErrorBoundary'
import { genieKeyframes, genieRestoreKeyframes, motionAllowed } from './genie'
import { WindowContext, type WindowCtx } from './WindowContext'
import { useWindowInteractions, type ResizeDir } from './useWindowInteractions'

const RESIZE_ZONES: { dir: ResizeDir; className: string }[] = [
  { dir: 'n', className: 'top-[-4px] left-3 right-3 h-2 cursor-n-resize' },
  { dir: 's', className: 'bottom-[-4px] left-3 right-3 h-2 cursor-s-resize' },
  { dir: 'e', className: 'right-[-4px] top-3 bottom-3 w-2 cursor-e-resize' },
  { dir: 'w', className: 'left-[-4px] top-3 bottom-3 w-2 cursor-w-resize' },
  { dir: 'ne', className: 'right-[-5px] top-[-5px] size-4 cursor-ne-resize' },
  { dir: 'nw', className: 'left-[-5px] top-[-5px] size-4 cursor-nw-resize' },
  { dir: 'se', className: 'right-[-5px] bottom-[-5px] size-4 cursor-se-resize' },
  { dir: 'sw', className: 'left-[-5px] bottom-[-5px] size-4 cursor-sw-resize' },
]

function TitleButton({
  label,
  onClick,
  close,
  className,
  children,
}: {
  label: string
  onClick: () => void
  close?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onDoubleClick={(e) => e.stopPropagation()}
      className={cn(
        'grid size-6 place-items-center rounded-full bg-fg/[0.09] text-fg transition-colors duration-150',
        className,
        'hover:bg-fg/[0.16] active:bg-fg/[0.24]',
        close && 'hover:bg-brand hover:text-brand-fg active:bg-brand active:brightness-90',
      )}
    >
      <span className="size-4 [&>svg]:size-4">{children}</span>
    </button>
  )
}

export const Window = memo(function Window({ id }: { id: string }) {
  const win = useOS((s) => s.windows[id])
  // re-render when the dock resizes or moves so maximized and tiled windows refit the work area
  useOS((s) => s.settings.dockIconSize)
  useOS((s) => s.settings.dockPosition)
  const focused = useOS((s) => selectFocusedId(s) === id)
  const { focusWindow, closeWindow, minimizeWindow, toggleMaximize, tileWindow } = useOS.getState()
  useViewportVersion()

  const elRef = useRef<HTMLElement>(null)
  const [slots, setSlots] = useState<WindowCtx['slots']>({ start: null, title: null, end: null, sidebar: null })
  const [split, setSplit] = useState<number | null>(null)
  const sidebarRef = useCallback((el: HTMLElement | null) => setSlots((s) => (s.sidebar === el ? s : { ...s, sidebar: el })), [])
  const startRef = useCallback((el: HTMLElement | null) => setSlots((s) => (s.start === el ? s : { ...s, start: el })), [])
  const titleRef = useCallback((el: HTMLElement | null) => setSlots((s) => (s.title === el ? s : { ...s, title: el })), [])
  const endRef = useCallback((el: HTMLElement | null) => setSlots((s) => (s.end === el ? s : { ...s, end: el })), [])

  // phones always show windows full screen, even ones opened at desktop width
  const forceMax = isMobileViewport()
  const rendered: Bounds = win.maximized || forceMax ? getWorkArea() : win.tiled ? tileBounds(win.tiled) : win.bounds
  const renderedRef = useRef(rendered)
  renderedRef.current = rendered
  const current = useCallback(() => renderedRef.current, [])
  const { onDragStart, onResizeStart } = useWindowInteractions(id, elRef, current)

  // Minimize / restore: macOS genie into (and out of) this app's dock icon
  const [hidden, setHidden] = useState(win.minimized)
  const genieAnim = useRef<Animation | null>(null)
  const firstRun = useRef(true)
  useLayoutEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    const el = elRef.current
    if (!el) return
    genieAnim.current?.cancel()
    const icon = document.querySelector(`[data-dock-app="${win.appId}"]`)?.getBoundingClientRect()
    const side = dockSide()
    const animate = motionAllowed() && icon
    if (win.minimized) {
      if (!animate) return setHidden(true)
      const anim = el.animate(genieKeyframes(rendered, icon, side), {
        duration: 560,
        easing: 'cubic-bezier(0.5, 0, 0.75, 0.25)',
        fill: 'forwards',
      })
      genieAnim.current = anim
      anim.finished.then(() => setHidden(true)).catch(() => {})
    } else {
      setHidden(false)
      if (!animate) return
      genieAnim.current = el.animate(genieRestoreKeyframes(rendered, icon, side), {
        duration: 500,
        easing: 'cubic-bezier(0.2, 0.75, 0.4, 1)',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [win.minimized])

  const ctx = useMemo<WindowCtx>(() => ({ windowId: id, focused, slots, setSplit }), [id, focused, slots])

  const App = appComponents[win.appId]
  const meta = appManifest[win.appId]
  const docked = win.maximized || forceMax || !!win.tiled

  return (
    <section
      ref={elRef}
      aria-label={win.title}
      data-window={id}
      data-focused={focused || undefined}
      onPointerDownCapture={() => focusWindow(id)}
      className={cn(
        'group/window absolute top-0 left-0 flex origin-top-left flex-col bg-window text-fg',
        'transition-[transform,width,height,opacity,box-shadow,border-radius,scale,translate] duration-200 ease-out-expo',
        'data-[dragging]:transition-none',
        docked ? 'rounded-none' : 'rounded-[12px]',
        focused
          ? 'shadow-[0_18px_48px_-8px_rgb(0_0_0/0.42),0_2px_6px_rgb(0_0_0/0.18),0_0_0_1px_rgb(0_0_0/0.1)]'
          : 'shadow-[0_8px_24px_-6px_rgb(0_0_0/0.28),0_0_0_1px_rgb(0_0_0/0.08)]',
        'dark:shadow-[0_18px_48px_-8px_rgb(0_0_0/0.6),0_0_0_1px_rgb(255_255_255/0.07)]',
        win.closing && 'pointer-events-none animate-win-close',
        win.minimized && 'pointer-events-none',
        hidden && 'invisible',
        !win.closing && 'animate-win-open',
      )}
      style={{
        zIndex: win.z,
        width: rendered.w,
        height: rendered.h,
        transform: `translate3d(${rendered.x}px, ${rendered.y}px, 0)`,
      }}
    >
      <WindowContext.Provider value={ctx}>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <header
              onPointerDown={onDragStart}
              onDoubleClick={(e) => {
                if (!(e.target as HTMLElement).closest('button, input, a, [data-no-drag]')) toggleMaximize(id)
              }}
              className={cn(
                'relative flex h-[46px] shrink-0 touch-none border-b border-line select-none',
                docked ? 'rounded-none' : 'rounded-t-[12px]',
                focused ? 'bg-headerbar' : 'bg-headerbar-backdrop',
              )}
            >
              {/* AdwNavigationSplitView: sidebar header pane */}
              <div
                ref={sidebarRef}
                className={cn(
                  'flex shrink-0 items-center gap-1 border-r border-line bg-sidebar px-2',
                  docked ? 'rounded-none' : 'rounded-tl-[12px]',
                  !split && 'hidden',
                )}
                style={split ? { width: split } : undefined}
              />
              <div className={cn('grid min-w-0 flex-1 grid-cols-[1fr_auto_1fr] items-center gap-2 px-2', split && !docked && 'rounded-tr-[12px]', split && 'bg-window')}>
              <div ref={startRef} className="flex min-w-0 items-center gap-1" />
              <div className={cn('flex min-w-0 justify-center transition-opacity', !focused && 'opacity-60')}>
                <div ref={titleRef} className="peer flex min-w-0 items-center justify-center empty:hidden" />
                <h2 className="truncate text-[14px] font-bold peer-[:not(:empty)]:hidden">{win.title}</h2>
              </div>
              <div className="flex min-w-0 items-center justify-end gap-1">
                <div ref={endRef} className="flex items-center gap-1" />
                <div className={cn('ml-1.5 flex items-center gap-3 pr-1', !focused && 'opacity-70')}>
                  <TitleButton label="Minimize" className="max-md:hidden" onClick={() => minimizeWindow(id)}>
                    <MinimizeGlyph />
                  </TitleButton>
                  <TitleButton label={win.maximized ? 'Restore' : 'Maximize'} className="max-md:hidden" onClick={() => toggleMaximize(id)}>
                    {win.maximized ? <RestoreGlyph /> : <MaximizeGlyph />}
                  </TitleButton>
                  <TitleButton label="Close" close onClick={() => closeWindow(id)}>
                    <CloseGlyph />
                  </TitleButton>
                </div>
              </div>
              </div>
            </header>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuItem onSelect={() => minimizeWindow(id)}>
              Minimize<ContextMenuShortcut>Super H</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => toggleMaximize(id)}>
              {win.maximized ? 'Unmaximize' : 'Maximize'}
              <ContextMenuShortcut>Super ↑</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => tileWindow(id, 'left')}>
              Tile Left<ContextMenuShortcut>Super ←</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onSelect={() => tileWindow(id, 'right')}>
              Tile Right<ContextMenuShortcut>Super →</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => closeWindow(id)}>
              Close<ContextMenuShortcut>Alt F4</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>

        <div
          className={cn(
            'relative min-h-0 flex-1 overflow-hidden',
            docked ? 'rounded-none' : 'rounded-b-[12px]',
          )}
        >
          <AppErrorBoundary onClose={() => closeWindow(id)}>
            <Suspense
              fallback={
                <div className="grid h-full place-items-center text-fg-dim">
                  <Spinner className="size-8" />
                </div>
              }
            >
              <App windowId={id} props={win.props} />
            </Suspense>
          </AppErrorBoundary>
        </div>
      </WindowContext.Provider>

      {!docked &&
        RESIZE_ZONES.map((z) => (
          <div
            key={z.dir}
            aria-hidden
            onPointerDown={onResizeStart(z.dir)}
            className={cn('absolute z-10 touch-none max-md:hidden', z.className)}
          />
        ))}
      <span className="sr-only">{meta.description}</span>
    </section>
  )
})
