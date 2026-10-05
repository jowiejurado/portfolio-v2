import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

/*
 * libadwaita building blocks shared by every app, so apps stay visually
 * consistent with the shell without each one re-deriving the look.
 */

/** Flat headerbar button (Adw "flat" button). */
export function HeaderButton({ className, active, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'grid h-[34px] min-w-[34px] place-items-center rounded-lg px-2 text-fg transition-colors duration-150',
        'hover:bg-hover active:bg-press disabled:pointer-events-none disabled:opacity-40 [&>svg]:size-[18px]',
        active && 'bg-press',
        className,
      )}
    />
  )
}

/** Adw pill / suggested-action button. */
export function Button({
  className,
  variant = 'default',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'suggested' | 'flat' | 'destructive' }) {
  return (
    <button
      type="button"
      {...props}
      className={cn(
        'inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-[14px] font-bold transition-[background-color,filter] duration-150',
        'disabled:pointer-events-none disabled:opacity-45 [&>svg]:size-4',
        variant === 'default' && 'bg-fg/[0.08] hover:bg-fg/[0.13] active:bg-fg/[0.19]',
        variant === 'suggested' && 'bg-brand text-brand-fg hover:brightness-110 active:brightness-95',
        variant === 'flat' && 'hover:bg-hover active:bg-press',
        variant === 'destructive' && 'bg-destructive text-white hover:brightness-110',
        className,
      )}
    />
  )
}

/** Adw boxed list: rounded card of rows separated by hairlines. */
export function BoxedList({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        'divide-y divide-line overflow-hidden rounded-xl bg-view shadow-[0_0_0_1px_var(--line),0_1px_3px_rgb(0_0_0/0.05)]',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function Row({
  title,
  subtitle,
  prefix,
  suffix,
  onClick,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  prefix?: ReactNode
  suffix?: ReactNode
  onClick?: () => void
  className?: string
}) {
  const Cmp = onClick ? 'button' : 'div'
  return (
    <Cmp
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'flex min-h-[54px] w-full items-center gap-3 px-4 py-2.5 text-left',
        onClick && 'transition-colors hover:bg-hover active:bg-press',
        className,
      )}
    >
      {prefix}
      <span className="min-w-0 flex-1">
        <span className="block text-[14.5px] font-medium">{title}</span>
        {subtitle && <span className="mt-0.5 block text-[13px] text-fg-dim">{subtitle}</span>}
      </span>
      {suffix}
    </Cmp>
  )
}

export function GroupTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={cn('mb-2 px-1 text-[14px] font-bold', className)}>{children}</h3>
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex h-6 items-center rounded-md bg-fg/[0.07] px-2 text-[12px] font-semibold text-fg', className)}>
      {children}
    </span>
  )
}

/** Marks content that is still placeholder copy. */
export function PlaceholderNote({ children = 'Placeholder content — replace in src/content' }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-fg/25 px-2 py-0.5 text-[11.5px] font-semibold text-fg-dim">
      {children}
    </span>
  )
}

/** Adw status page: large icon, title, description, optional action. */
export function StatusPage({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode
  title: string
  description?: ReactNode
  children?: ReactNode
}) {
  return (
    <div className="grid h-full place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto mb-5 grid size-24 place-items-center text-fg-dim/70 [&>svg]:size-24">{icon}</div>
        <h2 className="text-[22px] font-bold">{title}</h2>
        {description && <p className="mt-2 text-[14.5px] leading-relaxed text-fg-dim">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  )
}

/** Scrollable page body with a centred, readable column (Adw clamp). */
export function Clamp({ children, className, width = 720 }: { children: ReactNode; className?: string; width?: number }) {
  return (
    <div className="h-full overflow-y-auto">
      <div className={cn('mx-auto px-6 py-6 max-md:px-4', className)} style={{ maxWidth: width }}>
        {children}
      </div>
    </div>
  )
}

/** Mini window pair used to preview the light/dark style. */
export function StylePreview({ dark }: { dark: boolean }) {
  return (
    <div className={cn('relative h-[86px] w-full overflow-hidden rounded-lg', dark ? 'bg-[#1d1d1d]' : 'bg-[#d9d9d9]')}>
      <div className={cn('absolute top-3 left-4 h-[70px] w-[70%] rounded-md shadow-md', dark ? 'bg-[#383838]' : 'bg-[#fafafa]')}>
        <div className={cn('h-3.5 rounded-t-md', dark ? 'bg-[#2e2e2e]' : 'bg-[#ebebeb]')} />
      </div>
      <div className={cn('absolute top-7 left-[28%] h-[70px] w-[70%] rounded-md shadow-lg', dark ? 'bg-[#2c2c2c]' : 'bg-white')}>
        <div className={cn('h-3.5 rounded-t-md', dark ? 'bg-[#303030]' : 'bg-[#ebebeb]')} />
        <div className="m-2 h-2 w-10 rounded-full bg-brand" />
      </div>
    </div>
  )
}
