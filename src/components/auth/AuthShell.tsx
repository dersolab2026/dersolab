import Link from 'next/link'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'

interface AuthShellProps {
  subtitle?: string
  cardMaxWidth?: string
  mascotMaxWidth?: string
  mascotWidthClass?: string
  children: React.ReactNode
}

export function AuthShell({
  subtitle,
  cardMaxWidth = '460px',
  mascotMaxWidth = '260px',
  mascotWidthClass = 'w-4/5',
  children,
}: AuthShellProps) {
  // TEMAYI BURADA KOYMUYORUZ.
  //
  // Onceden ?kitle= parametresi okunup bu sarmalayiciya data-tema
  // yaziliyordu. Kok duzen ise cerezden okuyor. Ikisi ayrisinca —
  // ornegin cerez ogrenci, baglanti veli — kart veli paletinde,
  // sayfanin kendisi ogrenci paletinde kaliyordu: krem kartin uzerinde
  // fosfor logo ve terminal tarama cizgileri.
  //
  // Tek kaynak: kok duzen. Ziyaretci ana sayfada kitlesini sectigi anda
  // cerez yaziliyor, sunucu her sayfada onu okuyor. Parametre yalnizca
  // kayit formunda rolu onden secmek icin duruyor.
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[var(--zemin)] relative overflow-hidden">

      {/* Retro Çizgili Arka Plan Efekti */}
      <SayfaDeseni />

      <div
        className="relative z-10 w-full bg-[var(--yuzey)] rounded-2xl p-8 sm:p-10 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] text-center"
        style={{ maxWidth: cardMaxWidth }}
      >

        <Link href="/" className="block mx-auto mb-6 w-full max-w-[280px]">
          <span role="img" aria-label="DersoLab" className="logo-marka w-full" />
        </Link>

        <div className="flex justify-center mb-6">
          {/* Maskot da logo gibi jetondan geliyor, böylece kayıt
              ekranında rol seçilince tema ile birlikte değişiyor.
              imageRendering:pixelated kaldırıldı — 1293px'lik kaynak
              260px'e en yakın komşu ile küçülünce ince çizgiler
              kayboluyordu; artık gösterim ölçüsünde hazır sürüm var. */}
          <span
            role="img"
            aria-label="DersoLab maskotu"
            className={`maskot-marka ${mascotWidthClass}`}
            style={{ maxWidth: mascotMaxWidth }}
          />
        </div>

        {subtitle && (
          <p className="font-sans font-semibold text-[var(--yazi)] mb-6">{subtitle}</p>
        )}

        <div className="font-sans font-semibold text-[var(--yazi)] text-left">
          {children}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-sans text-[var(--yazi)]/60">
          <a href="/hakkimizda" className="hover:underline">Hakkımızda</a>
          <a href="/privacy" className="hover:underline">Gizlilik Politikası</a>
          <a href="/terms" className="hover:underline">Kullanım Şartları</a>
        </div>
      </div>
    </div>
  )
}
