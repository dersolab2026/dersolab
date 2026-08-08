'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyInstructorApprovalStatus } from '@/lib/notifications/send-guardian-notification'

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
  userId?: string
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

  let recipientIds: string[] = []
  if (params.audience === 'specific') {
    if (!params.userId) return { success: false, error: 'Bir kişi seçmelisin' }
    recipientIds = [params.userId]
  } else {
    const roles = params.audience === 'all' ? ['student', 'parent', 'instructor'] : [params.audience]
    const { data: users, error } = await admin.from('users').select('id').in('role', roles)
    if (error) return { success: false, error: error.message }
    recipientIds = (users ?? []).map((u) => u.id)
  }

  if (recipientIds.length === 0) return { success: false, error: 'Gönderilecek kimse bulunamadı' }

  const rows = recipientIds.map((id) => ({
    recipient_id: id,
    type: 'admin_message' as const,
    channel: 'in_app' as const,
    title,
    body,
  }))

  const { error } = await admin.from('notifications').insert(rows)
  if (error) return { success: false, error: error.message }

  return { success: true, count: recipientIds.length }
}
