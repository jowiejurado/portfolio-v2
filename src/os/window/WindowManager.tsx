import { useShallow } from 'zustand/react/shallow'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { useSnap, zoneBounds } from './snap'
import { Window } from './Window'

function SnapPreview() {
  const zone = useSnap((s) => s.zone)
  if (!zone) return null
  const b = zoneBounds(zone)
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute rounded-[14px] border border-white/25 bg-white/15 shadow-[0_10px_40px_rgb(0_0_0/0.25)] backdrop-blur-sm transition-all duration-150 ease-out-expo"
      style={{ left: b.x + 6, top: b.y + 6, width: b.w - 12, height: b.h - 12, zIndex: 9000 }}
    />
  )
}

export function WindowManager() {
  const ids = useOS(useShallow((s) => s.order))
  const overview = useOS((s) => s.overviewOpen)
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 transition-[opacity,scale] duration-250 ease-out-expo [&>*]:pointer-events-auto',
        // GNOME: windows recede while the app grid is open
        overview && 'invisible scale-[0.94] opacity-0 [&>*]:pointer-events-none',
      )}
    >
      {ids.map((id) => (
        <Window key={id} id={id} />
      ))}
      <SnapPreview />
    </div>
  )
}
