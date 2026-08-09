export const metadata = {
  title: 'Gizlilik Politikası - DersoLab',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen w-full bg-[#F4F1E8]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-[#1B2430]">
        <h1 className="text-3xl font-bold mb-2">Gizlilik Politikası</h1>
        <p className="text-sm text-[#1B2430]/60 mb-8">Son güncelleme: 9 Ağustos 2026</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            Bu Gizlilik Politikası, DersoLab (&quot;biz&quot;, &quot;platform&quot;) tarafından işletilen dersolab.com
            web sitesi ve hizmetlerini kullanan öğrenciler, veliler ve eğitmenler (&quot;kullanıcı&quot;, &quot;siz&quot;)
            hakkında hangi kişisel verilerin toplandığını, nasıl kullanıldığını ve haklarınızı açıklar.
          </p>

          <h2>1. Topladığımız Veriler</h2>
          <p>Hesabınızı oluşturduğunuzda ve platformu kullandığınızda aşağıdaki verileri toplarız:</p>
          <ul>
            <li><strong>Hesap Bilgileri:</strong> Ad soyad, e-posta adresi, şifre (şifrelenmiş olarak), rol (öğrenci, veli, eğitmen), sınav türü (LGS/YKS)</li>
            <li><strong>Profil Bilgileri:</strong> Profil fotoğrafı, eğitmenler için branşlar, biyografi, eğitim geçmişi, tanıtım videosu</li>
            <li><strong>Rezervasyon ve Ders Verileri:</strong> Planlanan/tamamlanan dersler, ödev içerikleri ve gönderimleri (fotoğraf/video)</li>
            <li><strong>Ödeme Verileri:</strong> Satın alınan paketler ve tutarlar; kart bilgileriniz bizde saklanmaz, ödeme işlemi doğrudan İyzico üzerinden gerçekleştirilir</li>
            <li><strong>Google Takvim Verileri:</strong> Eğitmenler Google hesaplarını bağladığında, ders saatlerini senkronize etmek ve Google Meet linki oluşturmak amacıyla sınırlı takvim erişimi (müsaitlik ve etkinlik oluşturma) kullanılır</li>
            <li><strong>Teknik Veriler:</strong> Oturum çerezleri, IP adresi, tarayıcı bilgisi (kimlik doğrulama ve güvenlik amacıyla)</li>
          </ul>

          <h2>2. Verileri Nasıl Kullanıyoruz</h2>
          <ul>
            <li>Hesabınızı oluşturmak, doğrulamak ve size hizmet sunmak</li>
            <li>Ders rezervasyonlarını planlamak, Google Takvim/Meet entegrasyonunu sağlamak</li>
            <li>Ödeme işlemlerini gerçekleştirmek (İyzico aracılığıyla)</li>
            <li>Rezervasyon, ödev ve ödeme bildirimlerini e-posta ile göndermek (Resend aracılığıyla)</li>
            <li>Platformun güvenliğini sağlamak ve kötüye kullanımı önlemek</li>
          </ul>

          <h2>3. Verilerin Paylaşılması</h2>
          <p>Verilerinizi aşağıdaki hizmet sağlayıcılarla, yalnızca hizmeti sunabilmek için gerekli ölçüde paylaşırız:</p>
          <ul>
            <li><strong>Supabase:</strong> Veritabanı ve kimlik doğrulama altyapısı</li>
            <li><strong>Google:</strong> Google ile giriş ve Google Takvim/Meet entegrasyonu</li>
            <li><strong>İyzico:</strong> Ödeme işlemleri</li>
            <li><strong>Resend:</strong> E-posta bildirimleri</li>
          </ul>
          <p>Verileriniz hiçbir şekilde üçüncü taraflara pazarlama amacıyla satılmaz veya kiralanmaz.</p>

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
              className="underline text-[#DD7B3A] font-semibold"
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

          <h2>6. Reşit Olmayan Kullanıcılar</h2>
          <p>
            Platform LGS, YKS, DGS, ALES ve KPSS öğrencilerine yönelik hizmet verdiği için reşit olmayan kullanıcılar bulunabilir.
            Öğrenci profilleri, bir veli hesabı tarafından oluşturulur ve yönetilir; öğrenciler platforma
            bağımsız olarak kayıt olamaz. Veliler, öğrenci profillerini istedikleri zaman görüntüleyebilir
            ve yönetebilir.
          </p>

          <h2>7. Veri Saklama</h2>
          <p>
            Verileriniz, hesabınız aktif olduğu sürece ve yasal yükümlülüklerimizi yerine getirmek için
            gerekli olduğu müddetçe saklanır. Hesap silme talebinde bulunduğunuzda verileriniz makul bir
            süre içinde silinir veya anonimleştirilir.
          </p>

          <h2>8. Haklarınız</h2>
          <p>KVKK ve ilgili mevzuat kapsamında şu haklara sahipsiniz:</p>
          <ul>
            <li>Hangi verilerinizin işlendiğini öğrenme</li>
            <li>Verilerinizin düzeltilmesini veya silinmesini talep etme</li>
            <li>Verilerinizin işlenmesine itiraz etme</li>
            <li>Verilerinizin bir kopyasını talep etme</li>
          </ul>
          <p>Bu haklarınızı kullanmak için aşağıdaki iletişim kanalından bize ulaşabilirsiniz.</p>

          <h2>9. Çerezler</h2>
          <p>
            Platform, oturumunuzu açık tutmak ve güvenliği sağlamak amacıyla yalnızca zorunlu oturum
            çerezleri kullanır. Pazarlama veya izleme amaçlı üçüncü taraf çerezleri kullanılmaz.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Gizlilikle ilgili sorularınız için bize <a href="mailto:destek@dersolab.com" className="underline text-[#DD7B3A] font-semibold">destek@dersolab.com</a> adresinden
            ulaşabilirsiniz.
          </p>

          <h2>11. Değişiklikler</h2>
          <p>
            Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişiklikler olduğunda kullanıcılarımızı
            e-posta yoluyla bilgilendireceğiz.
          </p>
        </div>
      </div>
    </div>
  )
}
