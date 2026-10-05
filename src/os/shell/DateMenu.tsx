import { useMemo, useState } from 'react'
import { BellSlashIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/20/solid'
import { Switch } from '@/components/ui/switch'
import { useClock } from '@/hooks/useClock'
import { relativeTime } from '@/lib/format'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { AppIcon } from '../icons/AppIcon'

const WEEKDAYS = Array.from({ length: 7 }, (_, i) =>
  new Date(2024, 0, 7 + i).toLocaleDateString(undefined, { weekday: 'narrow' }),
)

function Calendar({ today }: { today: Date }) {
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1)
    const start = new Date(first)
    start.setDate(1 - first.getDay())
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      return d
    })
  }, [cursor])

  const shift = (n: number) => setCursor((c) => new Date(c.getFullYear(), c.getMonth() + n, 1))
  const same = (a: Date, b: Date) => a.toDateString() === b.toDateString()
  const monthLabel = cursor.toLocaleDateString(undefined, {
    month: 'long',
    year: cursor.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  })

  return (
    <div className="rounded-[18px] bg-shell-card p-2">
      <div className="mb-1 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => shift(-1)}
          className="grid size-8 place-items-center rounded-full hover:bg-shell-card-hover"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          className="rounded-full px-3 py-1 text-[13.5px] font-bold hover:bg-shell-card-hover"
        >
          {monthLabel}
        </button>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => shift(1)}
          className="grid size-8 place-items-center rounded-full hover:bg-shell-card-hover"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-[12px]">
        {WEEKDAYS.map((d, i) => (
          <span key={i} className="py-1 font-semibold opacity-60">
            {d}
          </span>
        ))}
        {days.map((d) => {
          const isToday = same(d, today)
          const inMonth = d.getMonth() === cursor.getMonth()
          const weekend = d.getDay() === 0 || d.getDay() === 6
          return (
            <span
              key={d.toISOString()}
              className={cn(
                'tabular mx-auto grid size-8 place-items-center rounded-full text-[13px]',
                isToday && 'bg-brand font-bold text-brand-fg',
                !isToday && !inMonth && 'opacity-35',
                !isToday && inMonth && weekend && 'opacity-70',
              )}
            >
              {d.getDate()}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function Notifications() {
  const notifications = useOS((s) => s.notifications)
  const { removeNotification, openApp } = useOS.getState()
  useClock('minute')

  if (notifications.length === 0) {
    return (
      <div className="grid flex-1 place-items-center text-center opacity-60">
        <div>
          <BellSlashIcon className="mx-auto mb-3 size-12 opacity-60" />
          <p className="text-[15px] font-bold">No Notifications</p>
        </div>
      </div>
    )
  }
  return (
    <ul className="flex max-h-[min(420px,55vh)] min-w-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain pr-1">
      {notifications.map((n) => (
        <li key={n.id} className="group relative">
          <button
            type="button"
            onClick={() => n.appId && openApp(n.appId)}
            className="flex w-full min-w-0 gap-3 rounded-[18px] bg-shell-card p-3 pr-9 text-left break-words transition-colors hover:bg-shell-card-hover"
          >
            {n.appId && <AppIcon appId={n.appId} className="size-8 shrink-0" />}
            <span className="min-w-0 flex-1">
              <span className="flex items-baseline justify-between gap-2">
                <span className="truncate text-[13.5px] font-bold">{n.title}</span>
                <span className="shrink-0 text-[11.5px] opacity-60">{relativeTime(n.time)}</span>
              </span>
              {n.body && <span className="mt-0.5 line-clamp-2 block text-[13px] opacity-80">{n.body}</span>}
            </span>
          </button>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={() => removeNotification(n.id)}
            className="absolute top-2 right-2 grid size-6 place-items-center rounded-full bg-shell opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          >
            <XMarkIcon className="size-3.5" />
          </button>
        </li>
      ))}
    </ul>
  )
}

export function DateMenu() {
  const now = useClock('minute')
  const dnd = useOS((s) => s.system.dnd)
  const count = useOS((s) => s.notifications.length)
  const { setSystem, clearNotifications } = useOS.getState()

  return (
    <div className="flex w-[680px] max-w-[calc(100vw-48px)] gap-3 text-shell-fg max-md:flex-col-reverse">
      <section aria-label="Notifications" className="flex min-h-[380px] min-w-0 flex-1 flex-col gap-3 max-md:min-h-[200px]">
        <Notifications />
        <div className="flex items-center justify-between gap-3 border-t border-fg/10 pt-3">
          <label className="flex items-center gap-3 text-[13.5px] font-semibold">
            Do Not Disturb
            <Switch checked={dnd} onCheckedChange={(v) => setSystem({ dnd: v })} />
          </label>
          <button
            type="button"
            disabled={count === 0}
            onClick={clearNotifications}
            className="h-9 rounded-full bg-shell-card px-4 text-[13.5px] font-semibold transition-colors hover:bg-shell-card-hover disabled:opacity-40"
          >
            Clear
          </button>
        </div>
      </section>
      <div className="w-px bg-fg/10 max-md:hidden" />
      <section aria-label="Calendar" className="flex w-[300px] flex-col gap-3 max-md:w-full">
        <div className="px-2">
          <p className="text-[13.5px] font-semibold opacity-75">
            {now.toLocaleDateString(undefined, { weekday: 'long' })}
          </p>
          <p className="text-[19px] font-bold">
            {now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <Calendar today={now} />
        <div className="rounded-[18px] bg-shell-card px-4 py-3">
          <p className="text-[13.5px] font-bold">Today</p>
          <p className="text-[13px] opacity-70">No events</p>
        </div>
      </section>
    </div>
  )
}
