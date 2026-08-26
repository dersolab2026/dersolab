'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, Gift, Play } from 'lucide-react'
import { type FeatureIcon } from '@/components/home/FeatureCard'
import { KartSlayti } from '@/components/home/KartSlayti'
import { KitleDekoru } from '@/components/home/KitleDekoru'
import { PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'
import { TEMA_ACIK } from '@/lib/tema'

/**
 * Vitrinin kitle sekmeleri.
 *
 * Uc kitlenin sorulari birbirinden farkli, hatta zit:
 *   ogrenci  -> "gercekten netimi yukseltir mi, koc gercek mi"
 *   veli     -> "param bosa mi gidiyor, cocugum gidiyor mu"
 *   egitmen  -> "ogrenci gelir mi, nasil odenirim"
 * Tek sayfa ucune birden cevap vermeye calisinca hicbirine veremiyordu.
 *
 * Buradaki her cumle koddan dogrulandi (kredi kurallari, onay sureci,
 * iptal/iade) — vitrine tutulamayacak soz yazilmadi.
 *
 * Kaydol/Giris butonlari hero'nun ICINDE, kanitlarin hemen altinda:
 * okuma sirasi vaat -> kanit -> eylem oluyor. Once ayri bir serit olarak
 * kartlarin altindaydi, orada kaydol dugmesi kanit cumlelerinden
 * kopuyordu.
 */

type Kitle = 'ogrenci' | 'veli' | 'egitmen'

// Sekme yalnizca icerigi degil TASARIM DILINI de degistiriyor:
// renkler globals.css'teki jetonlardan geliyor, buradaki nitelik hangi
// takimin gecerli olacagini soyluyor. Ziyaretci kendini sectigi anda
// ekran ona gore giyiniyor.
const TEMA_ADI: Record<Kitle, string> = { ogrenci: 'ogrenci', veli: 'veli', egitmen: 'egitmen' }

const SEKMELER: { id: Kitle; etiket: string }[] = [
  { id: 'ogrenci', etiket: 'Öğrenciyim' },
  { id: 'veli', etiket: 'Veliyim' },
  { id: 'egitmen', etiket: 'Eğitmenim' },
]

const ICERIK: Record<Kitle, {
  rozet: string
  baslik: string
  metin: string
  kanitlar: string[]
  kartlar: { icon: FeatureIcon; baslik: string; metin: string }[]
  cta: string
  ctaHref: string
  /** Yalnizca ogrencide: hos geldin paketi. Digerleri icin gecerli degil. */
  ekCta?: { etiket: string; href: string }
}> = {
  ogrenci: {
    rozet: 'İLK DERS BİZDEN · KART İSTEMİYORUZ',
    baslik: 'Net konuşalım',
    metin: 'Motivasyon videosu satmıyoruz. Onaylı eğitmenle bire bir ders, her denemeden sonra hangi konuda ve neden kaybettiğinin dökümü, koçundan haftalık özet.',
    kanitlar: [
      'Her eğitmen tek tek onaylanır',
      'Eğitmen iptal ederse kredin geri gelir',
      'Aylık abonelik yok, kullanmadığın kredi yanmaz',
    ],
    kartlar: [
      { icon: 'ders', baslik: 'Bire Bir Dersler', metin: 'Google Meet üzerinden, eğitmenin uygun saatlerine göre. 1 kredi = 40 dakika.' },
      { icon: 'kocluk', baslik: 'Koçluk Desteği', metin: 'Sınav hazırlığında ve bölüm tercihinde yol gösteren, derslerden ayrı bir hat.' },
      { icon: 'odev', baslik: 'Ödev Takibi', metin: 'Ödevini görsel ya da video olarak teslim et, eğitmenin inceleyip onaylasın.' },
      { icon: 'kredi', baslik: 'Netlerin Bir Arada', metin: 'Denemelerini kaydet; hangi derste ne kaybettiğini ve nedenini gör.' },
    ],
    cta: 'Öğrenci Olarak Kaydol',
    ctaHref: '/register',
    ekCta: { etiket: 'Hoş Geldin Paketi', href: '/demo-ders' },
  },
  veli: {
    rozet: 'ÖĞRENCİNİZE BAĞLANIN',
    baslik: 'Paranızın nereye gittiğini görün',
    metin: 'Ders yapıldı mı, ödev teslim edildi mi, netler ne durumda — hepsi tek ekranda. Söylenene değil, kayda bakarsınız.',
    kanitlar: [
      'Ders yapılmadığında size de bildirim gelir',
      'Katılım oranı ve ödeme geçmişi görünür',
      'Öğrencinizin verdiği kodla bağlanırsınız',
    ],
    kartlar: [
      { icon: 'gorunum', baslik: 'Katılım ve Ödev', metin: 'Hangi ders yapıldı, hangi ödev bekliyor — ayrıntıya girmeden özet ekranda.' },
      { icon: 'bildirim', baslik: 'Ders Bildirimleri', metin: 'Ders planlandığında, tamamlandığında ve katılım olmadığında e-posta alırsınız.' },
      { icon: 'odeme', baslik: 'Kredi Yükleme', metin: 'Öğrencinizi seçip onun adına kredi alırsınız; krediler doğrudan ona yüklenir.' },
      { icon: 'onay', baslik: 'Öğrencinin Özel Alanı', metin: 'Günlüğü ve koçluk formu size kapalıdır. Açık olsaydı öğrenci dürüst cevap veremezdi.' },
    ],
    cta: 'Veli Olarak Kaydol',
    ctaHref: '/register',
  },
  egitmen: {
    rozet: 'ÖĞRENCİ SİZE GELSİN',
    baslik: 'Dersi siz verin, gerisini biz kuralım',
    metin: 'Takvim, rezervasyon, ödev, ödeme takibi bizde. Siz müsait saatlerinizi girin, öğrenci uygun saati kendisi seçsin.',
    kanitlar: [
      'Profiliniz onaylandıktan sonra ders vermeye başlayabilirsiniz',
      'Google Takviminiz bağlanır, ders otomatik eklenir',
      'İstediğiniz zaman istediğiniz yerde dersinizi verin',
    ],
    kartlar: [
      { icon: 'takvim', baslik: 'Müsaitlik Sizde', metin: 'Uygun saatlerinizi girersiniz; öğrenci yalnızca o saatlerden seçebilir.' },
      { icon: 'onay', baslik: 'Onaylı Eğitmen', metin: 'Her profil tek tek incelenir. Onaylandığınızda ya da düzenleme gerekirse bildirim alırsınız.' },
      { icon: 'odev', baslik: 'Ödev Verin', metin: 'Öğrencilerinize ödev verip teslimlerini inceleyip onaylayabilirsiniz.' },
      { icon: 'odeme', baslik: 'Ders ve Ödeme Takibi', metin: 'Verdiğiniz ders sayısını ve ödeme bilgilerinizi kendi sayfanızdan yönetirsiniz.' },
    ],
    cta: 'Eğitmen Olarak Kaydol',
    ctaHref: '/register',
  },
}

/** Vitrin sekmesi adi -> sekme kimligi. */
const KITLEYE_DON = { ogrenci: 'ogrenci', veli: 'veli', egitmen: 'egitmen' } as Record<string, Kitle>

export function AudienceTabs({ baslangic, kilitli = false }: { baslangic?: string; kilitli?: boolean }) {
  // Sekme durumu yalnizca istemcide. URL parametresi (?rol=egitmen)
  // bilerek YOK: searchParams okumak sayfayi dinamige cevirirdi ve vitrin
  // su an statik — donusum sayfasinda ilk boyama hizini bir derin
  // baglantiya degismeye degmez. Rol bazli paylasilabilir adres gerekirse
  // dogru cozum ayri rotalar (/egitmen gibi); arama motoru icin de daha
  // iyi olur.
  // Baslangic sekmesi SUNUCUDAN geliyor. Onceden her mount'ta ogrenci
  // ile basliyordu; ziyaretci Veliyim'i secip baska sayfaya gidip geri
  // donunce sekme ogrenciye atliyor, asagidaki etki de cerezi ogrenci
  // diye geri yaziyordu — yani secim kendi kendini siliyordu.
  const [aktif, setAktif] = useState<Kitle>(KITLEYE_DON[baslangic ?? ''] ?? 'ogrenci')

  // Sekme SAYFANIN TAMAMINI giydiriyor, yalnizca paneli degil. Onceden
  // data-tema sadece bu sarmalayicidaydi; sayfa zemini disarida kaldigi
  // icin ogrenci sekmesinde bile dama deseni akiyordu. Kok ogeye yazinca
  // zemin, akan ders adlari ve tarama cizgileri de sekmeyle degisiyor.
  useEffect(() => {
    if (!TEMA_ACIK) return

    const kok = document.documentElement

    // Oturum acikken secim KALICI DEGIL: cereze yazilmiyor ve ayrilirken
    // kullanicinin rol paleti geri veriliyor. Sekme yine de sayfanin
    // tamamini giydiriyor — amaci zaten o kitlenin deneyimini gostermek;
    // panel bir palette, sayfa cercevesi baskasinda kalirsa kotu duruyor.
    //
    // Buradaki geri yukleme guvenli: temizlik yeni etkiden ONCE calisiyor,
    // yani her turda okunan deger bir onceki sekme degil, rol temasi.
    if (kilitli) {
      const rolTemasi = kok.dataset.tema
      kok.dataset.tema = TEMA_ADI[aktif]
      return () => {
        if (rolTemasi) kok.dataset.tema = rolTemasi
        else delete kok.dataset.tema
      }
    }

    // Secim CEREZE yaziliyor. Baglantiya parametre eklemek yetmiyordu:
    // ziyaretci hos geldin paketine gidip oradan girise tiklayinca ya da
    // giristen sifremi unuttuma gecince parametre kayboluyor ve palet
    // marka rengine dusuyordu. Cerezi sunucu her sayfada okuyor.
    // Icerigi yalnizca bir gorunum tercihi; oturumla ilgisi yok.
    document.cookie = 'dersolab-kitle=' + TEMA_ADI[aktif] + ';path=/;max-age=2592000;SameSite=Lax'

    // Kok ogeye yaziliyor ki zemin, akan ders adlari ve tarama cizgileri
    // de sekmeyle birlikte degissin; sekme SAYFANIN TAMAMINI giydiriyor.
    //
    // Ayrilirken ESKI TEMA GERI YUKLENMIYOR. Yukluyordu, ve hata oradaydi:
    // ana sayfadan girise gecis istemci tarafinda oluyor, kok duzen
    // yeniden calismiyor. Temizlik kokii mount anindaki bayat degere
    // dondurunce giris ekrani ogrenci paletinde aciliyor, kart ise veli
    // paletinde kaliyordu: krem kartin uzerinde fosfor logo. Secim
    // kalici olmali; zaten cerezde de duruyor.
    kok.dataset.tema = TEMA_ADI[aktif]
  }, [aktif, kilitli])

  const v = ICERIK[aktif]

  return (
    <div className="space-y-6" data-tema={TEMA_ACIK ? TEMA_ADI[aktif] : undefined}>
      {/* Sekmeler */}
      <div role="tablist" aria-label="Kitle seçimi" className="grid grid-cols-3 gap-2">
        {SEKMELER.map((s) => {
          const secili = aktif === s.id
          return (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={secili}
              onClick={() => setAktif(s.id)}
              className={`rounded-xl border-4 border-[var(--cizgi)] px-3 py-3 text-sm font-bold transition-all sm:text-base ${
                secili
                  ? 'bg-[var(--vurgu)] text-[var(--yazi-ters)] shadow-[0_4px_0_var(--golge)]'
                  : 'bg-[var(--yuzey)] text-[var(--yazi)] hover:bg-[var(--yuzey-ic)]'
              }`}
            >
              {s.etiket}
            </button>
          )
        })}
      </div>

      {/* Kitleye özel ekran */}
      <div role="tabpanel" className="space-y-6">
        <div className="relative overflow-hidden rounded-2xl border-4 border-[var(--cizgi)] bg-[var(--ikincil-zemin)] p-7 shadow-[0_8px_0_var(--golge)] sm:p-10">
          <KitleDekoru koyuZemin />
          <div className="relative inline-block rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey)] px-2.5 py-1 text-[11px] font-bold tracking-wide text-[var(--yazi)]">
            {v.rozet}
          </div>

          <h2 className="relative mt-4 font-sans text-3xl font-black leading-tight text-[var(--yazi-ters)] sm:text-4xl">
            {v.baslik}
          </h2>
          <p className="relative mt-3 max-w-2xl text-base font-semibold leading-relaxed text-[var(--yazi-ters)]/90 sm:text-lg">
            {v.metin}
          </p>

          {/* Ayrac cizgisi METIN SUTUNU kadar; hero'nun tamami kadar degil.
              Tam genislikteyken egitmen sekmesindeki takvim izgarasinin
              (sagda, dikey ortada duruyor) tam ortasindan geciyordu.
              Izgarayi ustte birakmak cozmezdi: hucreler yari saydam, cizgi
              aradaki bosluklardan gorunmeye devam ederdi. Cizgiyi yukaridaki
              paragrafla ayni max-w-2xl'e cekince izgaraya yatay olarak hic
              ulasmiyor — hero'nun boyu degisse de gecerli, cunku cakisma
              artik dikey konuma bagli degil. */}
          <ul className="relative mt-5 max-w-2xl space-y-2 border-t-2 border-[var(--yazi-ters)]/25 pt-4">
            {v.kanitlar.map((k) => (
              <li key={k} className="flex items-start gap-2.5 text-sm font-semibold text-[var(--yazi-ters)] sm:text-base">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[var(--cizgi)] bg-[var(--yuzey)]">
                  <Check className="h-3 w-3 text-[var(--yazi)]" strokeWidth={3.5} aria-hidden />
                </span>
                {k}
              </li>
            ))}
          </ul>

          {/* Kaydol + Giriş, hero'nun İÇİNDE ve yan yana.
              Önce ayrı bir şerit olarak kartların altındaydı; kaydol
              düğmesi kanıt cümlelerinden kopuyordu. Burada okuma sırası
              doğru: vaat → kanıt → eylem.
              İkisi de aynı yükseklikte (ikincinin ince kenarlığı dolgudan
              düşülüyor); fark yalnızca vurguda. */}
          <div className="relative mt-6 grid auto-rows-fr grid-cols-1 gap-3 sm:flex sm:flex-row sm:flex-wrap sm:items-stretch">
            <Link href={`${v.ctaHref}?kitle=${aktif}`} className={`${PIXEL_BUTTON_PRIMARY} min-h-14 flex-1 gap-2.5 px-7 py-3.5 sm:flex-none`}>
              <Play className="h-4 w-4 shrink-0" fill="currentColor" strokeWidth={0} aria-hidden />
              {v.cta}
            </Link>
            <Link href={`/login?kitle=${aktif}`} className={`${PIXEL_BUTTON_SECONDARY} min-h-14 flex-1 px-7 py-3.5 sm:flex-none`}>
              Giriş Yap
            </Link>
            {/* Hos geldin paketi yalnizca ogrencide: paket zaten sadece
                ogrenci hesaplarina aciik. Hesap acmadan da alinabildigi
                icin en dusuk esikli eylem, o yuzden CTA satirinda. */}
            {v.ekCta && (
              <Link href={`${v.ekCta.href}?kitle=${aktif}`} className={`${PIXEL_BUTTON_SECONDARY} min-h-14 flex-1 gap-2.5 px-7 py-3.5 sm:flex-none`}>
                <Gift className="h-4 w-4 shrink-0" aria-hidden />
                {v.ekCta.etiket}
              </Link>
            )}
          </div>
        </div>

        <KartSlayti kartlar={v.kartlar} etiket={`${SEKMELER.find((s) => s.id === aktif)?.etiket} için neler var`} />
      </div>
    </div>
  )
}
