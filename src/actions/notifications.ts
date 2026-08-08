'use server'

import { createClient } from '@/lib/supabase/server'

export interface NotificationItem {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  isRead: boolean
  createdAt: string
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('notifications')
    .select('id, type, title, body, link, is_read, created_at')
    .eq('recipient_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return (data ?? []).map((n) => ({
    id: n.id, type: n.type, title: n.title, body: n.body, link: n.link, isRead: n.is_read, createdAt: n.created_at,
  }))
}

export async function markNotificationRead(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').update({ is_read: true }).eq('id', id).eq('recipient_id', user.id)
}

export async function markAllNotificationsRead(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').update({ is_read: true }).eq('recipient_id', user.id).eq('is_read', false)
}

export async function deleteNotification(id: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').delete().eq('id', id).eq('recipient_id', user.id)
}

export async function clearReadNotifications(): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('notifications').delete().eq('recipient_id', user.id).eq('is_read', true)
}
