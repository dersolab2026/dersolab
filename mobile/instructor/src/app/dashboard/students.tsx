import React, { useEffect, useState, useCallback } from 'react';
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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

interface StudentInfo {
  id: string;
  name: string;
  lessonCount: number;
}

interface HomeworkItem {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
  createdAt: string;
}

export default function InstructorStudentsScreen() {
  const [activeTab, setActiveTab] = useState<'students' | 'homework'>('students');
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // New Homework modal
  const [modalVisible, setModalVisible] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState<string>('');
  const [hwTitle, setHwTitle] = useState('');
  const [hwDescription, setHwDescription] = useState('');
  const [hwDays, setHwDays] = useState(3);
  const [savingHw, setSavingHw] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Get all bookings for this instructor to find distinct students
      const { data: bookings } = await supabase
        .from('bookings')
        .select('id, student_id')
        .eq('instructor_id', session.user.id);

      const bookingList = bookings ?? [];
      const studentMap = new Map<string, number>();
      bookingList.forEach((b) => {
        studentMap.set(b.student_id, (studentMap.get(b.student_id) || 0) + 1);
      });

      const studentIds = Array.from(studentMap.keys());
      let studentNameMap = new Map<string, string>();

      if (studentIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', studentIds);

        studentNameMap = new Map((usersData ?? []).map((u) => [u.id, u.name || 'Öğrenci']));

        const studentList: StudentInfo[] = studentIds.map((id) => ({
          id,
          name: studentNameMap.get(id) || 'Öğrenci',
          lessonCount: studentMap.get(id) || 0,
        }));
        setStudents(studentList);
      } else {
        setStudents([]);
      }

      // 2. Get all homeworks given by this instructor
      const { data: hwData } = await supabase
        .from('homework')
        .select('id, student_id, title, description, due_date, status, created_at')
        .eq('instructor_id', session.user.id)
        .order('created_at', { ascending: false });

      if (hwData) {
        const formattedHw: HomeworkItem[] = hwData.map((h) => ({
          id: h.id,
          studentId: h.student_id,
          studentName: studentNameMap.get(h.student_id) || 'Öğrenci',
          title: h.title,
          description: h.description,
          dueDate: h.due_date,
          status: h.status,
          createdAt: h.created_at,
        }));
        setHomeworks(formattedHw);
      }
    } catch (err) {
      console.error('Öğrenci ve ödev verileri hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openAddHomework = (studentId?: string) => {
    if (studentId) {
      setTargetStudentId(studentId);
    } else if (students.length > 0) {
      setTargetStudentId(students[0].id);
    }
    setHwTitle('');
    setHwDescription('');
    setHwDays(3);
    setModalVisible(true);
  };

  const handleSaveHomework = async () => {
    if (!targetStudentId) {
      Alert.alert('Uyarı', 'Lütfen bir öğrenci seçiniz.');
      return;
    }
    if (!hwTitle.trim()) {
      Alert.alert('Uyarı', 'Lütfen ödev başlığını giriniz.');
      return;
    }

    setSavingHw(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const dueDateObj = new Date();
      dueDateObj.setDate(dueDateObj.getDate() + hwDays);
      const dueDateStr = dueDateObj.toISOString().split('T')[0]; // YYYY-MM-DD

      const { error } = await supabase.from('homework').insert({
        instructor_id: session.user.id,
        student_id: targetStudentId,
        title: hwTitle.trim(),
        description: hwDescription.trim() || null,
        due_date: dueDateStr,
        status: 'assigned',
      });

      if (error) {
        Alert.alert('Hata', error.message || 'Ödev kaydedilemedi.');
        setSavingHw(false);
        return;
      }

      Alert.alert('Başarılı', 'Ödev başarıyla öğrenciye iletildi.');
      setModalVisible(false);
      loadData();
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Bir hata oluştu.');
    } finally {
      setSavingHw(false);
    }
  };

  const handleUpdateStatus = async (hwId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'assigned' : 'completed';
    try {
      const { error } = await supabase
        .from('homework')
        .update({
          status: nextStatus,
          completed_at: nextStatus === 'completed' ? new Date().toISOString() : null,
        })
        .eq('id', hwId);

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }
      loadData();
    } catch (err: any) {
      Alert.alert('Hata', err?.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Öğrenci & Ödev Yönetimi</Text>
          <Text style={styles.headerSubtitle}>
            Ders aldığınız öğrencileri listeleyin ve yeni ödevler atayın
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addHwButton}
          onPress={() => openAddHomework()}
          disabled={students.length === 0}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addHwButtonText}>Ödev Ata</Text>
        </TouchableOpacity>
      </View>

      {/* Sekmeler */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'students' && styles.tabItemActive]}
          onPress={() => setActiveTab('students')}
        >
          <Ionicons
            name="people-outline"
            size={16}
            color={activeTab === 'students' ? '#818cf8' : '#71717a'}
          />
          <Text
            style={[styles.tabItemText, activeTab === 'students' && styles.tabItemTextActive]}
          >
            Öğrencilerim ({students.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'homework' && styles.tabItemActive]}
          onPress={() => setActiveTab('homework')}
        >
          <Ionicons
            name="document-text-outline"
            size={16}
            color={activeTab === 'homework' ? '#818cf8' : '#71717a'}
          />
          <Text
            style={[styles.tabItemText, activeTab === 'homework' && styles.tabItemTextActive]}
          >
            Verilen Ödevler ({homeworks.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadData();
            }}
            tintColor="#6366f1"
          />
        }
      >
        {activeTab === 'students' ? (
          /* Öğrenciler Listesi */
          students.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="people-outline" size={40} color="#52525b" />
              <Text style={styles.emptyTitle}>Kayıtlı Öğrenci Yok</Text>
              <Text style={styles.emptyDesc}>
                Sizinle canlı ders alan öğrenciler otomatik olarak burada listelenir.
              </Text>
            </View>
          ) : (
            <View style={styles.studentsList}>
              {students.map((student) => (
                <View key={student.id} style={styles.studentCard}>
                  <View style={styles.studentAvatarBox}>
                    <Text style={styles.studentAvatarText}>
                      {student.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName}>{student.name}</Text>
                    <Text style={styles.studentLessonCount}>
                      {student.lessonCount} toplam rezervasyon
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.assignHwBtn}
                    onPress={() => openAddHomework(student.id)}
                  >
                    <Ionicons name="create-outline" size={14} color="#818cf8" />
                    <Text style={styles.assignHwBtnText}>Ödev Ver</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )
        ) : (
          /* Ödevler Listesi */
          homeworks.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="reader-outline" size={40} color="#52525b" />
              <Text style={styles.emptyTitle}>Henüz Ödev Atanmadı</Text>
              <Text style={styles.emptyDesc}>
                Öğrencilerinize pekiştirme ödevleri vererek gelişimlerini destekleyebilirsiniz.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => openAddHomework()}
                disabled={students.length === 0}
              >
                <Text style={styles.emptyActionBtnText}>İlk Ödevi Tanımla</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.homeworkList}>
              {homeworks.map((hw) => {
                const isCompleted = hw.status === 'completed';
                return (
                  <View key={hw.id} style={styles.hwCard}>
                    <View style={styles.hwHeader}>
                      <View style={styles.hwStudentBadge}>
                        <Ionicons name="person-outline" size={12} color="#818cf8" />
                        <Text style={styles.hwStudentName}>{hw.studentName}</Text>
                      </View>
                      <TouchableOpacity
                        style={[
                          styles.statusBadge,
                          isCompleted ? styles.statusBadgeCompleted : styles.statusBadgePending,
                        ]}
                        onPress={() => handleUpdateStatus(hw.id, hw.status)}
                      >
                        <Ionicons
                          name={isCompleted ? 'checkmark-circle' : 'time-outline'}
                          size={13}
                          color={isCompleted ? '#10b981' : '#f59e0b'}
                        />
                        <Text
                          style={[
                            styles.statusBadgeText,
                            { color: isCompleted ? '#10b981' : '#f59e0b' },
                          ]}
                        >
                          {isCompleted ? 'Tamamlandı' : 'Bekliyor'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.hwTitle}>{hw.title}</Text>
                    {hw.description ? (
                      <Text style={styles.hwDescription}>{hw.description}</Text>
                    ) : null}

                    <View style={styles.hwFooter}>
                      <View style={styles.hwDateRow}>
                        <Ionicons name="calendar-outline" size={13} color="#71717a" />
                        <Text style={styles.hwDateText}>
                          Son Teslim: {hw.dueDate ? hw.dueDate : 'Belirtilmedi'}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          )
        )}
      </ScrollView>

      {/* Yeni Ödev Modalı */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Yeni Ödev Ata</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Öğrenci Seçimi */}
            <Text style={styles.inputLabel}>Öğrenci Seçin</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.studentChipsRow}
            >
              {students.map((s) => {
                const selected = targetStudentId === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.studentChip, selected && styles.studentChipActive]}
                    onPress={() => setTargetStudentId(s.id)}
                  >
                    <Text
                      style={[
                        styles.studentChipText,
                        selected && styles.studentChipTextActive,
                      ]}
                    >
                      {s.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Başlık */}
            <Text style={styles.inputLabel}>Ödev Konusu & Başlığı *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Örn: Kareköklü Sayılar - 40 Soru"
              placeholderTextColor="#52525b"
              value={hwTitle}
              onChangeText={setHwTitle}
            />

            {/* Açıklama */}
            <Text style={styles.inputLabel}>Açıklama & Detaylar</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Örn: Ders kitabından sf. 120-125 arasını çöz, yapamadığın soruların fotoğrafını yükle."
              placeholderTextColor="#52525b"
              value={hwDescription}
              onChangeText={setHwDescription}
              multiline
              numberOfLines={3}
            />

            {/* Süre / Son Teslim */}
            <Text style={styles.inputLabel}>Son Teslim Süresi</Text>
            <View style={styles.daysRow}>
              {[2, 3, 5, 7].map((days) => (
                <TouchableOpacity
                  key={days}
                  style={[styles.dayChip, hwDays === days && styles.dayChipActive]}
                  onPress={() => setHwDays(days)}
                >
                  <Text
                    style={[styles.dayChipText, hwDays === days && styles.dayChipTextActive]}
                  >
                    +{days} Gün
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Kaydet Butonu */}
            <TouchableOpacity
              style={styles.saveHwBtn}
              onPress={handleSaveHomework}
              disabled={savingHw}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveHwBtnInner}
              >
                {savingHw ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="paper-plane-outline" size={16} color="#ffffff" />
                    <Text style={styles.saveHwBtnText}>Ödevi Öğrenciye Gönder</Text>
                  </>
                )}
              </LinearGradient>
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
    backgroundColor: '#09090b',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  addHwButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
  },
  addHwButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.7)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderColor: 'rgba(99, 102, 241, 0.4)',
  },
  tabItemText: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  tabItemTextActive: {
    color: '#818cf8',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  studentsList: {
    gap: 10,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  studentAvatarBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  studentAvatarText: {
    color: '#818cf8',
    fontSize: 18,
    fontWeight: '800',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  studentLessonCount: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  assignHwBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  assignHwBtnText: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: '700',
  },
  homeworkList: {
    gap: 12,
  },
  hwCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
  },
  hwHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hwStudentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hwStudentName: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '700',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  statusBadgeCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  hwTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  hwDescription: {
    color: '#a1a1aa',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 10,
  },
  hwFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 8,
  },
  hwDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hwDateText: {
    color: '#71717a',
    fontSize: 11,
  },
  emptyCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyDesc: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyActionBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyActionBtnText: {
    color: '#818cf8',
    fontSize: 13,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    color: '#d4d4d8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  studentChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  studentChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  studentChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  studentChipText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  studentChipTextActive: {
    color: '#818cf8',
    fontWeight: '700',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dayChip: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingVertical: 10,
  },
  dayChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  dayChipText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  dayChipTextActive: {
    color: '#818cf8',
    fontWeight: '700',
  },
  saveHwBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveHwBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveHwBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
