# DersoLab — Detaylı Denetim, Rakip Kıyası ve Özellik Önerileri

**Tarih:** 16 Ağustos 2026
**Kapsam:** 33 sayfa + 6 API rotası, 4 kullanıcı türü (ziyaretçi, öğrenci, eğitmen, admin)
**Yöntem:** Her rol için geçici hesap açılıp tüm rotalar canlı gezildi; hesaplar denetim sonunda silindi.

---

## 1. En kritik bulgu: platformda hiç rezervasyon yok

Teknik denetimden önce şunu söylemem gerekiyor, çünkü diğer her şeyin önüne geçiyor:

| Ölçüm | Değer |
|---|---|
| Kayıtlı öğrenci | 10 |
| Onaylı eğitmen | 17 |
| **Toplam rezervasyon (tüm zamanlar)** | **0** |
| **Tamamlanan paket satışı** | **0** |

Site teknik olarak çalışıyor ama hiç ders satılmamış. Bu durumda öncelik yeni özellik eklemek değil, **ilk rezervasyonun önündeki engelleri kaldırmak**. Aşağıdaki bulguların önem sırasını buna göre yaptım.

### İlk rezervasyonun önündeki en somut engel

17 onaylı eğitmenin sadece **7'si** gerçekten ders alınabilir durumda:

| Durum | Sayı |
|---|---|
| Branş seçmemiş (hiçbir filtreyle bulunamaz) | 7 |
| Takvimi bağlı değil (rezervasyon alamaz) | 10 |
| **Tanıtım yazısı (bio) olan** | **0 / 17** |

Yani öğrenci "Eğitmenler" sayfasına girdiğinde kartların yarısı boş görünüyordu ve **hiçbir eğitmenin kendini anlatan tek satırı yok**. Bu, ilk izlenim olarak ciddi bir güven kaybı.

---

## 2. Bulunan ve düzeltilen hatalar

Dördü de düzeltildi, canlı doğrulandı ve commit edildi (`577e5fa`).

### 2.1 Rol sınırları açıktı — *orta/yüksek önem*

Öğrenci ile eğitmen panelleri birbirine tamamen açıktı. Bir öğrenci şu sayfaları açabiliyordu:

- `/dashboard/instructor/profile` — eğitmen profil düzenleme
- `/dashboard/instructor/availability` — ajanda düzenleme
- `/dashboard/instructor/settings` — "Profili Dondur" ve hesap silme
- `/dashboard/instructor/odemeler` — ödeme/IBAN ekranı

Aynı şekilde eğitmen de öğrenci sayfalarını açabiliyordu. Admin bölümü doğru korunuyordu; eksik olan sadece bu iki bölümdü.

**Veri sızıntısı yoktu** — sorgular kullanıcının kendi kimliğiyle çalıştığı için kimse başkasının verisini görmüyordu. Ama arayüz sınırı yanlıştı ve bir öğrencinin eğitmen ayarlarında dolaşması kabul edilebilir değil.

**Düzeltme:** `dashboard/instructor/` ve `dashboard/student/` bölümlerine admin'dekiyle aynı desende rol koruması eklendi. Admin aynı zamanda ders verdiği için eğitmen tarafına erişmeye devam ediyor.

### 2.2 Müsaitlik API'si herkese açıktı — *düşük/orta önem*

`/api/instructors/{id}/availability` hiçbir kimlik doğrulaması yapmıyordu. Eğitmen kimlikleri herkese açık listede göründüğü için, giriş yapmamış biri istediği eğitmenin haftalık müsaitlik takvimini çekebiliyordu (test ettim: 126 slot döndü).

**Düzeltme:** Giriş şartı eklendi, çerezsiz istek artık 401 dönüyor.

### 2.3 Yönetim özeti yanlış sayıyordu — *düşük önem*

Genel Bakış "11 öğrenci" derken Kullanıcılar sayfası "10 öğrenci" diyordu. Sebep: silinmiş bir hesabın alt tablo satırı duruyor ve özet onu da sayıyordu.

**Düzeltme:** Sayım silinmiş hesapları eliyor, iki sayfa artık aynı rakamı veriyor.

> Not: Bu düzeltmenin ilk hâli eğitmen sayacını 20'den 0'a düşürüyordu (`instructors` ile `users` arasında birden fazla ilişki olduğu için veritabanı katmanı sorguyu çözemiyordu). Doğrulama sırasında yakalayıp yaklaşımı değiştirdim.

### 2.4 Pazar yerinde boş kartlar — *orta önem*

Branş seçmemiş 7 eğitmen listede adı ve "Yakında müsait" etiketinden ibaret boş kart olarak duruyordu. Hiçbir filtreyle bulunamadıkları için bir işe de yaramıyorlardı.

**Düzeltme:** Listeden çıkarıldılar (18 → 11 kart). Profil sayfaları çalışmaya devam ediyor, mevcut linkler kırılmadı.

### Sorun çıkmayan yerler

- 33 sayfanın tamamı hatasız yükleniyor, sunucu logunda hata yok
- Giriş yapmadan korumalı sayfalara erişim doğru engelleniyor
- Admin bölümü rol koruması doğru çalışıyor
- Cron rotaları `CRON_SECRET` ile korumalı
- `/rehberlik → /kocluk` yönlendirmesi çalışıyor
- Onay bildirimleri (geçen turda eklenen) tüm rollerde çalışıyor

---

## 3. Rakip kıyası

Rakiplerde **hesap açmadım**; hepsi kendi herkese açık sayfalarından ve App Store listelemesinden doğrulandı.

