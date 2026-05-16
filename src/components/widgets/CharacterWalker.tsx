import { useEffect, useRef, useState } from 'react'
import { useSound } from '../../lib/sound'
import styles from './CharacterWalker.module.css'

type Props = {
  /** Path to a horizontal sprite sheet with `frameCount` frames of the walk cycle. */
  spriteSrc?: string
  /** Number of frames in the walk sprite sheet. Each frame must be the same width. */
  frameCount?: number
  /** Pixels per second the character walks. */
  walkSpeed?: number
  /** How long a single sprite frame stays on screen, in ms. */
  frameDuration?: number
  /** Character height in CSS pixels (width auto-derived from frame aspect). */
  height?: number
}

/**
 * Playdead-style character walking back and forth along the bottom of its
 * parent. Click the character to make it jump.
 *
 * Drop a horizontal walk-cycle sprite sheet at `public/character/walk.png`
 * (default `spriteSrc`) — N frames wide, all the same width. The component
 * cycles them by adjusting `background-position-x`. While `spriteSrc` is
 * missing/loading/404, an inline SVG silhouette stands in so the page still
 * looks intentional.
 */
export function CharacterWalker({
  spriteSrc = `${import.meta.env.BASE_URL}character/walk.png`,
  frameCount = 4,
  walkSpeed = 70,
  frameDuration = 130,
  height = 96,
}: Props = {}) {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const charRef = useRef<HTMLButtonElement | null>(null)
  const stateRef = useRef({
    x: 40,
    dir: 1 as 1 | -1,
    frame: 0,
    lastFrameAt: 0,
    jumpStart: null as number | null,
  })
  const [spriteOk, setSpriteOk] = useState(true)
  const [spriteSize, setSpriteSize] = useState<{ w: number; h: number } | null>(null)

  // Preload the sprite once so we know its natural dimensions (for aspect ratio)
  // and whether it actually exists.
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.onload = () => {
      if (cancelled) return
      setSpriteOk(true)
      setSpriteSize({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.onerror = () => {
      if (cancelled) return
      setSpriteOk(false)
      setSpriteSize(null)
    }
    img.src = spriteSrc
    return () => {
      cancelled = true
    }
  }, [spriteSrc])

  useEffect(() => {
    const wrap = wrapRef.current
    const ch = charRef.current
    if (!wrap || !ch) return

    let raf = 0
    let last = performance.now()
    const JUMP_HEIGHT = 60
    const JUMP_DURATION = 600

    function tick(now: number) {
      const dt = Math.min(100, now - last)
      last = now
      const s = stateRef.current

      // Walk
      const w = wrap!.clientWidth
      const charW = ch!.offsetWidth
      const margin = 20
      const maxX = Math.max(margin, w - charW - margin)
      s.x += s.dir * walkSpeed * (dt / 1000)
      if (s.x >= maxX) {
        s.x = maxX
        s.dir = -1
      } else if (s.x <= margin) {
        s.x = margin
        s.dir = 1
      }

      // Sprite frame advance — only matters when there's a sprite sheet.
      if (now - s.lastFrameAt >= frameDuration) {
        s.frame = (s.frame + 1) % frameCount
        s.lastFrameAt = now
      }

      // Jump arc (parabola peaking at the midpoint).
      let jumpY = 0
      if (s.jumpStart !== null) {
        const t = (now - s.jumpStart) / JUMP_DURATION
        if (t >= 1) {
          s.jumpStart = null
        } else {
          jumpY = -JUMP_HEIGHT * 4 * t * (1 - t)
        }
      }

      // Mirror the sprite based on direction so the character actually faces
      // where it's walking.
      const flip = s.dir === 1 ? 1 : -1
      ch!.style.transform = `translate3d(${s.x}px, ${jumpY}px, 0) scaleX(${flip})`

      // Sprite-sheet frame via background-position-x.
      if (spriteOk && spriteSize) {
        const frameW = spriteSize.w / frameCount
        ch!.style.backgroundPosition = `-${s.frame * frameW}px 0`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [walkSpeed, frameDuration, frameCount, spriteOk, spriteSize])

  const { play } = useSound()
  const handleClick = () => {
    const s = stateRef.current
    if (s.jumpStart !== null) return // ignore double-clicks mid-jump
    s.jumpStart = performance.now()
    play('jump', 0.9)
  }

  // Background-image style only applied when the sprite loaded successfully.
  const charStyle: React.CSSProperties = spriteOk && spriteSize
    ? {
        width: `${(spriteSize.w / frameCount) * (height / spriteSize.h)}px`,
        height: `${height}px`,
        backgroundImage: `url(${spriteSrc})`,
        backgroundSize: `${(spriteSize.w * height) / spriteSize.h}px ${height}px`,
        backgroundRepeat: 'no-repeat',
      }
    : {
        width: `${height * 0.55}px`,
        height: `${height}px`,
      }

  return (
    <div className={styles.wrap} ref={wrapRef} aria-hidden="true">
      <div className={styles.ground} />
      <button
        type="button"
        ref={charRef}
        className={styles.character}
        onClick={handleClick}
        aria-label="Make the character jump"
        data-no-sound
        style={charStyle as React.CSSProperties}
      >
        {!spriteOk && <FallbackSilhouette />}
      </button>
    </div>
  )
}

/** Tiny inline silhouette shown while the real sprite sheet isn't in place. */
function FallbackSilhouette() {
  return (
    <svg
      viewBox="0 0 40 72"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {/* head */}
      <ellipse cx="20" cy="10" rx="7" ry="8" fill="var(--slate)" />
      {/* torso (red shirt nod to the reference) */}
      <path
        d="M12 18 Q12 16 14 16 L26 16 Q28 16 28 18 L27 38 Q27 40 25 40 L15 40 Q13 40 13 38 Z"
        fill="#B04A4A"
      />
      {/* arms */}
      <rect x="9" y="20" width="4" height="14" rx="2" fill="#B04A4A" />
      <rect x="27" y="20" width="4" height="14" rx="2" fill="#B04A4A" />
      {/* legs (dark) */}
      <rect x="14" y="40" width="5" height="22" rx="2" fill="var(--slate)" />
      <rect x="21" y="40" width="5" height="22" rx="2" fill="var(--slate)" />
      {/* feet */}
      <rect x="13" y="62" width="8" height="4" rx="1.5" fill="var(--slate)" />
      <rect x="20" y="62" width="8" height="4" rx="1.5" fill="var(--slate)" />
    </svg>
  )
}
