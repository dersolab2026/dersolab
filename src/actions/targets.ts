'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export interface ProgramOzet {
  kilavuzKodu: number
  universiteAdi: string
  birimAdi: string
  ilAdi: string | null
  puanTuru: string | null
  minPuan: number | null
  basariSirasi: number | null
  ogrenimTuruAdi: string | null
  ucret: number | null
}

/** Hedef program ararken kullanilan liste; yok_atlas_programs herkese acik. */
export async function searchPrograms(query: string): Promise<ProgramOzet[]> {
  const supabase = await createClient()
  const temiz = query.trim().replace(/[%_(),.[\]\\]/g, '')
  if (temiz.length < 3) return []

  const { data } = await supabase
    .from('yok_atlas_programs')
    .select('kilavuz_kodu, universite_adi, birim_adi, il_adi, puan_turu, min_puan, basari_sirasi, ogrenim_turu_adi, ucret')
    .or(`birim_adi.ilike.%${temiz}%,universite_adi.ilike.%${temiz}%`)
    .not('min_puan', 'is', null)
    .order('basari_sirasi', { ascending: true })
    .limit(40)

  return (data ?? []).map((p) => ({
    kilavuzKodu: Number(p.kilavuz_kodu),
    universiteAdi: p.universite_adi,
    birimAdi: p.birim_adi,
    ilAdi: p.il_adi,
    puanTuru: p.puan_turu,
    minPuan: p.min_puan === null ? null : Number(p.min_puan),
    basariSirasi: p.basari_sirasi,
    ogrenimTuruAdi: p.ogrenim_turu_adi,
    ucret: p.ucret === null ? null : Number(p.ucret),
  }))
}

export async function setTargetProgram(
  kilavuzKodu: number | null,
  hedefSira: number | null,
  sinavTarihi: string | null,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (hedefSira !== null && hedefSira <= 0) {
    return { success: false, error: 'Hedef sıralama pozitif olmalı' }
  }

  const { error } = await supabase.from('students').update({
    target_program_code: kilavuzKodu,
    target_rank: hedefSira,
    target_exam_date: sinavTarihi,
  }).eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}

export interface TargetNetInput {
  examType: string
  track: string | null
  sections: { name: string; targetNet: number }[]
}

export async function setTargetNets(input: TargetNetInput): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  for (const s of input.sections) {
    if (s.targetNet < 0) return { success: false, error: `${s.name}: hedef net negatif olamaz` }
  }

  // Bu tur+alan icin eskileri silip yenilerini yaziyoruz; upsert yerine bu,
  // cunku ogrenci bir dersi listeden cikarmis olabilir.
  const silme = supabase
    .from('student_target_nets')
    .delete()
    .eq('student_id', user.id)
    .eq('exam_type', input.examType)
  if (input.track) silme.eq('track', input.track)
  else silme.is('track', null)
  const { error: silmeHatasi } = await silme
  if (silmeHatasi) return { success: false, error: silmeHatasi.message }

  const yazilacak = input.sections.filter((s) => s.targetNet > 0)
  if (yazilacak.length > 0) {
    const { error } = await supabase.from('student_target_nets').insert(
      yazilacak.map((s) => ({
        student_id: user.id,
        exam_type: input.examType,
        track: input.track,
        section_name: s.name,
        target_net: s.targetNet,
      })),
    )
    if (error) return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}
