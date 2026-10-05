import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import type { AppId } from '@/store/types'

export interface AppComponentProps {
  windowId: string
  props?: Record<string, unknown>
}

type Loader = () => Promise<{ default: ComponentType<AppComponentProps> }>
type LazyApp = LazyExoticComponent<ComponentType<AppComponentProps>>

/**
 * Each app is its own chunk. To add an app:
 *   1. add metadata in manifest.ts
 *   2. add `src/apps/<id>/index.tsx` with a default export
 *   3. register its loader below
 * The boot screen preloads these so apps open instantly afterwards.
 */
export const appLoaders: Record<AppId, Loader> = {
  welcome: () => import('./welcome'),
  about: () => import('./about'),
  projects: () => import('./projects'),
  experience: () => import('./experience'),
  github: () => import('./github'),
  games: () => import('./games'),
  contact: () => import('./contact'),
  files: () => import('./files'),
  terminal: () => import('./terminal'),
  settings: () => import('./settings'),
}

export const appComponents = Object.fromEntries(
  Object.entries(appLoaders).map(([id, load]) => [id, lazy(load)]),
) as Record<AppId, LazyApp>
