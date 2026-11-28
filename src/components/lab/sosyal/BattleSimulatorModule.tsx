'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  Swords,
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Compass,
  Shield,
  Flag,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from 'lucide-react'
import { playClickSound, playChemicalReaction, playSuccessFanfare, playErrorBuzz } from '@/lib/soundFx'

const SVG_FONT = "var(--font-sans), 'Inter', system-ui, -apple-system, sans-serif"

type BattleLevel = 'ortaokul' | 'lise'

interface UnitMarker {
  id: string
  label: string
  subLabel: string
  side: 'ally' | 'enemy'
  x: number
  y: number
  angle?: number
  strength: number
}

interface ManeuverVector {
  fromX: number
  fromY: number
  toX: number
  toY: number
  side: 'ally' | 'enemy'
  dashed?: boolean
}

interface BattlePhase {
  title: string
  timestamp: string
  commandNote: string
  allySuperiority: number
  initiativeLabel: string
  quote: string
  units: UnitMarker[]
  vectors: ManeuverVector[]
  pulsePoint?: { x: number; y: number; label: string }
}

interface HistoricalBattle {
  id: 'malazgirt' | 'istanbul' | 'preveze' | 'canakkale' | 'sakarya' | 'buyuk_taarruz'
  title: string
  year: string
  level: BattleLevel | 'all'
  gradeBadge: string
  mebCode: string
  commanders: string
  tacticTag: string
  summary: string
  militaryResult: string
  politicalResult: string
  examTrap: string
  phases: [BattlePhase, BattlePhase, BattlePhase, BattlePhase]
  quiz: {
    question: string
    options: [string, string, string]
    correctIndex: number
    explanation: string
  }
}

