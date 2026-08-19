/**
 * Çalışma serisi ve sınav geri sayımı.
 *
 * Seri tamamen mevcut günlük kayıtlarından türetiliyor; yeni veri yok.
 * Ağır oyunlaştırmaya (XP, rozet, seviye) girilmedi — seri tek başına
 * Günlük'ün bırakılma sorununa yeterli bir kanca.
 */

/**
 * Kesintisiz çalışma günü sayısı.
 *
 * BUGÜN henüz kayıt girilmemişse seri BOZULMUŞ sayılmıyor: gün daha
 * bitmedi, öğrenciyi sabah 9'da "serin bitti" diye cezalandırmak yanlış
 * olur. Sayım dünden geriye gidiyor, bugün varsa başa ekleniyor.
 */
export function calismaSerisi(gunler: string[], bugun: string): number {
  if (gunler.length === 0) return 0

  const kume = new Set(gunler)
  const bugunVar = kume.has(bugun)

  let seri = bugunVar ? 1 : 0
  let imlec = birGunOnce(bugun)

  while (kume.has(imlec)) {
    seri++
    imlec = birGunOnce(imlec)
  }

  return seri
}

/** Bu seride en uzun kesintisiz dizinin uzunluğu. */
export function enUzunSeri(gunler: string[]): number {
  if (gunler.length === 0) return 0
  const sirali = [...new Set(gunler)].sort()

  let enUzun = 1
  let mevcut = 1
  for (let i = 1; i < sirali.length; i++) {
    if (birGunOnce(sirali[i]) === sirali[i - 1]) mevcut++
    else mevcut = 1
    if (mevcut > enUzun) enUzun = mevcut
  }
  return enUzun
}

function birGunOnce(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toISOString().slice(0, 10)
}


/** Seriyi anlatan kısa cümle. */
export function seriMetni(seri: number): string {
  if (seri === 0) return 'Bugün başlamak için iyi bir gün.'
  if (seri === 1) return '1 gündür üst üste çalışıyorsun.'
  return `${seri} gündür üst üste çalışıyorsun.`
}
