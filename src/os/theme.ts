import type { AccentId, WallpaperId } from '@/store/types'

/** Yaru accent colours (Ubuntu 26.04) */
export const ACCENTS: Record<AccentId, { label: string; color: string }> = {
  orange: { label: 'Orange', color: '#e95420' },
  bark: { label: 'Bark', color: '#787859' },
  sage: { label: 'Sage', color: '#657b69' },
  olive: { label: 'Olive', color: '#4b8501' },
  viridian: { label: 'Viridian', color: '#03875b' },
  prussian: { label: 'Prussian Green', color: '#308280' },
  blue: { label: 'Blue', color: '#0073e5' },
  purple: { label: 'Purple', color: '#7764d8' },
  magenta: { label: 'Magenta', color: '#b34cb3' },
  red: { label: 'Red', color: '#da3450' },
}

export const WALLPAPERS: Record<WallpaperId, { label: string }> = {
  resolute: { label: 'Resolute' },
  aubergine: { label: 'Aubergine' },
  contour: { label: 'Contour' },
  graphite: { label: 'Graphite' },
}
