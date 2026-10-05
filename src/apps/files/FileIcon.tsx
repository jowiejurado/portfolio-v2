import type { FsNode } from '@/content/fs'
import { cn } from '@/lib/utils'
import { AppIcon } from '@/os/icons/AppIcon'

/** Yaru folder: takes the accent colour, like Ubuntu's own folders. */
export function FolderGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M6 14a4 4 0 0 1 4-4h14.3a4 4 0 0 1 2.9 1.2l3.6 3.6a4 4 0 0 0 2.9 1.2H54a4 4 0 0 1 4 4v29a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" style={{ fill: 'color-mix(in oklab, var(--brand) 72%, black)' }} />
      <path d="M6 24a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z" style={{ fill: 'var(--brand)' }} />
      <path d="M6 24a4 4 0 0 1 4-4h44a4 4 0 0 1 4 4v2H6Z" fill="#fff" opacity="0.18" />
    </svg>
  )
}

export function DocGlyph({ className, ext }: { className?: string; ext: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M14 6h26l12 12v38a2 2 0 0 1-2 2H14a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" className="fill-view" stroke="currentColor" strokeOpacity="0.2" />
      <path d="M40 6v10a2 2 0 0 0 2 2h10" fill="none" stroke="currentColor" strokeOpacity="0.2" />
      {[28, 34, 40].map((y) => (
        <rect key={y} x="19" y={y} width={y === 40 ? 16 : 26} height="2.4" rx="1.2" fill="currentColor" opacity="0.28" />
      ))}
      <text x="32" y="53" textAnchor="middle" fontSize="8" fontWeight="700" style={{ fill: 'var(--brand)' }}>
        {ext.toUpperCase()}
      </text>
    </svg>
  )
}

export function FileIcon({ node, className }: { node: FsNode; className?: string }) {
  if (node.type === 'dir') return <FolderGlyph className={className} />
  if (node.type === 'app') return <AppIcon appId={node.appId} className={className} />
  const ext = node.name.includes('.') && !node.name.startsWith('.') ? node.name.split('.').pop()! : 'txt'
  return <DocGlyph className={cn(className, 'text-fg')} ext={ext} />
}
