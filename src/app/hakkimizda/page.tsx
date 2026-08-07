export const metadata = {
  title: 'Hakkımızda - DersoLab',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#F4F1E8]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-[#1B2430]">
        <h1 className="text-3xl font-bold mb-2">Hakkımızda</h1>
        <p className="text-[#1B2430]/70 mb-8">Sınav öğrencileri için online özel ders ve rehberlik platformu</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            DersoLab, LGS, YKS, KPSS, DGS ve ALES gibi sınavlara hazırlanan öğrencileri, alanında
            deneyimli eğitmenlerle bir araya getiren online bir özel ders ve rehberlik platformudur.
            Amacımız, kaliteli birebir eğitime coğrafi sınır olmadan, esnek ve şeffaf bir şekilde
            erişebilmeni sağlamak.
          </p>

          <h2>Ne Sunuyoruz</h2>
          <ul>
            <li><strong>Birebir online dersler:</strong> Google Meet üzerinden, eğitmenin müsaitliğine göre esnek şekilde planlanan dersler</li>
            <li><strong>Rehberlik desteği:</strong> Sınav ve bölüm/kariyer tercihlerinde yol gösteren ayrı bir rehberlik hattı</li>
            <li><strong>Ödev takibi:</strong> Eğitmenlerin verdiği ödevleri görüntüleme, teslim etme ve geri bildirim alma</li>
            <li><strong>Ders notları:</strong> Eğitmenlerin ders sonrası paylaştığı materyallere kalıcı erişim</li>
            <li><strong>Esnek kredi paketleri:</strong> İhtiyacına göre ders kredisi satın alma, kullanmadığın kredin sende kalır</li>
          </ul>

          <h2>Kimler İçin</h2>
          <p>
            Ortaokul ve lise öğrencileri, LGS/YKS&apos;ye hazırlanan gençler, KPSS/DGS/ALES gibi sınavlara
            çalışan yetişkinler ve çocuklarının eğitim sürecini takip etmek isteyen veliler için
            tasarlandı.
          </p>

          <h2>Eğitmenlerimiz</h2>
          <p>
            Platformumuzdaki her eğitmen, öğrencilerle eşleşmeden önce bir onay sürecinden geçer.
            Böylece hem alan bilgisi hem de öğretme deneyimi açısından güvenilir bir kadroyla
            çalıştığından emin olabilirsin.
          </p>

          <h2>Bize Ulaşın</h2>
          <p>
            Sorularınız, önerileriniz ya da iş birliği talepleriniz için{' '}
            <a href="mailto:destek@dersolab.com" className="underline text-[#DD7B3A] font-semibold">destek@dersolab.com</a> adresinden
            bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
