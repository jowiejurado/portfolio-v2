import { memo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { appManifest } from '@/apps/manifest'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { dockItemSize, dockWidth } from '@/store/layout'
import { useOS } from '@/store/useOS'
import { selectFocusedId } from '@/store/windowsSlice'
import type { AppId, DockPosition } from '@/store/types'
import { AppIcon } from '../icons/AppIcon'
import { ShowAppsGlyph } from '../icons/glyphs'

/** Tooltips open away from the screen edge the dock sits on */
const TIP_SIDE = { left: 'right', right: 'left', bottom: 'top' } as const

const DockItem = memo(function DockItem({ appId, mobile, icon, side }: { appId: AppId; mobile: boolean; icon: number; side: DockPosition }) {
  const meta = appManifest[appId]
  const count = useOS((s) => s.order.filter((id) => s.windows[id].appId === appId && !s.windows[id].closing).length)
  const focused = useOS((s) => {
    const f = selectFocusedId(s)
    return f ? s.windows[f].appId === appId : false
  })
  const pinned = useOS((s) => s.settings.pinned.includes(appId))
  const { activateApp, openApp, togglePin, quitApp } = useOS.getState()

  return (
    <ContextMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <ContextMenuTrigger asChild>
            <button
              type="button"
              data-dock-app={appId}
              aria-label={meta.title + (count ? ` (${count} open)` : '')}
              onClick={() => activateApp(appId)}
              style={mobile ? undefined : { width: dockItemSize(icon), height: dockItemSize(icon) }}
              className={cn(
                cn('group relative grid shrink-0 place-items-center rounded-[14px] outline-offset-2', mobile && 'size-12'),
                'focus-visible:outline-2 focus-visible:outline-white/70',
                focused && '[&>svg]:-translate-y-0.5',
              )}
            >
              <AppIcon
                appId={appId}
                style={mobile ? undefined : { width: icon, height: icon }}
                className={cn('transition-[translate,scale] duration-200 ease-out-expo group-hover:-translate-y-1 group-active:translate-y-0', mobile && 'size-8')}
              />
              {count > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    'absolute flex gap-[3px]',
                    side === 'bottom'
                      ? 'bottom-[1px] left-1/2 -translate-x-1/2'
                      : cn('top-1/2 -translate-y-1/2 flex-col', side === 'left' ? 'left-[1px]' : 'right-[1px]'),
                  )}
                >
                  {Array.from({ length: Math.min(count, 4) }, (_, i) => (
                    <span key={i} className={cn('size-[5px] rounded-full', focused ? 'bg-brand' : 'bg-white/80')} />
                  ))}
                </span>
              )}
            </button>
          </ContextMenuTrigger>
        </TooltipTrigger>
        <TooltipContent side={TIP_SIDE[side]} sideOffset={10} className="dock-tip">
          {meta.title}
        </TooltipContent>
      </Tooltip>
      <ContextMenuContent className="w-52">
        <ContextMenuLabel>{meta.title}</ContextMenuLabel>
        <ContextMenuSeparator />
        {(!meta.singleton || count === 0) && (
          <ContextMenuItem onSelect={() => openApp(appId)}>{count === 0 ? 'Open' : 'New Window'}</ContextMenuItem>
        )}
        <ContextMenuItem onSelect={() => togglePin(appId)}>{pinned ? 'Unpin' : 'Pin to Dash'}</ContextMenuItem>
        {count > 0 && (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onSelect={() => quitApp(appId)}>
              {count > 1 ? `Quit ${count} Windows` : 'Quit'}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
})

export function Dock() {
  const mobile = useIsMobile()
  const icon = useOS((s) => s.settings.dockIconSize)
  const position = useOS((s) => s.settings.dockPosition)
  const side: DockPosition = mobile ? 'bottom' : position
  const horizontal = side === 'bottom'
  const pinned = useOS(useShallow((s) => s.settings.pinned))
  const running = useOS(
    useShallow((s) => {
      const ids: AppId[] = []
      for (const id of s.order) {
        const app = s.windows[id].appId
        if (!s.settings.pinned.includes(app) && !ids.includes(app)) ids.push(app)
      }
      return ids
    }),
  )
  const overviewOpen = useOS((s) => s.overviewOpen)
  const setOverview = useOS((s) => s.setOverview)

  return (
    <nav
      aria-label="Dock"
      data-dock-side={side}
      style={mobile ? undefined : horizontal ? { height: dockWidth(icon) } : { width: dockWidth(icon) }}
      className={cn(
        'relative z-[9500] flex shrink-0 items-center bg-dock text-white backdrop-blur-xl',
        horizontal ? 'w-full flex-row pr-1.5' : 'h-full flex-col pb-2',
        mobile && 'h-16',
      )}
    >
      {/* apps scroll; Show Apps stays pinned at the trailing end */}
      <div
        className={cn(
          'flex min-h-0 min-w-0 flex-1 items-center gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          horizontal
            ? 'flex-row overflow-x-auto px-1.5 [mask-image:linear-gradient(90deg,#000_calc(100%-20px),transparent)]'
            : 'flex-col overflow-y-auto pt-2 [mask-image:linear-gradient(#000_calc(100%-20px),transparent)]',
        )}
      >
        {pinned.map((id) => (
          <DockItem key={id} appId={id} mobile={mobile} icon={icon} side={side} />
        ))}
        {running.length > 0 && (
          <span aria-hidden className={cn('shrink-0 rounded-full bg-white/20', horizontal ? 'mx-1 h-8 w-px' : 'my-1 h-px w-8')} />
        )}
        {running.map((id) => (
          <DockItem key={id} appId={id} mobile={mobile} icon={icon} side={side} />
        ))}
        {/* trailing room so the last icon clears the fade */}
        <span aria-hidden className={cn('shrink-0', horizontal ? 'w-3' : 'h-3')} />
      </div>
      {horizontal && <span aria-hidden className="mx-1 h-8 w-px shrink-0 rounded-full bg-white/20" />}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="Show Apps"
            aria-pressed={overviewOpen}
            onClick={() => setOverview(!overviewOpen)}
            style={mobile ? undefined : { width: dockItemSize(icon), height: dockItemSize(icon) }}
            className={cn(
              'grid shrink-0 place-items-center rounded-[14px] text-white drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)] transition-[scale,opacity] duration-200 hover:scale-110',
              mobile && 'size-12',
              overviewOpen ? 'opacity-100' : 'opacity-85',
            )}
          >
            <ShowAppsGlyph className="size-5" style={mobile ? undefined : { width: Math.round(icon * 0.55), height: Math.round(icon * 0.55) }} />
          </button>
        </TooltipTrigger>
        <TooltipContent side={TIP_SIDE[side]} sideOffset={10} className="dock-tip">
          Show Apps
        </TooltipContent>
      </Tooltip>
    </nav>
  )
}
