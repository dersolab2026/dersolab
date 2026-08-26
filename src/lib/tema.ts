import type { UserRole } from '@/types'

/**
 * Tema sistemi devrede mi?
 *
 * SU AN KAPALI — bilerek. Jeton altyapisi hazir ve calisiyor, ama ogrenci
 * paleti henuz secilmedi (mavi/gri secenekler degerlendiriliyor).
 *
 * Kapaliyken hicbir yere `data-tema` yazilmiyor, dolayisiyla butun
 * jetonlar :root varsayilanlarina dusuyor. O varsayilanlar goc oncesindeki
 * sabit hex'lerin BIREBIR AYNISI: goce giren 1013 rengin 962'si ayni
 * degerli jetonla karsilandi, kalani da ayni degerle globals.css'e
 * tasindi. Yani site goc oncesiyle piksel piksel ayni goruniyor.
 *
 * ACMAK ICIN yalnizca bu satiri `true` yapmak yeterli. Uc tuketici de
 * (kok duzen, vitrin sekmeleri, hos geldin paketi sayfasi) buna bakiyor;
 * boylece "bir yeri acip digerini unutma" hatasi olmuyor — bu dosyadaki
 * ROL_TEMASI notu da tam olarak o hatanin bir kez yasandigini anlatiyor.
 */
export const TEMA_ACIK = false

/**
 * Rolun tasarim dili.
 *
 * Giris yaptiktan sonra herkes ayni siteyi degil, kendi diline gore
 * giydirilmis bir ekran goruyor. Renkler `globals.css` icindeki
 * jetonlardan geliyor; buradaki deger yalnizca hangi jeton takiminin
 * gecerli olacagini soyluyor.
 *
 * Hem panel hem pazar yeri duzeni ayni haritayi kullaniyor: iki yerde
 * ayri ayri yazilsaydi biri guncellenip digeri unutulurdu — nitekim
 * ilk surumde tam bu oldu ve /instructors, /kocluk, /demo-ders
 * sayfalari temasiz kaldi.
 *
 * Yonetim paneli bilerek disarida: ic arac, kimseye hitap etmiyor,
 * marka paletinde kalmasi daha okunakli.
 */
export const ROL_TEMASI: Partial<Record<UserRole, string>> = {
  student: 'ogrenci',
  parent: 'veli',
  instructor: 'egitmen',
}
