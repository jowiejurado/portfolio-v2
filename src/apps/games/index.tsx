import type { ReactNode } from 'react'
import { useOS } from '@/store/useOS'
import type { AppComponentProps } from '../registry'
import { Clamp } from '../_ui'
import { BounceCover, PinballCover, SpaceImpactCover, TetrisCover } from './covers'

const GAMES: { id: string; title: string; blurb: string; cover: ReactNode }[] = [
  { id: 'bounce', title: 'Bounce', blurb: 'Roll the red ball through every ring', cover: <BounceCover /> },
  { id: 'space-impact', title: 'Space Impact', blurb: 'Blast through waves of alien ships', cover: <SpaceImpactCover /> },
  { id: 'tetris', title: 'Tetris', blurb: 'Stack falling blocks and clear lines', cover: <TetrisCover /> },
  { id: 'pinball', title: '3D Pinball Space Cadet', blurb: 'Keep the ball in play and rank up', cover: <PinballCover /> },
]

export default function Games(_: AppComponentProps) {
  const notify = useOS((s) => s.notify)
  return (
    <div className="h-full bg-window">
      <Clamp width={820} className="pb-10">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Games</h1>
        <p className="mt-1 text-[15px] text-fg-dim">Small games built from scratch. They arrive in the next update.</p>
        <ul className="mt-7 grid grid-cols-2 gap-5 max-md:grid-cols-1">
          {GAMES.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => notify({ title: `${g.title} is on its way`, body: 'This game ships in the next update.', appId: 'games' })}
                className="group block w-full text-left"
              >
                <span className="block aspect-[4/3] overflow-hidden rounded-xl shadow-[0_0_0_1px_var(--line),0_4px_14px_-6px_rgb(0_0_0/0.35)] transition-[translate,box-shadow] duration-200 ease-out-expo group-hover:-translate-y-0.5 group-hover:shadow-[0_0_0_1px_var(--line),0_10px_24px_-8px_rgb(0_0_0/0.4)]">
                  {g.cover}
                </span>
                <span className="mt-3 flex items-center justify-between gap-2">
                  <span className="text-[15.5px] font-bold">{g.title}</span>
                  <span className="shrink-0 rounded-full bg-fg/[0.08] px-2.5 py-0.5 text-[12px] font-semibold text-fg-dim">Coming soon</span>
                </span>
                <span className="mt-0.5 block text-[13.5px] text-fg-dim">{g.blurb}</span>
              </button>
            </li>
          ))}
        </ul>
      </Clamp>
    </div>
  )
}
