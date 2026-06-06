import { useMemo, useRef, useState } from 'react'
import styles from './SubmissionHeatmap.module.css'

export type ActivityDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }

type Props = {
  days: ActivityDay[]
  theme: 'light' | 'dark'
}

const PALETTE: Record<'light' | 'dark', [string, string, string, string, string]> = {
  // Light: a clear warm grey for empty days, climbing through soft clay tints
  // to a mid clay — deliberately never near-black, so the grid stays easy to
  // read on the cream page.
  light: ['#E6E4DC', '#F2D8C6', '#EAB592', '#DD8A64', '#CC6E45'],
  dark: ['#2A2A26', '#5A3D2E', '#92583A', '#D97757', '#E68B6F'],
}

const CELL = 13
const GAP = 3
const STEP = CELL + GAP
const TOP = 18 // room for month labels
const LEFT = 26 // room for weekday labels
const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', '']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type Insights = {
  total: number
  longestStreak: number
  best: { count: number; date: string } | null
  topMonth: { label: string; count: number } | null
}

function computeInsights(days: ActivityDay[]): Insights {
  let total = 0
  let longestStreak = 0
  let run = 0
  let best: { count: number; date: string } | null = null
  const monthTotals = new Map<string, number>()

  for (const d of days) {
    total += d.count
    if (d.count > 0) {
      run += 1
      if (run > longestStreak) longestStreak = run
    } else {
      run = 0
    }
    if (d.count > 0 && (!best || d.count > best.count)) {
      best = { count: d.count, date: d.date }
    }
    const ym = d.date.slice(0, 7) // YYYY-MM
    monthTotals.set(ym, (monthTotals.get(ym) ?? 0) + d.count)
  }

  let topMonth: { label: string; count: number } | null = null
  for (const [ym, count] of monthTotals) {
    if (count > 0 && (!topMonth || count > topMonth.count)) {
      const [, m] = ym.split('-')
      topMonth = { label: MONTHS[Number(m) - 1], count }
    }
  }

  return { total, longestStreak, best, topMonth }
}

function formatBest(date: string): string {
  const [, m, d] = date.split('-')
  return `${MONTHS[Number(m) - 1]} ${Number(d)}`
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** "Mon, Jan 23 2026" for the hover tooltip. */
function formatFull(date: string): string {
  const d = new Date(`${date}T00:00:00Z`)
  const [y, m, day] = date.split('-')
  return `${WEEKDAY_NAMES[d.getUTCDay()]}, ${MONTHS[Number(m) - 1]} ${Number(day)} ${y}`
}

type Tooltip = { left: number; top: number; count: number; date: string }

export function SubmissionHeatmap({ days, theme }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const [tip, setTip] = useState<Tooltip | null>(null)

  const showTip = (e: React.MouseEvent, day: ActivityDay) => {
    const wrap = wrapRef.current
    if (!wrap) return
    const rect = wrap.getBoundingClientRect()
    setTip({
      left: e.clientX - rect.left,
      top: e.clientY - rect.top,
      count: day.count,
      date: day.date,
    })
  }

  const { cells, columns, monthLabels, insights } = useMemo(() => {
    if (days.length === 0) {
      return { cells: [], columns: 0, monthLabels: [], insights: null as Insights | null }
    }

    // Column 0 is the week containing the first day; its weekday offsets the
    // first cell vertically. day-of-week: 0 = Sunday.
    const firstDow = new Date(`${days[0].date}T00:00:00Z`).getUTCDay()

    const cells = days.map((day, i) => {
      const slot = firstDow + i
      const col = Math.floor(slot / 7)
      const row = slot % 7
      return { ...day, col, row }
    })

    const columns = Math.ceil((firstDow + days.length) / 7)

    // Month labels: place a label at the column where a new month first
    // appears (using the cell in row 0 of that column, or first cell of the
    // column).
    const monthLabels: { col: number; label: string }[] = []
    let lastMonth = -1
    for (const c of cells) {
      const month = Number(c.date.slice(5, 7)) - 1
      if (month !== lastMonth) {
        // avoid crowding: only label if at least 2 cols since the last label
        const prev = monthLabels[monthLabels.length - 1]
        if (!prev || c.col - prev.col >= 2) {
          monthLabels.push({ col: c.col, label: MONTHS[month] })
        }
        lastMonth = month
      }
    }

    return { cells, columns, monthLabels, insights: computeInsights(days) }
  }, [days])

  if (!insights) return null

  const width = LEFT + columns * STEP
  const height = TOP + 7 * STEP
  const palette = PALETTE[theme]

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.insights}>
        <Insight label="Longest streak" value={`${insights.longestStreak} days`} />
        <Insight
          label="Best day"
          value={insights.best ? `${insights.best.count} · ${formatBest(insights.best.date)}` : '—'}
        />
        <Insight label="Top month" value={insights.topMonth ? insights.topMonth.label : '—'} />
      </div>

      <div className={styles.gridScroll}>
        <svg
          className={styles.svg}
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={`${insights.total} submissions in the last 12 months`}
        >
          {monthLabels.map((m) => (
            <text
              key={`${m.col}-${m.label}`}
              x={LEFT + m.col * STEP}
              y={11}
              className={styles.monthLabel}
            >
              {m.label}
            </text>
          ))}
          {WEEKDAYS.map((label, row) =>
            label ? (
              <text key={label} x={0} y={TOP + row * STEP + CELL - 2} className={styles.dayLabel}>
                {label}
              </text>
            ) : null,
          )}
          {cells.map((c) => (
            <rect
              key={c.date}
              x={LEFT + c.col * STEP}
              y={TOP + c.row * STEP}
              width={CELL}
              height={CELL}
              rx={3}
              fill={palette[c.level]}
              className={styles.cell}
              style={{ animationDelay: `${(c.col + c.row) * 11}ms` }}
              onMouseEnter={(e) => showTip(e, c)}
              onMouseMove={(e) => showTip(e, c)}
              onMouseLeave={() => setTip(null)}
            />
          ))}
        </svg>

        {tip && (
          <div
            className={styles.tooltip}
            style={{ left: tip.left, top: tip.top }}
            aria-hidden="true"
          >
            <span className={styles.tooltipCount}>
              {tip.count} submission{tip.count === 1 ? '' : 's'}
            </span>
            <span className={styles.tooltipDate}>{formatFull(tip.date)}</span>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <span className={styles.legend}>
          Less
          {palette.map((color, i) => (
            <span
              key={color}
              className={styles.legendCell}
              style={{ background: color }}
              aria-hidden="true"
              data-level={i}
            />
          ))}
          More
        </span>
      </div>
    </div>
  )
}

function Insight({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.insight}>
      <span className={styles.insightValue}>{value}</span>
      <span className={styles.insightLabel}>{label}</span>
    </div>
  )
}
