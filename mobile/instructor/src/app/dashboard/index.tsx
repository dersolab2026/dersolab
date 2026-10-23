import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
  Modal,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface InstructorBooking {
  id: string;
  studentId: string;
  studentName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetLink: string | null;
}

export default function InstructorDashboardHome() {
  const router = useRouter();

  const [instructorName, setInstructorName] = useState<string>('Eğitmen');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [activeStudentsCount, setActiveStudentsCount] = useState<number>(0);
  const [rating, setRating] = useState<number>(5.0);

  const [upcomingLessons, setUpcomingLessons] = useState<InstructorBooking[]>([]);
  const [pendingActionLessons, setPendingActionLessons] = useState<InstructorBooking[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Complete lesson modal state
  const [selectedBooking, setSelectedBooking] = useState<InstructorBooking | null>(null);
  const [completeModalVisible, setCompleteModalVisible] = useState(false);
  const [lessonNote, setLessonNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Eğitmen Bilgilerini Al
      const [{ data: userData }, { data: instructorData }] = await Promise.all([
        supabase.from('users').select('name').eq('id', session.user.id).single(),
        supabase.from('instructors').select('verified, rating, total_reviews').eq('user_id', session.user.id).maybeSingle(),
      ]);

      if (userData?.name) {
        setInstructorName(userData.name);
      } else if (session.user.user_metadata?.name) {
        setInstructorName(session.user.user_metadata.name);
      }

      if (instructorData) {
        setIsVerified(instructorData.verified ?? false);
        setRating(instructorData.rating ?? 5.0);
      }

      // 2. Eğitmenin Tüm Derslerini Al
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, student_id, start_time, end_time, status, meet_link')
        .eq('instructor_id', session.user.id)
        .order('start_time', { ascending: true });

      const allBookings = bookingsData ?? [];

      // Öğrenci isimlerini topla
      const studentIds = Array.from(new Set(allBookings.map((b) => b.student_id)));
      let studentNameMap = new Map<string, string>();
      if (studentIds.length > 0) {
        const { data: studentUsers } = await supabase
          .from('users')
          .select('id, name')
          .in('id', studentIds);
        studentNameMap = new Map((studentUsers ?? []).map((u) => [u.id, u.name || 'Öğrenci']));
      }

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let compCount = 0;
      const upcoming: InstructorBooking[] = [];
      const pendingAction: InstructorBooking[] = [];

      allBookings.forEach((b) => {
        const bDate = new Date(b.start_time);
        const item: InstructorBooking = {
          id: b.id,
          studentId: b.student_id,
          studentName: studentNameMap.get(b.student_id) || 'Öğrenci',
          startTime: b.start_time,
          endTime: b.end_time,
          status: b.status,
          meetLink: b.meet_link,
        };

        if (b.status === 'completed') {
          if (bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear) {
            compCount++;
          }
        } else if (b.status === 'scheduled') {
          if (bDate < now) {
            // Saati geçmiş ama henüz tamamlandı işaretlenmemiş dersler
            pendingAction.push(item);
          } else {
            // Gelecek dersler
            upcoming.push(item);
          }
        }
      });

      setCompletedCount(compCount);
      setActiveStudentsCount(studentIds.length);
      setUpcomingLessons(upcoming);
      setPendingActionLessons(pendingAction);
    } catch (err) {
      console.error('Eğitmen paneli veri hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkComplete = async (status: 'completed' | 'no_show') => {
    if (!selectedBooking) return;
    setActionLoading(true);

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedBooking.id);

      if (error) {
        Alert.alert('Hata', error.message || 'Ders durumu güncellenemedi.');
        setActionLoading(false);
        return;
      }

      Alert.alert(
        'İşlem Başarılı',
        status === 'completed'
          ? 'Ders başarıyla tamamlandı olarak işaretlendi.'
          : 'Ders "Katılmadı" olarak işaretlendi.'
      );

      setCompleteModalVisible(false);
      setSelectedBooking(null);
      setLessonNote('');
      loadData();
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Bir sorun oluştu.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Eğitmen Paneli Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

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
        {/* Üst Karşılama Barı */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeLabel}>Hoş Geldiniz,</Text>
            <Text style={styles.instructorName}>{instructorName}</Text>
          </View>
          <View style={[styles.verifiedBadge, isVerified ? styles.verifiedActive : styles.verifiedPending]}>
            <Ionicons
              name={isVerified ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={isVerified ? '#10b981' : '#f59e0b'}
            />
            <Text style={[styles.verifiedText, { color: isVerified ? '#10b981' : '#f59e0b' }]}>
              {isVerified ? 'Onaylı Eğitmen' : 'İnceleniyor'}
            </Text>
          </View>
        </View>

        {/* Özet Metrikler */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Bu Ay Yapılan</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="school-outline" size={16} color="#818cf8" />
              </View>
            </View>
            <Text style={styles.metricValue}>
              {completedCount} <Text style={styles.metricSub}>Ders</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Aktif Öğrenci</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                <Ionicons name="people-outline" size={16} color="#38bdf8" />
              </View>
            </View>
            <Text style={styles.metricValue}>
              {activeStudentsCount} <Text style={styles.metricSub}>Kişi</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Eğitmen Puanı</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
                <Ionicons name="star" size={16} color="#f59e0b" />
              </View>
            </View>
            <Text style={styles.metricValue}>
              {rating.toFixed(1)} <Text style={styles.metricSub}>/ 5.0</Text>
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Planlanan</Text>
              <View style={[styles.metricIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Ionicons name="calendar-outline" size={16} color="#10b981" />
              </View>
            </View>
            <Text style={styles.metricValue}>
              {upcomingLessons.length} <Text style={styles.metricSub}>Ders</Text>
            </Text>
          </View>
        </View>

        {/* Aksiyon Gerektiren Tamamlanmamış Dersler (Uyarı Kartı) */}
        {pendingActionLessons.length > 0 && (
          <View style={styles.section}>
            <View style={styles.alertHeaderRow}>
              <Ionicons name="alert-circle" size={18} color="#f59e0b" />
              <Text style={styles.alertSectionTitle}>
                Tamamlanması Gereken Dersler ({pendingActionLessons.length})
              </Text>
            </View>
            <Text style={styles.alertSectionDesc}>
              Saati geçen dersleri tamamlandı olarak işaretleyiniz:
            </Text>

            <View style={styles.pendingLessonsList}>
              {pendingActionLessons.map((b) => (
                <View key={b.id} style={styles.pendingCard}>
                  <View style={styles.pendingInfo}>
                    <Text style={styles.pendingStudent}>{b.studentName}</Text>
                    <Text style={styles.pendingTime}>
                      {new Date(b.startTime).toLocaleString('tr-TR', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.completeBtn}
                    onPress={() => {
                      setSelectedBooking(b);
                      setCompleteModalVisible(true);
                    }}
                  >
                    <Text style={styles.completeBtnText}>Sonuçlandır</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Yaklaşan Canlı Dersler */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Yaklaşan Canlı Dersler</Text>
            <TouchableOpacity onPress={() => router.push('/dashboard/schedule')}>
              <Text style={styles.sectionLink}>Müsaitlikleri Düzenle</Text>
            </TouchableOpacity>
          </View>

          {upcomingLessons.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-clear-outline" size={36} color="#52525b" />
              <Text style={styles.emptyTitle}>Yaklaşan Dersiniz Yok</Text>
              <Text style={styles.emptySubtitle}>
                Öğrencilerin rezervasyon yapabilmesi için haftalık müsaitlik takviminizi güncel tutun.
              </Text>
              <TouchableOpacity
                style={styles.emptyActionBtn}
                onPress={() => router.push('/dashboard/schedule')}
              >
                <Text style={styles.emptyActionBtnText}>Müsaitlik Saatlerini Ayarla</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.lessonsList}>
              {upcomingLessons.map((b) => (
                <View key={b.id} style={styles.upcomingCard}>
                  <View style={styles.upcomingHeader}>
                    <View style={styles.upcomingIconBox}>
                      <Ionicons name="videocam" size={20} color="#818cf8" />
                    </View>
                    <View style={styles.upcomingInfo}>
                      <Text style={styles.upcomingStudent}>{b.studentName}</Text>
                      <Text style={styles.upcomingDate}>
                        {new Date(b.startTime).toLocaleString('tr-TR', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </Text>
                    </View>
                    <View style={styles.statusScheduledPill}>
                      <Text style={styles.statusScheduledText}>Planlandı</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.meetBtn}
                    onPress={() => {
                      const url = b.meetLink || `https://dersolab.com/canli-ders/${b.id}`;
                      Linking.openURL(url);
                    }}
                  >
                    <LinearGradient
                      colors={b.meetLink ? ['#6366f1', '#4f46e5'] : ['#06b6d4', '#0284c7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.meetBtnInner}
                    >
                      <Ionicons name="videocam-outline" size={16} color="#ffffff" />
                      <Text style={styles.meetBtnText}>
                        {b.meetLink ? 'Google Meet ile Derse Katıl' : 'DersoLab Canlı Sınıfını Başlat'}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Hızlı İşlem Kartları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Eğitmen Araçları</Text>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => router.push('/dashboard/students')}
            >
              <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
                <Ionicons name="book-outline" size={22} color="#818cf8" />
              </View>
              <Text style={styles.toolTitle}>Ödev Ver & Takip Et</Text>
              <Text style={styles.toolDesc}>Öğrencilerine yeni görev ata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toolCard}
              onPress={() => router.push('/dashboard/ai')}
            >
              <View style={[styles.toolIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <Ionicons name="sparkles-outline" size={22} color="#a855f7" />
              </View>
              <Text style={styles.toolTitle}>AI Ders & Soru</Text>
              <Text style={styles.toolDesc}>Kazanım ve yeni nesil soru üret</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Ders Tamamlama Modalı */}
      <Modal
        visible={completeModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCompleteModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Dersi Sonuçlandır</Text>
              <TouchableOpacity
                onPress={() => setCompleteModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalStudentInfo}>
              Öğrenci: <Text style={{ color: '#ffffff', fontWeight: '700' }}>{selectedBooking?.studentName}</Text>
            </Text>

            <Text style={styles.modalDesc}>
              Ders gerçekleştiyse "Tamamlandı" olarak işaretleyin. Öğrenci derse katılmadıysa "Katılmadı" seçeneğini belirleyebilirsiniz.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.noShowBtn}
                onPress={() => handleMarkComplete('no_show')}
                disabled={actionLoading}
              >
                <Text style={styles.noShowBtnText}>Katılmadı (No-Show)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.completeConfirmBtn}
                onPress={() => handleMarkComplete('completed')}
                disabled={actionLoading}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.completeConfirmInner}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={16} color="#ffffff" />
                      <Text style={styles.completeConfirmText}>Tamamlandı</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  instructorName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 5,
  },
  verifiedActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  verifiedPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 40 - 10) / 2,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  metricIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
  },
  metricSub: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionLink: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  alertSectionTitle: {
    color: '#f59e0b',
    fontSize: 15,
    fontWeight: '800',
  },
  alertSectionDesc: {
    color: '#a1a1aa',
    fontSize: 12,
    marginBottom: 10,
  },
  pendingLessonsList: {
    gap: 8,
  },
  pendingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 14,
    padding: 12,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingStudent: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  pendingTime: {
    color: '#d4d4d8',
    fontSize: 12,
    marginTop: 2,
  },
  completeBtn: {
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  completeBtnText: {
    color: '#09090b',
    fontSize: 12,
    fontWeight: '800',
  },
  emptyCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySubtitle: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  emptyActionBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  emptyActionBtnText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '700',
  },
  lessonsList: {
    gap: 12,
  },
  upcomingCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  upcomingIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingStudent: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  upcomingDate: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 2,
  },
  statusScheduledPill: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusScheduledText: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: '700',
  },
  meetBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  meetBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  meetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  toolsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  toolCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
  },
  toolIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  toolTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  toolDesc: {
    color: '#71717a',
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalStudentInfo: {
    color: '#a1a1aa',
    fontSize: 14,
    marginBottom: 8,
  },
  modalDesc: {
    color: '#71717a',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  modalButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  noShowBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    paddingVertical: 14,
  },
  noShowBtnText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '700',
  },
  completeConfirmBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  completeConfirmInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 6,
  },
  completeConfirmText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
