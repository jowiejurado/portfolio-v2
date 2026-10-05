import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { playSound } from '@/lib/sound'
import { useOS } from '@/store/useOS'
import { AppIcon } from '../icons/AppIcon'

/** GNOME banner: drops in under the top bar, auto-dismisses after 5s. */
export function NotificationBanner() {
  const banner = useOS((s) => s.banner)
  const { dismissBanner, openApp } = useOS.getState()

  useEffect(() => {
    if (!banner) return
    playSound('chime')
    const t = window.setTimeout(dismissBanner, 5000)
    return () => clearTimeout(t)
  }, [banner, dismissBanner])

  if (!banner) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 top-10 z-[12000] flex justify-center px-3" role="status" aria-live="polite">
      <div
        key={banner.id}
        className="pointer-events-auto relative flex w-[400px] max-w-full animate-banner-in gap-3 rounded-[20px] bg-shell p-3.5 pr-10 text-shell-fg shadow-[0_10px_34px_rgb(0_0_0/0.4)]"
      >
        <button
          type="button"
          onClick={() => {
            if (banner.appId) openApp(banner.appId)
            dismissBanner()
          }}
          className="flex min-w-0 flex-1 gap-3 text-left"
        >
          {banner.appId && <AppIcon appId={banner.appId} className="size-8 shrink-0" />}
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-bold">{banner.title}</span>
            {banner.body && <span className="mt-0.5 line-clamp-2 block text-[13px] opacity-80">{banner.body}</span>}
          </span>
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismissBanner}
          className="absolute top-2.5 right-2.5 grid size-7 place-items-center rounded-full hover:bg-shell-card-hover"
        >
          <XMarkIcon className="size-4" />
        </button>
      </div>
    </div>
  )
}
