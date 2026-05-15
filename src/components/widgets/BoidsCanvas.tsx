import { useEffect, useRef } from 'react'
import styles from './BoidsCanvas.module.css'

type Variant = 'card' | 'background'

/**
 * A small flock of dots running Craig Reynolds' boids rules: cohesion,
 * alignment, separation. The cursor attracts them; in card mode clicks create
 * a short scatter ripple. Pauses when off-screen or when the tab is hidden,
 * and respects prefers-reduced-motion (renders one static frame).
 *
 * variant='background' makes the canvas a fixed full-viewport layer that sits
 * behind page content, drawn at lower opacity so it blends in.
 */
export function BoidsCanvas({ variant = 'card' }: { variant?: Variant } = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const isBackground = variant === 'background'
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    type Boid = { x: number; y: number; vx: number; vy: number }
    const NUM_BOIDS = isBackground ? 90 : 70
    const VISUAL_RANGE = isBackground ? 80 : 60
    const SEP_RANGE = 18
    const MAX_SPEED = 2.2
    const MIN_SPEED = 1.0
    const EDGE_MARGIN = 40
    const EDGE_TURN = 0.25
    const COHESION = 0.0045
    const ALIGNMENT = 0.05
    const SEPARATION = 0.06
    const CURSOR_PULL = isBackground ? 0.0018 : 0.0028
    const BOID_ALPHA = isBackground ? 0.45 : 1
    const FADE_ALPHA = isBackground ? 0.12 : 0.18

    const boids: Boid[] = []
    let cursor: { x: number; y: number } | null = null
    let scatter: { x: number; y: number; until: number } | null = null
    let raf = 0
    let running = true
    let dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function seed() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      for (let i = 0; i < NUM_BOIDS; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
        boids.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
        })
      }
    }

    function readColors() {
      const root = getComputedStyle(document.documentElement)
      return {
        clay: root.getPropertyValue('--clay').trim() || '#D97757',
        bg: root.getPropertyValue(isBackground ? '--ivory' : '--white').trim() || '#FAF9F5',
      }
    }

    function step() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const { clay, bg } = readColors()

      ctx!.fillStyle = bg
      ctx!.globalAlpha = FADE_ALPHA
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalAlpha = 1

      const now = performance.now()
      const scatterActive = scatter && now < scatter.until ? scatter : null

      for (const b of boids) {
        let cx = 0, cy = 0, ax = 0, ay = 0, sx = 0, sy = 0
        let neighbors = 0

        for (const other of boids) {
          if (other === b) continue
          const dx = other.x - b.x
          const dy = other.y - b.y
          const dist = Math.hypot(dx, dy)
          if (dist < VISUAL_RANGE) {
            cx += other.x
            cy += other.y
            ax += other.vx
            ay += other.vy
            neighbors++
            if (dist < SEP_RANGE) {
              sx -= dx
              sy -= dy
            }
          }
        }

        if (neighbors > 0) {
          cx = cx / neighbors - b.x
          cy = cy / neighbors - b.y
          ax = ax / neighbors - b.vx
          ay = ay / neighbors - b.vy
          b.vx += cx * COHESION + ax * ALIGNMENT + sx * SEPARATION
          b.vy += cy * COHESION + ay * ALIGNMENT + sy * SEPARATION
        }

        if (cursor) {
          const dx = cursor.x - b.x
          const dy = cursor.y - b.y
          b.vx += dx * CURSOR_PULL
          b.vy += dy * CURSOR_PULL
        }
        if (scatterActive) {
          const dx = b.x - scatterActive.x
          const dy = b.y - scatterActive.y
          const dist = Math.hypot(dx, dy) || 1
          const force = Math.max(0, 1 - dist / 120) * 1.5
          b.vx += (dx / dist) * force
          b.vy += (dy / dist) * force
        }

        if (b.x < EDGE_MARGIN) b.vx += EDGE_TURN
        if (b.x > w - EDGE_MARGIN) b.vx -= EDGE_TURN
        if (b.y < EDGE_MARGIN) b.vy += EDGE_TURN
        if (b.y > h - EDGE_MARGIN) b.vy -= EDGE_TURN

        const speed = Math.hypot(b.vx, b.vy)
        if (speed > MAX_SPEED) {
          b.vx = (b.vx / speed) * MAX_SPEED
          b.vy = (b.vy / speed) * MAX_SPEED
        } else if (speed < MIN_SPEED && speed > 0) {
          b.vx = (b.vx / speed) * MIN_SPEED
          b.vy = (b.vy / speed) * MIN_SPEED
        }

        b.x += b.vx
        b.y += b.vy

        if (b.x < -10) b.x = w + 10
        if (b.x > w + 10) b.x = -10
        if (b.y < -10) b.y = h + 10
        if (b.y > h + 10) b.y = -10

        const angle = Math.atan2(b.vy, b.vx)
        ctx!.save()
        ctx!.translate(b.x, b.y)
        ctx!.rotate(angle)
        ctx!.globalAlpha = BOID_ALPHA
        ctx!.fillStyle = clay
        ctx!.beginPath()
        ctx!.moveTo(4, 0)
        ctx!.lineTo(-3, 2.4)
        ctx!.lineTo(-3, -2.4)
        ctx!.closePath()
        ctx!.fill()
        ctx!.restore()
      }
    }

    function loop() {
      if (!running) return
      step()
      raf = requestAnimationFrame(loop)
    }

    function cursorFromEvent(e: PointerEvent): { x: number; y: number } | null {
      if (!canvas) return null
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null
      return { x, y }
    }

    const onPointerMove = (e: PointerEvent) => {
      cursor = cursorFromEvent(e)
    }
    const onPointerLeave = () => {
      cursor = null
    }
    const onPointerDown = (e: PointerEvent) => {
      const c = cursorFromEvent(e)
      if (!c) return
      scatter = { x: c.x, y: c.y, until: performance.now() + 700 }
    }

    resize()
    seed()

    if (prefersReduced) {
      step()
    } else {
      raf = requestAnimationFrame(loop)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting
        if (!visible) {
          running = false
          cancelAnimationFrame(raf)
        } else if (!prefersReduced && !running) {
          running = true
          raf = requestAnimationFrame(loop)
        }
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVis = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      } else if (!prefersReduced && !running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }
    document.addEventListener('visibilitychange', onVis)

    // In background mode the canvas has pointer-events: none, so DOM events
    // never reach it directly — listen on window instead so the cursor still
    // attracts boids even when hovering text or widgets above the canvas.
    const target: Window | HTMLCanvasElement = isBackground ? window : canvas
    target.addEventListener('pointermove', onPointerMove as EventListener)
    target.addEventListener('pointerdown', onPointerDown as EventListener)
    if (!isBackground) {
      canvas.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      target.removeEventListener('pointermove', onPointerMove as EventListener)
      target.removeEventListener('pointerdown', onPointerDown as EventListener)
      if (!isBackground) {
        canvas.removeEventListener('pointerleave', onPointerLeave)
      }
    }
  }, [variant])

  if (variant === 'background') {
    return (
      <div className={styles.bgWrap} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.bgCanvas} />
      </div>
    )
  }

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.hint}>follow your cursor · click to scatter</span>
    </div>
  )
}
