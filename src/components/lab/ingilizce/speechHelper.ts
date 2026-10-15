'use client'

/**
 * Native Web Speech API integration for İngilizceLab
 * Resilient audio pronunciation with voice selection and rate controls
 */

export type EnglishAccent = 'en-US' | 'en-GB' | 'en-AU'

let activeUtterance: SpeechSynthesisUtterance | null = null

function getBestVoice(accent: EnglishAccent): SpeechSynthesisVoice | undefined {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return undefined
  const voices = window.speechSynthesis.getVoices()
  if (!voices || voices.length === 0) return undefined

  if (accent === 'en-AU') {
    return (
      voices.find((v) => v.lang === 'en-AU' || v.lang.includes('AU') || v.name.includes('Australia')) ||
      voices.find((v) => v.lang.startsWith('en'))
    )
  }
  if (accent === 'en-GB') {
    return (
      voices.find((v) => v.lang === 'en-GB' || v.lang.includes('GB') || v.name.includes('UK') || v.name.includes('Great Britain')) ||
      voices.find((v) => v.lang.startsWith('en'))
    )
  }
  // en-US default
  return (
    voices.find((v) => v.lang === 'en-US' || v.lang.includes('US') || v.name.includes('United States')) ||
    voices.find((v) => v.lang.startsWith('en'))
  )
}

export function playSpeech(
  text: string,
  accent: EnglishAccent = 'en-US',
  rate: number = 0.95,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd()
    return false
  }

  try {
    window.speechSynthesis.cancel()
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
    }

    const utterance = new SpeechSynthesisUtterance(text)
    activeUtterance = utterance
    utterance.lang = accent
    // Clamp rate between 0.5 and 1.8 for optimal clarity
    utterance.rate = Math.max(0.5, Math.min(rate, 1.8))
    utterance.pitch = 1.0

    const voice = getBestVoice(accent)
    if (voice) {
      utterance.voice = voice
    }

    const finish = () => {
      activeUtterance = null
      if (onEnd) onEnd()
    }

    utterance.onend = finish
    utterance.onerror = (e) => {
      console.warn('Utterance playback finished or interrupted:', e)
      finish()
    }

    window.speechSynthesis.speak(utterance)
    return true
  } catch (err) {
    console.warn('SpeechSynthesis error:', err)
    activeUtterance = null
    if (onEnd) onEnd()
    return false
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    activeUtterance = null
    window.speechSynthesis.cancel()
  }
}
