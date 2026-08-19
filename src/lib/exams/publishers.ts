/**
 * Deneme yayınları listesi.
 *
 * Serbest metin yerine liste olmasının sebebi: aynı yayın "3D", "3D
 * Yayınları", "3d yayin" diye üç ayrı kayda düşerse zorluk karşılaştırması
 * anlamsızlaşıyor. Liste kapalı değil — "Diğer" seçilip serbest metin
 * yazılabiliyor, çünkü her yayını önceden bilmek mümkün değil.
 *
 * Liste alfabetik; sık kullanılanlar öne alınmadı, çünkü hangi yayının sık
 * kullanıldığını henüz bilmiyoruz. Veri biriktikçe sıralama değişebilir.
 */

export const DENEME_YAYINLARI = [
  '345 Yayınları',
  '3D Yayınları',
  'Acil Yayınları',
  'Apotemi Yayınları',
  'Bilfen Yayınları',
  'Bilgi Sarmal',
  'Bindeğer Yayınları',
  'Çap Yayınları',
  'Endemik Yayınları',
  'Esen Yayınları',
  'Final Yayınları',
  'Karekök Yayınları',
  'Limit Yayınları',
  'Metin Yayınları',
  'Nitelik Yayınları',
  'Okyanus Yayınları',
  'Palme Yayınları',
  'Paraf Yayınları',
  'Sınav Yayınları',
  'Supara Yayınları',
  'Tonguç Akademi',
  'Ulus Yayınları',
  'Üç Dört Beş Yayınları',
  'Zafer Yayınları',
] as const

export const DIGER_YAYIN = 'Diğer'

export type Zorluk = 'kolay' | 'orta' | 'zor'

export const ZORLUK_SECENEKLERI: { deger: Zorluk; etiket: string }[] = [
  { deger: 'kolay', etiket: 'Kolaydı' },
  { deger: 'orta', etiket: 'Normaldi' },
  { deger: 'zor', etiket: 'Zordu' },
]

export const ZORLUK_ETIKET: Record<Zorluk, string> = {
  kolay: 'Kolay',
  orta: 'Normal',
  zor: 'Zor',
}

export const ZORLUK_RENK: Record<Zorluk, string> = {
  kolay: '#6FA89E',
  orta: '#E8C468',
  zor: '#DD7B3A',
}

/**
 * İki denemenin netini karşılaştırırken zorluk farkı varsa uyarı üret.
 *
 * Sayısal bir düzeltme YAPMIYORUZ: "zor denemede net 5 düşük olur" gibi bir
 * katsayı uydurmak, elimizde hiçbir veri yokken yanlış bir kesinlik
 * yaratırdı. Yalnızca karşılaştırmanın sakat olduğunu söylüyoruz.
 */
export function zorlukUyarisi(
  onceki: Zorluk | null | undefined,
  sonraki: Zorluk | null | undefined,
): string | null {
  if (!onceki || !sonraki || onceki === sonraki) return null

  const sira: Record<Zorluk, number> = { kolay: 0, orta: 1, zor: 2 }
  const fark = sira[sonraki] - sira[onceki]

  if (fark > 0) {
    return `Son deneme bir öncekinden daha zordu (${ZORLUK_ETIKET[onceki].toLowerCase()} → ${ZORLUK_ETIKET[sonraki].toLowerCase()}); net düşüşü gerçek bir gerileme olmayabilir.`
  }
  return `Son deneme bir öncekinden daha kolaydı (${ZORLUK_ETIKET[onceki].toLowerCase()} → ${ZORLUK_ETIKET[sonraki].toLowerCase()}); net artışını olduğundan büyük görmemek gerekir.`
}
