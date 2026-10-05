import { useEffect, useState, type ComponentType, type ReactNode, type SVGProps } from 'react'
import {
  BellIcon,
  BoltIcon,
  ChevronLeftIcon,
  ClockIcon,
  ComputerDesktopIcon,
  EyeIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
  PaintBrushIcon,
  SpeakerWaveIcon,
  WifiIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon } from '@heroicons/react/20/solid'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { profile } from '@/content/profile'
import { useBattery, useNetwork } from '@/hooks/useSystemStatus'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { playSound } from '@/lib/sound'
import { cn } from '@/lib/utils'
import { ACCENTS, WALLPAPERS } from '@/os/theme'
import { Wallpaper } from '@/os/shell/Wallpaper'
import { batteryText, networkLabel } from '@/os/tray/indicators'
import { HeaderBar } from '@/os/window/WindowContext'
import { DOCK_ICON_DEFAULT, DOCK_ICON_MAX, DOCK_ICON_MIN } from '@/store/layout'
import { DEFAULT_PINNED } from '@/store/settingsSlice'
import { useOS } from '@/store/useOS'
import type { AccentId, DesktopIconSize, DockPosition, ThemePref, WallpaperId } from '@/store/types'
import type { AppComponentProps } from '../registry'
import { BoxedList, Button, Clamp, GroupTitle, HeaderButton, Row, StylePreview } from '../_ui'

type PageId = 'network' | 'appearance' | 'desktop' | 'notifications' | 'sound' | 'power' | 'accessibility' | 'datetime' | 'about'

const SIDEBAR_W = 250

const PAGES: { id: PageId; label: string; icon: ComponentType<SVGProps<SVGSVGElement>>; group: number; keywords: string[] }[] = [
  { id: 'network', label: 'Network', icon: WifiIcon, group: 0, keywords: ['wifi', 'internet'] },
  { id: 'appearance', label: 'Appearance', icon: PaintBrushIcon, group: 1, keywords: ['theme', 'dark', 'light', 'accent', 'color', 'wallpaper', 'background'] },
  { id: 'desktop', label: 'Ubuntu Desktop', icon: ComputerDesktopIcon, group: 1, keywords: ['dock', 'icons', 'pin', 'size', 'position', 'placement', 'bottom', 'left', 'right'] },
  { id: 'notifications', label: 'Notifications', icon: BellIcon, group: 1, keywords: ['disturb', 'dnd', 'banner'] },
  { id: 'sound', label: 'Sound', icon: SpeakerWaveIcon, group: 2, keywords: ['volume', 'mute', 'audio'] },
  { id: 'power', label: 'Power', icon: BoltIcon, group: 2, keywords: ['battery'] },
  { id: 'accessibility', label: 'Accessibility', icon: EyeIcon, group: 3, keywords: ['animations', 'motion', 'boot'] },
  { id: 'datetime', label: 'Date & Time', icon: ClockIcon, group: 3, keywords: ['clock', 'time', '24', 'seconds'] },
  { id: 'about', label: 'About', icon: InformationCircleIcon, group: 3, keywords: ['system', 'version', 'info'] },
]

function SwitchRow({ title, subtitle, checked, onChange }: { title: string; subtitle?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="block cursor-pointer">
      <Row title={title} subtitle={subtitle} suffix={<Switch checked={checked} onCheckedChange={onChange} />} className="hover:bg-hover" />
    </label>
  )
}

function Section({ title, children, description }: { title?: string; description?: string; children: ReactNode }) {
  return (
    <section className="mb-7">
      {title && <GroupTitle className={description ? 'mb-0.5' : undefined}>{title}</GroupTitle>}
      {description && <p className="mb-2.5 px-1 text-[13px] text-fg-dim">{description}</p>}
      {children}
    </section>
  )
}

/* ---------- Appearance ---------- */


