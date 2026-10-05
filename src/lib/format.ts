export function formatClock(d: Date, opts: { h24: boolean; seconds: boolean; weekday: boolean }) {
  const time = d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    second: opts.seconds ? '2-digit' : undefined,
    hour12: !opts.h24,
  })
  if (!opts.weekday) return time
  const day = d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
  return `${day}  ${time}`
}

export function relativeTime(t: number, now = Date.now()) {
  const s = Math.round((now - t) / 1000)
  if (s < 45) return 'Just now'
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  return new Date(t).toLocaleDateString()
}
