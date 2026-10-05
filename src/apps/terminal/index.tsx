import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { PlusIcon } from '@heroicons/react/20/solid'
import { prettyPath } from '@/content/fs'
import { profile } from '@/content/profile'
import { HeaderBar, useWindow } from '@/os/window/WindowContext'
import { useOS } from '@/store/useOS'
import type { AppComponentProps } from '../registry'
import { HeaderButton } from '../_ui'
import { COMMANDS, completions, HOME } from './commands'

interface Entry {
  id: number
  cwd: string
  input: string
  output: ReactNode
}

function Prompt({ cwd }: { cwd: string }) {
  return (
    <span className="shrink-0">
      <span className="font-bold text-[var(--t-green)]">{profile.handle}@{profile.hostname}</span>
      <span>:</span>
      <span className="font-bold text-[var(--t-blue)]">{prettyPath(cwd)}</span>
      <span>$&nbsp;</span>
    </span>
  )
}

let eid = 0

export default function Terminal({ windowId, props }: AppComponentProps) {
  const { focused } = useWindow()
  const [cwd, setCwd] = useState<string>((props?.cwd as string) ?? HOME)
  const [entries, setEntries] = useState<Entry[]>(() => [
    {
      id: ++eid,
      cwd: HOME,
      input: '',
      output: (
        <div className="mb-1">
          Welcome to {profile.name}'s portfolio. Type <span className="font-bold text-[var(--t-accent)]">help</span> to see what you can do.
        </div>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIndex, setHIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [entries])

  useEffect(() => {
    if (focused) inputRef.current?.focus({ preventScroll: true })
  }, [focused])

  const run = (raw: string) => {
    const line = raw.trim()
    const nextHistory = line ? [...history, line] : history
    if (line) setHistory(nextHistory)
    setHIndex(null)
    const [name, ...args] = line.split(/\s+/)
    let cleared = false
    let output: ReactNode = null
    if (name) {
      const cmd = COMMANDS[name]
      if (!cmd) {
        output = <div className="text-[var(--t-red)]">{name}: command not found</div>
      } else {
        output = cmd.run(args, {
          cwd,
          setCwd,
          history: nextHistory,
          clear: () => (cleared = true),
          close: () => useOS.getState().closeWindow(windowId),
        }) as ReactNode
      }
    }
    if (cleared) setEntries([])
    else setEntries((e) => [...e, { id: ++eid, cwd, input: raw, output }])
    setInput('')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const i = hIndex === null ? history.length - 1 : Math.max(0, hIndex - 1)
      setHIndex(i)
      setInput(history[i])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hIndex === null) return
      const i = hIndex + 1
      if (i >= history.length) {
        setHIndex(null)
        setInput('')
      } else {
        setHIndex(i)
        setInput(history[i])
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const options = completions(input, cwd)
      if (options.length === 1) {
        const parts = input.split(/\s+/)
        parts[parts.length - 1] = options[0]
        setInput(parts.join(' ') + (options[0].endsWith('/') ? '' : ' '))
      } else if (options.length > 1) {
        setEntries((en) => [...en, { id: ++eid, cwd, input, output: <div className="flex flex-wrap gap-x-5">{options.map((o) => <span key={o}>{o}</span>)}</div> }])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setEntries([])
    } else if (e.key === 'c' && e.ctrlKey && !window.getSelection()?.toString()) {
      e.preventDefault()
      setEntries((en) => [...en, { id: ++eid, cwd, input: input + '^C', output: null }])
      setInput('')
    }
  }

  return (
    <div
      className="terminal h-full bg-[var(--t-bg)] font-mono text-[15.5px] leading-[1.35] text-[var(--t-fg)]"
      onMouseUp={() => {
        if (!window.getSelection()?.toString()) inputRef.current?.focus({ preventScroll: true })
      }}
    >
      <HeaderBar
        start={
          <HeaderButton aria-label="New Terminal Window" title="New Window" onClick={() => useOS.getState().openApp('terminal', { cwd })}>
            <PlusIcon />
          </HeaderButton>
        }
        title={<span className="truncate text-[14px] font-bold">{profile.handle}@{profile.hostname}: {prettyPath(cwd)}</span>}
      />
      <div ref={scrollRef} className="selectable h-full overflow-y-auto px-3 py-2">
        {entries.map((e) => (
          <div key={e.id}>
            {(e.input || e.output === null) && (
              <div className="flex">
                <Prompt cwd={e.cwd} />
                <span className="break-all whitespace-pre-wrap">{e.input}</span>
              </div>
            )}
            {e.output && <div className="break-words whitespace-pre-wrap">{e.output}</div>}
          </div>
        ))}
        <div className="flex">
          <Prompt cwd={cwd} />
          <label className="sr-only" htmlFor={`${windowId}-input`}>
            Terminal input
          </label>
          <input
            id={`${windowId}-input`}
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-mono text-inherit caret-[var(--t-accent)] outline-none"
          />
        </div>
      </div>
    </div>
  )
}
