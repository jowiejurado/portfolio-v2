import type { AppId } from '@/store/types'
import { experience } from './experience'
import { profile, socials } from './profile'
import { projects } from './projects'

export type FsNode =
  | { type: 'dir'; name: string; children: FsNode[] }
  | { type: 'file'; name: string; content: string }
  | { type: 'app'; name: string; appId: AppId }

const dir = (name: string, children: FsNode[]): FsNode => ({ type: 'dir', name, children })
const file = (name: string, content: string): FsNode => ({ type: 'file', name, content })
const app = (name: string, appId: AppId): FsNode => ({ type: 'app', name, appId })

const aboutMd = `# ${profile.name}
${[profile.role, profile.location].filter(Boolean).join(" · ")}

${profile.bio.join('\n\n')}

${profile.availability ? profile.availability + "." : ""}
`

const skillsMd = Object.entries(profile.skills)
  .map(([group, items]) => `## ${group}\n${items.map((s) => `- ${s}`).join('\n')}`)
  .join('\n\n')

const contactMd = `# Contact
Email: ${profile.email}

${socials.map((s) => `${s.label}: ${s.href}`).join('\n')}
`

const projectMd = (p: (typeof projects)[number]) => `# ${p.name}
${p.tagline}

Year: ${p.year}
Role: ${p.role}
Stack: ${p.stack.join(', ')}

${p.summary}

${p.highlights.map((h) => `- ${h}`).join('\n')}
`

const roleMd = (r: (typeof experience)[number]) => `# ${r.title} — ${r.company}
${r.start} – ${r.end} · ${r.location}

${r.summary}

${r.points.map((p) => `- ${p}`).join('\n')}

Stack: ${r.stack.join(', ')}
`

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const HOME = `/home/${profile.handle}`

export const fsRoot: FsNode = dir('', [
  dir('home', [
    dir(profile.handle, [
      dir('Desktop', [
        app('About Me', 'about'),
        app('Projects', 'projects'),
        app('Experience', 'experience'),
        app('Contact Me', 'contact'),
      ]),
      dir('Documents', [
        file('about.md', aboutMd),
        file('skills.md', skillsMd),
        file('contact.md', contactMd),
        file(
          'education.md',
          `# Education\n\n## Bachelor of Science in Information Technology\nUniversity of Caloocan · Caloocan City · 2020\n`,
        ),
      ]),
      dir('Projects', projects.map((p) => file(`${p.slug}.md`, projectMd(p)))),
      dir('Experience', experience.map((r) => file(`${slug(r.company)}.md`, roleMd(r)))),
      dir('Games', [app('Games', 'games')]),
      dir('Downloads', []),
      dir('Pictures', []),
      file(
        'README.md',
        `# Welcome\n\nThis is ${profile.name}'s portfolio, built as a desktop.\nOpen the folders to read about projects and experience,\nor launch the Terminal and type \`help\`.\n`,
      ),
      file('.bashrc', `# ~/.bashrc\nexport PS1="${profile.handle}@${profile.hostname}:\\w$ "\nalias ll='ls -la'\n`),
    ]),
  ]),
  dir('etc', [file('os-release', `NAME="Ubuntu"\nVERSION="26.04 LTS (${profile.name} portfolio)"\nID=ubuntu\n`)]),
])

/** Normalize a path against cwd, resolving ~, ., .. */
export function resolvePath(input: string, cwd: string): string {
  let p = input.trim()
  if (p === '' || p === '~') return HOME
  if (p.startsWith('~/')) p = HOME + p.slice(1)
  const base = p.startsWith('/') ? [] : cwd.split('/').filter(Boolean)
  for (const part of p.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') base.pop()
    else base.push(part)
  }
  return '/' + base.join('/')
}

export function getNode(path: string): FsNode | null {
  const parts = path.split('/').filter(Boolean)
  let node: FsNode = fsRoot
  for (const part of parts) {
    if (node.type !== 'dir') return null
    const next: FsNode | undefined = node.children.find((c) => c.name === part)
    if (!next) return null
    node = next
  }
  return node
}

export function prettyPath(path: string) {
  return path.startsWith(HOME) ? '~' + path.slice(HOME.length) : path
}
