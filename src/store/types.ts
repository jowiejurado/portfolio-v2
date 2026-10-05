export type AppId =
  | 'welcome'
  | 'about'
  | 'projects'
  | 'experience'
  | 'github'
  | 'games'
  | 'contact'
  | 'terminal'
  | 'files'
  | 'settings'

export type Bounds = { x: number; y: number; w: number; h: number }

export type TileSide = 'left' | 'right'

export interface WindowState {
  id: string
  appId: AppId
  title: string
  bounds: Bounds
  z: number
  minimized: boolean
  maximized: boolean
  tiled: TileSide | null
  /** true while the close animation plays */
  closing: boolean
  /** arbitrary launch props forwarded to the app component */
  props?: Record<string, unknown>
}

export type ThemePref = 'light' | 'dark' | 'system'

export type AccentId =
  | 'orange'
  | 'bark'
  | 'sage'
  | 'olive'
  | 'viridian'
  | 'prussian'
  | 'blue'
  | 'purple'
  | 'magenta'
  | 'red'

export type WallpaperId = 'resolute' | 'aubergine' | 'contour' | 'graphite'


export type SessionPhase = 'off' | 'boot' | 'desktop'

export interface Notification {
  id: string
  title: string
  body?: string
  appId?: AppId
  time: number
}

export type DesktopIconSize = 'small' | 'standard' | 'large'
/** Ubuntu Dock "Position on screen" (desktop widths; phones always use the bottom) */
export type DockPosition = 'left' | 'bottom' | 'right'
