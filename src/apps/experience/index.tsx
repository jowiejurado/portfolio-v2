import { experience } from '@/content/experience'
import { cn } from '@/lib/utils'
import type { AppComponentProps } from '../registry'
import { Clamp, PlaceholderNote, Tag } from '../_ui'

export default function Experience(_: AppComponentProps) {
  const anyPlaceholder = experience.some((r) => r.placeholder)
  return (
    <div className="h-full bg-window">
      <Clamp width={720} className="pb-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.02em]">Experience</h1>
            <p className="mt-1 text-[15px] text-fg-dim">
              {experience.length} roles · {experience.at(-1)?.start}–{experience[0]?.end}
            </p>
          </div>
          {anyPlaceholder && <PlaceholderNote>Sample entries — replace in src/content/experience.ts</PlaceholderNote>}
        </div>

        <ol className="relative">
          {experience.map((r, i) => {
            const current = r.end.toLowerCase() === 'present'
            return (
              <li key={r.company + r.start} className="grid grid-cols-[88px_24px_1fr] gap-x-3 max-md:grid-cols-[20px_1fr]">
                <p className="tabular pt-0.5 text-right text-[13.5px] font-semibold text-fg-dim max-md:hidden">
                  {r.start}
                  <br />
                  <span className="font-normal">{r.end}</span>
                </p>
                <div className="relative flex justify-center">
                  {i < experience.length - 1 && <span className="absolute top-5 bottom-0 w-px bg-line" />}
                  <span
                    className={cn(
                      'relative mt-1.5 size-3.5 rounded-full border-[3px]',
                      current ? 'border-brand bg-brand shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_22%,transparent)]' : 'border-fg/30 bg-window',
                    )}
                  />
                </div>
                <div className="pb-9">
                  <p className="tabular mb-1 text-[13px] font-semibold text-fg-dim md:hidden">
                    {r.start} – {r.end}
                  </p>
                  <h2 className="text-[17px] leading-snug font-bold">{r.title}</h2>
                  <p className="text-[14.5px]">
                    <span className="font-semibold">{r.company}</span>
                    <span className="text-fg-dim"> · {r.location}</span>
                  </p>
                  <p className="mt-2.5 max-w-[62ch] text-[15px] leading-relaxed">{r.summary}</p>
                  <ul className="mt-2 space-y-1">
                    {r.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-[14.5px] leading-relaxed text-fg/85">
                        <span className="mt-[9px] h-px w-2.5 shrink-0 bg-fg/40" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {r.stack.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {r.stack.map((s) => (
                        <Tag key={s}>{s}</Tag>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </Clamp>
    </div>
  )
}
