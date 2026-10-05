import { useEffect } from 'react'
import { ACCENTS } from '@/os/theme'
import { useOS } from '@/store/useOS'
import { useMediaQuery } from './useMediaQuery'

/** Applies the theme class, accent colour and motion preference to <html>. */
export function useThemeEffect() {
  const theme = useOS((s) => s.settings.theme)
  const accent = useOS((s) => s.settings.accent)
  const animations = useOS((s) => s.settings.animations)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const dark = theme === 'dark' || (theme === 'system' && prefersDark)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    root.style.colorScheme = dark ? 'dark' : 'light'
    root.style.setProperty('--brand', ACCENTS[accent].color)
    root.classList.toggle('no-anim', !animations)
  }, [dark, accent, animations])

  return dark
}

export function useIsDark() {
  const theme = useOS((s) => s.settings.theme)
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  return theme === 'dark' || (theme === 'system' && prefersDark)
}
