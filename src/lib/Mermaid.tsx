import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

/**
 * Returns true when (cx, cy) lies inside the element's bounding box.
 * Used to decide if a text element sits on top of a filled node — those need
 * the contrast-to-fill colour, vs floating edge labels which need the
 * contrast-to-page colour.
 */
function pointInside(el: AnyEl, cx: number, cy: number): boolean {
  const x = el.x ?? 0
  const y = el.y ?? 0
  const w = el.width ?? 0
  const h = el.height ?? 0
  return cx >= x && cx <= x + w && cy >= y && cy <= y + h
}

export function Mermaid({ chart }: { chart: string }) {
  const [svgMarkup, setSvgMarkup] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const lastChartRef = useRef<string>('')

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
          themeVariables: { fontSize: '14px' },
          flowchart: { curve: 'basis' },
        },
      )

      const elements = exMod.convertToExcalidrawElements(skeletons) as unknown as AnyEl[]

      // First pass: identify filled "node" shapes (vs unfilled "cluster" wrappers).
      const filledNodes: AnyEl[] = []
      for (const el of elements) {
        if (!NODE_SHAPES.has(el.type)) continue
        const bg = (el.backgroundColor as string | undefined) ?? ''
        const isCluster = !bg || bg === 'transparent'
        if (!isCluster) filledNodes.push(el)
      }

      // Second pass: recolour every element + inflate text-cramped containers.
      for (const el of elements) {
        if (el.type === 'text') {
          const cx = (el.x ?? 0) + (el.width ?? 0) / 2
          const cy = (el.y ?? 0) + (el.height ?? 0) / 2
          const onFilledNode = filledNodes.some((node) => pointInside(node, cx, cy))

          if (onFilledNode) {
            el.strokeColor = palette.nodeText
            // No background so the fill of the node shows behind the text
            el.backgroundColor = 'transparent'
          } else {
            // Floating edge label — give it a page-coloured backing so it
            // reads over the arrow line behind it.
            el.strokeColor = palette.edgeText
            el.backgroundColor = palette.edgeTextBg
          }
          // Shrink slightly so text fits inside Mermaid-sized boxes.
          if (typeof el.fontSize === 'number') {
            el.fontSize = Math.min(el.fontSize as number, 16)
          }
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

      // Third pass: if a text element is wider/taller than its container,
      // grow the container so the label sits comfortably inside.
      const containerById = new Map<string, AnyEl>()
      for (const el of elements) {
        const id = el.id as string | undefined
        if (id && NODE_SHAPES.has(el.type)) containerById.set(id, el)
      }
      const PAD = 12
      for (const el of elements) {
        if (el.type !== 'text') continue
        const containerId = el.containerId as string | undefined
        const container = containerId ? containerById.get(containerId) : undefined
        if (!container) continue
        const textW = el.width ?? 0
        const textH = el.height ?? 0
        if (textW + PAD * 2 > (container.width ?? 0)) {
          container.width = textW + PAD * 2
        }
        if (textH + PAD * 2 > (container.height ?? 0)) {
          container.height = textH + PAD * 2
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
        exportPadding: 14,
      })

      const xml = new XMLSerializer().serializeToString(svg)
      setSvgMarkup(xml)
      lastChartRef.current = chart
    } catch (err: unknown) {
      setError(String(err))
    }
  }, [chart])

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

  // Close modal on Escape.
  useEffect(() => {
    if (!expanded) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  if (error) {
    return (
      <pre className={styles.error}>Diagram error: {error}</pre>
    )
  }

  if (!svgMarkup) {
    return <div className={styles.placeholder} aria-hidden="true" />
  }

  return (
    <>
      <button
        type="button"
        className={styles.thumb}
        onClick={() => setExpanded(true)}
        aria-label="Open diagram fullscreen"
        title="Click to zoom"
        data-no-sound
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
      {expanded &&
        createPortal(
          <div
            className={styles.modal}
            onClick={() => setExpanded(false)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className={styles.close}
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(false)
              }}
              data-no-sound
              aria-label="Close diagram"
            >
              ×
            </button>
            <div
              className={styles.modalSvg}
              onClick={(e) => e.stopPropagation()}
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