function Appearance() {
  const s = useOS((st) => st.settings)
  const set = useOS((st) => st.setSettings)
  const styles: { id: ThemePref; label: string }[] = [
    { id: 'light', label: 'Default' },
    { id: 'dark', label: 'Dark' },
    { id: 'system', label: 'Automatic' },
  ]
  return (
    <>
      <Section title="Style">
        <div className="grid grid-cols-3 gap-3 max-md:grid-cols-2">
          {styles.map((st) => (
            <button
              key={st.id}
              type="button"
              aria-pressed={s.theme === st.id}
              onClick={() => set({ theme: st.id })}
              className="group flex flex-col items-center gap-2"
            >
              <span
                className={cn(
                  'block w-full rounded-xl p-1 ring-2 transition-[box-shadow]',
                  s.theme === st.id ? 'ring-brand' : 'ring-transparent group-hover:ring-fg/15',
                )}
              >
                {st.id === 'system' ? (
                  <span className="grid grid-cols-2 overflow-hidden rounded-lg">
                    <span className="overflow-hidden [&>div]:rounded-none"><StylePreview dark={false} /></span>
                    <span className="overflow-hidden [&>div]:rounded-none"><StylePreview dark /></span>
                  </span>
                ) : (
                  <StylePreview dark={st.id === 'dark'} />
                )}
              </span>
              <span className="text-[13.5px] font-semibold">{st.label}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Color">
        <BoxedList>
          <div className="flex flex-wrap gap-3 p-4" role="radiogroup" aria-label="Accent color">
            {(Object.keys(ACCENTS) as AccentId[]).map((id) => (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={s.accent === id}
                aria-label={ACCENTS[id].label}
                title={ACCENTS[id].label}
                onClick={() => set({ accent: id })}
                className={cn(
                  'grid size-9 place-items-center rounded-full ring-offset-2 ring-offset-view transition-[box-shadow,scale] hover:scale-105',
                  s.accent === id && 'ring-2 ring-[var(--c)]',
                )}
                style={{ backgroundColor: ACCENTS[id].color, ['--c' as string]: ACCENTS[id].color }}
              >
                {s.accent === id && <CheckIcon className="size-5 text-white" />}
              </button>
            ))}
          </div>
        </BoxedList>
      </Section>

      <Section title="Background" description="Every background is painted with your accent color.">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
            <button
              key={id}
              type="button"
              aria-pressed={s.wallpaper === id}
              onClick={() => set({ wallpaper: id })}
              className="group flex flex-col gap-1.5 text-center"
            >
              <span
                className={cn(
                  'relative block aspect-[16/10] overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-window transition-[box-shadow]',
                  s.wallpaper === id ? 'ring-brand' : 'ring-transparent group-hover:ring-fg/20',
                )}
              >
                <Wallpaper id={id} />
              </span>
              <span className="text-[13px] font-semibold">{WALLPAPERS[id].label}</span>
            </button>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ---------- Other pages ---------- */

function Network() {
  const net = useNetwork()
  const sys = useOS((s) => s.system)
  const setSystem = useOS((s) => s.setSystem)
  const info = networkLabel(net, sys.wifi)
  return (
    <>
      <Section title="Wi-Fi">
        <BoxedList>
          <SwitchRow title="Wi-Fi" subtitle={sys.wifi ? info.detail : 'Off'} checked={sys.wifi} onChange={(v) => setSystem({ wifi: v })} />
        </BoxedList>
      </Section>
      <Section title="Connection">
        <BoxedList>
          <Row title="Status" suffix={<span className="text-[14px] text-fg-dim">{net.online ? 'Online' : 'Offline'}</span>} />
          <Row title="Link type" suffix={<span className="text-[14px] text-fg-dim">{net.type ?? 'Unknown'}</span>} />
          <Row title="Effective speed" suffix={<span className="text-[14px] text-fg-dim uppercase">{net.effectiveType ?? '—'}</span>} />
          <Row title="Downlink" suffix={<span className="tabular text-[14px] text-fg-dim">{net.downlink ? `${net.downlink} Mb/s` : '—'}</span>} />
        </BoxedList>
        <p className="mt-2 px-1 text-[12.5px] text-fg-dim">Read live from your browser's Network Information API where available.</p>
      </Section>
    </>
  )
}

/** Adw-style toggle group: one pressed button among a few options. */
function Segmented<T extends string | boolean>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg bg-fg/[0.07] p-0.5">
      {options.map((o) => (
        <button
          key={String(o.id)}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={cn('h-8 rounded-md px-3 text-[13px] font-bold', value === o.id ? 'bg-view shadow-sm' : 'text-fg-dim hover:text-fg')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

const DESKTOP_ICON_SIZES: { id: DesktopIconSize; label: string }[] = [
  { id: 'small', label: 'Small' },
  { id: 'standard', label: 'Standard' },
  { id: 'large', label: 'Large' },
]

const DOCK_POSITIONS: { id: DockPosition; label: string }[] = [
  { id: 'left', label: 'Left' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'right', label: 'Right' },
]

function DesktopPage() {
  const s = useOS((st) => st.settings)
  const set = useOS((st) => st.setSettings)
  const mobile = useIsMobile()
  return (
    <>
      <Section title="Desktop Icons">
        <BoxedList>
          <SwitchRow title="Show Desktop Icons" subtitle="Home folder and portfolio shortcuts" checked={s.desktopIcons} onChange={(v) => set({ desktopIcons: v })} />
          <Row
            title="Size"
            className={cn(!s.desktopIcons && 'opacity-50')}
            suffix={<Segmented value={s.desktopIconSize} options={DESKTOP_ICON_SIZES} onChange={(v) => set({ desktopIconSize: v })} />}
          />
        </BoxedList>
      </Section>
      <Section title="Dock">
        <BoxedList>
          <Row
            title="Position on Screen"
            subtitle={mobile ? 'Phones keep the dock at the bottom' : undefined}
            className={cn(mobile && 'opacity-50')}
            suffix={<Segmented value={s.dockPosition} options={DOCK_POSITIONS} onChange={(v) => set({ dockPosition: v })} />}
          />
          <div className="px-4 py-3.5">
            <div className="mb-2 flex items-baseline gap-3">
              <span className="flex-1 text-[14.5px] font-medium">Icon Size</span>
              {s.dockIconSize !== DOCK_ICON_DEFAULT && (
                <button type="button" onClick={() => set({ dockIconSize: DOCK_ICON_DEFAULT })} className="text-[13px] font-semibold underline-offset-2 hover:underline">
                  Reset
                </button>
              )}
              <span className="tabular text-[14px] text-fg-dim">{s.dockIconSize} px</span>
            </div>
            <Slider
              aria-label="Dock icon size"
              min={DOCK_ICON_MIN}
              max={DOCK_ICON_MAX}
              step={2}
              value={[s.dockIconSize]}
              onValueChange={([v]) => set({ dockIconSize: v })}
              className="text-fg"
            />
            {mobile && <p className="mt-2 text-[13px] text-fg-dim">On phones the dock uses a fixed size.</p>}
          </div>
          <Row title="Pinned apps" subtitle={`${s.pinned.length} apps · right-click a dock icon to pin or unpin`} suffix={<Button onClick={() => set({ pinned: DEFAULT_PINNED })}>Reset</Button>} />
        </BoxedList>
      </Section>
    </>
  )
}

function Notifications() {
  const dnd = useOS((s) => s.system.dnd)
  const setSystem = useOS((s) => s.setSystem)
  return (
    <>
      <Section>
        <BoxedList>
          <SwitchRow title="Do Not Disturb" subtitle="Banners are hidden; notifications still collect in the date menu" checked={dnd} onChange={(v) => setSystem({ dnd: v })} />
        </BoxedList>
      </Section>
      <Section title="Try it">
        <BoxedList>
          <Row
            title="Send a test notification"
            suffix={<Button onClick={() => useOS.getState().notify({ title: 'Hello from Settings', body: 'Notifications are working.', appId: 'settings' })}>Send</Button>}
          />
        </BoxedList>
      </Section>
    </>
  )
}

function Sound() {
  const sys = useOS((s) => s.system)
  const setSystem = useOS((s) => s.setSystem)
  return (
    <Section title="Output">
      <BoxedList>
        <div className="px-4 py-3.5">
          <p className="mb-2 text-[14.5px] font-medium">Output Volume</p>
          <Slider
            aria-label="Output volume"
            value={[sys.muted ? 0 : sys.volume]}
            onValueChange={([v]) => setSystem({ volume: v, muted: v === 0 })}
            onValueCommit={() => playSound('pop')}
            className="text-fg"
          />
        </div>
        <SwitchRow title="Mute" checked={sys.muted} onChange={(v) => setSystem({ muted: v })} />
        <Row title="Test" subtitle="Plays the system sound at the current volume" suffix={<Button onClick={() => playSound('chime')}>Play</Button>} />
      </BoxedList>
    </Section>
  )
}

function Power() {
  const b = useBattery()
  const s = useOS((st) => st.settings)
  const set = useOS((st) => st.setSettings)
  return (
    <>
      <Section title="Battery">
        <BoxedList>
          <div className="px-4 py-3.5">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-[14.5px] font-medium">{b.supported ? (b.charging ? 'Charging' : 'Discharging') : 'No battery reported'}</span>
              <span className="tabular text-[14px] text-fg-dim">{b.supported ? `${b.level}%` : 'AC'}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-fg/12">
              <div className={cn('h-full rounded-full', b.level <= 15 ? 'bg-destructive' : 'bg-brand')} style={{ width: `${b.level}%` }} />
            </div>
            <p className="mt-2 text-[13px] text-fg-dim">{batteryText(b)}</p>
          </div>
          <SwitchRow title="Show Battery Percentage" checked={s.showBatteryPercent} onChange={(v) => set({ showBatteryPercent: v })} />
        </BoxedList>
      </Section>
    </>
  )
}

function Accessibility() {
  const s = useOS((st) => st.settings)
  const set = useOS((st) => st.setSettings)
  return (
    <Section title="Seeing">
      <BoxedList>
        <SwitchRow title="Animations" subtitle="Window and menu motion; turned off automatically when your system asks for reduced motion" checked={s.animations} onChange={(v) => set({ animations: v })} />
        <SwitchRow title="Boot Splash" subtitle="Show the start-up screen when the page loads" checked={s.bootSplash} onChange={(v) => set({ bootSplash: v })} />
      </BoxedList>
    </Section>
  )
}

function DateTime() {
  const s = useOS((st) => st.settings)
  const set = useOS((st) => st.setSettings)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  return (
    <>
      <Section>
        <BoxedList>
          <Row title="Time Zone" suffix={<span className="text-[14px] text-fg-dim">{tz.replace(/_/g, ' ')}</span>} />
          <Row
            title="Time Format"
            suffix={
              <Segmented
                value={s.clock24h}
                options={[
                  { id: false, label: 'AM / PM' },
                  { id: true, label: '24-hour' },
                ]}
                onChange={(v) => set({ clock24h: v })}
              />
            }
          />
        </BoxedList>
      </Section>
      <Section title="Clock">
        <BoxedList>
          <SwitchRow title="Weekday and Date" checked={s.showWeekday} onChange={(v) => set({ showWeekday: v })} />
          <SwitchRow title="Seconds" checked={s.showSeconds} onChange={(v) => set({ showSeconds: v })} />
        </BoxedList>
      </Section>
    </>
  )
}

function About() {
  const cores = navigator.hardwareConcurrency
  const rows: [string, string][] = [
    ['Device Name', `${profile.handle}-portfolio`],
    ['Style', 'Ubuntu 26.04 LTS (Yaru)'],
    ['Desktop', 'React 19 · Tailwind CSS 4 · shadcn/ui'],
    ['Window Manager', 'Zustand, hand-rolled'],
    ['App Icons', 'Yaru Icons (snwh.org), CC BY-SA 4.0'],
    ['Processor', cores ? `${cores} logical cores (your browser)` : 'Your browser'],
    ['Screen', `${window.screen.width} × ${window.screen.height}`],
  ]
  return (
    <>
      <div className="mb-8 flex flex-col items-center pt-4 text-center">
        <p className="text-[30px] leading-tight tracking-[-0.02em] text-balance">
          <span className="font-bold">{profile.name}</span>
        </p>
        <p className="mt-2 text-[14px] text-fg-dim">Portfolio · {profile.role}</p>
      </div>
      <BoxedList>
        {rows.map(([k, v]) => (
          <Row key={k} title={k} suffix={<span className="text-right text-[14px] text-fg-dim">{v}</span>} />
        ))}
      </BoxedList>
    </>
  )
}

const RENDER: Record<PageId, () => ReactNode> = {
  network: Network,
  appearance: Appearance,
  desktop: DesktopPage,
  notifications: Notifications,
  sound: Sound,
  power: Power,
  accessibility: Accessibility,
  datetime: DateTime,
  about: About,
}

export default function Settings({ props }: AppComponentProps) {
  const requested = props?.page as PageId | undefined
  const [page, setPage] = useState<PageId>(requested ?? 'appearance')
  const mobile = useIsMobile()
  const [showList, setShowList] = useState(!requested)

  useEffect(() => {
    if (requested) {
      setPage(requested)
      setShowList(false)
    }
  }, [requested])

  const [query, setQuery] = useState<string | null>(null)
  const q = query?.trim().toLowerCase() ?? ''
  const pages = q ? PAGES.filter((p) => p.label.toLowerCase().includes(q) || p.keywords.includes(q) || p.keywords.some((k) => k.startsWith(q))) : PAGES
  const current = PAGES.find((p) => p.id === page)!
  const Page = RENDER[page]
  const listVisible = !mobile || showList
  const contentVisible = !mobile || !showList

  return (
    <div className="flex h-full bg-window">
      <HeaderBar
        split={mobile ? null : SIDEBAR_W}
        sidebar={
          <>
            <HeaderButton aria-label="Search settings" active={query !== null} onClick={() => setQuery(query === null ? '' : null)}>
              <MagnifyingGlassIcon />
            </HeaderButton>
            <span className="flex-1 truncate text-center text-[14px] font-bold">Settings</span>
            <span className="w-[34px]" aria-hidden />
          </>
        }
        start={
          mobile && !showList ? (
            <HeaderButton aria-label="Back" onClick={() => setShowList(true)}>
              <ChevronLeftIcon />
            </HeaderButton>
          ) : mobile ? (
            <HeaderButton aria-label="Search settings" active={query !== null} onClick={() => setQuery(query === null ? '' : null)}>
              <MagnifyingGlassIcon />
            </HeaderButton>
          ) : undefined
        }
        title={<span className="truncate text-[14px] font-bold">{mobile && showList ? 'Settings' : current.label}</span>}
      />
      {listVisible && (
        <nav aria-label="Settings pages" className="shrink-0 overflow-y-auto border-r border-line bg-sidebar p-2 max-md:w-full max-md:border-0" style={mobile ? undefined : { width: SIDEBAR_W }}>
          {query !== null && (
            <label className="mb-2 block">
              <span className="sr-only">Search settings</span>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setQuery(null)}
                placeholder="Search"
                className="h-9 w-full rounded-lg bg-fg/[0.08] px-3 text-[14px] outline-none focus:ring-2 focus:ring-ring"
              />
            </label>
          )}
          {pages.length === 0 && <p className="px-3 py-6 text-center text-[13.5px] text-fg-dim">No results</p>}
          {pages.map((p, i) => {
            const Icon = p.icon
            const gap = i > 0 && pages[i - 1].group !== p.group
            return (
              <button
                key={p.id}
                type="button"
                aria-current={page === p.id && !mobile ? 'page' : undefined}
                onClick={() => {
                  setPage(p.id)
                  setShowList(false)
                }}
                className={cn(
                  'flex h-10 w-full items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors',
                  gap && 'mt-3',
                  page === p.id && !mobile ? 'bg-press font-semibold' : 'hover:bg-hover',
                )}
              >
                <Icon className="size-[18px] shrink-0" />
                {p.label}
              </button>
            )
          })}
        </nav>
      )}
      {contentVisible && (
        <div className="min-w-0 flex-1">
          <Clamp width={680}>
            <Page />
          </Clamp>
        </div>
      )}
    </div>
  )
}
