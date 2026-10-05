import {
  SignalSlashIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  WifiIcon,
} from '@heroicons/react/16/solid'
import { useBattery, useNetwork, type BatteryStatus, type NetworkStatus } from '@/hooks/useSystemStatus'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import { BatteryGlyph } from '../icons/glyphs'

type IconProps = { className?: string }

export function networkLabel(net: NetworkStatus, wifi: boolean) {
  if (!net.online) return { title: 'Offline', detail: 'No connection' }
  if (!wifi) return { title: 'Wired', detail: 'Connected' }
  const speed = net.effectiveType ? net.effectiveType.toUpperCase() : null
  return { title: 'Wi-Fi', detail: speed ? `Connected · ${speed}` : 'Connected' }
}

export function NetworkIcon({ className }: IconProps) {
  const net = useNetwork()
  const wifi = useOS((s) => s.system.wifi)
  const label = networkLabel(net, wifi)
  const Icon = !net.online ? SignalSlashIcon : WifiIcon
  return (
    <span className="contents" title={`${label.title}: ${label.detail}`}>
      <Icon className={cn(className, !wifi && net.online && 'opacity-60')} />
    </span>
  )
}

export function volumeIcon(volume: number, muted: boolean) {
  return muted || volume === 0 ? SpeakerXMarkIcon : SpeakerWaveIcon
}

export function VolumeIcon({ className }: IconProps) {
  const volume = useOS((s) => s.system.volume)
  const muted = useOS((s) => s.system.muted)
  const Icon = volumeIcon(volume, muted)
  return <Icon className={className} aria-label={muted ? 'Muted' : `Volume ${volume}%`} />
}


export function formatEta(seconds: number | null) {
  if (!seconds) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.round((seconds % 3600) / 60)
  return h ? `${h}:${String(m).padStart(2, '0')}` : `${m} min`
}

export function batteryText(b: BatteryStatus) {
  if (!b.supported) return 'On AC power'
  const eta = formatEta(b.eta)
  if (b.charging) return b.level >= 100 ? 'Fully charged' : eta ? `${eta} until full` : 'Charging'
  return eta ? `${eta} remaining` : 'On battery'
}

export function BatteryIndicator({ className, showPercent }: IconProps & { showPercent?: boolean }) {
  const b = useBattery()
  return (
    <span className="flex items-center gap-1" title={`${b.level}% · ${batteryText(b)}`}>
      <BatteryGlyph
        level={b.level}
        charging={b.supported && b.charging}
        className={cn(className, 'scale-[1.15]', b.level <= 15 && !b.charging && 'text-[#ff7b63]')}
      />
      {showPercent && b.supported && <span className="tabular text-[13px]">{b.level}%</span>}
    </span>
  )
}
