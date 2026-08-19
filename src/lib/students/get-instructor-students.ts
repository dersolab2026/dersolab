import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface InstructorStudent {
  userId: string
  name: string
  /** Bu ogrenciyle iliski nasil kuruldu: ders mi, kocluk mu, ikisi de mi. */
  iliski: 'ders' | 'kocluk' | 'ders+kocluk'
  dersSayisi: number
  sonDers: string | null
}

/**
 * Egitmenin (ya da admin'in) verisini gorebildigi ogrenciler.
 *
 * Liste RLS'e birakilmiyor, iliski burada aciktan kuruluyor: egitmenin hangi
 * ogrenciyle ders, hangisiyle kocluk iliskisi oldugunu ekranda gostermek
 * istiyoruz ve bu bilgi politikadan geri gelmiyor.
 *
 * Admin tum ogrencileri gorur (0083'teki can_view_student ile ayni kural),
 * bu yuzden onun icin ayri bir dal var.
 */
export async function getInstructorStudents(): Promise<InstructorStudent[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const admin = createAdminClient()

  const { data: userRow } = await supabase
    .from('users').select('role').eq('id', user.id).maybeSingle()
  const adminMi = userRow?.role === 'admin'

  // Ders iliskisi
  const dersSorgusu = admin.from('bookings').select('student_id, start_time')
  if (!adminMi) dersSorgusu.eq('instructor_id', user.id)
  const { data: tumDersler } = await dersSorgusu

  // Kocluk / tanisma dersi iliskisi
  const talepSorgusu = admin
    .from('demo_lesson_requests')
    .select('student_id')
    .not('student_id', 'is', null)
  if (!adminMi) talepSorgusu.eq('assigned_instructor_id', user.id)
  const { data: talepler } = await talepSorgusu

  const dersVar = new Map<string, { adet: number; son: string | null }>()
  for (const b of tumDersler ?? []) {
    if (!b.student_id) continue
    const m = dersVar.get(b.student_id) ?? { adet: 0, son: null }
    m.adet++
    if (!m.son || b.start_time > m.son) m.son = b.start_time
    dersVar.set(b.student_id, m)
  }

  const koclukVar = new Set<string>()
  for (const t of talepler ?? []) {
    if (t.student_id) koclukVar.add(t.student_id)
  }

  const tumIdler = [...new Set([...dersVar.keys(), ...koclukVar])]
  if (tumIdler.length === 0) return []

  const { data: kisiler } = await admin
    .from('users').select('id, name').in('id', tumIdler).is('deleted_at', null)

  const adById = new Map((kisiler ?? []).map((k) => [k.id, k.name]))

  return tumIdler
    .filter((id) => adById.has(id))
    .map((id) => {
      const d = dersVar.get(id)
      const k = koclukVar.has(id)
      const iliski: InstructorStudent['iliski'] =
        d && k ? 'ders+kocluk' : d ? 'ders' : 'kocluk'
      return {
        userId: id,
        name: adById.get(id) ?? 'Öğrenci',
        iliski,
        dersSayisi: d?.adet ?? 0,
        sonDers: d?.son ?? null,
      }
    })
    .sort((a, b) => (b.sonDers ?? '').localeCompare(a.sonDers ?? ''))
}
