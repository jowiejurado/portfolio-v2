import { useOS } from '@/store/useOS'

let ctx: AudioContext | null = null

function audio() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

/**
 * Tiny synthesized system sounds, scaled by the tray volume.
 * 'pop' = volume feedback, 'chime' = notification.
 */
export function playSound(kind: 'pop' | 'chime' = 'pop') {
  const { volume, muted } = useOS.getState().system
  if (muted || volume === 0) return
  const ac = audio()
  if (!ac) return
  const gain = ac.createGain()
  const peak = (volume / 100) * 0.18
  const t = ac.currentTime
  gain.connect(ac.destination)
  const notes = kind === 'pop' ? [660] : [784, 1046]
  notes.forEach((freq, i) => {
    const osc = ac.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = freq
    const g = ac.createGain()
    const start = t + i * 0.09
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(peak, start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, start + (kind === 'pop' ? 0.12 : 0.35))
    osc.connect(g).connect(gain)
    osc.start(start)
    osc.stop(start + 0.4)
  })
}
