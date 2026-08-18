'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { EXAM_TYPES, supportsObp, type ExamType } from '@/lib/exams/scoring'
import { getExamSections, requiresTrack, type ExamTrack } from '@/lib/exams/structure'

type ActionResult = { success: true } | { success: false; error: string }

export interface ExamSectionEntry {
  name: string
  correctCount: number
  wrongCount: number
}

export interface ExamResultEntry {
  id: string
  examName: string
  examType: ExamType
  examDate: string
  track: ExamTrack | null
  correctCount: number
  wrongCount: number
  obp: number | null
  sections: ExamSectionEntry[]
}

interface AddExamResultParams {
  examName: string
  examType: ExamType
  examDate: string
  track?: ExamTrack | null
  sections: ExamSectionEntry[]
  obp?: number | null
}

export async function addExamResult(params: AddExamResultParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (!params.examName.trim()) return { success: false, error: 'Deneme adı boş olamaz' }
  if (!EXAM_TYPES.includes(params.examType)) return { success: false, error: 'Geçersiz deneme türü' }

  const track = requiresTrack(params.examType) ? (params.track ?? null) : null
  if (requiresTrack(params.examType) && !track) {
    return { success: false, error: 'AYT için alan seçmelisin' }
  }

  // Ders adlarini ve soru sayilarini istemciden gelen degere degil,
  // dogrulanmis sinav yapisina gore kontrol ediyoruz.
  const beklenen = getExamSections(params.examType, track)
  const beklenenMap = new Map(beklenen.map((s) => [s.name, s.questionCount]))

  for (const s of params.sections) {
    const soruSayisi = beklenenMap.get(s.name)
    if (soruSayisi === undefined) {
      return { success: false, error: `Bu sınavda "${s.name}" dersi yok` }
    }
    if (s.correctCount < 0 || s.wrongCount < 0) {
      return { success: false, error: `${s.name}: doğru ve yanlış negatif olamaz` }
    }
    if (s.correctCount + s.wrongCount > soruSayisi) {
      return {
        success: false,
        error: `${s.name}: doğru + yanlış toplamı ${soruSayisi} soruyu aşamaz`,
      }
    }
  }

  if (params.obp != null && (params.obp < 100 || params.obp > 500)) {
    return { success: false, error: 'OBP 100 ile 500 arasında olmalı' }
  }

  const toplamDogru = params.sections.reduce((t, s) => t + s.correctCount, 0)
  const toplamYanlis = params.sections.reduce((t, s) => t + s.wrongCount, 0)

  const { data: kayit, error } = await supabase.from('student_exam_results').insert({
    student_id: user.id,
    exam_name: params.examName.trim(),
    exam_type: params.examType,
    exam_date: params.examDate,
    track,
    correct_count: toplamDogru,
    wrong_count: toplamYanlis,
    obp: supportsObp(params.examType) ? params.obp ?? null : null,
  }).select('id').single()

  if (error || !kayit) return { success: false, error: error?.message ?? 'Kayıt oluşturulamadı' }

  const { error: bolumHatasi } = await supabase.from('student_exam_sections').insert(
    params.sections.map((s, i) => ({
      exam_result_id: kayit.id,
      section_name: s.name,
      correct_count: s.correctCount,
      wrong_count: s.wrongCount,
      display_order: i,
    })),
  )

  if (bolumHatasi) {
    // Ders kirilimi yazilamadiysa yarim kayit birakmayalim.
    await supabase.from('student_exam_results').delete().eq('id', kayit.id)
    return { success: false, error: bolumHatasi.message }
  }

  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}

export async function deleteExamResult(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('student_exam_results').delete().eq('id', id).eq('student_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}

export async function getExamResults(): Promise<ExamResultEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('student_exam_results')
    .select('id, exam_name, exam_type, exam_date, track, correct_count, wrong_count, obp, student_exam_sections(section_name, correct_count, wrong_count, display_order)')
    .eq('student_id', user.id)
    .order('exam_date', { ascending: false })

  return (data ?? []).map((r: any) => ({
    id: r.id,
    examName: r.exam_name,
    examType: r.exam_type as ExamType,
    examDate: r.exam_date,
    track: (r.track ?? null) as ExamTrack | null,
    correctCount: r.correct_count,
    wrongCount: r.wrong_count,
    obp: r.obp === null ? null : Number(r.obp),
    sections: (r.student_exam_sections ?? [])
      .slice()
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((s: any) => ({ name: s.section_name, correctCount: s.correct_count, wrongCount: s.wrong_count })),
  }))
}
