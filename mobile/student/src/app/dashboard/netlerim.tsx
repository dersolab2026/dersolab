import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

type ExamResult = {
  id: string;
  exam_name: string;
  exam_type: 'lgs' | 'tyt' | 'ayt' | 'ydt' | string;
  exam_date: string;
  correct_count: number;
  wrong_count: number;
  net_count?: number;
  created_at: string;
};

type CalcMode = 'yks_say' | 'yks_ea' | 'lgs';

interface TargetPreset {
  id: string;
  mode: CalcMode;
  label: string;
  badge: string;
  targetTytNet?: number;
  targetAytNet?: number;
  targetLgsNet?: number;
  targetScore: number;
}

const TARGET_PRESETS: TargetPreset[] = [
  {
    id: 'itu_odtu_cs',
    mode: 'yks_say',
    label: 'İTÜ / ODTÜ / Boğaziçi Mühendislik',
    badge: 'İlk 2.500 Sıralama',
    targetTytNet: 103,
    targetAytNet: 72,
    targetScore: 525,
  },
  {
    id: 'tip_fak',
    mode: 'yks_say',
    label: 'Devlet Tıp Fakülteleri',
    badge: 'İlk 15.000 Sıralama',
    targetTytNet: 94,
    targetAytNet: 65,
    targetScore: 492,
  },
  {
    id: 'muh_50k',
    mode: 'yks_say',
    label: 'Köklü Mühendislik & Mimarlık',
    badge: 'İlk 50.000 Sıralama',
    targetTytNet: 80,
    targetAytNet: 52,
    targetScore: 445,
  },
  {
    id: 'boun_ea',
    mode: 'yks_ea',
    label: 'Boğaziçi / GSÜ İktisat & İşletme',
    badge: 'İlk 1.500 Sıralama',
    targetTytNet: 96,
    targetAytNet: 68,
    targetScore: 505,
  },
  {
    id: 'hukuk_25k',
    mode: 'yks_ea',
    label: 'Devlet Hukuk Fakülteleri',
    badge: 'İlk 25.000 Sıralama',
    targetTytNet: 82,
    targetAytNet: 54,
    targetScore: 442,
  },
  {
    id: 'pdr_psikoloji',
    mode: 'yks_ea',
    label: 'Psikoloji & PDR Bölümleri',
    badge: 'İlk 60.000 Sıralama',
    targetTytNet: 72,
    targetAytNet: 44,
    targetScore: 405,
  },
  {
    id: 'lgs_zirve',
    mode: 'lgs',
    label: 'Galatasaray / İstanbul Erkek / Kabataş',
    badge: '%0.1 - %0.3 Yüzdelik Dilim',
    targetLgsNet: 87,
    targetScore: 492,
  },
  {
    id: 'lgs_fen',
    mode: 'lgs',
    label: 'Proje Fen Liseleri',
    badge: "%1'lik Yüzdelik Dilim",
    targetLgsNet: 81,
    targetScore: 472,
  },
  {
    id: 'lgs_anadolu',
    mode: 'lgs',
    label: 'Nitelikli Anadolu Liseleri',
    badge: "%5'lik Yüzdelik Dilim",
    targetLgsNet: 72,
    targetScore: 442,
  },
];

// Koçluk Formu Katalogları (Web ile %100 uyumlu anahtarlar)
const HEDEF_SECENEKLERI = [
  { key: 'bolum', label: 'Belirli bir bölüm/üniversite hedefim var' },
  { key: 'puan', label: 'Puanımı yükseltmek istiyorum' },
  { key: 'okul', label: 'Okul derslerimi toparlamak istiyorum' },
  { key: 'ilk_kez', label: 'İlk kez hazırlanıyorum, yol haritası lazım' },
  { key: 'tekrar', label: 'Geçen seneki puanımı geçmek istiyorum' },
  { key: 'duzen', label: 'Düzenli çalışma alışkanlığı kazanmak istiyorum' },
  { key: 'kaygi', label: 'Sınav kaygımı yönetmek istiyorum' },
  { key: 'motivasyon', label: 'Motivasyonumu toparlamak istiyorum' },
];

