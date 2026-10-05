import { useEffect, useMemo, useRef, useState, type ComponentType, type SVGProps } from 'react'
import {
  ArrowDownTrayIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ComputerDesktopIcon,
  DocumentTextIcon,
  FolderOpenIcon,
  HomeIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  PuzzlePieceIcon,
  RectangleStackIcon,
  Bars3Icon,
  ServerIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline'
import { getNode, HOME, type FsNode } from '@/content/fs'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { HeaderBar, useWindow } from '@/os/window/WindowContext'
import { useOS } from '@/store/useOS'
import type { AppComponentProps } from '../registry'
import { HeaderButton, StatusPage } from '../_ui'
import { FileIcon } from './FileIcon'
import { Reader, type OpenDoc } from './Reader'

type Place = { label: string; path: string; icon: ComponentType<SVGProps<SVGSVGElement>> }

const PLACES: Place[] = [
  { label: 'Home', path: HOME, icon: HomeIcon },
  { label: 'Desktop', path: `${HOME}/Desktop`, icon: ComputerDesktopIcon },
  { label: 'Documents', path: `${HOME}/Documents`, icon: DocumentTextIcon },
  { label: 'Projects', path: `${HOME}/Projects`, icon: RectangleStackIcon },
  { label: 'Experience', path: `${HOME}/Experience`, icon: BriefcaseIcon },
  { label: 'Games', path: `${HOME}/Games`, icon: PuzzlePieceIcon },
  { label: 'Downloads', path: `${HOME}/Downloads`, icon: ArrowDownTrayIcon },
  { label: 'Pictures', path: `${HOME}/Pictures`, icon: PhotoIcon },
]

function crumbs(path: string) {
  const rel = path.startsWith(HOME) ? path.slice(HOME.length) : path
  const base = path.startsWith(HOME) ? [{ label: 'Home', path: HOME }] : [{ label: 'Computer', path: '/' }]
  let acc = path.startsWith(HOME) ? HOME : ''
  for (const part of rel.split('/').filter(Boolean)) {
    acc += '/' + part
    base.push({ label: part, path: acc })
  }
  return base
}

function searchTree(node: FsNode, q: string, path: string, out: { node: FsNode; path: string }[] = []) {
  if (node.type !== 'dir') return out
  for (const c of node.children) {
    const p = `${path}/${c.name}`
    if (!c.name.startsWith('.') && c.name.toLowerCase().includes(q)) out.push({ node: c, path: p })
    searchTree(c, q, p, out)
  }
  return out
}

function describe(n: FsNode) {
  if (n.type === 'dir') return `${n.children.filter((c) => !c.name.startsWith('.')).length} items`
  if (n.type === 'app') return 'Application'
  return `${new Blob([n.content]).size} bytes`
}

export default function Files({ props }: AppComponentProps) {
  const { windowId, focused } = useWindow()
  const mobile = useIsMobile()
  const [back, setBack] = useState<string[]>([])
  const [fwd, setFwd] = useState<string[]>([])
  const [path, setPath] = useState<string>((props?.path as string) ?? HOME)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showHidden, setShowHidden] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [doc, setDoc] = useState<OpenDoc | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (props?.path && props.path !== path) go(props.path as string)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props?.path])

  const dir = getNode(path)
  const title = crumbs(path).at(-1)!.label
  useEffect(() => {
    useOS.getState().setWindowTitle(windowId, title)
  }, [title, windowId])

  const items = useMemo(() => {
    if (query && dir) return searchTree(dir, query.toLowerCase(), path === '/' ? '' : path)
    if (!dir || dir.type !== 'dir') return []
    return dir.children
      .filter((c) => showHidden || !c.name.startsWith('.'))
      .sort((a, b) => Number(b.type === 'dir') - Number(a.type === 'dir') || a.name.localeCompare(b.name))
      .map((node) => ({ node, path: `${path === '/' ? '' : path}/${node.name}` }))
  }, [dir, path, query, showHidden])

  function go(next: string) {
    if (next === path) return
    setBack((b) => [...b, path])
    setFwd([])
    setPath(next)
    setSelected(null)
    setQuery(null)
    setDoc(null)
  }

  const open = ({ node, path: p }: { node: FsNode; path: string }) => {
    if (node.type === 'dir') go(p)
    else if (node.type === 'app') useOS.getState().openApp(node.appId)
    else setDoc({ path: p, name: node.name, content: node.content })
  }

  const header = (
    <HeaderBar
      split={mobile ? null : 210}
      sidebar={
        <>
          <span className="flex-1 pl-2 text-[14px] font-bold">Files</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <HeaderButton aria-label="Main menu">
                <Bars3Icon />
              </HeaderButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onSelect={() => useOS.getState().openApp('files', { path })}>New Window</DropdownMenuItem>
              <DropdownMenuCheckboxItem checked={showHidden} onCheckedChange={(v) => setShowHidden(!!v)}>
                Show Hidden Files
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      }
      start={
        <>
          <HeaderButton aria-label="Back" disabled={!back.length} onClick={() => {
            const prev = back.at(-1)!
            setBack((b) => b.slice(0, -1))
            setFwd((f) => [path, ...f])
            setPath(prev)
          }}>
            <ChevronLeftIcon />
          </HeaderButton>
          <HeaderButton aria-label="Forward" disabled={!fwd.length} onClick={() => {
            const [next, ...rest] = fwd
            setFwd(rest)
            setBack((b) => [...b, path])
            setPath(next)
          }}>
            <ChevronRightIcon />
          </HeaderButton>
        </>
      }
      title={
        query !== null ? (
          <label className="relative block w-[min(360px,40vw)]" data-no-drag>
            <span className="sr-only">Search files</span>
            <MagnifyingGlassIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-fg-dim" />
            <input
              ref={searchRef}
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setQuery(null)}
              placeholder={`Search ${title}`}
              className="h-[34px] w-full rounded-lg bg-fg/[0.08] pr-3 pl-8 text-[14px] outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        ) : (
          <nav aria-label="Path" className="flex h-[34px] max-w-[min(480px,42vw)] items-center overflow-hidden rounded-lg bg-fg/[0.08] px-1" data-no-drag>
            {crumbs(path).map((c, i, arr) => (
              <span key={c.path} className="flex min-w-0 items-center">
                {i > 0 && <span className="px-0.5 text-fg-dim">/</span>}
                <button
                  type="button"
                  onClick={() => go(c.path)}
                  className={cn(
                    'truncate rounded-md px-2 py-1 text-[13.5px] hover:bg-hover',
                    i === arr.length - 1 ? 'font-bold' : 'text-fg-dim',
                  )}
                >
                  {c.label}
                </button>
              </span>
            ))}
          </nav>
        )
      }
      end={
        <>
          <HeaderButton aria-label="Search" active={query !== null} onClick={() => setQuery(query === null ? '' : null)}>
            <MagnifyingGlassIcon />
          </HeaderButton>
          <HeaderButton aria-label={view === 'grid' ? 'List view' : 'Grid view'} onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            {view === 'grid' ? <ListBulletIcon /> : <Squares2X2Icon />}
          </HeaderButton>
        </>
      }
    />
  )

  return (
    <div
      className="flex h-full bg-view"
      onKeyDown={(e) => {
        if (!focused) return
        if (e.key === 'Backspace' && back.length && (e.target as HTMLElement).tagName !== 'INPUT') {
          const prev = back.at(-1)!
          setBack((b) => b.slice(0, -1))
          setFwd((f) => [path, ...f])
          setPath(prev)
        }
      }}
    >
      {header}
      {!mobile && (
        <nav aria-label="Places" className="w-[210px] shrink-0 overflow-y-auto border-r border-line bg-sidebar p-2">
          {PLACES.map((p) => {
            const Icon = p.icon
            const active = path === p.path
            return (
              <button
                key={p.path}
                type="button"
                onClick={() => go(p.path)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[14px] transition-colors',
                  active ? 'bg-press font-semibold' : 'hover:bg-hover',
                )}
              >
                <Icon className="size-[18px]" />
                {p.label}
              </button>
            )
          })}
          <div className="mx-3 my-2 h-px bg-line" />
          <button
            type="button"
            onClick={() => go('/')}
            className={cn('flex h-9 w-full items-center gap-3 rounded-lg px-3 text-[14px]', path === '/' ? 'bg-press font-semibold' : 'hover:bg-hover')}
          >
            <ServerIcon className="size-[18px]" />
            Computer
          </button>
        </nav>
      )}

      <div className="relative min-w-0 flex-1 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setSelected(null)}>
        {doc && <Reader doc={doc} onClose={() => setDoc(null)} />}
        {items.length === 0 ? (
          query ? (
            <StatusPage icon={<MagnifyingGlassIcon />} title="No Results Found" description="Try a different search." />
          ) : (
            <StatusPage icon={<FolderOpenIcon />} title="Folder is Empty" />
          )
        ) : view === 'grid' ? (
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-1 p-3" role="listbox" aria-label={title}>
            {items.map((it) => (
              <li key={it.path} role="option" aria-selected={selected === it.path}>
                <button
                  type="button"
                  onClick={() => (mobile ? open(it) : setSelected(it.path))}
                  onDoubleClick={() => open(it)}
                  onKeyDown={(e) => e.key === 'Enter' && open(it)}
                  title={it.node.name}
                  className={cn(
                    'flex w-full flex-col items-center gap-1.5 rounded-xl p-2 pt-3 transition-colors',
                    selected === it.path ? 'bg-brand/18' : 'hover:bg-hover',
                  )}
                >
                  <FileIcon node={it.node} className="size-16" />
                  <span
                    className={cn(
                      'line-clamp-2 w-full rounded px-1 text-center text-[13px] leading-snug break-words',
                      selected === it.path && 'bg-brand text-brand-fg',
                    )}
                  >
                    {it.node.type === 'app' ? it.node.name : it.node.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <table className="w-full text-[14px]">
            <thead className="sticky top-0 bg-view text-left text-[12.5px] text-fg-dim">
              <tr className="border-b border-line">
                <th className="px-4 py-2 font-semibold">Name</th>
                <th className="px-4 py-2 font-semibold max-md:hidden">Size</th>
                <th className="px-4 py-2 font-semibold">Type</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr
                  key={it.path}
                  tabIndex={0}
                  aria-selected={selected === it.path}
                  onClick={() => (mobile ? open(it) : setSelected(it.path))}
                  onDoubleClick={() => open(it)}
                  onKeyDown={(e) => e.key === 'Enter' && open(it)}
                  className={cn('cursor-pointer', selected === it.path ? 'bg-brand text-brand-fg' : 'odd:bg-fg/[0.025] hover:bg-hover')}
                >
                  <td className="flex items-center gap-3 px-4 py-1.5">
                    <FileIcon node={it.node} className="size-7" />
                    <span className="truncate">{it.node.name}</span>
                  </td>
                  <td className="tabular px-4 py-1.5 opacity-75 max-md:hidden">{describe(it.node)}</td>
                  <td className="px-4 py-1.5 opacity-75">{it.node.type === 'dir' ? 'Folder' : it.node.type === 'app' ? 'Launcher' : 'Text'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
