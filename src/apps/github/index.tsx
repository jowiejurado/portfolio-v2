import { useEffect, useState } from 'react'
import { ArrowPathIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid'
import { ChartBarSquareIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { Spinner } from '@/components/Spinner'
import { profile } from '@/content/profile'
import { HeaderBar } from '@/os/window/WindowContext'
import type { AppComponentProps } from '../registry'
import { Button, Clamp, HeaderButton, StatusPage } from '../_ui'
import { Contributions, loadContributions, type Day } from './Contributions'
import { Languages, type RepoLanguages } from './Languages'

interface GhUser {
  login: string
  name: string | null
  avatar_url: string
  html_url: string
  bio: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}
interface GhRepo {
  name: string
  html_url: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  pushed_at: string
  fork: boolean
}

interface Data {
  user: GhUser
  repos: GhRepo[]
  /** null when the contribution service is down; the rest of the page still renders */
  contributions: Day[] | null
  languages: RepoLanguages
}

type State = { status: 'idle' | 'loading' } | { status: 'error'; message: string } | ({ status: 'ready' } & Data)

const CACHE_KEY = 'jowie-os:github:v5'
const TTL = 30 * 60 * 1000

async function load(username: string, force: boolean): Promise<Data> {
  if (!force) {
    try {
      const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) ?? 'null')
      if (cached && cached.username === username && Date.now() - cached.t < TTL) return cached.data
    } catch {
      /* ignore cache errors */
    }
  }
  const [u, r, contributions] = await Promise.all([
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}`),
    fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`),
    loadContributions(username).catch(() => null),
  ])
  if (u.status === 404) throw new Error(`No GitHub user called “${username}”.`)
  if (u.status === 403 || r.status === 403) throw new Error('GitHub rate limit reached. Try again in a few minutes.')
  if (!u.ok || !r.ok) throw new Error('GitHub did not respond. Check your connection and try again.')
  const repos = (await r.json()) as GhRepo[]
  const own = repos.filter((repo) => !repo.fork)
  // byte counts per repo; if any request fails (rate limit), fall back to each repo's primary language
  const languages = await Promise.all(
    own.map((repo) =>
      fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo.name)}/languages`)
        .then((res) => (res.ok ? (res.json() as Promise<Record<string, number>>) : Promise.reject()))
        .catch(() => (repo.language ? { [repo.language]: 1 } : {})),
    ),
  )
  const data: Data = { user: (await u.json()) as GhUser, repos, contributions, languages }
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ username, t: Date.now(), data }))
  } catch {
    /* storage full or blocked */
  }
  return data
}


export default function GitHub(_: AppComponentProps) {
  const username = profile.github
  const [state, setState] = useState<State>({ status: 'idle' })
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    if (!username) return
    let alive = true
    setState({ status: 'loading' })
    load(username, nonce > 0)
      .then((d) => alive && setState({ status: 'ready', ...d }))
      .catch((e: Error) => alive && setState({ status: 'error', message: e.message }))
    return () => {
      alive = false
    }
  }, [username, nonce])

  const header = (
    <HeaderBar
      end={
        username ? (
          <HeaderButton aria-label="Refresh" disabled={state.status === 'loading'} onClick={() => setNonce((n) => n + 1)}>
            <ArrowPathIcon />
          </HeaderButton>
        ) : undefined
      }
    />
  )

  if (!username) {
    return (
      <div className="h-full bg-window">
        {header}
        <StatusPage
          icon={<ChartBarSquareIcon />}
          title="Connect a GitHub Account"
          description={
            <>
              Set <code className="rounded bg-fg/10 px-1.5 py-0.5 font-mono text-[13px]">github</code> in{' '}
              <code className="rounded bg-fg/10 px-1.5 py-0.5 font-mono text-[13px]">src/content/profile.ts</code> to load live repositories, stars and languages.
            </>
          }
        />
      </div>
    )
  }

  if (state.status !== 'ready' && state.status !== 'error') {
    return (
      <div className="grid h-full place-items-center bg-window text-fg-dim">
        {header}
        <Spinner className="size-8" />
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="h-full bg-window">
        {header}
        <StatusPage icon={<ExclamationTriangleIcon />} title="Couldn’t Load GitHub" description={state.message}>
          <Button variant="suggested" onClick={() => setNonce((n) => n + 1)}>
            Try Again
          </Button>
        </StatusPage>
      </div>
    )
  }

  const { user, contributions, languages } = state

  return (
    <div className="h-full bg-window">
      {header}
      <Clamp width={760} className="pb-10">
        <header className="flex items-center gap-5">
          <img src={user.avatar_url} alt="" width={80} height={80} className="size-20 rounded-full bg-fg/10" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-[26px] font-bold tracking-[-0.02em]">{user.name ?? user.login}</h1>
            <a href={user.html_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[14px] font-semibold text-brand hover:underline">
              @{user.login} <ArrowTopRightOnSquareIcon className="size-3.5" />
            </a>
            {user.bio && <p className="mt-1 text-[14px] text-fg-dim">{user.bio}</p>}
          </div>
        </header>

        {contributions && <Contributions days={contributions} login={user.login} profileUrl={user.html_url} />}

        <Languages repos={languages} />
      </Clamp>
    </div>
  )
}
