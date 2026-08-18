import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { GUIDANCE_SUBJECT } from '@/lib/constants'

export type DemoRequestType = 'demo_lesson' | 'coaching_week'

export interface PendingDemoRequest {
  id: string
  studentId: string | null
  studentName: string
  leadEmail: string | null
  createdAt: string
  requestType: DemoRequestType
}

/**
 * Egitmenin/kocun ustlenebilecegi bekleyen talepler.
 *
 * Havuza ozgu iki filtre (reddettiklerini gizle, turune uygun olmayanlari
 * gosterme) burada uygulaniyor; RLS'e birakilmiyor. Sebebi:
 * "demo_requests_select" politikasinda `public.is_admin()` bagimsiz bir OR
 * dali (0036'dan beri boyle) ve OR kisa devre yaptigi icin admin hesabinda
 * ne decline filtresi ne de tur uygunlugu hic degerlendirilmiyor. Admin ayni
 * zamanda egitmen/koc oldugu icin bu, reddedilen talebin havuzda kalmasi
 * olarak goruluyordu. RLS guvenlik tabani olarak oldugu gibi kaliyor (admin
 * veritabani tarafinda tumunu gorebilmeye devam ediyor), listenin dogrulugu
 * ise burada sagliyor.
 */
export async function getPendingDemoRequests(): Promise<PendingDemoRequest[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: requests, error } = await supabase
    .from('demo_lesson_requests')
    .select('id, student_id, lead_name, lead_email, created_at, request_type')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  if (!requests || requests.length === 0) return []

  const [{ data: instructorRow }, { data: declineRows }] = await Promise.all([
    supabase.from('instructors').select('offers_free_trial, subjects').eq('user_id', user.id).maybeSingle(),
    supabase.from('demo_lesson_declines').select('request_id').eq('instructor_id', user.id),
  ])

  const reddedilen = new Set((declineRows ?? []).map((d) => d.request_id))
  const dersVerir = instructorRow?.offers_free_trial === true
  const kocMu = (instructorRow?.subjects ?? []).includes(GUIDANCE_SUBJECT)

  const acikTalepler = requests.filter((r) => {
    if (reddedilen.has(r.id)) return false
    const tur = (r.request_type ?? 'demo_lesson') as DemoRequestType
    return tur === 'coaching_week' ? kocMu : dersVerir
  })

  if (acikTalepler.length === 0) return []

  const admin = createAdminClient()
  const studentIds = [...new Set(acikTalepler.map((r) => r.student_id).filter((id): id is string => !!id))]
  const { data: users } = studentIds.length > 0
    ? await admin.from('users').select('id, name').in('id', studentIds)
    : { data: [] }
  const nameById = new Map((users ?? []).map((u) => [u.id, u.name]))

  return acikTalepler.map((r) => ({
    id: r.id,
    studentId: r.student_id,
    studentName: r.student_id ? (nameById.get(r.student_id) ?? 'Öğrenci') : (r.lead_name ?? 'İsimsiz'),
    leadEmail: r.lead_email,
    createdAt: r.created_at,
    requestType: (r.request_type ?? 'demo_lesson') as DemoRequestType,
  }))
}
