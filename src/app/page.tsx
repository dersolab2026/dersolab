import Link from 'next/link'
import { AudienceTabs } from '@/components/home/AudienceTabs'
import { SocialLinks } from '@/components/home/SocialLinks'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'
import { oturumRolTemasi, secilenTema } from '@/lib/tema-sunucu'
import { TEMA_ACIK } from '@/lib/tema'

/**
 * Vitrin.
 *
 * Eskiden herkese ayni sayfayi gosteriyordu; oysa uc kitlenin sorulari
 * farkli, hatta zit. Artik ziyaretci ilk ekranda kendini seciyor ve
 * yalnizca kendisine hitap eden icerigi goruyor.
 *
 * Kaydol/Giris butonlari sekmeden bagimsiz, hep ayni yerde.
 */
export default async function HomePage() {
  // Sekme durumu sunucuda belirleniyor: böylece ziyaretçi Veliyim'i seçip
  // başka sayfaya gidip geri döndüğünde sekme öğrenciye atlamıyor ve ilk
  // boyamada sayfa çerçevesi ile sekme paneli aynı palette açılıyor.
  //
  // Oturum açıkken sekme temayı kilitliyor: kullanıcının paleti rolünden
  // geliyor, vitrin sekmesi onu değiştirmemeli.
  // TEMA_ACIK kapaliyken cerez HIC okunmuyor. Onemi su: cookies() cagirmak
  // sayfayi dinamik render'a dusuruyor ve vitrin en cok trafik alan sayfa.
  // Kapaliyken statik uretiliyor.
  const rolTemasi = TEMA_ACIK ? await oturumRolTemasi() : undefined
  const baslangic = TEMA_ACIK ? (rolTemasi ?? (await secilenTema())) : undefined

  return (
    <div className="min-h-screen w-full bg-[var(--zemin)] relative overflow-hidden">
      {/* Akan ders adlari YALNIZCA burada. Ogrenci sekmesi secilince
          gorunuyor (CSS zaten diger temalarda kapatiyor), panelde ve
          pazar yerinde artik akmiyor. */}
      <SayfaDeseni kelimeAkisi />

      <div className="relative z-10 mx-auto max-w-5xl space-y-7 p-4 sm:p-6 py-8 sm:py-12">

        {/* Logo: sekmelerin üstünde sabit kimlik şeridi */}
        <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-7 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] flex items-center justify-center gap-4">
          <span role="img" aria-label="DersoLab" className="logo-marka w-full max-w-[300px]" />
          {/* Maskot logonun yaninda — vitrindeki marki seridiyle ayni duzen. */}
          <img src="/fox-head.png" alt="" className="h-12 w-auto shrink-0 translate-y-[10px]" />
        </div>

        {/* Sayfanın tek h1'i; görsel tasarımı bozmadan arama motorları ve
            ekran okuyucular için başlığı taşıyor. */}
        <h1 className="sr-only">
          DersoLab — Öğrenciler İçin Online Özel Ders ve Koçluk Platformu
        </h1>

        <AudienceTabs baslangic={baslangic} kilitli={Boolean(rolTemasi)} />

        <SocialLinks />

        <div className="flex flex-wrap justify-center gap-5 text-sm font-sans font-semibold text-[var(--yazi)]/60 pb-4">
          <Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link>
          <Link href="/privacy" className="hover:underline">Gizlilik Politikası</Link>
          <Link href="/terms" className="hover:underline">Kullanım Şartları</Link>
        </div>
      </div>
    </div>
  )
}
