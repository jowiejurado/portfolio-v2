import { ArrowDownTrayIcon, ArrowTopRightOnSquareIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/20/solid'
import { profile, socials } from '@/content/profile'
import { useOS } from '@/store/useOS'
import type { AppComponentProps } from '../registry'
import { BoxedList, Button, Clamp, GroupTitle, Row, Tag } from '../_ui'

function downloadResume() {
  const a = document.createElement('a')
  a.href = profile.resumeUrl
  a.download = profile.resumeUrl.split('/').pop() ?? 'resume.pdf'
  a.click()
}

export default function About(_: AppComponentProps) {
  const openApp = useOS((s) => s.openApp)
  const parts = profile.name.split(' ')
  const initials = (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()

  return (
    <div className="h-full bg-window">
      <Clamp width={680} className="pb-10">
        <header className="flex items-center gap-6 pt-2 pb-8 max-md:flex-col max-md:text-center">
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt={profile.name}
              width={112}
              height={112}
              decoding="async"
              className="size-28 shrink-0 rounded-full bg-fg/10 object-cover shadow-[0_0_0_3px_var(--brand),0_8px_22px_-6px_rgb(0_0_0/0.35)]"
            />
          ) : (
            <div className="grid size-28 shrink-0 place-items-center rounded-full bg-brand text-[40px] font-bold text-brand-fg shadow-[0_6px_20px_-4px_color-mix(in_oklab,var(--brand)_60%,transparent)]">
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <h1 className="text-[32px] leading-tight font-bold tracking-[-0.025em]">{profile.name}</h1>
            <p className="mt-1 text-[17px] font-medium">{profile.role}</p>
            {(profile.location || profile.availability) && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-fg-dim max-md:justify-center">
                {profile.location && (
                  <>
                    <MapPinIcon className="size-4" />
                    {profile.location}
                  </>
                )}
                {profile.location && profile.availability && <span aria-hidden>·</span>}
                {profile.availability && <span className="font-semibold text-fg">{profile.availability}</span>}
              </p>
            )}
          </div>
        </header>

        <section className="space-y-4 text-[15.5px] leading-[1.7]">
          {profile.bio.map((p, i) => (
            <p key={i} className="max-w-[65ch]">
              {p}
            </p>
          ))}
        </section>

        <div className="mt-7 flex flex-wrap gap-2 max-md:justify-center">
          <Button variant="suggested" onClick={() => openApp('projects')}>
            See my work
          </Button>
          <Button onClick={() => openApp('contact')}>
            <EnvelopeIcon /> Get in touch
          </Button>
          {profile.resumeUrl && (
            <Button onClick={downloadResume}>
              <ArrowDownTrayIcon /> Download résumé
            </Button>
          )}
        </div>

        <section className="mt-10">
          <GroupTitle>Skills</GroupTitle>
          <BoxedList>
            {Object.entries(profile.skills).map(([group, items]) => (
              <Row
                key={group}
                title={group}
                suffix={
                  <span className="flex max-w-[65%] flex-wrap justify-end gap-1.5">
                    {items.map((s) => (
                      <Tag key={s}>{s}</Tag>
                    ))}
                  </span>
                }
              />
            ))}
          </BoxedList>
        </section>

        <section className="mt-8">
          <GroupTitle>Elsewhere</GroupTitle>
          <BoxedList>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="block">
                <Row
                  title={s.label}
                  subtitle={s.handle}
                  className="hover:bg-hover"
                  suffix={<ArrowTopRightOnSquareIcon className="size-4 text-fg-dim" />}
                />
              </a>
            ))}
          </BoxedList>
        </section>
      </Clamp>
    </div>
  )
}
