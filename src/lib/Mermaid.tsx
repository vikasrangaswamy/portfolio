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

  // Excalidraw-style high-contrast: light mode = solid dark nodes with light
  // text; dark mode = solid light nodes with dark text. Cluster wrappers
  // sit on the page background so they blend in (the wavy outline shows the
  // grouping).
  const nodeFill = theme === 'dark' ? '#D1CFC5' : '#141413'
  const clusterFill = theme === 'dark' ? '#1A1A18' : '#FAF9F5'

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

  // Dark mode — page is near-black, nodes are warm light-grey (#D1CFC5)
  // with near-black text. Edges + arrows + general text are near-white so
  // they read on the dark page bg.
  if (theme === 'dark') {
    const node = '#D1CFC5'
    const ink = '#141413'
    const lineInk = '#F0EEE6'
    const pageBg = '#1A1A18'
    return {
      fontFamily: font,
      fontSize: '16px',
      primaryColor: node,
      primaryTextColor: ink,
      primaryBorderColor: node,
      secondaryColor: node,
      tertiaryColor: node,
      lineColor: lineInk,
      textColor: lineInk,
      mainBkg: node,
      edgeLabelBackground: pageBg,
      tertiaryTextColor: ink,
      secondaryTextColor: ink,
      clusterBkg: pageBg,
      clusterBorder: lineInk,
      nodeBorder: node,
      titleColor: lineInk,
    }
  }

  // Light mode — page is cream, nodes are near-black with cream text.
  // Edges, arrows, and titles are near-black so they read on the page bg.
  const node = '#141413'
  const ink = '#FAF9F5'
  const lineInk = '#141413'
  const pageBg = '#FAF9F5'
  return {
    fontFamily: font,
    fontSize: '16px',
    primaryColor: node,
    primaryTextColor: ink,
    primaryBorderColor: node,
    secondaryColor: node,
    tertiaryColor: node,
    lineColor: lineInk,
    textColor: lineInk,
    mainBkg: node,
    edgeLabelBackground: pageBg,
    tertiaryTextColor: ink,
    secondaryTextColor: ink,
    clusterBkg: pageBg,
    clusterBorder: lineInk,
    nodeBorder: node,
    titleColor: lineInk,
  }
}
