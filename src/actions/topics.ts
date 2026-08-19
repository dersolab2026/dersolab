'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export interface Konu {
  id: string
  examType: string
  subject: string
  name: string
  displayOrder: number
}

export interface KonuDurumu {
  topicId: string
  studied: boolean
  practiced: boolean
  reviewed: boolean
  confidence: 'zayif' | 'orta' | 'iyi' | null
}

/** Bir sinav turunun konu sozlugu. */
export async function listTopics(examType: string, subject?: string): Promise<Konu[]> {
  const supabase = await createClient()
  let sorgu = supabase
    .from('curriculum_topics')
    .select('id, exam_type, subject, name, display_order')
    .eq('exam_type', examType)
    .order('subject')
    .order('display_order')
  if (subject) sorgu = sorgu.eq('subject', subject)

  const { data } = await sorgu
  return (data ?? []).map((t) => ({
    id: t.id, examType: t.exam_type, subject: t.subject,
    name: t.name, displayOrder: t.display_order,
  }))
}

/** Ogrencinin konu durumlari. studentId verilirse kocun gorunumu. */
export async function getTopicStatuses(studentId?: string): Promise<KonuDurumu[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hedef = studentId ?? user?.id
  if (!hedef) return []

  const { data } = await supabase
    .from('student_topic_status')
    .select('topic_id, studied, practiced, reviewed, confidence')
    .eq('student_id', hedef)

  return (data ?? []).map((s) => ({
    topicId: s.topic_id,
    studied: s.studied,
    practiced: s.practiced,
    reviewed: s.reviewed,
    confidence: s.confidence as KonuDurumu['confidence'],
  }))
}

/**
 * Bir konunun durumunu degistir.
 *
 * Upsert: ogrenci ilk kez isaretlediginde satir yok. Her isaretleme icin
 * ayri bir "olustur" adimi istemek arayuzu gereksiz karmasiklastirirdi.
 */
export async function setTopicStatus(
  topicId: string,
  degisiklik: Partial<Omit<KonuDurumu, 'topicId'>>,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: mevcut } = await supabase
    .from('student_topic_status')
    .select('studied, practiced, reviewed, confidence')
    .eq('student_id', user.id).eq('topic_id', topicId)
    .maybeSingle()

  const yeni = {
    student_id: user.id,
    topic_id: topicId,
    studied: degisiklik.studied ?? mevcut?.studied ?? false,
    practiced: degisiklik.practiced ?? mevcut?.practiced ?? false,
    reviewed: degisiklik.reviewed ?? mevcut?.reviewed ?? false,
    confidence: degisiklik.confidence !== undefined ? degisiklik.confidence : (mevcut?.confidence ?? null),
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('student_topic_status')
    .upsert(yeni, { onConflict: 'student_id,topic_id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/konularim')
  return { success: true }
}
