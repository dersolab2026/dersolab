'use client'

/**
 * Web Audio API synthesizer for realistic tactile UI sounds
 * Zero external audio files required - 100% reliable & zero latency
 */
class SoundEngine {
  private ctx: AudioContext | null = null
  public enabled: boolean = true

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  // Realistic brass door handle click
  public playHandleClick() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08)

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.08)
    } catch {
      // Audio fallback silent
    }
  }

  // Heavy wooden door swing whoosh
  public playDoorOpen() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      // Low frequency resonance
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(80, this.ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.3)
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.6)

      gain.gain.setValueAtTime(0.01, this.ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.25, this.ctx.currentTime + 0.2)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.6)
    } catch {
      // Audio fallback
    }
  }

  // Bell chime for entrance / intercom
  public playBellChime() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const freqs = [587.33, 880, 1174.66]
      freqs.forEach((f, i) => {
        if (!this.ctx) return
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.1)

        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + i * 0.1)
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.8)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(this.ctx.currentTime + i * 0.1)
        osc.stop(this.ctx.currentTime + i * 0.1 + 0.8)
      })
    } catch {
      // Fallback
    }
  }

  // Chalk tap sound on blackboard
  public playChalkTap() {
    if (!this.enabled) return
    try {
      this.initCtx()
      if (!this.ctx) return

      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(800, this.ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04)

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start()
      osc.stop(this.ctx.currentTime + 0.04)
    } catch {
      // Fallback
    }
  }
}

export const campusSound = new SoundEngine()
