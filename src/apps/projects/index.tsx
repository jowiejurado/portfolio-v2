import { useEffect, useState, type KeyboardEvent } from 'react'
import { ArrowTopRightOnSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { projectGroups, projects, type Project } from '@/content/projects'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { HeaderBar } from '@/os/window/WindowContext'
import type { AppComponentProps } from '../registry'
import { BoxedList, Button, Clamp, GroupTitle, HeaderButton, PlaceholderNote, Row, Tag } from '../_ui'

/*
 * Laid out like Ubuntu's App Center: a featured banner, grouped lists of
 * entries, and a detail page per project with a screenshot carousel.
 */

const shot = (p: Project, n: number, thumb = false) => `/projects/${p.slug}/${n}${thumb ? '-thumb' : ''}.webp`

/** The site's favicon, or a tinted monogram when the project has none. */
function ProjectIcon({ p, size = 48 }: { p: Project; size?: number }) {
  if (p.icon) {
    return (
      <img
        src={p.icon}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="shrink-0 object-contain drop-shadow-[0_1px_2px_rgb(0_0_0/0.18)]"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      aria-hidden
      className="grid shrink-0 place-items-center rounded-[22%] font-bold text-white shadow-[0_2px_6px_rgb(0_0_0/0.2)]"
      style={{ background: p.tint, width: size, height: size, fontSize: size * 0.42 }}
    >
      {p.name
        .split(/\s+/)
        .filter((w) => /\w/.test(w))
        .map((w) => w[0])
        .join('')
        .slice(0, 2)}
    </span>
  )
}

const AUTOPLAY_MS = 6000
/** live client sites with screenshots rotate through the banner */
const featured = projects.filter((p) => p.shots && p.links.length)

/**
 * Featured banner carousel. Slides share one grid cell so the banner keeps
 * the height of its tallest slide and slides crossfade in place; the tint
 * gradient fades with them.
 */
function FeaturedCarousel({ items, onOpen }: { items: Project[]; onOpen: (p: Project) => void }) {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const count = items.length
  const go = (d: number) => setI((n) => (n + d + count) % count)

  useEffect(() => {
    if (paused || reduced || count < 2) return
    const t = setTimeout(() => setI((n) => (n + 1) % count), AUTOPLAY_MS)
    return () => clearTimeout(t)
  }, [i, paused, reduced, count])

  if (!count) return null
  const ctrl =
    'grid size-8 place-items-center rounded-full bg-black/25 text-white transition-colors hover:bg-black/40 focus-visible:outline-2 focus-visible:outline-white [&>svg]:size-[18px]'

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured projects"
      className="relative grid overflow-hidden rounded-2xl text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') (e.preventDefault(), go(-1))
        if (e.key === 'ArrowRight') (e.preventDefault(), go(1))
      }}
    >
      {items.map((p, n) => {
        const active = n === i
        return (
          <button
            key={p.slug}
            type="button"
            onClick={() => onOpen(p)}
            aria-hidden={!active}
            tabIndex={active ? 0 : -1}
            aria-roledescription="slide"
            aria-label={`${p.name}, ${n + 1} of ${count}`}
            className={cn(
              'group relative col-start-1 row-start-1 block w-full overflow-hidden p-8 pb-16 text-left transition-opacity duration-700 ease-out motion-reduce:transition-none max-md:p-6 max-md:pb-16',
              active ? 'opacity-100' : 'pointer-events-none opacity-0',
            )}
            style={{ background: `linear-gradient(120deg, ${p.tint}, color-mix(in oklab, ${p.tint} 55%, black))` }}
          >
            <span aria-hidden className="absolute -top-16 -right-10 size-72 rounded-full border-[28px] border-white/10" />
            {p.shots ? (
              <img
                src={shot(p, 1, true)}
                alt=""
                decoding="async"
                className={cn(
                  'absolute top-8 -right-16 w-[46%] rounded-lg shadow-[0_18px_40px_-8px_rgb(0_0_0/0.55)] ring-1 ring-white/20 transition-transform duration-700 ease-out group-hover:-translate-y-1 motion-reduce:transition-none max-md:hidden',
                  active ? 'translate-x-0 rotate-[-4deg]' : 'translate-x-6 rotate-[-2deg]',
                )}
              />
            ) : (
              <span aria-hidden className="absolute -right-24 -bottom-28 size-80 rounded-full border-[18px] border-white/[0.07]" />
            )}
            <span className="relative block max-w-[55%] text-[clamp(28px,4vw,40px)] leading-none font-bold tracking-[-0.03em] max-md:max-w-none">
              {p.name}
            </span>
            <span className="relative mt-3 block max-w-[38ch] text-[15px] leading-relaxed opacity-90">{p.tagline}</span>
            <span className="relative mt-6 inline-flex h-9 items-center gap-1 rounded-lg bg-white/20 px-4 text-[14px] font-bold transition-colors group-hover:bg-white/30">
              View project <ChevronRightIcon className="size-4" />
            </span>
            <span className="tabular relative mt-4 block text-[13.5px] font-semibold opacity-80">
              {p.year} · {p.stack.slice(0, 3).join(', ')}
            </span>
          </button>
        )
      })}

      {count > 1 && (
        <div className="absolute right-5 bottom-5 flex items-center gap-2 max-md:right-auto max-md:left-6">
          <button type="button" aria-label="Previous featured project" onClick={() => go(-1)} className={ctrl}>
            <ChevronLeftIcon />
          </button>
          <div className="flex items-center gap-1.5 px-1">
            {items.map((p, n) => (
              <button
                key={p.slug}
                type="button"
                aria-label={`Show ${p.name}`}
                aria-current={n === i}
                onClick={() => setI(n)}
                className="grid h-6 place-items-center"
              >
                <span
                  className={cn(
                    'block h-1.5 rounded-full transition-[width,background-color] duration-300',
                    n === i ? 'w-5 bg-white' : 'w-1.5 bg-white/45 hover:bg-white/70',
                  )}
                />
              </button>
            ))}
          </div>
          <button type="button" aria-label="Next featured project" onClick={() => go(1)} className={ctrl}>
            <ChevronRightIcon />
          </button>
        </div>
      )}
    </section>
  )
}

