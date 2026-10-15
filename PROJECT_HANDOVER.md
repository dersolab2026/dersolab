# DersoLab — Proje Devir Teslim ve Master Dokümantasyon Dosyası

**Belge sürümü:** 1.0 (Claude Snapshot) + 1.1 (Kod Tabanı Canlı Durum Eki)  
**Hazırlanma tarihi:** 5 Eylül 2026  
**Proje sahibi:** Egemen (kurucu)  
**Canlı adres:** https://dersolab.com  
**Sosyal medya:** Instagram / TikTok — @dersolabegitim  

---

## 0. BU BELGE HAKKINDA — KAPSAM VE GÜVENİLİRLİK NOTU

Bu belge, bugüne kadarki oturumlarda **birlikte tasarladığımız, karara bağladığımız ve kodladığımız** her şeyin yapılandırılmış dökümüdür. Devir teslim belgesinin en tehlikeli hatası uydurma bilgi içermesidir; bu yüzden her başlıkta bilgi seviyesi şu üç etiketle ayrılmıştır:

| Etiket | Anlamı |
|---|---|
| ✅ **DOĞRULANMIŞ** | Birlikte yazdık/kararlaştırdık, uçtan uca test edildiği teyit edildi. |
| 🟡 **KARARLAŞTIRILDI (uygulama durumu teyit edilmeli)** | Tasarım kararı verildi, kod yazıldı; ancak son hâli benim kayıtlarımda kapanmadı. |
| ⚪ **KAYITLARIMDA YOK** | Sen sordun ya da başlıkta geçiyor, ama bende bu konuda hiçbir veri yok. Uydurmadım. |

> **Önemli uyarı — bu belgenin sınırı:** Kaynağım, geçmiş konuşmalarımız ve hafıza dosyalarımdır; **canlı kod tabanı değil**. Ağustos 2026'daki ana geliştirme oturumundan sonra depoda benim görmediğim değişiklikler yapılmış olabilir. Bu belgeyi kod tabanının yanına koyup, özellikle 5. bölümdeki "tamamlandı/yarım" listesini gerçek dosya yapısıyla bir kez karşılaştırmanı öneririm.

*(Not: Claude'un "Kayıtlarımda yok" dediği mobil ve diary başlıklarının canlı repodaki güncel durumu belgenin sonundaki **Bölüm 7: Canlı Kod Tabanı Güncellemesi** altında belgelenmiştir.)*

---

## 1. PROJE ÖZETİ VE VİZYON

### 1.1 DersoLab nedir?

✅ DersoLab, **LGS ve YKS'ye hazırlanan öğrenciler için çoklu eğitmen barındıran (marketplace tipi) bir online özel ders, kamp ve koçluk platformudur.** Tek bir öğretmenin kişisel sitesi değil; birden fazla eğitmenin profiliyle yer aldığı, öğrencinin/velinin eğitmen seçtiği, ödemenin platform üzerinden alınıp eğitmenlere dağıtıldığı bir pazar yeri modelidir.

Pazarlama dilindeki konumlandırma: **"Butik Online Akademi & Koçluk"**  
Marka sloganı: **"Planla, Çalış, Geliş!"**  

Bu "marketplace" niteliği kritik bir teknik/hukuki sonuç doğurur: ödeme altyapısında **pazaryeri (marketplace) çözümü** gerekir, basit sanal POS değil. İyzico başvurusundaki reddin kök sebebi de budur (bkz. §3.5 ve §6.4).

### 1.2 Hedef kitle

| Segment | Yaş | Kritik özellik | Ürüne yansıması |
|---|---|---|---|
| **LGS öğrencisi** | ~13-14 | Reşit değil, kredi kartı yok | Kendi başına kayıt olamaz; veli hesabı üzerinden yönetilir |
| **YKS öğrencisi** | 17-18 | Çoğu kendi hesabını yönetebilir, bazıları kendi kartıyla öder | Bağımsız kayıt olabilir |
| **Veli** | — | Asıl **ödeme yapan** ve **karar veren** kişi | Ayrı hesap rolü; çocuğun dersleri, kredisi ve ödevleri üzerinde görünürlük |
| **Eğitmen** | — | Arzın kaynağı; takvimini bağlayan taraf | Google Calendar entegrasyonu zorunlu |

İçerik/pazarlama tarafında hedef kitle bir miktar daha geniştir: LGS ve YKS'nin yanında **ALES, DGS, KPSS** kitlesine de içerik üretiliyor (bkz. Ek-B). Ürün tarafı ise şu an LGS/YKS odaklıdır (`grade_track` enum'ı yalnızca `lgs` | `yks` değerlerini alır).

### 1.3 Temel değer önerisi

Reklam ve site metinlerinde kullanılan, ürünün gerçek farklılaştırıcıları:

