import { useEffect, useRef, useState } from 'react'

let idCounter = 0

/**
 * Hand-drawn / Excalidraw-style Mermaid renderer.
 *
 * Mermaid 10.4+ supports `look: 'handDrawn'` (rough-js under the hood) which
 * makes flowcharts read like a whiteboard sketch instead of a corporate
 * powerpoint. Paired with a warm pastel palette so diagrams feel like part
 * of the page, not a black-and-white tech-doc figure.
 *
 * `handDrawnSeed` keeps the rough strokes deterministic across re-renders so
 * theme/route toggles don't redraw the lines every time.
 *
 * The default rough-js fillStyle is 'hachure' (diagonal hatch lines), which
 * looks busy on dark backgrounds. We post-process the rendered SVG to swap
 * those hatch fills for a solid pastel fill while keeping the hand-drawn
 * stroke outline intact.
 */
export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++idCounter}`

    void import('mermaid')
      .then(async ({ default: mermaid }) => {
        if (cancelled) return null
        mermaid.initialize({
          startOnLoad: false,
          look: 'handDrawn',
          handDrawnSeed: 1,
          theme: 'base',
          themeVariables: {
            fontFamily: '"Comic Sans MS", "Patrick Hand", "Caveat", "Inter", sans-serif',
            fontSize: '15px',
            primaryColor: '#FCE5D2',
            primaryTextColor: '#3D3D3A',
            primaryBorderColor: '#3D3D3A',
            secondaryColor: '#D9E8F2',
            tertiaryColor: '#E7F0DC',
            lineColor: '#3D3D3A',
            textColor: '#3D3D3A',
            mainBkg: '#FCE5D2',
            edgeLabelBackground: '#FAF9F5',
            clusterBkg: '#F0EEE6',
            clusterBorder: '#D1CFC5',
          },
          flowchart: { curve: 'basis', htmlLabels: true, padding: 12 },
          sequence: { mirrorActors: false, useMaxWidth: true },
        })
        return mermaid.render(id, chart)
      })
      .then((result) => {
        if (cancelled || !result || !ref.current) return
        ref.current.innerHTML = result.svg
        stripHachureFills(ref.current)
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(String(err))
      })

    return () => {
      cancelled = true
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
 * Replace rough-js hachure fill paths with solid pastel fills.
 *
 * Each handDrawn node renders as several short stroke paths (the hatching)
 * followed by a final outline path. We keep the outline (it's what gives the
 * sketch feel) and drop the rest, then apply a solid fill to the outline.
 * Run after every render — the SVG is re-generated each time.
 */
function stripHachureFills(host: HTMLElement) {
  const svg = host.querySelector('svg')
  if (!svg) return

  // Flowchart / state / class diagrams all use `.node` wrappers. Each node
  // contains a group of <path> elements rendered by rough-js. The last path
  // is conventionally the outline; everything before it is hachure fill.
  svg.querySelectorAll<SVGElement>('g.node, g.cluster').forEach((node) => {
    const paths = Array.from(node.querySelectorAll<SVGPathElement>('path'))
    if (paths.length <= 1) return

    const outline = paths[paths.length - 1]
    if (!outline) return

    // Drop every hachure stroke path; keep only the outline.
    for (let i = 0; i < paths.length - 1; i++) {
      const path = paths[i]
      if (path) path.remove()
    }

    // The outline currently has fill="none" (since rough-js draws fills as
    // separate hachure paths). Promote it to a solid filled shape.
    const isCluster = node.classList.contains('cluster')
    const fill = isCluster ? '#F0EEE6' : outline.dataset.fillColor || '#FCE5D2'
    outline.setAttribute('fill', fill)
    outline.setAttribute('fill-opacity', '1')
  })
}
