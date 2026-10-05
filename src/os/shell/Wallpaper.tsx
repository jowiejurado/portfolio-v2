import { memo } from 'react'
import type { WallpaperId } from '@/store/types'

/*
 * Original procedural wallpapers. Every one is painted with the live
 * --brand colour, so changing the accent recolours the desktop.
 */

const BRAND = { stopColor: 'var(--brand)' }

/** Topographic rings: deterministic wobbly loops around two summits. */
function contourPaths(cx: number, cy: number, rings: number, seed: number, step: number) {
  const out: string[] = []
  for (let i = 1; i <= rings; i++) {
    const r = i * step
    const pts: string[] = []
    const n = 72
    for (let k = 0; k <= n; k++) {
      const a = (k / n) * Math.PI * 2
      const wobble =
        Math.sin(a * 3 + seed + i * 0.35) * (6 + i * 1.6) +
        Math.sin(a * 5 - seed * 2 + i * 0.2) * (3 + i * 0.7) +
        Math.cos(a * 2 + i * 0.15) * i * 2.2
      const rr = r + wobble
      pts.push(`${(cx + Math.cos(a) * rr * 1.25).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
    }
    out.push(`M${pts.join('L')}Z`)
  }
  return out
}

const CONTOUR_A = contourPaths(1180, 600, 26, 1.3, 26)
const CONTOUR_B = contourPaths(260, 180, 12, 4.1, 30)

function Resolute() {
  return (
    <>
      <defs>
        <linearGradient id="wp-r-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#14070f" />
          <stop offset="0.55" stopColor="#2a0a20" />
          <stop offset="1" style={BRAND} />
        </linearGradient>
        <radialGradient id="wp-r-glow" cx="0.78" cy="0.3" r="0.55">
          <stop offset="0" style={{ ...BRAND, stopOpacity: 0.7 }} />
          <stop offset="1" style={{ ...BRAND, stopOpacity: 0 }} />
        </radialGradient>
        <linearGradient id="wp-r-band" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={BRAND} />
          <stop offset="1" stopColor="#f7a046" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#wp-r-sky)" />
      <rect width="1600" height="1000" fill="url(#wp-r-glow)" />
      <path d="M0 640C260 560 520 760 860 650S1380 430 1600 470V1000H0Z" fill="url(#wp-r-band)" opacity="0.92" />
      <path d="M0 735C330 650 690 850 1040 742S1440 590 1600 640V1000H0Z" fill="#1a0614" opacity="0.6" />
      <path d="M0 830C380 760 760 930 1120 846S1470 735 1600 770V1000H0Z" fill="url(#wp-r-band)" opacity="0.55" />
      <path d="M0 915C420 860 820 990 1180 930S1500 860 1600 880V1000H0Z" fill="#12040e" opacity="0.75" />
      <g fill="none" stroke="#fff" strokeOpacity="0.07">
        {[0, 18, 36, 54, 72].map((d) => (
          <path key={d} d={`M0 ${612 - d}C260 ${532 - d} 520 ${732 - d} 860 ${622 - d}S1380 ${402 - d} 1600 ${442 - d}`} />
        ))}
      </g>
    </>
  )
}

function Aubergine() {
  return (
    <>
      <defs>
        <radialGradient id="wp-a" cx="0.3" cy="0.25" r="1">
          <stop offset="0" stopColor="#7a2a68" />
          <stop offset="0.5" stopColor="#3e0d33" />
          <stop offset="1" stopColor="#17040f" />
        </radialGradient>
        <radialGradient id="wp-a-hot" cx="0.85" cy="0.95" r="0.6">
          <stop offset="0" style={{ ...BRAND, stopOpacity: 0.55 }} />
          <stop offset="1" style={{ ...BRAND, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#wp-a)" />
      <rect width="1600" height="1000" fill="url(#wp-a-hot)" />
      <g fill="none" stroke="#fff" strokeOpacity="0.05" strokeWidth="1.2">
        {Array.from({ length: 22 }, (_, i) => (
          <circle key={i} cx="1360" cy="900" r={120 + i * 46} />
        ))}
      </g>
    </>
  )
}

function Contour() {
  return (
    <>
      <defs>
        <radialGradient id="wp-c" cx="0.72" cy="0.6" r="0.9">
          <stop offset="0" stopColor="#262626" />
          <stop offset="1" stopColor="#101010" />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#wp-c)" />
      <g fill="none" style={{ stroke: 'var(--brand)' }} strokeWidth="1.4">
        {CONTOUR_A.map((d, i) => (
          <path key={i} d={d} opacity={Math.max(0.08, 0.85 - i * 0.03)} />
        ))}
      </g>
      <g fill="none" stroke="#fff" strokeWidth="1">
        {CONTOUR_B.map((d, i) => (
          <path key={i} d={d} opacity={Math.max(0.03, 0.16 - i * 0.012)} />
        ))}
      </g>
      <circle cx="1180" cy="600" r="5" style={{ fill: 'var(--brand)' }} />
    </>
  )
}

function Graphite() {
  return (
    <>
      <defs>
        <linearGradient id="wp-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4a4a4a" />
          <stop offset="1" stopColor="#1f1f1f" />
        </linearGradient>
        <radialGradient id="wp-g-sun" cx="0.5" cy="1.05" r="0.6">
          <stop offset="0" style={{ ...BRAND, stopOpacity: 0.85 }} />
          <stop offset="0.6" style={{ ...BRAND, stopOpacity: 0.12 }} />
          <stop offset="1" style={{ ...BRAND, stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#wp-g)" />
      <rect width="1600" height="1000" fill="url(#wp-g-sun)" />
      <path d="M0 860C400 800 1200 800 1600 860V1000H0Z" fill="#141414" opacity="0.7" />
    </>
  )
}

const PAINTERS: Record<WallpaperId, () => React.JSX.Element> = {
  resolute: Resolute,
  aubergine: Aubergine,
  contour: Contour,
  graphite: Graphite,
}

export const Wallpaper = memo(function Wallpaper({ id, className }: { id: WallpaperId; className?: string }) {
  const Paint = PAINTERS[id] ?? Resolute
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 1000"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? 'absolute inset-0 size-full'}
    >
      <Paint />
    </svg>
  )
})
