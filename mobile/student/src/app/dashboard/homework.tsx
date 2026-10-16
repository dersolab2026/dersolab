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
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';

type HomeworkItem = {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'pending' | 'submitted' | 'completed';
  instructor_id: string;
  instructor_name?: string;
  submission_note?: string | null;
  created_at: string;
};

export default function HomeworkScreen() {
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Submit Modal
  const [selectedHw, setSelectedHw] = useState<HomeworkItem | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHomeworks();
  }, []);

  const fetchHomeworks = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('homework')
        .select('*')
        .eq('student_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Homework fetch error:', error);
      } else if (data) {
        // Fetch instructor names if any
        const instructorIds = [...new Set(data.map((h: any) => h.instructor_id).filter(Boolean))];
        let namesMap: Record<string, string> = {};

        if (instructorIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name')
            .in('id', instructorIds);
          if (usersData) {
            usersData.forEach((u: any) => {
              namesMap[u.id] = u.name;
            });
          }
        }

        const formatted = data.map((h: any) => ({
          ...h,
          instructor_name: namesMap[h.instructor_id] || 'Eğitmen',
        }));

        setHomeworks(formatted);
      }
    } catch (e) {
      console.error('Homework load exception:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchHomeworks();
  };

  const pickImage = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAttachedImage(res.assets[0].uri);
      }
    } catch {
      Alert.alert('Hata', 'Fotoğraf seçilemedi');
    }
  };

  const handleSubmitHomework = async () => {
    if (!selectedHw) return;
    if (!submissionNote.trim() && !attachedImage) {
      Alert.alert('Uyarı', 'Lütfen bir çözüm notu yazın veya fotoğraf ekleyin.');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('homework')
        .update({
          status: 'submitted',
          submission_note: submissionNote.trim(),
          submitted_at: new Date().toISOString(),
        })
        .eq('id', selectedHw.id);

      if (error) {
        Alert.alert('Hata', error.message);
      } else {
        Alert.alert('Tebrikler 🎉', 'Ödevin başarıyla eğitmene teslim edildi!');
        setSelectedHw(null);
        setSubmissionNote('');
        setAttachedImage(null);
        fetchHomeworks();
      }
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Ödev teslim edilemedi');
    } finally {
      setSubmitting(false);
    }
  };

  const pendingList = homeworks.filter((h) => h.status === 'pending');
  const completedList = homeworks.filter((h) => h.status === 'submitted' || h.status === 'completed');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <LinearGradient colors={['#38bdf8', '#6366f1']} style={styles.headerIcon}>
            <Ionicons name="school" size={20} color="#030712" />
          </LinearGradient>
          <View>
            <Text style={styles.headerTitle}>Ödevlerim & Görevler</Text>
            <Text style={styles.headerSubtitle}>Eğitmenlerinin verdiği ödevleri takip et ve teslim et</Text>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            onPress={() => setTab('pending')}
            style={[styles.tabBtn, tab === 'pending' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'pending' && styles.tabBtnTextActive]}>
              Teslim Bekleyenler ({pendingList.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setTab('completed')}
            style={[styles.tabBtn, tab === 'completed' && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, tab === 'completed' && styles.tabBtnTextActive]}>
              Tamamlananlar ({completedList.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#38bdf8" />}
      >
        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#38bdf8" />
            <Text style={styles.loadingText}>Ödevler yükleniyor...</Text>
          </View>
        ) : (tab === 'pending' ? pendingList : completedList).length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons
              name={tab === 'pending' ? 'checkmark-circle-outline' : 'folder-open-outline'}
              size={56}
              color="#334155"
            />
            <Text style={styles.emptyTitle}>
              {tab === 'pending' ? 'Harika! Bekleyen ödevin yok.' : 'Henüz tamamlanan ödev bulunmuyor.'}
            </Text>
            <Text style={styles.emptySub}>
              {tab === 'pending'
                ? 'Eğitmenlerin sana yeni ödev veya deney görevi atadığında burada görebilirsin.'
                : 'Teslim ettiğin ödevler değerlendirildikten sonra burada listelenir.'}
            </Text>
          </View>
        ) : (
          (tab === 'pending' ? pendingList : completedList).map((hw) => {
            const isCompleted = hw.status === 'completed';
            const isSubmitted = hw.status === 'submitted';

            return (
              <View key={hw.id} style={styles.hwCard}>
                <View style={styles.hwCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hwTitle}>{hw.title}</Text>
                    <Text style={styles.hwInstructor}>Eğitmen: {hw.instructor_name}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      isCompleted
                        ? styles.statusCompleted
                        : isSubmitted
                        ? styles.statusSubmitted
                        : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isCompleted
                          ? styles.statusTextCompleted
                          : isSubmitted
                          ? styles.statusTextSubmitted
                          : styles.statusTextPending,
                      ]}
                    >
                      {isCompleted ? 'Tamamlandı' : isSubmitted ? 'Teslim Edildi' : 'Bekliyor'}
                    </Text>
                  </View>
                </View>

                {hw.description ? <Text style={styles.hwDesc}>{hw.description}</Text> : null}

                <View style={styles.hwFooter}>
                  <View style={styles.rowAlign}>
                    <Ionicons name="time-outline" size={14} color="#94a3b8" style={{ marginRight: 4 }} />
                    <Text style={styles.dueDateText}>
                      Son Teslim: {hw.due_date ? new Date(hw.due_date).toLocaleDateString('tr-TR') : 'Süresiz'}
                    </Text>
                  </View>

                  {!isCompleted && !isSubmitted && (
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedHw(hw);
                        setSubmissionNote('');
                        setAttachedImage(null);
                      }}
                      style={styles.submitBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.submitBtnText}>Ödevi Teslim Et</Text>
                      <Ionicons name="arrow-forward" size={14} color="#030712" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Submission Modal */}
      <Modal visible={!!selectedHw} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Ödev Çözümü Teslim Et</Text>
              <TouchableOpacity onPress={() => setSelectedHw(null)}>
                <Ionicons name="close" size={24} color="#cbd5e1" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>{selectedHw?.title}</Text>

            <Text style={styles.inputLabel}>Çözüm Notun / Cevapların:</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Çözüm adımlarını veya cevabını buraya yazabilirsin..."
              placeholderTextColor="#64748b"
              multiline
              numberOfLines={4}
              value={submissionNote}
              onChangeText={setSubmissionNote}
            />

            {/* Photo Attachment */}
            <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
              <Ionicons
                name={attachedImage ? 'checkmark-circle' : 'camera-outline'}
                size={20}
                color={attachedImage ? '#10b981' : '#38bdf8'}
              />
              <Text style={[styles.uploadBtnText, attachedImage && { color: '#10b981' }]}>
                {attachedImage ? 'Çözüm Fotoğrafı Eklendi' : 'Defter / Soru Fotoğrafı Ekle'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitHomework}
              disabled={submitting}
              style={[styles.modalSubmitBtn, submitting && { opacity: 0.6 }]}
            >
              {submitting ? (
                <ActivityIndicator color="#030712" />
              ) : (
                <>
                  <Ionicons name="send" size={16} color="#030712" style={{ marginRight: 6 }} />
                  <Text style={styles.modalSubmitBtnText}>Eğitmene Gönder</Text>
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
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 4,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#38bdf8',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
  },
  tabBtnTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    gap: 12,
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
  hwCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 16,
  },
  hwCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  hwTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  hwInstructor: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statusSubmitted: {
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  statusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  statusTextPending: { color: '#f59e0b' },
  statusTextSubmitted: { color: '#38bdf8' },
  statusTextCompleted: { color: '#10b981' },
  hwDesc: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    marginVertical: 10,
  },
  hwFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#38bdf8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  submitBtnText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#030712',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  modalSub: {
    fontSize: 13,
    color: '#38bdf8',
    marginTop: 4,
    marginBottom: 16,
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
    marginBottom: 6,
  },
  textArea: {
    backgroundColor: '#1e293b',
    borderRadius: 14,
    padding: 12,
    color: '#ffffff',
    fontSize: 13,
    minHeight: 90,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#334155',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginVertical: 14,
  },
  uploadBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#38bdf8',
  },
  modalSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#38bdf8',
    paddingVertical: 14,
    borderRadius: 16,
  },
  modalSubmitBtnText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#030712',
  },
});
