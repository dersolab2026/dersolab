import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calculateNet, type ExamType } from '@/lib/exams/scoring'

/**
 * VELİNİN GÖRDÜĞÜ HER ŞEY BURADA.
 *
 * Velinin veri yüzeyi bilerek tek bir dosyada toplandı: ileride "veli neyi
 * görüyor" sorusunun cevabı tek yerden okunabilsin, yeni bir alan kazara
 * sızmasın.
 *
 * KAPSAM DIŞI (bilinçli): Günlük (student_study_logs), Koçluk Formu
 * (student_intake_forms), öz değerlendirme, deneme sonrası yansımalar
 * (student_exam_reflections), koç seans notları, öğrencinin eğitmene
 * sorduğu sorular. Bunlar öğrencinin kendi alanı; veriye veli erişirse
 * öğrenci dürüst cevap vermez ve koçluğun değeri düşer. RLS de bu tabloları
 * veliye kapatıyor — buradaki sınır ikinci katman, tek savunma değil.
 */

export interface GuardianBooking {
  id: string
  instructorName: string
  startTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  isTrial: boolean
}

export interface GuardianHomework {
  id: string
  title: string
  dueDate: string | null
  status: 'assigned' | 'submitted' | 'completed'
}

export interface GuardianExamResult {
  id: string
  examName: string
  examType: ExamType
  examDate: string
  net: number
}

export interface GuardianPurchase {
  id: string
  createdAt: string
  creditsGranted: number
  amountPaid: number | null
  status: string
}

export interface GuardianStudentOverview {
  studentId: string
  studentName: string
  studentEmail: string
  creditBalance: number
  bookings: GuardianBooking[]
  homework: GuardianHomework[]
  examResults: GuardianExamResult[]
  purchases: GuardianPurchase[]
}

export interface GuardianStudentSummary {
  studentId: string
  studentName: string
  creditBalance: number
  /** En yakın planlanmış ders; yoksa null. */
  siradakiDers: { instructorName: string; startTime: string } | null
  buAyDers: number
  /** Geçmiş derslerde katılım oranı (%); hiç ders yoksa null. */
  katilimYuzde: number | null
  bekleyenOdev: number
}

/**
 * Veli ana sayfası için öğrenci özetleri.
 *
 * Ana sayfa eskiden yalnızca isim listesi gösteriyordu; veli tek soruya
 * cevap arıyor — "gidiyor mu, işe yarıyor mu" — ve bunun için detay
 * sayfasına girmek zorundaydı. Özet o cevabı ilk ekranda veriyor.
 */
export async function getGuardianStudentSummaries(): Promise<GuardianStudentSummary[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: baglar } = await supabase
    .from('guardian_links').select('student_id').eq('guardian_id', user.id)
  if (!baglar || baglar.length === 0) return []

  const admin = createAdminClient()
  const ogrenciIdler = baglar.map((b) => b.student_id)

  const [{ data: kisiler }, { data: ogrenciSatirlari }, { data: dersler }, { data: odevler }] =
    await Promise.all([
      admin.from('users').select('id, name').in('id', ogrenciIdler),
      supabase.from('students').select('user_id, credit_balance').in('user_id', ogrenciIdler),
      supabase
        .from('bookings')
        .select('student_id, instructor_id, start_time, status')
        .in('student_id', ogrenciIdler),
      supabase.from('homework').select('student_id, status').in('student_id', ogrenciIdler),
    ])

  const egitmenIdler = [...new Set((dersler ?? []).map((d) => d.instructor_id))]
  const { data: egitmenler } = egitmenIdler.length > 0
    ? await admin.from('users').select('id, name').in('id', egitmenIdler)
    : { data: [] as { id: string; name: string }[] }

  const adById = new Map((kisiler ?? []).map((u) => [u.id, u.name]))
  const egitmenAdi = new Map((egitmenler ?? []).map((u) => [u.id, u.name]))
  const krediById = new Map((ogrenciSatirlari ?? []).map((s) => [s.user_id, s.credit_balance]))

  const simdi = new Date()
  const ayBasi = new Date(simdi.getFullYear(), simdi.getMonth(), 1).toISOString()

  return ogrenciIdler.map((id) => {
    const kendiDersleri = (dersler ?? []).filter((d) => d.student_id === id)

    const yaklasan = kendiDersleri
      .filter((d) => d.status === 'scheduled' && new Date(d.start_time) >= simdi)
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0]

    // Katılım: yalnızca gerçekleşmesi beklenen dersler sayılıyor.
    // İptaller hesaba katılmıyor — iptal edilmiş ders "kaçırılmış" değil.
    const gecmis = kendiDersleri.filter((d) => d.status === 'completed' || d.status === 'no_show')
    const katilan = gecmis.filter((d) => d.status === 'completed').length

    return {
      studentId: id,
      studentName: adById.get(id) ?? 'Öğrenci',
      creditBalance: krediById.get(id) ?? 0,
      siradakiDers: yaklasan
        ? {
            instructorName: egitmenAdi.get(yaklasan.instructor_id) ?? 'Eğitmen',
            startTime: yaklasan.start_time,
          }
        : null,
      buAyDers: kendiDersleri.filter(
        (d) => d.status === 'completed' && d.start_time >= ayBasi,
      ).length,
      katilimYuzde: gecmis.length > 0 ? Math.round((katilan / gecmis.length) * 100) : null,
      bekleyenOdev: (odevler ?? []).filter(
        (o) => o.student_id === id && o.status !== 'completed',
      ).length,
    }
  })
}

