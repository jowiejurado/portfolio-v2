import { useMemo, useState, type KeyboardEvent } from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'
import { GroupTitle } from '../_ui'

export interface Day {
  date: string
  count: number
  /** GitHub's own 0–4 intensity bucket */
  level: number
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const CELL = 10
const GAP = 2.5
const PITCH = CELL + GAP

/** Level 0 is a quiet neutral; 1–4 come from the accent-derived scale in index.css. */
const LEVEL_FILL = ['var(--gh-0)', 'var(--gh-1)', 'var(--gh-2)', 'var(--gh-3)', 'var(--gh-4)']
/** Dots also grow with the level, so the scale reads without relying on colour alone. */
const LEVEL_R = [1.7, 3, 3.75, 4.4, 5]

/** The past year of contributions from github-contributions-api.jogruber.de (CORS-enabled, no token). */
export async function loadContributions(username: string): Promise<Day[]> {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`)
  if (!res.ok) throw new Error('Contribution history is unavailable right now.')
  const json = (await res.json()) as { contributions: Day[] }
  return json.contributions.map(({ date, count, level }) => ({ date, count, level })).sort((a, b) => (a.date < b.date ? -1 : 1))
}

function parse(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** GitHub's contribution calendar: weeks as columns, Sunday on top. */
export function Contributions({ days, login, profileUrl }: { days: Day[]; login: string; profileUrl: string }) {
  const [active, setActive] = useState<number | null>(null)

  const lead = days.length ? parse(days[0].date).getDay() : 0
  const cols = Math.ceil((lead + days.length) / 7)
  const total = days.reduce((n, d) => n + d.count, 0)
  const width = cols * PITCH - GAP
  const height = 7 * PITCH - GAP

  // label a month above the first column that starts inside it, as GitHub does
  const months = useMemo(() => {
    const out: { col: number; label: string }[] = []
    let last = -1
    for (let col = 0; col < cols; col++) {
      const i = Math.max(0, col * 7 - lead)
      const m = parse(days[i]?.date ?? days[0].date).getMonth()
      if (m !== last) {
        if (col > 0 || lead === 0) out.push({ col, label: MONTHS[m] })
        last = m
      }
    }
    // drop a label squeezed against the next one
    // and one too close to the right edge to fit
    return out.filter((m, k) => (!out[k + 1] || out[k + 1].col - m.col >= 3) && m.col <= cols - 3)
  }, [days, cols, lead])

  const onKey = (e: KeyboardEvent) => {
    const delta = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 }[e.key]
    if (e.key === 'Home') setActive(0)
    else if (e.key === 'End') setActive(days.length - 1)
    else if (delta) setActive((a) => (a === null ? days.length - 1 : Math.min(days.length - 1, Math.max(0, a + delta))))
    else return
    e.preventDefault()
  }

  const hovered = active === null ? null : days[active]

  return (
    <section className="mt-8">
      <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
        <GroupTitle className="mb-0">
          {total.toLocaleString()} contributions <span className="font-semibold text-fg-dim">in the last year</span>
        </GroupTitle>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-[12.5px] font-semibold text-fg-dim hover:text-fg"
        >
          @{login} <ArrowTopRightOnSquareIcon className="size-3" />
        </a>
      </div>

      <div className="rounded-xl bg-view px-4 pt-3 pb-3 shadow-[0_0_0_1px_var(--line),0_1px_3px_rgb(0_0_0/0.05)] max-md:px-3">
        <div className="flex gap-2">
          {/* weekday labels, Mon / Wed / Fri like GitHub; HTML so they stay legible at any width */}
          <div aria-hidden className="flex w-[26px] shrink-0 flex-col pt-[18px] text-[10.5px] leading-none font-semibold text-fg-dim">
            {/* absolutely placed against the grid's own rows, so they track it as it scales */}
            <div className="relative flex-1">
              {[1, 3, 5].map((row) => (
                <span key={row} className={cn('absolute left-0 -translate-y-1/2', row === 3 && 'max-sm:hidden')} style={{ top: `${((row * PITCH + CELL / 2) / height) * 100}%` }}>
                  {['', 'Mon', '', 'Wed', '', 'Fri'][row]}
                </span>
              ))}
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div aria-hidden className="relative mb-1 h-[14px] text-[10.5px] leading-none font-semibold text-fg-dim">
              {months.map((m, k) => (
                <span
                  key={m.col}
                  className={cn('absolute top-0 whitespace-nowrap', k % 2 === 1 && 'max-sm:hidden')}
                  style={{ left: `${((m.col * PITCH) / width) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="block w-full outline-offset-4"
              role="img"
              aria-label={`${total} contributions in the last year. Use arrow keys to read individual days.`}
              tabIndex={0}
              onKeyDown={onKey}
              onBlur={() => setActive(null)}
              onPointerLeave={() => setActive(null)}
            >
              {days.map((d, i) => {
                const slot = lead + i
                const on = active === i
                const level = Math.min(4, Math.max(0, d.level))
                return (
                  <g key={d.date} className="gh-cell" style={{ ['--c' as string]: Math.floor(slot / 7) }} onPointerEnter={() => setActive(i)}>
                    {/* full-cell hit target: tiny dots still hover easily */}
                    <rect x={Math.floor(slot / 7) * PITCH} y={(slot % 7) * PITCH} width={PITCH} height={PITCH} fill="transparent" />
                    <circle
                      cx={Math.floor(slot / 7) * PITCH + CELL / 2}
                      cy={(slot % 7) * PITCH + CELL / 2}
                      r={LEVEL_R[level]}
                      fill={LEVEL_FILL[level]}
                      stroke={on ? 'var(--fg)' : 'none'}
                      strokeWidth={1.1}
                    />
                  </g>
                )
              })}
            </svg>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-[12px] text-fg-dim">
          <p aria-live="polite" className="tabular min-h-[18px]">
            {hovered ? (
              <>
                <span className="font-bold text-fg">
                  {hovered.count === 0 ? 'No' : hovered.count} {hovered.count === 1 ? 'contribution' : 'contributions'}
                </span>{' '}
                on {parse(hovered.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
              </>
            ) : (
              <>Hover a day to see its count</>
            )}
          </p>
          <div className="flex items-center gap-1.5" aria-hidden>
            Less
            <svg viewBox="0 0 58 10" className="h-[10px] w-[58px]">
              {LEVEL_FILL.map((fill, i) => (
                <circle key={i} cx={5 + i * 12} cy={5} r={LEVEL_R[i]} fill={fill} />
              ))}
            </svg>
            More
          </div>
        </div>
      </div>
    </section>
  )
}
