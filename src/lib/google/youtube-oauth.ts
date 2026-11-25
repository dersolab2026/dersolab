import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/admin'

export const YOUTUBE_SCOPES = [
  'https://www.googleapis.com/auth/youtube.upload',
  'https://www.googleapis.com/auth/youtube.readonly',
]

const SECRETS_BUCKET = 'bot-secrets'
const YOUTUBE_CREDS_PATH = 'youtube_oauth.json'

export interface StoredYouTubeCredentials {
  refresh_token: string
  access_token?: string
  expiry_date?: number
  channel_id?: string
  channel_title?: string
  updated_at: string
}

export function getYouTubeRedirectUri(): string {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://dersolab.com').replace(/\/+$/, '')
  return `${baseUrl}/api/admin/social/youtube/callback`
}

export function createYouTubeOAuthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    getYouTubeRedirectUri()
  )
}

export function getYouTubeConsentUrl(state: string): string {
  const client = createYouTubeOAuthClient()
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    include_granted_scopes: false,
    scope: YOUTUBE_SCOPES,
    state,
  })
}

export async function saveYouTubeCredentials(creds: StoredYouTubeCredentials): Promise<void> {
  const admin = createAdminClient()
  const { data: buckets } = await admin.storage.listBuckets()
  if (!buckets?.some((b) => b.name === SECRETS_BUCKET)) {
    const { error: bucketErr } = await admin.storage.createBucket(SECRETS_BUCKET, {
      public: false,
      fileSizeLimit: 1024 * 1024,
    })
    if (bucketErr && !bucketErr.message.toLowerCase().includes('already exists')) {
      throw new Error(`Gizli depo oluşturulamadı: ${bucketErr.message}`)
    }
  }

  const body = Buffer.from(JSON.stringify(creds, null, 2), 'utf-8')
  const { error } = await admin.storage.from(SECRETS_BUCKET).upload(YOUTUBE_CREDS_PATH, body, {
    contentType: 'application/json',
    upsert: true,
  })
  if (error) {
    throw new Error(`YouTube yetkileri kaydedilemedi: ${error.message}`)
  }
}

export async function loadYouTubeCredentials(): Promise<StoredYouTubeCredentials | null> {
  const admin = createAdminClient()
  const { data, error } = await admin.storage.from(SECRETS_BUCKET).download(YOUTUBE_CREDS_PATH)
  if (error || !data) {
    return null
  }
  const text = await data.text()
  const parsed = JSON.parse(text) as StoredYouTubeCredentials
  if (!parsed?.refresh_token) {
    return null
  }
  return parsed
}
