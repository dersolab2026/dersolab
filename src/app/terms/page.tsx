import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kullanım Şartları, Kredi ve İade Koşulları',
  description:
    'DersoLab kullanım şartları, yanmayan ders kredisi geçerlilik kuralları, 24 saat ücretsiz ders iptali, cayma hakkı ve öğrenci-veli-eğitmen yükümlülükleri.',
  alternates: {
    canonical: '/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-slate-200">
        <h1 className="text-3xl font-bold mb-2">Kullanım Şartları, Kredi ve İade Koşulları</h1>
        <p className="text-sm text-slate-400 mb-8">Son güncelleme: 14 Kasım 2026</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            Bu Kullanım Şartları; DersoLab (&quot;platform&quot;) üzerinden sunulan online özel ders,
            akademik koçluk ve öğrenim araçlarını kullanan <strong>öğrenciler, veliler ve eğitmenler</strong> için
            geçerli kuralları belirler. Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
          </p>

          <h2>1. Hizmetin Tanımı</h2>
          <p>
            DersoLab, ortaokul (LGS) ve lise (YKS) öğrencilerini onaylı eğitmenlerle buluşturan bir
            online bire bir özel ders, akademik koçluk ve çalışma platformudur. Canlı dersler Google Meet
            altyapısı üzerinden çevrim içi olarak gerçekleştirilir. DersoLab, eğitmenler ile öğrenci ve
            veliler arasında güvenli planlama ve takip altyapısı sunar; eğitmenler platformda bağımsız
            uzmanlar olarak yer alır.
          </p>

          <h2>2. Hesap Türleri ve Oluşturma Kuralları</h2>
          <ul>
            <li><strong>Öğrenci Hesabı:</strong> Öğrenciler ders planlamak, ödev ve deneme takibi yapmak için kaydolur. 18 yaşından küçük öğrencilerin platformu kullanımı veli veya yasal temsilcilerinin bilgisi ve onayına tabidir.</li>
            <li><strong>Veli Hesabı:</strong> Veliler kendi hesaplarını oluşturarak öğrencinin tek kullanımlık bağlantı koduyla eşleşme sağlayabilir; öğrencinin ders katılımını, ödev durumunu, deneme netlerini takip edebilir ve öğrencinin hesabına ders kredisi tanımlayabilir.</li>
            <li><strong>Eğitmen Hesabı:</strong> Eğitmen başvuruları platform yönetimi tarafından incelenir, uzmanlık ve deneyim onayı tamamlandıktan sonra öğrencilere görünür hâle gelir.</li>
            <li>Kayıt sırasında verilen bilgilerin doğruluğundan ve hesap şifresinin güvenliğinden ilgili kullanıcı sorumludur.</li>
          </ul>

          <h2>3. Ücretsiz Tanışma Dersi, Kredi Paketleri ve İade Koşulları</h2>
          <ul>
            <li><strong>Ücretsiz Tanışma Dersi:</strong> Yeni kayıt olan öğrenciler, sistemi ve eğitmeni deneyimlemek amacıyla hiçbir kart bilgisi girmeden ücretsiz tanışma dersi talep edebilir.</li>
            <li><strong>Kredi Sistemi ve Süresi (&quot;Yanmayan Kredi&quot;):</strong> Platformda aylık otomatik yenilenen zorunlu abonelik bulunmaz. 1 ders kredisi, 40 dakikalık bire bir canlı derse karşılık gelir. Satın alınan ders kredileri aylık olarak silinmez; satın alma tarihinden itibaren ilgili eğitim-öğretim dönemi sonuna kadar (en az 12 ay boyunca) geçerliliğini korur.</li>
            <li><strong>Eğitmen ve Branş Esnekliği:</strong> Satın alınan krediler tek bir öğretmene veya tek bir derse kilitli değildir; öğrenci kredilerini dilediği onaylı eğitmende ve branşta kullanabilir.</li>
            <li><strong>Ödeme Altyapısı:</strong> Ödemeler 18 yaş üstü veli veya kullanıcı tarafından Shopier güvenli ödeme altyapısı üzerinden gerçekleştirilir; kredi kartı bilgileri DersoLab sunucularında tutulmaz.</li>
            <li><strong>Ders İptali ve Kredi İadesi (24 Saat Kuralı):</strong> Planlanmış bir dersin başlangıç saatine en az 24 saat kala öğrenci veya veli tarafından iptal edilmesi durumunda, harcanan kredi kesintisiz ve otomatik olarak öğrencinin kredi bakiyesine iade edilir. Derse 24 saatten az süre kala yapılan iptallerde veya derse katılmama durumunda (eğitmen kaynaklı teknik aksaklıklar hariç) kredi kullanılmış sayılır.</li>
            <li><strong>Eğitmen Kaynaklı İptaller:</strong> Eğitmenin derse katılamaması veya dersi iptal etmesi durumunda öğrenci kredisi anında bakiyeye iade edilir.</li>
            <li><strong>Cayma Hakkı ve Kullanılmamış Paket İadesi:</strong> 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği uyarınca, kredi paketinin satın alındığı tarihten itibaren 14 (ondört) gün içinde hiçbir kredisi kullanılmamış paketler için koşulsuz cayma hakkı kullanılarak tam ücret iadesi talep edilebilir. Paketten kısmen kredi kullanılmış olması hâlinde, kullanılan derslerin tekil ders ücreti düşülerek kalan bakiye üzerinden değerlendirme yapılır. İade talepleri <a href="mailto:destek@dersolab.com" className="underline text-amber-400">destek@dersolab.com</a> adresine iletilir.</li>
            <li>Paket fiyatları ileriye dönük olarak güncellenebilir; ancak mevcut satın alınmış krediler fiyat artışlarından kesinlikle etkilenmez.</li>
          </ul>

          <h2>4. Eğitmen Yükümlülükleri</h2>
          <ul>
            <li>Eğitmenler, profillerinde belirttikleri eğitim, mezuniyet ve branş bilgilerinin doğruluğundan sorumludur.</li>
            <li>Planlanan derslere zamanında katılmak ve ders sonrası öğrenci/veli geri bildirim notlarını eksiksiz girmek eğitmenin sorumluluğundadır.</li>
            <li>Uygunsuz davranış, yanıltıcı bilgi verme veya mazeretsiz tekrarlanan ders iptalleri durumunda eğitmenin hesabı askıya alınır.</li>
          </ul>

          <h2>5. Kullanıcı Davranış Kuralları</h2>
          <p>Platformu kullanırken şunları yapmamayı kabul edersiniz:</p>
          <ul>
            <li>Başka bir kullanıcının kimliğine bürünmek veya yanıltıcı bilgi vermek</li>
            <li>Platform güvenliğini ve kayıt sistemini devre dışı bırakarak platform dışı ödeme talep etmek veya teklif etmek</li>
            <li>Canlı derslerde veya mesajlaşmalarda taciz, hakaret ya da pedagojik ilkelere aykırı davranışta bulunmak</li>
            <li>Platformun yazılım altyapısını veya yapay zekâ araçlarını amacı dışında kötüye kullanmak</li>
          </ul>

          <h2>6. Fikrî Mülkiyet</h2>
          <p>
            Platformda paylaşılan ödev materyalleri ve içerikler ilgili kullanıcıya aittir. DersoLab markası,
            logosu, L.A.B. interaktif içerikleri ve platform yazılımı DersoLab&apos;ın fikrî mülkiyetidir; izinsiz kopyalanamaz.
          </p>

          <h2>7. Sorumluluğun Sınırlandırılması</h2>
          <p>
            DersoLab, eğitmen ön onay sürecini titizlikle yürütmekle birlikte, öğrencinin kişisel çalışma
            disiplinine bağlı olan sınav sonuçları konusunda mutlak bir derece taahhüdünde bulunmaz.
            Yapay zekâ destekli soru çözüm araçları yardımcı çalışma materyalidir; olası işlem hatalarında
            uzman eğitmen görüşü esas alınmalıdır.
          </p>

          <h2>8. Hesap Askıya Alma ve Fesih</h2>
          <p>
            Bu şartların ağır ihlali durumunda DersoLab, ilgili kullanıcı hesabını askıya alma veya kapatma
            hakkını saklı tutar.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu şartlar hizmet kapsamındaki yeniliklere göre güncellenebilir. Güncel metin her zaman bu sayfada yayımlanır.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Kullanım şartları, paketler veya iade taleplerinizle ilgili tüm sorularınız için{' '}
            <a href="mailto:destek@dersolab.com" className="underline text-amber-400 font-semibold">destek@dersolab.com</a>{' '}
            adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
