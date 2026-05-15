import { useEffect, useRef } from 'react'
import { useSound } from '../../lib/sound'
import styles from './BoidsCanvas.module.css'

type Props = {
  /** Number of boids in the flock. Changing this re-seeds the flock. */
  count?: number
  /** Position-integration multiplier. 0.5 = half, 2 = double. Hot-swappable. */
  speed?: number
}

/**
 * Reynolds boids running on a transparent canvas — no chrome, no background,
 * no border. The canvas paints over whatever's behind it; an alpha-only fade
 * (destination-out) creates the trail without painting a colored rectangle
 * that would look like a "box". Cursor attracts the flock; clicks send out a
 * scatter ripple and play a unique flurry sound.
 *
 * Pauses when off-screen / tab hidden. Respects prefers-reduced-motion.
 */
export function BoidsCanvas({ count = 70, speed = 1 }: Props = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const speedRef = useRef(speed)
  const { play } = useSound()

  // Keep the latest speed accessible to the animation loop without re-seeding.
  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    type Boid = { x: number; y: number; vx: number; vy: number }
    const NUM_BOIDS = Math.max(5, Math.floor(count))
    const VISUAL_RANGE = 60
    const SEP_RANGE = 18
    const MAX_SPEED = 2.2
    const MIN_SPEED = 1.0
    const EDGE_MARGIN = 30
    const EDGE_TURN = 0.25
    const COHESION = 0.0045
    const ALIGNMENT = 0.05
    const SEPARATION = 0.06
    const CURSOR_PULL = 0.0028

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
        const v = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED)
        boids.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.cos(angle) * v,
          vy: Math.sin(angle) * v,
        })
      }
    }

    function readClay() {
      const root = getComputedStyle(document.documentElement)
      return root.getPropertyValue('--clay').trim() || '#D97757'
    }

    function step() {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      const speedMul = speedRef.current

      // Alpha-only fade for the trail — doesn't paint a colored rect, so the
      // page background shows through cleanly.
      ctx!.globalCompositeOperation = 'destination-out'
      ctx!.fillStyle = 'rgba(0, 0, 0, 1)'
      ctx!.globalAlpha = 0.1
      ctx!.fillRect(0, 0, w, h)
      ctx!.globalCompositeOperation = 'source-over'
      ctx!.globalAlpha = 1

      const clay = readClay()
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

        const v = Math.hypot(b.vx, b.vy)
        if (v > MAX_SPEED) {
          b.vx = (b.vx / v) * MAX_SPEED
          b.vy = (b.vy / v) * MAX_SPEED
        } else if (v < MIN_SPEED && v > 0) {
          b.vx = (b.vx / v) * MIN_SPEED
          b.vy = (b.vy / v) * MIN_SPEED
        }

        // Speed scales only position integration — flocking forces still
        // resolve at their normal rate, so the steering looks identical and
        // only the travel distance changes.
        b.x += b.vx * speedMul
        b.y += b.vy * speedMul

        if (b.x < -10) b.x = w + 10
        if (b.x > w + 10) b.x = -10
        if (b.y < -10) b.y = h + 10
        if (b.y > h + 10) b.y = -10

        const angle = Math.atan2(b.vy, b.vx)
        ctx!.save()
        ctx!.translate(b.x, b.y)
        ctx!.rotate(angle)
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

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      cursor = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onPointerLeave = () => {
      cursor = null
    }
    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      scatter = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        until: performance.now() + 700,
      }
      play('flurry', 0.85)
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

    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerleave', onPointerLeave)
    canvas.addEventListener('pointerdown', onPointerDown)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerleave', onPointerLeave)
      canvas.removeEventListener('pointerdown', onPointerDown)
    }
    // count change re-seeds the flock; speed is read via ref so omitting it
    // here is intentional (and matches the speedRef pattern above).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count])

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}
