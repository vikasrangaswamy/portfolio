import { useEffect, useRef, useState } from 'react'

type Theme = 'light' | 'dark'

/**
 * Excalidraw-rendered Mermaid diagrams.
 *
 * Authoring stays in Mermaid syntax (so existing MDX is unchanged), but the
 * render path goes through Excalidraw's actual engine via
 * @excalidraw/mermaid-to-excalidraw + @excalidraw/excalidraw's `exportToSvg`.
 * That gives us the real hand-drawn shapes you see in the Excalidraw editor.
 *
 * After parsing, we walk the resulting elements and force a two-tone palette
 * matching the rest of the site:
 *   - Light theme: solid near-black nodes with cream text; clusters are
 *     outline-only on the page bg; arrows + edge labels near-black.
 *   - Dark theme: solid warm light-grey nodes with near-black text; clusters
 *     outline-only on the dark page; arrows + edge labels near-white.
 *
 * Both packages are dynamically imported so the heavy Excalidraw bundle stays
 * out of the main JS chunk.
 */

const PALETTE: Record<Theme, {
  node: string
  text: string
  edge: string
  edgeText: string
  clusterStroke: string
}> = {
  light: {
    node: '#141413',
    text: '#FAF9F5',
    edge: '#141413',
    edgeText: '#141413',
    clusterStroke: '#141413',
  },
  dark: {
    node: '#D1CFC5',
    text: '#141413',
    edge: '#F0EEE6',
    edgeText: '#F0EEE6',
    clusterStroke: '#F0EEE6',
  },
}

type AnyEl = Record<string, unknown> & { type: string }

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const render = async () => {
      const theme: Theme =
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
      const palette = PALETTE[theme]

      try {
        const [m2eMod, exMod] = await Promise.all([
          import('@excalidraw/mermaid-to-excalidraw'),
          import('@excalidraw/excalidraw'),
        ])

        const { elements: skeletons, files } = await m2eMod.parseMermaidToExcalidraw(chart, {
          themeVariables: { fontSize: '18px' },
          flowchart: { curve: 'basis' },
        })

        const elements = exMod.convertToExcalidrawElements(skeletons) as unknown as AnyEl[]

        // Recolor every element to the two-tone palette. Clusters are detected
        // by absent / transparent backgroundColor (Mermaid emits subgraph
        // containers without a fill). Nodes get filled + stroked the same
        // colour so the wavy outline blends with the body.
        for (const el of elements) {
          if (el.type === 'text') {
            // Text sitting inside a labelled container is a node label; text
            // floating with no containerId is an edge label.
            const inContainer = typeof el.containerId === 'string' && !!el.containerId
            el.strokeColor = inContainer ? palette.text : palette.edgeText
          } else if (
            el.type === 'rectangle' ||
            el.type === 'ellipse' ||
            el.type === 'diamond'
          ) {
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
          exportPadding: 18,
        })

        if (cancelled || !ref.current) return
        svg.style.maxWidth = '100%'
        svg.style.height = 'auto'
        svg.style.display = 'block'
        svg.style.margin = '0 auto'
        ref.current.innerHTML = ''
        ref.current.appendChild(svg)
      } catch (err: unknown) {
        if (!cancelled) setError(String(err))
      }
    }

    void render()

    const observer = new MutationObserver(() => {
      void render()
    })
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
        Diagram error: {error}
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
