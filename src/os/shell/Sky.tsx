import { useEffect, useState } from 'react'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useIsDark } from '@/hooks/useThemeEffect'


/*
 * Day/night layer between the wallpaper and the desktop.
 * Switching the style plays a sunset (light → dark) or a sunrise
 * (dark → light): the sun and moon sit on opposite ends of one orbit and
 * swap places by turning around each other, sinking into a soft horizon
 * while the sky tint cross-fades.
 */

const SKY_MS = 2400

/** Avoid animating on first paint — bodies just appear in place. */
function useArmed() {
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setArmed(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return armed
}

/** Tint that sits under the particles: warm daylight or a deep night wash. */
export function SkyTint() {
  const dark = useIsDark()
  const armed = useArmed()
  const fade = armed ? `opacity ${SKY_MS}ms ease-in-out` : 'none'
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: 'linear-gradient(180deg, rgb(255 226 170 / 0.55), rgb(255 200 140 / 0.15) 55%, transparent 80%)',
          opacity: dark ? 0 : 1,
          transition: fade,
        }}
      />
      <div
        className="absolute inset-0 mix-blend-multiply"
        style={{
          background: 'linear-gradient(180deg, #0b1033 0%, #1a1f4d 45%, rgb(40 30 70 / 0.6) 75%, transparent 100%)',
          opacity: dark ? 0.82 : 0,
          transition: fade,
        }}
      />
    </div>
  )
}

/**
 * Orbit geometry, in viewport units. The sun and moon sit at opposite ends
 * of one diameter; the hub is below the horizon, so whichever body is on
 * top is "up" and the other is hidden under the haze.
 */
const HUB_X = 30 // vw — the pair lands left of centre
const HUB_Y = 74 // vh
const RADIUS = 62 // vh
/** On phones the home-screen icons fill the top, so the orbit is smaller and the bodies land below them. */
const RADIUS_MOBILE = 32 // vh

/** Sun and moon orbiting one another, masked so they melt into the horizon haze. */
export function Celestial() {
  const dark = useIsDark()
  const armed = useArmed()
  const radius = useIsMobile() ? RADIUS_MOBILE : RADIUS

  // Always turn the same way: each style change adds half a revolution,
  // so the pair keeps circling instead of swinging back and forth.
  const [angle, setAngle] = useState(dark ? 180 : 0)
  useEffect(() => {
    setAngle((a) => {
      const wantNight = dark
      const isNight = Math.round(a / 180) % 2 === 1
      return wantNight === isNight ? a : a + 180
    })
  }, [dark])

  const spin = armed ? `rotate ${SKY_MS}ms cubic-bezier(0.65, 0, 0.35, 1)` : 'none'
  // bodies counter-rotate so they stay upright while the orbit turns
  const upright = { rotate: `${-angle}deg`, transition: spin }

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ maskImage: 'linear-gradient(180deg, #000 50%, transparent 66%)' }}
    >
      <div className="absolute size-0" style={{ left: `${HUB_X}vw`, top: `${HUB_Y}vh`, rotate: `${angle}deg`, transition: spin }}>
        {/* sun: top of the orbit at 0° */}
        <div className="absolute" style={{ translate: `-50% calc(-${radius}vh - 50%)` }}>
          <div style={upright}>
            <Sun setting={dark} />
          </div>
        </div>
        {/* moon: opposite end, rises when the orbit turns 180° */}
        <div className="absolute" style={{ translate: `-50% calc(${radius}vh - 50%)` }}>
          <div style={upright}>
            <div
              className="relative size-[clamp(52px,5.5vw,84px)] rounded-full"
              style={{
                background:
                  'radial-gradient(circle at 34% 30%, rgb(0 0 0 / 0.08) 0 9%, transparent 10%), radial-gradient(circle at 62% 58%, rgb(0 0 0 / 0.07) 0 13%, transparent 14%), radial-gradient(circle at 40% 70%, rgb(0 0 0 / 0.06) 0 6%, transparent 7%), radial-gradient(circle at 40% 35%, #fbfaf3, #dcd9cc)',
                boxShadow: '0 0 40px 10px rgb(210 225 255 / 0.25), 0 0 120px 40px rgb(170 190 255 / 0.12)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * The sun: a white-hot core, a slowly turning corona of soft rays and a
 * breathing halo. While it sets it deepens from gold to ember red.
 */
function Sun({ setting }: { setting: boolean }) {
  return (
    <div
      className="relative grid size-[clamp(84px,9vw,132px)] place-items-center"
      style={{
        filter: setting ? 'sepia(0.35) saturate(1.9) hue-rotate(-20deg) brightness(0.95)' : 'none',
        transition: `filter ${SKY_MS}ms ease-in-out`,
      }}
    >
      {/* wide atmospheric halo */}
      <div
        className="absolute size-[420%] animate-[sun-breathe_7s_ease-in-out_infinite] rounded-full"
        style={{ background: 'radial-gradient(circle, rgb(255 200 110 / 0.24) 0%, rgb(255 170 80 / 0.09) 32%, transparent 66%)' }}
      />
      {/* corona: soft rays, slowly turning */}
      <div
        className="absolute size-[200%] animate-[sun-spin_90s_linear_infinite] rounded-full"
        style={{
          background:
            'repeating-conic-gradient(from 0deg, rgb(255 222 140 / 0.16) 0deg 3deg, transparent 3deg 15deg)',
          maskImage: 'radial-gradient(circle, transparent 30%, #000 36%, transparent 70%)',
          filter: 'blur(3px)',
        }}
      />
      <div
        className="absolute size-[165%] animate-[sun-spin_140s_linear_infinite_reverse] rounded-full"
        style={{
          background:
            'repeating-conic-gradient(from 7deg, rgb(255 236 180 / 0.12) 0deg 2deg, transparent 2deg 11deg)',
          maskImage: 'radial-gradient(circle, transparent 34%, #000 40%, transparent 72%)',
        }}
      />
      {/* disc */}
      <div
        className="relative size-full rounded-full"
        style={{
          background:
            'radial-gradient(circle at 42% 40%, #ffffff 0%, #fff8dc 26%, #ffe28a 52%, #ffb547 78%, #ff9a3c 100%)',
          boxShadow:
            '0 0 0 3px rgb(255 240 200 / 0.35), 0 0 36px 10px rgb(255 214 120 / 0.7), 0 0 110px 40px rgb(255 168 70 / 0.35)',
        }}
      />
    </div>
  )
}
