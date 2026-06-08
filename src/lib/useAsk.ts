import { useCallback, useRef, useState } from 'react'
import { ASK_ENDPOINT } from './askConfig'

export type Turn = { role: 'user' | 'assistant'; text: string; error?: boolean }

/**
 * The chat engine behind every "ask" surface (the embedded hero terminal and
 * the modal). Holds the transcript, calls the Cloudflare Worker, and streams
 * the Workers AI SSE response token-by-token into the last assistant turn.
 */
export function useAsk() {
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const reset = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setTurns([])
    setBusy(false)
  }, [])

  const ask = useCallback(
    async (question: string) => {
      const q = question.trim()
      if (!q || busy) return

      if (!ASK_ENDPOINT) {
        setTurns((t) => [
          ...t,
          { role: 'user', text: q },
          { role: 'assistant', text: "The assistant isn't wired up yet.", error: true },
        ])
        return
      }

      setBusy(true)
      setTurns((t) => [...t, { role: 'user', text: q }, { role: 'assistant', text: '' }])

      const controller = new AbortController()
      abortRef.current = controller

      const appendToLast = (chunk: string) =>
        setTurns((t) => {
          const next = [...t]
          const last = next[next.length - 1]
          if (last?.role === 'assistant') next[next.length - 1] = { ...last, text: last.text + chunk }
          return next
        })

      const failLast = (msg: string) =>
        setTurns((t) => {
          const next = [...t]
          next[next.length - 1] = { role: 'assistant', text: msg, error: true }
          return next
        })

      try {
        const res = await fetch(ASK_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: q }),
          signal: controller.signal,
        })

        if (!res.ok) {
          let msg = 'The assistant had trouble — try again.'
          if (res.status === 429) {
            const data = (await res.json().catch(() => null)) as { message?: string } | null
            msg = data?.message ?? 'The assistant is busy right now — please try again in a moment.'
          }
          failLast(msg)
          return
        }
        if (!res.body) {
          failLast('No response from the assistant.')
          return
        }

        // Parse the Workers AI SSE stream: lines of `data: {"response":"…"}`.
        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''
        let got = false
        for (;;) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''
          for (const line of lines) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const payload = trimmed.slice(5).trim()
            if (payload === '[DONE]') continue
            try {
              const obj = JSON.parse(payload) as { response?: string }
              if (obj.response) {
                appendToLast(obj.response)
                got = true
              }
            } catch {
              // ignore keep-alives / partial frames
            }
          }
        }
        if (!got) failLast('The assistant returned nothing — try rephrasing.')
      } catch (err) {
        if ((err as Error).name !== 'AbortError') failLast('Network error — try again.')
      } finally {
        setBusy(false)
        abortRef.current = null
      }
    },
    [busy],
  )

  return { turns, busy, ask, reset }
}
