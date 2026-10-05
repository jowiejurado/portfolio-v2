import type { Bounds, DockPosition } from '@/store/types'

/*
 * macOS "genie" minimize, built from two animatable properties:
 *  1. the edge nearest the dock pinches toward the icon (clip-path funnel
 *     with smoothstepped sides),
 *  2. the whole window slides into the icon while the funnel collapses.
 * The same keyframes played backwards restore the window.
 */

const N = 12 // samples along each curved edge
const smooth = (u: number) => {
  const t = Math.min(1, Math.max(0, u))
  return t * t * (3 - 2 * t)
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const poly = (pts: [number, number][]) => `polygon(${pts.map(([x, y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ')})`

type Side = DockPosition

function shapes(win: Bounds, icon: DOMRect, side: Side) {
  const rect: [number, number][] = []
  const funnel: [number, number][] = []
  const collapsed: [number, number][] = []
  if (side !== 'bottom') {
    // icon's vertical span, in % of the window height
    const a = ((icon.top - win.y) / win.h) * 100
    const b = ((icon.bottom - win.y) / win.h) * 100
    const iw = (icon.width / win.w) * 100
    const top: [number, number][][] = [[], [], []]
    const bottom: [number, number][][] = [[], [], []]
    for (let i = 0; i <= N; i++) {
      const u = i / N
      const f = smooth(u / 0.8)
      top[0].push([u * 100, 0])
      bottom[0].push([u * 100, 100])
      top[1].push([u * 100, lerp(a, 0, f)])
      bottom[1].push([u * 100, lerp(b, 100, f)])
      top[2].push([u * iw, a])
      bottom[2].push([u * iw, b])
    }
    ;[rect, funnel, collapsed].forEach((s, k) => s.push(...top[k], ...bottom[k].reverse()))
    // dock on the right: mirror the funnel so the right edge pinches
    if (side === 'right') [rect, funnel, collapsed].forEach((s) => s.forEach((pt) => (pt[0] = 100 - pt[0])))
  } else {
    // dock at the bottom: pinch the bottom edge instead
    const a = ((icon.left - win.x) / win.w) * 100
    const b = ((icon.right - win.x) / win.w) * 100
    const ih = (icon.height / win.h) * 100
    const left: [number, number][][] = [[], [], []]
    const right: [number, number][][] = [[], [], []]
    for (let i = 0; i <= N; i++) {
      const v = i / N
      const f = smooth((1 - v) / 0.8)
      left[0].push([0, v * 100])
      right[0].push([100, v * 100])
      left[1].push([lerp(a, 0, f), v * 100])
      right[1].push([lerp(b, 100, f), v * 100])
      left[2].push([a, 100 - (1 - v) * ih])
      right[2].push([b, 100 - (1 - v) * ih])
    }
    ;[rect, funnel, collapsed].forEach((s, k) => s.push(...left[k], ...right[k].reverse()))
  }
  return [rect, funnel, collapsed].map(poly)
}

export function genieKeyframes(win: Bounds, icon: DOMRect, side: Side): Keyframe[] {
  const [rect, funnel, collapsed] = shapes(win, icon, side)
  const start = `translate3d(${win.x}px, ${win.y}px, 0)`
  const end =
    side === 'left'
      ? `translate3d(${icon.left}px, ${win.y}px, 0)`
      : side === 'right'
        ? `translate3d(${icon.right - win.w}px, ${win.y}px, 0)`
        : `translate3d(${win.x}px, ${icon.top - win.h + icon.height}px, 0)`
  return [
    { offset: 0, clipPath: rect, transform: start, opacity: 1 },
    { offset: 0.42, clipPath: funnel, transform: start, opacity: 1 },
    { offset: 1, clipPath: collapsed, transform: end, opacity: 0.35 },
  ]
}

/** Same path, played from the dock back to the window. */
export function genieRestoreKeyframes(win: Bounds, icon: DOMRect, side: Side): Keyframe[] {
  return genieKeyframes(win, icon, side)
    .map((k) => ({ ...k, offset: 1 - (k.offset as number) }))
    .reverse()
}

export function motionAllowed() {
  return !document.documentElement.classList.contains('no-anim') && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
