export interface PlanItem {
  id: string
  planDate: string
  planTime: string | null
  subject: string
  topic: string | null
  source: string | null
  targetQuestions: number | null
  targetMinutes: number | null
  status: 'planned' | 'done' | 'skipped'
}

export interface StudyLogLite {
  logDate: string
  subject: string
  hours: number | null
  questionsSolved: number | null
}

export interface PlanItemProgress extends PlanItem {
  /** Bu satira denk gelen gunluk kayitlarindan toplananlar. */
  gerceklesenSoru: number
  gerceklesenDakika: number
  /** Ogrenci o gun o dersten herhangi bir kayit girmis mi. */
  eslesti: boolean
  /** Hedef verilmisse ne kadari tuttu (0–1); hedef yoksa null. */
  oran: number | null
}

/**
 * Plan satirlarini gunluk kayitlariyla eslestir.
 *
 * Eslestirme AYNI GUN + AYNI DERS uzerinden yapiliyor. Konu bazinda
 * eslestirmeyi bilerek yapmiyoruz: konu alani serbest metin ve ogrenci
 * "Türev" derken koc "Türev Alma Kurallari" yazmis olabilir; boyle bir
 * eslesme sessizce tutmaz ve ogrenciyi calismamis gibi gosterir.
 *
 * Bir gunde ayni dersten birden fazla kayit varsa hepsi toplanir.
 */
export function eslestir(items: PlanItem[], logs: StudyLogLite[]): PlanItemProgress[] {
  return items.map((item) => {
    const denk = logs.filter(
      (l) => l.logDate === item.planDate && l.subject === item.subject,
    )

    const gerceklesenSoru = denk.reduce((t, l) => t + (l.questionsSolved ?? 0), 0)
    const gerceklesenDakika = denk.reduce((t, l) => t + Math.round((Number(l.hours) || 0) * 60), 0)

    // Hedef verilmisse orani ona gore, verilmemisse yalnizca "girdi mi"ye bak.
    let oran: number | null = null
    const oranlar: number[] = []
    if (item.targetQuestions) oranlar.push(gerceklesenSoru / item.targetQuestions)
    if (item.targetMinutes) oranlar.push(gerceklesenDakika / item.targetMinutes)
    if (oranlar.length > 0) {
      oran = Math.min(1, oranlar.reduce((a, b) => a + b, 0) / oranlar.length)
    }

    return {
      ...item,
      gerceklesenSoru,
      gerceklesenDakika,
      eslesti: denk.length > 0,
      oran,
    }
  })
}

/**
 * Haftanin tek sayisi: plan tutturma yuzdesi.
 *
 * Kocun elle "done" dedigi satir tam sayilir; "skipped" hic sayilmaz
 * (paydadan da duser, cunku koc o isi bilerek iptal etmis). Geri kalanlar
 * hedef varsa orana, yoksa girildi/girilmedi'ye gore hesaplanir.
 */
export function planTutturma(ilerleme: PlanItemProgress[]): { yuzde: number; sayilan: number } {
  const sayilanlar = ilerleme.filter((i) => i.status !== 'skipped')
  if (sayilanlar.length === 0) return { yuzde: 0, sayilan: 0 }

  const toplam = sayilanlar.reduce((t, i) => {
    if (i.status === 'done') return t + 1
    if (i.oran !== null) return t + i.oran
    return t + (i.eslesti ? 1 : 0)
  }, 0)

  return {
    yuzde: Math.round((toplam / sayilanlar.length) * 100),
    sayilan: sayilanlar.length,
  }
}

/** Verilen tarihin icinde bulundugu haftanin pazartesi'si (ISO gun). */
export function haftaninPazartesi(tarih: Date): string {
  const d = new Date(Date.UTC(tarih.getFullYear(), tarih.getMonth(), tarih.getDate()))
  // getUTCDay: 0 pazar, 1 pazartesi ... Pazar'i onceki haftaya sayiyoruz.
  const gun = d.getUTCDay()
  const fark = gun === 0 ? -6 : 1 - gun
  d.setUTCDate(d.getUTCDate() + fark)
  return d.toISOString().slice(0, 10)
}

export const GUN_ADLARI = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

/** Pazartesi tarihinden itibaren haftanin 7 gununun ISO tarihleri. */
export function haftaninGunleri(pazartesi: string): string[] {
  const [y, a, g] = pazartesi.split('-').map(Number)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(Date.UTC(y, a - 1, g + i))
    return d.toISOString().slice(0, 10)
  })
}
