'use client'

/**
 * Native Web Speech API integration for İngilizceLab
 * Google Little Language Lessons (LLL) style native audio pronunciation
 */

export type EnglishAccent = 'en-US' | 'en-GB' | 'en-AU'

let cachedVoices: SpeechSynthesisVoice[] = []

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices()
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices()
  }
}

export function playSpeech(
  text: string,
  accent: EnglishAccent = 'en-US',
  rate: number = 0.95,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false
  }

  try {
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = accent
    utterance.rate = rate
    utterance.pitch = 1.0

    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices()
    }

    // Try to find the closest matching native voice
    const matchedVoice = cachedVoices.find((v) => {
      if (accent === 'en-AU') return v.lang.includes('AU') || v.lang.includes('Australia')
      if (accent === 'en-GB') return v.lang.includes('GB') || v.lang.includes('UK')
      return v.lang.includes('US') || v.lang.includes('en_US')
    }) || cachedVoices.find((v) => v.lang.startsWith('en'))

    if (matchedVoice) {
      utterance.voice = matchedVoice
    }

    if (onEnd) {
      utterance.onend = onEnd
      utterance.onerror = () => onEnd()
    }

    window.speechSynthesis.speak(utterance)
    return true
  } catch (err) {
    console.warn('SpeechSynthesis error:', err)
    if (onEnd) onEnd()
    return false
  }
}

export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}
