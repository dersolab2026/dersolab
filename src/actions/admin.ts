'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyInstructorApprovalStatus } from '@/lib/notifications/send-guardian-notification'
import { getCategoryLink, type AdminNotificationCategory } from '@/lib/notifications/get-notification-link'

type ActionResult = { success: true } | { success: false; error: string }

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { supabase, user: null, isAdmin: false }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  return { supabase, user, isAdmin: userRow?.role === 'admin' }
}

export async function approveInstructor(instructorId: string): Promise<ActionResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!isAdmin) return { success: false, error: 'Bu işlem için yetkin yok' }

  const { error } = await supabase
    .from('instructors')
    .update({ approval_status: 'approved', reviewed_at: new Date().toISOString(), reviewed_by: user.id })
    .eq('user_id', instructorId)

  if (error) return { success: false, error: error.message }

  await notifyInstructorApprovalStatus({ instructorId, approved: true })

  revalidatePath('/dashboard/admin/instructors')
  revalidatePath('/instructors')
  return { success: true }
}

export async function rejectInstructor(instructorId: string, note: string): Promise<ActionResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!isAdmin) return { success: false, error: 'Bu işlem için yetkin yok' }

  const { error } = await supabase
    .from('instructors')
    .update({
      approval_status: 'rejected',
      approval_note: note,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
    })
    .eq('user_id', instructorId)

  if (error) return { success: false, error: error.message }

  await notifyInstructorApprovalStatus({ instructorId, approved: false, note })

  revalidatePath('/dashboard/admin/instructors')
  return { success: true }
}

interface UpsertPackageParams {
  id?: string
  title: string
  description?: string
  creditAmount: number
  price: number
  isActive: boolean
}

export async function upsertPackage(params: UpsertPackageParams): Promise<ActionResult> {
  const { supabase, user, isAdmin } = await requireAdmin()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!isAdmin) return { success: false, error: 'Bu işlem için yetkin yok' }

  if (!params.title.trim()) return { success: false, error: 'Başlık boş olamaz' }
  if (!Number.isFinite(params.creditAmount) || params.creditAmount <= 0) {
    return { success: false, error: 'Kredi miktarı 0\'dan büyük bir sayı olmalı' }
  }
  if (!Number.isFinite(params.price) || params.price <= 0) {
    return { success: false, error: 'Fiyat 0\'dan büyük bir sayı olmalı' }
  }

  const payload = {
    title: params.title.trim(),
    description: params.description?.trim() || null,
    credit_amount: params.creditAmount,
    price: params.price,
    is_active: params.isActive,
  }

  const { error } = params.id
    ? await supabase.from('packages').update(payload).eq('id', params.id)
    : await supabase.from('packages').insert(payload)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/admin/packages')
  revalidatePath('/dashboard/student/packages')
  return { success: true }
}

type SendNotificationResult = { success: true; count: number } | { success: false; error: string }

interface SendAdminNotificationParams {
  audience: 'all' | 'student' | 'parent' | 'instructor' | 'specific'
  userIds?: string[]
  category: AdminNotificationCategory
  title: string
  body: string
}

export async function sendAdminNotification(params: SendAdminNotificationParams): Promise<SendNotificationResult> {
  const { user, isAdmin } = await requireAdmin()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!isAdmin) return { success: false, error: 'Bu işlem için yetkin yok' }

  const title = params.title.trim()
  const body = params.body.trim()
  if (!title || !body) return { success: false, error: 'Başlık ve mesaj boş olamaz' }

  const admin = createAdminClient()

  let recipients: { id: string; role: string }[] = []
  if (params.audience === 'specific') {
    if (!params.userIds || params.userIds.length === 0) return { success: false, error: 'En az bir kişi seçmelisin' }
    const { data: users, error } = await admin.from('users').select('id, role').in('id', params.userIds)
    if (error) return { success: false, error: error.message }
    recipients = users ?? []
  } else {
    const roles = params.audience === 'all' ? ['student', 'parent', 'instructor'] : [params.audience]
    const { data: users, error } = await admin.from('users').select('id, role').in('role', roles)
    if (error) return { success: false, error: error.message }
    recipients = users ?? []
  }

  if (recipients.length === 0) return { success: false, error: 'Gönderilecek kimse bulunamadı' }

  const batchId = crypto.randomUUID()
  const rows = recipients.map((recipient) => ({
    recipient_id: recipient.id,
    type: 'admin_message' as const,
    channel: 'in_app' as const,
    title,
    body,
    link: getCategoryLink(params.category, recipient.role as 'student' | 'parent' | 'instructor' | 'admin'),
    batch_id: batchId,
  }))

  const { error } = await admin.from('notifications').insert(rows)
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/admin/notifications')
  return { success: true, count: recipients.length }
}

export interface SentNotificationBatch {
  batchId: string
  title: string
  body: string | null
  createdAt: string
  totalCount: number
  readCount: number
  recipients: { name: string; email: string; isRead: boolean }[]
}

export async function getSentAdminNotifications(): Promise<SentNotificationBatch[]> {
  const { isAdmin } = await requireAdmin()
  if (!isAdmin) return []

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('notifications')
    .select('batch_id, title, body, created_at, is_read, recipient:users(name, email)')
    .eq('type', 'admin_message')
    .not('batch_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error || !data) return []

  const batches = new Map<string, SentNotificationBatch>()
  for (const row of data as any[]) {
    const batchId = row.batch_id as string
    if (!batches.has(batchId)) {
      batches.set(batchId, {
        batchId, title: row.title, body: row.body, createdAt: row.created_at,
        totalCount: 0, readCount: 0, recipients: [],
      })
    }
    const batch = batches.get(batchId)!
    batch.totalCount += 1
    if (row.is_read) batch.readCount += 1
    batch.recipients.push({
      name: row.recipient?.name ?? 'Bilinmeyen', email: row.recipient?.email ?? '', isRead: row.is_read,
    })
  }

  return Array.from(batches.values())
}

export async function deleteUserAccount(userId: string): Promise<ActionResult> {
  const { user, isAdmin } = await requireAdmin()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!isAdmin) return { success: false, error: 'Bu işlem için yetkin yok' }
  if (userId === user.id) return { success: false, error: 'Kendi hesabını silemezsin' }

  const admin = createAdminClient()
  const anonymizedEmail = `silinmis-${userId}@dersolab.local`

  const { error: userError } = await admin
    .from('users')
    .update({
      name: 'Silinmiş Kullanıcı',
      email: anonymizedEmail,
      phone: null,
      birth_date: null,
      avatar_url: null,
      identity_number: null,
      address: null,
      city: null,
    })
    .eq('id', userId)

  if (userError) return { success: false, error: userError.message }

  await admin
    .from('instructors')
    .update({ approval_status: 'rejected', bio: null, intro_video_url: null })
    .eq('user_id', userId)

  const { error: authError } = await admin.auth.admin.updateUserById(userId, {
    email: anonymizedEmail,
    ban_duration: '876000h',
  })

  if (authError) return { success: false, error: authError.message }

  revalidatePath('/dashboard/admin/users')
  return { success: true }
}
