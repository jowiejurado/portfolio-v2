import { memo, type CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import type { AppId } from '@/store/types'
import avatar from '@/assets/yaru/avatar-default.png'
import display from '@/assets/yaru/preferences-desktop-display.png'
import glasses from '@/assets/icons/glasses.svg'
import fileManager from '@/assets/yaru/filemanager-app.png'
import games from '@/assets/yaru/games-app.png'
import help from '@/assets/yaru/help-app.png'
import mail from '@/assets/yaru/mail-app.png'
import github from '@/assets/icons/github.svg'
import settings from '@/assets/yaru/system-settings.png'
import terminal from '@/assets/yaru/terminal-app.png'

/**
 * App icons: Ubuntu's own Yaru icons (CC BY-SA 4.0, unmodified — see
 * src/assets/yaru/README.md) mapped to the closest Ubuntu app, plus two
 * Yaru-style badges in src/assets/icons/: original glasses (Experience)
 * and the GitHub mark (GitHub Stats).
 */
const YARU: Record<AppId, string> = {
  welcome: help,
  about: avatar,
  projects: display,
  experience: glasses,
  github,
  games,
  contact: mail,
  files: fileManager,
  terminal,
  settings,
}

export const AppIcon = memo(function AppIcon({ appId, className, style }: { appId: AppId; className?: string; style?: CSSProperties }) {
  return <img src={YARU[appId]} alt="" aria-hidden draggable={false} decoding="async" style={style} className={cn('shrink-0 object-contain', className)} />
})
