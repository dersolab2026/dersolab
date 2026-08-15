import Link from 'next/link'

const FEATURES = [
  {
    title: 'Birebir Online Dersler',
    body: 'Google Meet üzerinden, eğitmenin müsaitliğine göre esnek şekilde planlanan dersler. Ders anında takvimine ve mailine düşer.',
  },
  {
    title: 'Koçluk Desteği',
    body: 'Sınav ve bölüm/kariyer tercihlerinde yol gösteren, derslerden ayrı bir koçluk hattı.',
  },
  {
    title: 'Ödev ve Ders Notu Takibi',
    body: 'Eğitmenlerin verdiği ödevleri teslim et, geri bildirim al; ders sonrası paylaşılan notlara kalıcı erişim.',
  },
  {
    title: 'Esnek Kredi Paketleri',
    body: 'İhtiyacına göre ders kredisi satın al, kullanmadığın kredi sende kalır.',
  },
]

const STEPS = [
  { step: '1', title: 'Kaydol', body: 'Birkaç saniyede ücretsiz hesap oluştur.' },
  { step: '2', title: 'Eğitmen Bul ya da Tanışma Dersi Al', body: 'Branşına uygun eğitmeni incele, istersen önce ücretsiz bir tanışma dersiyle başla.' },
  { step: '3', title: 'Dersini Planla', body: 'Uygun saati seç, ders otomatik takvimine ve Google Meet linkin mailine düşsün.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6 p-5 py-10">

        {/* Hero */}
        <div className="bg-[#F4F1E8] rounded-2xl p-8 sm:p-12 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">
          <img src="/dersolab-logo.png" alt="DersoLab" className="mx-auto mb-6 h-auto w-full max-w-[320px]" />
          <div className="flex justify-center mb-6">
            <img
              src="/fox-mascot.png"
              alt="DersoLab Fox Mascot"
              className="w-3/5 max-w-[240px] h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <p className="font-sans text-lg font-bold text-[#1B2430] mb-1">
            Öğrenciler için online özel ders ve rehberlik platformu
          </p>
          <p className="font-sans font-semibold text-[#1B2430]/70 mb-8 max-w-xl mx-auto">
            Okul derslerinden LGS, YKS, KPSS, DGS ve ALES hazırlığına kadar — alanında deneyimli, onaylı
            eğitmenlerle birebir online ders al.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Link
              href="/demo-ders"
              className="flex-1 py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
            >
              Ücretsiz Tanışma Dersi
            </Link>
            <Link
              href="/register"
              className="flex-1 py-4 bg-white text-[#1B2430] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
            >
              Kaydol
            </Link>
          </div>
          <Link href="/login" className="inline-block mt-4 text-sm font-bold text-[#1B2430] underline">
            Zaten hesabın var mı? Giriş Yap
          </Link>
        </div>

        {/* Features */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-5 text-center">Ne Sunuyoruz</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border-4 border-[#1B2430] bg-white p-4">
                <p className="font-bold text-[#1B2430] mb-1">{f.title}</p>
                <p className="text-sm font-semibold text-[#1B2430]/70">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h2 className="font-sans text-xl sm:text-2xl font-black text-[#1B2430] mb-5 text-center">Nasıl Çalışır</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-xl border-4 border-[#1B2430] bg-white p-4 text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#DD7B3A] text-[#F4F1E8] font-black border-4 border-[#1B2430]">
                  {s.step}
                </div>
                <p className="font-bold text-[#1B2430] mb-1">{s.title}</p>
                <p className="text-sm font-semibold text-[#1B2430]/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referans programı */}
        <div className="bg-[#DD7B3A] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <img
              src="/fox-mascot-icon.png"
              alt=""
              className="w-24 shrink-0 h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block mb-2 px-3 py-1 rounded-lg border-2 border-[#1B2430] bg-[#F4F1E8] text-xs font-black text-[#1B2430]">
                DAVET ET & KAZAN
              </span>
              <h2 className="font-sans text-xl sm:text-2xl font-black text-[#F4F1E8] mb-2">
                Arkadaşını getirene 1 ders bizden!
              </h2>
              <p className="font-semibold text-[#F4F1E8]/90 mb-4">
                Ayarlar sayfandaki davet kodunu arkadaşınla paylaş. O kayıt olurken kodu girsin,
                hesabını onayladığı anda ikinize de birer ders kredisi hediye edelim.
              </p>
              <Link
                href="/register"
                className="inline-block py-3 px-8 bg-[#F4F1E8] text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
              >
                Hemen Kaydol
              </Link>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">
          <p className="font-sans text-lg font-bold text-[#1B2430] mb-4">
            Hemen ücretsiz bir tanışma dersiyle başla, doğru eğitmeni bul.
          </p>
          <Link
            href="/demo-ders"
            className="inline-block py-3 px-8 bg-[#DD7B3A] text-[#F4F1E8] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Ücretsiz Tanışma Dersi Talep Et
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4 text-xs font-sans font-semibold text-[#1B2430]/60 pb-4">
          <Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link>
          <Link href="/privacy" className="hover:underline">Gizlilik Politikası</Link>
          <Link href="/terms" className="hover:underline">Kullanım Şartları</Link>
        </div>
      </div>
    </div>
  )
}
