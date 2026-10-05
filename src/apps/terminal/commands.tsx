import type { ReactNode } from 'react'
import { appList } from '@/apps/manifest'
import { experience } from '@/content/experience'
import { getNode, HOME, prettyPath, resolvePath, type FsNode } from '@/content/fs'
import { profile, socials } from '@/content/profile'
import { projects } from '@/content/projects'
import { ACCENTS } from '@/os/theme'
import { useOS } from '@/store/useOS'
import type { AccentId } from '@/store/types'

export interface ShellCtx {
  cwd: string
  setCwd: (p: string) => void
  clear: () => void
  history: string[]
  close: () => void
}

export type CommandResult = ReactNode | void

interface Command {
  usage: string
  help: string
  run: (args: string[], ctx: ShellCtx) => CommandResult
}

const BOOTED = Date.now()

/* ---------- output helpers ---------- */

const C = {
  user: 'text-[var(--t-green)] font-bold',
  path: 'text-[var(--t-blue)] font-bold',
  dir: 'text-[var(--t-blue)] font-bold',
  app: 'text-[var(--t-green)] font-bold',
  dim: 'opacity-65',
  key: 'text-[var(--t-accent)] font-bold',
  err: 'text-[var(--t-red)]',
}

const Line = ({ children, className }: { children?: ReactNode; className?: string }) => (
  <div className={className}>{children ?? ' '}</div>
)

function Table({ rows }: { rows: [ReactNode, ReactNode][] }) {
  return (
    <div className="grid grid-cols-[max-content_1fr] gap-x-6">
      {rows.map(([a, b], i) => (
        <div key={i} className="contents">
          <span>{a}</span>
          <span className="opacity-80">{b}</span>
        </div>
      ))}
    </div>
  )
}

const A = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noreferrer" className="text-[var(--t-blue)] underline decoration-dotted hover:decoration-solid">
    {children}
  </a>
)

function findApp(name: string) {
  const q = name.toLowerCase()
  return appList.find((a) => a.id === q || a.title.toLowerCase() === q || a.title.toLowerCase().replace(/\s+/g, '') === q || a.keywords.includes(q))
}

function nodeLabel(n: FsNode) {
  if (n.type === 'dir') return <span className={C.dir}>{n.name}/</span>
  if (n.type === 'app') return <span className={C.app}>{n.name.replace(/\s+/g, '-')}.desktop</span>
  return <span>{n.name}</span>
}

function treeLines(node: FsNode, prefix = ''): ReactNode[] {
  if (node.type !== 'dir') return []
  const kids = node.children.filter((c) => !c.name.startsWith('.'))
  return kids.flatMap((c, i) => {
    const last = i === kids.length - 1
    return [
      <Line key={prefix + c.name}>
        <span className={C.dim}>{prefix + (last ? '└── ' : '├── ')}</span>
        {nodeLabel(c)}
      </Line>,
      ...treeLines(c, prefix + (last ? '    ' : '│   ')),
    ]
  })
}

const ASCII = String.raw`
       .-""""-.
     .'  .--.  '.  o
    /   /    \   \
   |    |  j |    |
    \   \    /   /
     '.  '--'  .'
       '-....-'`

/* ---------- commands ---------- */

