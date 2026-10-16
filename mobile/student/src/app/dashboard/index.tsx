import React, { useEffect, useState } from 'react';
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
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

type Booking = {
  id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meet_link: string | null;
  instructor_name: string;
  subject_name?: string;
};

export default function DashboardHome() {
  const router = useRouter();
  const [studentName, setStudentName] = useState<string>('Öğrenci');
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Pomodoro State
  const [timerMode, setTimerMode] = useState<'study' | 'break'>('study');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerMode === 'study') {
              setCompletedSessions((c) => c + 1);
              setTimerMode('break');
              return 5 * 60;
            } else {
              setTimerMode('study');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeLeft, timerMode]);

  const loadDashboardData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Fetch user profile & student credits
      const [userRes, studentRes] = await Promise.all([
        supabase.from('users').select('name').eq('id', session.user.id).single(),
        supabase.from('students').select('credit_balance').eq('user_id', session.user.id).single(),
      ]);

      if (userRes.data?.name) {
        setStudentName(userRes.data.name);
      } else if (session.user.user_metadata?.full_name) {
        setStudentName(session.user.user_metadata.full_name);
      }

      if (studentRes.data) {
        setCreditBalance(studentRes.data.credit_balance ?? 0);
      }

      // 2. Fetch bookings
      const { data, error } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, status, meet_link, instructor_id')
        .eq('student_id', session.user.id)
        .order('start_time', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else if (data) {
        const instructorIds = [...new Set(data.map((b: any) => b.instructor_id).filter(Boolean))];
        let usersMap: Record<string, string> = {};

        if (instructorIds.length > 0) {
          const { data: usersData } = await supabase
            .from('users')
            .select('id, name')
            .in('id', instructorIds);

          if (usersData) {
            usersData.forEach((u: any) => {
              usersMap[u.id] = u.name;
            });
          }
        }

        const formatted: Booking[] = data.map((b: any) => ({
          id: b.id,
          start_time: b.start_time,
          end_time: b.end_time,
          status: b.status,
          meet_link: b.meet_link,
          instructor_name: usersMap[b.instructor_id] || 'Eğitmen',
          subject_name: 'Birebir Canlı Ders',
        }));

        setBookings(formatted);
      }
    } catch (e) {
      console.error('loadDashboardData error:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const upcoming = bookings.filter((b) => b.status === 'scheduled');
  const past = bookings.filter((b) => b.status !== 'scheduled');

  const openMeetLink = (url: string | null) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00e5ff" />
        }
      >
        {/* Top Header */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Merhaba, {studentName} 👋</Text>
            <Text style={styles.subtitle}>Bugünkü hedeflerine ve derslerine göz at.</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/dashboard/profile' as any)}
            style={styles.profileBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="person-circle-outline" size={38} color="#00e5ff" />
          </TouchableOpacity>
        </View>

        {/* Ferah Hızlı Başlatıcı Kartları (Quick Actions) */}
        <View style={styles.quickList}>
          {/* L.A.B. */}
          <TouchableOpacity
            style={styles.quickRowCard}
            onPress={() => router.push('/dashboard/lab' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#00e5ff18', '#3b82f60a']} style={styles.quickRowGradient}>
              <View style={[styles.quickRowIcon, { backgroundColor: '#00e5ff22' }]}>
                <Ionicons name="flask" size={24} color="#00e5ff" />
              </View>
              <View style={styles.quickRowTextWrap}>
                <Text style={styles.quickRowTitle}>L.A.B. Deney Merkezi</Text>
                <Text style={styles.quickRowSub}>7 Branş: Fizik, Kimya, Biyo, Mat, İngilizce, Türkçe, Sosyal</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#00e5ff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* AI Soru */}
          <TouchableOpacity
            style={styles.quickRowCard}
            onPress={() => router.push('/dashboard/ai' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#ec489918', '#f43f5e0a']} style={styles.quickRowGradient}>
              <View style={[styles.quickRowIcon, { backgroundColor: '#ec489922' }]}>
                <Ionicons name="hardware-chip" size={24} color="#ec4899" />
              </View>
              <View style={styles.quickRowTextWrap}>
                <Text style={styles.quickRowTitle}>DersoAI Soru Asistanı</Text>
                <Text style={styles.quickRowSub}>Fotoğraf çek veya soru yaz, anında adım adım çözüme ulaş</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#ec4899" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Ödevlerim */}
          <TouchableOpacity
            style={styles.quickRowCard}
            onPress={() => router.push('/dashboard/homework' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#38bdf818', '#6366f10a']} style={styles.quickRowGradient}>
              <View style={[styles.quickRowIcon, { backgroundColor: '#38bdf822' }]}>
                <Ionicons name="school" size={24} color="#38bdf8" />
              </View>
              <View style={styles.quickRowTextWrap}>
                <Text style={styles.quickRowTitle}>Ödevlerim & Görevler</Text>
                <Text style={styles.quickRowSub}>Eğitmenlerinin verdiği ödevleri incele ve çözümlerini yükle</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#38bdf8" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Netlerim */}
          <TouchableOpacity
            style={styles.quickRowCard}
            onPress={() => router.push('/dashboard/netlerim' as any)}
            activeOpacity={0.8}
          >
            <LinearGradient colors={['#10b98118', '#14b8a60a']} style={styles.quickRowGradient}>
              <View style={[styles.quickRowIcon, { backgroundColor: '#10b98122' }]}>
                <Ionicons name="trending-up" size={24} color="#10b981" />
              </View>
              <View style={styles.quickRowTextWrap}>
                <Text style={styles.quickRowTitle}>Netlerim & Deneme Takibi</Text>
                <Text style={styles.quickRowSub}>LGS & YKS deneme sınavı net artışını ve hedeflerini gör</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#10b981" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Ferah Pomodoro Odak Masası */}
        <View style={styles.pomodoroCard}>
          <View style={styles.pomoHeader}>
            <View style={styles.rowAlign}>
              <Ionicons name="timer-outline" size={22} color="#f97316" style={{ marginRight: 8 }} />
              <Text style={styles.pomoTitle}>Pomodoro Odak Masası</Text>
            </View>
            <Text style={styles.pomoSub}>25 dk Derin Odaklanma • 5 dk Dinlenme</Text>
          </View>

          {/* Mod Butonları */}
          <View style={styles.pomoModeRow}>
            <TouchableOpacity
              onPress={() => {
                setTimerMode('study');
                setIsTimerRunning(false);
                setTimeLeft(25 * 60);
              }}
              style={[styles.pomoModePill, timerMode === 'study' && styles.pomoModePillStudy]}
            >
              <Text style={[styles.pomoModeText, timerMode === 'study' && styles.pomoModeTextActive]}>
                Ders Saati (25 Dk)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setTimerMode('break');
                setIsTimerRunning(false);
                setTimeLeft(5 * 60);
              }}
              style={[styles.pomoModePill, timerMode === 'break' && styles.pomoModePillBreak]}
            >
              <Text style={[styles.pomoModeText, timerMode === 'break' && styles.pomoModeTextActive]}>
                Mola (5 Dk)
              </Text>
            </TouchableOpacity>
          </View>

          {/* Saat ve Butonlar */}
          <View style={styles.pomoTimerBox}>
            <Text style={styles.pomoClockLarge}>{formattedTime}</Text>

            <View style={styles.pomoControls}>
              <TouchableOpacity
                onPress={() => setIsTimerRunning(!isTimerRunning)}
                style={[
                  styles.pomoBigPlayBtn,
                  isTimerRunning ? { backgroundColor: '#f97316' } : { backgroundColor: '#00e5ff' },
                ]}
              >
                <Ionicons
                  name={isTimerRunning ? 'pause' : 'play'}
                  size={20}
                  color="#030712"
                />
                <Text style={styles.pomoBigPlayText}>{isTimerRunning ? 'Durdur' : 'Odaklanmayı Başlat'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setIsTimerRunning(false);
                  setTimeLeft(timerMode === 'study' ? 25 * 60 : 5 * 60);
                }}
                style={styles.pomoResetIconBtn}
              >
                <Ionicons name="refresh" size={22} color="#94a3b8" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.pomoFooterBox}>
            <Ionicons name="flame" size={16} color="#f97316" style={{ marginRight: 6 }} />
            <Text style={styles.pomoCompletedText}>
              Bugün Tamamlanan:{' '}
              <Text style={{ color: '#ffffff', fontWeight: '800' }}>
                {completedSessions} Odak Seansı ({completedSessions * 25} dk)
              </Text>
            </Text>
          </View>
        </View>

        {/* Kalan Ders Kredisi Kartı */}
        <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.creditCard}>
          <View style={styles.creditTop}>
            <View>
              <Text style={styles.creditLabel}>Kalan Birebir Canlı Ders Kredin</Text>
              <Text style={styles.creditValue}>
                {creditBalance} <Text style={styles.creditUnit}>Kredi</Text>
              </Text>
            </View>
            <View style={styles.creditIconBox}>
              <Ionicons name="wallet-outline" size={24} color="#00e5ff" />
            </View>
          </View>

          <Text style={styles.creditSub}>
            {creditBalance > 0
              ? 'Onaylı eğitmenlerinden dilediğin zaman canlı ders randevusu alabilirsin.'
              : 'Ders kredisi yükleyerek birebir canlı derslere hemen başla.'}
          </Text>

          <TouchableOpacity
            style={styles.findInstructorFullBtn}
            onPress={() => router.push('/explore')}
          >
            <Ionicons name="search" size={18} color="#030712" style={{ marginRight: 8 }} />
            <Text style={styles.findInstructorFullBtnText}>Eğitmen Bul & Ders Ayarla</Text>
          </TouchableOpacity>
        </LinearGradient>

        {loading ? (
          <ActivityIndicator size="large" color="#00e5ff" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Yaklaşan Canlı Dersler */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yaklaşan Canlı Derslerin</Text>
                {upcoming.length > 0 ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{upcoming.length}</Text>
                  </View>
                ) : null}
              </View>

              {upcoming.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={32} color="#475569" style={{ marginBottom: 8 }} />
                  <Text style={styles.emptyText}>Henüz planlanmış aktif bir dersin yok.</Text>
                </View>
              ) : (
                upcoming.map((b) => (
                  <View key={b.id} style={styles.bookingCard}>
                    <View style={styles.bookingHeader}>
                      <Text style={styles.bookingSubject}>{b.subject_name}</Text>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>YAKLAŞIYOR</Text>
                      </View>
                    </View>
                    <Text style={styles.bookingInfo}>
                      📅 {formatDate(b.start_time)} • Eğitmen: {b.instructor_name}
                    </Text>

                    {b.meet_link ? (
                      <TouchableOpacity
                        style={styles.joinButton}
                        activeOpacity={0.8}
                        onPress={() => openMeetLink(b.meet_link)}
                      >
                        <Ionicons name="videocam" size={20} color="#030712" style={{ marginRight: 8 }} />
                        <Text style={styles.joinButtonText}>Canlı Derse Katıl (Google Meet)</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.joinButton, { backgroundColor: '#1e293b' }]}>
                        <Text style={[styles.joinButtonText, { color: '#64748b' }]}>
                          Meet Linki Bekleniyor...
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>

            {/* Geçmiş Dersler */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Geçmiş Dersler</Text>

              {past.length === 0 ? (
                <Text style={styles.emptyMutedText}>Henüz tamamlanan bir dersin yok.</Text>
              ) : (
                past.slice(0, 5).map((b) => (
                  <View key={b.id} style={[styles.bookingCard, styles.pastBookingCard]}>
                    <View style={styles.bookingHeader}>
                      <Text style={styles.bookingSubject}>{b.subject_name}</Text>
                      <Text style={styles.pastDate}>
                        {new Date(b.start_time).toLocaleDateString('tr-TR')}
                      </Text>
                    </View>
                    <Text style={styles.bookingInfo}>Eğitmen: {b.instructor_name}</Text>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  profileBtn: {
    padding: 4,
  },
  quickList: {
    gap: 12,
    marginBottom: 22,
  },
  quickRowCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  quickRowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  quickRowIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRowTextWrap: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  quickRowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  quickRowSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    lineHeight: 16,
  },
  pomodoroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 18,
    marginBottom: 22,
  },
  pomoHeader: {
    marginBottom: 14,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  pomoSub: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  pomoModeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  pomoModePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pomoModePillStudy: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  pomoModePillBreak: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  pomoModeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  pomoModeTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  pomoTimerBox: {
    backgroundColor: '#1e293b55',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pomoClockLarge: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 36,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    marginBottom: 12,
  },
  pomoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
  },
  pomoBigPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 14,
  },
  pomoBigPlayText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#030712',
  },
  pomoResetIconBtn: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomoFooterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  pomoCompletedText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  creditCard: {
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    marginBottom: 22,
  },
  creditTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditLabel: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  creditValue: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  creditUnit: {
    fontSize: 15,
    color: '#00e5ff',
    fontWeight: '700',
  },
  creditIconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditSub: {
    color: '#cbd5e1',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  findInstructorFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00e5ff',
    paddingVertical: 12,
    borderRadius: 14,
  },
  findInstructorFullBtnText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '900',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
  },
  countBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  countBadgeText: {
    color: '#00e5ff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    textAlign: 'center',
  },
  emptyMutedText: {
    color: '#64748b',
    fontSize: 13,
    fontStyle: 'italic',
  },
  bookingCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 12,
  },
  pastBookingCard: {
    opacity: 0.75,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bookingSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  badgeText: {
    color: '#00e5ff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pastDate: {
    color: '#64748b',
    fontSize: 12,
  },
  bookingInfo: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 14,
    lineHeight: 18,
  },
  joinButton: {
    backgroundColor: '#00e5ff',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '900',
  },
});
