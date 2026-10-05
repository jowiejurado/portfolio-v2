import { useEffect, useRef, useState } from 'react'
import { appLoaders } from '@/apps/registry'
import { profile } from '@/content/profile'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { GRIDS, PixelSprite } from '../icons/appArt'
import { motionAllowed } from '../window/genie'

/*
 * Launch-sequence boot screen. Real work (fonts, every app chunk, the 3D
 * lanyard) is loaded while an Ubuntu-style [ OK ] log scrolls and the
 * rocket fuels up. Holding Space / pointer boosts: warp-speed stars,
 * faster fuelling, a bigger flame. At 100% the rocket launches.
 */

interface Task {
  label: string
  /** minimum "work" in ms at normal speed, so the log stays readable */
  min: number
  run?: (report: (detail: string) => void) => Promise<unknown>
}

const appIds = Object.keys(appLoaders) as (keyof typeof appLoaders)[]

const TASKS: Task[] = [
  { label: `Mounting /home/${profile.handle}`, min: 260 },
  { label: 'Loading fonts (Montserrat, Ubuntu Mono)', min: 300, run: () => document.fonts.ready },
  { label: 'Starting window manager', min: 240 },
  {
    label: 'Loading applications',
    min: 520,
    run: (report) => {
      let done = 0
      return Promise.all(
        appIds.map((id) =>
          appLoaders[id]().then(() => report(`${++done}/${appIds.length}`)),
        ),
      )
    },
  },
  {
    label: 'Rigging the contact lanyard (3D physics)',
    min: 360,
    run: () => Promise.race([import('@/apps/contact/LanyardOverlay'), new Promise((r) => setTimeout(r, 4000))]),
  },
  { label: 'Calibrating sun & moon orbit', min: 300 },
  { label: 'Fueling the dock', min: 260 },
]

type Line = { label: string; detail?: string; ok: boolean }

