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
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface LinkedStudent {
  id: string;
  name: string;
  email: string;
  creditBalance: number;
  gradeTrack?: string;
}

interface NextBooking {
  id: string;
  startTime: string;
  instructorName: string;
  meetLink: string | null;
  status: string;
}

export default function ParentDashboardHome() {
  const router = useRouter();

  const [parentName, setParentName] = useState<string>('Veli');
  const [students, setStudents] = useState<LinkedStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Student metrics
  const [nextBooking, setNextBooking] = useState<NextBooking | null>(null);
  const [monthLessonsCount, setMonthLessonsCount] = useState<number>(0);
  const [attendanceRate, setAttendanceRate] = useState<number | null>(null);
  const [pendingHomeworkCount, setPendingHomeworkCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Link Student Modal State
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Veli profilini al
      const { data: userData } = await supabase
        .from('users')
        .select('name')
        .eq('id', session.user.id)
        .single();

      if (userData?.name) {
        setParentName(userData.name);
      } else if (session.user.user_metadata?.name) {
        setParentName(session.user.user_metadata.name);
      }

      // 2. Bağlı öğrencileri al
      const { data: links, error: linksError } = await supabase
        .from('guardian_links')
        .select('student_id')
        .eq('guardian_id', session.user.id);

      if (linksError || !links || links.length === 0) {
        setStudents([]);
        setSelectedStudentId(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const studentIds = links.map((l) => l.student_id);

      // Öğrenci kullanıcı ve kredi bilgilerini çek
      const [{ data: studentUsers }, { data: studentRecords }] = await Promise.all([
        supabase.from('users').select('id, name, email').in('id', studentIds),
        supabase.from('students').select('user_id, credit_balance, grade_track').in('user_id', studentIds),
      ]);

      const creditsMap = new Map((studentRecords ?? []).map((s) => [s.user_id, s]));

      const loadedStudents: LinkedStudent[] = (studentUsers ?? []).map((u) => {
        const sRec = creditsMap.get(u.id);
        return {
          id: u.id,
          name: u.name || 'Öğrenci',
          email: u.email || '',
          creditBalance: sRec?.credit_balance ?? 0,
          gradeTrack: sRec?.grade_track ?? 'yks',
        };
      });

      setStudents(loadedStudents);

      // Seçili öğrenci yoksa veya mevcut liste dışındaysa ilkini seç
      const activeId =
        selectedStudentId && loadedStudents.some((s) => s.id === selectedStudentId)
          ? selectedStudentId
          : loadedStudents[0]?.id ?? null;

      setSelectedStudentId(activeId);

      if (activeId) {
        await loadStudentDetails(activeId);
      }
    } catch (err) {
      console.error('Veri yükleme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedStudentId]);

  const loadStudentDetails = async (studentId: string) => {
    try {
      // 1. Sıradaki ders ve bu ayki dersler
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, instructor_id, start_time, status, meet_link')
        .eq('student_id', studentId)
        .order('start_time', { ascending: true });

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let next: NextBooking | null = null;
      let monthCount = 0;
      let attendedCount = 0;
      let pastFinishedCount = 0;

      const instructorIds = new Set<string>();

      (bookingsData ?? []).forEach((b) => {
        const bDate = new Date(b.start_time);
        if (bDate.getMonth() === currentMonth && bDate.getFullYear() === currentYear && b.status === 'completed') {
          monthCount++;
        }

        if (b.status === 'completed') {
          attendedCount++;
          pastFinishedCount++;
        } else if (b.status === 'no_show') {
          pastFinishedCount++;
        }

        if (b.status === 'scheduled' && bDate >= now && !next) {
          next = {
            id: b.id,
            startTime: b.start_time,
            instructorName: 'Eğitmen',
            meetLink: b.meet_link,
            status: b.status,
          };
          instructorIds.add(b.instructor_id);
        }
      });

      // Eğitmen adını çek
      if (next && instructorIds.size > 0) {
        const targetInstId = Array.from(instructorIds)[0];
        const { data: instUser } = await supabase
          .from('users')
          .select('name')
          .eq('id', targetInstId)
          .single();
        if (instUser?.name && next) {
          (next as NextBooking).instructorName = instUser.name;
        }
      }

      setNextBooking(next);
      setMonthLessonsCount(monthCount);
      setAttendanceRate(
        pastFinishedCount > 0 ? Math.round((attendedCount / pastFinishedCount) * 100) : null
      );

      // 2. Bekleyen ödevler
      const { data: homeworkData } = await supabase
        .from('homework')
        .select('id, status')
        .eq('student_id', studentId)
        .eq('status', 'assigned');

      setPendingHomeworkCount(homeworkData?.length ?? 0);
    } catch (err) {
      console.error('Öğrenci detayları yükleme hatası:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    loadStudentDetails(id);
  };

  const handleLinkStudent = async () => {
    const cleanCode = linkCode.trim().toUpperCase();
    if (cleanCode.length !== 8) {
      setLinkError('Öğrenci bağlantı kodu 8 karakter olmalıdır.');
      return;
    }

    setLinkLoading(true);
    setLinkError('');

    try {
      const { data, error } = await supabase.rpc('redeem_guardian_code', {
        p_code: cleanCode,
      });

      if (error) {
        const msg = error.message;
        if (msg.includes('gecersiz ya da suresi dolmus')) {
          setLinkError('Kod geçersiz ya da süresi dolmuş. Öğrencinizden yeni kod isteyiniz.');
        } else if (msg.includes('yalnizca veli hesaplari')) {
          setLinkError('Bu işlem yalnızca veli hesapları için geçerlidir.');
        } else if (msg.includes('kendi')) {
          setLinkError('Kendi hesabınızı bağlayamazsınız.');
        } else {
          setLinkError(msg || 'Öğrenci bağlanırken bir sorun oluştu.');
        }
        setLinkLoading(false);
        return;
      }

      Alert.alert('Tebrikler!', 'Öğrenci hesabınıza başarıyla bağlandı.');
      setLinkModalVisible(false);
      setLinkCode('');
      loadData();
    } catch (err: any) {
      setLinkError(err?.message || 'Bir hata oluştu.');
    } finally {
      setLinkLoading(false);
    }
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Veli Paneli Yükleniyor...</Text>
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
            tintColor="#f97316"
          />
        }
      >
        {/* Üst Karşılama Barı */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeLabel}>İyi Günler,</Text>
            <Text style={styles.parentName}>{parentName}</Text>
          </View>
          <TouchableOpacity
            style={styles.addStudentIconBtn}
            onPress={() => {
              setLinkError('');
              setLinkCode('');
              setLinkModalVisible(true);
            }}
          >
            <Ionicons name="person-add-outline" size={20} color="#f97316" />
            <Text style={styles.addStudentBtnText}>Öğrenci Bağla</Text>
          </TouchableOpacity>
        </View>

        {/* Öğrenci Yoksa Boş Durum Kartı */}
        {students.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="school-outline" size={36} color="#f97316" />
            </View>
            <Text style={styles.emptyTitle}>Henüz Bir Öğrenci Bağlamadınız</Text>
            <Text style={styles.emptyDesc}>
              Çocuğunuzun derslerini, deneme netlerini ve ödevlerini izlemek için öğrencinizin DersoLab profilindeki 8 haneli tek kullanımlık veli kodunu girin.
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => {
                setLinkError('');
                setLinkCode('');
                setLinkModalVisible(true);
              }}
            >
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBtnInner}
              >
                <Ionicons name="key-outline" size={18} color="#ffffff" />
                <Text style={styles.emptyActionBtnText}>Öğrenci Kodu Gir</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Öğrenci Seçici Sekmeler (Birden fazla öğrenci varsa veya ekleme için) */}
            <View style={styles.studentTabsWrapper}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.studentTabsRow}>
                {students.map((st) => {
                  const isSelected = st.id === selectedStudentId;
                  return (
                    <TouchableOpacity
                      key={st.id}
                      style={[styles.studentTab, isSelected && styles.studentTabActive]}
                      onPress={() => handleSelectStudent(st.id)}
                    >
                      <Ionicons
                        name="person"
                        size={14}
                        color={isSelected ? '#ffffff' : '#71717a'}
                      />
                      <Text style={[styles.studentTabText, isSelected && styles.studentTabTextActive]}>
                        {st.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Seçili Öğrencinin Özet Metrikleri */}
            <View style={styles.metricsGrid}>
              {/* Kalan Kredi */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Kalan Kredi</Text>
                  <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                    <Ionicons name="flash-outline" size={16} color="#f97316" />
                  </View>
                </View>
                <Text style={styles.metricValue}>
                  {selectedStudent?.creditBalance ?? 0} <Text style={styles.metricSub}>Ders</Text>
                </Text>
                <TouchableOpacity
                  onPress={() => WebBrowser.openBrowserAsync('https://dersolab.com/dashboard/parent/paketler')}
                  style={{ marginTop: 6, backgroundColor: 'rgba(249, 115, 22, 0.18)', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 8, alignSelf: 'flex-start', borderWidth: 1, borderColor: 'rgba(249, 115, 22, 0.3)' }}
                  activeOpacity={0.7}
                >
                  <Text style={{ color: '#f97316', fontSize: 10, fontWeight: '800' }}>+ Kredi Satın Al</Text>
                </TouchableOpacity>
              </View>

              {/* Bu Ayki Dersler */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Bu Ay Yapılan</Text>
                  <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                    <Ionicons name="calendar-outline" size={16} color="#38bdf8" />
                  </View>
                </View>
                <Text style={styles.metricValue}>
                  {monthLessonsCount} <Text style={styles.metricSub}>Ders</Text>
                </Text>
              </View>

              {/* Katılım Oranı */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Katılım Oranı</Text>
                  <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Ionicons name="shield-checkmark-outline" size={16} color="#10b981" />
                  </View>
                </View>
                <Text style={styles.metricValue}>
                  {attendanceRate !== null ? `%${attendanceRate}` : '—'}
                </Text>
              </View>

              {/* Bekleyen Ödevler */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>Bekleyen Ödev</Text>
                  <View style={[styles.metricIconWrap, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                    <Ionicons name="book-outline" size={16} color="#a855f7" />
                  </View>
                </View>
                <Text style={styles.metricValue}>
                  {pendingHomeworkCount} <Text style={styles.metricSub}>Ödev</Text>
                </Text>
              </View>
            </View>

            {/* Sıradaki Canlı Ders Kartı */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sıradaki Canlı Ders</Text>
              {nextBooking ? (
                <View style={styles.nextLessonCard}>
                  <View style={styles.nextLessonHeader}>
                    <View style={styles.nextLessonIconBox}>
                      <Ionicons name="videocam" size={22} color="#f97316" />
                    </View>
                    <View style={styles.nextLessonInfo}>
                      <Text style={styles.nextLessonInstructor}>{nextBooking.instructorName}</Text>
                      <Text style={styles.nextLessonDate}>
                        {new Date(nextBooking.startTime).toLocaleString('tr-TR', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </Text>
                    </View>
                    <View style={styles.scheduledBadge}>
                      <Text style={styles.scheduledBadgeText}>Planlandı</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.meetBtn}
                    onPress={() => {
                      const url = nextBooking.meetLink || `https://dersolab.com/canli-ders/${nextBooking.id}`;
                      Linking.openURL(url);
                    }}
                  >
                    <Ionicons name="videocam-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.meetBtnText}>
                      {nextBooking.meetLink ? 'Google Meet ile Derse Katıl' : 'Canlı Ders Odasını Aç (DersoLab)'}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.noLessonCard}>
                  <Ionicons name="calendar-clear-outline" size={24} color="#52525b" />
                  <Text style={styles.noLessonText}>Yakın zamanda planlanmış bir canlı ders yok.</Text>
                </View>
              )}
            </View>

            {/* Haftalık Gelişim Raporu Paylaşım Kartı */}
            <View style={styles.section}>
              <View style={styles.reportCard}>
                <View style={styles.reportLeft}>
                  <View style={styles.reportIconBox}>
                    <Ionicons name="document-text-outline" size={20} color="#22c55e" />
                  </View>
                  <View>
                    <Text style={styles.reportTitle}>Haftalık Gelişim Raporu</Text>
                    <Text style={styles.reportSub}>Öğrencinin ders, katılım ve ödev özeti</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.whatsappBtn}
                  onPress={() => {
                    const currentSt = students.find((s) => s.id === selectedStudentId);
                    const text = encodeURIComponent(
                      `*DersoLab Veli Bilgilendirme Raporu*\n` +
                      `👤 Öğrenci: ${currentSt?.name || 'Öğrenci'}\n` +
                      `⚡ Kalan Ders Kredisi: ${currentSt?.creditBalance || 0}\n` +
                      `📚 Bu Ayki Dersler: ${monthLessonsCount}\n` +
                      `🎯 Ders Katılım Oranı: %${attendanceRate ?? 100}\n` +
                      `📝 Bekleyen Ödev: ${pendingHomeworkCount}\n` +
                      `🌐 DersoLab: https://dersolab.com`
                    );
                    Linking.openURL(`https://api.whatsapp.com/send?text=${text}`);
                  }}
                >
                  <Ionicons name="logo-whatsapp" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.whatsappBtnText}>WhatsApp İle Gönder</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Hızlı Kısayollar */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
              <View style={styles.shortcutsRow}>
                <TouchableOpacity
                  style={styles.shortcutCard}
                  onPress={() => router.push('/dashboard/lessons')}
                >
                  <View style={[styles.shortcutIconWrap, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
                    <Ionicons name="time-outline" size={22} color="#f97316" />
                  </View>
                  <Text style={styles.shortcutTitle}>Ders Geçmişi</Text>
                  <Text style={styles.shortcutDesc}>Tüm dersler ve eğitmen notları</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.shortcutCard}
                  onPress={() => router.push('/dashboard/progress')}
                >
                  <View style={[styles.shortcutIconWrap, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
                    <Ionicons name="bar-chart-outline" size={22} color="#38bdf8" />
                  </View>
                  <Text style={styles.shortcutTitle}>Deneme Netleri</Text>
                  <Text style={styles.shortcutDesc}>Sınav skorları ve ödevler</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.aiAdvisorBanner}
                onPress={() => router.push('/dashboard/ai')}
              >
                <LinearGradient
                  colors={['rgba(99, 102, 241, 0.15)', 'rgba(249, 115, 22, 0.15)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.aiAdvisorInner}
                >
                  <View style={styles.aiAdvisorIcon}>
                    <Ionicons name="sparkles" size={20} color="#f97316" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.aiAdvisorTitle}>Veli Rehberlik Danışmanı</Text>
                    <Text style={styles.aiAdvisorDesc}>
                      Sınav sürecinde çocuğunuza nasıl destek olabileceğinizi AI danışmanına danışın.
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#f97316" />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Öğrenci Bağlama Modalı */}
      <Modal
        visible={linkModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLinkModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleRow}>
                <Ionicons name="key-outline" size={20} color="#f97316" />
                <Text style={styles.modalTitle}>Öğrenci Hesabı Bağla</Text>
              </View>
              <TouchableOpacity
                onPress={() => setLinkModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Öğrencinizin DersoLab profilinde yer alan 8 haneli tek kullanımlık kodu giriniz.
            </Text>

            {linkError ? (
              <View style={styles.modalErrorBox}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.modalErrorText}>{linkError}</Text>
              </View>
            ) : null}

            <TextInput
              style={styles.codeInput}
              placeholder="Örn: 9K7X2M4P"
              placeholderTextColor="#52525b"
              value={linkCode}
              onChangeText={(text) => setLinkCode(text.toUpperCase())}
              maxLength={8}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleLinkStudent}
              disabled={linkLoading}
            >
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalSubmitBtnInner}
              >
                {linkLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="link" size={18} color="#ffffff" />
                    <Text style={styles.modalSubmitBtnText}>Bağlantıyı Tamamla</Text>
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
    backgroundColor: '#09090b',
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
  parentName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  addStudentIconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 6,
  },
  addStudentBtnText: {
    color: '#f97316',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    color: '#a1a1aa',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyActionBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  emptyActionBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  studentTabsWrapper: {
    marginBottom: 18,
  },
  studentTabsRow: {
    gap: 8,
  },
  studentTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  studentTabActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  studentTabText: {
    color: '#a1a1aa',
    fontSize: 13,
    fontWeight: '600',
  },
  studentTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    width: (width - 40 - 12) / 2,
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
  metricIconWrap: {
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
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  nextLessonCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 16,
    padding: 16,
  },
  nextLessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  nextLessonIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextLessonInfo: {
    flex: 1,
  },
  nextLessonInstructor: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  nextLessonDate: {
    color: '#a1a1aa',
    fontSize: 12,
    marginTop: 2,
  },
  scheduledBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  scheduledBadgeText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  meetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    borderRadius: 10,
    paddingVertical: 10,
    gap: 6,
  },
  meetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  noLessonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  noLessonText: {
    color: '#71717a',
    fontSize: 13,
    flex: 1,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  shortcutCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
  },
  shortcutIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  shortcutTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },
  shortcutDesc: {
    color: '#71717a',
    fontSize: 11,
    lineHeight: 14,
  },
  aiAdvisorBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  aiAdvisorInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  aiAdvisorIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(249, 115, 22, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAdvisorTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  aiAdvisorDesc: {
    color: '#a1a1aa',
    fontSize: 11,
    lineHeight: 15,
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
    marginBottom: 8,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSubtitle: {
    color: '#a1a1aa',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  modalErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
    gap: 8,
  },
  modalErrorText: {
    color: '#f87171',
    fontSize: 12,
    flex: 1,
  },
  codeInput: {
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    paddingVertical: 14,
    marginBottom: 16,
  },
  modalSubmitBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalSubmitBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  modalSubmitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  reportCard: {
    backgroundColor: '#18181b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
    gap: 12,
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  reportIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  reportSub: {
    fontSize: 12,
    color: '#a1a1aa',
    marginTop: 2,
  },
  whatsappBtn: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  whatsappBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
