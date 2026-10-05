import type { AppId } from '@/store/types'

export interface AppMeta {
  id: AppId
  title: string
  /** one-liner shown in search results and tooltips */
  description: string
  defaultSize: { w: number; h: number }
  singleton: boolean
  /** listed in the Show Apps grid */
  inGrid: boolean
  /** shown as a desktop shortcut */
  onDesktop: boolean
  keywords: string[]
  /** 'overlay' apps open full-screen over the desktop instead of in a window */
  presentation?: 'window' | 'overlay'
}

/**
 * Pure app metadata (no components) so the store can read it without
 * pulling app code into the main chunk. Add an app here + in registry.tsx.
 */
export const appManifest: Record<AppId, AppMeta> = {
  welcome: {
    id: 'welcome',
    title: 'Welcome',
    description: 'A quick tour of this portfolio',
    defaultSize: { w: 760, h: 520 },
    singleton: true,
    inGrid: true,
    onDesktop: false,
    keywords: ['tour', 'intro', 'help', 'start'],
  },
  about: {
    id: 'about',
    title: 'About Me',
    description: 'Who I am and what I do',
    defaultSize: { w: 820, h: 600 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['profile', 'bio', 'skills', 'me'],
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    description: 'Things I have built',
    defaultSize: { w: 940, h: 640 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['work', 'portfolio', 'case study'],
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    description: 'Where I have worked',
    defaultSize: { w: 780, h: 620 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['jobs', 'career', 'resume', 'cv', 'work history'],
  },
  github: {
    id: 'github',
    title: 'GitHub Stats',
    description: 'Repositories and activity',
    defaultSize: { w: 820, h: 600 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['git', 'code', 'repos', 'open source'],
  },
  games: {
    id: 'games',
    title: 'Games',
    description: 'Mini games to play',
    defaultSize: { w: 760, h: 540 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['play', 'fun', 'bounce', 'space impact', 'tetris', 'pinball', 'space cadet'],
  },
  contact: {
    id: 'contact',
    title: 'Contact Me',
    description: 'Send me a message',
    defaultSize: { w: 640, h: 640 },
    singleton: true,
    inGrid: true,
    onDesktop: true,
    keywords: ['email', 'hire', 'message', 'social', 'lanyard'],
    presentation: 'overlay',
  },
  files: {
    id: 'files',
    title: 'Files',
    description: 'Browse the portfolio file system',
    defaultSize: { w: 880, h: 580 },
    singleton: false,
    inGrid: true,
    onDesktop: false,
    keywords: ['nautilus', 'folder', 'home', 'documents'],
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    description: 'Explore with commands',
    defaultSize: { w: 760, h: 480 },
    singleton: false,
    inGrid: true,
    onDesktop: false,
    keywords: ['shell', 'bash', 'console', 'cli'],
  },
  settings: {
    id: 'settings',
    title: 'Settings',
    description: 'Appearance, sound, power and more',
    defaultSize: { w: 900, h: 620 },
    singleton: true,
    inGrid: true,
    onDesktop: false,
    keywords: ['preferences', 'theme', 'dark', 'wallpaper', 'accent'],
  },
}

export const appList = Object.values(appManifest)
