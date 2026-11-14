import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Hakkımızda ve Eğitim Felsefemiz',
  description:
    'DersoLab neden kuruldu? LGS ve YKS hazırlığında zorunlu abonelik dayatmayan, yanmayan kredi ve onaylı eğitmenlerle şeffaf bire bir online özel ders ve koçluk platformu.',
  alternates: {
    canonical: '/hakkimizda',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-slate-200">
        <h1 className="text-3xl font-bold mb-2">Hakkımızda</h1>
        <p className="text-slate-400 mb-8">
          LGS ve YKS hazırlığında şeffaf, esnek ve bire bir online özel ders &amp; koçluk platformu
        </p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <h2>Neden DersoLab&apos;ı Kurduk?</h2>
          <p>
            Türkiye&apos;de sınava hazırlanan binlerce öğrenci ve veli yıllardır aynı ikilemle karşılaşıyor:
            Ya kalabalık dershane sınıflarında öğrencinin soramadığı sorular birikiyor ya da online eğitim
            adına satılan uzun süreli, pahalı ve ay sonunda kullanılmadığında yanan abonelik paketleri
            aile bütçesini zorluyor.
          </p>
          <p>
            DersoLab, öğretmenlik ve eğitim danışmanlığı sahasında bizzat gözlemlenen bu sorunu çözmek için
            kuruldu. Felsefemiz net: <strong>Öğrenci yalnızca ihtiyaç duyduğu dersten, gerçekten frekansının
            tuttuğu uzman eğitmenden, zorunlu abonelik baskısı olmadan bire bir destek alabilmeli; veli ise
            ödediği her dersin karşılığını ve çocuğunun net gelişimini şeffafça görebilmelidir.</strong>
          </p>

          <h2>Neyi Farklı Yapıyoruz?</h2>
          <ul>
            <li>
              <strong>Ücretsiz Tanışma Dersi:</strong> Hiçbir kart bilgisi girmeden önce eğitmenle tanışır,
              seviye tespiti ve çalışma planınızı birlikte yaparsınız.
            </li>
            <li>
              <strong>Yanmayan Kredi Sistemi (Zorunlu Abonelik Yok):</strong> Aylık otomatik çekilen paketler
              yerine ders kredisi alırsınız. Kredileriniz ay sonunda silinmez, dönem boyunca geçerlidir ve
              dilediğiniz branşta kullanılabilir.
            </li>
            <li>
              <strong>Bire Bir Canlı Dersler:</strong> Google Meet entegrasyonu üzerinden, eğitmenin müsaitlik
              takvimine göre tek tıkla planlanan 40 dakikalık odaklı bire bir dersler.
            </li>
            <li>
              <strong>Veli Şeffaflığı ve Öğrenci Mahremiyeti Dengesi:</strong> Veliler tek kullanımlık bağlantı
              koduyla çocuklarının ders katılımını, ödev durumunu ve deneme netlerini anlık takip ederken;
              öğrencinin koçluk günlüğü ve motivasyon notları öğrenciye özel kalır.
            </li>
            <li>
              <strong>Hedef Simülatörü ve L.A.B. Araçları:</strong> Öğrenciler hayallerindeki lise veya
              üniversite için gereken netleri anlık hesaplar, yapay zekâ destekli soru analizleriyle ders
              dışında da yalnız kalmaz.
            </li>
          </ul>

          <h2>Eğitmen Seçim ve Onay Sürecimiz</h2>
          <p>
            DersoLab bir &quot;herkesin ilan açtığı açık pazaryeri&quot; değildir. Platformumuzda yer alan her
            eğitmen; akademik geçmişi, branş hakimiyeti, sınav müfredatı tecrübesi ve iletişim becerileri
            değerlendirilerek onay sürecinden geçer. Ayrıca <strong>%100 Eğitmen Değişim Garantisi</strong>{' '}
            sayesinde öğrenci kredilerini dilediği zaman farklı bir eğitmen veya branşla kullanabilir.
          </p>

          <h2>Kimler İçin Tasarlandı?</h2>
          <ul>
            <li><strong>Ortaokul ve LGS Öğrencileri:</strong> Yeni nesil beceri temelli sorulara ve sözel/sayısal mantığa alışmak isteyen 5, 6, 7 ve 8. sınıf öğrencileri.</li>
            <li><strong>Lise ve YKS (TYT-AYT) Öğrencileri:</strong> Konu eksiklerini kapatıp netlerini hedeflediği üniversite sıralamasına taşımak isteyen 9, 10, 11, 12. sınıf ve mezun öğrenciler.</li>
            <li><strong>Veliler:</strong> Özel ders sürecindeki belirsizlikleri ortadan kaldırıp çocuğunun gelişimini somut verilerle izlemek isteyen aileler.</li>
          </ul>

          <div className="pt-4 flex flex-wrap gap-3">
            <Link
              href="/instructors"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-sm font-semibold transition-colors"
            >
              Eğitmenlerimizi İnceleyin →
            </Link>
            <Link
              href="/demo-ders"
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold transition-colors"
            >
              Ücretsiz Tanışma Dersi Alın →
            </Link>
            <Link
              href="/hesaplama"
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold transition-colors"
            >
              LGS &amp; YKS Net Simülatörü →
            </Link>
          </div>

          <h2>Bize Ulaşın</h2>
          <p>
            Sorularınız, kurumsal bilgiler, önerileriniz ya da eğitmenlik başvurularınız için{' '}
            <a href="mailto:destek@dersolab.com" className="underline text-amber-400 font-semibold">destek@dersolab.com</a>{' '}
            adresinden veya <Link href="/contact" className="underline text-amber-400 font-semibold">İletişim</Link> sayfamızdan
            bize her zaman ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