/**
 * Tek öğrencinin veli görünümü.
 *
 * Bağ kontrolü ÖNCE yapılıyor: bağ yoksa hiç sorgu atılmadan null dönüyor.
 * RLS zaten engellerdi, ama yetkiyi çağırana bırakmamak için burada da
 * açık bir kapı var.
 */
export async function getGuardianStudentOverview(
  studentId: string,
): Promise<GuardianStudentOverview | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: link } = await supabase
    .from('guardian_links')
    .select('id')
    .eq('guardian_id', user.id)
    .eq('student_id', studentId)
    .maybeSingle()
  if (!link) return null

  const [
    { data: studentRow },
    { data: bookings },
    { data: homework },
    { data: exams },
    { data: purchases },
  ] = await Promise.all([
    supabase.from('students').select('credit_balance').eq('user_id', studentId).maybeSingle(),
    supabase
      .from('bookings')
      .select('id, instructor_id, start_time, status, is_trial')
      .eq('student_id', studentId)
      .order('start_time', { ascending: false }),
    supabase
      .from('homework')
      .select('id, title, due_date, status')
      .eq('student_id', studentId)
      .order('due_date', { ascending: false, nullsFirst: false }),
    supabase
      .from('student_exam_results')
      .select('id, exam_name, exam_type, exam_date, correct_count, wrong_count')
      .eq('student_id', studentId)
      .order('exam_date', { ascending: false }),
    supabase
      .from('package_purchases')
      .select('id, created_at, credits_granted, amount_paid, status')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
  ])

  const admin = createAdminClient()
  const instructorIds = [...new Set((bookings ?? []).map((b) => b.instructor_id))]
  const [{ data: studentUser }, { data: instructorUsers }] = await Promise.all([
    admin.from('users').select('name, email').eq('id', studentId).maybeSingle(),
    instructorIds.length > 0
      ? admin.from('users').select('id, name').in('id', instructorIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ])

  const nameById = new Map((instructorUsers ?? []).map((u) => [u.id, u.name]))

  return {
    studentId,
    studentName: studentUser?.name ?? 'Öğrenci',
    studentEmail: studentUser?.email ?? '',
    creditBalance: studentRow?.credit_balance ?? 0,
    bookings: (bookings ?? []).map((b) => ({
      id: b.id,
      instructorName: nameById.get(b.instructor_id) ?? 'Eğitmen',
      startTime: b.start_time,
      status: b.status,
      isTrial: b.is_trial ?? false,
    })),
    homework: (homework ?? []).map((h) => ({
      id: h.id,
      title: h.title,
      dueDate: h.due_date,
      status: h.status,
    })),
    examResults: (exams ?? []).map((e) => ({
      id: e.id,
      examName: e.exam_name,
      examType: e.exam_type as ExamType,
      examDate: e.exam_date,
      net: calculateNet(e.exam_type as ExamType, e.correct_count, e.wrong_count),
    })),
    purchases: (purchases ?? []).map((p) => ({
      id: p.id,
      createdAt: p.created_at,
      creditsGranted: p.credits_granted,
      amountPaid: p.amount_paid === null ? null : Number(p.amount_paid),
      status: p.status,
    })),
  }
}
