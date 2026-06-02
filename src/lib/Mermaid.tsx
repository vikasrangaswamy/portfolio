import { useEffect, useRef, useState } from 'react'

let idCounter = 0

type Theme = 'light' | 'dark'

/**
 * Excalidraw-style Mermaid renderer.
 *
 * Uses `look: 'handDrawn'` to get rough-js's wavy hand-drawn outlines, then
 * strips the diagonal hachure fills that rough-js paints inside every node
 * (those looked extremely busy, especially in dark mode). The outline path
 * is kept and given a solid pastel fill so each box ends up as a clean
 * colored shape with a sketch-y border.
 *
 * Stripping strategy: for every shape group (g.node, g.cluster), find the
 * <path> with the longest total length — that's the outline (it traces the
 * whole perimeter). Remove every other path (those are single-line hachure
 * strokes) and apply a solid fill to the outline.
 *
 * Theme-aware: watches `html[data-theme]` and re-renders on toggle so
 * dark-mode boxes use deep warm-brown fills with light text, not peach
 * with near-invisible dark text.
 */
export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const run = () => {
      const theme: Theme =
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      const id = `mermaid-${++idCounter}`

      void import('mermaid')
        .then(async ({ default: mermaid }) => {
          if (cancelled) return null
          mermaid.initialize({
            startOnLoad: false,
            look: 'handDrawn',
            handDrawnSeed: 1,
            theme: 'base',
            themeVariables: buildThemeVars(theme),
            flowchart: { curve: 'basis', htmlLabels: true, padding: 14 },
            sequence: { mirrorActors: false, useMaxWidth: true },
          })
          return mermaid.render(id, chart)
        })
        .then((result) => {
          if (cancelled || !result || !ref.current) return
          ref.current.innerHTML = result.svg
          stripHachureFills(ref.current, theme)
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(String(err))
        })
    }

    run()

    const observer = new MutationObserver(run)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [chart])

  if (error) {
    return (
      <pre style={{ color: 'var(--danger)', fontSize: 12, padding: 'var(--sp-3)' }}>
        Mermaid error: {error}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      style={{
        margin: 'var(--sp-6) 0',
        padding: 'var(--sp-5)',
        background: 'transparent',
        overflowX: 'auto',
        textAlign: 'center',
      }}
    />
  )
}

/**
 * Removes rough-js hachure fills, leaves only the wavy outline (now solid-
 * filled). Identifies the outline as the path with the longest total length
 * inside each shape group — perimeter-tracing path is always far longer
 * than any single hachure stroke.
 */
function stripHachureFills(host: HTMLElement, theme: Theme) {
  const svg = host.querySelector<SVGSVGElement>('svg')
  if (!svg) return

  // Monochrome: white-on-black for dark, black-on-white for light. Cluster
  // gets a fractionally different shade so nested clusters stay readable.
  const nodeFill = theme === 'dark' ? '#1A1A18' : '#FFFFFF'
  const clusterFill = theme === 'dark' ? '#242421' : '#F5F4EE'

  // g.node / g.cluster wrap flowchart shapes. For state diagrams, .state
  // wraps each state. Casting a wide net so all common shape groups get
  // cleaned up.
  const groups = svg.querySelectorAll<SVGGElement>(
    'g.node, g.cluster, g.state, g.statediagram-state',
  )

  groups.forEach((group) => {
    const paths = Array.from(group.querySelectorAll<SVGPathElement>('path'))
    if (paths.length === 0) return

    let outline: SVGPathElement | null = null
    let maxLen = -1
    for (const p of paths) {
      let len = 0
      try {
        len = p.getTotalLength()
      } catch {
        // getTotalLength throws on malformed paths; fall back to d length
        len = (p.getAttribute('d') ?? '').length
      }
      if (len > maxLen) {
        maxLen = len
        outline = p
      }
    }
    if (!outline) return

    for (const p of paths) {
      if (p !== outline) p.remove()
    }

    const isCluster = group.classList.contains('cluster')
    outline.setAttribute('fill', isCluster ? clusterFill : nodeFill)
    outline.setAttribute('fill-opacity', '1')
  })
}

function buildThemeVars(theme: Theme) {
  const font =
    '"Patrick Hand", "Caveat", "Comic Sans MS", "Inter", sans-serif'

  // Monochrome palette — everything is either near-black or near-white based
  // on theme. Nodes/secondary/tertiary all share the same fill so the
  // diagrams read as pure black-and-white sketches regardless of which node
  // role Mermaid picks for a given shape.
  if (theme === 'dark') {
    const ink = '#F0EEE6' // near-white
    const paper = '#1A1A18' // near-black
    const subtle = '#242421' // slightly lighter near-black for clusters
    return {
      fontFamily: font,
      fontSize: '16px',
      primaryColor: paper,
      primaryTextColor: ink,
      primaryBorderColor: ink,
      secondaryColor: paper,
      tertiaryColor: paper,
      lineColor: ink,
      textColor: ink,
      mainBkg: paper,
      edgeLabelBackground: paper,
      tertiaryTextColor: ink,
      secondaryTextColor: ink,
      clusterBkg: subtle,
      clusterBorder: ink,
      nodeBorder: ink,
      titleColor: ink,
    }
  }

  const ink = '#141413' // near-black
  const paper = '#FFFFFF' // white
  const subtle = '#F5F4EE' // slightly darker than white for clusters
  return {
    fontFamily: font,
    fontSize: '16px',
    primaryColor: paper,
    primaryTextColor: ink,
    primaryBorderColor: ink,
    secondaryColor: paper,
    tertiaryColor: paper,
    lineColor: ink,
    textColor: ink,
    mainBkg: paper,
    edgeLabelBackground: paper,
    tertiaryTextColor: ink,
    secondaryTextColor: ink,
    clusterBkg: subtle,
    clusterBorder: ink,
    nodeBorder: ink,
    titleColor: ink,
  }
}
