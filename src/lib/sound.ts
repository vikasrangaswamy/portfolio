/**
 * Tiny Web Audio synth — joshwcomeau.com-style "boops" without shipping any audio files.
 * Sounds are intentionally muted, warm, and short to match the earth-tone palette.
 *
 * All synthesis happens on user interaction (browsers block autoplay), and a
 * shared AudioContext is created lazily so this file is safe to import on the
 * server.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type SoundName = 'boop' | 'pop' | 'click' | 'swish' | 'chord' | 'flurry'

let sharedCtx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (sharedCtx) return sharedCtx
  // Safari uses webkit prefix
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  sharedCtx = new Ctor()
  return sharedCtx
}

type Voice = {
  type: OscillatorType
  freq: number
  detune?: number
  /** seconds */
  duration: number
  /** 0..1 peak */
  gain: number
  /** seconds */
  attack?: number
  /** lowpass cutoff in Hz, optional */
  filter?: number
  /** start delay in seconds */
  delay?: number
}

const PRESETS: Record<SoundName, Voice[]> = {
  // Warm, short "pluck" — used for theme toggle. Sine + triangle mix, gentle envelope.
  boop: [
    { type: 'sine', freq: 392, duration: 0.22, gain: 0.18, attack: 0.005, filter: 1800 },
    { type: 'triangle', freq: 587, duration: 0.16, gain: 0.06, attack: 0.005, filter: 2400, delay: 0.005 },
  ],
  // Tiny pop — for card hovers/clicks. Very short.
  pop: [{ type: 'sine', freq: 720, duration: 0.07, gain: 0.1, attack: 0.002, filter: 2200 }],
  // Click — nav links etc.
  click: [{ type: 'triangle', freq: 520, duration: 0.05, gain: 0.07, attack: 0.001, filter: 2000 }],
  // Filtered noise swish — page transition feel.
  swish: [], // handled separately in playNoise
  // A two-note rising chord — for affirmative actions / reveals.
  chord: [
    { type: 'sine', freq: 392, duration: 0.32, gain: 0.12, attack: 0.01, filter: 1800 },
    { type: 'sine', freq: 523, duration: 0.32, gain: 0.1, attack: 0.01, filter: 2000, delay: 0.06 },
    { type: 'triangle', freq: 784, duration: 0.32, gain: 0.05, attack: 0.01, filter: 2200, delay: 0.12 },
  ],
  // Flurry — handled separately in playFlurry to randomize pitches each call.
  // Used for the boids scatter click: sounds like a small flock startling.
  flurry: [],
}

function playVoice(ctx: AudioContext, voice: Voice, masterGain: number) {
  const now = ctx.currentTime + (voice.delay ?? 0)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = voice.type
  osc.frequency.value = voice.freq
  if (voice.detune) osc.detune.value = voice.detune

  let node: AudioNode = osc
  if (voice.filter) {
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = voice.filter
    osc.connect(lp)
    node = lp
  }

  const peak = voice.gain * masterGain
  const attack = voice.attack ?? 0.005
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0001), now + attack)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + voice.duration)
  node.connect(gain).connect(ctx.destination)

  osc.start(now)
  osc.stop(now + voice.duration + 0.02)
}

function playFlurry(ctx: AudioContext, masterGain: number) {
  // A staggered burst of short, bright triangle pings at randomized pitches
  // around a pentatonic cluster — evokes a small flock startling and scattering.
  const base = 660
  const intervals = [0, 4, 7, 12, 14, 5, 9] // semitone offsets, lightly pentatonic
  const PINGS = 6
  for (let i = 0; i < PINGS; i++) {
    const semi = intervals[Math.floor(Math.random() * intervals.length)] ?? 0
    const detune = (Math.random() - 0.5) * 30
    playVoice(
      ctx,
      {
        type: i % 2 === 0 ? 'triangle' : 'sine',
        freq: base * Math.pow(2, semi / 12),
        detune,
        duration: 0.16 + Math.random() * 0.08,
        gain: 0.08 + Math.random() * 0.04,
        attack: 0.003,
        filter: 3200,
        delay: i * 0.018 + Math.random() * 0.012,
      },
      masterGain,
    )
  }
}

function playNoise(ctx: AudioContext, masterGain: number) {
  const now = ctx.currentTime
  const duration = 0.22
  const bufferSize = Math.floor(ctx.sampleRate * duration)
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const channel = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    channel[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize)
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const bp = ctx.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 1200
  bp.Q.value = 0.8
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(0.08 * masterGain, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)
  source.connect(bp).connect(gain).connect(ctx.destination)
  source.start(now)
  source.stop(now + duration + 0.02)
}

const STORAGE_KEY = 'sound-muted'

function readMuted(): boolean {
  if (typeof window === 'undefined') return true
  try {
    // Default: muted until the user opts in. Auto-playing sounds on a portfolio
    // is hostile, even when it's "just" a boop on theme toggle.
    return localStorage.getItem(STORAGE_KEY) !== 'false'
  } catch {
    return true
  }
}

function writeMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, String(muted))
  } catch {
    // ignore
  }
}

export function useSound() {
  const [muted, setMuted] = useState<boolean>(true)
  const mutedRef = useRef(true)

  useEffect(() => {
    const initial = readMuted()
    setMuted(initial)
    mutedRef.current = initial
  }, [])

  const play = useCallback((name: SoundName, gain = 1) => {
    if (mutedRef.current) return
    const ctx = getCtx()
    if (!ctx) return
    if (ctx.state === 'suspended') void ctx.resume()
    if (name === 'swish') {
      playNoise(ctx, gain)
      return
    }
    if (name === 'flurry') {
      playFlurry(ctx, gain)
      return
    }
    const voices = PRESETS[name]
    for (const voice of voices) playVoice(ctx, voice, gain)
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      mutedRef.current = next
      writeMuted(next)
      // Click feedback when *unmuting* so the user knows it worked.
      if (!next) {
        const ctx = getCtx()
        if (ctx) {
          if (ctx.state === 'suspended') void ctx.resume()
          for (const voice of PRESETS.boop) playVoice(ctx, voice, 1)
        }
      }
      return next
    })
  }, [])

  return { play, muted, toggleMute }
}