const BATTLES: HistoricalBattle[] = [
  {
    id: 'malazgirt',
    title: '1071 Malazgirt Meydan Muharebesi',
    year: '26 Ağustos 1071',
    level: 'all',
    gradeBadge: '6. & 10. Sınıf',
    mebCode: 'SB.6.2.2 / TAR.10.1.3',
    commanders: 'Sultan Alparslan vs Romen Diyojen',
    tacticTag: 'Turan (Hilal / Kurt Kapanı) Taktiği',
    summary:
      'Büyük Selçuklu ordusu sayıca üstün Bizans kuvvetlerini Sahte Ricat (sahte geri çekilme) ile pusuya çekip hilal çemberine aldı.',
    militaryResult: 'Bizans ordusu imha edildi; İmparator Romen Diyojen ilk kez bir Müslüman Türk hükümdara esir düştü.',
    politicalResult:
      'Anadolu’nun kapıları kesin olarak Türklere açıldı (Yurt Açan Savaş); I. Beylikler (Saltuklu, Mengücek, Danişment, Artuklu, Çaka) kuruldu ve Haçlı Seferleri tetiklendi.',
    examTrap:
      'Bizans safındaki Peçenek ve Uz Türkleri, karşılarında soydaşları Oğuzları/Selçukluları görünce saf değiştirip Selçuklu tarafına geçti!',
    phases: [
      {
        title: '1. Karşılıklı Diziliş & Keşif',
        timestamp: '26 Ağustos Sabah',
        commandNote: 'Selçuklu atlı okçuları Rahva/Malazgirt ovasında yay şeklinde, pusu birlikleri doğu-batı tepelerinde mevzilendi.',
        allySuperiority: 42,
        initiativeLabel: 'Dengeli Mevzi',
        quote: '“Ya muzaffer olur gayeme ulaşır, ya da şehit olarak cennete giderim!”',
        units: [
          { id: 'merkez', label: 'Alparslan Merkez', subLabel: 'Hassa Süvarisi', side: 'ally', x: 300, y: 270, strength: 80 },
          { id: 'sol', label: 'Sol Kanat Pusu', subLabel: 'Tepede Gizli', side: 'ally', x: 145, y: 205, strength: 75 },
          { id: 'sag', label: 'Sağ Kanat Pusu', subLabel: 'Tepede Gizli', side: 'ally', x: 455, y: 205, strength: 75 },
          { id: 'bizans', label: 'Bizans Merkez', subLabel: 'Ağır Zırhlı', side: 'enemy', x: 300, y: 120, strength: 100 },
          { id: 'pecenek', label: 'Peçenek & Uzlar', subLabel: 'Türk Paralı Asker', side: 'enemy', x: 430, y: 112, strength: 60 },
        ],
        vectors: [
          { fromX: 300, fromY: 250, toX: 300, toY: 165, side: 'ally', dashed: true },
          { fromX: 300, fromY: 145, toX: 300, toY: 200, side: 'enemy' },
        ],
        pulsePoint: { x: 300, y: 195, label: 'Okçu Tacizi' },
      },
      {
        title: '2. Sahte Ricat (Geri Çekilme)',
        timestamp: 'Öğle Saatleri',
        commandNote: 'Merkez kuvvetler düzenli biçimde güneye çekilerek ağır zırhlı Bizans piyadesini derin vadi içine çekti.',
        allySuperiority: 58,
        initiativeLabel: 'Tuzak Kuruldu',
        quote: '“Bizans ağırlığını merkeze topladı — geri çekilin, tuzağa çekin!”',
        units: [
          { id: 'merkez', label: 'Selçuklu Merkez', subLabel: 'Sahte Çekilme', side: 'ally', x: 300, y: 330, strength: 78 },
          { id: 'sol', label: 'Sol Kanat Kapanı', subLabel: 'İleri Sarkma', side: 'ally', x: 165, y: 225, strength: 85 },
          { id: 'sag', label: 'Sağ Kanat Kapanı', subLabel: 'İleri Sarkma', side: 'ally', x: 435, y: 225, strength: 85 },
          { id: 'bizans', label: 'Bizans Ana Ordu', subLabel: 'Tuzağa İlerliyor', side: 'enemy', x: 300, y: 215, strength: 90 },
          { id: 'pecenek', label: 'Peçenek & Uzlar', subLabel: 'Soydaş Kararı', side: 'ally', x: 430, y: 145, strength: 65 },
        ],
        vectors: [
          { fromX: 300, fromY: 265, toX: 300, toY: 315, side: 'ally', dashed: true },
          { fromX: 300, fromY: 135, toX: 300, toY: 200, side: 'enemy' },
          { fromX: 430, fromY: 120, toX: 430, toY: 190, side: 'ally' },
        ],
        pulsePoint: { x: 430, y: 155, label: 'Peçenekler Saf Değiştirdi!' },
      },
      {
        title: '3. Hilal Çemberi Kapanıyor',
        timestamp: 'İkindi Vakti',
        commandNote: 'Peçenek ve Uz birliklerinin Selçukluya katılmasıyla kanatlar arkadan birleşti; Turan Çemberi tamamen kapandı.',
        allySuperiority: 88,
        initiativeLabel: 'Tam Kuşatma',
        quote: '“Kanatlar birleşsin! Hilal kapandı — kaçış yolu yok!”',
        units: [
          { id: 'merkez', label: 'Alparslan Taarruz', subLabel: 'Karşı Hücum', side: 'ally', x: 300, y: 295, strength: 92 },
          { id: 'sol', label: 'Batı Kıskacı', subLabel: 'Arkaya Sarktı', side: 'ally', x: 205, y: 175, strength: 90 },
          { id: 'sag', label: 'Doğu Kıskacı', subLabel: 'Peçenek Desteği', side: 'ally', x: 395, y: 175, strength: 92 },
          { id: 'bizans', label: 'Bizans Çemberde', subLabel: 'Çözülme Başladı', side: 'enemy', x: 300, y: 210, strength: 40 },
        ],
        vectors: [
          { fromX: 165, fromY: 230, toX: 245, toY: 175, side: 'ally' },
          { fromX: 435, fromY: 230, toX: 355, toY: 175, side: 'ally' },
          { fromX: 300, fromY: 310, toX: 300, toY: 245, side: 'ally' },
        ],
        pulsePoint: { x: 300, y: 210, label: 'Kurt Kapanı!' },
      },
      {
        title: '4. Anadolu’nun Kapısı Açıldı',
        timestamp: '26 Ağustos Akşamı',
        commandNote: 'Romen Diyojen esir alındı. Sultan Alparslan fethedilen toprağın fethedenin hakkı (Kılıç Hakkı) olacağını ilan etti.',
        allySuperiority: 100,
        initiativeLabel: 'Kesin Zafer',
        quote: '“Anadolu artık Türk yurdudur; gidin ve fethedin!”',
        units: [
          { id: 'merkez', label: 'Selçuklu Zaferi', subLabel: 'Diyojen Esir', side: 'ally', x: 300, y: 215, strength: 100 },
          { id: 'sol', label: 'Kılıç Hakkı Beyleri', subLabel: 'Anadolu’ya Yayılış', side: 'ally', x: 160, y: 155, strength: 95 },
          { id: 'sag', label: 'I. Beylikler', subLabel: 'Saltuk · Danişment', side: 'ally', x: 440, y: 155, strength: 95 },
        ],
        vectors: [
          { fromX: 290, fromY: 205, toX: 185, toY: 165, side: 'ally', dashed: true },
          { fromX: 310, fromY: 205, toX: 415, toY: 165, side: 'ally', dashed: true },
        ],
        pulsePoint: { x: 300, y: 215, label: 'Yurt Açan Zafer (1071)' },
      },
    ],
    quiz: {
      question: 'Malazgirt Meydan Muharebesi’nde Turan Taktiği’nin başarıya ulaşmasını hızlandıran ve Bizans ordusunun dengesini bozan kritik olay nedir?',
      options: [
        'Osmanlı donanmasının Karadeniz’den çıkarma yapması',
        'Bizans safındaki Peçenek ve Uz Türklerinin Selçuklu tarafına geçmesi',
        'Topkapı Şahi toplarının surları yıkması',
      ],
      correctIndex: 1,
      explanation: 'Malazgirt’te Bizans ordusundaki Türk asıllı Peçenek ve Uzlar, Sultan Alparslan safına geçerek savaşın seyrini değiştirmiştir.',
    },
  },
  {
    id: 'istanbul',
    title: '1453 İstanbul’un Fethi Kuşatması',
    year: '6 Nisan – 29 Mayıs 1453',
    level: 'all',
    gradeBadge: '7. & 10. Sınıf',
    mebCode: 'SB.7.2.1 / TAR.10.5.1',
    commanders: 'Fatih Sultan Mehmet vs XI. Konstantinos',
    tacticTag: 'Şahi Topları & Gemilerin Karadan Yürütülmesi',
    summary:
      'Haliç’in dev zincirle kapatılması üzerine Fatih, 72 kadırgayı Tophane’den Kasımpaşa’ya kızaklar üstünde karadan indirerek surları iki cepheden vurdu.',
    militaryResult: '1058 yıllık Bizans İmparatorluğu yıkıldı; Şahi topları Avrupa’da derebeylik (feodalite) surlarını çökertti.',
    politicalResult:
      'Orta Çağ kapandı, Yeni Çağ açıldı; Osmanlı’nın Anadolu-Rumeli toprak bütünlüğü sağlandı, İpek Yolu Osmanlı denetimine girdi (Coğrafi Keşifleri hızlandırdı).',
    examTrap:
      'İstanbul’dan İtalya’ya giden Bizanslı bilginler, Avrupa’da RÖNESANS’ın başlamasını hızlandırmıştır!',
    phases: [
      {
        title: '1. Kuşatma & Boğaz Keseni (Rumeli Hisarı)',
        timestamp: '6 Nisan 1453',
        commandNote: 'Rumeli Hisarı ile Karadeniz yardımları kesildi; Edirne’de döktürülen Şahi topları kara surlarını dövmeye başladı.',
        allySuperiority: 52,
        initiativeLabel: 'Çift Abluka',
        quote: '“Ya ben İstanbul’u alırım, ya İstanbul beni!”',
        units: [
          { id: 'rumeli', label: 'Rumeli Hisarı', subLabel: 'Boğaz Kilidi', side: 'ally', x: 430, y: 110, strength: 88 },
          { id: 'sahi', label: 'Şahi Top Bataryası', subLabel: 'Kara Surlarına Ateş', side: 'ally', x: 135, y: 230, strength: 92 },
          { id: 'donanma', label: 'Osmanlı Donanması', subLabel: 'Beşiktaş Açıkları', side: 'ally', x: 425, y: 230, strength: 80 },
          { id: 'zincir', label: 'Haliç Zinciri', subLabel: 'Girişi Kapatıyor', side: 'enemy', x: 350, y: 210, strength: 85 },
          { id: 'bizans', label: 'Bizans Kara Surları', subLabel: 'Üç Katlı Sur', side: 'enemy', x: 210, y: 235, strength: 90 },
        ],
        vectors: [
          { fromX: 165, fromY: 230, toX: 200, toY: 235, side: 'ally' },
          { fromX: 410, fromY: 225, toX: 365, toY: 215, side: 'ally', dashed: true },
        ],
        pulsePoint: { x: 205, y: 235, label: 'Şahi Bombardımanı' },
      },
      {
        title: '2. 72 Geminin Karadan Yürütülmesi',
        timestamp: '21–22 Nisan Gecesi',
        commandNote: 'Yağlı kızaklar üzerinde öküzler ve leventlerce çekilen 72 gemi Tophane yokuşundan aşılarak Kasımpaşa’dan Haliç’e indirildi.',
        allySuperiority: 78,
        initiativeLabel: 'Stratejik Şok',
        quote: '“Karadan gemi yürür mü demedik, imkânsızı başardık!”',
        units: [
          { id: 'sahi', label: 'Kara Ordusu', subLabel: 'Topkapı–Edirnekapı', side: 'ally', x: 140, y: 245, strength: 90 },
          { id: 'kizak', label: '72 Gemi Kızak Hattı', subLabel: 'Tophane → Kasımpaşa', side: 'ally', x: 385, y: 155, strength: 96 },
          { id: 'halic', label: 'Haliç İçi Donanma', subLabel: 'Zincir Aşıldı!', side: 'ally', x: 295, y: 185, strength: 90 },
          { id: 'bizans', label: 'Bizans Savunması', subLabel: 'Kuvvet Bölündü', side: 'enemy', x: 225, y: 245, strength: 62 },
        ],
        vectors: [
          { fromX: 425, fromY: 195, toX: 385, toY: 145, side: 'ally' },
          { fromX: 385, fromY: 145, toX: 315, toY: 180, side: 'ally' },
        ],
        pulsePoint: { x: 350, y: 162, label: '72 Gemi Haliç’te!' },
      },
      {
        title: '3. Haliç & Kara Surları Çift Ateşi',
        timestamp: 'Mayıs Sonu',
        commandNote: 'Bizans birlikleri en zayıf Haliç surlarını savunmak için bölününce kara surlarında gedikler büyüdü.',
        allySuperiority: 90,
        initiativeLabel: 'Surda Gedik',
        quote: '“Haliç surlarına da yüklenin! Savunma hattı yarıldı!”',
        units: [
          { id: 'sahi', label: 'Yeniçeri Hücumu', subLabel: 'Topkapı Gediği', side: 'ally', x: 175, y: 235, strength: 96 },
          { id: 'halic', label: 'Haliç Yüzer Kule', subLabel: 'Kuzey Sur Ateşi', side: 'ally', x: 270, y: 205, strength: 92 },
          { id: 'bizans', label: 'Çöken Savunma', subLabel: 'Bölünmüş Birlik', side: 'enemy', x: 235, y: 245, strength: 35 },
        ],
        vectors: [
          { fromX: 185, fromY: 235, toX: 220, toY: 240, side: 'ally' },
          { fromX: 270, fromY: 215, toX: 250, toY: 235, side: 'ally' },
        ],
        pulsePoint: { x: 220, y: 240, label: 'Topkapı Gediği!' },
      },
      {
        title: '4. 29 Mayıs Fethi & Yeni Çağ',
        timestamp: '29 Mayıs 1453',
        commandNote: 'Ulubatlı Hasan surlara sancağı dikti; Ayasofya ve başkent İstanbul ile Osmanlı İmparatorluğu yükselme dönemine geçti.',
        allySuperiority: 100,
        initiativeLabel: 'Yeni Çağ Başladı',
        quote: '“Artık başkentimiz Konstantiniyye’dir; toprak bütünlüğü tamam!”',
        units: [
          { id: 'fetih', label: 'Başkent İstanbul', subLabel: 'Anadolu–Rumeli Birleşti', side: 'ally', x: 245, y: 235, strength: 100 },
          { id: 'donanma', label: 'Karadeniz & Boğazlar', subLabel: 'İpek Yolu Kontrolü', side: 'ally', x: 405, y: 170, strength: 95 },
        ],
        vectors: [
          { fromX: 165, fromY: 235, toX: 230, toY: 235, side: 'ally' },
          { fromX: 300, fromY: 235, toX: 390, toY: 180, side: 'ally', dashed: true },
        ],
        pulsePoint: { x: 245, y: 235, label: '29 Mayıs 1453 Fetih!' },
      },
    ],
    quiz: {
      question: '1453 İstanbul Fethi’nin Avrupa tarihinde FEODALİTE (Derebeylik) sistemini yıkmasında etkili olan gelişme hangisidir?',
      options: [
        'Haliç girişine zincir gerilmesi',
        'Dev Şahi toplarının yıkılmaz sanılan büyük surları delebileceğinin görülmesi',
        'Venediklilerle ticaret antlaşması yapılması',
      ],
      correctIndex: 1,
      explanation: 'Büyük topların en kalın şato ve surları yıkabildiğinin kanıtlanması kralların derebeylikleri yıkıp merkezi mutlakiyeti kurmasını sağlamıştır.',
    },
  },
  {
    id: 'preveze',
    title: '1538 Preveze Deniz Muharebesi',
    year: '28 Eylül 1538',
    level: 'all',
    gradeBadge: '7. & 10. Sınıf',
    mebCode: 'TAR.10.5.3',
    commanders: 'Barbaros Hayrettin Paşa vs Andrea Doria',
    tacticTag: 'Denizde Hilal Dizilişi & Çevik Kadırga Manevrası',
    summary:
      'Haçlıların devasa ama hantal kalyonlarına karşı Barbaros’un kürekli hızlı kadırgaları Arta Körfezi’nden çıkıp hilal düzeniyle Haçlı filosunu yardı.',
    militaryResult: 'Andrea Doria komutasındaki Haçlı Donanması ağır yenilgi aldı.',
    politicalResult: 'Akdeniz kesin olarak Türk Gölü haline geldi (28 Eylül günümüzde Deniz Kuvvetleri Günü olarak kutlanır).',
    examTrap:
      'Kadırgalar rüzgâra bağımlı değildi (kürekliydi); rüzgâr kesilince devasa Haçlı kalyonları denizde hareketsiz kalıp hedef oldu!',
    phases: [
      {
        title: '1. Arta Körfezi Ablukası',
        timestamp: '27 Eylül 1538',
        commandNote: '600 gemilik Haçlı Donanması Barbaros’un 122 kadırgalık filosunu Preveze açıklarında ablukaya almak istedi.',
        allySuperiority: 40,
        initiativeLabel: 'Sayıca Dezavantaj',
        quote: '“Sayıya değil, manevra hızına ve denizcilik ustalığına güvenin!”',
        units: [
          { id: 'merkez', label: 'Barbaros Filosu', subLabel: '122 Çevik Kadırga', side: 'ally', x: 390, y: 215, strength: 85 },
          { id: 'turgut', label: 'Turgut Reis İhtiyat', subLabel: 'Körfez Çıkışı', side: 'ally', x: 430, y: 270, strength: 80 },
          { id: 'hacli', label: 'Andrea Doria', subLabel: 'Ağır Kalyon Filosu', side: 'enemy', x: 175, y: 205, strength: 100 },
        ],
        vectors: [{ fromX: 205, fromY: 205, toX: 330, toY: 215, side: 'enemy' }],
        pulsePoint: { x: 390, y: 215, label: 'Körfez Çıkışı Hazır' },
      },
      {
        title: '2. Denizde Hilal Dizilişi',
        timestamp: '28 Eylül Sabah',
        commandNote: 'Barbaros açık denize çıkıp Hilal formasyonu kurdu; Salih Reis ve Turgut Reis kanatlardan sarktı.',
        allySuperiority: 68,
        initiativeLabel: 'Hilal Açıldı',
        quote: '“Kürekler fora! Hilal şekline geçip büyük kalyonları kuşatın!”',
        units: [
          { id: 'merkez', label: 'Barbaros Merkez', subLabel: 'Hızlı Kadırgalar', side: 'ally', x: 310, y: 210, strength: 90 },
          { id: 'kuzey', label: 'Seydi Ali (Kuzey)', subLabel: 'Üst Kanat', side: 'ally', x: 270, y: 125, strength: 85 },
          { id: 'turgut', label: 'Turgut Reis (Güney)', subLabel: 'Alt Kanat', side: 'ally', x: 270, y: 295, strength: 92 },
          { id: 'hacli', label: 'Haçlı Kalyonları', subLabel: 'Rüzgâr Kesildi!', side: 'enemy', x: 165, y: 210, strength: 75 },
        ],
        vectors: [
          { fromX: 390, fromY: 210, toX: 325, toY: 210, side: 'ally' },
          { fromX: 310, fromY: 185, toX: 270, toY: 135, side: 'ally' },
          { fromX: 310, fromY: 235, toX: 270, toY: 285, side: 'ally' },
        ],
        pulsePoint: { x: 185, y: 210, label: 'Rüzgâr Kesildi · Kalyonlar Durdu' },
      },
      {
        title: '3. Alçak Güverte Topçu Vuruşu',
        timestamp: 'Öğle Vakti',
        commandNote: 'Hızlı kadırgalar hareketsiz kalan dev kalyonların su kesimine top ateşleyip hatlarını yardı.',
        allySuperiority: 90,
        initiativeLabel: 'Haçlı Hattı Yarıldı',
        quote: '“Su hizasından ateş! Kalyonların dümenini kırın!”',
        units: [
          { id: 'merkez', label: 'Osmanlı Yarışı', subLabel: 'Kalyon Kuşatması', side: 'ally', x: 220, y: 210, strength: 96 },
          { id: 'turgut', label: 'Turgut Reis Kıskacı', subLabel: 'Artçı Yakalama', side: 'ally', x: 185, y: 275, strength: 95 },
          { id: 'hacli', label: 'Bozulan Filo', subLabel: 'Kayıplar Artıyor', side: 'enemy', x: 130, y: 190, strength: 35 },
        ],
        vectors: [
          { fromX: 290, fromY: 210, toX: 230, toY: 210, side: 'ally' },
          { fromX: 260, fromY: 285, toX: 195, toY: 255, side: 'ally' },
        ],
        pulsePoint: { x: 195, y: 210, label: 'Su Hizası Top Ateşi!' },
      },
      {
        title: '4. Akdeniz Türk Gölü Oldu',
        timestamp: '28 Eylül Akşam',
        commandNote: 'Andrea Doria karanlıktan yararlanarak çekildi; Akdeniz hakimiyeti tamamen Osmanlı Devleti’ne geçti.',
        allySuperiority: 100,
        initiativeLabel: 'Akdeniz Hakimiyeti',
        quote: '“Denizlere hâkim olan cihana hâkim olur!”',
        units: [
          { id: 'merkez', label: 'Akdeniz Türk Gölü', subLabel: '28 Eylül Zaferi', side: 'ally', x: 255, y: 210, strength: 100 },
          { id: 'kuzey', label: 'Cezayir–Trablus Hattı', subLabel: 'Kesintisiz Egemenlik', side: 'ally', x: 135, y: 145, strength: 95 },
        ],
        vectors: [{ fromX: 150, fromY: 195, toX: 70, toY: 140, side: 'enemy', dashed: true }],
        pulsePoint: { x: 255, y: 210, label: 'Deniz Kuvvetleri Günü!' },
      },
    ],
    quiz: {
      question: 'Preveze Deniz Muharebesi’nde Osmanlı donanmasının kendisinden katbekat büyük Haçlı kalyonlarını yenmesini sağlayan teknik üstünlük nedir?',
      options: [
        'Buharlı zırhlı gemilerin kullanılması',
        'Kürekli çevik kadırgaların rüzgâra bağlı kalmadan hilal düzeninde manevra yapması',
        'Denizaltı torpidolarının atılması',
      ],
      correctIndex: 1,
      explanation: 'Rüzgâr kesilince Haçlıların hantal yelkenli kalyonları durmuş, Osmanlı’nın kürekli kadırgaları etraflarını sarmıştır.',
    },
  },
  {
    id: 'canakkale',
    title: '1915 Çanakkale Deniz & Kara Savaşı',
    year: '18 Mart – Aralık 1915',
    level: 'all',
    gradeBadge: '8. & 11-12. Sınıf',
    mebCode: 'İTA.8.1.3 / TAR.12.1.3',
    commanders: 'Mustafa Kemal, Cevat Çobanlı, Seyit Onbaşı',
    tacticTag: 'Nusret Paralel Mayınları & Conkbayırı Karşı Hücumu',
    summary:
      'İtilaf donanması 18 Mart’ta Nusret mayınlarına çarpıp boğazı geçemedi; 25 Nisan kara çıkarmasında ise Mustafa Kemal’in 19. Tümeni Conkbayırı’nı tutarak işgali durdurdu.',
    militaryResult: '“Çanakkale Geçilmez!” — Dünyanın en güçlü donanma ve kara birlikleri geri püskürtüldü.',
    politicalResult:
      'I. Dünya Savaşı en az 2 yıl uzadı; müttefik yardımı alamayan Çarlık Rusyası yıkıldı (1917 Bolşevik İhtilali), Bulgaristan İttifak grubuna katıldı; Mustafa Kemal tüm yurtta tanındı.',
    examTrap:
      'LGS ve YKS’de "Rusya’ya yardım gitmemesi → Çarlık Rusyası’nın yıkılması" Çanakkale Cephesi’nin küresel siyasi sonucudur!',
    phases: [
      {
        title: '1. Nusret Mayın Gemisi Harekâtı',
        timestamp: '7–8 Mart Gecesi',
        commandNote: 'Nusret, düşmanın beklemediği şekilde Karanlık Liman (Erenköy) sahiline paralel 26 mayın döşedi.',
        allySuperiority: 60,
        initiativeLabel: 'Gizli Pusu',
        quote: '“Gemiler manevra yaparken sahile paralel hatta dönecek — mayınları oraya bırakın!”',
        units: [
          { id: 'nusret', label: 'Nusret Mayın Gemisi', subLabel: '26 Paralel Mayın', side: 'ally', x: 265, y: 245, strength: 88 },
          { id: 'mecidiye', label: 'Mecidiye Tabyası', subLabel: 'Seyit Onbaşı (276 kg)', side: 'ally', x: 215, y: 170, strength: 90 },
          { id: 'itilaf', label: 'İtilaf Zırhlıları', subLabel: 'Bouvet · Ocean', side: 'enemy', x: 140, y: 290, strength: 95 },
        ],
        vectors: [{ fromX: 245, fromY: 270, toX: 280, toY: 225, side: 'ally', dashed: true }],
        pulsePoint: { x: 265, y: 245, label: 'Erenköy Paralel Hattı' },
      },
      {
        title: '2. 18 Mart Deniz Zaferi',
        timestamp: '18 Mart 1915',
        commandNote: 'Ocean zırhlısı Seyit Onbaşı’nın 276 kg’lık mermisiyle dümen vurgunu yedi; Bouvet, Irresistible ve Ocean battı.',
        allySuperiority: 82,
        initiativeLabel: 'Boğaz Geçilemedi',
        quote: '“Ocean’ın dümeni vuruldu! İtilaf donanması boğazdan çekiliyor!”',
        units: [
          { id: 'mecidiye', label: 'Seyit Onbaşı Topu', subLabel: 'Ocean Zırhlısını Vurdu', side: 'ally', x: 215, y: 170, strength: 96 },
          { id: 'kilit', label: 'Kilitbahir–Çimenlik', subLabel: 'Boğaz Kilidi Sağlam', side: 'ally', x: 245, y: 145, strength: 94 },
          { id: 'itilaf', label: 'Çekilen Zırhlılar', subLabel: '3 Batık, 4 Hasarlı', side: 'enemy', x: 165, y: 275, strength: 42 },
        ],
        vectors: [
          { fromX: 215, fromY: 175, toX: 195, toY: 245, side: 'ally' },
          { fromX: 175, fromY: 265, toX: 110, toY: 315, side: 'enemy', dashed: true },
        ],
        pulsePoint: { x: 195, y: 245, label: '18 Mart Deniz Zaferi!' },
      },
      {
        title: '3. 25 Nisan Arıburnu & Conkbayırı',
        timestamp: '25 Nisan 1915',
        commandNote: 'Karadan çıkan ANZAC birliklerini 19. Tümen Komutanı Yarbay Mustafa Kemal inisiyatif alıp süngü tak emriyle durdurdu.',
        allySuperiority: 90,
        initiativeLabel: 'Sırtlar Tutuldu',
        quote: '“Ben size taarruz emretmiyorum, ölmeyi emrediyorum!”',
        units: [
          { id: 'mkemal', label: '19. Tümen (M. Kemal)', subLabel: '57. Alay Conkbayırı', side: 'ally', x: 160, y: 120, strength: 98 },
          { id: 'kilit', label: 'Seddülbahir Savunma', subLabel: 'Kıyı Kilitlendi', side: 'ally', x: 155, y: 235, strength: 90 },
          { id: 'anzac', label: 'Arıburnu Çıkarması', subLabel: 'Kıyıya Sıkıştı', side: 'enemy', x: 95, y: 135, strength: 60 },
        ],
        vectors: [{ fromX: 190, fromY: 115, toX: 125, toY: 130, side: 'ally' }],
        pulsePoint: { x: 140, y: 125, label: '57. Alay Süngü Hücumu!' },
      },
      {
        title: '4. Anafartalar Zaferi & Tahliye',
        timestamp: 'Ağustos – Aralık 1915',
        commandNote: 'Anafartalar Grup Komutanı Mustafa Kemal son büyük İngiliz çıkarmasını kırdı; İtilaf kuvvetleri Gelibolu’yu boşalttı.',
        allySuperiority: 100,
        initiativeLabel: 'Çanakkale Geçilmez',
        quote: '“Çanakkale geçilmedi! Savaş uzadı, milletin lideri doğdu!”',
        units: [
          { id: 'anafarta', label: 'Anafartalar Kahramanı', subLabel: 'Mustafa Kemal Paşa', side: 'ally', x: 165, y: 115, strength: 100 },
          { id: 'bogaz', label: 'Boğaz Savunması', subLabel: 'Tam Başarı', side: 'ally', x: 245, y: 185, strength: 100 },
        ],
        vectors: [{ fromX: 110, fromY: 145, toX: 55, toY: 180, side: 'enemy', dashed: true }],
        pulsePoint: { x: 165, y: 115, label: 'Anafartalar Zaferi!' },
      },
    ],
    quiz: {
      question: 'Çanakkale Zaferi’nin I. Dünya Savaşı’nın genel gidişatına etkilerinden biri aşağıdakilerden hangisidir?',
      options: [
        'ABD’nin Almanya yanında savaşa girmesi',
        'Savaşın en az 2 yıl uzaması ve yardım alamayan Çarlık Rusyası’nda ihtilal çıkması',
        'Osmanlı’nın bütün Arap yarımadasını geri alması',
      ],
      correctIndex: 1,
      explanation: 'İtilaf Devletleri boğazdan Rusya’ya silah/erzak gönderemediği için Rusya’da 1917 Ekim Devrimi yaşandı ve savaştan çekildi.',
    },
  },
  {
    id: 'sakarya',
    title: '1921 Sakarya Meydan Muharebesi',
    year: '23 Ağustos – 13 Eylül 1921',
    level: 'all',
    gradeBadge: '8. & 12. Sınıf',
    mebCode: 'İTA.8.3.3 / TAR.12.2.2',
    commanders: 'Başkomutan Mustafa Kemal Paşa',
    tacticTag: 'Sath-ı Müdafaa (100 km Derinlikli Alan Savunması)',
    summary:
      'Kütahya–Eskişehir sonrası Sakarya Nehri doğusuna çekilen Türk ordusu, dünyanın en uzun meydan savaşlarından birinde (22 gün 22 gece) Yunan taarruzunu kırdı.',
    militaryResult: '1683 II. Viyana Kuşatması’ndan beri süren geri çekilme son buldu; Yunan ordusu savunmaya çekildi.',
    politicalResult:
      'Mustafa Kemal’e "Gazi" ve "Mareşal" rütbesi verildi; Kafkas Cumhuriyetleriyle KARS ANTLAŞMASI (Doğu sınırı kesin), Fransa ile ANKARA ANTLAŞMASI (Güney cephesi kapandı) imzalandı.',
    examTrap:
      'İstiklal Marşı I. İnönü’den sonra, "Gazi ve Mareşal" unvanı ise SAKARYA Zaferi’nden sonra verilmiştir — LGS’de sakın karıştırma!',
    phases: [
      {
        title: '1. Sakarya Doğusu Tekâlif-i Millîye Hattı',
        timestamp: '23 Ağustos 1921',
        commandNote: 'Kütahya–Eskişehir sonrası ordu zayiatsız Sakarya Nehri doğusuna çekildi; Tekâlif-i Millîye ile halkın desteği cepheye aktı.',
        allySuperiority: 46,
        initiativeLabel: 'Savunma Mevzi',
        quote: '“Asıl güç cephe gerisindeki Tekâlif-i Millîye dayanışmasıdır!”',
        units: [
          { id: 'ankara', label: 'Ankara Karargâhı', subLabel: 'Tekâlif-i Millîye İkmal', side: 'ally', x: 430, y: 185, strength: 82 },
          { id: 'polatli', label: 'Sakarya Savunma Hattı', subLabel: 'Polatlı – Haymana', side: 'ally', x: 265, y: 195, strength: 78 },
          { id: 'mangal', label: 'Mangal Dağı (Güney)', subLabel: 'İlk Temas Bölgesi', side: 'ally', x: 270, y: 280, strength: 72 },
          { id: 'yunan', label: 'Yunan Taarruz Ordusu', subLabel: 'Ankara Hedefi', side: 'enemy', x: 115, y: 215, strength: 95 },
        ],
        vectors: [
          { fromX: 145, fromY: 215, toX: 235, toY: 250, side: 'enemy' },
          { fromX: 405, fromY: 185, toX: 295, toY: 195, side: 'ally', dashed: true },
        ],
        pulsePoint: { x: 245, y: 265, label: 'İlk Taarruz Mangal Dağı!' },
      },
      {
        title: '2. "Hatt-ı Müdafaa Yoktur, Sath-ı Müdafaa!"',
        timestamp: '26 Ağustos 1921',
        commandNote: 'Çizgi savunması yarılınca Başkomutan Mustafa Kemal tüm vatan sathını savunma alanı ilan etti; dağılan birlik hemen arkada yeni mevzi kurdu.',
        allySuperiority: 66,
        initiativeLabel: 'Esnek Alan Savunması',
        quote: '“Hatt-ı müdafaa yoktur, sath-ı müdafaa vardır. O satıh bütün vatandır!”',
        units: [
          { id: 'caldagi', label: 'Çaldağı & Haymana', subLabel: 'Bölgesel Direnç', side: 'ally', x: 300, y: 205, strength: 88 },
          { id: 'mangal', label: 'Süvari Kolordusu', subLabel: 'Yunan İkmalini Vurdu', side: 'ally', x: 245, y: 290, strength: 84 },
          { id: 'yunan', label: 'Yıpranan Yunan Gücü', subLabel: 'İkmal Hattı Koptu', side: 'enemy', x: 215, y: 215, strength: 72 },
        ],
        vectors: [
          { fromX: 245, fromY: 285, toX: 165, toY: 245, side: 'ally' },
          { fromX: 300, fromY: 205, toX: 255, toY: 215, side: 'ally', dashed: true },
        ],
        pulsePoint: { x: 285, y: 205, label: 'Çaldağı Muharebeleri' },
      },
      {
        title: '3. 10 Eylül Türk Karşı Taarruzu',
        timestamp: '10 Eylül 1921',
        commandNote: 'Taarruz gücü tükenen Yunan kuvvetlerine kuzey kanattan (Polatlı/Duatepe) Başkomutan komutasındaki karşı taarruz başlatıldı.',
        allySuperiority: 88,
        initiativeLabel: 'Taarruz İnisiyatifi',
        quote: '“Duatepe alındı! Şimdi düşmanı Sakarya’nın batısına atma vaktidir!”',
        units: [
          { id: 'polatli', label: 'Duatepe Taarruzu', subLabel: 'Kuzey Kanat Yarma', side: 'ally', x: 240, y: 150, strength: 95 },
          { id: 'caldagi', label: 'Ana Karşı Hücum', subLabel: 'Doğu Cephe Bütünleşti', side: 'ally', x: 290, y: 215, strength: 92 },
          { id: 'yunan', label: 'Çözülen Yunan Hattı', subLabel: 'Batıya Çekilme', side: 'enemy', x: 160, y: 215, strength: 42 },
        ],
        vectors: [
          { fromX: 235, fromY: 155, toX: 175, toY: 195, side: 'ally' },
          { fromX: 270, fromY: 215, toX: 195, toY: 215, side: 'ally' },
        ],
        pulsePoint: { x: 225, y: 160, label: 'Duatepe Geri Alındı!' },
      },
      {
        title: '4. 13 Eylül: 238 Yıllık Çekiliş Bitti',
        timestamp: '13 Eylül 1921',
        commandNote: 'Sakarya doğusunda tek Yunan askeri kalmadı. Kars Antlaşması, 1921 Ankara Antlaşması ve Mareşallik unvanı kazanıldı.',
        allySuperiority: 100,
        initiativeLabel: 'Dönüm Noktası',
        quote: '“1683 Viyana’dan beri süren geri çekilme Sakarya’da bitti!”',
        units: [
          { id: 'zafer', label: 'Gazi & Mareşal', subLabel: 'Kars + Ankara Ant.', side: 'ally', x: 280, y: 195, strength: 100 },
          { id: 'kars', label: 'Doğu & Güney Güven', subLabel: 'Birlikler Batı’ya', side: 'ally', x: 405, y: 230, strength: 96 },
        ],
        vectors: [{ fromX: 145, fromY: 215, toX: 70, toY: 215, side: 'enemy', dashed: true }],
        pulsePoint: { x: 280, y: 195, label: '22 Günlük Destan Zaferi!' },
      },
    ],
    quiz: {
      question: 'Sakarya Meydan Muharebesi sonrasında Fransa ile imzalanarak Güney Cephesi’ni kapatan ve TBMM’yi tanıyan ilk İtilaf Devleti antlaşması hangisidir?',
      options: ['1920 Gümrü Antlaşması', '1921 Ankara Antlaşması', '1921 Moskova Antlaşması'],
      correctIndex: 1,
      explanation: 'Sakarya Zaferi’nden hemen sonra 20 Ekim 1921’de Fransa ile imzalanan Ankara Antlaşması ile Hatay hariç Suriye sınırı çizilmiş ve Güney Cephesi kapanmıştır.',
    },
  },
  {
    id: 'buyuk_taarruz',
    title: '1922 Büyük Taarruz & Başkomutanlık',
    year: '26 Ağustos – 9 Eylül 1922',
    level: 'all',
    gradeBadge: '8. & 12. Sınıf',
    mebCode: 'İTA.8.3.4 / TAR.12.2.3',
    commanders: 'Başkomutan Mareşal Gazi Mustafa Kemal Paşa',
    tacticTag: 'Kocatepe Sürpriz Yarma & Fahrettin Altay Süvari Sarkması',
    summary:
      'Türk ordusu düşmanın beklemediği Afyon güneyinden (Kocatepe) gizli gece yürüyüşüyle baskın taarruz başlatıp 5 günde Yunan ordusunu Dumlupınar’da çembere aldı.',
    militaryResult: '30 Ağustos Başkomutanlık Meydan Muharebesi ile Yunan işgal ordusu tamamen imha edildi; 9 Eylül’de İzmir kurtarıldı.',
    politicalResult:
      'Kurtuluş Savaşı’nın askeri safhası bitti → Mudanya Ateşkesi ile Doğu Trakya, İstanbul ve Boğazlar savaşmadan geri alındı → Lozan Barış Konferansı açıldı.',
    examTrap:
      'Ordunun hazırlık için 1 yıl beklemesinin sebebi taarruz eğitimi, tekâlif-i millîye sevkiyatı ve "yarım hazırlıkla taarruz hiç taarruz etmemekten kötüdür" ilkesidir!',
    phases: [
      {
        title: '1. Gizli Gece Yürüyüşü (Şuhut → Kocatepe)',
        timestamp: '25 Ağustos Gecesi',
        commandNote: 'Düşman taarruzu Eskişehir–Bursa yönünde beklerken Türk birlikleri geceleri yürüyerek Afyon güneyine yığıldı.',
        allySuperiority: 62,
        initiativeLabel: 'Tam Gizlilik',
        quote: '“Taarruza en sağlam değil, düşmanın en şaşıracağı Kocatepe güneyinden başlanır!”',
        units: [
          { id: 'kocatepe', label: '1. Ordu (Kocatepe)', subLabel: 'Gizli Baskın Yığınağı', side: 'ally', x: 350, y: 270, strength: 92 },
          { id: 'suvari', label: '5. Süvari Kolordusu', subLabel: 'Ahır Dağları Geçidi', side: 'ally', x: 280, y: 295, strength: 90 },
          { id: 'yunan', label: 'Yunan Afyon Hattı', subLabel: 'Tel Örgü & Beton', side: 'enemy', x: 295, y: 195, strength: 95 },
        ],
        vectors: [{ fromX: 410, fromY: 280, toX: 355, toY: 270, side: 'ally', dashed: true }],
        pulsePoint: { x: 350, y: 270, label: '05:30 Topçu Ateşi Hazır' },
      },
      {
        title: '2. 26 Ağustos Yarma & Süvari Sarkması',
        timestamp: '26–27 Ağustos',
        commandNote: '05:30’da topçu ateşi başladı; Fahrettin Altay’ın süvarileri Ahır Dağları patikasından sızarak Yunan ikmal demiryolunu kesti.',
        allySuperiority: 84,
        initiativeLabel: 'Hat Yarıldı',
        quote: '“Afyon mevzileri yarıldı! Süvarilerimiz düşmanın arka demiryoluna indi!”',
        units: [
          { id: 'kocatepe', label: '1. Ordu Yarma', subLabel: 'Tınaztepe–Kalecik', side: 'ally', x: 315, y: 210, strength: 95 },
          { id: 'suvari', label: '5. Süvari (Arkada)', subLabel: 'İzmir Demiryolunu Kesti', side: 'ally', x: 195, y: 240, strength: 94 },
          { id: 'yunan', label: 'Çekilen Yunan Gücü', subLabel: 'Dumlupınar’a Sıkıştı', side: 'enemy', x: 245, y: 190, strength: 58 },
        ],
        vectors: [
          { fromX: 350, fromY: 265, toX: 310, toY: 215, side: 'ally' },
          { fromX: 280, fromY: 290, toX: 205, toY: 240, side: 'ally' },
        ],
        pulsePoint: { x: 195, y: 240, label: 'Arka Hat Kesildi!' },
      },
      {
        title: '3. 30 Ağustos Dumlupınar İmha Çemberi',
        timestamp: '30 Ağustos 1922',
        commandNote: 'Mustafa Kemal’in bizzat yönettiği Başkomutanlık Meydan Muharebesi’nde Yunan ordusunun ana kısmı çembere alınıp yok edildi.',
        allySuperiority: 97,
        initiativeLabel: '30 Ağustos Zaferi',
        quote: '“Ordular, ilk hedefiniz Akdeniz’dir! İleri!”',
        units: [
          { id: 'kusatma', label: 'Kuzey–Güney Kıskacı', subLabel: 'Dumlupınar Çemberi', side: 'ally', x: 235, y: 185, strength: 98 },
          { id: 'suvari', label: 'Takip Kolordusu', subLabel: 'İzmir’e Hızla', side: 'ally', x: 155, y: 200, strength: 96 },
          { id: 'yunan', label: 'İmha Edilen Birlik', subLabel: 'Trikopis Esir', side: 'enemy', x: 215, y: 195, strength: 18 },
        ],
        vectors: [
          { fromX: 295, fromY: 165, toX: 240, toY: 190, side: 'ally' },
          { fromX: 215, fromY: 240, toX: 215, toY: 205, side: 'ally' },
        ],
        pulsePoint: { x: 225, y: 192, label: '30 Ağustos Başkomutanlık Zaferi!' },
      },
      {
        title: '4. 9 Eylül İzmir’in Kurtuluşu & Mudanya',
        timestamp: '9 Eylül – 11 Ekim 1922',
        commandNote: '400 km 10 günde aşılarak İzmir kurtarıldı; ardından Mudanya Ateşkesi ile İstanbul ve Trakya savaşmadan alındı.',
        allySuperiority: 100,
        initiativeLabel: 'Tam Kurtuluş',
        quote: '“Millî Mücadele’nin askerî safhası bitti — sıra diplomaside (Lozan)!”',
        units: [
          { id: 'izmir', label: '9 Eylül İzmir', subLabel: 'Bayrak Hükümet Konağında', side: 'ally', x: 85, y: 215, strength: 100 },
          { id: 'mudanya', label: 'Mudanya Ateşkesi', subLabel: 'Boğazlar & Trakya Kurtuldu', side: 'ally', x: 245, y: 135, strength: 100 },
        ],
        vectors: [{ fromX: 220, fromY: 195, toX: 98, toY: 215, side: 'ally' }],
        pulsePoint: { x: 85, y: 215, label: '9 Eylül 1922 İzmir Kurtuldu!' },
      },
    ],
    quiz: {
      question: 'Büyük Taarruz sonrasında imzalanan Mudanya Ateşkes Antlaşması ile TÜRK ORDUSU SAVAŞMADAN hangi bölgeleri geri almıştır?',
      options: [
        'Musul ve Kerkük’ü',
        'İstanbul, Boğazlar ve Doğu Trakya’yı',
        'Batı Trakya ve Adaları',
      ],
      correctIndex: 1,
      explanation: 'Mudanya Ateşkesi (11 Ekim 1922) ile Doğu Trakya (Meriç’e kadar), İstanbul ve Boğazlar tek kurşun atılmadan TBMM yönetimine devredilmiştir.',
    },
  },
]

