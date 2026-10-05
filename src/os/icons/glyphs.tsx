import type { SVGProps } from 'react'

/**
 * Authored glyphs for symbols Heroicons does not ship, drawn on the same
 * 24px grid with a 1.5 stroke so they sit with the outline set.
 */
type P = SVGProps<SVGSVGElement>

const base = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}



export function ContrastGlyph(props: P) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" stroke="none" />
    </svg>
  )
}



/**
 * GNOME-style battery: outline with a level fill and, when charging,
 * a bolt knocked out of the body — one drawing, no overlaid icons.
 */
export function BatteryGlyph({ level, charging, ...props }: P & { level: number; charging: boolean }) {
  const w = Math.max(1.5, Math.round((Math.min(100, level) / 100) * 15 * 10) / 10)
  const id = `bolt-${charging ? 'c' : 'd'}`
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden {...props}>
      {charging && (
        <defs>
          <mask id={id}>
            <rect width="24" height="24" fill="#fff" />
            <path d="M12.6 7.2 8.6 12.6h3l-1 4.2 4-5.4h-3Z" fill="#000" stroke="#000" strokeWidth="2.2" strokeLinejoin="round" />
          </mask>
        </defs>
      )}
      <g mask={charging ? `url(#${id})` : undefined}>
        <rect x="1.75" y="6.25" width="18.5" height="11.5" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3.5" y="8" width={w} height="8" rx="1.1" fill="currentColor" />
      </g>
      <path d="M21.75 10v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      {charging && <path d="M12.6 7.2 8.6 12.6h3l-1 4.2 4-5.4h-3Z" fill="currentColor" />}
    </svg>
  )
}

export function ShowAppsGlyph(props: P) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      {[5, 12, 19].flatMap((y) => [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2" />))}
    </svg>
  )
}

export function MaximizeGlyph(props: P) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <rect x="6.5" y="6.5" width="11" height="11" rx="1.5" />
    </svg>
  )
}

export function RestoreGlyph(props: P) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <rect x="6" y="8.5" width="9.5" height="9.5" rx="1.5" />
      <path d="M8.5 6h8a1.5 1.5 0 0 1 1.5 1.5v8" />
    </svg>
  )
}

export function MinimizeGlyph(props: P) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="M7 16.5h10" />
    </svg>
  )
}

export function CloseGlyph(props: P) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="m7.5 7.5 9 9m0-9-9 9" />
    </svg>
  )
}

