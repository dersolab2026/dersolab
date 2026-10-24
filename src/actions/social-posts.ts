'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SocialPostItem } from '@/types/social'

async function verifyAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    const { data: userRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return userRow?.role === 'admin'
  } catch {
    return false
  }
}

export async function getSocialPostsFromDb(): Promise<SocialPostItem[]> {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) return []

    const admin = createAdminClient()
    const { data, error } = await admin
      .from('social_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)

    if (error || !data) return []

    return data.map((row: any) => ({
      id: row.id,
      title: row.title,
      type: row.type,
      topic: row.topic || 'custom',
      topicLabel: row.topic_label || row.title,
      status: row.status || 'draft',
      targetAudience: row.target_audience || 'YKS 2027',
      caption: row.caption || '',
      hashtags: Array.isArray(row.hashtags) ? row.hashtags : [],
      platform: row.platform || 'both',
      carouselSlides: row.carousel_slides || undefined,
      singlePostData: row.single_post_data || undefined,
      storyData: row.story_data || undefined,
      reelsStoryboard: row.reels_storyboard || undefined,
      scheduledFor: row.scheduled_for || null,
      publishedAt: row.published_at || null,
      createdAt: row.created_at || new Date().toISOString(),
    }))
  } catch {
    return []
  }
}

export async function upsertSocialPostToDb(post: SocialPostItem): Promise<{ success: boolean }> {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) return { success: false }

    const admin = createAdminClient()
    const { error } = await admin.from('social_posts').upsert(
      {
        id: post.id,
        title: post.title,
        type: post.type,
        topic: post.topic || 'custom',
        topic_label: post.topicLabel || post.title,
        status: post.status || 'draft',
        target_audience: post.targetAudience || 'YKS 2027',
        caption: post.caption || '',
        hashtags: post.hashtags || [],
        platform: post.platform || 'both',
        carousel_slides: post.carouselSlides ?? null,
        single_post_data: post.singlePostData ?? null,
        story_data: post.storyData ?? null,
        reels_storyboard: post.reelsStoryboard ?? null,
        scheduled_for: post.scheduledFor ?? null,
        published_at: post.publishedAt ?? null,
        created_at: post.createdAt || new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

    if (error) return { success: false }
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function deleteSocialPostFromDb(id: string): Promise<{ success: boolean }> {
  try {
    const isAdmin = await verifyAdmin()
    if (!isAdmin) return { success: false }

    const admin = createAdminClient()
    const { error } = await admin.from('social_posts').delete().eq('id', id)
    if (error) return { success: false }
    return { success: true }
  } catch {
    return { success: false }
  }
}

/**
 * Base64 Data URL görsellerini Supabase Storage üzerine yükleyerek
 * Instagram Graph API ve TikTok API'nin kabul ettiği herkese açık HTTPS URL'ye dönüştürür.
 */
export async function uploadSocialDataUrlToStorage(
  dataUrl: string,
  prefix = 'slide'
): Promise<string | null> {
  if (!dataUrl.startsWith('data:image/')) {
    return dataUrl.startsWith('http') ? dataUrl : null
  }

  try {
    const admin = createAdminClient()
    const bucketName = 'social-media'

    // Bucket yoksa oluştur (public)
    const { data: buckets } = await admin.storage.listBuckets()
    if (!buckets?.some((b) => b.name === bucketName)) {
      await admin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024,
      })
    }

    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/)
    if (!match) return null

    const mimeType = match[1]
    const base64Data = match[2]
    const ext = mimeType.includes('svg') ? 'svg' : mimeType.includes('jpeg') ? 'jpg' : 'png'
    const fileName = `posts/${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`

    const buffer = Buffer.from(base64Data, 'base64')

    const { error: uploadError } = await admin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType: mimeType,
        upsert: true,
      })

    if (uploadError) return null

    const { data: publicUrlData } = admin.storage.from(bucketName).getPublicUrl(fileName)
    return publicUrlData?.publicUrl || null
  } catch {
    return null
  }
}
