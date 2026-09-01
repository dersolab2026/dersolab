import Link from 'next/link'
import { HeroSlider } from '@/components/home/HeroSlider'
import { FeatureCard, type FeatureIcon } from '@/components/home/FeatureCard'
import { SocialLinks } from '@/components/home/SocialLinks'
import { AIEducationShowcase } from '@/components/home/AIEducationShowcase'

const FEATURES = [
  {
    icon: 'ders' as FeatureIcon,
    title: 'Bire Bir Online Dersler',
    body: 'Google Meet üzerinden eğitmenin uygun saatlerine göre planlanan dersler. Ders bilgisi anında takviminize ve e-posta adresinize düşer.',
  },
  {
    icon: 'kocluk' as FeatureIcon,
    title: 'Koçluk Desteği',
    body: 'Sınav hazırlığında ve bölüm tercihinde yol gösteren, derslerden ayrı bir koçluk hattı.',
  },
  {
    icon: 'odev' as FeatureIcon,
    title: 'Ödev ve Ders Notu Takibi',
    body: 'Eğitmeninizin verdiği ödevleri teslim edin, geri bildirim alın. Ders sonrası paylaşılan notlara istediğiniz zaman ulaşın.',
  },
  {
    icon: 'kredi' as FeatureIcon,
    title: 'Esnek Kredi Paketleri',
    body: 'İhtiyacınız kadar ders kredisi alın. Kullanmadığınız kredi yanmaz, hesabınızda kalır.',
  },
]

const STEPS = [
  { step: '1', title: 'Kaydolun', body: 'Birkaç saniyede ücretsiz hesabınızı oluşturun.' },
  { step: '2', title: 'Eğitmen Bulun ya da Hoş Geldin Paketini Alın', body: 'Branşınıza uygun eğitmeni inceleyin, isterseniz önce ücretsiz hoş geldin paketinizle başlayın.' },
  { step: '3', title: 'Dersinizi Planlayın', body: 'Uygun saati seçin; ders takviminize, Google Meet bağlantısı e-posta adresinize gelsin.' },
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

      <div className="relative z-10 mx-auto max-w-5xl space-y-7 p-4 sm:p-6 py-8 sm:py-12">

        {/* Logo: slaytın üstünde sabit kimlik şeridi */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-7 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] flex items-center justify-center">
          <img src="/dersolab-logo.png" alt="DersoLab" className="h-auto w-full max-w-[360px]" />
        </div>

        {/* Sayfanın tek h1'i; görsel tasarımı bozmadan arama motorları ve
            ekran okuyucular için başlığı taşıyor. */}
        <h1 className="sr-only">
          DersoLab — Öğrenciler İçin Online Özel Ders ve Koçluk Platformu
        </h1>

        {/* Fırsatlar: aşağı inmeden görünsün diye slayt gösterisi */}
        <HeroSlider />

        <p className="text-center text-base font-bold text-[#1B2430]">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="underline">Giriş Yapın</Link>
        </p>

        {/* ── GOOGLE EĞİTİM SEFERBERLİĞİ: AI SORU ASİSTANI VİTRİNİ ── */}
        <AIEducationShowcase />

        {/* Features */}
        <div className="bg-[#F4F1E8] rounded-2xl p-7 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] mb-7 text-center">Ne Sunuyoruz?</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <FeatureCard key={f.title} icon={f.icon} title={f.title} body={f.body} />
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#F4F1E8] rounded-2xl p-7 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] mb-7 text-center">Nasıl Çalışır?</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="rounded-xl border-4 border-[#1B2430] bg-white p-5 sm:p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#DD7B3A] text-[#F4F1E8] text-lg font-black border-4 border-[#1B2430]">
                  {s.step}
                </div>
                <p className="font-bold text-lg text-[#1B2430] mb-1.5">{s.title}</p>
                <p className="text-base font-semibold text-[#1B2430]/70">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#F4F1E8] rounded-2xl p-7 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-center">
          <p className="font-sans text-xl sm:text-2xl font-bold text-[#1B2430] mb-6">
            Ücretsiz hesabınızı açın, branşınıza uygun eğitmenleri incelemeye başlayın.
          </p>
          <Link
            href="/register"
            className="inline-block py-3.5 px-9 text-lg bg-[#DD7B3A] text-[#F4F1E8] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
          >
            Ücretsiz Kaydolun
          </Link>
        </div>

        <SocialLinks />

        <div className="flex flex-wrap justify-center gap-5 text-sm font-sans font-semibold text-[#1B2430]/60 pb-4">
          <Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link>
          <Link href="/privacy" className="hover:underline">Gizlilik Politikası</Link>
          <Link href="/terms" className="hover:underline">Kullanım Şartları</Link>
        </div>
      </div>
    </div>
  )
}
