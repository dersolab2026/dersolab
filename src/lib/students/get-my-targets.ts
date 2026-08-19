import { createClient } from '@/lib/supabase/server'
import type { ProgramOzet } from '@/actions/targets'

export interface TargetNetRow {
  examType: string
  track: string | null
  sectionName: string
  targetNet: number
}

export interface MyTargets {
  targetProgramCode: number | null
  targetRank: number | null
  targetExamDate: string | null
  program: ProgramOzet | null
  nets: TargetNetRow[]
}

/**
 * Ogrencinin hedefleri. studentId verilirse o ogrencininki okunur —
 * kocun ogrenci detayinda gormesi icin; erisimi 0086'daki politika
 * can_view_student uzerinden siniriyor.
 */
export async function getMyTargets(studentId?: string): Promise<MyTargets> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hedefId = studentId ?? user?.id
  const bos: MyTargets = {
    targetProgramCode: null, targetRank: null, targetExamDate: null, program: null, nets: [],
  }
  if (!hedefId) return bos

  const [{ data: ogrenci }, { data: netRows }] = await Promise.all([
    supabase.from('students')
      .select('target_program_code, target_rank, target_exam_date')
      .eq('user_id', hedefId).maybeSingle(),
    supabase.from('student_target_nets')
      .select('exam_type, track, section_name, target_net')
      .eq('student_id', hedefId),
  ])

  const nets: TargetNetRow[] = (netRows ?? []).map((n) => ({
    examType: n.exam_type,
    track: n.track,
    sectionName: n.section_name,
    targetNet: Number(n.target_net),
  }))

  if (!ogrenci) return { ...bos, nets }

  let program: ProgramOzet | null = null
  if (ogrenci.target_program_code) {
    const { data: p } = await supabase
      .from('yok_atlas_programs')
      .select('kilavuz_kodu, universite_adi, birim_adi, il_adi, puan_turu, min_puan, basari_sirasi, ogrenim_turu_adi, ucret')
      .eq('kilavuz_kodu', ogrenci.target_program_code)
      .maybeSingle()
    if (p) {
      program = {
        kilavuzKodu: Number(p.kilavuz_kodu),
        universiteAdi: p.universite_adi,
        birimAdi: p.birim_adi,
        ilAdi: p.il_adi,
        puanTuru: p.puan_turu,
        minPuan: p.min_puan === null ? null : Number(p.min_puan),
        basariSirasi: p.basari_sirasi,
        ogrenimTuruAdi: p.ogrenim_turu_adi,
        ucret: p.ucret === null ? null : Number(p.ucret),
      }
    }
  }

  return {
    targetProgramCode: ogrenci.target_program_code ? Number(ogrenci.target_program_code) : null,
    targetRank: ogrenci.target_rank,
    targetExamDate: ogrenci.target_exam_date,
    program,
    nets,
  }
}
