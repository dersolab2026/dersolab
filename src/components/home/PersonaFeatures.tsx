'use client'

import { FeatureCard, type FeatureIcon } from './FeatureCard'
import type { PersonaType } from './PersonaSwitcher'

interface FeatureItem {
  icon: FeatureIcon
  title: string
  body: string
  badge?: string
}

const FEATURES_BY_PERSONA: Record<
  PersonaType,
  {
    heading: string
    subtitle: string
    items: FeatureItem[]
  }
> = {
  student: {
    heading: 'Öğrenciler İçin Neler Sunuyoruz?',
    subtitle: 'Sınavlara ve okul derslerine en verimli şekilde hazırlanman için tüm araçlar tek yerde.',
    items: [
      {
        icon: 'ders',
        title: 'Bire Bir Canlı Dersler',
        body: 'Google Meet üzerinden eğitmenin uygun saatlerine göre planlanan dersler. Ders bilgisi anında takvimine ve e-postana düşer.',
        badge: 'Canlı 1:1',
      },
      {
        icon: 'kocluk',
        title: 'Bireysel Koçluk Desteği',
        body: 'Sınav hazırlığında, deneme analizinde ve bölüm tercihinde yol gösteren, derslerden bağımsız rehberlik desteği.',
        badge: 'Rehberlik',
      },
      {
        icon: 'odev',
        title: 'Ödev ve Ders Notu Takibi',
        body: 'Eğitmeninin verdiği ödevleri teslim et, geri bildirim al. Ders sonrası paylaşılan ders notlarına istediğin an ulaş.',
        badge: 'Gelişim',
      },
      {
        icon: 'kredi',
        title: 'Esnek Kredi Paketleri',
        body: 'İhtiyacın kadar ders kredisi al. Kullanmadığın krediler asla yanmaz, hesabında dilediğin zaman kullanmak üzere kalır.',
        badge: 'Yanmayan Kredi',
      },
    ],
  },
  parent: {
    heading: 'Veliler İçin Güvenli ve Şeffaf Eğitim',
    subtitle: 'Çocuğunuzun eğitim sürecini soru işaretleri olmadan, tek bir panelden güvenle yönetin.',
    items: [
      {
        icon: 'guvenlik',
        title: 'Doğrulanmış Öğretmen Kadrosu',
        body: 'Platformdaki tüm eğitmenlerin belgeleri, mezuniyetleri ve deneyimleri ekibimizce titizlikle incelenip onaylanır.',
        badge: '%100 Onaylı',
      },
      {
        icon: 'rapor',
        title: 'Veli Takip ve Raporlama',
        body: 'Çocuğunuzun kaç ders aldığını, hangi ödevleri yaptığını ve deneme sınavı netlerini veli panelinden anlık izleyin.',
        badge: 'Veli Paneli',
      },
      {
        icon: 'kredi',
        title: 'Garantili & Yanmayan Kredi',
        body: 'Satın aldığınız ders paketleri süre kısıtlaması olmaksızın çocuğunuzun hesabında tanımlı kalır. Bütçenizi kontrol edin.',
        badge: 'Güvenli Ödeme',
      },
      {
        icon: 'topluluk',
        title: 'Eğitmen Değerlendirme Notları',
        body: 'Her ders sonrası eğitmenin öğrenci hakkında yazdığı derse katılım ve gelişim notlarını doğrudan okuyun.',
        badge: 'Geri Bildirim',
      },
    ],
  },
  instructor: {
    heading: 'Eğitmenler İçin Eksiksiz Ders Yönetimi',
    subtitle: 'Kendi çalışma saatlerinizi ve şartlarınızı siz belirleyin, geri kalan tüm teknik altyapıyı biz çözelim.',
    items: [
      {
        icon: 'takvim',
        title: 'Akıllı Ajanda ve Google Meet',
        body: 'Müsaitlik slotlarınızı haftalık belirleyin. Rezervasyon yapıldığında Google Meet linki ve takvim davetiyesi otomatik oluşur.',
        badge: 'Otomasyon',
      },
      {
        icon: 'odeme',
        title: 'Güvenli ve Zamanında Hakediş',
        body: 'Verdiğiniz derslerin ödemeleri her ay düzenli ve şeffaf biçimde doğrudan banka (IBAN) hesabınıza aktarılır.',
        badge: 'Zamanında Ödeme',
      },
      {
        icon: 'odev',
        title: 'Dijital Ödev ve Not Sistemi',
        body: 'Öğrencilerinize doğrudan panelden ödev atayın, teslim edilen ödevleri inceleyin ve ders sonrası notlarınızı paylaşın.',
        badge: 'Ders Araçları',
      },
      {
        icon: 'rozet',
        title: 'Doğrudan Öğrenci Portföyü',
        body: 'Türkiye genelinden ders ve koçluk talep eden öğrencilere ulaşın, kendi profilinizi ve uzmanlıklarınızı öne çıkarın.',
        badge: 'Geniş Ağ',
      },
    ],
  },
}

export function PersonaFeatures({ persona }: { persona: PersonaType }) {
  const data = FEATURES_BY_PERSONA[persona]

  return (
    <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-10 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] mb-2">{data.heading}</h2>
        <p className="text-sm sm:text-base font-semibold text-[#1B2430]/75">{data.subtitle}</p>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {data.items.map((item) => (
          <FeatureCard key={item.title} icon={item.icon} title={item.title} body={item.body} badge={item.badge} />
        ))}
      </div>
    </div>
  )
}
