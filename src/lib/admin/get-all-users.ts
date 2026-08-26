import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminStudentRow {
  id: string
  name: string
  email: string
  createdAt: string
  gradeTrack: string | null
  creditBalance: number
  freeTrialUsed: boolean
}

export interface AdminInstructorRow {
  id: string
  name: string
  email: string
  createdAt: string
  approvalStatus: string | null
  calendarConnected: boolean
  offersFreeTrial: boolean
  payoutName: string | null
  payoutIban: string | null
  payoutUpdatedAt: string | null
}

export interface AdminParentRow {
  id: string
  name: string
  email: string
  createdAt: string
  /** Bu velinin izledigi ogrencilerin adlari (guardian_links uzerinden). */
  linkedStudents: string[]
}

export interface AdminUsersData {
  students: AdminStudentRow[]
  instructors: AdminInstructorRow[]
  parents: AdminParentRow[]
}

/**
 * Tum ogrenci ve egitmen kayitlari — admin panelindeki listeler icin.
 *
 * KENDI YETKI KONTROLUNU YAPIYOR. Bu fonksiyon RLS'i atlayan admin
 * istemcisini kullaniyor ve donen veride e-posta, kredi bakiyesi ve
 * EGITMEN IBAN'I var. Bugun yalnizca /dashboard/admin altindaki sayfalardan
 * cagriliyor ve o rota grubunun layout'u admin olmayani yonlendiriyor —
 * yani konumu sayesinde guvenli. Ama konum bir garanti degil: yarin bir
 * server action ya da API rotasindan cagrilirsa (ikisinde de layout korumasi
 * yok) tum kullanicilarin banka bilgisi sizar. Guvenlik cagirana
 * birakilmamali.
 */
export async function getAllStudentsAndInstructors(): Promise<AdminUsersData> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { students: [], instructors: [], parents: [] }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'admin') return { students: [], instructors: [], parents: [] }

  const admin = createAdminClient()

  const [{ data: users }, { data: students }, { data: instructors }, { data: payouts }, { data: baglar }] = await Promise.all([
    admin.from('users').select('id, name, email, role, created_at').in('role', ['student', 'instructor', 'parent', 'admin']).is('deleted_at', null),
    admin.from('students').select('user_id, grade_track, credit_balance, free_trial_used'),
    admin.from('instructors').select('user_id, approval_status, calendar_connected, offers_free_trial'),
    admin.from('instructor_payout_details').select('user_id, payout_name, payout_iban, payout_updated_at'),
    admin.from('guardian_links').select('guardian_id, student_id'),
  ])

  const studentByUserId = new Map((students ?? []).map((s) => [s.user_id, s]))
  const instructorByUserId = new Map((instructors ?? []).map((i) => [i.user_id, i]))
  const payoutByUserId = new Map((payouts ?? []).map((p) => [p.user_id, p]))

  const studentRows: AdminStudentRow[] = (users ?? [])
    .filter((u) => u.role === 'student')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      gradeTrack: studentByUserId.get(u.id)?.grade_track ?? null,
      creditBalance: studentByUserId.get(u.id)?.credit_balance ?? 0,
      freeTrialUsed: studentByUserId.get(u.id)?.free_trial_used ?? false,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const instructorRows: AdminInstructorRow[] = (users ?? [])
    // Admin hesabi da (ör. sahibinin kendisi) bir instructors satirina
    // sahipse Eğitmenler listesinde görünsün — sadece role='instructor'
    // ile sınırlamıyoruz.
    .filter((u) => instructorByUserId.has(u.id))
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      approvalStatus: instructorByUserId.get(u.id)?.approval_status ?? null,
      calendarConnected: instructorByUserId.get(u.id)?.calendar_connected ?? false,
      offersFreeTrial: instructorByUserId.get(u.id)?.offers_free_trial ?? false,
      payoutName: payoutByUserId.get(u.id)?.payout_name ?? null,
      payoutIban: payoutByUserId.get(u.id)?.payout_iban ?? null,
      payoutUpdatedAt: payoutByUserId.get(u.id)?.payout_updated_at ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Veli -> izledigi ogrencilerin adlari.
  //
  // Ad, yukarida zaten cektigimiz users listesinden okunuyor; bagli ogrenci
  // icin ayrica sorgu atmiyoruz. Silinmis ogrenciler users sorgusunda
  // (deleted_at is null) elendigi icin haritada bulunmuyor ve listeye de
  // girmiyor: admin ekraninda olu bir isim gostermenin anlami yok.
  const adById = new Map((users ?? []).map((u) => [u.id, u.name || u.email]))
  const ogrencilerByGuardian = new Map<string, string[]>()
  for (const b of baglar ?? []) {
    const ad = adById.get(b.student_id)
    if (!ad) continue
    const mevcut = ogrencilerByGuardian.get(b.guardian_id)
    if (mevcut) mevcut.push(ad)
    else ogrencilerByGuardian.set(b.guardian_id, [ad])
  }

  const parentRows: AdminParentRow[] = (users ?? [])
    .filter((u) => u.role === 'parent')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      linkedStudents: (ogrencilerByGuardian.get(u.id) ?? []).sort((a, b) => a.localeCompare(b, 'tr')),
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { students: studentRows, instructors: instructorRows, parents: parentRows }
}
