import { useState, type FormEvent, type ReactNode } from 'react'
import { ArrowTopRightOnSquareIcon, ClipboardDocumentIcon, PaperAirplaneIcon } from '@heroicons/react/20/solid'
import { profile, socials } from '@/content/profile'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'
import type { AppComponentProps } from '../registry'
import { BoxedList, Button, Clamp, GroupTitle, Row } from '../_ui'

type Fields = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Fields, string>>

function validate(f: Fields): Errors {
  const e: Errors = {}
  if (!f.name.trim()) e.name = 'Add your name so I know who’s writing.'
  if (!f.email.trim()) e.email = 'Add an email address I can reply to.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'That email address looks incomplete — check for a missing @ or domain.'
  if (f.message.trim().length < 10) e.message = 'Write at least a sentence (10+ characters).'
  return e
}

/** Adw entry row: floating label inside a boxed-list row. */
function EntryRow({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <div className={cn('px-4 pt-2 pb-2.5 transition-colors focus-within:bg-fg/[0.025]', error && 'bg-destructive/[0.06]')}>
      <label htmlFor={id} className={cn('block text-[12.5px] font-semibold', error ? 'text-destructive' : 'text-fg-dim')}>
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1 text-[12.5px] font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

const input = 'w-full bg-transparent text-[15px] outline-none placeholder:text-fg-dim/70'

export default function Contact({ windowId }: AppComponentProps) {
  const notify = useOS((s) => s.notify)
  const [f, setF] = useState<Fields>({ name: '', email: '', subject: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const update = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setF((prev) => ({ ...prev, [k]: e.target.value }))
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }))
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validate(f)
    setErrors(errs)
    if (Object.keys(errs).length) {
      document.getElementById(`${windowId}-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    const subject = f.subject.trim() || `Hello from ${f.name.trim()}`
    const body = `${f.message.trim()}\n\n— ${f.name.trim()} (${f.email.trim()})`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    notify({ title: 'Message ready in your email app', body: 'Hit send there and it’s on its way.', appId: 'contact' })
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      notify({ title: 'Email address copied', body: profile.email, appId: 'contact' })
    } catch {
      notify({ title: 'Couldn’t copy', body: `Select it manually: ${profile.email}`, appId: 'contact' })
    }
  }

  const fid = (k: keyof Fields) => `${windowId}-${k}`

  return (
    <div className="h-full bg-window">
      <Clamp width={600} className="pb-10">
        <h1 className="text-[28px] font-bold tracking-[-0.02em]">Let’s talk</h1>
        <p className="mt-1 max-w-[52ch] text-[15px] leading-relaxed text-fg-dim">
          Have a project, a role, or just a question? Send a note and I’ll get back to you.
        </p>

        <form noValidate onSubmit={submit} className="mt-6">
          <BoxedList>
            <EntryRow id={fid('name')} label="Name" error={errors.name}>
              <input id={fid('name')} className={input} value={f.name} onChange={update('name')} autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? `${fid('name')}-err` : undefined} />
            </EntryRow>
            <EntryRow id={fid('email')} label="Email" error={errors.email}>
              <input id={fid('email')} type="email" className={input} value={f.email} onChange={update('email')} autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? `${fid('email')}-err` : undefined} />
            </EntryRow>
            <EntryRow id={fid('subject')} label="Subject (optional)">
              <input id={fid('subject')} className={input} value={f.subject} onChange={update('subject')} />
            </EntryRow>
            <EntryRow id={fid('message')} label="Message" error={errors.message}>
              <textarea
                id={fid('message')}
                rows={5}
                className={cn(input, 'mt-0.5 resize-none leading-relaxed')}
                value={f.message}
                onChange={update('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? `${fid('message')}-err` : undefined}
              />
            </EntryRow>
          </BoxedList>
          {/* pinned action bar: Send stays visible however tall the form grows */}
          <div className="sticky bottom-0 z-10 -mx-6 mt-2 flex items-center justify-between gap-3 border-t border-line bg-window/95 px-6 py-3 backdrop-blur-md max-md:-mx-4 max-md:px-4">
            <p className="text-[13px] text-fg-dim">{sent ? 'Opened in your email app.' : 'Opens your email app with this message.'}</p>
            <Button type="submit" variant="suggested">
              <PaperAirplaneIcon /> Send Message
            </Button>
          </div>
        </form>

        <GroupTitle className="mt-10">Or reach me directly</GroupTitle>
        <BoxedList>
          <Row
            title="Email"
            subtitle={<span className="selectable">{profile.email}</span>}
            suffix={
              <Button variant="flat" onClick={copyEmail} aria-label="Copy email address">
                <ClipboardDocumentIcon /> Copy
              </Button>
            }
          />
          {socials
            .filter((s) => s.label !== 'Email')
            .map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block">
                <Row className="hover:bg-hover" title={s.label} subtitle={s.handle} suffix={<ArrowTopRightOnSquareIcon className="size-4 text-fg-dim" />} />
              </a>
            ))}
        </BoxedList>
      </Clamp>
    </div>
  )
}
