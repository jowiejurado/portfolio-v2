import { useEffect, useState, type ReactNode } from 'react'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { profile } from '@/content/profile'
import { useIsDark } from '@/hooks/useThemeEffect'
import { cn } from '@/lib/utils'
import { AppIcon } from '@/os/icons/AppIcon'
import { ShowAppsGlyph } from '@/os/icons/glyphs'
import { ACCENTS } from '@/os/theme'
import { HeaderBar, useWindow } from '@/os/window/WindowContext'
import { useOS } from '@/store/useOS'
import type { AccentId, AppId } from '@/store/types'
import { Button, StylePreview } from '../_ui'

function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded-md border border-line bg-view px-1.5 font-sans text-[12px] font-bold shadow-[0_1px_0_var(--line)]">
      {children}
    </kbd>
  )
}

function Hello() {
  return (
    <div className="flex h-full flex-col justify-center px-12 max-md:px-6 max-md:py-6">
      <p className="text-[16px] font-semibold text-fg-dim">Hi, welcome. I'm</p>
      <h1 className="mt-1 text-[clamp(32px,5vw,52px)] leading-[1.02] tracking-[-0.03em] text-balance text-fg">
        <span className="font-bold">{profile.name}</span>
      </h1>
      <p className="mt-5 max-w-[48ch] text-[16px] leading-relaxed text-fg-dim">
        {profile.role}{profile.location && ` based in ${profile.location}`}. This desktop is my portfolio, and every app on it
        tells part of my story.
      </p>
      {profile.availability && (
        <p className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-brand/12 px-3 py-1 text-[13px] font-semibold text-fg">
          <span className="size-2 rounded-full bg-brand" />
          {profile.availability}
        </p>
      )}
    </div>
  )
}

