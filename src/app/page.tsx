import Link from 'next/link'
import { HeroSlider } from '@/components/home/HeroSlider'

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
  { step: '2', title: 'Eğitmen Bul ya da Hoş Geldin Paketini Al', body: 'Branşına uygun eğitmeni incele, istersen önce ücretsiz hoş geldin paketinle başla.' },
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

        {/* Logo + maskot: slaytın üstünde sabit kimlik şeridi */}
        <div className="bg-[#F4F1E8] rounded-2xl p-5 sm:p-6 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] flex items-center justify-center gap-4">
          <img
            src="/fox-head-open.png"
            alt=""
            className="h-14 w-14 sm:h-16 sm:w-16 shrink-0"
            style={{ imageRendering: 'pixelated' }}
          />
          <img src="/dersolab-logo.png" alt="DersoLab" className="h-auto w-full max-w-[260px]" />
        </div>

        {/* Sayfanın tek h1'i; görsel tasarımı bozmadan arama motorları ve
            ekran okuyucular için başlığı taşıyor. */}
        <h1 className="sr-only">
          DersoLab — öğrenciler için online özel ders ve koçluk platformu
        </h1>

        {/* Fırsatlar: aşağı inmeden görünsün diye slayt gösterisi */}
        <HeroSlider />

        <p className="text-center text-sm font-bold text-[#1B2430]">
          Zaten hesabın var mı?{' '}
          <Link href="/login" className="underline">Giriş Yap</Link>
        </p>

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

        {/* Final CTA */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">
          <p className="font-sans text-lg font-bold text-[#1B2430] mb-4">
            Ücretsiz hesabını aç, branşına uygun eğitmenleri incelemeye başla.
          </p>
          <Link
            href="/register"
            className="inline-block py-3 px-8 bg-[#DD7B3A] text-[#F4F1E8] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Ücretsiz Kaydol
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
