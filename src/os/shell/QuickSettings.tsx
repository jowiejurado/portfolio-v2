import type { ComponentType, ReactNode, SVGProps } from 'react'
import { Cog6ToothIcon, PowerIcon, SunIcon, WifiIcon } from '@heroicons/react/20/solid'
import { Slider } from '@/components/ui/slider'
import { useBattery, useNetwork } from '@/hooks/useSystemStatus'
import { useIsDark } from '@/hooks/useThemeEffect'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { MIN_BRIGHTNESS } from '@/store/systemSlice'
import { useOS } from '@/store/useOS'
import { BatteryGlyph, ContrastGlyph } from '../icons/glyphs'
import { batteryText, networkLabel, volumeIcon } from '../tray/indicators'

type Glyph = ComponentType<SVGProps<SVGSVGElement>>

function RoundButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full bg-shell-card transition-colors hover:bg-shell-card-hover active:bg-fg/20 [&>svg]:size-[18px]"
    >
      {children}
    </button>
  )
}

/** GNOME quick toggle pill. */
function QuickToggle({
  icon: Icon,
  title,
  subtitle,
  active,
  onToggle,
}: {
  icon: Glyph
  title: string
  subtitle?: string
  active: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        'flex h-[52px] min-w-0 items-center gap-2.5 rounded-full pr-3 pl-4 text-left transition-colors duration-150',
        active ? 'bg-brand text-brand-fg hover:brightness-110' : 'bg-shell-card hover:bg-shell-card-hover',
      )}
    >
      <Icon className="size-[18px] shrink-0" />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[13.5px] font-bold">{title}</span>
        {subtitle && <span className="block truncate text-[12px] opacity-80">{subtitle}</span>}
      </span>
    </button>
  )
}

function SliderRow({
  icon: Icon,
  label,
  value,
  onChange,
  onIcon,
  onCommit,
  min,
}: {
  icon: Glyph
  label: string
  value: number
  onChange: (v: number) => void
  onIcon?: () => void
  onCommit?: () => void
  /** values below this are unreachable; the zone is drawn green on the track */
  min?: number
}) {
  const atMin = min !== undefined && value <= min
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={onIcon ? `Toggle ${label}` : label}
        onClick={onIcon}
        disabled={!onIcon}
        className="grid size-9 shrink-0 place-items-center rounded-full transition-colors enabled:hover:bg-shell-card-hover"
      >
        <Icon className="size-[18px]" />
      </button>
      <div className="relative mr-2 flex-1">
        {min !== undefined && (
          <span
            aria-hidden
            title={`Minimum ${label.toLowerCase()} ${min}%`}
            className="pointer-events-none absolute top-1/2 left-0 z-[2] h-[5px] -translate-y-1/2 rounded-l-full bg-[#3cc58f] shadow-[0_0_6px_rgb(60_197_143/0.6)]"
            style={{ width: `${min}%` }}
          />
        )}
        <Slider
          aria-label={label}
          value={[value]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => onChange(min !== undefined ? Math.max(min, v) : v)}
          onValueCommit={onCommit}
          className="relative z-[1] text-shell-fg [&_[data-slot=slider-range]]:rounded-l-full"
        />
        {min !== undefined && (
          <span
            className={cn(
              'pointer-events-none absolute -bottom-3.5 text-[10.5px] font-semibold whitespace-nowrap transition-opacity duration-200',
              atMin ? 'opacity-80' : 'opacity-0',
            )}
            style={{ left: `${min}%`, translate: '-50% 0' }}
            aria-live="polite"
          >
            Minimum
          </span>
        )}
      </div>
    </div>
  )
}

export function QuickSettings({ onClose }: { onClose: () => void }) {
  const sys = useOS((s) => s.system)
  const { setSystem, setSettings, openApp, setPowerDialog } = useOS.getState()
  const dark = useIsDark()
  const battery = useBattery()
  const net = useNetwork()

  const VolGlyph = volumeIcon(sys.volume, sys.muted)
  const netInfo = networkLabel(net, sys.wifi)

  return (
    <div className="flex w-[380px] max-w-[calc(100vw-40px)] flex-col gap-3 text-shell-fg">
      <div className="flex items-center gap-2">
        <div
          className="flex h-10 items-center gap-2 rounded-full bg-shell-card px-4 text-[13.5px] font-semibold"
          title={batteryText(battery)}
        >
          <BatteryGlyph level={battery.level} charging={battery.supported && battery.charging} className="size-5" />
          <span className="tabular">{battery.supported ? `${battery.level} %` : 'AC'}</span>
        </div>
        <div className="flex-1" />
        <RoundButton
          label="Settings"
          onClick={() => {
            openApp('settings')
            onClose()
          }}
        >
          <Cog6ToothIcon />
        </RoundButton>
        <RoundButton
          label="Power Off"
          onClick={() => {
            onClose()
            setPowerDialog(true)
          }}
        >
          <PowerIcon />
        </RoundButton>
      </div>

      <div className="flex flex-col gap-2 px-1 pb-2">
        <SliderRow
          icon={VolGlyph}
          label="Volume"
          value={sys.muted ? 0 : sys.volume}
          onChange={(v) => setSystem({ volume: v, muted: v === 0 })}
          onIcon={() => setSystem({ muted: !sys.muted })}
          onCommit={() => playSound('pop')}
        />
        <SliderRow
          icon={SunIcon}
          label="Brightness"
          value={sys.brightness}
          min={MIN_BRIGHTNESS}
          onChange={(v) => setSystem({ brightness: v })}
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <QuickToggle
          icon={WifiIcon}
          title="Wi-Fi"
          subtitle={sys.wifi ? netInfo.detail : 'Off'}
          active={sys.wifi}
          onToggle={() => setSystem({ wifi: !sys.wifi })}
        />
        <QuickToggle
          icon={ContrastGlyph}
          title="Dark Style"
          subtitle={dark ? 'On' : 'Off'}
          active={dark}
          onToggle={() => setSettings({ theme: dark ? 'light' : 'dark' })}
        />
      </div>
    </div>
  )
}