const ZORLANDIGI_DERSLER = [
  { key: 'yks_matematik', label: 'Matematik' },
  { key: 'yks_geometri', label: 'Geometri' },
  { key: 'yks_fizik', label: 'Fizik' },
  { key: 'yks_kimya', label: 'Kimya' },
  { key: 'yks_biyoloji', label: 'Biyoloji' },
  { key: 'yks_turkce', label: 'Türkçe' },
  { key: 'yks_edebiyat', label: 'Edebiyat' },
  { key: 'yks_tarih', label: 'Tarih' },
  { key: 'yks_cografya', label: 'Coğrafya' },
  { key: 'lgs_fen', label: 'LGS Fen Bilimleri' },
];

const RUTIN_SECENEKLERI = [
  { key: 'sure_0_1', label: 'Günde 1 saatten az' },
  { key: 'sure_1_2', label: 'Günde 1–2 saat' },
  { key: 'sure_2_4', label: 'Günde 2–4 saat' },
  { key: 'sure_4_plus', label: 'Günde 4 saatten fazla' },
  { key: 'duzensiz', label: 'Çok düzensiz' },
  { key: 'zaman_okul_sonrasi', label: 'Okuldan hemen sonra' },
  { key: 'zaman_aksam', label: 'Akşam saatlerinde' },
  { key: 'zaman_haftasonu', label: 'Ağırlıklı hafta sonu' },
];

const ORTAM_SECENEKLERI = [
  { key: 'yer_oda', label: 'Evde kendi odamda' },
  { key: 'yer_kutuphane', label: 'Kütüphanede' },
  { key: 'dd_telefon', label: 'Dikkat dağıtan: Telefon' },
  { key: 'dd_sosyal', label: 'Dikkat dağıtan: Sosyal Medya' },
  { key: 'dd_oyun', label: 'Dikkat dağıtan: Oyun' },
  { key: 'dd_uyku', label: 'Uyku düzenim bozuk' },
];