/** Warp-capable starfield; streaks lengthen with speed. */
function Starfield({ boost }: { boost: React.RefObject<number> }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c?.getContext('2d')
    if (!c || !ctx) return
    let w = 0
    let h = 0
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    const resize = () => {
      w = c.clientWidth
      h = c.clientHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const stars = Array.from({ length: 220 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }))
    let speed = 0.004
    let raf = 0
    const still = !motionAllowed()
    const draw = () => {
      const target = 0.004 + (boost.current ?? 0) * 0.03
      speed += (target - speed) * 0.08
      ctx.fillStyle = 'rgb(6 6 18 / 0.55)'
      ctx.fillRect(0, 0, w, h)
      const cx = w / 2
      const cy = h * 0.42
      for (const s of stars) {
        const pz = s.z
        if (!still) s.z -= speed
        if (s.z <= 0.02) {
          s.x = Math.random() * 2 - 1
          s.y = Math.random() * 2 - 1
          s.z = 1
          continue
        }
        const k = 0.6 * Math.max(w, h)
        const x = cx + (s.x / s.z) * k * 0.5
        const y = cy + (s.y / s.z) * k * 0.5
        const px = cx + (s.x / pz) * k * 0.5
        const py = cy + (s.y / pz) * k * 0.5
        const a = Math.min(1, (1 - s.z) * 1.4)
        ctx.strokeStyle = `rgb(${230 - s.z * 60} ${225 - s.z * 40} 255 / ${a})`
        ctx.lineWidth = Math.max(0.6, (1 - s.z) * 2.2)
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(x + 0.01, y + 0.01)
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    ctx.fillStyle = '#060612'
    ctx.fillRect(0, 0, w, h)
    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [boost])
  return <canvas ref={ref} aria-hidden className="absolute inset-0 size-full" />
}

const SEGMENTS = 24

export function BootScreen() {
  const setPhase = useOS((s) => s.setPhase)
  const [lines, setLines] = useState<Line[]>([])
  const [progress, setProgress] = useState(0)
  const [boosting, setBoosting] = useState(false)
  const [launching, setLaunching] = useState(false)
  const boost = useRef(0)

  // run the task list; "work" advances faster while boosting
  useEffect(() => {
    let cancelled = false
    setLines([])
    let raf = 0
    const total = TASKS.reduce((n, t) => n + t.min, 0)
    let doneWork = 0
    const runTask = (i: number) => {
      if (cancelled) return
      if (i >= TASKS.length) {
        setProgress(1)
        window.setTimeout(() => !cancelled && setLaunching(true), 380)
        return
      }
      const task = TASKS[i]
      setLines((l) => [...l, { label: task.label, ok: false }])
      let resolved = !task.run
      task
        .run?.((detail) => !cancelled && setLines((l) => l.map((x, j) => (j === l.length - 1 ? { ...x, detail } : x))))
        .catch(() => {})
        .finally(() => (resolved = true))
      let work = 0
      let last = performance.now()
      const tick = (now: number) => {
        if (cancelled) return
        const dt = Math.min(64, now - last)
        last = now
        work += dt * (1 + boost.current * 3)
        const frac = Math.min(work / task.min, resolved ? 1 : 0.92)
        setProgress((doneWork + frac * task.min) / total)
        if (frac >= 1) {
          doneWork += task.min
          setLines((l) => l.map((x, j) => (j === l.length - 1 ? { ...x, ok: true } : x)))
          runTask(i + 1)
        } else raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    runTask(0)
    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
    }
  }, [])

  // launch → desktop
  useEffect(() => {
    if (!launching) return
    const t = window.setTimeout(() => setPhase('desktop'), motionAllowed() ? 1000 : 0)
    return () => clearTimeout(t)
  }, [launching, setPhase])

  // boost input: hold Space or press-and-hold; Enter / Escape skip
  useEffect(() => {
    const on = () => {
      boost.current = 1
      setBoosting(true)
    }
    const off = () => {
      boost.current = 0
      setBoosting(false)
    }
    const keyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        on()
      } else if (e.key === 'Enter' || e.key === 'Escape') setPhase('desktop')
    }
    const keyUp = (e: KeyboardEvent) => e.key === ' ' && off()
    window.addEventListener('keydown', keyDown)
    window.addEventListener('keyup', keyUp)
    window.addEventListener('pointerdown', on)
    window.addEventListener('pointerup', off)
    window.addEventListener('pointercancel', off)
    return () => {
      window.removeEventListener('keydown', keyDown)
      window.removeEventListener('keyup', keyUp)
      window.removeEventListener('pointerdown', on)
      window.removeEventListener('pointerup', off)
      window.removeEventListener('pointercancel', off)
    }
  }, [setPhase])

  const pct = Math.round(progress * 100)
  const filled = Math.round(progress * SEGMENTS)

  return (
    <div className="fixed inset-0 z-[50000] overflow-hidden bg-[#060612] text-white select-none" role="dialog" aria-label="Starting up">
      <Starfield boost={boost} />

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        {/* rocket on the pad */}
        <div
          className={cn('relative transition-transform', launching && 'duration-[1000ms] ease-in')}
          style={{ transform: launching ? 'translateY(-120vh)' : boosting ? 'translateY(-4px)' : undefined }}
        >
          <div className={cn(!launching && 'animate-[rocket-idle_1.6s_ease-in-out_infinite]')}>
            <PixelSprite grid={GRIDS.projects} className="size-32 max-md:size-24 [image-rendering:pixelated]" />
          </div>
          {/* engine plume */}
          <div
            aria-hidden
            className="absolute top-[86%] left-1/2 w-4 -translate-x-1/2 animate-[plume_120ms_steps(2)_infinite] bg-[linear-gradient(#ffd25e,#f28c38_45%,#d9483b_75%,transparent)] [image-rendering:pixelated]"
            style={{ height: launching ? 140 : boosting ? 72 : 26, transition: 'height 200ms ease-out' }}
          />
        </div>
        <div aria-hidden className="mt-3 h-2 w-28 bg-[#2b2342] shadow-[0_2px_0_#120e1f]" />

        <p className="mt-9 text-center text-[clamp(22px,3.4vw,34px)] leading-tight tracking-[-0.02em]">
          <span className="font-bold">{profile.name}</span>
        </p>

        {/* fuel gauge */}
        <div className="mt-6 w-full max-w-[420px]">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[13px] text-white/70">
            <span>{launching ? 'LIFTOFF' : pct >= 100 ? 'ALL SYSTEMS GO' : boosting ? 'BOOSTING' : 'FUELING'}</span>
            <span className="tabular">{pct}%</span>
          </div>
          <div className="flex gap-[3px] border-2 border-white/25 p-[3px]" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            {Array.from({ length: SEGMENTS }, (_, i) => (
              <span
                key={i}
                className="h-3 flex-1 transition-colors duration-150"
                style={{ background: i < filled ? (i > SEGMENTS * 0.75 ? '#63c7a1' : i > SEGMENTS * 0.4 ? '#ffd25e' : '#f28c38') : 'rgb(255 255 255 / 0.08)' }}
              />
            ))}
          </div>
        </div>

        {/* boot log */}
        <ol className="mt-6 h-[7.5em] w-full max-w-[420px] overflow-hidden font-mono text-[13px] leading-[1.5em] text-white/80" aria-live="polite">
          {lines.slice(-5).map((l, i) => (
            <li key={`${l.label}-${i}`} className="flex gap-2 whitespace-nowrap">
              <span className={cn('whitespace-pre', l.ok ? 'text-[#63c7a1]' : 'text-[#ffd25e]')}>{l.ok ? '[  OK  ]' : '[ .... ]'}</span>
              <span className="truncate">
                {l.label}
                {l.detail && <span className="text-white/50"> {l.detail}</span>}
              </span>
            </li>
          ))}
        </ol>

        <p className="absolute bottom-[5vh] px-6 text-center text-[13px] text-white/55">
          <span className="[@media(pointer:coarse)]:hidden">
            Hold <kbd className="rounded border border-white/30 px-1.5 font-sans font-semibold">Space</kbd> or press and hold to boost ·{' '}
            <kbd className="rounded border border-white/30 px-1.5 font-sans font-semibold">Enter</kbd> to skip
          </span>
          <span className="hidden [@media(pointer:coarse)]:inline">Press and hold anywhere to boost</span>
        </p>
      </div>
    </div>
  )
}
