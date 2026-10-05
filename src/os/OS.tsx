import { lazy, Suspense, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { useThemeEffect } from '@/hooks/useThemeEffect'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { NotificationBanner } from './notifications/NotificationBanner'
import { AppGrid } from './shell/AppGrid'
import { Desktop } from './shell/Desktop'
import { Dock } from './shell/Dock'
import { Particles } from './shell/Particles'
import { BootScreen } from './shell/BootScreen'
import { MobileNotice, PowerDialog, PoweredOff } from './shell/session'
import { Celestial, SkyTint } from './shell/Sky'
import { TopBar } from './shell/TopBar'
import { Wallpaper } from './shell/Wallpaper'
import { WindowManager } from './window/WindowManager'
import { useShortcuts } from './useShortcuts'

const LanyardOverlay = lazy(() => import('@/apps/contact/LanyardOverlay'))

/** Software brightness, layered over everything. */
function DisplayFilters() {
  const brightness = useOS((s) => s.system.brightness)
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60001] bg-black transition-opacity duration-150"
      style={{ opacity: ((100 - brightness) / 100) * 0.6 }}
    />
  )
}

function Session() {
  const phase = useOS((s) => s.phase)
  if (phase === 'boot') return <BootScreen />
  if (phase === 'off') return <PoweredOff />
  return null
}

export function OS() {
  useThemeEffect()
  useShortcuts()
  const mobile = useIsMobile()
  const wallpaper = useOS((s) => s.settings.wallpaper)
  const dockPosition = useOS((s) => s.settings.dockPosition)
  const dockSide = mobile ? 'bottom' : dockPosition
  const phase = useOS((s) => s.phase)
  const welcomed = useOS((s) => s.settings.welcomed)
  const overlayApp = useOS((s) => s.overlayApp)

  // Skip the splash when it is turned off in Settings
  useEffect(() => {
    if (useOS.getState().phase === 'boot' && !useOS.getState().settings.bootSplash) useOS.getState().setPhase('desktop')
  }, [])

  // First visit: open the Welcome tour once the desktop appears
  useEffect(() => {
    if (phase !== 'desktop' || welcomed) return
    const t = window.setTimeout(() => useOS.getState().openApp('welcome'), 450)
    return () => clearTimeout(t)
  }, [phase, welcomed])

  return (
    <TooltipProvider delayDuration={350} skipDelayDuration={150}>
      <div className="fixed inset-0 overflow-hidden bg-black">
        <Wallpaper id={wallpaper} />
        <SkyTint />
        <Particles />
        <Celestial />
        <div className="absolute inset-0 flex flex-col">
          <TopBar />
          <div className={cn('flex min-h-0 flex-1', dockSide === 'bottom' && 'flex-col-reverse', dockSide === 'right' && 'flex-row-reverse')}>
            <Dock />
            <main className="relative min-h-0 min-w-0 flex-1">
              <Desktop />
              <AppGrid />
            </main>
          </div>
        </div>
        <WindowManager />
        {overlayApp === 'contact' && (
          <Suspense fallback={null}>
            <LanyardOverlay />
          </Suspense>
        )}
        <NotificationBanner />
        <PowerDialog />
        {phase === 'desktop' && <MobileNotice />}
        <Session />
        <DisplayFilters />
      </div>
    </TooltipProvider>
  )
}