1. ✅ **Onaylı eğitmenlerle birebir canlı ders** — Google Meet altyapısı, rezervasyonda otomatik link üretimi, tek tıkla bağlanma.
2. 🟡 **Gemini AI destekli soru çözümü** — Öğrenci takıldığı soruyu fotoğraflayıp anında çözüm alıyor. *(Not: Bu özellik reklam videolarında ve site metinlerinde yer alıyor; ancak bu entegrasyonun kodunu birlikte yazmadık. Kod tabanında hangi durumda olduğu doğrulanmalı.)*
3. 🟡 **Hedef okul / net simülatörü** — "Hedefin için kaç net gerekiyor?" hesaplayıcısı. *(Aynı not: pazarlamada var, birlikte kodlamadık.)*
4. ✅ **Kişisel koçluk** — Haftalık program, deneme analizi, eksik konu takibi. Dijital tarafta `homework` + `notifications`, basılı tarafta PDF koçluk şablonları (Ek-B).
5. ✅ **Kredi tabanlı fiyatlama — aylık abonelik yok, kullanılmayan kredi yanmaz.** Bu, rakiplere karşı bilinçli bir konumlandırma kararıdır (bkz. §3.5).
6. ✅ **Ücretsiz tanışma dersi** — Pazarlama materyallerinde 20 dakikalık ücretsiz demo ders olarak geçiyor.

### 1.4 Desteklenen platformlar

| Platform | Durum | Not |
|---|---|---|
| **Web (responsive)** | ✅ Canlıda | Next.js App Router, Vercel'de yayında, dersolab.com |
| **Öğrenci paneli** | ✅ Web içinde | Ayrı uygulama değil; rol bazlı yönlendirme |
| **Veli paneli** | ✅ Web içinde | Çocuk seçici (child switcher) ile birden fazla çocuk desteklenir |
| **Eğitmen paneli** | ✅ Web içinde | Google Calendar bağlama, müsaitlik, ders listesi, ödev atama |
| **Admin paneli** | ✅ Web içinde | Kullanıcı/ödeme/sistem yönetimi |
| **Native mobil (iOS/Android)** | ✅ Repoda mevcut | `mobile/` altında Expo/React Native + root'ta Capacitor wrapper |

---

## 2. TEKNİK MİMARİ VE TEKNOLOJİ YIĞINI (TECH STACK)

### 2.1 Frontend

| Katman | Seçim | Karar notu |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | ✅ Kurulumda `@latest` ile kuruldu. React 19 ile geliyor. |
| Dil | **TypeScript** | ✅ Kural: her dosyada tipler eksiksiz tanımlanacak, `any` kaçamağı yok. |
| Stil | **Tailwind CSS** | ✅ |
| Bileşen kütüphanesi | **shadcn/ui — Radix tabanlı** | ✅ Kurulumda `-b radix` bayrağı zorunlu. |
| İkonlar | **Lucide** (`lucide-react`) | ✅ Yükleme durumları için `Loader2` + `animate-spin` deseni standart. |
| State management | **Ayrı kütüphane YOK** | ✅ React 19 + Server Components mimarisinde durum sunucuda; istemcide `useState` / `useTransition` yeterli görüldü. |
| Fontlar | **Press Start 2P** (arcade başlık), **Pixelify Sans**, **Poppins**, **Baloo 2** | 🟡 Pixel-art redesign kapsamında. |

### 2.2 Backend ve veritabanı

| Katman | Seçim |
|---|---|
| Veritabanı | **Supabase — PostgreSQL** |
| Kimlik doğrulama | **Supabase Auth** (e-posta/şifre + Google ile giriş) |
| Dosya depolama | **Supabase Storage** (ödev foto/video yüklemeleri, avatar, tercih listeleri) |
| ORM | **YOK — doğrudan Supabase client + ham SQL migration'lar.** |
| API deseni | **Server Actions** + **Route Handler**'lar + **Postgres RPC** |
| Ödeme | **Shopier** (canlı entegrasyon) + **Stripe** (test) |
| Takvim | **Google Calendar API** + otomatik **Google Meet** link üretimi |
| E-posta | **Resend** (`dersolab.com` doğrulanmış gönderim alanı) |
| Hosting | **Vercel** (Hobby plan), alan adı da Vercel üzerinden |

### 2.3 Entegrasyonlar

**Google Calendar / Meet**
- Scope: `https://www.googleapis.com/auth/calendar.events`
- Kütüphane: `googleapis` / `google-auth-library` (`OAuth2Client`)
- Redirect URI: `/api/google/callback`
- **Supabase Auth'un Google OAuth'undan tamamen ayrı, kendi yönettiğimiz bir akış.**
- Rezervasyonda hem `meetLink` hem `eventId` kaydediliyor (`bookings.google_event_id`).

**Shopier & Stripe**
- Canlı ödeme tahsilatı için Shopier entegre edildi (`0063_shopier_integration.sql`).
- Stripe test/checkout altyapısı webhook ile birlikte hazır tutuldu.

