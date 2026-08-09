'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { searchYokAtlasPrograms, type SearchYokAtlasParams, type YokAtlasProgramRow } from '@/lib/yok-atlas/search-programs'
import { generateTercihListesiPdf } from '@/lib/yok-atlas/generate-pdf'
import { notifyTercihListesiHazir } from '@/lib/notifications/send-guardian-notification'

export async function searchPrograms(params: SearchYokAtlasParams): Promise<YokAtlasProgramRow[]> {
  return searchYokAtlasPrograms(params)
}

type ActionResult = { success: true } | { success: false; error: string }

export interface TercihGonderilebilecekKisi {
  id: string
  name: string
  email: string
  role: 'student' | 'parent'
}

export async function getTercihGonderilebilecekKisiler(): Promise<TercihGonderilebilecekKisi[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: senderRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (senderRow?.role !== 'instructor' && senderRow?.role !== 'admin') return []

  const admin = createAdminClient()
  const { data } = await admin.from('users').select('id, name, email, role').in('role', ['student', 'parent']).order('name')

  return (data ?? []) as TercihGonderilebilecekKisi[]
}

export async function sendTercihListesi(
  programIds: string[],
  recipientUserId?: string
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Göndermek için giriş yapmalısın' }
  if (programIds.length === 0) return { success: false, error: 'En az bir bölüm seçmelisin' }

  const admin = createAdminClient()
  const { data: senderRow } = await admin.from('users').select('name, role').eq('id', user.id).single()

  let recipientId = user.id
  if (recipientUserId && recipientUserId !== user.id) {
    if (senderRow?.role !== 'instructor' && senderRow?.role !== 'admin') {
      return { success: false, error: 'Başka birine liste göndermek için eğitmen ya da admin olman gerekiyor' }
    }
    const { data: recipientRow } = await admin.from('users').select('role').eq('id', recipientUserId).single()
    if (!recipientRow || (recipientRow.role !== 'student' && recipientRow.role !== 'parent')) {
      return { success: false, error: 'Geçersiz alıcı' }
    }
    recipientId = recipientUserId
  }

  const { data: programs, error: fetchError } = await admin
    .from('yok_atlas_programs')
    .select('id, universite_adi, universite_turu, il_adi, fakulte_adi, birim_adi, ogrenim_turu_adi, ogrenim_dili_adi, puan_turu, kontenjan, ucret, min_puan, basari_sirasi')
    .in('id', programIds)

  if (fetchError || !programs || programs.length === 0) {
    return { success: false, error: 'Seçilen bölümler bulunamadı' }
  }

  const mapped: YokAtlasProgramRow[] = programs.map((p) => ({
    id: p.id,
    universiteAdi: p.universite_adi,
    universiteTuru: p.universite_turu,
    ilAdi: p.il_adi,
    fakulteAdi: p.fakulte_adi,
    birimAdi: p.birim_adi,
    ogrenimTuruAdi: p.ogrenim_turu_adi,
    ogrenimDiliAdi: p.ogrenim_dili_adi,
    puanTuru: p.puan_turu,
    kontenjan: p.kontenjan,
    ucret: p.ucret,
    minPuan: p.min_puan,
    basariSirasi: p.basari_sirasi,
  }))

  const senderName = senderRow?.name ?? 'DersoLab'
  const pdfBuffer = generateTercihListesiPdf(mapped, senderName)

  const filePath = `${recipientId}/${Date.now()}.pdf`
  const { error: uploadError } = await admin.storage
    .from('tercih-listeleri')
    .upload(filePath, pdfBuffer, { contentType: 'application/pdf' })

  if (uploadError) return { success: false, error: 'PDF yüklenemedi, tekrar dener misin?' }

  const { error: insertError } = await admin.from('tercih_listeleri').insert({
    sender_id: user.id,
    recipient_id: recipientId,
    file_path: filePath,
    program_count: mapped.length,
  })

  if (insertError) return { success: false, error: 'Kayıt oluşturulamadı' }

  await notifyTercihListesiHazir({
    recipientId,
    senderName,
    programCount: mapped.length,
    pdfBuffer,
  })

  return { success: true }
}

export interface TercihListesiRow {
  id: string
  senderName: string
  recipientName: string
  programCount: number
  createdAt: string
}

export async function getMyTercihListeleri(): Promise<TercihListesiRow[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('tercih_listeleri')
    .select('id, program_count, created_at, sender:sender_id(name), recipient:recipient_id(name)')
    .or(`recipient_id.eq.${user.id},sender_id.eq.${user.id}`)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  return (data as any[]).map((row) => ({
    id: row.id,
    senderName: row.sender?.name ?? 'Bilinmeyen',
    recipientName: row.recipient?.name ?? 'Bilinmeyen',
    programCount: row.program_count,
    createdAt: row.created_at,
  }))
}

export async function getTercihListesiSignedUrl(id: string): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısın' }

  const { data: liste, error } = await supabase
    .from('tercih_listeleri')
    .select('file_path, sender_id, recipient_id')
    .eq('id', id)
    .single()

  if (error || !liste) return { error: 'Liste bulunamadı' }
  if (liste.sender_id !== user.id && liste.recipient_id !== user.id) return { error: 'Bu listeye erişimin yok' }

  const admin = createAdminClient()
  const { data: signed, error: signError } = await admin.storage
    .from('tercih-listeleri')
    .createSignedUrl(liste.file_path, 3600)

  if (signError || !signed) return { error: 'Link oluşturulamadı' }
  return { url: signed.signedUrl }
}
