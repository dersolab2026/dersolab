'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ErrorTypeCounts } from '@/lib/exams/error-types'
import type { Zorluk } from '@/lib/exams/publishers'
import { tekil } from '@/lib/exams/embed'
import { EXAM_TYPES, supportsObp, type ExamType } from '@/lib/exams/scoring'
import { getExamSections, requiresTrack, type ExamTrack } from '@/lib/exams/structure'

type ActionResult = { success: true } | { success: false; error: string }

export interface ExamSectionEntry {
  name: string
  correctCount: number
  wrongCount: number
  /** Yanlislarin tip kirilimi — istege bagli, sonradan doldurulabiliyor. */
  errorTypes?: ErrorTypeCounts
}


export interface ExamResultEntry {
  publisher: string | null
  difficulty: Zorluk | null
  durationMinutes: number | null
  reflection: { preparation: string | null; timePressureSubject: string | null } | null
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
  publisher?: string | null
  difficulty?: Zorluk | null
  durationMinutes?: number | null
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
  // EXAM_TYPES artik yalnizca SUNULAN turleri iceriyor (lgs/tyt/ayt/ydt);
  // ExamType ise eski kayitlar okunabilsin diye kpss/dgs/ales'i de
  // taniyor. Bu kontrol ikisinin arasindaki siniri koruyor: emekli bir
  // turu dogrudan istekle gondermek de reddediliyor, yalnizca acilir
  // listede gizlemis olmuyoruz.
  if (!(EXAM_TYPES as readonly ExamType[]).includes(params.examType)) {
    return { success: false, error: 'Geçersiz deneme türü' }
  }

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
    publisher: params.publisher?.trim() || null,
    difficulty: params.difficulty ?? null,
    duration_minutes: params.durationMinutes ?? null,
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

/**
 * Kaydedilmis bir denemenin yanlislarini tiplere bolmek.
 *
 * Ayri bir aksiyon olmasinin sebebi: kayit anindaki formda 7 derse 4'er kutu
 * eklemek 28 alan demek olurdu. Ogrenci denemeyi hizlica kaydediyor, hata
 * analizini isterse sonradan, deneme kagidi elindeyken yapiyor.
 */
export async function updateSectionErrorTypes(
  examResultId: string,
  sections: { name: string; errorTypes: ErrorTypeCounts }[],
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: kayit } = await supabase
    .from('student_exam_results').select('id').eq('id', examResultId)
    .eq('student_id', user.id).maybeSingle()
  if (!kayit) return { success: false, error: 'Deneme bulunamadı' }

  const { data: mevcut } = await supabase
    .from('student_exam_sections')
    .select('id, section_name, wrong_count')
    .eq('exam_result_id', examResultId)

  const idByName = new Map((mevcut ?? []).map((m) => [m.section_name, m]))

  for (const s of sections) {
    const bolum = idByName.get(s.name)
    if (!bolum) continue

    const t = s.errorTypes
    const toplam = t.knowledge + t.careless + t.misread + t.timeout
    if (toplam > bolum.wrong_count) {
      return {
        success: false,
        error: `${s.name}: hata tipleri toplamı (${toplam}) yanlış sayısını (${bolum.wrong_count}) aşamaz`,
      }
    }
    if ([t.knowledge, t.careless, t.misread, t.timeout].some((n) => n < 0)) {
      return { success: false, error: `${s.name}: negatif değer girilemez` }
    }

    const { error } = await supabase.from('student_exam_sections').update({
      wrong_knowledge: t.knowledge || null,
      wrong_careless: t.careless || null,
      wrong_misread: t.misread || null,
      wrong_timeout: t.timeout || null,
    }).eq('id', bolum.id)

    if (error) return { success: false, error: error.message }
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
    .select('id, exam_name, exam_type, exam_date, track, correct_count, wrong_count, obp, publisher, difficulty, duration_minutes, student_exam_reflections(preparation, time_pressure_subject), student_exam_sections(section_name, correct_count, wrong_count, display_order, wrong_knowledge, wrong_careless, wrong_misread, wrong_timeout)')
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
    publisher: r.publisher ?? null,
    difficulty: (r.difficulty ?? null) as Zorluk | null,
    durationMinutes: r.duration_minutes ?? null,
    reflection: (() => {
      const y = tekil<{ preparation: string | null; time_pressure_subject: string | null }>(r.student_exam_reflections)
      return y ? { preparation: y.preparation ?? null, timePressureSubject: y.time_pressure_subject ?? null } : null
    })(),
    sections: (r.student_exam_sections ?? [])
      .slice()
      .sort((a: any, b: any) => a.display_order - b.display_order)
      .map((s: any) => ({
        name: s.section_name,
        correctCount: s.correct_count,
        wrongCount: s.wrong_count,
        errorTypes: (s.wrong_knowledge ?? s.wrong_careless ?? s.wrong_misread ?? s.wrong_timeout) === null
          ? undefined
          : {
              knowledge: s.wrong_knowledge ?? 0,
              careless: s.wrong_careless ?? 0,
              misread: s.wrong_misread ?? 0,
              timeout: s.wrong_timeout ?? 0,
            },
      })),
  }))
}

/** Deneme sonrasi kisa yansitma: hazirlik ve sure baskisi. */
export async function saveExamReflection(
  examResultId: string,
  preparation: string,
  timePressureSubject: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: kayit } = await supabase
    .from('student_exam_results').select('id').eq('id', examResultId)
    .eq('student_id', user.id).maybeSingle()
  if (!kayit) return { success: false, error: 'Deneme bulunamadı' }

  const { error } = await supabase.from('student_exam_reflections').upsert({
    exam_result_id: examResultId,
    preparation: preparation.trim() || null,
    time_pressure_subject: timePressureSubject.trim() || null,
  }, { onConflict: 'exam_result_id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}
