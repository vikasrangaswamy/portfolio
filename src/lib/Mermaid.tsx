import { useEffect, useRef, useState } from 'react'

let idCounter = 0

type Theme = 'light' | 'dark'

/**
 * Mermaid renderer with a warm pastel theme + casual font.
 *
 * Tried `look: 'handDrawn'` first (rough-js) but its diagonal hachure
 * fills looked terrible on the dark page background, and stripping them
 * post-render was fragile. Dropped it in favor of plain Mermaid with a
 * theme-aware color palette so node fills, text, and lines all swap with
 * the page's data-theme. Without this, edge labels and lines were
 * rendering near-black on the dark page background and disappearing.
 *
 * Watches `html[data-theme]` and re-renders whenever the user toggles
 * the theme.
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
        })
        .catch((err: unknown) => {
          if (!cancelled) setError(String(err))
        })
    }

    run()

    // Re-render on theme toggle. The useTheme hook flips the
    // html[data-theme] attribute; we watch for it.
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
 * Theme-aware palette. Boxes always use a warm tint so the diagrams stay
 * on-brand, but the tint inverts between light and dark modes so the
 * contained text remains readable. Page-color tokens (edge label bg, line
 * color) follow the page's dark/light state directly.
 */
function buildThemeVars(theme: Theme) {
  const font =
    '"Patrick Hand", "Caveat", "Comic Sans MS", "Inter", sans-serif'

  if (theme === 'dark') {
    return {
      fontFamily: font,
      fontSize: '16px',
      // Warm dark brown box fill — reads as "peach but in dark mode"
      primaryColor: '#4A3326',
      primaryTextColor: '#F0EEE6',
      primaryBorderColor: '#C5C3BB',
      secondaryColor: '#2D3E4A',
      tertiaryColor: '#3D4630',
      lineColor: '#C5C3BB',
      textColor: '#F0EEE6',
      mainBkg: '#4A3326',
      edgeLabelBackground: '#2A2A26',
      tertiaryTextColor: '#F0EEE6',
      secondaryTextColor: '#F0EEE6',
      clusterBkg: '#2E2E2A',
      clusterBorder: '#3D3D3A',
      nodeBorder: '#C5C3BB',
      titleColor: '#F0EEE6',
    }
  }

  return {
    fontFamily: font,
    fontSize: '16px',
    primaryColor: '#FCE5D2',
    primaryTextColor: '#3D3D3A',
    primaryBorderColor: '#3D3D3A',
    secondaryColor: '#D9E8F2',
    tertiaryColor: '#E7F0DC',
    lineColor: '#3D3D3A',
    textColor: '#3D3D3A',
    mainBkg: '#FCE5D2',
    edgeLabelBackground: '#FAF9F5',
    tertiaryTextColor: '#3D3D3A',
    secondaryTextColor: '#3D3D3A',
    clusterBkg: '#F0EEE6',
    clusterBorder: '#D1CFC5',
    nodeBorder: '#3D3D3A',
    titleColor: '#3D3D3A',
  }
}
