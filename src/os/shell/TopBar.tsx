import { useState } from 'react'
import { BellIcon } from '@heroicons/react/16/solid'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useClock } from '@/hooks/useClock'
import { formatClock } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { BatteryIndicator, NetworkIcon, VolumeIcon } from '../tray/indicators'
import { DateMenu } from './DateMenu'
import { QuickSettings } from './QuickSettings'

const panelButton =
  'flex h-[26px] items-center rounded-full px-3 transition-colors duration-150 hover:bg-white/15 active:bg-white/25 data-[state=open]:bg-white/22 outline-offset-0'

const shellPopover =
  'w-auto rounded-[24px] border border-white/[0.06] bg-shell p-3 text-shell-fg shadow-[0_12px_40px_rgb(0_0_0/0.45)] dark:border-white/[0.08]'

function ActivitiesButton() {
  const open = useOS((s) => s.overviewOpen)
  const setOverview = useOS((s) => s.setOverview)
  return (
    <button
      type="button"
      aria-label="Activities"
      aria-pressed={open}
      onClick={() => setOverview(!open)}
      className={cn(panelButton, 'gap-[5px] px-3.5', open && 'bg-white/22')}
    >
      {/* GNOME workspace indicator: active workspace is the wide pill */}
      <span className={cn('h-[7px] rounded-full bg-panel-fg transition-all duration-300', open ? 'w-[30px]' : 'w-[22px]')} />
      <span className="size-[7px] rounded-full bg-panel-fg/50" />
    </button>
  )
}

function Clock() {
  const s = useOS((st) => st.settings)
  const now = useClock(s.showSeconds ? 'second' : 'minute')
  const hasNew = useOS((st) => st.notifications.length > 0)
  const dnd = useOS((st) => st.system.dnd)
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(panelButton, 'gap-2 font-semibold whitespace-pre')} aria-label="Date and notifications">
        <time dateTime={now.toISOString()} className="tabular text-[14px]">
          {formatClock(now, { h24: s.clock24h, seconds: s.showSeconds, weekday: s.showWeekday })}
        </time>
        {(hasNew || dnd) && (
          <BellIcon className={cn('size-3.5', dnd && 'opacity-50')} aria-label={dnd ? 'Do not disturb' : 'New notifications'} />
        )}
      </PopoverTrigger>
      <PopoverContent align="center" sideOffset={6} className={cn(shellPopover, 'p-4')}>
        <DateMenu />
      </PopoverContent>
    </Popover>
  )
}

function StatusArea() {
  const [open, setOpen] = useState(false)
  const showPercent = useOS((s) => s.settings.showBatteryPercent)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(panelButton, 'gap-2.5')} aria-label="System menu">
        <NetworkIcon className="size-4" />
        <VolumeIcon className="size-4" />
        <BatteryIndicator className="size-4" showPercent={showPercent} />
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} collisionPadding={6} className={shellPopover}>
        <QuickSettings onClose={() => setOpen(false)} />
      </PopoverContent>
    </Popover>
  )
}

export function TopBar() {
  return (
    <header
      className="relative z-[10000] grid h-8 shrink-0 grid-cols-[1fr_auto_1fr] items-center bg-panel px-1 text-panel-fg select-none"
      aria-label="Top bar"
    >
      <div className="flex items-center">
        <ActivitiesButton />
      </div>
      <Clock />
      <div className="flex items-center justify-end">
        <StatusArea />
      </div>
    </header>
  )
}
