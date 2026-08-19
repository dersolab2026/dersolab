import { calculateTotalNet } from '@/lib/exams/scoring'
import { eslestir, planTutturma, type PlanItem, type StudyLogLite } from '@/lib/coaching/plan-progress'
import type { StudentInsight } from '@/lib/students/get-student-insight'

/**
 * Kural tabanlı risk sinyalleri.
 *
 * Hepsi deterministik — model yok, öğrenme yok, olasılık yok. Amaç koça
 * "bu öğrenciye bak" demek, tanı koymak değil.
 *
 * EŞİKLER BİLEREK MUHAFAZAKÂR. Yanlış alarm üreten bir uyarı sistemi bir
 * süre sonra hiç okunmuyor ve o noktadan sonra gerçek uyarıyı da
 * kaçırıyorsun. Az ama doğru sinyal, çok ama gürültülü sinyalden iyi.
 *
 * Ayrıca hiçbir sinyal "veri yok" durumunda ateşlemiyor: yeni başlamış,
 * henüz hiç kayıt girmemiş bir öğrenci için "14 gündür çalışmıyor" demek
 * yanlış olur.
 */

export type SinyalAgirlik = 'dusuk' | 'orta' | 'yuksek'

export interface RiskSinyali {
  kod: string
  baslik: string
  /** Sinyalin NEDEN ateşlendiği — koç bunu görmeden aksiyon alamaz. */
  neden: string
  agirlik: SinyalAgirlik
}

/** Kaç gün kayıt girilmezse sessizlik sayılıyor. */
const SESSIZLIK_GUN = 14

/** Plan tutturma bu yüzdenin altındaysa sinyal. */
const PLAN_ESIK = 50

/** Net trendi için gereken en az deneme. */
const TREND_ASGARI = 3

export interface SinyalGirdisi {
  insight: StudentInsight
  planItems: PlanItem[]
  planWeeks: Record<string, string>
  /** Değerlendirilen hafta (pazartesi). */
  hafta: string
  bugun: string
}

export function riskSinyalleri({ insight, planItems, planWeeks, hafta, bugun }: SinyalGirdisi): RiskSinyali[] {
  const sinyaller: RiskSinyali[] = []

  // 1) Günlük sessizliği — yalnızca daha önce kayıt girmiş öğrenci için.
  if (insight.studyLogs.length > 0) {
    const sonKayit = insight.studyLogs
      .map((l) => l.logDate)
      .reduce((a, b) => (a > b ? a : b))
    const gecenGun = gunFarki(sonKayit, bugun)
    if (gecenGun >= SESSIZLIK_GUN) {
      sinyaller.push({
        kod: 'gunluk-sessiz',
        baslik: 'Günlüğe uzun süredir kayıt girmiyor',
        neden: `Son kayıt ${gecenGun} gün önce (${sonKayit}).`,
        agirlik: gecenGun >= SESSIZLIK_GUN * 2 ? 'yuksek' : 'orta',
      })
    }
  }

  // 2) Gecikmiş ödev.
  const gecikmis = insight.homework.filter(
    (h) => h.status !== 'completed' && h.dueDate !== null && h.dueDate < bugun,
  )
  if (gecikmis.length > 0) {
    sinyaller.push({
      kod: 'odev-gecikmis',
      baslik: `${gecikmis.length} ödev gecikmiş`,
      neden: gecikmis.slice(0, 3).map((h) => `"${h.title}" (${h.dueDate})`).join(', '),
      agirlik: gecikmis.length >= 3 ? 'yuksek' : 'orta',
    })
  }

  // 3) Net trendi — son üç deneme üst üste düşüyorsa.
  const denemeler = [...insight.exams]
    .sort((a, b) => a.examDate.localeCompare(b.examDate))
    .map((e) => ({
      tarih: e.examDate,
      tur: e.examType,
      net: calculateTotalNet(e.examType, e.sections.map((s) => ({
        name: s.name, correct: s.correctCount, wrong: s.wrongCount,
      }))),
    }))

  // Farklı sınav türlerinin netleri kıyaslanamaz; en çok kaydı olan türe
  // bakıyoruz. Karışık listede "düşüş" görmek tamamen yanıltıcı olurdu.
  const turSayaci = new Map<string, number>()
  for (const d of denemeler) turSayaci.set(d.tur, (turSayaci.get(d.tur) ?? 0) + 1)
  const baskinTur = [...turSayaci.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
  const ayniTur = denemeler.filter((d) => d.tur === baskinTur)

  if (ayniTur.length >= TREND_ASGARI) {
    const son = ayniTur.slice(-TREND_ASGARI)
    const surekliDusus = son.every((d, i) => i === 0 || d.net < son[i - 1].net)
    if (surekliDusus) {
      sinyaller.push({
        kod: 'net-dusus',
        baslik: 'Net üst üste düşüyor',
        neden: `Son ${TREND_ASGARI} ${baskinTur?.toUpperCase()} denemesi: ${son.map((d) => d.net.toFixed(1)).join(' → ')}.`,
        agirlik: 'yuksek',
      })
    }
  }

  // 4) Plan tutturma düşük — yalnızca o hafta plan varsa.
  const haftaninPlani = planItems.filter((p) => planWeeks[p.id] === hafta)
  if (haftaninPlani.length > 0) {
    const loglar: StudyLogLite[] = insight.studyLogs.map((l) => ({
      logDate: l.logDate, subject: l.subject, hours: l.hours, questionsSolved: l.questionsSolved,
    }))
    const { yuzde } = planTutturma(eslestir(haftaninPlani, loglar))
    if (yuzde < PLAN_ESIK) {
      sinyaller.push({
        kod: 'plan-dusuk',
        baslik: `Plan tutturma %${yuzde}`,
        neden: `Bu haftanın ${haftaninPlani.length} satırlık planının yarısından azı gerçekleşti.`,
        agirlik: yuzde < PLAN_ESIK / 2 ? 'yuksek' : 'orta',
      })
    }
  }

  const sira: Record<SinyalAgirlik, number> = { yuksek: 0, orta: 1, dusuk: 2 }
  return sinyaller.sort((a, b) => sira[a.agirlik] - sira[b.agirlik])
}

function gunFarki(a: string, b: string): number {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86_400_000)
}

export const AGIRLIK_RENK: Record<SinyalAgirlik, string> = {
  yuksek: '#C2410C',
  orta: '#DD7B3A',
  dusuk: '#E8C468',
}
