import { createAdminClient } from '@/lib/supabase/admin'
import { createGoogleOAuthClient } from '@/lib/google/oauth-client'

const EXPIRY_BUFFER_MS = 60_000

export async function getValidInstructorAccessToken(instructorId: string): Promise<string> {
  const admin = createAdminClient()

  const { data: credentials, error } = await admin
    .from('instructor_calendar_credentials')
    .select('access_token, refresh_token, expires_at')
    .eq('instructor_id', instructorId)
    .single()

  if (error || !credentials) {
    throw new Error('Eğitmen Google Takvimini henüz bağlamamış')
  }

  const expiresAt = new Date(credentials.expires_at).getTime()
  if (expiresAt - EXPIRY_BUFFER_MS > Date.now()) {
    return credentials.access_token
  }

  if (!credentials.refresh_token) {
    throw new Error('Eğitmenin Google Takvim bağlantısı yeniden yetkilendirme gerektiriyor')
  }

  const oauthClient = createGoogleOAuthClient()
  oauthClient.setCredentials({ refresh_token: credentials.refresh_token })

  const { credentials: refreshed } = await oauthClient.refreshAccessToken()

  if (!refreshed.access_token || !refreshed.expiry_date) {
    throw new Error('Google access token yenilenemedi')
  }

  await admin
    .from('instructor_calendar_credentials')
    .update({
      access_token: refreshed.access_token,
      expires_at: new Date(refreshed.expiry_date).toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('instructor_id', instructorId)

  return refreshed.access_token
}
