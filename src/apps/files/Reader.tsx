import { ChevronLeftIcon } from '@heroicons/react/20/solid'
import { cn } from '@/lib/utils'

export interface OpenDoc {
  path: string
  name: string
  content: string
}

/** Light markdown colouring for the read-only document view. */
function tone(line: string) {
  if (/^#{1,6}\s/.test(line)) return 'font-bold text-[var(--brand)]'
  if (/^\s*#/.test(line)) return 'text-fg-dim italic'
  return 'text-fg/90'
}

/** In-place document reader for Files (replaces the old Text Editor app). */
export function Reader({ doc, onClose }: { doc: OpenDoc; onClose: () => void }) {
  const lines = doc.content.replace(/\n$/, '').split('\n')
  return (
    <div className="absolute inset-0 z-10 flex flex-col bg-view">
      <div className="flex h-11 shrink-0 items-center gap-2 border-b border-line px-2">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-[13.5px] font-semibold text-fg hover:bg-hover"
        >
          <ChevronLeftIcon className="size-4" /> Back
        </button>
        <span className="truncate text-[14px] font-bold">{doc.name}</span>
        <span className="ml-auto pr-2 text-[12px] text-fg-dim">Read-only</span>
      </div>
      <div className="selectable min-h-0 flex-1 overflow-auto py-3 font-mono text-[15px] leading-[1.5]">
        <table className="border-separate border-spacing-0">
          <tbody>
            {lines.map((l, i) => (
              <tr key={i}>
                <td className="tabular sticky left-0 bg-view pr-4 pl-4 text-right align-top text-fg-dim/60 select-none">{i + 1}</td>
                <td className={cn('pr-6 whitespace-pre-wrap', tone(l))}>{l || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