export function BattleSimulatorModule() {
  const [gradeFilter, setGradeFilter] = useState<'all' | 'ortaokul' | 'lise'>('all')
  const [battleId, setBattleId] = useState<HistoricalBattle['id']>('malazgirt')
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [quizChoice, setQuizChoice] = useState<number | null>(null)

  const battle = useMemo(() => BATTLES.find((b) => b.id === battleId) || BATTLES[0], [battleId])
  const phase = battle.phases[phaseIdx] || battle.phases[0]

  useEffect(() => {
    if (!isPlaying) return
    if (phaseIdx >= battle.phases.length - 1) {
      setIsPlaying(false)
      playSuccessFanfare()
      return
    }
    const timer = setTimeout(() => {
      playChemicalReaction()
      setPhaseIdx((p) => Math.min(battle.phases.length - 1, p + 1))
    }, 2400)
    return () => clearTimeout(timer)
  }, [isPlaying, phaseIdx, battle.phases.length])

  const selectBattle = (b: HistoricalBattle) => {
    playClickSound()
    setIsPlaying(false)
    setBattleId(b.id)
    setPhaseIdx(0)
    setQuizChoice(null)
  }

  const visibleBattles = BATTLES.filter((b) => {
    if (gradeFilter === 'all') return true
    if (gradeFilter === 'ortaokul') return b.gradeBadge.includes('6') || b.gradeBadge.includes('7') || b.gradeBadge.includes('8')
    return b.gradeBadge.includes('10') || b.gradeBadge.includes('11') || b.gradeBadge.includes('12')
  })

  return (
    <div className="space-y-6">
      {/* Header & Battle Picker */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900/95 border border-rose-500/25 p-5 sm:p-6 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-300 border border-rose-500/35 inline-flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5" />
                6 Büyük MEB Savaşı · Animasyonlu Taktik Harita
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold">
                {battle.mebCode} · {battle.gradeBadge}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tarih Savaş &amp; Meydan Muharebesi Simülatörü
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Ders kitaplarında okuduğun taktikleri (Turan Hilali, Karadan Yürüyen Gemiler, Sath-ı Müdafaa, Kocatepe Yarma) harita üstünde adım adım canlandır.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 self-start">
            {[
              { id: 'all' as const, label: 'Tümü (6)' },
              { id: 'ortaokul' as const, label: 'Ortaokul / LGS' },
              { id: 'lise' as const, label: 'Lise / YKS' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  playClickSound()
                  setGradeFilter(f.id)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                  gradeFilter === f.id ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Battle Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {visibleBattles.map((b) => {
            const active = b.id === battle.id
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => selectBattle(b)}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 border cursor-pointer transition-all ${
                  active
                    ? 'bg-rose-950/70 border-rose-400 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Compass className={`w-3.5 h-3.5 ${active ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{b.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              playClickSound()
              if (isPlaying) {
                setIsPlaying(false)
                return
              }
              if (phaseIdx >= battle.phases.length - 1) setPhaseIdx(0)
              setIsPlaying(true)
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlaying ? 'bg-rose-500 text-white' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isPlaying ? 'Duraklat' : 'Harekâtı Oynat'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              setIsPlaying(false)
              setPhaseIdx((p) => Math.max(0, p - 1))
            }}
            disabled={phaseIdx === 0}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-200 disabled:opacity-35 cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Önceki Safha</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playChemicalReaction()
              setIsPlaying(false)
              setPhaseIdx((p) => {
                const nxt = Math.min(battle.phases.length - 1, p + 1)
                if (nxt === battle.phases.length - 1) playSuccessFanfare()
                return nxt
              })
            }}
            disabled={phaseIdx >= battle.phases.length - 1}
            className="px-3.5 py-2 rounded-xl text-xs font-black inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 disabled:opacity-35 cursor-pointer"
          >
            <span>Sonraki Safha</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-300 font-bold">
            {battle.commanders}
          </span>
          <button
            type="button"
            onClick={() => {
              playClickSound()
              setIsPlaying(false)
              setPhaseIdx(0)
            }}
            className="px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Main Tactical Grid: 8 Cols Map + 4 Cols Phase Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-4">
          <div className="rounded-2xl bg-[#070C16] border border-slate-800 overflow-hidden shadow-2xl">
            {/* Tactical Telemetry Strip */}
            <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="min-w-0 font-bold text-slate-200">
                <span className="text-amber-400 font-black mr-2">Safha {phaseIdx + 1}/4:</span>
                <span>{phase.title}</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-emerald-500/35 text-emerald-300">
                  Taktik Üstünlük: %{phase.allySuperiority}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-sky-500/35 text-sky-300">
                  {phase.initiativeLabel}
                </span>
              </div>
            </div>

            {/* Interactive SVG Tactical Map */}
            <svg viewBox="0 0 560 360" className="w-full h-auto select-none bg-[#0b1322]" role="img" aria-label={`${battle.title} Taktik Savaş Haritası`}>
              <defs>
                <pattern id="battleMapGrid" width="32" height="32" patternUnits="userSpaceOnUse">
                  <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
                </pattern>
                <marker id="arrowAlly" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
                </marker>
                <marker id="arrowEnemy" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#fb7185" />
                </marker>
              </defs>

              <rect x="0" y="0" width="560" height="360" fill="#0b1322" />
              <rect x="0" y="0" width="560" height="360" fill="url(#battleMapGrid)" />

              {/* Terrain Features by Battle */}
              {battle.id === 'malazgirt' && (
                <g>
                  <path d="M 40 215 Q 95 160 175 185 Q 130 250 75 245 Z" fill="rgba(51,65,85,0.45)" stroke="#475569" strokeWidth="1.2" />
                  <path d="M 385 185 Q 465 155 520 215 Q 465 250 395 235 Z" fill="rgba(51,65,85,0.45)" stroke="#475569" strokeWidth="1.2" />
                  <text x="95" y="268" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                    Batı Pusu Tepeleri
                  </text>
                  <text x="465" y="268" textAnchor="middle" fill="#64748b" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                    Doğu Pusu Tepeleri
                  </text>
                  <text x="295" y="344" textAnchor="middle" fill="#94a3b8" fontSize="9.5" fontWeight="600" fontFamily={SVG_FONT}>
                    MALAZGİRT / RAHVA OVASI (1071)
                  </text>
                </g>
              )}

              {battle.id === 'istanbul' && (
                <g>
                  {/* Bosphorus & Golden Horn water */}
                  <path d="M 330 20 L 490 20 L 460 340 L 290 340 L 330 225 L 235 165 L 250 145 L 345 190 Z" fill="rgba(14,165,233,0.18)" stroke="rgba(56,189,248,0.4)" strokeWidth="1.5" />
                  {/* Byzantine Triple Walls */}
                  <line x1="205" y1="175" x2="215" y2="310" stroke="#f59e0b" strokeWidth="4.5" strokeDasharray="8 3" />
                  {/* Golden Horn Chain */}
                  <line x1="330" y1="196" x2="365" y2="232" stroke="#ef4444" strokeWidth="3.5" strokeDasharray="5 3" />
                  <text x="378" y="218" fill="#fca5a5" fontSize="8.8" fontWeight="700" fontFamily={SVG_FONT}>
                    Haliç Zinciri
                  </text>
                  {/* Overland Slipway Route */}
                  <path d="M 425 195 Q 395 130 310 175" fill="none" stroke="#34d399" strokeWidth="2.2" strokeDasharray="4 4" />
                  <text x="455" y="150" fill="#7dd3fc" fontSize="9" fontWeight="700" fontFamily={SVG_FONT}>
                    İstanbul Boğazı
                  </text>
                </g>
              )}

              {battle.id === 'preveze' && (
                <g>
                  <rect x="0" y="40" width="370" height="295" fill="rgba(14,165,233,0.12)" />
                  <path d="M 370 40 L 540 40 L 540 335 L 370 335 L 390 265 L 440 245 L 440 185 L 385 165 Z" fill="rgba(30,41,59,0.72)" stroke="#475569" strokeWidth="1.5" />
                  <text x="462" y="216" textAnchor="middle" fill="#cbd5e1" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                    Arta Körfezi
                  </text>
                  <text x="140" y="68" textAnchor="middle" fill="#7dd3fc" fontSize="10" fontWeight="700" fontFamily={SVG_FONT}>
                    İYON DENİZİ (PREVEZE AÇIKLARI)
                  </text>
                </g>
              )}

              {battle.id === 'canakkale' && (
                <g>
                  {/* Gelibolu Peninsula + Asian Coast + Strait */}
                  <polygon points="45,45 235,45 195,215 140,285 45,270" fill="rgba(30,41,59,0.72)" stroke="#475569" strokeWidth="1.5" />
                  <polygon points="285,95 520,85 520,335 230,335 250,245" fill="rgba(30,41,59,0.72)" stroke="#475569" strokeWidth="1.5" />
                  <path d="M 235 45 L 285 95 L 230 335 L 140 285 L 195 215 Z" fill="rgba(14,165,233,0.22)" />
                  {/* Nusret Mine Line */}
                  <line x1="250" y1="225" x2="275" y2="270" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 5" />
                  <text x="295" y="265" fill="#fde047" fontSize="8.8" fontWeight="700" fontFamily={SVG_FONT}>
                    Nusret Mayınları
                  </text>
                  <text x="108" y="88" fill="#cbd5e1" fontSize="9" fontWeight="700" fontFamily={SVG_FONT}>
                    Gelibolu Yarımadası
                  </text>
                </g>
              )}

              {battle.id === 'sakarya' && (
                <g>
                  {/* Sakarya River Winding Barrier */}
                  <path d="M 210 35 Q 245 120 205 185 Q 175 245 225 335" fill="none" stroke="#38bdf8" strokeWidth="9" opacity="0.38" strokeLinecap="round" />
                  <line x1="275" y1="75" x2="275" y2="305" stroke="rgba(52,211,153,0.35)" strokeWidth="2.5" strokeDasharray="7 5" />
                  <line x1="335" y1="75" x2="335" y2="305" stroke="rgba(52,211,153,0.25)" strokeWidth="2.5" strokeDasharray="7 5" />
                  <text x="172" y="135" fill="#7dd3fc" fontSize="9" fontWeight="700" fontFamily={SVG_FONT}>
                    Sakarya Nehri
                  </text>
                  <text x="315" y="64" textAnchor="middle" fill="#6ee7b7" fontSize="9.2" fontWeight="700" fontFamily={SVG_FONT}>
                    100 km Sath-ı Müdafaa Derinliği
                  </text>
                </g>
              )}

              {battle.id === 'buyuk_taarruz' && (
                <g>
                  <line x1="85" y1="215" x2="410" y2="215" stroke="rgba(148,163,184,0.28)" strokeWidth="2" strokeDasharray="6 4" />
                  <path d="M 240 285 Q 280 265 320 295" fill="rgba(71,85,105,0.45)" stroke="#64748b" strokeWidth="1.3" />
                  <text x="280" y="325" textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="700" fontFamily={SVG_FONT}>
                    Ahır Dağları Süvari Geçidi
                  </text>
                  <text x="85" y="182" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontWeight="700" fontFamily={SVG_FONT}>
                    Ege / İzmir Yönü
                  </text>
                </g>
              )}

              {/* Directional Maneuver Arrows */}
              {phase.vectors.map((v, vi) => (
                <line
                  key={vi}
                  x1={v.fromX}
                  y1={v.fromY}
                  x2={v.toX}
                  y2={v.toY}
                  stroke={v.side === 'ally' ? '#34d399' : '#fb7185'}
                  strokeWidth="2.8"
                  strokeDasharray={v.dashed ? '6 4' : undefined}
                  markerEnd={v.side === 'ally' ? 'url(#arrowAlly)' : 'url(#arrowEnemy)'}
                />
              ))}

              {/* Active Tactical Focus Pulse */}
              {phase.pulsePoint && (
                <g transform={`translate(${phase.pulsePoint.x}, ${phase.pulsePoint.y})`}>
                  <circle cx="0" cy="0" r="24" fill="none" stroke="rgba(250,204,21,0.55)" strokeWidth="1.6">
                    <animate attributeName="r" values="16;30;16" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.8;0.15;0.8" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <rect x="-78" y="-44" width="156" height="20" rx="6" fill="rgba(9,13,22,0.9)" stroke="rgba(250,204,21,0.6)" strokeWidth="1.1" />
                  <text x="0" y="-30.5" textAnchor="middle" fill="#fde047" fontSize="9.2" fontWeight="800" fontFamily={SVG_FONT}>
                    {phase.pulsePoint.label}
                  </text>
                </g>
              )}

              {/* Animated Troop Units */}
              {phase.units.map((u) => {
                const isAlly = u.side === 'ally'
                return (
                  <g
                    key={u.id}
                    transform={`translate(${u.x}, ${u.y})`}
                    style={{ transition: 'transform 0.7s ease-in-out' }}
                  >
                    <rect
                      x="-54"
                      y="-20"
                      width="108"
                      height="40"
                      rx="8"
                      fill={isAlly ? 'rgba(6,78,59,0.92)' : 'rgba(127,29,29,0.9)'}
                      stroke={isAlly ? '#34d399' : '#fb7185'}
                      strokeWidth="1.8"
                    />
                    <rect x="-54" y="-20" width="108" height="4" rx="2" fill={isAlly ? '#10b981' : '#ef4444'} />
                    <text x="0" y="-2" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="800" fontFamily={SVG_FONT}>
                      {u.label}
                    </text>
                    <text x="0" y="11" textAnchor="middle" fill={isAlly ? '#a7f3d0' : '#fecaca'} fontSize="7.6" fontWeight="600" fontFamily={SVG_FONT}>
                      {u.subLabel}
                    </text>
                  </g>
                )
              })}

              {/* Legend Bottom Left */}
              <g transform="translate(14, 14)">
                <rect x="0" y="0" width="170" height="24" rx="7" fill="rgba(9,13,22,0.88)" stroke="#334155" strokeWidth="1" />
                <circle cx="14" cy="12" r="4.5" fill="#10b981" />
                <text x="23" y="15.5" fill="#cbd5e1" fontSize="8.8" fontWeight="700" fontFamily={SVG_FONT}>
                  Türk / Selçuklu
                </text>
                <circle cx="106" cy="12" r="4.5" fill="#ef4444" />
                <text x="115" y="15.5" fill="#cbd5e1" fontSize="8.8" fontWeight="700" fontFamily={SVG_FONT}>
                  Karşı Ordu
                </text>
              </g>
            </svg>

            {/* Commander Quote & Narrative Bar */}
            <div className="p-4 bg-[#090E18] border-t border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300 italic">{phase.quote}</div>
              <p className="text-xs text-slate-300 leading-relaxed">{phase.commandNote}</p>
            </div>
          </div>

          {/* Askeri & Siyasi Sonuç Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-1.5">
              <div className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                ASKERÎ SONUÇ
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{battle.militaryResult}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 space-y-1.5">
              <div className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                SİYASÎ SONUÇ &amp; ÖSYM TUZAĞI
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{battle.politicalResult}</p>
              <p className="text-[11px] text-rose-300 font-semibold pt-1">⚠️ {battle.examTrap}</p>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Phase Selector + Quiz */}
        <div className="xl:col-span-4 space-y-4">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300 inline-flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Harekât Safhaları
              </span>
              <span className="text-[11px] font-bold text-slate-400">{battle.year}</span>
            </div>

            <div className="space-y-2">
              {battle.phases.map((ph, i) => {
                const active = i === phaseIdx
                const done = i < phaseIdx
                return (
                  <button
                    key={ph.title}
                    type="button"
                    onClick={() => {
                      playClickSound()
                      setIsPlaying(false)
                      setPhaseIdx(i)
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? 'bg-amber-500/15 border-amber-400/60 text-white shadow-lg shadow-amber-500/10'
                        : done
                        ? 'bg-emerald-950/35 border-emerald-500/30 text-slate-300'
                        : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-xs font-extrabold">
                      <span>{ph.title}</span>
                      {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{ph.timestamp}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Interactive Commander Quiz */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-rose-950/25 border border-rose-500/30 p-4 space-y-3">
            <div className="text-[11px] font-black text-rose-300 uppercase tracking-wider inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Komutan Sensin · MEB Çıkarım Kontrolü
            </div>
            <p className="text-xs font-bold text-slate-100 leading-relaxed">{battle.quiz.question}</p>
            <div className="space-y-2">
              {battle.quiz.options.map((opt, oi) => {
                const picked = quizChoice === oi
                const correct = oi === battle.quiz.correctIndex
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setQuizChoice(oi)
                      if (oi === battle.quiz.correctIndex) playSuccessFanfare()
                      else playErrorBuzz()
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                      quizChoice === null
                        ? 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-rose-400/60'
                        : picked && correct
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                        : picked && !correct
                        ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : correct
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950/50 border-slate-800 text-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {quizChoice !== null && (
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
                {battle.quiz.explanation}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
