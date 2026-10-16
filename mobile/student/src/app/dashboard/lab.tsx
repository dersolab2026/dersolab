import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

type Branch = 'fizik' | 'kimya' | 'biyoloji' | 'matematik' | 'ingilizce' | 'turkce' | 'sosyal';

const BRANCHES: { id: Branch; name: string; icon: keyof typeof Ionicons.glyphMap; color: string; gradient: [string, string] }[] = [
  { id: 'fizik', name: 'Fizik', icon: 'flash-outline', color: '#00e5ff', gradient: ['#00e5ff', '#3b82f6'] },
  { id: 'kimya', name: 'Kimya', icon: 'flask-outline', color: '#a855f7', gradient: ['#a855f7', '#ec4899'] },
  { id: 'biyoloji', name: 'Biyoloji', icon: 'leaf-outline', color: '#10b981', gradient: ['#10b981', '#14b8a6'] },
  { id: 'matematik', name: 'Matematik', icon: 'calculator-outline', color: '#f59e0b', gradient: ['#f59e0b', '#ef4444'] },
  { id: 'ingilizce', name: 'İngilizce (MEB)', icon: 'globe-outline', color: '#38bdf8', gradient: ['#38bdf8', '#6366f1'] },
  { id: 'turkce', name: 'Türkçe & TDK', icon: 'book-outline', color: '#f43f5e', gradient: ['#f43f5e', '#d946ef'] },
  { id: 'sosyal', name: 'Sosyal / Tarih', icon: 'map-outline', color: '#eab308', gradient: ['#eab308', '#f97316'] },
];

