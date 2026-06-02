import { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Mermaid.module.css'

type Theme = 'light' | 'dark'

const PALETTE: Record<Theme, {
  node: string
  nodeText: string
  edge: string
  edgeText: string
  edgeTextBg: string
  clusterStroke: string
}> = {
  light: {
    node: '#141413',
    nodeText: '#FAF9F5',
    edge: '#141413',
    edgeText: '#141413',
    edgeTextBg: '#FAF9F5',
    clusterStroke: '#141413',
  },
  dark: {
    node: '#D1CFC5',
    nodeText: '#141413',
    edge: '#F0EEE6',
    edgeText: '#F0EEE6',
    edgeTextBg: '#1A1A18',
    clusterStroke: '#F0EEE6',
  },
}

type AnyEl = Record<string, unknown> & {
  type: string
  x?: number
  y?: number
  width?: number
  height?: number
}

const NODE_SHAPES = new Set(['rectangle', 'ellipse', 'diamond'])

/** Font size used for both the mermaid layout pass AND the Excalidraw text
 *  elements after conversion. Keeping these in sync is the whole reason
 *  labels fit inside boxes without any post-hoc container inflation. */
const FONT_SIZE = 16

function pointInside(el: AnyEl, cx: number, cy: number): boolean {
  const x = el.x ?? 0
  const y = el.y ?? 0
  const w = el.width ?? 0
  const h = el.height ?? 0
  return cx >= x && cx <= x + w && cy >= y && cy <= y + h
}

type PanzoomInstance = {
  dispose: () => void
  smoothZoom: (cx: number, cy: number, scale: number) => void
  moveTo: (x: number, y: number) => void
  zoomAbs: (cx: number, cy: number, scale: number) => void
  getTransform: () => { scale: number; x: number; y: number }
}

export function Mermaid({ chart }: { chart: string }) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const panzoomRef = useRef<PanzoomInstance | null>(null)

  const render = useCallback(async () => {
    const theme: Theme =
      document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
    const palette = PALETTE[theme]

    try {
      const [m2eMod, exMod] = await Promise.all([
        import('@excalidraw/mermaid-to-excalidraw'),
        import('@excalidraw/excalidraw'),
      ])

      const { elements: skeletons, files } = await m2eMod.parseMermaidToExcalidraw(
        chart,
        {
          // Match Excalidraw's text fontSize below so boxes are sized for
          // exactly the text that ends up inside them.
          themeVariables: { fontSize: `${FONT_SIZE}px` },
          flowchart: { curve: 'basis' },
        },
      )

      const elements = exMod.convertToExcalidrawElements(skeletons) as unknown as AnyEl[]

      // First pass — pick out the filled "node" shapes (vs unfilled clusters).
      const filledNodes: AnyEl[] = []
      for (const el of elements) {
        if (!NODE_SHAPES.has(el.type)) continue
        const bg = (el.backgroundColor as string | undefined) ?? ''
        const isCluster = !bg || bg === 'transparent'
        if (!isCluster) filledNodes.push(el)
      }

      // Second pass — recolour every element + pin text fontSize to FONT_SIZE
      // so it matches what mermaid sized the boxes for.
      for (const el of elements) {
        if (el.type === 'text') {
          const cx = (el.x ?? 0) + (el.width ?? 0) / 2
          const cy = (el.y ?? 0) + (el.height ?? 0) / 2
          const onFilledNode = filledNodes.some((node) => pointInside(node, cx, cy))

          if (onFilledNode) {
            el.strokeColor = palette.nodeText
            el.backgroundColor = 'transparent'
          } else {
            // Edge label — page-coloured backing so it reads over the arrow.
            el.strokeColor = palette.edgeText
            el.backgroundColor = palette.edgeTextBg
          }
          el.fontSize = FONT_SIZE
        } else if (NODE_SHAPES.has(el.type)) {
          const bg = (el.backgroundColor as string | undefined) ?? ''
          const isCluster = !bg || bg === 'transparent'
          if (isCluster) {
            el.backgroundColor = 'transparent'
            el.strokeColor = palette.clusterStroke
          } else {
            el.backgroundColor = palette.node
            el.strokeColor = palette.node
          }
          el.fillStyle = 'solid'
        } else if (el.type === 'arrow' || el.type === 'line') {
          el.strokeColor = palette.edge
        }
      }

      const svg = await exMod.exportToSvg({
        elements: elements as unknown as Parameters<typeof exMod.exportToSvg>[0]['elements'],
        appState: {
          exportBackground: false,
          viewBackgroundColor: 'transparent',
          theme: theme === 'dark' ? exMod.THEME.DARK : exMod.THEME.LIGHT,
        },
        files: files ?? null,
        // Generous padding so the diagram doesn't kiss the viewer edges.
        exportPadding: 22,
      })

      // Make the SVG fill the viewer; pan-zoom will scale it from there.
      svg.setAttribute('width', '100%')
      svg.setAttribute('height', '100%')
      svg.style.display = 'block'

      const xml = new XMLSerializer().serializeToString(svg)
      setSvgMarkup(xml)
    } catch (err: unknown) {
      setError(String(err))
    }
  }, [chart])

  // Initial + theme-change re-render.
  useEffect(() => {
    void render()
    const observer = new MutationObserver(() => {
      void render()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })
    return () => observer.disconnect()
  }, [render])

  // Initialize panzoom whenever the SVG markup changes. Disposes any prior
  // instance so theme-toggle re-renders don't stack listeners.
  useEffect(() => {
    if (!svgMarkup || !containerRef.current) return
    const svg = containerRef.current.querySelector('svg') as SVGSVGElement | null
    if (!svg) return

    let disposed = false
    let instance: PanzoomInstance | null = null

    void import('panzoom').then((mod) => {
      if (disposed) return
      const panzoom = mod.default as unknown as (
        el: SVGSVGElement | HTMLElement,
        opts?: Record<string, unknown>,
      ) => PanzoomInstance
      instance = panzoom(svg, {
        bounds: false,
        maxZoom: 4,
        minZoom: 0.4,
        smoothScroll: false,
        zoomDoubleClickSpeed: 1, // disable double-click-to-zoom
      })
      panzoomRef.current = instance
    })

    return () => {
      disposed = true
      instance?.dispose()
      panzoomRef.current = null
    }
  }, [svgMarkup])

  const zoomBy = (factor: number) => {
    const inst = panzoomRef.current
    const el = containerRef.current
    if (!inst || !el) return
    const rect = el.getBoundingClientRect()
    inst.smoothZoom(rect.width / 2, rect.height / 2, factor)
  }

  const reset = () => {
    const inst = panzoomRef.current
    if (!inst) return
    inst.moveTo(0, 0)
    inst.zoomAbs(0, 0, 1)
  }

  if (error) {
    return <pre className={styles.error}>Diagram error: {error}</pre>
  }

  return (
    <div className={styles.viewer}>
      <div
        ref={containerRef}
        className={styles.canvas}
        dangerouslySetInnerHTML={{ __html: svgMarkup ?? '' }}
      />
      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => zoomBy(0.66)}
          aria-label="Zoom out"
          title="Zoom out"
          data-no-sound
        >
          −
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="Reset view"
          title="Reset view"
          data-no-sound
        >
          ⟲
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1.5)}
          aria-label="Zoom in"
          title="Zoom in"
          data-no-sound
        >
          +
        </button>
      </div>
      <div className={styles.hint} aria-hidden="true">
        drag · scroll to zoom
      </div>
    </div>
  )
}