/** App Center-style screenshot carousel: one large frame plus a thumbnail strip. */
function Gallery({ p }: { p: Project }) {
  const count = p.shots ?? 0
  const [i, setI] = useState(0)
  if (!count) return null
  const go = (d: number) => setI((n) => (n + d + count) % count)
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') (e.preventDefault(), go(-1))
    if (e.key === 'ArrowRight') (e.preventDefault(), go(1))
  }
  const nav =
    'absolute top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-black/70 max-md:opacity-100 [&>svg]:size-5'

  return (
    <section aria-roledescription="carousel" aria-label={`${p.name} screenshots`} className="mt-8" onKeyDown={onKey}>
      <div className="group relative overflow-hidden rounded-xl bg-fg/[0.05] shadow-[0_0_0_1px_var(--line),0_4px_14px_-6px_rgb(0_0_0/0.25)]">
        <img
          key={i}
          src={shot(p, i + 1)}
          alt={`${p.name} screenshot ${i + 1} of ${count}`}
          decoding="async"
          className="aspect-[2/1] w-full animate-in object-contain duration-300 fade-in motion-reduce:animate-none"
        />
        {count > 1 && (
          <>
            <button type="button" aria-label="Previous screenshot" onClick={() => go(-1)} className={cn(nav, 'left-3')}>
              <ChevronLeftIcon />
            </button>
            <button type="button" aria-label="Next screenshot" onClick={() => go(1)} className={cn(nav, 'right-3')}>
              <ChevronRightIcon />
            </button>
            <span className="tabular absolute right-3 bottom-3 rounded-full bg-black/55 px-2.5 py-0.5 text-[12px] font-semibold text-white">
              {i + 1} / {count}
            </span>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pt-1 pb-2">
          {Array.from({ length: count }, (_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Show screenshot ${n + 1}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className={cn(
                'w-[104px] shrink-0 overflow-hidden rounded-md transition-[opacity,box-shadow] duration-150',
                n === i ? 'shadow-[0_0_0_2px_var(--brand)]' : 'opacity-55 shadow-[0_0_0_1px_var(--line)] hover:opacity-90',
              )}
            >
              <img src={shot(p, n + 1, true)} alt="" loading="lazy" decoding="async" className="aspect-[2/1] w-full bg-fg/[0.05] object-cover object-top" />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function Detail({ p }: { p: Project }) {
  return (
    <Clamp width={760} className="pb-10">
      <header className="flex items-center gap-5 pt-2 max-md:flex-col max-md:items-start">
        <ProjectIcon p={p} size={96} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] leading-tight font-bold tracking-[-0.02em]">{p.name}</h1>
          <p className="mt-1 text-[15px] text-fg-dim">{p.tagline}</p>
          {p.placeholder && <div className="mt-2"><PlaceholderNote>Sample entry — replace in src/content/projects.ts</PlaceholderNote></div>}
        </div>
        <div className="flex gap-2">
          {p.links.length ? (
            p.links.map((l, i) => (
              <Button key={l.href} variant={i === 0 ? 'suggested' : 'default'} onClick={() => window.open(l.href, '_blank', 'noopener')}>
                {l.label} <ArrowTopRightOnSquareIcon />
              </Button>
            ))
          ) : (
            <Button disabled>{p.company === 'Personal' ? 'Links coming soon' : 'Internal system'}</Button>
          )}
        </div>
      </header>

      <Gallery p={p} />

      <div className="mt-8 grid grid-cols-3 divide-x divide-line rounded-xl bg-view text-center shadow-[0_0_0_1px_var(--line)] max-md:grid-cols-1 max-md:divide-x-0 max-md:divide-y">
        {[
          ['Year', p.year],
          ['Company', p.company],
          ['Role', p.role],
        ].map(([k, v]) => (
          <div key={k} className="px-4 py-3">
            <p className="text-[12.5px] font-semibold text-fg-dim">{k}</p>
            <p className="mt-0.5 text-[14.5px] font-bold">{v}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <p className="max-w-[65ch] text-[15.5px] leading-[1.7]">{p.summary}</p>
        {p.highlights.length > 0 && (
          <ul className="mt-4 space-y-2">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="mt-[9px] size-1.5 shrink-0 rounded-full" style={{ background: p.tint }} />
                {h}
              </li>
            ))}
          </ul>
        )}
      </section>

      {p.stack.length > 0 && (
        <section className="mt-8">
          <GroupTitle>Built with</GroupTitle>
          <div className="flex flex-wrap gap-1.5">
            {p.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </div>
        </section>
      )}
    </Clamp>
  )
}

export default function Projects(_: AppComponentProps) {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <div className="h-full bg-window">
      <HeaderBar
        start={
          open ? (
            <HeaderButton aria-label="Back to all projects" onClick={() => setOpen(null)}>
              <ChevronLeftIcon />
            </HeaderButton>
          ) : undefined
        }
        title={<span className="truncate text-[14px] font-bold">{open ? open.name : 'Projects'}</span>}
      />
      {open ? (
        <Detail key={open.slug} p={open} />
      ) : (
        <Clamp width={860} className="pb-10">
          <FeaturedCarousel items={featured} onOpen={setOpen} />
          {projectGroups.map((group) => {
            const items = projects.filter((p) => p.company === group)
            if (!items.length) return null
            return (
              <section key={group}>
                <GroupTitle className="mt-8 flex items-baseline justify-between">
                  {group === 'Personal' ? 'Personal projects' : group}
                  <span className="tabular text-[13px] font-semibold text-fg-dim">{items.length}</span>
                </GroupTitle>
                <BoxedList>
                  {items.map((p) => (
                    <Row
                      key={p.slug}
                      onClick={() => setOpen(p)}
                      prefix={<ProjectIcon p={p} size={40} />}
                      title={
                        <span className="flex items-center gap-2">
                          {p.name}
                          {p.placeholder && <span className="text-[11.5px] font-semibold text-fg-dim">(sample)</span>}
                        </span>
                      }
                      subtitle={p.tagline}
                      suffix={
                        <span className="flex items-center gap-3 text-[13px] text-fg-dim">
                          <span className="tabular max-md:hidden">{p.year}</span>
                          <ChevronRightIcon className="size-4" />
                        </span>
                      }
                    />
                  ))}
                </BoxedList>
              </section>
            )
          })}
        </Clamp>
      )}
    </div>
  )
}
