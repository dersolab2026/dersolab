/**
 * Web Audio API Synthesis Engine for DersoLab
 * Zero external MP3 assets, 100% reliable, ultra-lightweight and customizable.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioContextClass) {
        audioCtx = new AudioContextClass()
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {})
    }
    return audioCtx
  } catch {
    return null
  }
}

export function isSoundMuted(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('dersolab_sound_muted') === 'true'
}

export function setSoundMuted(muted: boolean): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('dersolab_sound_muted', muted ? 'true' : 'false')
}

export function toggleSound(): boolean {
  const current = isSoundMuted()
  setSoundMuted(!current)
  return !current
}

/**
 * Click sound: Crisp, subtle click for UI buttons
 */
export function playClickSound(): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.04)

  gain.gain.setValueAtTime(0.08, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.045)
}

/**
 * Slider tick: Tiny subtle blip for parameter adjustments
 */
export function playSliderTick(freq = 480): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, ctx.currentTime)

  gain.gain.setValueAtTime(0.04, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.026)
}

/**
 * Success fanfare: Rewarding melodic chime (C5, E5, G5, C6) for challenges & correct answers
 */
export function playSuccessFanfare(): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const notes = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08)

    gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.08)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.3)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + idx * 0.08)
    osc.stop(ctx.currentTime + idx * 0.08 + 0.32)
  })
}

/**
 * Error buzz: Soft, gentle low pitch for incorrect attempts
 */
export function playErrorBuzz(): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(140, ctx.currentTime)
  osc.frequency.setValueAtTime(110, ctx.currentTime + 0.1)

  gain.gain.setValueAtTime(0.07, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.23)
}

/**
 * Chemical reaction / bubbling sound: multi-burst sine chirps
 */
export function playChemicalReaction(): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  for (let i = 0; i < 4; i++) {
    const delay = i * 0.06 + Math.random() * 0.03
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    const freq = 450 + Math.random() * 350
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime + delay)
    osc.frequency.exponentialRampToValueAtTime(freq + 200, ctx.currentTime + delay + 0.05)

    gain.gain.setValueAtTime(0.06, ctx.currentTime + delay)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.06)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start(ctx.currentTime + delay)
    osc.stop(ctx.currentTime + delay + 0.065)
  }
}

/**
 * Switch sound: Electrical switch or toggle snap
 */
export function playSwitchSound(): void {
  if (isSoundMuted()) return
  const ctx = getAudioContext()
  if (!ctx) return

  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(600, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.035)

  gain.gain.setValueAtTime(0.05, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.042)
}
