/**
 * Standart MEB & ÖSYM (LGS / TYT / AYT) Konu Ağacı ve L.A.B. Simülasyon Köprüsü.
 *
 * Amaç:
 * 1) AI Soru Çözücü, Deneme Analizi ve Haftalık Koçluk Planı arasında ortak bir konu dili kurmak.
 * 2) Her branşı ve soru metnini doğrudan ilgili L.A.B. 3D/60FPS interaktif simülasyonuna ve
 *    eğitmen pazar yeri filtresine bağlamak.
 */

export interface LabRecommendation {
  branchId: 'matematik' | 'fizik' | 'kimya' | 'biyoloji' | 'turkce' | 'sosyal' | 'ingilizce'
  branchName: string
  moduleTitle: string
  description: string
  href: string
  badge: string
  marketplaceSubject: string
}

export const CURRICULUM_TOPICS: Record<string, string[]> = {
  'TYT Matematik': [
    'Temel Kavramlar & Sayı Basamakları',
    'Bölme, Bölünebilme & EBOB-EKOK',
    'Rasyonel Sayılar & Ondalık Kesirler',
    'Birinci Dereceden Denklemler ve Eşitsizlikler',
    'Mutlak Değer',
    'Üslü ve Köklü İfadeler',
    'Çarpanlara Ayırma & Özdeşlikler',
    'Oran-Orantı ve Problemler (Sayı, Kesir, Yaş, Hız, Yüzde)',
    'Kümeler ve Kartezyen Çarpım',
    'Fonksiyonlar ve Grafikleri',
    'Polinomlar ve İkinci Dereceden Denklemler',
    'Permütasyon, Kombinasyon, Binom ve Olasılık',
  ],
  'AYT Matematik': [
    'İkinci Dereceden Denklemler, Eşitsizlikler ve Parabol',
    'Fonksiyonlarda Uygulamalar ve Dönüşümler',
    'Logaritma ve Üstel Fonksiyonlar',
    'Diziler (Aritmetik ve Geometrik)',
    'Trigonometri ve Birim Çember',
    'Limit ve Süreklilik',
    'Türev Alma Kuralları ve Geometrik Yorumu (Teğet/Ekstremum)',
    'İntegral ve Alan Hesabı',
  ],
  'TYT Geometri': [
    'Doğruda ve Üçgende Açılar',
    'Dik Üçgen, Pisagor ve Özel Üçgenler',
    'Üçgende Alan ve Benzerlik',
    'Çokgenler ve Dörtgenler',
    'Çember ve Daire',
    'Katı Cisimler (Prizma, Silindir, Koni, Küre)',
  ],
  'AYT Geometri': [
    'Noktanın ve Doğrunun Analitik İncelenmesi (Eğim)',
    'Çemberin Analitik İncelenmesi',
    'Dönüşüm Geometrisi',
    'Uzay Geometrisi ve Katı Cisimler',
  ],
  'LGS Matematik': [
    'Çarpanlar ve Katlar (EBOB - EKOK)',
    'Üslü İfadeler',
    'Kareköklü İfadeler',
    'Veri Analizi',
    'Basit Olayların Olma Olasılığı',
    'Cebirsel İfadeler ve Özdeşlikler',
    'Doğrusal Denklemler ve Koordinat Sistemi (Eğim)',
    'Eşitsizlikler',
    'Üçgenler, Pisagor Bağıntısı ve Eşlik-Benzerlik',
    'Dönüşüm Geometrisi ve Geometrik Cisimler',
  ],
  'TYT Fizik': [
    'Fizik Bilimine Giriş ve Madde-Özkütle',
    'Hareket ve Newton\'un Hareket Yasaları',
    'İş, Güç ve Enerji Korunumu',
    'Isı, Sıcaklık ve Genleşme',
    'Basınç ve Sıvıların Kaldırma Kuvveti (Arşimet)',
    'Elektrostatik ve Elektrik Devreleri (Ohm Yasası)',
    'Optik (Aynalar, Kırılma ve Mercekler)',
    'Dalgalar (Yay, Su, Ses ve Deprem)',
  ],
  'AYT Fizik': [
    'Vektörler ve Bağıl Hareket',
    'Newton\'un Hareket Yasaları ve Dinamik',
    'Bir ve İki Boyutta Sabit İvmeli Hareket (Eğik Atış)',
    'İtme ve Çizgisel Momentum',
    'Tork, Denge ve Kütle Merkezi',
    'Elektrik Alan, Potansiyel ve Manyetizma',
    'Alternatif Akım ve Transformatörler',
    'Çembersel Hareket ve Basit Harmonik Hareket',
    'Dalga Mekaniği ve Modern Fizik',
  ],
  'TYT Kimya': [
    'Atom ve Periyodik Sistem (Bohr Atom Modeli & Katmanlar)',
    'Kimyasal Türler Arası Etkileşimler',
    'Maddenin Halleri',
    'Kimyanın Temel Kanunları ve Mol Kavramı',
    'Kimyasal Hesaplamalar',
    'Karışımlar ve Derişim',
    'Asitler, Bazlar ve Tuzlar (pH & Titrasyon)',
  ],
  'AYT Kimya': [
    'Modern Atom Teorisi',
    'Gazlar ve İdeal Gaz Yasası (P.V = n.R.T)',
    'Sıvı Çözeltiler ve Çözünürlük (Molarite)',
    'Kimyasal Tepkimelerde Enerji (Entalpi)',
    'Kimyasal Tepkimelerde Hız',
    'Kimyasal Denge ve Le Chatelier İlkesi',
    'Asit-Baz Dengesi ve Titrasyon',
    'Kimya ve Elektrik (Elektrokimya)',
    'Organik Kimya',
  ],
  'TYT Biyoloji': [
    'Canlıların Ortak Özellikleri ve Temel Bileşenler',
    'Hücre ve Organeller',
    'Hücre Bölünmeleri (Mitoz ve Mayoz)',
    'Kalıtım ve Punnett Karesi Genetiği',
    'Ekosistem Ekolojisi ve Güncel Çevre Sorunları',
  ],
  'AYT Biyoloji': [
    'İnsan Fizyolojisi (Sinir, Endokrin, Dolaşım, Solunum, Boşaltım)',
    'Komünite ve Popülasyon Ekolojisi',
    'Nükleik Asitler (DNA, RNA) ve Protein Sentezi',
    'Canlılık ve Enerji (Fotosentez, Kemosentez, Hücresel Solunum)',
    'Bitki Biyolojisi',
  ],
  'LGS Fen Bilimleri': [
    'Mevsimler ve İklim (Eksen Eğikliği)',
    'DNA ve Genetik Kod (Kalıtım / Punnett Karesi)',
    'Basınç (Katı, Sıvı, Gaz)',
    'Madde ve Endüstri (Periyodik Tablo, Asitler ve Bazlar)',
    'Basit Makineler',
    'Enerji Dönüşümleri ve Çevre Bilimi (Fotosentez & Solunum)',
    'Elektrik Yükleri ve Elektrik Enerjisi',
  ],
  'TYT Türkçe': [
    'Sözcükte ve Cümlede Anlam',
    'Paragrafta Anlam, Ana Düşünce ve Hızlı Okuma',
    'Ses Bilgisi (Ünlü/Ünsüz Olayları)',
    'Yazım Kuralları ve Noktalama İşaretleri',
    'Sözcükte Yapı ve Sözcük Türleri',
    'Cümlenin Ögeleri ve Cümle Türleri',
    'Anlatım Bozuklukları',
  ],
  'LGS Türkçe': [
    'Sözcükte ve Cümlede Anlam',
    'Paragrafta Anlam ve Görsel/Tablo Yorumlama',
    'Sözel Mantık ve Muhakeme',
    'Fiilimsiler ve Cümlenin Ögeleri',
    'Cümle Türleri ve Çatı',
    'Yazım Kuralları ve Noktalama İşaretleri',
  ],
  'AYT Türk Dili ve Edebiyatı': [
    'Şiir Bilgisi ve Edebi Sanatlar',
    'İslamiyet Öncesi ve Halk Edebiyatı',
    'Divan Edebiyatı',
    'Tanzimat, Servetifünun ve Fecr-i Ati Edebiyatı',
    'Milli Edebiyat ve Cumhuriyet Dönemi',
  ],
  'TYT Sosyal Bilimler': [
    'Tarih ve Zaman / İlk ve Orta Çağlarda Türk Dünyası',
    'Kurtuluş Savaşı ve Antlaşmalar Kronolojisi',
    'Doğa ve İnsan / Dünya\'nın Şekli ve Mevsimler',
    'İklim Bilgisi ve Türkiye Fiziki Haritası',
    'Nüfus Piramitleri ve Yerleşme',
    'Doğal Afetler ve Türkiye Fay Hatları',
  ],
  'İngilizce': [
    'Kelime Bilgisi (Vocabulary & Phrasal Verbs)',
    'Zamanlar ve Dilbilgisi (Tenses, Modals, Clauses)',
    'Diyalog Tamamlama ve Durumsal İfadeler',
    'Paragraf Okuma ve Çeviri',
  ],
}

