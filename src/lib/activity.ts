/**
 * Shared helpers for contribution/submission "activity" calendars, used by the
 * Stats page (GitHub + LeetCode) and the heatmap. A calendar is a map of
 * day -> count; LeetCode keys are unix-second strings, GitHub keys are ISO
 * dates, so both normalize to a contiguous last-12-months ActivityDay[].
 */
export type ActivityDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

export function isoDate(d: Date): string {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0
  if (count < 2) return 1
  if (count < 4) return 2
  if (count < 7) return 3
  return 4
}

/** LeetCode-style calendar (unix-second keys) -> ISO-date count map, merging
 *  any same-day collisions (e.g. year-boundary overlap). */
export function unixCalendarToIso(cal: Record<string, number>): Record<string, number> {
  const out: Record<string, number> = {}
  for (const [ts, count] of Object.entries(cal)) {
    const key = isoDate(new Date(Number(ts) * 1000))
    out[key] = (out[key] ?? 0) + Number(count)
  }
  return out
}

/** Build a contiguous last-365-day ActivityDay[] from an ISO-date count map. */
export function toActivities(isoCounts: Record<string, number>): ActivityDay[] {
  const today = new Date()
  const end = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()))
  const start = new Date(end)
  start.setUTCFullYear(end.getUTCFullYear() - 1)
  start.setUTCDate(start.getUTCDate() + 1)

  const out: ActivityDay[] = []
  const cursor = new Date(start)
  while (cursor <= end) {
    const key = isoDate(cursor)
    const count = isoCounts[key] ?? 0
    out.push({ date: key, count, level: levelFor(count) })
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return out
}

/** Longest run of consecutive active days — always accurate from the calendar
 *  (independent of any stale point-in-time "streak" field). */
export function computeLongestStreak(days: ActivityDay[]): number {
  let longest = 0
  let run = 0
  for (const d of days) {
    if (d.count > 0) {
      run += 1
      if (run > longest) longest = run
    } else {
      run = 0
    }
  }
  return longest
}

export function activeDays(days: ActivityDay[]): number {
  return days.reduce((n, d) => n + (d.count > 0 ? 1 : 0), 0)
}

export function totalCount(days: ActivityDay[]): number {
  return days.reduce((s, d) => s + d.count, 0)
}

/** "8 hours ago", "yesterday", "3 days ago" — fresher than 24h reads as recent
 *  rather than as a stale timestamp. */
export function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const seconds = Math.max(0, (Date.now() - then) / 1000)
  const minutes = seconds / 60
  const hours = minutes / 60
  const days = hours / 24
  if (minutes < 1) return 'just now'
  if (minutes < 60) {
    const n = Math.round(minutes)
    return `${n} minute${n === 1 ? '' : 's'} ago`
  }
  if (hours < 24) {
    const n = Math.round(hours)
    return `${n} hour${n === 1 ? '' : 's'} ago`
  }
  if (days < 2) return 'yesterday'
  if (days < 30) {
    const n = Math.round(days)
    return `${n} days ago`
  }
  return new Date(iso).toLocaleDateString()
}
