import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { appList } from '@/apps/manifest'
import { useIsMobile, useViewportVersion } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import type { AppId } from '@/store/types'
import { AppIcon } from '../icons/AppIcon'

const gridApps = appList.filter((a) => a.inGrid)

function matches(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return gridApps
  return gridApps
    .map((a) => {
      const hay = [a.title, a.description, ...a.keywords].join(' ').toLowerCase()
      const score = a.title.toLowerCase().startsWith(q) ? 0 : a.title.toLowerCase().includes(q) ? 1 : hay.includes(q) ? 2 : 9
      return { a, score }
    })
    .filter((x) => x.score < 9)
    .sort((x, y) => x.score - y.score)
    .map((x) => x.a)
}

export function AppGrid() {
  const open = useOS((s) => s.overviewOpen)
  if (!open) return null
  return <AppGridInner />
}

function AppGridInner() {
  const { setOverview, openApp } = useOS.getState()
  const mobile = useIsMobile()
  useViewportVersion()
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(0)
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([])

  const cols = mobile ? 4 : Math.max(4, Math.min(8, Math.floor((window.innerWidth - 160) / 150)))
  const rows = mobile ? 5 : Math.max(2, Math.min(4, Math.floor((window.innerHeight - 260) / 150)))
  const perPage = cols * rows

  const results = useMemo(() => matches(query), [query])
  const searching = query.trim().length > 0
  const pages = Math.max(1, Math.ceil(results.length / perPage))
  const visible = searching ? results : results.slice(page * perPage, (page + 1) * perPage)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])
  useEffect(() => {
    setActive(0)
    setPage(0)
  }, [query])

  const launch = (id: AppId) => {
    openApp(id)
    setOverview(false)
  }

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (query) setQuery('')
      else setOverview(false)
      return
    }
    if (e.key === 'Enter' && visible[active]) {
      launch(visible[active].id)
      return
    }
    const delta = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols }[e.key]
    if (delta !== undefined && (e.target !== inputRef.current || e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      const next = Math.min(Math.max(active + delta, 0), visible.length - 1)
      setActive(next)
      tileRefs.current[next]?.focus()
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Applications"
      onKeyDown={onKey}
      onWheel={(e) => {
        if (searching) return
        if (e.deltaY > 20) setPage((p) => Math.min(p + 1, pages - 1))
        else if (e.deltaY < -20) setPage((p) => Math.max(p - 1, 0))
      }}
      onClick={(e) => e.target === e.currentTarget && setOverview(false)}
      className="absolute inset-0 z-[9000] flex animate-overview-in flex-col items-center bg-black/45 px-6 pt-8 pb-6 backdrop-blur-2xl backdrop-saturate-150"
    >
      <label className="relative w-full max-w-[340px]">
        <span className="sr-only">Type to search</span>
        <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-white/70" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type to search"
          className="h-10 w-full rounded-full border border-white/10 bg-white/12 pr-4 pl-10 text-[14.5px] text-white placeholder:text-white/65 focus:bg-white/18 focus:outline-none focus-visible:outline-2 focus-visible:outline-brand"
        />
      </label>

      <div
        className="mt-10 grid w-full max-w-[1200px] flex-1 content-start justify-center gap-x-4 gap-y-6"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 132px))` }}
        onClick={(e) => e.target === e.currentTarget && setOverview(false)}
      >
        {visible.map((app, i) => (
          <button
            key={app.id}
            ref={(el) => {
              tileRefs.current[i] = el
            }}
            type="button"
            onClick={() => launch(app.id)}
            onFocus={() => setActive(i)}
            className={cn(
              'group flex flex-col items-center gap-2.5 rounded-[18px] px-2 pt-4 pb-3 text-white transition-colors duration-150',
              'hover:bg-white/12 focus-visible:bg-white/15 focus-visible:outline-none active:bg-white/20',
              searching && i === active && 'bg-white/15',
            )}
          >
            <AppIcon appId={app.id} className="size-16 transition-transform duration-200 ease-out-expo group-hover:-translate-y-1 max-md:size-12" />
            <span className="w-full truncate text-center text-[13.5px] font-semibold [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]">
              {app.title}
            </span>
          </button>
        ))}
        {searching && visible.length === 0 && (
          <p className="col-span-full pt-10 text-center text-[15px] font-semibold text-white/80">
            No results for “{query}”
          </p>
        )}
      </div>

      {!searching && pages > 1 && (
        <div className="mt-4 flex gap-2" role="tablist" aria-label="App pages">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
              onClick={() => setPage(i)}
              className={cn('h-2 rounded-full bg-white transition-all', i === page ? 'w-6' : 'w-2 opacity-40')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
