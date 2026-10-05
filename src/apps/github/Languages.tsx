import { useState } from 'react'
import { cn } from '@/lib/utils'
import { GroupTitle } from '../_ui'

/** GitHub's linguist colours for the languages most likely to appear. */
const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  PHP: '#4f5d95',
  Python: '#3572a5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  SCSS: '#c6538c',
  Vue: '#41b883',
  Go: '#00add8',
  Rust: '#dea584',
  Java: '#b07219',
  'C#': '#178600',
  Shell: '#89e051',
  Dart: '#00b4ab',
  // linguist's Blade red (#f7523f) is indistinguishable from HTML's; amber keeps them apart
  Blade: '#e3a03a',
}
const OTHER = '#8a8a8a'
const MIN_SHARE = 0.04 // anything smaller folds into "Other"

/** Language → bytes, per repository (GitHub's /languages endpoint). */
export type RepoLanguages = Record<string, number>[]

/**
 * Each repository counts once: its byte split is normalised before averaging,
 * so one large project cannot drown out the rest.
 */
export function languageShares(repos: RepoLanguages) {
  const sums: Record<string, number> = {}
  const counted = repos.filter((r) => Object.keys(r).length)
  for (const r of counted) {
    const bytes = Object.values(r).reduce((a, b) => a + b, 0)
    for (const [lang, n] of Object.entries(r)) sums[lang] = (sums[lang] ?? 0) + n / bytes
  }
  const all = Object.entries(sums)
    .map(([lang, s]) => ({ lang, share: s / Math.max(1, counted.length) }))
    .sort((a, b) => b.share - a.share)
  const main = all.filter((l) => l.share >= MIN_SHARE)
  const rest = all.filter((l) => l.share < MIN_SHARE)
  const other = rest.reduce((n, l) => n + l.share, 0)
  return {
    repos: counted.length,
    shares: other > 0 ? [...main, { lang: 'Other', share: other, members: rest.map((l) => l.lang) }] : main,
  }
}

/** Splits 100 dots by share with largest-remainder rounding, so the grid always fills exactly. */
function toDots(shares: { share: number }[]) {
  const raw = shares.map((s) => s.share * 100)
  const counts = raw.map(Math.floor)
  const order = raw.map((r, i) => [r - Math.floor(r), i] as const).sort((a, b) => b[0] - a[0])
  const missing = 100 - counts.reduce((a, b) => a + b, 0)
  for (let k = 0; k < missing; k++) counts[order[k % order.length][1]]++
  return counts.flatMap((n, i) => Array<number>(n).fill(i))
}

/**
 * Languages as a 10 × 10 dot matrix, one dot per percent, in the same dot
 * language as the contribution calendar. Hovering a language lights its dots.
 */
export function Languages({ repos }: { repos: RepoLanguages }) {
  const [active, setActive] = useState<number | null>(null)
  const { shares, repos: n } = languageShares(repos)
  if (!shares.length) return null
  const dots = toDots(shares)
  const colorOf = (i: number) => LANG_COLORS[shares[i].lang] ?? OTHER

  return (
    <section className="mt-8">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 px-1">
        <GroupTitle className="mb-0">Languages</GroupTitle>
        <span className="text-[12.5px] font-semibold text-fg-dim">
          across {n} public {n === 1 ? 'repository' : 'repositories'}
        </span>
      </div>

      <div
        className="flex items-center gap-6 rounded-xl bg-view p-4 shadow-[0_0_0_1px_var(--line),0_1px_3px_rgb(0_0_0/0.05)] max-sm:gap-4 max-sm:p-3"
        onPointerLeave={() => setActive(null)}
      >
        <svg viewBox="0 0 100 100" className="w-[132px] shrink-0 max-sm:w-[112px]" role="img" aria-label="Share of code by language, one dot per percent">
          {dots.map((lang, k) => (
            <circle
              key={k}
              cx={(k % 10) * 10 + 5}
              cy={Math.floor(k / 10) * 10 + 5}
              r={active === lang ? 4.4 : 3.6}
              className="gh-lang gh-dot transition-[r,opacity] duration-200"
              style={{ ['--lang' as string]: colorOf(lang), ['--k' as string]: k, opacity: active !== null && active !== lang ? 0.22 : 1 }}
              onPointerEnter={() => setActive(lang)}
            />
          ))}
        </svg>

        <ul className="grid min-w-0 flex-1 grid-cols-2 gap-x-5 gap-y-1 max-md:grid-cols-1">
          {shares.map((s, i) => {
            const members = 'members' in s ? s.members : undefined
            return (
              <li
                key={s.lang}
                title={members?.join(', ')}
                onPointerEnter={() => setActive(i)}
                className={cn(
                  'flex items-center gap-2 rounded-md px-1.5 py-1 text-[13.5px] transition-opacity',
                  active !== null && active !== i && 'opacity-45',
                )}
              >
                <svg viewBox="0 0 10 10" className="size-2.5 shrink-0" aria-hidden>
                  <circle cx={5} cy={5} r={5} className="gh-lang" style={{ ['--lang' as string]: colorOf(i) }} />
                </svg>
                <span className="min-w-0 truncate font-semibold">{s.lang}</span>
                <span className="tabular ml-auto pl-2 font-bold">
                  {Math.round(s.share * 100)}
                  <span className="text-[11px] font-semibold text-fg-dim">%</span>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
