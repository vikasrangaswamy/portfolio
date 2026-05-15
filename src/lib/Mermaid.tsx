import { useEffect, useRef, useState } from 'react'

let idCounter = 0

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const id = `mermaid-${++idCounter}`

    import('mermaid')
      .then(({ default: mermaid }) => {
        if (cancelled) return
        mermaid.initialize({
          startOnLoad: false,
          theme: 'neutral',
          fontFamily: 'Inter, sans-serif',
          flowchart: { curve: 'basis' },
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
        margin: 'var(--sp-5) 0',
        padding: 'var(--sp-5)',
        background: 'var(--white)',
        border: '1px solid var(--gray-300)',
        borderRadius: 'var(--r-md)',
        overflowX: 'auto',
        textAlign: 'center',
      }}
    />
  )
}