export function getTopicsForSubject(subject: string): string[] {
  if (CURRICULUM_TOPICS[subject]) return CURRICULUM_TOPICS[subject]
  const normalized = subject.toLowerCase()
  if (normalized.includes('mat')) return CURRICULUM_TOPICS['TYT Matematik']
  if (normalized.includes('geometri')) return CURRICULUM_TOPICS['TYT Geometri']
  if (normalized.includes('fizik')) return CURRICULUM_TOPICS['TYT Fizik']
  if (normalized.includes('kimya')) return CURRICULUM_TOPICS['TYT Kimya']
  if (normalized.includes('biyoloji')) return CURRICULUM_TOPICS['TYT Biyoloji']
  if (normalized.includes('fen')) return CURRICULUM_TOPICS['LGS Fen Bilimleri']
  if (normalized.includes('türkçe') || normalized.includes('paragraf')) return CURRICULUM_TOPICS['TYT Türkçe']
  if (normalized.includes('edebiyat')) return CURRICULUM_TOPICS['AYT Türk Dili ve Edebiyatı']
  if (normalized.includes('tarih') || normalized.includes('coğrafya') || normalized.includes('sosyal') || normalized.includes('inkılap')) {
    return CURRICULUM_TOPICS['TYT Sosyal Bilimler']
  }
  if (normalized.includes('ingilizce') || normalized.includes('dil')) return CURRICULUM_TOPICS['İngilizce']
  return []
}

