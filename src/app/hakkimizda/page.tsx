export const metadata = {
  title: 'Hakkımızda - DersoLab',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-slate-200">
        <h1 className="text-3xl font-bold mb-2">Hakkımızda</h1>
        <p className="text-slate-400 mb-8">Öğrenciler için online özel ders ve koçluk platformu</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            DersoLab, okul derslerinde desteğe ihtiyacı olan öğrencilerden LGS ve YKS
            sınavlarına hazırlananlara kadar geniş bir kitleyi alanında deneyimli eğitmenlerle bir
            araya getiren online bir özel ders ve koçluk platformudur. Amacımız, kaliteli birebir
            eğitime coğrafi sınır olmadan esnek ve şeffaf bir şekilde erişebilmeni sağlamak.
          </p>

          <h2>Ne Sunuyoruz?</h2>
          <ul>
            <li><strong>Birebir Online Dersler:</strong> Google Meet üzerinden eğitmenin ajandasına göre esnek şekilde planlanan dersler.</li>
            <li><strong>Koçluk Desteği:</strong> Sınav ve bölüm/kariyer tercihlerinde yol gösteren ayrı bir koçluk hattı.</li>
            <li><strong>Ödev Takibi:</strong> Eğitmenlerin verdiği ödevleri görüntüleme, teslim etme ve eğitmenden geri alma.</li>
            <li><strong>Ders Notları:</strong> Eğitmenlerin ders sonrası paylaştığı materyallere kalıcı erişim.</li>
            <li><strong>Esnek Kredi Paketleri:</strong> İhtiyacına göre ders kredisi satın alma.</li>
          </ul>

          <h2>Kimler İçin?</h2>
          <p>
            Ortaokul ve lise öğrencileri, LGS ve YKS&apos;ye hazırlanan öğrenciler ile
            çocuklarının eğitim sürecini takip etmek isteyen veliler için
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
            <a href="mailto:destek@dersolab.com" className="underline text-[#9C4A0C] font-semibold">destek@dersolab.com</a> adresinden
            bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
