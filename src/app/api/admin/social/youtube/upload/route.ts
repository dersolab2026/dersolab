import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { verifyCronRequest } from '@/lib/auth/cron'
import {
  createYouTubeOAuthClient,
  loadYouTubeCredentials,
  saveYouTubeCredentials,
} from '@/lib/google/youtube-oauth'

export const maxDuration = 60

const MAX_VIDEO_BYTES = 50 * 1024 * 1024

const uploadSchema = z.object({
  videoUrl: z.string().url(),
  title: z.string().trim().min(1).max(100),
  description: z.string().trim().max(5000).default(''),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  privacyStatus: z.enum(['public', 'unlisted', 'private']).default('public'),
})

async function isAuthorized(request: NextRequest): Promise<boolean> {
  if (verifyCronRequest(request)) {
    return true
  }
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false
  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  return userRow?.role === 'admin'
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
  }

  let parsed
  try {
    const body = await request.json()
    parsed = uploadSchema.safeParse(body)
  } catch {
    return NextResponse.json({ error: 'Geçersiz JSON gövdesi.' }, { status: 400 })
  }

  if (!parsed.success) {
    return NextResponse.json({ error: 'Geçersiz yükleme parametreleri.' }, { status: 400 })
  }

  const { videoUrl, title, description, tags, privacyStatus } = parsed.data

  // SSRF koruması: Yalnızca DersoLab Supabase Storage social-media kovasındaki MP4 dosyalarına izin ver
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/+$/, '')
  const allowedPrefix = `${supabaseUrl}/storage/v1/object/public/social-media/`
  if (!supabaseUrl || !videoUrl.startsWith(allowedPrefix)) {
    return NextResponse.json(
      { error: 'Video adresi yalnızca DersoLab depolama alanından olabilir.' },
      { status: 400 }
    )
  }

  const creds = await loadYouTubeCredentials()
  if (!creds?.refresh_token) {
    return NextResponse.json(
      { error: 'YouTube kanalı henüz bağlı değil. /api/admin/social/youtube/authorize üzerinden onay verin.' },
      { status: 412 }
    )
  }

  try {
    const mediaRes = await fetch(videoUrl, { redirect: 'error' })
    if (!mediaRes.ok) {
      return NextResponse.json({ error: 'Video dosyası indirilemedi.', stage: 'download' }, { status: 400 })
    }
    const contentLength = Number(mediaRes.headers.get('content-length') || '0')
    if (contentLength > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: 'Video boyutu 50 MB sınırını aşıyor.' }, { status: 413 })
    }
    const videoArrayBuffer = await mediaRes.arrayBuffer()
    if (videoArrayBuffer.byteLength === 0 || videoArrayBuffer.byteLength > MAX_VIDEO_BYTES) {
      return NextResponse.json({ error: 'Geçersiz video dosya boyutu.' }, { status: 400 })
    }

    const oauthClient = createYouTubeOAuthClient()
    oauthClient.setCredentials({
      refresh_token: creds.refresh_token,
      access_token: creds.access_token,
      expiry_date: creds.expiry_date,
    })

    const tokenRes = await oauthClient.getAccessToken()
    const accessToken = tokenRes?.token || oauthClient.credentials.access_token
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Google erişim anahtarı yenilenemedi.', stage: 'token_refresh' },
        { status: 401 }
      )
    }

    await saveYouTubeCredentials({
      ...creds,
      access_token: accessToken,
      expiry_date: oauthClient.credentials.expiry_date ?? creds.expiry_date,
      updated_at: new Date().toISOString(),
    }).catch(() => {})

    // 1. YouTube Data API v3 Resumable Upload oturumu başlat (saf fetch, Node stream/duplex hatası yok)
    const metadata = {
      snippet: {
        title,
        description,
        tags,
        categoryId: '27', // Education
        defaultLanguage: 'tr',
        defaultAudioLanguage: 'tr',
      },
      status: {
        privacyStatus,
        selfDeclaredMadeForKids: false,
      },
    }

    const initRes = await fetch(
      'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json; charset=UTF-8',
          'X-Upload-Content-Length': String(videoArrayBuffer.byteLength),
          'X-Upload-Content-Type': 'video/mp4',
        },
        body: JSON.stringify(metadata),
      }
    )

    if (!initRes.ok) {
      const errJson = await initRes.json().catch(() => null)
      const reason = errJson?.error?.errors?.[0]?.reason || errJson?.error?.status || 'unknown'
      console.error('YouTube resumable init hatası:', initRes.status, reason)
      return NextResponse.json(
        {
          error: 'YouTube yükleme oturumu başlatılamadı.',
          stage: 'resumable_init',
          googleStatus: initRes.status,
          googleReason: reason,
        },
        { status: 502 }
      )
    }

    const uploadUrl = initRes.headers.get('location')
    if (!uploadUrl) {
      return NextResponse.json(
        { error: 'YouTube yükleme adresi (Location) dönmedi.', stage: 'resumable_init' },
        { status: 502 }
      )
    }

    // 2. Video verisini tek hamlede PUT ile gönder
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'video/mp4',
        'Content-Length': String(videoArrayBuffer.byteLength),
      },
      body: new Uint8Array(videoArrayBuffer),
    })

    const putData = await putRes.json().catch(() => null)
    if (!putRes.ok || !putData?.id) {
      const reason = putData?.error?.errors?.[0]?.reason || putData?.error?.status || 'unknown'
      console.error('YouTube video PUT hatası:', putRes.status, reason)
      return NextResponse.json(
        {
          error: 'YouTube video verisi yüklenemedi.',
          stage: 'resumable_put',
          googleStatus: putRes.status,
          googleReason: reason,
        },
        { status: 502 }
      )
    }

    const videoId = String(putData.id)
    return NextResponse.json({
      success: true,
      videoId,
      shortsUrl: `https://youtube.com/shorts/${videoId}`,
      watchUrl: `https://youtu.be/${videoId}`,
      privacyStatus: putData.status?.privacyStatus || privacyStatus,
      channelTitle: creds.channel_title || null,
    })
  } catch (err) {
    console.error('YouTube Shorts yükleme hatası:', err)
    const msg = err instanceof Error ? err.message.slice(0, 120) : 'unknown'
    return NextResponse.json(
      { error: 'YouTube yüklemesi sırasında hata oluştu.', stage: 'exception', detail: msg },
      { status: 500 }
    )
  }
}
