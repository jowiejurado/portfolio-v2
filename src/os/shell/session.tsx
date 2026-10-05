import { useEffect, useState } from 'react'
import { ArrowPathIcon, PowerIcon } from '@heroicons/react/20/solid'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { useOS } from '@/store/useOS'


export function PoweredOff() {
  const setPhase = useOS((s) => s.setPhase)
  return (
    <div className="fixed inset-0 z-[50000] grid place-items-center bg-black text-white">
      <button
        type="button"
        autoFocus
        onClick={() => setPhase('boot')}
        className="flex flex-col items-center gap-4 rounded-3xl p-8 text-white/70 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
      >
        <span className="grid size-20 place-items-center rounded-full border-2 border-current">
          <PowerIcon className="size-9" />
        </span>
        <span className="text-[15px] font-semibold">Power On</span>
      </button>
    </div>
  )
}

/** GNOME end-session dialog with the 60-second auto power-off countdown. */
export function PowerDialog() {
  const open = useOS((s) => s.powerDialogOpen)
  const { setPowerDialog, setPhase } = useOS.getState()
  const [left, setLeft] = useState(60)

  useEffect(() => {
    if (!open) return
    setLeft(60)
    const t = window.setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(t)
  }, [open])

  const act = (phase: 'off' | 'boot') => {
    setPowerDialog(false)
    useOS.setState({ windows: {}, order: [] })
    setPhase(phase)
  }

  useEffect(() => {
    if (open && left <= 0) act('off')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left, open])

  const btn = 'flex h-11 flex-1 items-center justify-center gap-2 text-[14px] font-bold transition-colors hover:bg-hover'

  return (
    <Dialog open={open} onOpenChange={setPowerDialog}>
      <DialogContent
        showCloseButton={false}
        className="w-[400px] max-w-[calc(100vw-32px)] gap-0 overflow-hidden rounded-[22px] border-0 bg-shell p-0 text-shell-fg"
      >
        <div className="px-8 pt-7 pb-6 text-center">
          <DialogTitle className="text-[19px] font-bold">Power Off</DialogTitle>
          <DialogDescription className="mt-2 text-[14px] text-shell-fg/75">
            The system will power off automatically in <span className="tabular font-semibold">{left}</span> seconds.
          </DialogDescription>
        </div>
        <div className="flex divide-x divide-fg/10 border-t border-fg/10">
          <button type="button" className={btn} onClick={() => setPowerDialog(false)}>
            Cancel
          </button>
          <button type="button" className={btn} onClick={() => act('boot')}>
            <ArrowPathIcon className="size-4" /> Restart
          </button>
          <button type="button" className={cn(btn, 'bg-[#c7162b] text-white hover:bg-[#d9213a]')} onClick={() => act('off')}>
            Power Off
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const NOTICE_KEY = 'jowie-os:mobile-notice'

export function MobileNotice() {
  const [show, setShow] = useState(() => {
    try {
      return window.innerWidth < 768 && !sessionStorage.getItem(NOTICE_KEY)
    } catch {
      return window.innerWidth < 768
    }
  })
  if (!show) return null
  const close = () => {
    try {
      sessionStorage.setItem(NOTICE_KEY, '1')
    } catch {
      /* storage unavailable */
    }
    setShow(false)
  }
  return (
    <div className="fixed inset-0 z-[40000] grid place-items-center bg-black/55 p-5 backdrop-blur-sm">
      <div role="alertdialog" aria-labelledby="mn-title" className="w-full max-w-[340px] rounded-[22px] bg-shell p-6 text-center text-shell-fg shadow-2xl">
        <h2 id="mn-title" className="text-[18px] font-bold">
          Best on a bigger screen
        </h2>
        <p className="mt-2 text-[14px] leading-relaxed text-shell-fg/75">
          This portfolio is a desktop. On a phone, apps open full screen and the dock sits at the bottom — everything still works.
        </p>
        <button
          type="button"
          autoFocus
          onClick={close}
          className="mt-5 h-11 w-full rounded-full bg-brand text-[15px] font-bold text-brand-fg"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