| | **DersoLab** | **Dersveral** | **Derste.com** | **Tahta** | **Birebir** |
|---|---|---|---|---|---|
| Model | Pazar yeri, 1:1 | Pazar yeri, 1:1 | Pazar yeri + paket | Koçluk + 1:1 | Grup dershane |
| Eğitmen sayısı | 17 | 8.832 | — | — | — |
| Ders başı fiyat | **833–1.000 TL** | 500–2.000 TL | ~1.000–1.320 TL | Abonelik | Program |
| Paket | 1 / 6 / 12 kredi | Yok, pazarlık | 10–200 ders | Aylık abonelik | 12.500–39.900 TL |
| Ders ortamı | Google Meet | Kendi sınıfı | Kendi sınıfı | Kendi uygulaması | Kendi sistemi |
| **Yorum / puan** | **Yok** | **Var (ör. 17 yorum)** | **Var** | — | — |
| Ücretsiz tanışma | **Var (20 dk)** | — | — | — | — |
| Ödev takibi | **Var** | — | — | — | — |
| Koçluk | **Var** | — | Kariyer anketi | Ana ürün | Akademik koçluk |
| Soru çözüm | Yok | Yok | Yok | **15 dk'da AI/öğretmen** | — |
| Çalışma programı | Günlük (kendi girer) | — | Haftalık plan | Kişiye özel program | — |
| Deneme sınavı | Yok | — | Pakete dahil | Var | Var |

**Tahta abonelik fiyatları (App Store'dan doğrulandı):** YKS koçluk 2.899 TL/ay, YKS soru paketi 1.099 TL/ay, LGS koçluk 2.799 TL/ay.

### Nerede iyisin

- **Ücretsiz tanışma dersi** — kıyasladığım dört platformun hiçbirinde açıkça yok. En güçlü kozun, ama ana sayfada hak ettiği yeri almıyor.
- **Ödev döngüsü** (ver → teslim et → incele) rakiplerde görmediğim bir bütünlük.
- **Fiyat** orta segmentte, Derste'nin altında ve savunulabilir.
- **Google Meet + Takvim entegrasyonu** — kendi sınıfını yazmak yerine öğrencinin zaten kullandığı araca yaslanmak, bu ölçekte doğru tercih.

### Nerede geridesin

1. **Yorum/puan yok.** Doğruladığım iki pazar yerinde de var. Bir öğrenci 17 eğitmen arasından neye göre seçecek? Şu anda hiçbir sinyal yok — ne yorum, ne puan, ne de tanıtım yazısı.
2. **Eğitmen profilleri boş.** 17/17 bio'suz. Rakipte deneyim, fiyat ve yorum bir arada duruyor.
3. **Ölçek.** Dersveral'de 8.832 öğretmen var. Bununla sayıda yarışamazsın; **seçilmiş ve gerçekten dolu profiller** ile yarışman gerekiyor.
4. **Soru çözüm** Tahta'nın ana kancası. Sende yok (bir dönem yapıldı, sonra kaldırıldı).

---

## 4. Öneriler

### A. Önce bunlar — kod değil, içerik (bu hafta)

Bunlar geliştirme gerektirmiyor ama ilk rezervasyona giden yol bunlardan geçiyor.

1. **10 eğitmenin takvimini bağlat.** Şu an sadece 7 kişiden ders alınabiliyor. Otomatik hatırlatma e-postası zaten haftalık gidiyor; bir de tek tek konuşulmalı.
2. **Herkese bio yazdır.** 2-3 cümle: kim, kaç yıldır, hangi sınava hazırlıyor. Boş profil satmıyor.
3. **7 eğitmene branş seçtir.** Artık listede görünmüyorlar; branş seçince geri gelecekler.

### B. Sonra bunlar — küçük ve yüksek etkili

| Öneri | Neden | Emek |
|---|---|---|
| **Ders sonrası puan + kısa yorum** | Kıyasladığım iki pazar yerinde de var, sende yok. En büyük eksik. | Orta |
| **Profil doluluk göstergesi** | Eğitmene "profilin %40 dolu" demek, bio ve fotoğrafı kendiliğinden doldurtur. | Küçük |
| **Ana sayfada tanışma dersini öne çıkar** | Rakiplerde olmayan tek kozun, şu an sıradan bir buton. | Küçük |
| **Eğitmen kartında "ilk müsait saat"** | "Yakında müsait" yerine "yarın 14:00 müsait" çok daha ikna edici. | Orta |

### C. Daha büyük işler — önce yukarıdakiler otursun

- **Veli görünümü.** Ödemeyi veli yapıyor ama panelde yeri yok. (Bir dönem vardı, kaldırıldı — geri getirmeye değer olabilir.)
- **Deneme sınavı / ilerleme raporu.** Derste ve Tahta'da var, koçluk ürününü güçlendirir.
- **Soru çözüm.** Tahta'nın kancası ama maliyetli ve daha önce kaldırıldı; ilk rezervasyonlar gelmeden geri açmam.

### D. Şimdilik önermiyorum

- **Kendi video sınıfını yazmak.** Google Meet çalışıyor; buraya harcanacak emek satışa dönmez.
- **Eğitmen sayısını hızla artırmak.** Şu anki 17 kişinin yarısı profilini doldurmamışken 50 kişi eklemek boş kart sayısını artırır.

---

## 5. Devam eden bilinen kısıt

**Android uygulamasında Google Takvim bağlama.** Sistem tarayıcısı açılıyor ama WebView'in oturum çerezini taşımadığı için `/api/google/authorize` kontrolü büyük ihtimalle başarısız oluyor. Daha önce not edilmişti, hâlâ açık. Çözümü OAuth `state` parametresine imzalı kullanıcı kimliği koymaktan geçiyor. Eğitmenler takvimi masaüstünden bağladığı sürece acil değil.
