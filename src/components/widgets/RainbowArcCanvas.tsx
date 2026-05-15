import { useEffect, useRef } from 'react'
import styles from './RainbowArcCanvas.module.css'

/**
 * Animated rainbow arc inspired by joshwcomeau.com. Concentric colored bands
 * of small pill segments, slow rotational drift + per-segment wobble.
 * Pauses when off-screen / tab hidden. Honors prefers-reduced-motion by
 * rendering one static frame.
 */
export function RainbowArcCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const COLORS = ['#B197FC', '#7DD3FC', '#86EFAC', '#FCD34D', '#FCA5A5']
    const RINGS = 14
    const PILLS_PER_RING = 32
    const ARC_START = Math.PI * 1.05 // ~ lower-left
    const ARC_SPAN = Math.PI * 1.2 // ~ 216° sweep, over the top to lower-right
    const PILL_LENGTH = 14
    const PILL_THICKNESS = 4
    const WOBBLE_AMP = 9
    const ROTATION_AMP = 0.22

    let raf = 0
    let running = true
    let dpr = window.devicePixelRatio || 1

    // Cursor reactivity. mxRaw/myRaw are the live target values normalized to
    // -1..1 across the canvas; mxSmooth/mySmooth lerp toward them each frame
    // so the response feels weighted, not jittery.
    let mxRaw = 0
    let myRaw = 0
    let mxSmooth = 0
    let mySmooth = 0

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.max(1, Math.floor(rect.width * dpr))
      canvas.height = Math.max(1, Math.floor(rect.height * dpr))
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function draw(time: number) {
      if (!canvas) return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      ctx!.clearRect(0, 0, w, h)

      // Ease the smoothed cursor toward the raw target.
      mxSmooth += (mxRaw - mxSmooth) * 0.08
      mySmooth += (myRaw - mySmooth) * 0.08

      // Arc focal point — sits low and slightly right so the arc sweeps up
      // and across, like Josh's. Adjust if hero layout changes.
      // Apply a subtle cursor parallax so the whole arc drifts toward the
      // mouse — keeps the structure intact while feeling reactive.
      const cx = w * 0.5 + mxSmooth * 22
      const cy = h * 0.9 + mySmooth * 14
      const innerRadius = Math.min(w, h) * 0.18
      const outerRadius = Math.max(w, h) * 0.95

      // Cursor energy: distance of cursor from canvas center, 0..~1.5.
      // Used to subtly amp up the wave when the user is moving around.
      const cursorEnergy = Math.min(1.5, Math.hypot(mxSmooth, mySmooth))
      const wobbleAmp = WOBBLE_AMP + cursorEnergy * 8
      // Tilt offset: pills lean in the cursor's direction.
      const cursorTiltX = mxSmooth * 0.18
      const cursorTiltY = mySmooth * 0.12

      const t = time * 0.0006

      for (let ring = 0; ring < RINGS; ring++) {
        const ringT = ring / (RINGS - 1)
        const radius = innerRadius + ringT * (outerRadius - innerRadius)
        const color = COLORS[ring % COLORS.length]
        const ringPhase = ring * 0.42 + t

        for (let p = 0; p < PILLS_PER_RING; p++) {
          const pT = p / (PILLS_PER_RING - 1)
          // Each ring drifts slightly so the bands feel like flowing ribbons.
          const angle = ARC_START - pT * ARC_SPAN + Math.sin(ringPhase) * 0.04

          // Radial wobble per pill, phased by angle so it looks like a wave.
          const wobble = Math.sin(t * 1.6 + ringPhase + angle * 3) * wobbleAmp
          const r = radius + wobble

          const x = cx + Math.cos(angle) * r
          const y = cy + Math.sin(angle) * r

          // Tilt off-tangent for the chevron/dynamic feel, plus a small
          // cursor-direction lean weighted by ring index so the outer
          // ribbons sweep more than the inner ones.
          const tilt =
            angle +
            Math.PI / 2 +
            Math.sin(t * 1.2 + p * 0.4 + ring * 0.5) * ROTATION_AMP +
            (cursorTiltX * Math.cos(angle) + cursorTiltY * Math.sin(angle)) * (0.5 + ringT * 0.8)

          ctx!.save()
          ctx!.translate(x, y)
          ctx!.rotate(tilt)
          ctx!.fillStyle = color
          ctx!.globalAlpha = 0.95
          if ((ctx as CanvasRenderingContext2D & { roundRect?: Function }).roundRect) {
            ctx!.beginPath()
            ;(ctx as CanvasRenderingContext2D).roundRect(
              -PILL_LENGTH / 2,
              -PILL_THICKNESS / 2,
              PILL_LENGTH,
              PILL_THICKNESS,
              PILL_THICKNESS / 2,
            )
            ctx!.fill()
          } else {
            // Fallback for older browsers without roundRect
            ctx!.fillRect(-PILL_LENGTH / 2, -PILL_THICKNESS / 2, PILL_LENGTH, PILL_THICKNESS)
          }
          ctx!.restore()
        }
      }
      ctx!.globalAlpha = 1
    }

    function loop(time: number) {
      if (!running) return
      draw(time)
      raf = requestAnimationFrame(loop)
    }

    resize()

    if (prefersReduced) {
      draw(0)
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

    // Canvas has pointer-events: none so it never blocks underlying UI.
    // Listen on window instead so we still react to cursor movement anywhere
    // over the hero (and the rest of the page — feels alive when scrolling
    // past too).
    const onPointerMove = (e: PointerEvent) => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      // Skip non-mouse pointers (touch users get the gentle drift back to
      // center instead).
      if (e.pointerType !== 'mouse') return
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height
      // Map to -1..1, clamped lightly so off-canvas cursor still nudges.
      mxRaw = Math.max(-1.5, Math.min(1.5, px * 2 - 1))
      myRaw = Math.max(-1.5, Math.min(1.5, py * 2 - 1))
    }
    const onPointerLeave = () => {
      // Drift back to the resting position when the cursor leaves the page.
      mxRaw = 0
      myRaw = 0
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.fadeTop} />
      <div className={styles.fadeBottom} />
    </div>
  )
}