function Tour() {
  const tips: [ReactNode, string, ReactNode][] = [
    [<span className="flex gap-[3px]"><span className="h-[6px] w-4 rounded-full bg-current" /><span className="size-[6px] rounded-full bg-current/50" /></span>, 'Activities', <>Click top-left or tap <Kbd>Super</Kbd> to search every app.</>],
    [<AppIcon appId="projects" className="size-8" />, 'The Dock', 'My portfolio apps live on the left. Right-click one to pin it.'],
    [<ShowAppsGlyph className="size-4" />, 'Show Apps', 'The grid at the bottom of the dock lists everything installed.'],
    [<AppIcon appId="terminal" className="size-8" />, 'Terminal', <>Press <Kbd>Ctrl</Kbd> <Kbd>Alt</Kbd> <Kbd>T</Kbd> and try <code className="font-mono font-bold text-brand">neofetch</code>.</>],
  ]
  return (
    <div className="h-full overflow-y-auto px-12 py-8 max-md:px-6">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Find your way around</h1>
      <p className="mt-1.5 text-[15px] text-fg-dim">It works like Ubuntu. Windows drag, snap to the edges, and minimize to the dock.</p>
      <ul className="mt-7 grid grid-cols-2 gap-x-8 gap-y-6 max-md:grid-cols-1">
        {tips.map(([icon, title, body]) => (
          <li key={title} className="flex gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-fg/[0.07] text-fg">{icon}</span>
            <span>
              <span className="block text-[15px] font-bold">{title}</span>
              <span className="mt-0.5 block text-[14px] leading-relaxed text-fg-dim">{body}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Personalize() {
  const dark = useIsDark()
  const accent = useOS((s) => s.settings.accent)
  const set = useOS((s) => s.setSettings)
  return (
    <div className="h-full overflow-y-auto px-12 py-8 max-md:px-6">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Make it yours</h1>
      <p className="mt-1.5 text-[15px] text-fg-dim">Changes apply instantly. Watch the wallpaper behind this window.</p>
      <div className="mt-7 grid grid-cols-2 gap-4">
        {[false, true].map((d) => (
          <button
            key={String(d)}
            type="button"
            aria-pressed={dark === d}
            onClick={() => set({ theme: d ? 'dark' : 'light' })}
            className="group flex flex-col items-center gap-2"
          >
            <span
              className={cn(
                'block w-full rounded-xl p-1 ring-2 transition-[box-shadow]',
                dark === d ? 'ring-brand' : 'ring-transparent group-hover:ring-fg/15',
              )}
            >
              <StylePreview dark={d} />
            </span>
            <span className="text-[14px] font-semibold">{d ? 'Dark' : 'Light'}</span>
          </button>
        ))}
      </div>
      <p className="mt-7 mb-3 text-[14px] font-bold">Accent color</p>
      <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Accent color">
        {(Object.keys(ACCENTS) as AccentId[]).map((id) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={accent === id}
            aria-label={ACCENTS[id].label}
            title={ACCENTS[id].label}
            onClick={() => set({ accent: id })}
            className={cn(
              'size-10 rounded-full ring-offset-[3px] ring-offset-window transition-[scale,box-shadow] hover:scale-105',
              accent === id && 'ring-2 ring-[var(--c)]',
            )}
            style={{ backgroundColor: ACCENTS[id].color, ['--c' as string]: ACCENTS[id].color }}
          />
        ))}
      </div>
    </div>
  )
}

function Next({ onPick }: { onPick: (id: AppId) => void }) {
  const picks: { id: AppId; title: string; body: string }[] = [
    { id: 'about', title: 'About Me', body: 'Background, skills and what I care about' },
    { id: 'projects', title: 'Projects', body: 'Selected work, with the story behind each one' },
    { id: 'experience', title: 'Experience', body: 'Roles, teams and timelines' },
    { id: 'contact', title: 'Contact Me', body: 'Start a conversation' },
  ]
  return (
    <div className="h-full overflow-y-auto px-12 py-8 max-md:px-6">
      <h1 className="text-[28px] font-bold tracking-[-0.02em]">Where to next?</h1>
      <p className="mt-1.5 text-[15px] text-fg-dim">Pick a place to start. You can always come back from the dock.</p>
      <div className="mt-6 divide-y divide-line overflow-hidden rounded-xl bg-view shadow-[0_0_0_1px_var(--line)]">
        {picks.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onPick(p.id)}
            className="flex w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-hover"
          >
            <AppIcon appId={p.id} className="size-8" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-bold">{p.title}</span>
              <span className="block text-[13.5px] text-fg-dim">{p.body}</span>
            </span>
            <ChevronRightIcon className="size-5 text-fg-dim" />
          </button>
        ))}
      </div>
    </div>
  )
}

const STEPS = ['Welcome', 'Tour', 'Personalize', 'Start'] as const

export default function Welcome() {
  const { windowId } = useWindow()
  const [step, setStep] = useState(0)
  const { setSettings, closeWindow, openApp } = useOS.getState()

  // Seeing the tour once is enough; closing early also counts.
  useEffect(() => () => setSettings({ welcomed: true }), [setSettings])

  const finish = (then?: AppId) => {
    setSettings({ welcomed: true })
    closeWindow(windowId)
    if (then) openApp(then)
  }
  const last = step === STEPS.length - 1

  return (
    <div className="flex h-full flex-col bg-window">
      <HeaderBar
        start={step > 0 ? <Button variant="flat" onClick={() => setStep(step - 1)}>Previous</Button> : <Button variant="flat" onClick={() => finish()}>Skip</Button>}
        title={
          <span className="flex items-center gap-1.5" aria-label={`Step ${step + 1} of ${STEPS.length}`}>
            {STEPS.map((s, i) => (
              <span key={s} className={cn('h-1.5 rounded-full transition-all duration-300', i === step ? 'w-5 bg-brand' : 'w-1.5 bg-fg/25')} />
            ))}
          </span>
        }
        end={
          <Button variant="suggested" onClick={() => (last ? finish() : setStep(step + 1))}>
            {last ? 'Done' : 'Next'}
          </Button>
        }
      />
      <div key={step} className="mx-auto min-h-0 w-full max-w-[920px] flex-1 animate-in duration-300 fade-in-0 slide-in-from-right-4">
        {step === 0 && <Hello />}
        {step === 1 && <Tour />}
        {step === 2 && <Personalize />}
        {step === 3 && <Next onPick={(id) => finish(id)} />}
      </div>
    </div>
  )
}
