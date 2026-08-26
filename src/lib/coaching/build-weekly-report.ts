import { calculateTotalNet } from '@/lib/exams/scoring'
import { eslestir, planTutturma, haftaninGunleri, type PlanItem, type StudyLogLite } from '@/lib/coaching/plan-progress'
import type { StudentInsight } from '@/lib/students/get-student-insight'

/**
 * Haftalık özet raporunun içeriğini üretir.
 *
 * Saf bir fonksiyon: veri girer, rapor çıkar. Böylece e-posta gönderimi
 * olmadan test edilebiliyor ve aynı içerik hem ekranda önizlenip hem
 * e-postayla gönderilebiliyor.
 */

export interface HaftalikRapor {
  ogrenciAdi: string
  haftaBasi: string
  haftaSonu: string
  planTutturmaYuzde: number | null
  planSatirSayisi: number
  toplamDakika: number
  toplamSoru: number
  calisilanGunSayisi: number
  denemeler: { ad: string; net: number; tarih: string }[]
  odev: { tamamlanan: number; toplam: number; gecikmis: number }
  kocYorumu: string
}

export interface RaporGirdisi {
  insight: StudentInsight
  planItems: PlanItem[]
  planWeeks: Record<string, string>
  hafta: string
  kocYorumu: string
}

export function raporOlustur({ insight, planItems, planWeeks, hafta, kocYorumu }: RaporGirdisi): HaftalikRapor {
  const gunler = haftaninGunleri(hafta)
  const haftaBasi = gunler[0]
  const haftaSonu = gunler[6]

  const haftaninPlani = planItems.filter((p) => planWeeks[p.id] === hafta)
  const haftaninLoglari: StudyLogLite[] = insight.studyLogs
    .filter((l) => l.logDate >= haftaBasi && l.logDate <= haftaSonu)
    .map((l) => ({
      logDate: l.logDate, subject: l.subject, hours: l.hours, questionsSolved: l.questionsSolved,
    }))

  const ilerleme = eslestir(haftaninPlani, haftaninLoglari)
  const tutturma = planTutturma(ilerleme)

  const toplamDakika = haftaninLoglari.reduce((t, l) => t + Math.round((Number(l.hours) || 0) * 60), 0)
  const toplamSoru = haftaninLoglari.reduce((t, l) => t + (l.questionsSolved ?? 0), 0)
  const calisilanGunSayisi = new Set(haftaninLoglari.map((l) => l.logDate)).size

  const denemeler = insight.exams
    .filter((e) => e.examDate >= haftaBasi && e.examDate <= haftaSonu)
    .map((e) => ({
      ad: e.examName,
      tarih: e.examDate,
      net: calculateTotalNet(e.examType, e.sections.map((s) => ({
        name: s.name, correct: s.correctCount, wrong: s.wrongCount,
      }))),
    }))

  const bugun = new Date().toISOString().slice(0, 10)
  const odev = {
    tamamlanan: insight.homework.filter((h) => h.status === 'completed').length,
    toplam: insight.homework.length,
    gecikmis: insight.homework.filter(
      (h) => h.status !== 'completed' && h.dueDate !== null && h.dueDate < bugun,
    ).length,
  }

  return {
    ogrenciAdi: insight.name,
    haftaBasi,
    haftaSonu,
    // Plan yoksa yuzde uretmiyoruz: 0 gostermek "hic calismadi" gibi
    // okunuyor, oysa ortada plan yok.
    planTutturmaYuzde: haftaninPlani.length > 0 ? tutturma.yuzde : null,
    planSatirSayisi: haftaninPlani.length,
    toplamDakika,
    toplamSoru,
    calisilanGunSayisi,
    denemeler,
    odev,
    kocYorumu,
  }
}

function tarihTr(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()}.${d.getUTCMonth() + 1}.${d.getUTCFullYear()}`
}

function saatMetni(dakika: number): string {
  const s = Math.floor(dakika / 60)
  const d = dakika % 60
  if (s === 0) return `${d} dakika`
  if (d === 0) return `${s} saat`
  return `${s} saat ${d} dakika`
}

/** Raporun e-posta gövdesi. */
export function raporHtml(r: HaftalikRapor, appUrl: string): string {
  const satir = (etiket: string, deger: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#61757B;">${etiket}</td>` +
    `<td style="padding:6px 0;font-weight:700;color:var(--yazi);">${deger}</td></tr>`

  const denemeSatirlari = r.denemeler.length > 0
    ? r.denemeler.map((d) => `<li>${kacis(d.ad)} — <strong>${d.net.toFixed(2)} net</strong> (${tarihTr(d.tarih)})</li>`).join('')
    : '<li>Bu hafta deneme kaydı yok.</li>'

  return `
    <div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:var(--yazi);max-width:600px;">
      <h2 style="margin:0 0 4px;">Haftalık Özet</h2>
      <p style="margin:0 0 16px;color:#61757B;">
        ${kacis(r.ogrenciAdi)} · ${tarihTr(r.haftaBasi)} – ${tarihTr(r.haftaSonu)}
      </p>

      <table style="border-collapse:collapse;margin-bottom:16px;">
        ${r.planTutturmaYuzde !== null
          ? satir('Plan tutturma', `%${r.planTutturmaYuzde} (${r.planSatirSayisi} satır)`)
          : satir('Plan', 'Bu hafta plan girilmemiş')}
        ${satir('Çalışma süresi', saatMetni(r.toplamDakika))}
        ${satir('Çözülen soru', String(r.toplamSoru))}
        ${satir('Çalışılan gün', `${r.calisilanGunSayisi}/7`)}
        ${satir('Ödev', `${r.odev.tamamlanan}/${r.odev.toplam} tamamlandı${r.odev.gecikmis > 0 ? ` · ${r.odev.gecikmis} gecikmiş` : ''}`)}
      </table>

      <h3 style="margin:0 0 6px;font-size:15px;">Bu haftanın denemeleri</h3>
      <ul style="margin:0 0 16px;padding-left:20px;">${denemeSatirlari}</ul>

      ${r.kocYorumu.trim()
        ? `<h3 style="margin:0 0 6px;font-size:15px;">Koçunun notu</h3>
           <p style="margin:0 0 16px;white-space:pre-wrap;">${kacis(r.kocYorumu)}</p>`
        : ''}

      <p style="margin:0;">
        <a href="${appUrl}/dashboard/student/gunluk" style="color:#2E7D6F;font-weight:700;">
          Günlüğünü aç
        </a>
      </p>
    </div>
  `.trim()
}

/**
 * Rapor icerigi kullanici girdisinden geliyor (ogrenci adi, kocun yorumu,
 * deneme adi). HTML'e dogrudan basmak enjeksiyona acik olurdu.
 */
function kacis(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