export default function LabScreen() {
  const [selectedBranch, setSelectedBranch] = useState<Branch>('fizik');

  // Fizik State
  const [refractionAngle, setRefractionAngle] = useState<number>(45);
  const [medium1Index, setMedium1Index] = useState<number>(1.0); // Hava
  const [medium2Index, setMedium2Index] = useState<number>(1.33); // Su
  const [pulleyWeight, setPulleyWeight] = useState<number>(60); // 60 N
  const [pulleyType, setPulleyType] = useState<'sabit' | 'hareketli' | 'palanga'>('hareketli');

  // Kimya State
  const [atomicNumber, setAtomicNumber] = useState<number>(6); // Karbon
  const [phValue, setPhValue] = useState<number>(7.0);

  // Biyoloji State
  const [selectedOrganelle, setSelectedOrganelle] = useState<string>('Mitokondri');

  // Matematik State
  const [paramA, setParamA] = useState<number>(1);
  const [paramB, setParamB] = useState<number>(-2);
  const [paramC, setParamC] = useState<number>(-3);

  // İngilizce MEB State
  const [englishGrade, setEnglishGrade] = useState<number>(8); // LGS 8. sınıf default
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0);
  const [showMeaning, setShowMeaning] = useState<boolean>(false);

  // Türkçe State
  const [turkishTab, setTurkishTab] = useState<'tdk' | 'sanat'>('tdk');

  // Sosyal / Tarih State
  const [timelinePeriod, setTimelinePeriod] = useState<'kurtulus' | 'osmanli' | 'ilk_cag'>('kurtulus');

  // Fizik Snell Hesaplaması
  const theta1Rad = (refractionAngle * Math.PI) / 180;
  const sinTheta2 = (medium1Index * Math.sin(theta1Rad)) / medium2Index;
  const isTotalReflection = sinTheta2 > 1;
  const theta2Deg = isTotalReflection ? null : ((Math.asin(sinTheta2) * 180) / Math.PI).toFixed(1);

  // Makara Kuvvet Hesabı
  const forceNeeded = pulleyType === 'sabit' ? pulleyWeight : pulleyType === 'hareketli' ? pulleyWeight / 2 : pulleyWeight / 4;

  // Kimya Elementleri
  const ELEMENTS: Record<number, { name: string; symbol: string; mass: number; group: string; period: number; type: string }> = {
    1: { name: 'Hidrojen', symbol: 'H', mass: 1.008, group: '1A', period: 1, type: 'Ametal' },
    2: { name: 'Helyum', symbol: 'He', mass: 4.003, group: '8A (Soygaz)', period: 1, type: 'Soygaz' },
    6: { name: 'Karbon', symbol: 'C', mass: 12.011, group: '4A', period: 2, type: 'Ametal' },
    7: { name: 'Azot', symbol: 'N', mass: 14.007, group: '5A', period: 2, type: 'Ametal' },
    8: { name: 'Oksijen', symbol: 'O', mass: 15.999, group: '6A', period: 2, type: 'Ametal' },
    11: { name: 'Sodyum', symbol: 'Na', mass: 22.990, group: '1A (Alkali)', period: 3, type: 'Metal' },
    12: { name: 'Magnezyum', symbol: 'Mg', mass: 24.305, group: '2A (Toprak Alkali)', period: 3, type: 'Metal' },
    17: { name: 'Klor', symbol: 'Cl', mass: 35.45, group: '7A (Halojen)', period: 3, type: 'Halojen' },
    26: { name: 'Demir', symbol: 'Fe', mass: 55.845, group: '8B (Geçiş)', period: 4, type: 'Geçiş Metali' },
    79: { name: 'Altın', symbol: 'Au', mass: 196.97, group: '1B (Geçiş)', period: 6, type: 'Soy Metal' },
  };
  const activeElement = ELEMENTS[atomicNumber] || ELEMENTS[6];

  // Biyoloji Organelleri
  const ORGANELLES: Record<string, { role: string; location: string; note: string; color: string }> = {
    'Mitokondri': {
      role: 'Hücresel Solunum ve ATP (Enerji) Üretimi',
      location: 'Çift zarlı, iç zarı (krista) kıvrımlı',
      note: 'Kendi DNA, RNA ve ribozomuna sahiptir, kendini eşleyebilir.',
      color: '#ef4444'
    },
    'Kloroplast': {
      role: 'Fotosentez ile Işık Enerjisinden Glikoz ve Oksijen Üretimi',
      location: 'Çift zarlı, içinde tilakoit zar sistemi (granum) bulunur',
      note: 'Yalnızca bitki hücrelerinde ve alglerde bulunur. Klorofil pigmenti taşır.',
      color: '#10b981'
    },
    'Ribozom': {
      role: 'Protein Sentezi',
      location: 'Zarsız organel. Çekirdekçikte sentezlenir.',
      note: 'Tüm prokaryot ve ökaryot canlı hücrelerde bulunan evrensel organeldir.',
      color: '#06b6d4'
    },
    'Golgi Aygıtı': {
      role: 'Salgılama, Paketleme ve Glikoprotein Sentezi',
      location: 'Yassılaşmış kesecikler demeti (tek zarlı)',
      note: 'Tükürük, mukus, ter bezi gibi salgı üreten hücrelerde bolca bulunur.',
      color: '#8b5cf6'
    },
    'Lizozom': {
      role: 'Hücre İçi Sindirim ve Otofaji',
      location: 'Tek zarlı, hidrolitik (sindirim) enzimleri içerir',
      note: 'Kendi enzimlerini ribozom üretir, golgi paketler. Apoptoziste görevlidir.',
      color: '#f59e0b'
    },
  };

  // Parabol Tepe Noktası & Kökler
  const rVertex = paramA !== 0 ? (-paramB / (2 * paramA)).toFixed(2) : '0';
  const kVertex = paramA !== 0 ? (paramA * Math.pow(Number(rVertex), 2) + paramB * Number(rVertex) + paramC).toFixed(2) : '0';
  const delta = paramB * paramB - 4 * paramA * paramC;

  // MEB İngilizce Kelimeler (8. Sınıf LGS ve 11. Sınıf)
  const MEB_ENGLISH_WORDS: Record<number, { word: string; meaning: string; sentence: string; unit: string }[]> = {
    8: [
      { word: 'Count on', meaning: 'Güvenmek / Bel bağlamak', sentence: 'A true friend is someone you can always count on.', unit: 'Unit 1: Friendship' },
      { word: 'Back up', meaning: 'Desteklemek / Arka çıkmak', sentence: 'Best friends always back each other up in tough times.', unit: 'Unit 1: Friendship' },
      { word: 'Trendy', meaning: 'Modaya uygun / Popüler', sentence: 'Teenagers prefer wearing trendy casual clothes.', unit: 'Unit 2: Teen Life' },
      { word: 'Chore', meaning: 'Ev işi / Günlük görev', sentence: 'Emptying the dishwasher is my favorite household chore.', unit: 'Unit 8: Chores' },
      { word: 'Perseverance', meaning: 'Azim ve kararlılık', sentence: 'Success requires great perseverance and discipline.', unit: 'Unit 9: Science' },
    ],
    11: [
      { word: 'Peculiar', meaning: 'Kendine has / İlginç', sentence: 'The architecture of this historical building is quite peculiar.', unit: 'Theme 1: Future Jobs' },
      { word: 'Accomplishment', meaning: 'Başarı / Kazanım', sentence: 'Graduating with high honors was her greatest accomplishment.', unit: 'Theme 2: Hard Work' },
      { word: 'Sustainable', meaning: 'Sürdürülebilir', sentence: 'Solar energy provides a clean and sustainable power source.', unit: 'Theme 3: Environment' },
      { word: 'Hesitate', meaning: 'Tereddüt etmek', sentence: 'Do not hesitate to ask questions during the live session.', unit: 'Theme 4: Communication' },
    ],
  };
  const activeGradeWords = MEB_ENGLISH_WORDS[englishGrade] || MEB_ENGLISH_WORDS[8];
  const activeWord = activeGradeWords[currentWordIdx % activeGradeWords.length];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <LinearGradient colors={['#00e5ff', '#3b82f6']} style={styles.headerIcon}>
            <Ionicons name="flask" size={20} color="#030712" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>DersoLab L.A.B.</Text>
            <Text style={styles.headerSubtitle}>7 Branş İnteraktif Deney & Simülasyon Merkezi</Text>
          </View>
        </View>
      </View>

      {/* Horizontal Branch Selector */}
      <View style={styles.branchSelectorWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.branchSelector}>
          {BRANCHES.map((b) => {
            const isActive = selectedBranch === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                onPress={() => setSelectedBranch(b.id)}
                style={[
                  styles.branchTab,
                  isActive && { borderColor: b.color, backgroundColor: 'rgba(255,255,255,0.06)' },
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={b.icon}
                  size={16}
                  color={isActive ? b.color : '#94a3b8'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.branchTabText, isActive && { color: '#ffffff', fontWeight: '800' }]}>
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ==================== FİZİK SİMÜLATÖRÜ ==================== */}
        {selectedBranch === 'fizik' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="sunny-outline" size={20} color="#00e5ff" />
                <Text style={styles.cardTitle}>Optik & Kırılma Yasası (Snell Kanunu)</Text>
              </View>
              <Text style={styles.cardDescription}>
                Farklı kırıcılık indisine sahip ortamlarda ışığın kırılmasını ve tam yansımayı gözlemle.
              </Text>

              {/* Mediums */}
              <View style={styles.rowBetween}>
                <View style={styles.halfCol}>
                  <Text style={styles.inputLabel}>1. Ortam (Gelen)</Text>
                  <View style={styles.pillRow}>
                    <TouchableOpacity
                      onPress={() => setMedium1Index(1.0)}
                      style={[styles.pillBtn, medium1Index === 1.0 && styles.pillBtnActive]}
                    >
                      <Text style={[styles.pillText, medium1Index === 1.0 && styles.pillTextActive]}>Hava (1.0)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setMedium1Index(1.33)}
                      style={[styles.pillBtn, medium1Index === 1.33 && styles.pillBtnActive]}
                    >
                      <Text style={[styles.pillText, medium1Index === 1.33 && styles.pillTextActive]}>Su (1.33)</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.halfCol}>
                  <Text style={styles.inputLabel}>2. Ortam (Kırılan)</Text>
                  <View style={styles.pillRow}>
                    <TouchableOpacity
                      onPress={() => setMedium2Index(1.33)}
                      style={[styles.pillBtn, medium2Index === 1.33 && styles.pillBtnActive]}
                    >
                      <Text style={[styles.pillText, medium2Index === 1.33 && styles.pillTextActive]}>Su (1.33)</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setMedium2Index(1.5)}
                      style={[styles.pillBtn, medium2Index === 1.5 && styles.pillBtnActive]}
                    >
                      <Text style={[styles.pillText, medium2Index === 1.5 && styles.pillTextActive]}>Cam (1.5)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Angle Control */}
              <View style={styles.sliderBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.inputLabel}>Gelme Açısı (θ₁):</Text>
                  <Text style={styles.statValueHighlight}>{refractionAngle}°</Text>
                </View>
                <View style={styles.stepBtnRow}>
                  {[15, 30, 45, 60, 75].map((ang) => (
                    <TouchableOpacity
                      key={ang}
                      onPress={() => setRefractionAngle(ang)}
                      style={[styles.stepBtn, refractionAngle === ang && styles.stepBtnActive]}
                    >
                      <Text style={[styles.stepBtnText, refractionAngle === ang && styles.stepBtnTextActive]}>
                        {ang}°
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Result Box */}
              <View style={[styles.resultBox, isTotalReflection && styles.resultBoxDanger]}>
                {isTotalReflection ? (
                  <View style={styles.rowAlign}>
                    <Ionicons name="warning-outline" size={22} color="#ef4444" style={{ marginRight: 8 }} />
                    <View>
                      <Text style={styles.dangerTitle}>TAM YANSIMA GERÇEKLEŞTİ!</Text>
                      <Text style={styles.resultSub}>Işık 2. ortama geçemez, aynı açıyla geri yansır (θ₂ oluşmaz).</Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={styles.rowBetween}>
                      <Text style={styles.resultLabel}>Kırılma Açısı (θ₂):</Text>
                      <Text style={styles.resultValue}>{theta2Deg}°</Text>
                    </View>
                    <Text style={styles.resultSub}>
                      {medium1Index < medium2Index
                        ? 'Az yoğundan çok yoğuna geçen ışın normale yaklaşarak kırılır.'
                        : 'Çok yoğundan az yoğuna geçen ışın normalden uzaklaşarak kırılır.'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Makara Simülatörü */}
            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="cog-outline" size={20} color="#3b82f6" />
                <Text style={styles.cardTitle}>Basit Makineler: Makara & Palanga</Text>
              </View>
              <Text style={styles.cardDescription}>
                Yükün ağırlığı ve makara sistemine göre uygulaman gereken kuvveti ve kuvvet kazancını hesapla.
              </Text>

              <View style={styles.pillRow}>
                {(['sabit', 'hareketli', 'palanga'] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setPulleyType(type)}
                    style={[styles.pillBtn, pulleyType === type && styles.pillBtnActive, { flex: 1 }]}
                  >
                    <Text style={[styles.pillText, pulleyType === type && styles.pillTextActive, { textTransform: 'capitalize' }]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.sliderBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.inputLabel}>Yükün Ağırlığı (P):</Text>
                  <Text style={styles.statValueHighlight}>{pulleyWeight} Newton</Text>
                </View>
                <View style={styles.stepBtnRow}>
                  {[30, 60, 90, 120, 200].map((w) => (
                    <TouchableOpacity
                      key={w}
                      onPress={() => setPulleyWeight(w)}
                      style={[styles.stepBtn, pulleyWeight === w && styles.stepBtnActive]}
                    >
                      <Text style={[styles.stepBtnText, pulleyWeight === w && styles.stepBtnTextActive]}>
                        {w} N
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.resultLabel}>Gereken Kuvvet (F):</Text>
                  <Text style={[styles.resultValue, { color: '#10b981' }]}>{forceNeeded.toFixed(1)} N</Text>
                </View>
                <View style={[styles.rowBetween, { marginTop: 4 }]}>
                  <Text style={styles.resultSub}>Kuvvet Kazancı (P / F):</Text>
                  <Text style={[styles.statValueHighlight, { fontSize: 13 }]}>
                    {(pulleyWeight / forceNeeded).toFixed(0)}x Kazanç
                  </Text>
                </View>
                <Text style={[styles.resultSub, { marginTop: 6 }]}>
                  {pulleyType === 'sabit'
                    ? 'Kuvvetten kazanç yoktur; sadece kuvvetin yönünü değiştirerek iş kolaylığı sağlar.'
                    : pulleyType === 'hareketli'
                    ? '2 kat kuvvet kazancı vardır, yoldan 2 kat kayıp oluşur.'
                    : '4 kat kuvvet kazancı vardır. İpi 4 metre çektiğinde yük 1 metre yükselir.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== KİMYA SİMÜLATÖRÜ ==================== */}
        {selectedBranch === 'kimya' && (
          <View style={styles.sectionContainer}>
            {/* Periyodik Tablo Kartı */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="grid-outline" size={20} color="#a855f7" />
                <Text style={styles.cardTitle}>Element Dedektifi & Periyodik Özellikler</Text>
              </View>
              <Text style={styles.cardDescription}>
                Bir element seçerek grup, periyot, atom kütlesi ve kimyasal sınıfını anında incele.
              </Text>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 12 }}>
                {[1, 2, 6, 7, 8, 11, 12, 17, 26, 79].map((z) => {
                  const el = ELEMENTS[z];
                  const isCur = atomicNumber === z;
                  return (
                    <TouchableOpacity
                      key={z}
                      onPress={() => setAtomicNumber(z)}
                      style={[
                        styles.elementChip,
                        isCur && { borderColor: '#a855f7', backgroundColor: 'rgba(168,85,247,0.15)' },
                      ]}
                    >
                      <Text style={styles.elementChipNum}>{z}</Text>
                      <Text style={[styles.elementChipSymbol, isCur && { color: '#a855f7' }]}>{el.symbol}</Text>
                      <Text style={styles.elementChipName}>{el.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.elementDetailBox}>
                <View style={styles.rowBetween}>
                  <View>
                    <Text style={styles.elementBigSymbol}>{activeElement.symbol}</Text>
                    <Text style={styles.elementBigName}>{activeElement.name} (Z = {atomicNumber})</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.badgeTextHighlighted}>{activeElement.type}</Text>
                    <Text style={styles.elementMassText}>Kütle: {activeElement.mass} g/mol</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.rowBetween}>
                  <View style={styles.statMini}>
                    <Text style={styles.statMiniLabel}>Periyot</Text>
                    <Text style={styles.statMiniVal}>{activeElement.period}. Periyot</Text>
                  </View>
                  <View style={styles.statMini}>
                    <Text style={styles.statMiniLabel}>Grup</Text>
                    <Text style={styles.statMiniVal}>{activeElement.group}</Text>
                  </View>
                  <View style={styles.statMini}>
                    <Text style={styles.statMiniLabel}>Valans (Değerlik)</Text>
                    <Text style={styles.statMiniVal}>e⁻ sayısı</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* pH Asit-Baz Metre */}
            <View style={[styles.card, { marginTop: 16 }]}>
              <View style={styles.cardHeader}>
                <Ionicons name="water-outline" size={20} color="#ec4899" />
                <Text style={styles.cardTitle}>pH Metre: Asit & Baz Dengesi</Text>
              </View>
              <Text style={styles.cardDescription}>
                0 (Kuvvetli Asit) ile 14 (Kuvvetli Baz) arasındaki çözelti davranışını incele.
              </Text>

              <View style={styles.stepBtnRow}>
                {[1, 3, 7, 10, 13].map((val) => (
                  <TouchableOpacity
                    key={val}
                    onPress={() => setPhValue(val)}
                    style={[styles.stepBtn, phValue === val && styles.stepBtnActive]}
                  >
                    <Text style={[styles.stepBtnText, phValue === val && styles.stepBtnTextActive]}>
                      pH {val}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View
                style={[
                  styles.resultBox,
                  {
                    borderColor: phValue < 7 ? '#ef4444' : phValue === 7 ? '#10b981' : '#3b82f6',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  },
                ]}
              >
                <View style={styles.rowBetween}>
                  <Text style={styles.resultLabel}>Çözelti Durumu:</Text>
                  <Text
                    style={[
                      styles.resultValue,
                      { color: phValue < 7 ? '#ef4444' : phValue === 7 ? '#10b981' : '#3b82f6' },
                    ]}
                  >
                    {phValue < 7
                      ? `Asidik (pH ${phValue})`
                      : phValue === 7
                      ? `Nötr (pH 7.0 - Saf Su)`
                      : `Bazik / Alkali (pH ${phValue})`}
                  </Text>
                </View>
                <Text style={[styles.resultSub, { marginTop: 6 }]}>
                  {phValue < 7
                    ? 'Turnusol kağıdını kırmızıya çevirir. [H⁺] > [OH⁻] iyon konsantrasyonu yüksektir. Mide asidi pH 1.5, Limon pH 2.4.'
                    : phValue === 7
                    ? 'Turnusol rengini değiştirmez. [H⁺] = [OH⁻] = 10⁻⁷ M dengededir.'
                    : 'Turnusol kağıdını maviye çevirir. Ele kayganlık hissi verir. Sabun pH 9-10, Çamaşır suyu pH 12.5.'}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== BİYOLOJİ SİMÜLATÖRÜ ==================== */}
        {selectedBranch === 'biyoloji' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="fitness-outline" size={20} color="#10b981" />
                <Text style={styles.cardTitle}>Hücre ve Organel Atlası</Text>
              </View>
              <Text style={styles.cardDescription}>
                Ökaryot hücre organellerinin görevlerini, zar yapılarını ve TYT/AYT çıkmış soru ipuçlarını keşfet.
              </Text>

              <View style={styles.pillRowWrap}>
                {Object.keys(ORGANELLES).map((orgName) => {
                  const isSel = selectedOrganelle === orgName;
                  return (
                    <TouchableOpacity
                      key={orgName}
                      onPress={() => setSelectedOrganelle(orgName)}
                      style={[styles.pillBtn, isSel && styles.pillBtnActive, { marginBottom: 8 }]}
                    >
                      <Text style={[styles.pillText, isSel && styles.pillTextActive]}>{orgName}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.resultBox}>
                <View style={styles.rowBetween}>
                  <Text style={[styles.cardTitle, { color: ORGANELLES[selectedOrganelle].color }]}>
                    {selectedOrganelle}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Önemli TYT Konusu</Text>
                  </View>
                </View>

                <View style={{ marginTop: 8 }}>
                  <Text style={styles.detailTitle}>Temel Görevi:</Text>
                  <Text style={styles.detailBody}>{ORGANELLES[selectedOrganelle].role}</Text>
                </View>

                <View style={{ marginTop: 8 }}>
                  <Text style={styles.detailTitle}>Yapısı & Konumu:</Text>
                  <Text style={styles.detailBody}>{ORGANELLES[selectedOrganelle].location}</Text>
                </View>

                <View style={{ marginTop: 8 }}>
                  <Text style={styles.detailTitle}>Sınav İpucu:</Text>
                  <Text style={[styles.detailBody, { color: '#facc15' }]}>
                    💡 {ORGANELLES[selectedOrganelle].note}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* ==================== MATEMATİK SİMÜLATÖRÜ ==================== */}
        {selectedBranch === 'matematik' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="analytics-outline" size={20} color="#f59e0b" />
                <Text style={styles.cardTitle}>İkinci Dereceden Fonksiyon & Parabol Keşfi</Text>
              </View>
              <Text style={styles.cardDescription}>
                f(x) = ax² + bx + c fonksiyon katsayılarını değiştirerek tepe noktası (r, k) ve diskriminant (Δ) incelemesi yap.
              </Text>

              {/* Function display */}
              <View style={styles.functionFormulaBox}>
                <Text style={styles.functionFormulaText}>
                  f(x) = {paramA === 1 ? '' : paramA === -1 ? '-' : `${paramA}`}x²{' '}
                  {paramB >= 0 ? `+ ${paramB}` : `- ${Math.abs(paramB)}`}x{' '}
                  {paramC >= 0 ? `+ ${paramC}` : `- ${Math.abs(paramC)}`}
                </Text>
              </View>

              {/* Param A Slider Buttons */}
              <View style={styles.paramControlRow}>
                <Text style={styles.paramLabel}>a (Kolların Yönü):</Text>
                <View style={styles.paramButtons}>
                  {[-2, -1, 1, 2].map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setParamA(v)}
                      style={[styles.smallParamBtn, paramA === v && styles.smallParamBtnActive]}
                    >
                      <Text style={[styles.smallParamBtnText, paramA === v && styles.smallParamBtnTextActive]}>
                        {v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Param C Slider Buttons */}
              <View style={styles.paramControlRow}>
                <Text style={styles.paramLabel}>c (y Eksenini Kestiği Yer):</Text>
                <View style={styles.paramButtons}>
                  {[-4, -3, 0, 3, 5].map((v) => (
                    <TouchableOpacity
                      key={v}
                      onPress={() => setParamC(v)}
                      style={[styles.smallParamBtn, paramC === v && styles.smallParamBtnActive]}
                    >
                      <Text style={[styles.smallParamBtnText, paramC === v && styles.smallParamBtnTextActive]}>
                        {v}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.resultBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.resultLabel}>Tepe Noktası T(r, k):</Text>
                  <Text style={[styles.resultValue, { color: '#00e5ff' }]}>
                    T({rVertex}, {kVertex})
                  </Text>
                </View>
                <View style={[styles.rowBetween, { marginTop: 4 }]}>
                  <Text style={styles.resultLabel}>Diskriminant (Δ = b² - 4ac):</Text>
                  <Text style={[styles.statValueHighlight, { fontSize: 13 }]}>
                    Δ = {delta} ({delta > 0 ? '2 farklı reel kök' : delta === 0 ? 'Çakışık tek kök' : 'Reel kök yok'})
                  </Text>
                </View>
                <Text style={[styles.resultSub, { marginTop: 6 }]}>
                  {paramA > 0
                    ? 'a > 0 olduğu için parabolün kolları yukarı doğrudur, en küçük (minimum) değeri k = ' + kVertex
                    : 'a < 0 olduğu için parabolün kolları aşağı doğrudur, en büyük (maksimum) değeri k = ' + kVertex}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== İNGİLİZCE MEB MODÜLÜ ==================== */}
        {selectedBranch === 'ingilizce' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="language-outline" size={20} color="#38bdf8" />
                <Text style={styles.cardTitle}>MEB Ders Kitabı Ünite Kelime Kartları</Text>
              </View>
              <Text style={styles.cardDescription}>
                MEB müfredatı ünitelerindeki kritik kelimeleri, örnek cümleleri ve telaffuz ipuçlarını çalış.
              </Text>

              {/* Grade Selector */}
              <View style={styles.pillRow}>
                <TouchableOpacity
                  onPress={() => { setEnglishGrade(8); setCurrentWordIdx(0); setShowMeaning(false); }}
                  style={[styles.pillBtn, englishGrade === 8 && styles.pillBtnActive, { flex: 1 }]}
                >
                  <Text style={[styles.pillText, englishGrade === 8 && styles.pillTextActive]}>8. Sınıf (LGS)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { setEnglishGrade(11); setCurrentWordIdx(0); setShowMeaning(false); }}
                  style={[styles.pillBtn, englishGrade === 11 && styles.pillBtnActive, { flex: 1 }]}
                >
                  <Text style={[styles.pillText, englishGrade === 11 && styles.pillTextActive]}>11. Sınıf (YDT / YKS)</Text>
                </TouchableOpacity>
              </View>

              {/* Flashcard Box */}
              <TouchableOpacity
                onPress={() => setShowMeaning(!showMeaning)}
                activeOpacity={0.85}
                style={styles.flashcard}
              >
                <View style={styles.flashcardTop}>
                  <Text style={styles.flashcardUnit}>{activeWord.unit}</Text>
                  <Ionicons name="repeat-outline" size={16} color="#94a3b8" />
                </View>

                <Text style={styles.flashcardWord}>{activeWord.word}</Text>

                {showMeaning ? (
                  <View style={styles.flashcardMeaningBox}>
                    <Text style={styles.flashcardMeaning}>{activeWord.meaning}</Text>
                    <Text style={styles.flashcardSentence}>"{activeWord.sentence}"</Text>
                  </View>
                ) : (
                  <Text style={styles.flashcardHint}>Anlamı ve örnek cümleyi görmek için karta tıkla</Text>
                )}
              </TouchableOpacity>

              {/* Next / Prev Word Buttons */}
              <View style={styles.rowBetween}>
                <TouchableOpacity
                  onPress={() => {
                    setCurrentWordIdx((prev) => (prev > 0 ? prev - 1 : activeGradeWords.length - 1));
                    setShowMeaning(false);
                  }}
                  style={styles.navButton}
                >
                  <Ionicons name="arrow-back" size={18} color="#ffffff" />
                  <Text style={styles.navButtonText}>Önceki</Text>
                </TouchableOpacity>

                <Text style={styles.counterText}>
                  {currentWordIdx + 1} / {activeGradeWords.length}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    setCurrentWordIdx((prev) => (prev + 1) % activeGradeWords.length);
                    setShowMeaning(false);
                  }}
                  style={styles.navButton}
                >
                  <Text style={styles.navButtonText}>Sonraki</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ==================== TÜRKÇE & TDK ==================== */}
        {selectedBranch === 'turkce' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="ribbon-outline" size={20} color="#f43f5e" />
                <Text style={styles.cardTitle}>TDK Günün Kelimesi & Edebi Sanatlar</Text>
              </View>
              <Text style={styles.cardDescription}>
                ÖSYM & LGS sınavlarında çıkan çeldirici kelimelerin doğru yazılışı ve edebi sanatlar rehberi.
              </Text>

              <View style={styles.resultBox}>
                <Text style={styles.tdkBadge}>TDK GÜNÜN KELİMESİ</Text>
                <Text style={styles.tdkWord}>feraset [isim, Arapça firāset]</Text>
                <Text style={styles.tdkMeaning}>
                  1. Anlayış, çabuk seziş, idrak kabiliyeti.{'\n'}
                  2. Bir durumun perde arkasını doğru ve isabetli kavrama yeteneği.
                </Text>
                <View style={styles.divider} />
                <Text style={styles.detailTitle}>Sınavda Doğru Yazılışı:</Text>
                <Text style={styles.detailBody}>
                  ✓ Yanı sıra (ayrı yazılır){'\n'}
                  ✓ Birbiri (bitişik yazılır){'\n'}
                  ✓ Her şey (ayrı yazılır){'\n'}
                  ✓ Kravat (arada ı harfi yoktur)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ==================== SOSYAL / TARİH ==================== */}
        {selectedBranch === 'sosyal' && (
          <View style={styles.sectionContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="flag-outline" size={20} color="#eab308" />
                <Text style={styles.cardTitle}>Kurtuluş Savaşı & LGS İnkılap Tarihi Şeridi</Text>
              </View>
              <Text style={styles.cardDescription}>
                Kronolojik dönüm noktaları, genelgeler ve antlaşmalar.
              </Text>

              <View style={styles.timelineList}>
                {[
                  { date: '19 Mayıs 1919', event: 'Mustafa Kemal Paşa’nın Samsun’a Çıkışı', detail: 'Milli Mücadele fiilen başladı.' },
                  { date: '22 Haziran 1919', event: 'Amasya Genelgesi', detail: 'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır (İhtilal beyannamesi).' },
                  { date: '23 Temmuz 1919', event: 'Erzurum Kongresi', detail: 'Manda ve himaye ilk kez reddedildi. Milli sınırlar içinde vatan bir bütündür.' },
                  { date: '23 Nisan 1920', event: 'TBMM’nin Açılışı', detail: 'Egemenlik kayıtsız şartsız milletindir ilkesiyle milli irade meclisi kuruldu.' },
                  { date: '24 Temmuz 1923', event: 'Lozan Barış Antlaşması', detail: 'Yeni Türk Devleti’nin bağımsızlığı tüm dünya devletlerince resmen tanındı.' },
                ].map((item, idx) => (
                  <View key={idx} style={styles.timelineItem}>
                    <View style={styles.timelineDot} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineDate}>{item.date}</Text>
                      <Text style={styles.timelineEvent}>{item.event}</Text>
                      <Text style={styles.timelineDetail}>{item.detail}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    paddingBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  branchSelectorWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 8,
  },
  branchSelector: {
    paddingHorizontal: 16,
    gap: 8,
  },
  branchTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    backgroundColor: '#0f172a',
  },
  branchTabText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  sectionContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 18,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  cardDescription: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 16,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  halfCol: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 6,
  },
  pillRowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginVertical: 8,
  },
  pillBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  pillBtnActive: {
    backgroundColor: '#00e5ff',
    borderColor: '#00e5ff',
  },
  pillText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  pillTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  sliderBox: {
    marginTop: 14,
    backgroundColor: '#1e293b55',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statValueHighlight: {
    fontSize: 14,
    fontWeight: '900',
    color: '#00e5ff',
  },
  stepBtnRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  stepBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  stepBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#60a5fa',
  },
  stepBtnText: {
    fontSize: 11,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  stepBtnTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  resultBox: {
    marginTop: 16,
    backgroundColor: '#1e293b88',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  resultBoxDanger: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  dangerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#ef4444',
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#00e5ff',
  },
  resultSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
    lineHeight: 16,
  },
  elementChip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
    alignItems: 'center',
    minWidth: 54,
  },
  elementChipNum: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
  },
  elementChipSymbol: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    marginVertical: 2,
  },
  elementChipName: {
    fontSize: 9,
    color: '#94a3b8',
  },
  elementDetailBox: {
    backgroundColor: '#1e293b88',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  elementBigSymbol: {
    fontSize: 32,
    fontWeight: '900',
    color: '#a855f7',
  },
  elementBigName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  badgeTextHighlighted: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a855f7',
    backgroundColor: 'rgba(168,85,247,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  elementMassText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 12,
  },
  statMini: {
    alignItems: 'center',
  },
  statMiniLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  statMiniVal: {
    fontSize: 12,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  badge: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
  },
  detailTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
  },
  detailBody: {
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
    marginTop: 2,
  },
  functionFormulaBox: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#f59e0b44',
  },
  functionFormulaText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 17,
    fontWeight: '900',
    color: '#f59e0b',
  },
  paramControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  paramLabel: {
    fontSize: 12,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  paramButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  smallParamBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  smallParamBtnActive: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  smallParamBtnText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  smallParamBtnTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  flashcard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    marginVertical: 14,
    borderWidth: 1,
    borderColor: '#38bdf844',
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  flashcardTop: {
    position: 'absolute',
    top: 14,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  flashcardUnit: {
    fontSize: 11,
    fontWeight: '700',
    color: '#38bdf8',
  },
  flashcardWord: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
  },
  flashcardMeaningBox: {
    marginTop: 12,
    alignItems: 'center',
  },
  flashcardMeaning: {
    fontSize: 16,
    fontWeight: '800',
    color: '#38bdf8',
    textAlign: 'center',
  },
  flashcardSentence: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  flashcardHint: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 10,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  navButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  counterText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  tdkBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: '#f43f5e',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tdkWord: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  tdkMeaning: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  timelineList: {
    marginTop: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#eab30866',
    marginLeft: 8,
    paddingLeft: 16,
    gap: 16,
  },
  timelineItem: {
    position: 'relative',
  },
  timelineDot: {
    position: 'absolute',
    left: -22,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#eab308',
  },
  timelineContent: {},
  timelineDate: {
    fontSize: 11,
    fontWeight: '800',
    color: '#eab308',
  },
  timelineEvent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 2,
  },
  timelineDetail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
  },
});
