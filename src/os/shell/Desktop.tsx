import { useState } from 'react'
import { appList } from '@/apps/manifest'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { HOME } from '@/content/fs'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import type { AppId, DesktopIconSize } from '@/store/types'
import { AppIcon } from '../icons/AppIcon'

type DesktopItem = { key: string; label: string; appId: AppId; props?: Record<string, unknown> }

/** Icon, tile and grid-row sizes (px) per desktop icon size, like Ubuntu's Desktop Icons setting */
const SIZES: Record<DesktopIconSize, { icon: number; w: number; h: number; row: number; text: string }> = {
  small: { icon: 36, w: 76, h: 84, row: 88, text: 'text-[12px]' },
  standard: { icon: 48, w: 90, h: 100, row: 104, text: 'text-[13px]' },
  large: { icon: 64, w: 108, h: 120, row: 124, text: 'text-[14px]' },
}

const ITEMS: DesktopItem[] = [
  { key: 'home', label: 'Home', appId: 'files', props: { path: HOME } },
  ...appList.filter((a) => a.onDesktop).map((a) => ({ key: a.id, label: a.title, appId: a.id })),
]

export function Desktop() {
  const show = useOS((s) => s.settings.desktopIcons)
  const size = SIZES[useOS((s) => s.settings.desktopIconSize)]
  const { openApp } = useOS.getState()
  const [selected, setSelected] = useState<string | null>(null)
  const mobile = useIsMobile()

  const open = (item: DesktopItem) => openApp(item.appId, item.props)

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="absolute inset-0" onPointerDown={(e) => e.target === e.currentTarget && setSelected(null)}>
          {show && (
            <ul
              aria-label="Desktop"
              style={{ gridTemplateRows: mobile ? undefined : `repeat(auto-fill, ${size.row}px)` }}
              className="grid h-full w-max grid-flow-col content-start gap-1 p-3 max-md:h-auto max-md:w-full max-md:grid-flow-row max-md:grid-cols-4 max-md:grid-rows-none max-md:justify-items-center max-md:pt-5"
            >
              {ITEMS.map((item) => (
                <li key={item.key} className="max-md:flex max-md:w-full max-md:justify-center">
                  <button
                    type="button"
                    onClick={() => (mobile ? open(item) : setSelected(item.key))}
                    onDoubleClick={() => open(item)}
                    onKeyDown={(e) => e.key === 'Enter' && open(item)}
                    aria-label={`${item.label} (double-click to open)`}
                    // phones fit four per row, so tiles shrink to their column there
                    style={{ width: mobile ? '100%' : size.w, maxWidth: size.w, height: size.h }}
                    className={cn(
                      'flex flex-col items-center gap-1.5 rounded-xl px-1 pt-2 text-white transition-colors',
                      'hover:bg-white/10 focus-visible:bg-white/12',
                      selected === item.key && 'bg-brand/45 hover:bg-brand/50',
                    )}
                  >
                    <AppIcon appId={item.appId} style={{ width: size.icon, height: size.icon }} />
                    <span className={cn('line-clamp-2 text-center leading-tight', size.text, 'font-semibold [text-shadow:0_1px_3px_rgb(0_0_0/0.85)]')}>
                      {item.label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-60">
        <ContextMenuItem onSelect={() => openApp('terminal')}>Open in Terminal</ContextMenuItem>
        <ContextMenuItem onSelect={() => openApp('files', { path: `${HOME}/Desktop` })}>
          Show Desktop in Files
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onSelect={() => openApp('settings', { page: 'appearance' })}>Change Background…</ContextMenuItem>
        <ContextMenuItem onSelect={() => openApp('settings', { page: 'desktop' })}>Desktop Icons Settings</ContextMenuItem>
        <ContextMenuItem onSelect={() => openApp('settings', { page: 'about' })}>About This Computer</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