export default function NetlerimScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'denemeler' | 'hesaplama' | 'kocluk'>('denemeler');

  // --- SEKME 1: DENEMELER & HEDEF ---
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [targetRankInput, setTargetRankInput] = useState('');
  const [savingTarget, setSavingTarget] = useState(false);

  // Deneme Ekle Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<'tyt' | 'ayt' | 'lgs' | 'ydt'>('tyt');
  const [correctCount, setCorrectCount] = useState('');
  const [wrongCount, setWrongCount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // --- SEKME 2: YKS & LGS PUAN HESAPLAMA SİMÜLATÖRÜ ---
  const [calcMode, setCalcMode] = useState<CalcMode>('yks_say');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('tip_fak');
  const [obp, setObp] = useState<number>(90);
  // TYT (120)
  const [tytTurkce, setTytTurkce] = useState(30);
  const [tytSosyal, setTytSosyal] = useState(15);
  const [tytMat, setTytMat] = useState(26);
  const [tytFen, setTytFen] = useState(14);
  // AYT (80)
  const [aytMat, setAytMat] = useState(28);
  const [aytFen, setAytFen] = useState(25);
  const [aytEdebSos1, setAytEdebSos1] = useState(28);
  // LGS (90)
  const [lgsTurkce, setLgsTurkce] = useState(17);
  const [lgsMat, setLgsMat] = useState(15);
  const [lgsFen, setLgsFen] = useState(17);
  const [lgsSosyalIngDin, setLgsSosyalIngDin] = useState(27);

  // --- SEKME 3: KOÇLUK FORMU ---
  const [intakeGoals, setIntakeGoals] = useState<string[]>([]);
  const [intakeSubjects, setIntakeSubjects] = useState<string[]>([]);
  const [intakeRoutine, setIntakeRoutine] = useState<string[]>([]);
  const [intakeEnv, setIntakeEnv] = useState<string[]>([]);
  const [intakeWho, setIntakeWho] = useState<'kendim' | 'ailem' | 'ikimiz'>('ikimiz');
  const [intakeNotes, setIntakeNotes] = useState('');
  const [savingIntake, setSavingIntake] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const uid = session.user.id;
      const [{ data: examData }, { data: studentData }, { data: intakeRow }] = await Promise.all([
        supabase
          .from('student_exam_results')
          .select('*')
          .eq('student_id', uid)
          .order('exam_date', { ascending: false }),
        supabase
          .from('students')
          .select('target_rank')
          .eq('user_id', uid)
          .maybeSingle(),
        supabase
          .from('student_intake_forms')
          .select('goal, hard_subjects, daily_routine, study_environment, who_wanted, notes')
          .eq('student_id', uid)
          .maybeSingle(),
      ]);

      if (examData) {
        const formatted = examData.map((item: any) => {
          const penalty = item.exam_type === 'lgs' ? 3 : 4;
          const net = item.correct_count - item.wrong_count / penalty;
          return {
            id: item.id,
            exam_name: item.exam_name || 'Deneme Sınavı',
            exam_type: item.exam_type || 'tyt',
            exam_date: item.exam_date || item.created_at,
            correct_count: item.correct_count || 0,
            wrong_count: item.wrong_count || 0,
            net_count: Math.max(0, Number(net.toFixed(2))),
            created_at: item.created_at,
          };
        });
        setExams(formatted);
      }

      if (studentData?.target_rank) {
        setTargetRankInput(String(studentData.target_rank));
      }

      if (intakeRow) {
        setIntakeGoals(intakeRow.goal ?? []);
        setIntakeSubjects(intakeRow.hard_subjects ?? []);
        setIntakeRoutine(intakeRow.daily_routine ?? []);
        setIntakeEnv(intakeRow.study_environment ?? []);
        if (intakeRow.who_wanted) setIntakeWho(intakeRow.who_wanted as any);
        setIntakeNotes(intakeRow.notes ?? '');
      }
    } catch (e) {
      console.error('Veri yükleme hatası:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleSaveTargetRank = async () => {
    const rankNum = parseInt(targetRankInput.replace(/\D/g, ''), 10);
    if (isNaN(rankNum) || rankNum <= 0) {
      Alert.alert('Uyarı', 'Lütfen geçerli bir hedef sıralama girin (Örn: 15000).');
      return;
    }
    setSavingTarget(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase
        .from('students')
        .update({ target_rank: rankNum })
        .eq('user_id', session.user.id);

      if (error) throw error;
      Alert.alert('Kaydedildi 🎯', `Hedef sıralaman İlk ${rankNum.toLocaleString('tr-TR')} olarak güncellendi!`);
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Hedef kaydedilemedi.');
    } finally {
      setSavingTarget(false);
    }
  };

  const handleAddExam = async () => {
    if (!examName.trim()) {
      Alert.alert('Uyarı', 'Lütfen deneme adını yazın.');
      return;
    }
    const c = parseInt(correctCount, 10);
    const w = parseInt(wrongCount, 10);

    if (isNaN(c) || isNaN(w)) {
      Alert.alert('Uyarı', 'Lütfen geçerli doğru ve yanlış sayıları girin.');
      return;
    }

    setSubmitting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Oturum bulunamadı');

      const { error } = await supabase.from('student_exam_results').insert({
        student_id: session.user.id,
        exam_name: examName.trim(),
        exam_type: examType,
        exam_date: new Date().toISOString().slice(0, 10),
        correct_count: c,
        wrong_count: w,
      });

      if (error) {
        Alert.alert('Hata', error.message);
      } else {
        Alert.alert('Başarılı 🎉', 'Deneme netin kaydedildi!');
        setModalVisible(false);
        setExamName('');
        setCorrectCount('');
        setWrongCount('');
        fetchAllData();
      }
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Kayıt yapılamadı');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItem = (list: string[], setList: (v: string[]) => void, key: string) => {
    if (list.includes(key)) {
      setList(list.filter((k) => k !== key));
    } else {
      setList([...list, key]);
    }
  };

  const handleSaveIntake = async () => {
    setSavingIntake(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error('Oturum bulunamadı');

      const { error } = await supabase.from('student_intake_forms').upsert(
        {
          student_id: session.user.id,
          goal: intakeGoals.length > 0 ? intakeGoals : null,
          hard_subjects: intakeSubjects.length > 0 ? intakeSubjects : null,
          daily_routine: intakeRoutine.length > 0 ? intakeRoutine : null,
          study_environment: intakeEnv.length > 0 ? intakeEnv : null,
          who_wanted: intakeWho,
          notes: intakeNotes.trim().slice(0, 1000) || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id' }
      );

      if (error) throw error;
      Alert.alert(
        'Koçluk Formu Kaydedildi ✅',
        'Hedeflerin ve çalışma alışkanlıkların eğitmenlerin ve koçunla paylaşıldı.'
      );
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Koçluk formu kaydedilemedi.');
    } finally {
      setSavingIntake(false);
    }
  };

  // --- HESAPLAMA MOTORU ---
  const simResult = useMemo(() => {
    const activePresets = TARGET_PRESETS.filter((p) => p.mode === calcMode);
    const preset = activePresets.find((p) => p.id === selectedPresetId) || activePresets[0];

    if (calcMode === 'lgs') {
      const totalNet = lgsTurkce + lgsMat + lgsFen + lgsSosyalIngDin;
      const rawScore =
        194 + lgsTurkce * 4.3 + lgsMat * 4.9 + lgsFen * 4.1 + lgsSosyalIngDin * 1.6;
      const score = Math.min(500, Math.max(200, Number(rawScore.toFixed(1))));
      let percentile = '%15+ Yüzdelik';
      if (score >= 490) percentile = '%0.1 - %0.3 Yüzdelik';
      else if (score >= 470) percentile = '%0.8 - %1.5 Yüzdelik';
      else if (score >= 445) percentile = '%3 - %5 Yüzdelik';
      else if (score >= 410) percentile = '%8 - %12 Yüzdelik';

      const netGap = Math.max(0, (preset?.targetLgsNet ?? 81) - totalNet);
      return {
        totalPrimaryNet: totalNet,
        totalSecondaryNet: 0,
        score,
        rankLabel: percentile,
        netGap,
        preset,
      };
    }

    const totalTyt = tytTurkce + tytSosyal + tytMat + tytFen;
    const totalAyt = calcMode === 'yks_say' ? aytMat + aytFen : aytMat + aytEdebSos1;
    const obpContribution = obp * 0.6;
    const tytPart = 100 + totalTyt * 1.32;
    const aytPart = totalAyt * 3.05;
    const placementScore = Math.min(
      560,
      Math.max(180, Number((tytPart + aytPart + obpContribution).toFixed(1)))
    );

    let rankLabel = '150.000+ Sıralama';
    if (placementScore >= 525) rankLabel = 'İlk 2.500 Sıralama';
    else if (placementScore >= 492) rankLabel = 'İlk 15.000 Sıralama';
    else if (placementScore >= 460) rankLabel = 'İlk 35.000 Sıralama';
    else if (placementScore >= 435) rankLabel = 'İlk 60.000 Sıralama';
    else if (placementScore >= 400) rankLabel = 'İlk 110.000 Sıralama';

    const targetTotalNet = (preset?.targetTytNet ?? 90) + (preset?.targetAytNet ?? 60);
    const netGap = Math.max(0, targetTotalNet - (totalTyt + totalAyt));

    return {
      totalPrimaryNet: totalTyt,
      totalSecondaryNet: totalAyt,
      score: placementScore,
      rankLabel,
      netGap,
      preset,
    };
  }, [
    calcMode,
    selectedPresetId,
    obp,
    tytTurkce,
    tytSosyal,
    tytMat,
    tytFen,
    aytMat,
    aytFen,
    aytEdebSos1,
    lgsTurkce,
    lgsMat,
    lgsFen,
    lgsSosyalIngDin,
  ]);

  const totalExams = exams.length;
  const bestNet = exams.reduce((max, e) => Math.max(max, e.net_count || 0), 0);
  const latestNet = exams.length > 0 ? exams[0].net_count || 0 : 0;

  const renderStepper = (
    label: string,
    val: number,
    setVal: (v: number) => void,
    max: number
  ) => (
    <View style={styles.stepperRow} key={label}>
      <View style={{ flex: 1 }}>
        <Text style={styles.stepperLabel}>{label}</Text>
        <Text style={styles.stepperMax}>Maksimum {max} Soru</Text>
      </View>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          onPress={() => setVal(Math.max(0, val - 1))}
          style={styles.stepBtn}
        >
          <Ionicons name="remove" size={16} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.stepVal}>{val}</Text>
        <TouchableOpacity
          onPress={() => setVal(Math.min(max, val + 1))}
          style={[styles.stepBtn, { backgroundColor: '#10b981' }]}
        >
          <Ionicons name="add" size={16} color="#030712" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <LinearGradient colors={['#10b981', '#14b8a6']} style={styles.headerIcon}>
            <Ionicons name="trending-up" size={20} color="#030712" />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Netlerim, Puan & Koçluk</Text>
            <Text style={styles.headerSubtitle}>
              Deneme takibi, YKS/LGS puan hesaplama ve koçluk profili
            </Text>
          </View>
          {activeTab === 'denemeler' && (
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#030712" />
            </TouchableOpacity>
          )}
        </View>

        {/* 3 Sekmeli Üst Menü */}
        <View style={styles.topTabRow}>
          <TouchableOpacity
            onPress={() => setActiveTab('denemeler')}
            style={[styles.topTabBtn, activeTab === 'denemeler' && styles.topTabBtnActive]}
          >
            <Ionicons
              name="bar-chart-outline"
              size={14}
              color={activeTab === 'denemeler' ? '#030712' : '#94a3b8'}
            />
            <Text
              style={[styles.topTabText, activeTab === 'denemeler' && styles.topTabTextActive]}
            >
              Denemelerim
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('hesaplama')}
            style={[styles.topTabBtn, activeTab === 'hesaplama' && styles.topTabBtnActive]}
          >
            <Ionicons
              name="calculator-outline"
              size={14}
              color={activeTab === 'hesaplama' ? '#030712' : '#94a3b8'}
            />
            <Text
              style={[styles.topTabText, activeTab === 'hesaplama' && styles.topTabTextActive]}
            >
              Puan Hesapla
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('kocluk')}
            style={[styles.topTabBtn, activeTab === 'kocluk' && styles.topTabBtnActive]}
          >
            <Ionicons
              name="compass-outline"
              size={14}
              color={activeTab === 'kocluk' ? '#030712' : '#94a3b8'}
            />
            <Text
              style={[styles.topTabText, activeTab === 'kocluk' && styles.topTabTextActive]}
            >
              Koçluk Formu
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* İÇERİK */}
      {activeTab === 'denemeler' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />
          }
        >
          {/* Quick Stats Grid */}
          <View style={[styles.statsGrid, { marginTop: 0, marginBottom: 16 }]}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Toplam Deneme</Text>
              <Text style={styles.statVal}>{totalExams}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>En Yüksek Net</Text>
              <Text style={[styles.statVal, { color: '#10b981' }]}>{bestNet.toFixed(1)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Son Deneme</Text>
              <Text style={[styles.statVal, { color: '#00e5ff' }]}>{latestNet.toFixed(1)}</Text>
            </View>
          </View>

          {/* Hedef Sıralama Kartı */}
          <View style={styles.targetCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Ionicons name="flag" size={16} color="#f59e0b" />
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>
                Hedef Sıralamam (YKS / LGS)
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TextInput
                style={[styles.textInput, { flex: 1, marginBottom: 0, paddingVertical: 10 }]}
                placeholder="Örn: 15000"
                placeholderTextColor="#64748b"
                keyboardType="numeric"
                value={targetRankInput}
                onChangeText={setTargetRankInput}
              />
              <TouchableOpacity
                onPress={handleSaveTargetRank}
                disabled={savingTarget}
                style={{
                  backgroundColor: '#f59e0b',
                  paddingHorizontal: 16,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: '#030712', fontWeight: '900', fontSize: 13 }}>
                  {savingTarget ? '...' : 'Kaydet'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Geçmiş Deneme Sınavları</Text>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#10b981" />
              <Text style={styles.loadingText}>Netler yükleniyor...</Text>
            </View>
          ) : exams.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="bar-chart-outline" size={56} color="#334155" />
              <Text style={styles.emptyTitle}>Henüz deneme kaydı girmedin.</Text>
              <Text style={styles.emptySub}>
                Girdiğin deneme sınavlarının doğru ve yanlışlarını kaydederek net artışını buradan takip edebilirsin.
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.emptyAddBtn}>
                <Ionicons name="add" size={16} color="#030712" style={{ marginRight: 6 }} />
                <Text style={styles.emptyAddBtnText}>İlk Denemeni Ekle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            exams.map((ex) => (
              <View key={ex.id} style={styles.examCard}>
                <View style={styles.examCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.examName}>{ex.exam_name}</Text>
                    <Text style={styles.examDate}>
                      {new Date(ex.exam_date).toLocaleDateString('tr-TR')}
                    </Text>
                  </View>
                  <View style={styles.examTypeBadge}>
                    <Text style={styles.examTypeBadgeText}>{ex.exam_type.toUpperCase()}</Text>
                  </View>
                </View>

                <View style={styles.examScoreRow}>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreItemLabel}>Doğru</Text>
                    <Text style={[styles.scoreItemVal, { color: '#10b981' }]}>
                      {ex.correct_count}
                    </Text>
                  </View>
                  <View style={styles.scoreItem}>
                    <Text style={styles.scoreItemLabel}>Yanlış</Text>
                    <Text style={[styles.scoreItemVal, { color: '#ef4444' }]}>
                      {ex.wrong_count}
                    </Text>
                  </View>
                  <View style={[styles.scoreItem, styles.scoreItemNet]}>
                    <Text style={styles.scoreItemNetLabel}>TOPLAM NET</Text>
                    <Text style={styles.scoreItemNetVal}>{ex.net_count}</Text>
                  </View>
                </View>
              </View>
            ))
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {activeTab === 'hesaplama' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Sınav Modu Seçici */}
          <View style={styles.calcModeRow}>
            {[
              { id: 'yks_say', label: 'YKS Sayısal' },
              { id: 'yks_ea', label: 'YKS Eşit Ağırlık' },
              { id: 'lgs', label: 'LGS (8. Sınıf)' },
            ].map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => {
                  setCalcMode(m.id as CalcMode);
                  const firstPreset = TARGET_PRESETS.find((p) => p.mode === m.id);
                  if (firstPreset) setSelectedPresetId(firstPreset.id);
                }}
                style={[styles.calcModeBtn, calcMode === m.id && styles.calcModeBtnActive]}
              >
                <Text
                  style={[
                    styles.calcModeBtnText,
                    calcMode === m.id && styles.calcModeBtnTextActive,
                  ]}
                >
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Canlı Sonuç Kartı */}
          <LinearGradient colors={['#064e3b', '#0f172a']} style={styles.simResultCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={styles.simResultLabel}>TAHMİNİ YERLEŞTİRME PUANI</Text>
                <Text style={styles.simResultScore}>{simResult.score}</Text>
              </View>
              <View style={styles.simRankBadge}>
                <Ionicons name="trophy" size={14} color="#f59e0b" />
                <Text style={styles.simRankBadgeText}>{simResult.rankLabel}</Text>
              </View>
            </View>

            <View style={styles.simSummaryRow}>
              <Text style={styles.simSummaryText}>
                {calcMode === 'lgs'
                  ? `Toplam LGS Neti: ${simResult.totalPrimaryNet} / 90`
                  : `TYT Neti: ${simResult.totalPrimaryNet}/120 • AYT Neti: ${simResult.totalSecondaryNet}/80`}
              </Text>
              <Text style={[styles.simSummaryText, { color: simResult.netGap === 0 ? '#10b981' : '#fde68a' }]}>
                {simResult.netGap === 0
                  ? '🎉 Hedefinin Üzerindesin!'
                  : `Hedefe +${simResult.netGap} Net Kaldı`}
              </Text>
            </View>
          </LinearGradient>

          {/* Hedef Okul / Bölüm Seçimi */}
          <Text style={styles.sectionHeader}>Hedef Üniversite / Lise Seç</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
            contentContainerStyle={{ gap: 8 }}
          >
            {TARGET_PRESETS.filter((p) => p.mode === calcMode).map((p) => {
              const active = p.id === simResult.preset?.id;
              return (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPresetId(p.id)}
                  style={[styles.presetChip, active && styles.presetChipActive]}
                >
                  <Text style={[styles.presetChipTitle, active && { color: '#030712' }]}>
                    {p.label}
                  </Text>
                  <Text style={[styles.presetChipSub, active && { color: '#064e3b' }]}>
                    {p.badge} ({p.targetScore} Puan)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Net Kontrolleri */}
          <Text style={styles.sectionHeader}>Branş Netlerini Ayarla</Text>
          <View style={styles.steppersCard}>
            {calcMode !== 'lgs' ? (
              <>
                {renderStepper('Diploma Notu (OBP 50-100)', obp, setObp, 100)}
                {renderStepper('TYT Türkçe', tytTurkce, setTytTurkce, 40)}
                {renderStepper('TYT Matematik', tytMat, setTytMat, 40)}
                {renderStepper('TYT Fen Bilimleri', tytFen, setTytFen, 20)}
                {renderStepper('TYT Sosyal Bilimler', tytSosyal, setTytSosyal, 20)}
                {renderStepper('AYT Matematik', aytMat, setAytMat, 40)}
                {calcMode === 'yks_say'
                  ? renderStepper('AYT Fen Bilimleri', aytFen, setAytFen, 40)
                  : renderStepper('AYT Edebiyat - Sosyal 1', aytEdebSos1, setAytEdebSos1, 40)}
              </>
            ) : (
              <>
                {renderStepper('LGS Türkçe', lgsTurkce, setLgsTurkce, 20)}
                {renderStepper('LGS Matematik', lgsMat, setLgsMat, 20)}
                {renderStepper('LGS Fen Bilimleri', lgsFen, setLgsFen, 20)}
                {renderStepper('LGS İnkılap + Din + İngilizce', lgsSosyalIngDin, setLgsSosyalIngDin, 30)}
              </>
            )}
          </View>

          {/* L.A.B. Deney Merkezi Yönlendirmesi */}
          <TouchableOpacity
            onPress={() => router.push('/dashboard/lab' as any)}
            style={styles.labShortcutCard}
          >
            <Ionicons name="flask" size={22} color="#00e5ff" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 14 }}>
                Net Artışı İçin 3D L.A.B. Deneylerine Geç
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>
                Eksik olduğun branşlardaki kavramları interaktif simülasyonla pekiştir.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#00e5ff" />
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {activeTab === 'kocluk' && (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.intakeInfoBanner}>
            <Ionicons name="information-circle-outline" size={18} color="#38bdf8" />
            <Text style={styles.intakeInfoText}>
              Koçunun ve ders aldığın eğitmenlerin seni tanıması için hedeflerini ve çalışma düzenini seç. İstediğin zaman güncelleyebilirsin.
            </Text>
          </View>

          <Text style={styles.sectionHeader}>1. Hedeflerin Neler?</Text>
          <View style={styles.chipsWrap}>
            {HEDEF_SECENEKLERI.map((opt) => {
              const sel = intakeGoals.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => toggleItem(intakeGoals, setIntakeGoals, opt.key)}
                  style={[styles.optionChip, sel && styles.optionChipSelected]}
                >
                  <Text style={[styles.optionChipText, sel && styles.optionChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
            2. En Çok Zorlandığın Dersler
          </Text>
          <View style={styles.chipsWrap}>
            {ZORLANDIGI_DERSLER.map((opt) => {
              const sel = intakeSubjects.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => toggleItem(intakeSubjects, setIntakeSubjects, opt.key)}
                  style={[styles.optionChip, sel && styles.optionChipSelected]}
                >
                  <Text style={[styles.optionChipText, sel && styles.optionChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
            3. Günlük Çalışma Rutinin
          </Text>
          <View style={styles.chipsWrap}>
            {RUTIN_SECENEKLERI.map((opt) => {
              const sel = intakeRoutine.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => toggleItem(intakeRoutine, setIntakeRoutine, opt.key)}
                  style={[styles.optionChip, sel && styles.optionChipSelected]}
                >
                  <Text style={[styles.optionChipText, sel && styles.optionChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
            4. Çalışma Ortamın ve Dikkat Dağıtıcılar
          </Text>
          <View style={styles.chipsWrap}>
            {ORTAM_SECENEKLERI.map((opt) => {
              const sel = intakeEnv.includes(opt.key);
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => toggleItem(intakeEnv, setIntakeEnv, opt.key)}
                  style={[styles.optionChip, sel && styles.optionChipSelected]}
                >
                  <Text style={[styles.optionChipText, sel && styles.optionChipTextSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sectionHeader, { marginTop: 18 }]}>
            5. Eğitmenine / Koçuna Ek Notun
          </Text>
          <TextInput
            style={[styles.textInput, { minHeight: 80, textAlignVertical: 'top' }]}
            placeholder="Eklemek istediğin özel bir hedef veya durum varsa yazabilirsin..."
            placeholderTextColor="#64748b"
            multiline
            value={intakeNotes}
            onChangeText={setIntakeNotes}
          />

          <TouchableOpacity
            onPress={handleSaveIntake}
            disabled={savingIntake}
            style={[styles.modalSubmitBtn, { marginTop: 8 }, savingIntake && { opacity: 0.6 }]}
          >
            {savingIntake ? (
              <ActivityIndicator color="#030712" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={18} color="#030712" style={{ marginRight: 6 }} />
                <Text style={styles.modalSubmitBtnText}>Koçluk Formunu Kaydet</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}

      {/* Add Exam Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Deneme Sınavı Ekle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            {/* Exam Type Chips */}
            <Text style={styles.inputLabel}>Sınav Türü:</Text>
            <View style={styles.typeSelectorRow}>
              {(['tyt', 'ayt', 'lgs', 'ydt'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setExamType(t)}
                  style={[styles.typeBtn, examType === t && styles.typeBtnActive]}
                >
                  <Text style={[styles.typeBtnText, examType === t && styles.typeBtnTextActive]}>
                    {t.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Deneme Adı / Yayın:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: 3D Türkiye Geneli TYT-1"
              placeholderTextColor="#64748b"
              value={examName}
              onChangeText={setExamName}
            />

            <View style={styles.rowBetween}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>Doğru Sayısı:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: 85"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={correctCount}
                  onChangeText={setCorrectCount}
                />
              </View>
              <View style={{ flex: 1, marginLeft: 8 }}>
                <Text style={styles.inputLabel}>Yanlış Sayısı:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Örn: 15"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  value={wrongCount}
                  onChangeText={setWrongCount}
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddExam}
              disabled={submitting}
              style={[styles.modalSubmitBtn, submitting && { opacity: 0.6 }]}
            >
              {submitting ? (
                <ActivityIndicator color="#030712" />
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color="#030712"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.modalSubmitBtnText}>Neti Kaydet</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  header: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
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
    fontSize: 19,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTabRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  topTabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  topTabBtnActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  topTabText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  topTabTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 4,
  },
  targetCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#e2e8f0',
    marginBottom: 10,
  },
  loadingBox: {
    paddingVertical: 50,
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 13,
  },
  emptyBox: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginTop: 10,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginTop: 12,
  },
  emptySub: {
    color: '#94a3b8',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  emptyAddBtn: {
    marginTop: 16,
    backgroundColor: '#10b981',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyAddBtnText: {
    color: '#030712',
    fontWeight: '800',
    fontSize: 13,
  },
  examCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  examCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  examName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  examDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  examTypeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
  },
  examTypeBadgeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '800',
  },
  examScoreRow: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreItem: {
    flex: 1,
    backgroundColor: '#030712',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  scoreItemLabel: {
    fontSize: 11,
    color: '#94a3b8',
  },
  scoreItemVal: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 2,
  },
  scoreItemNet: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  scoreItemNetLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#10b981',
  },
  scoreItemNetVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  calcModeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  calcModeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  calcModeBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderColor: '#10b981',
  },
  calcModeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  calcModeBtnTextActive: {
    color: '#10b981',
    fontWeight: '900',
  },
  simResultCard: {
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#10b981',
    marginBottom: 18,
  },
  simResultLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#a7f3d0',
    letterSpacing: 0.5,
  },
  simResultScore: {
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 2,
  },
  simRankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  simRankBadgeText: {
    color: '#fde68a',
    fontSize: 12,
    fontWeight: '800',
  },
  simSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },
  simSummaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  presetChip: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  presetChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  presetChipTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  presetChipSub: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 2,
  },
  steppersCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  stepperLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#f8fafc',
  },
  stepperMax: {
    fontSize: 11,
    color: '#64748b',
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepVal: {
    width: 34,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
  labShortcutCard: {
    marginTop: 16,
    backgroundColor: '#0c192c',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.35)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  intakeInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#0c192c',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 16,
  },
  intakeInfoText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  optionChipSelected: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10b981',
  },
  optionChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  optionChipTextSelected: {
    color: '#10b981',
    fontWeight: '800',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    borderTopWidth: 1,
    borderColor: '#1e293b',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeBtnText: {
    color: '#94a3b8',
    fontWeight: '700',
    fontSize: 12,
  },
  typeBtnTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  textInput: {
    backgroundColor: '#030712',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 14,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalSubmitBtn: {
    backgroundColor: '#10b981',
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  modalSubmitBtnText: {
    color: '#030712',
    fontWeight: '900',
    fontSize: 15,
  },
});
