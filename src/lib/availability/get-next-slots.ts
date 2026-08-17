import { createClient } from '@/lib/supabase/server'
import { LESSON_DURATION_MINUTES } from '@/lib/constants'

// Turkiye sabit UTC+3.
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000
const LOOKAHEAD_DAYS = 14

// Import edilen sabiti dogrudan bir `for` dongusunun artirma ifadesinde
// kullanmayin: Next 16 paketleyicisi orada referansi yeniden yazmayi atlayip
// uretim derlemesinde "is not defined" hatasi veriyor (dev'de gorunmuyor).
const SLOT_MS = LESSON_DURATION_MINUTES * 60_000

interface AvailabilityRuleRow {
  instructor_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

/**
 * Listelenen egitmenlerin ilk musait ders saatini tek sorguda hesaplar.
 *
 * Kart uzerinde teasir amacli kullanildigi icin egitmenin kisisel Google
 * takvimindeki mesguliyetlere BAKMAZ — o kontrol rezervasyon sayfasindaki
 * gercek takvimde yapiliyor. Burada sadece haftalik ajanda kurallari ve
 * platform uzerinden alinmis rezervasyonlar dikkate aliniyor; boylece liste
 * sayfasi egitmen basina bir Google API cagrisi yapmak zorunda kalmiyor.
 */
export async function getNextAvailableSlots(instructorIds: string[]): Promise<Map<string, Date>> {
  const sonuc = new Map<string, Date>()
  if (instructorIds.length === 0) return sonuc

  const supabase = await createClient()
  const now = new Date()
  const rangeEnd = new Date(now.getTime() + LOOKAHEAD_DAYS * 24 * 60 * 60 * 1000)

  const [{ data: rules }, { data: bookings }] = await Promise.all([
    supabase.from('instructor_availability')
      .select('instructor_id, day_of_week, start_time, end_time')
      .in('instructor_id', instructorIds).eq('is_active', true),
    supabase.from('bookings')
      .select('instructor_id, start_time')
      .in('instructor_id', instructorIds)
      .in('status', ['scheduled', 'completed'])
      .gte('start_time', now.toISOString())
      .lte('start_time', rangeEnd.toISOString()),
  ])

  const rulesByInstructor = new Map<string, AvailabilityRuleRow[]>()
  for (const r of (rules ?? []) as AvailabilityRuleRow[]) {
    const liste = rulesByInstructor.get(r.instructor_id) ?? []
    liste.push(r)
    rulesByInstructor.set(r.instructor_id, liste)
  }

  const doluByInstructor = new Map<string, Set<number>>()
  for (const b of (bookings ?? []) as { instructor_id: string; start_time: string }[]) {
    const kume = doluByInstructor.get(b.instructor_id) ?? new Set<number>()
    kume.add(new Date(b.start_time).getTime())
    doluByInstructor.set(b.instructor_id, kume)
  }

  for (const instructorId of instructorIds) {
    const kurallar = rulesByInstructor.get(instructorId)
    if (!kurallar || kurallar.length === 0) continue
    const dolu = doluByInstructor.get(instructorId) ?? new Set<number>()

    const ilk = ilkMusaitSlot(kurallar, dolu, now, LOOKAHEAD_DAYS)
    if (ilk) sonuc.set(instructorId, ilk)
  }

  return sonuc
}

function ilkMusaitSlot(
  kurallar: AvailabilityRuleRow[],
  dolu: Set<number>,
  now: Date,
  gunSayisi: number,
): Date | null {
  for (let gunFarki = 0; gunFarki < gunSayisi; gunFarki++) {
    // Istanbul yerel gununu sabit offset ile buluyoruz.
    const istanbulNow = new Date(now.getTime() + ISTANBUL_OFFSET_MS)
    const hedef = new Date(istanbulNow.getTime() + gunFarki * 24 * 60 * 60 * 1000)
    const yil = hedef.getUTCFullYear()
    const ay = hedef.getUTCMonth()
    const gun = hedef.getUTCDate()
    const haftaGunu = hedef.getUTCDay()

    const gunKurallari = kurallar
      .filter((k) => k.day_of_week === haftaGunu)
      .sort((a, b) => a.start_time.localeCompare(b.start_time))

    for (const kural of gunKurallari) {
      const [basSaat, basDk] = kural.start_time.split(':').map(Number)
      const [bitSaat, bitDk] = kural.end_time.split(':').map(Number)

      const pencereBas = Date.UTC(yil, ay, gun, basSaat, basDk) - ISTANBUL_OFFSET_MS
      const pencereBit = Date.UTC(yil, ay, gun, bitSaat, bitDk) - ISTANBUL_OFFSET_MS

      for (let t = pencereBas; t + SLOT_MS <= pencereBit; t += SLOT_MS) {
        if (t <= now.getTime()) continue
        if (dolu.has(t)) continue
        return new Date(t)
      }
    }
  }
  return null
}
