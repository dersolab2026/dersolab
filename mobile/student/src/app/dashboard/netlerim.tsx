import React, { useEffect, useState } from 'react';
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

export default function NetlerimScreen() {
  const [exams, setExams] = useState<ExamResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [examName, setExamName] = useState('');
  const [examType, setExamType] = useState<'tyt' | 'ayt' | 'lgs' | 'ydt'>('tyt');
  const [correctCount, setCorrectCount] = useState('');
  const [wrongCount, setWrongCount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', session.user.id)
        .order('exam_date', { ascending: false });

      if (error) {
        console.error('Error fetching exam results:', error);
      } else if (data) {
        const formatted = data.map((item: any) => {
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
    } catch (e) {
      console.error('Exam load exception:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExams();
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Oturum bulunamadı');

      const { error } = await supabase.from('exam_results').insert({
        student_id: session.user.id,
        exam_name: examName.trim(),
        exam_type: examType,
        exam_date: new Date().toISOString().slice(0, 10),
        correct_count: c,
        wrong_count: w,
        sections: [],
      });

      if (error) {
        Alert.alert('Hata', error.message);
      } else {
        Alert.alert('Başarılı 🎉', 'Deneme netin kaydedildi!');
        setModalVisible(false);
        setExamName('');
        setCorrectCount('');
        setWrongCount('');
        fetchExams();
      }
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Kayıt yapılamadı');
    } finally {
      setSubmitting(false);
    }
  };

  const totalExams = exams.length;
  const bestNet = exams.reduce((max, e) => Math.max(max, e.net_count || 0), 0);
  const latestNet = exams.length > 0 ? (exams[0].net_count || 0) : 0;

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
            <Text style={styles.headerTitle}>Netlerim & Denemeler</Text>
            <Text style={styles.headerSubtitle}>LGS / YKS deneme sınavı net takibi ve grafikler</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.addBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={20} color="#030712" />
          </TouchableOpacity>
        </View>

        {/* Quick Stats Grid */}
        <View style={styles.statsGrid}>
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
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#10b981" />}
      >
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
                  <Text style={styles.examDate}>{new Date(ex.exam_date).toLocaleDateString('tr-TR')}</Text>
                </View>
                <View style={styles.examTypeBadge}>
                  <Text style={styles.examTypeBadgeText}>{ex.exam_type.toUpperCase()}</Text>
                </View>
              </View>

              <View style={styles.examScoreRow}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreItemLabel}>Doğru</Text>
                  <Text style={[styles.scoreItemVal, { color: '#10b981' }]}>{ex.correct_count}</Text>
                </View>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreItemLabel}>Yanlış</Text>
                  <Text style={[styles.scoreItemVal, { color: '#ef4444' }]}>{ex.wrong_count}</Text>
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
                  <Ionicons name="checkmark-circle" size={18} color="#030712" style={{ marginRight: 6 }} />
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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginTop: 4,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#cbd5e1',
    marginBottom: 12,
  },
  loadingBox: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 12,
  },
  emptyBox: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    marginTop: 14,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyAddBtnText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#030712',
  },
  examCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
    marginBottom: 12,
  },
  examCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  examName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  examDate: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  examTypeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  examTypeBadgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10b981',
  },
  examScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreItemLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '700',
  },
  scoreItemVal: {
    fontSize: 16,
    fontWeight: '900',
    marginTop: 2,
  },
  scoreItemNet: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    borderRadius: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  scoreItemNetLabel: {
    fontSize: 9,
    color: '#10b981',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  scoreItemNetVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#10b981',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
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
    marginTop: 10,
    marginBottom: 6,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94a3b8',
  },
  typeBtnTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  textInput: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#030712',
  },
});