**Resend**
- Veli bildirim e-postaları (ders tamamlandı, ödev atandı vb.).
- `dersolab.com` DNS kayıtlarıyla doğrulanmış gönderim alanı olarak tanımlı.

---

## 3. KULLANICI ROLLERİ VE İŞ MANTIĞI (BUSINESS LOGIC)

### 3.1 Roller

`user_role` enum: `student` | `parent` | `instructor` | `admin`

- **LGS öğrencisi:** Bağımsız kayıt olamaz. Veli kendi hesabını açar, sonra çocuğunu ekler.
- **YKS öğrencisi:** Kendi e-posta/şifresiyle bağımsız kayıt olabilir.
- Register formundaki varsayılan rol **`parent`**'tır.

### 3.2 Rezervasyon, İptal ve 24 Saat Kuralı

| İptal eden | Zamanlama | Kredi |
|---|---|---|
| Eğitmen veya Admin | Fark etmez | **İade edilir** |
| Öğrenci veya Veli | Dersten **24 saatten fazla** önce | **İade edilir** |
| Öğrenci veya Veli | Dersten **24 saatten az** önce | **Yanar** (`credit_refunded = false`) |

Bu kural veritabanı trigger'ında (`refund_credit_on_cancel`) uygulanır.

---

## 4. VERİTABANI VE ŞEMA MİMARİSİ

- Tablolar: `users`, `students`, `instructors`, `guardians`, `bookings`, `homework`, `notifications`, `packages`, `package_purchases`, `instructor_calendar_credentials`, `student_study_logs`, `student_exam_results`, `coaching_*`, `payout_details`.
- RLS politikaları tüm tablolarda aktiftir.
- `instructor_calendar_credentials` tablosunda **hiçbir RLS policy yoktur** (yalnızca `service_role` sunucu erişimi için kilitlidir).

---

## 5. KRİTİK MİMARİ KARARLAR VE GOTCHAS

1. **Google Calendar OAuth Ayrı Tutulmalı**: Supabase Auth Google girişi sadece login sağlar, kalıcı offline `refresh_token` saklamaz. Eğitmen takvimi için `/api/google/callback` ayrı yönetilir.
2. **Kredi Yönetimi Trigger'da Olmalı**: `students.credit_balance` doğrudan koddan güncellenmez; rezervasyon anında trigger düşer, yetersizse exception fırlatır.
3. **RLS Politikalarını Asla Kapatmayın**: Güvenlik katmanı veritabanı seviyesindedir.
4. **Resend Sandbox Kısıtı**: DNS doğrulanmadan yalnızca hesap sahibine mail atar.
5. **Google OAuth Test Modu**: Canlıya geçmeden test kullanıcıları Console'a elle eklenmelidir.

---

## 6. CANLI KOD TABANI GÜNCELLEMESİ (EYLÜL 2026 — GERÇEK DURUM)

Claude'un raporunda "Kayıtlarımda yok" veya "31 migration ile sınırlı" dediği konular incelendiğinde repoda şu somut ilerlemelerin kaydedildiği tespit edilmiştir:

1. **Mobil Uygulama Katmanı (`mobile/` ve `android/`)**:
   - `mobile/student`, `mobile/instructor` ve `mobile/parent` olmak üzere **3 adet Expo Router + React Native uygulaması** mevcuttur.
   - Ayrıca web sürümünü doğrudan sarmalayan bir **Capacitor Android wrapper** (`capacitor.config.ts`, `android/`, `ANDROID_APP.md`) kurulmuştur.
2. **Günlük (Diary) Modülü**:
   - `0073_student_study_logs.sql` migration'ı ile veritabanı modeli oluşturulmuştur.
   - `mobile/student/src/app/dashboard/diary.tsx` dosyasında tam teşekküllü çalışma günlüğü (ders, konu, soru sayısı, süre, streak) kodlanmıştır.
3. **Toplam 107 Migration**:
   - Migration sayısı 31'de kalmamış, 107 dosyaya ulaşmıştır.
   - Shopier entegrasyonu (`0063_shopier_integration.sql`), deneme sınavı sonuçları (`0079_student_exam_results.sql`), uçtan uca dijital koçluk (`0084_coaching_core.sql`, `0085_coaching_plan.sql`, `0086_student_targets.sql`, `0087_student_intake.sql`), eğitmen hakediş izolasyonu (`0095_payout_details_isolation.sql`) eklenmiştir.
4. **Ödeme Altyapısı**:
   - Türkiye yerleşik satışlar için **Shopier** ödeme akışı sisteme dahil edilmiştir.
5. **Güvenlik ve Denetim Düzeltmeleri**:
   - 16 Ağustos 2026 bağımsız denetimi sonrası rol izolasyonları, yetkisiz erişim yamaları ve `20260830170000_butun_guvenlik_duzeltmeleri.sql` ile kapsamlı güvenlik sertleştirmesi yapılmıştır.
