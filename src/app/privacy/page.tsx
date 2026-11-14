import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gizlilik Politikası ve KVKK Aydınlatma Metni',
  description:
    'DersoLab gizlilik politikası, kişisel verilerin korunması (KVKK), öğrenci-veli veri görünürlük sınırları, Google Takvim ve yapay zekâ veri işleme kuralları.',
  alternates: {
    canonical: '/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-slate-200">
        <h1 className="text-3xl font-bold mb-2">Gizlilik Politikası ve Aydınlatma Metni</h1>
        <p className="text-sm text-slate-400 mb-8">Son güncelleme: 14 Kasım 2026</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            Bu Gizlilik Politikası, DersoLab (&quot;biz&quot;, &quot;platform&quot;) tarafından işletilen dersolab.com
            web sitesi ve hizmetlerini kullanan öğrenciler, veliler ve eğitmenler (&quot;kullanıcı&quot;, &quot;siz&quot;)
            hakkında hangi kişisel verilerin toplandığını, nasıl kullanıldığını, kimlerle paylaşıldığını ve
            6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) kapsamındaki haklarınızı açıklar.
          </p>

          <h2>1. Topladığımız Veriler</h2>
          <p>Hesabınızı oluşturduğunuzda ve platformu kullandığınızda aşağıdaki verileri toplarız:</p>
          <ul>
            <li><strong>Hesap Bilgileri:</strong> Ad soyad, e-posta adresi, şifre (şifrelenmiş olarak), rol (öğrenci, veli, eğitmen), sınav türü (LGS/YKS), telefon ve doğum tarihi (girdiyseniz)</li>
            <li><strong>Fatura Bilgileri:</strong> Kimlik numarası, adres ve şehir — yalnızca fatura düzenlenmesi gerektiğinde ve siz girdiyseniz</li>
            <li><strong>Çalışma ve Gelişim Verileri:</strong> Günlük kayıtlarınız, deneme sonuçlarınız ve net analizleriniz, hedefleriniz, Koçluk Formu cevaplarınız, koçunuzun tuttuğu seans notları ve haftalık plan</li>
            <li><strong>Yapay Zekâ Asistanı Verileri:</strong> Öğrencilerin soru çözümü veya konu anlatımı desteği almak amacıyla Yapay Zekâ Asistanı&apos;na yüklediği soru fotoğrafları ve yazılı mesajlar</li>
            <li><strong>Veli Bağlantıları:</strong> Bir veli hesabına bağlıysanız bu bağ ve tek kullanımlık bağlantı kodları</li>
            <li><strong>Profil Bilgileri:</strong> Profil fotoğrafı, eğitmenler için branşlar, biyografi, eğitim geçmişi, tanıtım videosu</li>
            <li><strong>Rezervasyon ve Ders Verileri:</strong> Planlanan/tamamlanan dersler, ödev içerikleri ve gönderimleri (fotoğraf/video)</li>
            <li><strong>Ödeme Verileri:</strong> Satın alınan paketler ve tutarlar; kart bilgileriniz bizde saklanmaz, ödeme işlemi doğrudan Shopier üzerinden gerçekleştirilir</li>
            <li><strong>Google Takvim Verileri:</strong> Eğitmenler Google hesaplarını bağladığında, ders saatlerini senkronize etmek ve Google Meet linki oluşturmak amacıyla sınırlı takvim erişimi (müsaitlik ve etkinlik oluşturma) kullanılır</li>
            <li><strong>Teknik Veriler:</strong> Zorunlu oturum çerezleri, IP adresi, tarayıcı bilgisi (kimlik doğrulama ve güvenlik amacıyla)</li>
          </ul>

          <h2>2. Verileri Nasıl Kullanıyoruz</h2>
          <ul>
            <li>Öğrenci, veli ve eğitmen hesaplarını oluşturmak, doğrulamak ve size hizmet sunmak</li>
            <li>Ders rezervasyonlarını planlamak, Google Takvim/Meet entegrasyonunu sağlamak</li>
            <li>Yapay Zekâ Asistanı üzerinden gönderilen soru görsellerini ve metinleri analiz ederek adım adım çözüm açıklaması üretmek</li>
            <li>Veli-öğrenci bağlantısı kurulduğunda akademik ilerleme ve ders katılım bilgilerini veli paneline yansıtmak</li>
            <li>Ödeme işlemlerini gerçekleştirmek (Shopier aracılığıyla)</li>
            <li>Rezervasyon, ödev ve ödeme bildirimlerini e-posta ile göndermek (Resend aracılığıyla)</li>
            <li>Platformun güvenliğini sağlamak ve kötüye kullanımı önlemek</li>
          </ul>

          <h2>3. Verilerin Paylaşılması ve Yurt Dışına Aktarım</h2>

          <p>
            <strong>Platform içinde:</strong> Öğrenci verilerinin bir kısmı, hizmetin
            işleyebilmesi için platformdaki ilgili kullanıcılara açılır.
          </p>
          <ul>
            <li>
              <strong>Eğitmenler ve koçlar:</strong> Bir eğitmenle dersiniz olduğunda ya da
              koçluk ilişkiniz kurulduğunda; adınız, ders geçmişiniz, ödevleriniz ve
              teslimleriniz, deneme sonuçlarınız ve hedefleriniz o eğitmene görünür. Koçunuz
              ayrıca Günlük kayıtlarınızı ve Koçluk Formu cevaplarınızı görebilir.
            </li>
            <li>
              <strong>Veliler:</strong> Öğrenci kendi oluşturduğu bağlantı koduyla bir veli hesabı
              bağlarsa; o veli ders takvimini, katılım durumunu, ödev durumunu, deneme
              netlerini, kredi bakiyesini ve ödeme geçmişini görür.{' '}
              <strong>
                Günlük, Koçluk Formu, öz değerlendirme ve koç seans notları öğrencinin mahremiyet
                alanıdır ve veliye kapalıdır.
              </strong>{' '}
              Bağı veli veya öğrenci koparabilir; öğrenci hesabına hangi veli hesabının bağlı olduğunu her zaman görür.
            </li>
          </ul>

          <p>
            <strong>Altyapı ve hizmet sağlayıcılarla (Yurt Dışı Aktarım):</strong> Hizmetin teknik olarak
            sunulabilmesi amacıyla, aşağıdaki uluslararası bulut ve API sağlayıcılarıyla yalnızca
            ilgili işlem için gerekli minimum veri paylaşılır. Bu sağlayıcıların sunucuları Türkiye
            dışında bulunabildiğinden, platformu kullanarak hizmetin ifası için zorunlu olan bu teknik
            aktarıma KVKK m.9 kapsamında onay vermiş olursunuz:
          </p>
          <ul>
            <li><strong>Supabase:</strong> Veritabanı, dosya depolama ve kimlik doğrulama altyapısı</li>
            <li><strong>Google (OAuth &amp; Calendar/Meet):</strong> Google ile giriş ve çevrim içi dersler için Google Takvim / Google Meet bağlantısı oluşturma</li>
            <li><strong>Google Gemini API (Yapay Zekâ Asistanı):</strong> Öğrencinin soru çözümü amacıyla yüklediği soru görselleri ve metinler, çözüm üretilmesi için Google Gemini API servisine iletilir. Bu sorgular öğrencinin kimlik veya iletişim bilgileriyle birleştirilmez ve ücretli kurumsal API katmanı kapsamında Google tarafından genel yapay zekâ modellerini eğitmek amacıyla kullanılmaz.</li>
            <li><strong>Shopier:</strong> Güvenli ödeme ve tahsilat işlemleri</li>
            <li><strong>Resend:</strong> İşlemsel e-posta bildirimleri (ders hatırlatma, şifre sıfırlama vb.)</li>
          </ul>
          <p>Verileriniz hiçbir şekilde üçüncü taraflara reklam veya pazarlama amacıyla satılmaz ya da kiralanmaz.</p>

          <h2>4. Veri Koruma Önlemleri</h2>
          <p>
            Başta Google Takvim entegrasyonu üzerinden erişilen veriler olmak üzere, hassas verilerinizi
            korumak için aşağıdaki teknik ve idari önlemleri uyguluyoruz:
          </p>
          <ul>
            <li><strong>Şifreleme:</strong> Platform ile sunucularımız arasındaki tüm veri iletimi HTTPS/TLS ile şifrelenir; verileriniz veritabanımızda (Supabase/PostgreSQL) sağlayıcının şifreli depolama altyapısında, bekleme halinde de şifrelenmiş olarak saklanır.</li>
            <li><strong>Erişim Kontrolü:</strong> Veritabanı seviyesinde satır bazlı güvenlik (Row Level Security) politikaları uygulanır; her kullanıcı yalnızca kendi verilerine veya rolüne uygun verilere erişebilir. Google Takvim erişim jetonları (access/refresh token) yalnızca sunucu tarafında saklanır, tarayıcıya veya istemci koduna hiçbir şekilde iletilmez.</li>
            <li><strong>Sınırlı Erişim Kapsamı:</strong> Google Takvim entegrasyonu yalnızca eğitmenin kendi ders müsaitliğini görüntülemek ve planlanan dersler için Google Meet linkli takvim etkinliği oluşturmak amacıyla, gerekli minimum izin kapsamıyla (scope) kullanılır.</li>
            <li><strong>Saklama ve Silme:</strong> Bir eğitmen Google hesap bağlantısını kaldırdığında veya hesabını sildiğinde, ilgili erişim jetonları derhal silinir.</li>
            <li><strong>Personel Erişimi:</strong> Kullanıcı verilerine yalnızca hizmeti sunmak veya destek talebine yanıt vermek için yetkilendirilmiş sınırlı sayıda personel erişebilir.</li>
          </ul>

          <h2>5. Google Kullanıcı Verilerinin Sınırlı Kullanımı</h2>
          <p>
            DersoLab&apos;ın Google API&apos;lerinden aldığı bilgilerin kullanımı ve başka herhangi bir
            uygulamaya aktarılması, Sınırlı Kullanım (Limited Use) şartları dahil olmak üzere{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              className="underline text-amber-400 font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google API Hizmetleri Kullanıcı Verileri Politikası
            </a>
            &apos;na uygundur. Google Takvim üzerinden elde edilen veriler yalnızca ders planlama ve
            Google Meet linki oluşturma özelliğini sağlamak amacıyla kullanılır; reklam amaçlı
            kullanılmaz, üçüncü taraflara satılmaz veya kiralanmaz ve genel amaçlı yapay zeka/makine
            öğrenmesi modellerini eğitmek için kullanılmaz.
          </p>

          <h2>6. 18 Yaş Altı (Reşit Olmayan) Kullanıcılar ve Veli Onayı</h2>
          <p>
            DersoLab, ortaokul (LGS) ve lise (YKS) öğrencilerine yönelik bir eğitim platformudur.
            18 yaşından küçük öğrencilerin platforma kaydolması ve hizmetleri kullanması, veli veya
            yasal temsilcilerinin bilgisi ve iznine tabidir.
          </p>
          <ul>
            <li>Platform üzerindeki ücretli kredi paketi satın alımları yalnızca 18 yaşını doldurmuş veli, vasi veya yasal temsilci tarafından gerçekleştirilebilir.</li>
            <li>Veliler, ücretsiz bir <strong>Veli Hesabı</strong> oluşturarak öğrencinin tek kullanımlık bağlantı koduyla hesaplarını eşleştirebilir; ders programını, katılımı ve kredi hareketlerini şeffaf biçimde denetleyebilir.</li>
            <li>Veli veya yasal temsilci, çocuğuna ait hesabın kapatılmasını veya kişisel verilerin silinmesini her zaman <a href="mailto:destek@dersolab.com" className="underline text-amber-400">destek@dersolab.com</a> üzerinden talep edebilir.</li>
          </ul>

          <h2>7. Veri Saklama ve Hesap Silme</h2>
          <p>
            Verileriniz, hesabınız aktif olduğu sürece ve yasal yükümlülüklerimizi yerine getirmek için
            gerekli olduğu müddetçe saklanır.
          </p>
          <p>
            <strong>Hesap silme ne yapıyor:</strong> Hesabınızı sildiğinizde adınız, e-posta
            adresiniz, telefonunuz, doğum tarihiniz, profil fotoğrafınız ve fatura bilgileriniz
            (kimlik numarası, adres, şehir) kaldırılır ve hesabınız kapatılır — tekrar giriş
            yapılamaz. Ders, ödeme ve fatura kayıtları ise, vergi/ticaret mevzuatı kapsamındaki yasal saklama yükümlülükleri ve
            eğitmenlerin hak ediş kayıtları gerektirdiği için, kimliğinizle bağı koparılmış (anonimleştirilmiş) biçimde
            saklanmaya devam eder.
          </p>

          <h2>8. KVKK Kapsamındaki Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi kapsamında şu haklara sahipsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme ve işlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>KVKK&apos;nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerin silinmesini veya yok edilmesini isteme</li>
            <li>Verilerinizin bir kopyasını talep etme ve işlenmesine itiraz etme</li>
          </ul>
          <p>Bu haklarınızı kullanmak için aşağıdaki iletişim kanalından bize ulaşabilirsiniz.</p>

          <h2>9. Çerezler (Cookies)</h2>
          <p>
            Platform, kullanıcı oturumunuzu güvenli şekilde açık tutmak ve kimlik doğrulaması sağlamak
            amacıyla zorunlu birinci taraf oturum çerezleri (Supabase Auth çerezleri) kullanır.
            İleride hizmet kalitesini ölçmek veya tanıtım faaliyetleri yürütmek amacıyla üçüncü taraf
            analitik/pazarlama çerezleri kullanılması durumunda, açık rızanız ayrıca talep edilir ve
            bu metin güncellenir.
          </p>

          <h2>10. İletişim ve Veri Sorumlusu</h2>
          <p>
            Bu politika veya kişisel verilerinizle ilgili her türlü soru, talep ve başvurunuz için{' '}
            <a href="mailto:destek@dersolab.com" className="underline text-amber-400 font-semibold">destek@dersolab.com</a>{' '}
            adresinden bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