/**
 * Ders adına veya soru/analiz metnine göre en uygun L.A.B. simülasyonunu döndürür.
 */
export function getRecommendedLabForSubjectOrText(
  subject: string,
  contextText: string = '',
): LabRecommendation {
  const combined = `${subject} ${contextText}`.toLowerCase()

  // 1. Kimya & Fen (Kimya alt konuları)
  if (combined.includes('kimya') || combined.includes('titrasyon') || combined.includes('asit') || combined.includes('baz') || combined.includes('ph ') || combined.includes('gaz') || combined.includes('periyodik') || combined.includes('molarite') || combined.includes('mol ')) {
    if (combined.includes('gaz') || combined.includes('piston') || combined.includes('basınç') && combined.includes('mol')) {
      return {
        branchId: 'kimya',
        branchName: 'KimyaLab',
        moduleTitle: 'İdeal Gaz Yasaları & Pistonlu Kap (P·V = n·R·T)',
        description: 'Hareketli piston, sıcaklık ve basınç manometresiyle gaz yasalarını canlı simüle et.',
        href: '/lab/kimya',
        badge: 'AYT Kimya Simülasyonu',
        marketplaceSubject: 'Kimya',
      }
    }
    if (combined.includes('asit') || combined.includes('baz') || combined.includes('ph') || combined.includes('titrasyon')) {
      return {
        branchId: 'kimya',
        branchName: 'KimyaLab',
        moduleTitle: 'Sanal Asit-Baz Titrasyon Deneyi & pH Cetveli',
        description: 'Büret musluğunu açarak nötralleşme dönüm noktasını ve pH değişimini canlı gözlemle.',
        href: '/lab/kimya',
        badge: 'LGS & YKS Deneyi',
        marketplaceSubject: 'Kimya',
      }
    }
    return {
      branchId: 'kimya',
      branchName: 'KimyaLab',
      moduleTitle: '3D Atom Modeli, Periyodik Tablo & Denge Laboratuvarı',
      description: '3D Bohr atom katmanlarını, kimyasal dengeyi ve mol hesaplamalarını etkileşimli keşfet.',
      href: '/lab/kimya',
      badge: '3D Kimya Atölyesi',
      marketplaceSubject: 'Kimya',
    }
  }

  // 2. Fizik
  if (combined.includes('fizik') || combined.includes('mercek') || combined.includes('optik') || combined.includes('ivme') || combined.includes('kuvvet') || combined.includes('newton') || combined.includes('atış') || combined.includes('devre') || combined.includes('ohm') || combined.includes('kaldırma kuvveti')) {
    if (combined.includes('mercek') || combined.includes('optik') || combined.includes('odak') || combined.includes('kırılma')) {
      return {
        branchId: 'fizik',
        branchName: 'FizikLab',
        moduleTitle: 'Mercekler & Işın İzleme (Optik Simülatörü)',
        description: 'İnce ve kalın kenarlı merceklerde cismi kaydırarak gerçek/sanal görüntüyü anında izle.',
        href: '/lab/fizik',
        badge: 'Optik Işın İzleme',
        marketplaceSubject: 'Fizik',
      }
    }
    if (combined.includes('atış') || combined.includes('menzil') || combined.includes('balistik')) {
      return {
        branchId: 'fizik',
        branchName: 'FizikLab',
        moduleTitle: 'Eğik Atış & Balistik Simülatörü (60 FPS)',
        description: 'Fırlatma açısı ve hızı değiştirerek maksimum yükseklik ve menzili canlı test et.',
        href: '/lab/fizik',
        badge: 'AYT Mekanik',
        marketplaceSubject: 'Fizik',
      }
    }
    return {
      branchId: 'fizik',
      branchName: 'FizikLab',
      moduleTitle: 'Newton Dinamiği, Elektrik Devreleri & Kaldırma Kuvveti',
      description: 'Serbest cisim diyagramlarını, Ohm yasası devrelerini ve Arşimet prensibini simüle et.',
      href: '/lab/fizik',
      badge: '60 FPS Fizik Motoru',
      marketplaceSubject: 'Fizik',
    }
  }

  // 3. Biyoloji & Fen
  if (combined.includes('biyoloji') || combined.includes('kalıtım') || combined.includes('genetik') || combined.includes('punnett') || combined.includes('hücre') || combined.includes('mitoz') || combined.includes('mayoz') || combined.includes('fotosentez') || combined.includes('dna') || combined.includes('fen')) {
    if (combined.includes('kalıtım') || combined.includes('genetik') || combined.includes('punnett') || combined.includes('çaprazlama')) {
      return {
        branchId: 'biyoloji',
        branchName: 'BiyolojiLab',
        moduleTitle: 'Punnett Karesi & Mendel Kalıtım Simülatörü',
        description: 'Genotip ve fenotip olasılıklarını çaprazlama matrisinde interaktif olarak hesapla.',
        href: '/lab/biyoloji',
        badge: 'LGS & TYT Genetik',
        marketplaceSubject: 'Biyoloji',
      }
    }
    return {
      branchId: 'biyoloji',
      branchName: 'BiyolojiLab',
      moduleTitle: 'Hücre Bölünmesi, Fotosentez & Protein Sentezi Atölyesi',
      description: 'Mitoz/Mayoz evrelerini, Engelmann spektrumunu ve ribozomda protein sentezini deneyimle.',
      href: '/lab/biyoloji',
      badge: 'İnteraktif Biyoloji',
      marketplaceSubject: 'Biyoloji',
    }
  }

  // 4. Türkçe & Edebiyat
  if (combined.includes('türkçe') || combined.includes('edebiyat') || combined.includes('paragraf') || combined.includes('yazım') || combined.includes('ses olay')) {
    return {
      branchId: 'turkce',
      branchName: 'TürkçeLab',
      moduleTitle: 'Biyonik Paragraf Hız Antrenörü & Ses Olayları Dedektifi',
      description: 'Paragraf okuma hızını 2 katına çıkar ve cümledeki ses/yazım kurallarını büyüteçle yakala.',
      href: '/lab/turkce',
      badge: 'Hızlı Okuma & Dilbilgisi',
      marketplaceSubject: 'Türkçe',
    }
  }

  // 5. Sosyal, Tarih, Coğrafya, İnkılap
  if (combined.includes('tarih') || combined.includes('coğrafya') || combined.includes('sosyal') || combined.includes('inkılap') || combined.includes('harita') || combined.includes('iklim') || combined.includes('nüfus') || combined.includes('mevsim')) {
    return {
      branchId: 'sosyal',
      branchName: 'SosyalLab',
      moduleTitle: 'Türkiye İklim Atlası, Mevsimler Yörüngesi & Tarih Şeridi',
      description: '81 il katmanlı fiziki harita, 23°27\' eksen eğikliği ve antlaşmalar kronolojisini incele.',
      href: '/lab/sosyal',
      badge: 'İnteraktif Atlas',
      marketplaceSubject: 'Coğrafya',
    }
  }

  // 6. İngilizce / YDT
  if (combined.includes('ingilizce') || combined.includes('ydt') || combined.includes('dil')) {
    return {
      branchId: 'ingilizce',
      branchName: 'İngilizceLab',
      moduleTitle: 'MEB Ünite Atölyesi, Telaffuz & Durumsal Diyaloglar',
      description: '5-12. sınıf MEB üniteleri, sesli telaffuz analizi ve gerçek hayat senaryolarıyla pratik yap.',
      href: '/lab/ingilizce',
      badge: 'Web Speech Audio',
      marketplaceSubject: 'İngilizce',
    }
  }

  // 7. Varsayılan: Matematik & Geometri
  if (combined.includes('türev') || combined.includes('teğet') || combined.includes('ekstremum')) {
    return {
      branchId: 'matematik',
      branchName: 'MatematikLab',
      moduleTitle: 'Türev & Teğet Doğrusu Simülatörü (m = f\'(x))',
      description: 'Eğri üzerinde noktayı kaydırarak anlık teğet eğimini ve yerel ekstremum zirvelerini gör.',
      href: '/lab/matematik',
      badge: 'AYT Matematik',
      marketplaceSubject: 'Matematik',
    }
  }
  if (combined.includes('parabol') || combined.includes('ikinci dereceden') || combined.includes('diskriminant')) {
    return {
      branchId: 'matematik',
      branchName: 'MatematikLab',
      moduleTitle: 'İkinci Dereceden Parabol & Diskriminant Simülatörü',
      description: 'a, b, c katsayılarını değiştirerek Tepe Noktası T(r,k) ve köklerin değişimini canlı izle.',
      href: '/lab/matematik',
      badge: '10. Sınıf & AYT',
      marketplaceSubject: 'Matematik',
    }
  }
  if (combined.includes('trigonometri') || combined.includes('sinüs') || combined.includes('kosinüs') || combined.includes('birim çember')) {
    return {
      branchId: 'matematik',
      branchName: 'MatematikLab',
      moduleTitle: 'Trigonometrik Birim Çember (360° Canlı Dalga)',
      description: 'Açıyı döndürerek sin, cos, tan, cot eksen izdüşümlerini ve dalga grafiğini kavra.',
      href: '/lab/matematik',
      badge: '11. Sınıf & AYT',
      marketplaceSubject: 'Matematik',
    }
  }
  if (combined.includes('ebob') || combined.includes('ekok') || combined.includes('çarpan') || combined.includes('pisagor') || combined.includes('eğim')) {
    return {
      branchId: 'matematik',
      branchName: 'MatematikLab',
      moduleTitle: 'LGS Matematik: EBOB-EKOK, Pisagor & Koordinat Eğimi',
      description: 'Asal çarpan ağacı, dik üçgen kare alanları ispatı ve m = Δy/Δx eğim simülasyonu.',
      href: '/lab/matematik',
      badge: '8. Sınıf LGS',
      marketplaceSubject: 'Matematik',
    }
  }

  return {
    branchId: 'matematik',
    branchName: 'MatematikLab',
    moduleTitle: 'Fonksiyonlar, Denklem Terazisi, Parabol & Türev Atölyesi',
    description: 'Cebirsel denklemleri ve fonksiyon grafiklerini ezberlemeden görsel simülasyonla keşfet.',
    href: '/lab/matematik',
    badge: 'İnteraktif Matematik',
    marketplaceSubject: 'Matematik',
  }
}
