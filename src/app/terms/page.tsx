export const metadata = {
  title: 'Kullanım Şartları - DersoLab',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen w-full bg-[#0a0a0a]">
      <div className="mx-auto max-w-3xl px-5 py-12 text-slate-200">
        <h1 className="text-3xl font-bold mb-2">Kullanım Şartları</h1>
        <p className="text-sm text-slate-400 mb-8">Son güncelleme: 7 Ağustos 2026</p>

        <div className="space-y-6 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-2 [&_p]:mb-3 [&_li]:mb-1 [&_ul]:list-disc [&_ul]:pl-6">

          <p>
            Bu Kullanım Şartları; DersoLab (&quot;platform&quot;) üzerinden sunulan online özel ders ve
            danışmanlık hizmetlerini kullanan öğrenciler ve eğitmenler için geçerli kuralları belirler.
            Platformu kullanarak bu şartları kabul etmiş sayılırsınız.
          </p>

          <h2>1. Hizmetin Tanımı</h2>
          <p>
            DersoLab, LGS ve YKS öğrencilerini bağımsız eğitmenlerle buluşturan bir online ders ve
            koçluk platformudur. Dersler, Google Meet üzerinden çevrim içi olarak gerçekleştirilir.
            DersoLab, eğitmenler ile öğrenciler arasında aracılık yapar; eğitmenler platforma
            bağımsız hizmet sağlayıcı olarak kayıt olur.
          </p>

          <h2>2. Hesap Oluşturma</h2>
          <ul>
            <li>Öğrenciler platforma kendi hesaplarıyla doğrudan kayıt olur.</li>
            <li>Eğitmen hesapları, platform tarafından onaylandıktan sonra öğrencilere görünür hale gelir.</li>
            <li>Verdiğiniz bilgilerin doğru ve güncel olmasından siz sorumlusunuz.</li>
            <li>Hesap güvenliğinizden (şifrenizin gizliliğinden) siz sorumlusunuz.</li>
          </ul>

          <h2>3. Ders Paketleri ve Ödemeler</h2>
          <ul>
            <li>Dersler, önceden satın alınan kredi paketleri karşılığında planlanır.</li>
            <li>Ödemeler Shopier altyapısı üzerinden güvenli şekilde alınır.</li>
            <li>Bir dersin en az 24 saat öncesinden iptal edilmesi durumunda kredi iade edilir.</li>
            <li>24 saatten az kala yapılan iptallerde kredi iade edilmez.</li>
            <li>Paket fiyatları ve içerikleri önceden haber verilmeksizin güncellenebilir.</li>
            <li>Mevcut satın alınmış krediler etkilenmez.</li>
          </ul>

          <h2>4. Eğitmen Yükümlülükleri</h2>
          <ul>
            <li>Eğitmenler, profillerinde belirttikleri branş ve nitelik bilgilerinin doğruluğundan sorumludur.</li>
            <li>Planlanan derslere zamanında katılmak eğitmenin sorumluluğundadır.</li>
            <li>Uygunsuz davranış, yanlış bilgi verme veya tekrarlanan ders iptalleri durumunda eğitmenin
              hesabı askıya alınabilir.</li>
          </ul>

          <h2>5. Kullanıcı Davranış Kuralları</h2>
          <p>Platformu kullanırken şunları yapmamayı kabul edersiniz:</p>
          <ul>
            <li>Başka bir kullanıcının kimliğine bürünmek veya yanlış bilgi vermek</li>
            <li>Platform dışında ders ücretini tahsil etmeye çalışmak</li>
            <li>Diğer kullanıcılara karşı taciz, hakaret veya uygunsuz davranışta bulunmak</li>
            <li>Platformun güvenliğini veya işleyişini bozmaya yönelik girişimlerde bulunmak</li>
          </ul>

          <h2>6. Fikrî Mülkiyet</h2>
          <p>
            Platformda paylaşılan ödev materyalleri ve içerikler ilgili kullanıcıya aittir. DersoLab markası,
            logosu ve platform yazılımı DersoLab&apos;ın fikrî mülkiyetidir.
          </p>

          <h2>7. Sorumluluğun Sınırlandırılması</h2>
          <p>
            DersoLab, eğitmenler tarafından verilen derslerin içeriğinden veya kalitesinden doğrudan sorumlu
            değildir; eğitmenler bağımsız hizmet sağlayıcılardır. Platform, kesintisiz veya hatasız hizmet
            garantisi vermez.
          </p>

          <h2>8. Hesap Askıya Alma ve Fesih</h2>
          <p>
            Bu şartların ihlali durumunda DersoLab, kullanıcı hesabını önceden bildirimde bulunmaksızın
            askıya alma veya kapatma hakkını saklı tutar.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu şartlar zaman zaman güncellenebilir. Güncel şartlar her zaman bu sayfada yayınlanır.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Sorularınız için <a href="mailto:destek@dersolab.com" className="underline text-[#9C4A0C] font-semibold">destek@dersolab.com</a> adresinden
            bize ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
