/**
 * Dahili yönlendirme (redirect / next) yollarını açık yönlendirme (Open Redirect)
 * saldırılarına karşı doğrular. Yalnızca uygulama içi göreli yolları kabul eder.
 */
export function sanitizeRedirectPath(
  raw: string | null | undefined,
  fallback = '/dashboard'
): string {
  if (!raw || typeof raw !== 'string') return fallback
  const trimmed = raw.trim()
  if (
    !trimmed.startsWith('/') ||
    trimmed.startsWith('//') ||
    trimmed.startsWith('/\\') ||
    /[\u0000-\u001F\u007F]/.test(trimmed)
  ) {
    return fallback
  }
  try {
    const parsed = new URL(trimmed, 'https://dersolab.local')
    if (parsed.origin !== 'https://dersolab.local') return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
