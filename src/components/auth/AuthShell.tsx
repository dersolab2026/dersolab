import Link from 'next/link'

interface AuthShellProps {
  /** Sayfanın tek h1'i. Arama motoru ve ekran okuyucu bunu okuyor. */
  baslik?: string
  subtitle?: string
  cardMaxWidth?: string
  mascotMaxWidth?: string
  mascotWidthClass?: string
  children: React.ReactNode
}

export function AuthShell({
  baslik,
  subtitle,
  cardMaxWidth = '460px',
  mascotMaxWidth = '260px',
  mascotWidthClass = 'w-4/5',
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-5 bg-[#D5EAE3] relative overflow-hidden">

      {/* Retro Çizgili Arka Plan Efekti */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div
        className="relative z-10 w-full bg-[#F4F1E8] rounded-2xl p-8 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center"
        style={{ maxWidth: cardMaxWidth }}
      >

        <Link href="/" className="block mx-auto mb-6 w-full max-w-[280px]">
          <img src="/dersolab-logo-560.png" alt="DersoLab" className="h-auto w-full" />
        </Link>

        {/* Maskot SUS. alt="" ve aria-hidden bilerek: ustundeki logo zaten
            "DersoLab" diyor, maskot bilgi tasimiyor.
            Onceden alt="DersoLab Fox Mascot" yaziyordu ve sonucu Google'da
            goruldu: bu sayfalarin h1'i olmadigi icin arama motoru baslik
            arayip en belirgin metni almis, "DersoLab Fox Mascot" adiyla
            bir site baglantisi olusturmustu. Aciklamayi da giris formundan
            cekmisti ("Google ile Giris. VEYA. E-posta. Sifre"). */}
        <div className="flex justify-center mb-6">
          <img
            src="/fox-mascot-520.png"
            alt=""
            aria-hidden
            className={`${mascotWidthClass} h-auto`}
            style={{ imageRendering: 'pixelated', maxWidth: mascotMaxWidth }}
          />
        </div>

        {/* Sayfanin tek h1'i. Hem ekran okuyucu hem arama motoru buradan
            okuyor; yoksa baslik yerine rastgele bir metin secilyor. */}
        {baslik && (
          <h1 className="font-sans text-xl font-black text-[#1B2430] mb-2">{baslik}</h1>
        )}

        {subtitle && (
          <p className="font-sans font-semibold text-[#1B2430] mb-6">{subtitle}</p>
        )}

        <div className="font-sans font-semibold text-[#1B2430] text-left">
          {children}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-sans text-[#1B2430]/70">
          <a href="/hakkimizda" className="hover:underline">Hakkımızda</a>
          <a href="/privacy" className="hover:underline">Gizlilik Politikası</a>
          <a href="/terms" className="hover:underline">Kullanım Şartları</a>
        </div>
      </div>
    </div>
  )
}
