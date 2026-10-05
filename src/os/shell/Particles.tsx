import { memo, useEffect, useRef } from 'react'
import { useIsDark } from '@/hooks/useThemeEffect'
import { useOS } from '@/store/useOS'

/*
 * Ambient particles behind the desktop.
 * Light style: warm dust motes drifting upward through sunlight.
 * Dark style: a field of twinkling stars with a slow drift.
 * One canvas, ~1 particle per 18k px², capped; paused when the tab is
 * hidden; a single static frame when animations are off.
 */

interface P {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  a: number
  phase: number
  speed: number
}

function spawn(w: number, h: number, anywhere: boolean): P {
  return {
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    r: 0.5 + Math.random() ** 2 * 1.9,
    vx: (Math.random() - 0.5) * 0.12,
    vy: -(0.05 + Math.random() * 0.22),
    a: 0.25 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.6 + Math.random() * 1.6,
  }
}

export const Particles = memo(function Particles() {
  const ref = useRef<HTMLCanvasElement>(null)
  const dark = useIsDark()
  const animations = useOS((s) => s.settings.animations)
  const darkRef = useRef(dark)
  const mix = useRef(dark ? 1 : 0) // 0 = day, 1 = night, eased between
  darkRef.current = dark
  const kick = useRef<(() => void) | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const still = reduced || !animations

    let w = 0
    let h = 0
    let parts: P[] = []
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(110, Math.round((w * h) / 18000))
      parts = Array.from({ length: count }, () => spawn(w, h, true))
    }
    resize()

    let raf = 0
    let last = performance.now()
    const draw = (now: number) => {
      const dt = Math.min(50, now - last) / 16.67
      last = now
      // ease the day/night blend so motes turn into stars with the sky
      const target = darkRef.current ? 1 : 0
      mix.current += (target - mix.current) * (still ? 1 : Math.min(1, 0.02 * dt))
      const m = mix.current

      ctx.clearRect(0, 0, w, h)
      for (const p of parts) {
        if (!still) {
          // stars barely drift; motes rise
          const drift = 1 - m * 0.85
          p.x += p.vx * dt * drift
          p.y += p.vy * dt * drift
          p.phase += 0.02 * p.speed * dt
          if (p.y < -10 || p.x < -10 || p.x > w + 10) Object.assign(p, spawn(w, h, false))
        }
        const twinkle = 0.55 + 0.45 * Math.sin(p.phase)
        const alpha = p.a * (m * twinkle + (1 - m) * (0.35 + 0.25 * twinkle))
        // day: warm gold; night: cool white
        const r = Math.round(255 - m * 25)
        const g = Math.round(222 + m * 15)
        const b = Math.round(170 + m * 85)
        ctx.globalAlpha = alpha
        ctx.fillStyle = `rgb(${r} ${g} ${b})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * (1 + m * 0.15), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      if (!still || Math.abs(target - m) > 0.001) raf = requestAnimationFrame(draw)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(draw)
    }
    const onVis = () => (document.hidden ? cancelAnimationFrame(raf) : start())
    const onResize = () => {
      resize()
      start()
    }
    start()
    kick.current = start
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', onResize)
    }
  }, [animations])

  // a theme change only needs the loop running again to ease the blend
  useEffect(() => {
    kick.current?.()
  }, [dark])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
})