export const COMMANDS: Record<string, Command> = {
  help: {
    usage: 'help',
    help: 'List available commands',
    run: () => (
      <>
        <Line>{profile.name} — portfolio shell commands:</Line>
        <Line />
        <Table
          rows={Object.entries(COMMANDS)
            .filter(([, c]) => c.help)
            .map(([, c]) => [<span className={C.key}>{c.usage}</span>, c.help])}
        />
        <Line />
        <Line className={C.dim}>Tip: Tab completes, ↑/↓ walk history, Ctrl+L clears.</Line>
      </>
    ),
  },
  neofetch: {
    usage: 'neofetch',
    help: 'System info, portfolio style',
    run: () => {
      const s = useOS.getState().settings
      const dark = document.documentElement.classList.contains('dark')
      const up = Math.max(1, Math.round((Date.now() - BOOTED) / 60000))
      const info: [string, string][] = [
        ['OS', 'Ubuntu 26.04 LTS (web) x86_64'],
        ['Host', `${profile.name} — ${profile.role}`],
        ['Kernel', 'react-19'],
        ['Uptime', `${up} min`],
        ['Shell', 'jsh 1.0'],
        ['Resolution', `${window.innerWidth}x${window.innerHeight}`],
        ['DE', 'GNOME-ish (Yaru)'],
        ['Theme', `Yaru-${s.accent}${dark ? '-dark' : ''}`],
        ['Font', 'Montserrat, Ubuntu Mono'],
        ...(profile.location ? [['Location', profile.location] as [string, string]] : []),
      ]
      return (
        <div className="flex flex-wrap gap-x-8 gap-y-2 py-1">
          <pre className="leading-tight text-[var(--t-accent)]">{ASCII}</pre>
          <div>
            <Line>
              <span className={C.user}>{profile.handle}</span>@<span className={C.user}>{profile.hostname}</span>
            </Line>
            <Line className={C.dim}>{'-'.repeat(profile.handle.length + profile.hostname.length + 1)}</Line>
            {info.map(([k, v]) => (
              <Line key={k}>
                <span className={C.key}>{k}</span>: {v}
              </Line>
            ))}
            <div className="mt-2 flex">
              {['#2e3436', '#cc0000', '#4e9a06', '#c4a000', '#3465a4', '#75507b', '#06989a', '#d3d7cf'].map((c) => (
                <span key={c} className="inline-block h-4 w-6" style={{ background: c }} />
              ))}
            </div>
          </div>
        </div>
      )
    },
  },
  about: {
    usage: 'about',
    help: 'Who I am',
    run: () => (
      <>
        <Line>
          <span className={C.key}>{profile.name}</span> — {profile.role}{profile.location && `, ${profile.location}`}
        </Line>
        <Line />
        {profile.bio.map((p, i) => (
          <Line key={i} className="max-w-[70ch]">
            {p}
          </Line>
        ))}
        <Line />
        <Line className={C.dim}>Run `open about` for the full page.</Line>
      </>
    ),
  },
  skills: {
    usage: 'skills',
    help: 'Languages, frameworks and tools',
    run: () => <Table rows={Object.entries(profile.skills).map(([g, items]) => [<span className={C.key}>{g}</span>, items.join(' · ')])} />,
  },
  projects: {
    usage: 'projects [n]',
    help: 'List projects, or show one',
    run: ([n]) => {
      const idx = Number(n) - 1
      if (n && projects[idx]) {
        const p = projects[idx]
        return (
          <>
            <Line>
              <span className={C.key}>{p.name}</span> <span className={C.dim}>({p.year})</span>
            </Line>
            <Line>{p.tagline}</Line>
            <Line className={C.dim}>{p.stack.join(' · ')}</Line>
            <Line />
            <Line className="max-w-[70ch]">{p.summary}</Line>
            {p.highlights.map((h) => (
              <Line key={h}>  • {h}</Line>
            ))}
          </>
        )
      }
      return (
        <>
          {projects.map((p, i) => (
            <Line key={p.slug}>
              <span className={C.dim}>[{i + 1}]</span> <span className={C.key}>{p.name}</span> — {p.tagline}
            </Line>
          ))}
          <Line />
          <Line className={C.dim}>`projects 1` for details · `open projects` for the app</Line>
        </>
      )
    },
  },
  experience: {
    usage: 'experience',
    help: 'Work history',
    run: () =>
      experience.map((r) => (
        <Line key={r.company + r.start}>
          <span className={C.dim}>
            {r.start}–{r.end}
          </span>{' '}
          <span className={C.key}>{r.title}</span> @ {r.company}
        </Line>
      )),
  },
  contact: {
    usage: 'contact',
    help: 'How to reach me',
    run: () => (
      <Table
        rows={[
          [<span className={C.key}>Email</span>, <A href={`mailto:${profile.email}`}>{profile.email}</A>],
          ...socials.filter((s) => s.label !== 'Email').map((s): [ReactNode, ReactNode] => [<span className={C.key}>{s.label}</span>, <A href={s.href}>{s.handle}</A>]),
        ]}
      />
    ),
  },
  open: {
    usage: 'open <app>',
    help: 'Launch an app (e.g. open projects)',
    run: ([name]) => {
      if (!name) return <Line>Apps: {appList.map((a) => a.id).join(', ')}</Line>
      const app = findApp(name)
      if (!app) return <Line className={C.err}>open: no app called “{name}”</Line>
      useOS.getState().openApp(app.id)
      return <Line className={C.dim}>Opening {app.title}…</Line>
    },
  },
  ls: {
    usage: 'ls [-a] [path]',
    help: 'List directory contents',
    run: (args, { cwd }) => {
      const all = args.includes('-a') || args.includes('-la')
      const target = resolvePath(args.find((a) => !a.startsWith('-')) ?? '.', cwd)
      const node = getNode(target)
      if (!node) return <Line className={C.err}>ls: cannot access '{args.at(-1)}': No such file or directory</Line>
      if (node.type !== 'dir') return nodeLabel(node)
      const kids = node.children.filter((c) => all || !c.name.startsWith('.'))
      if (!kids.length) return
      return (
        <div className="flex flex-wrap gap-x-5">
          {kids.map((k) => (
            <span key={k.name}>{nodeLabel(k)}</span>
          ))}
        </div>
      )
    },
  },
  cd: {
    usage: 'cd <dir>',
    help: 'Change directory',
    run: ([dir], { cwd, setCwd }) => {
      const target = resolvePath(dir ?? '~', cwd)
      const node = getNode(target)
      if (!node) return <Line className={C.err}>cd: {dir}: No such file or directory</Line>
      if (node.type !== 'dir') return <Line className={C.err}>cd: {dir}: Not a directory</Line>
      setCwd(target)
    },
  },
  pwd: { usage: 'pwd', help: '', run: (_, { cwd }) => <Line>{cwd}</Line> },
  cat: {
    usage: 'cat <file>',
    help: 'Print a file',
    run: ([f], { cwd }) => {
      if (!f) return <Line className={C.err}>cat: missing file operand</Line>
      const node = getNode(resolvePath(f, cwd))
      if (!node) return <Line className={C.err}>cat: {f}: No such file or directory</Line>
      if (node.type === 'dir') return <Line className={C.err}>cat: {f}: Is a directory</Line>
      if (node.type === 'app') return <pre className="font-mono">{`[Desktop Entry]\nName=${node.name}\nExec=open ${node.appId}`}</pre>
      return <pre className="font-mono whitespace-pre-wrap">{node.content}</pre>
    },
  },
  tree: {
    usage: 'tree [path]',
    help: 'Show the folder tree',
    run: ([p], { cwd }) => {
      const node = getNode(resolvePath(p ?? '.', cwd))
      if (!node || node.type !== 'dir') return <Line className={C.err}>tree: {p}: not a directory</Line>
      return (
        <>
          <Line className={C.dir}>{prettyPath(resolvePath(p ?? '.', cwd))}</Line>
          {treeLines(node)}
        </>
      )
    },
  },
  theme: {
    usage: 'theme <light|dark|auto>',
    help: 'Switch the desktop style',
    run: ([t]) => {
      const map = { light: 'light', dark: 'dark', auto: 'system', system: 'system' } as const
      const v = map[t as keyof typeof map]
      if (!v) return <Line className={C.err}>usage: theme light|dark|auto</Line>
      useOS.getState().setSettings({ theme: v })
      return <Line className={C.dim}>Style set to {t}.</Line>
    },
  },
  accent: {
    usage: 'accent <color>',
    help: 'Change the accent color',
    run: ([c]) => {
      if (!c || !(c in ACCENTS)) return <Line>Colors: {Object.keys(ACCENTS).join(', ')}</Line>
      useOS.getState().setSettings({ accent: c as AccentId })
      return <Line className={C.dim}>Accent set to {ACCENTS[c as AccentId].label}.</Line>
    },
  },
  history: {
    usage: 'history',
    help: '',
    run: (_, { history }) => history.map((h, i) => <Line key={i}>{String(i + 1).padStart(4)}  {h}</Line>),
  },
  date: { usage: 'date', help: '', run: () => <Line>{new Date().toString()}</Line> },
  whoami: { usage: 'whoami', help: '', run: () => <Line>{profile.handle}</Line> },
  uname: { usage: 'uname', help: '', run: (a) => <Line>{a.includes('-a') ? `Linux ${profile.hostname} 26.04-react19 #1 SMP x86_64 GNU/Linux` : 'Linux'}</Line> },
  echo: { usage: 'echo <text>', help: '', run: (a) => <Line>{a.join(' ')}</Line> },
  clear: { usage: 'clear', help: 'Clear the screen', run: (_, { clear }) => clear() },
  exit: { usage: 'exit', help: 'Close this terminal', run: (_, { close }) => close() },
  sudo: {
    usage: 'sudo',
    help: '',
    run: () => {
      useOS.getState().notify({ title: 'Incident reported', body: `${profile.handle} tried to use sudo. Nice try.`, appId: 'terminal' })
      return <Line>{profile.handle} is not in the sudoers file. This incident will be reported.</Line>
    },
  },
  apt: {
    usage: 'apt',
    help: '',
    run: () => <Line>E: Could not open lock file — this system is read-only. Try `open projects` instead.</Line>,
  },
}

export function completions(input: string, cwd: string): string[] {
  const parts = input.split(/\s+/)
  if (parts.length <= 1) return Object.keys(COMMANDS).filter((c) => c.startsWith(parts[0]))
  const last = parts.at(-1) ?? ''
  if (parts[0] === 'open') return appList.map((a) => a.id).filter((id) => id.startsWith(last))
  if (parts[0] === 'theme') return ['light', 'dark', 'auto'].filter((t) => t.startsWith(last))
  if (parts[0] === 'accent') return Object.keys(ACCENTS).filter((t) => t.startsWith(last))
  const slash = last.lastIndexOf('/')
  const dirPart = slash >= 0 ? last.slice(0, slash + 1) : ''
  const base = last.slice(slash + 1)
  const node = getNode(resolvePath(dirPart || '.', cwd))
  if (!node || node.type !== 'dir') return []
  return node.children
    .filter((c) => c.name.startsWith(base) && (base.startsWith('.') || !c.name.startsWith('.')))
    .map((c) => dirPart + c.name + (c.type === 'dir' ? '/' : ''))
}

export { HOME }
