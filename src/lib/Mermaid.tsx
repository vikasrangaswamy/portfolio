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
