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
import * as WebBrowser from 'expo-web-browser';
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

  // Exam Countdown State
  const [selectedExam, setSelectedExam] = useState<'YKS' | 'LGS'>('YKS');
  const [examCountdown, setExamCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const targetDate = selectedExam === 'YKS'
        ? new Date('2027-06-19T10:15:00+03:00').getTime()
        : new Date('2027-06-06T09:30:00+03:00').getTime();
      const diff = Math.max(0, targetDate - Date.now());
      setExamCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [selectedExam]);

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

        {/* Canlı Sınav Geri Sayım Kartı */}
        <LinearGradient colors={['#1e1b4b', '#0f172a']} style={styles.countdownCard}>
          <View style={styles.countdownHeader}>
            <View style={styles.countdownTitleRow}>
              <Ionicons name="hourglass-outline" size={18} color="#a5b4fc" style={{ marginRight: 6 }} />
              <Text style={styles.countdownTitle}>Sınav Geri Sayımı</Text>
            </View>
            <View style={styles.examToggleRow}>
              <TouchableOpacity
                onPress={() => setSelectedExam('YKS')}
                style={[styles.examToggleBtn, selectedExam === 'YKS' && styles.examToggleBtnActive]}
              >
                <Text style={[styles.examToggleText, selectedExam === 'YKS' && styles.examToggleTextActive]}>YKS 2027</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedExam('LGS')}
                style={[styles.examToggleBtn, selectedExam === 'LGS' && styles.examToggleBtnActive]}
              >
                <Text style={[styles.examToggleText, selectedExam === 'LGS' && styles.examToggleTextActive]}>LGS 2027</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timerDigitsRow}>
            <View style={styles.timerDigitBox}>
              <Text style={styles.timerDigitNum}>{examCountdown.days}</Text>
              <Text style={styles.timerDigitLabel}>GÜN</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerDigitBox}>
              <Text style={styles.timerDigitNum}>{String(examCountdown.hours).padStart(2, '0')}</Text>
              <Text style={styles.timerDigitLabel}>SAAT</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerDigitBox}>
              <Text style={styles.timerDigitNum}>{String(examCountdown.minutes).padStart(2, '0')}</Text>
              <Text style={styles.timerDigitLabel}>DAKİKA</Text>
            </View>
            <Text style={styles.timerColon}>:</Text>
            <View style={styles.timerDigitBox}>
              <Text style={[styles.timerDigitNum, { color: '#f59e0b' }]}>{String(examCountdown.seconds).padStart(2, '0')}</Text>
              <Text style={styles.timerDigitLabel}>SANİYE</Text>
            </View>
          </View>
          <Text style={styles.countdownSub}>
            {selectedExam === 'YKS' ? '19-20 Haziran 2027 • Üniversite hedefin seni bekliyor!' : '6 Haziran 2027 • Hayalindeki lise için hazır ol!'}
          </Text>
        </LinearGradient>

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

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[styles.findInstructorFullBtn, { flex: 1.6 }]}
              onPress={() => router.push('/dashboard/instructors' as any)}
            >
              <Ionicons name="search" size={16} color="#030712" style={{ marginRight: 6 }} />
              <Text style={styles.findInstructorFullBtnText}>Eğitmen Bul</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.findInstructorFullBtn,
                {
                  flex: 1.2,
                  backgroundColor: 'rgba(0, 229, 255, 0.15)',
                  borderWidth: 1,
                  borderColor: 'rgba(0, 229, 255, 0.4)',
                },
              ]}
              onPress={() => WebBrowser.openBrowserAsync('https://dersolab.com/dashboard/student/packages')}
            >
              <Ionicons name="card-outline" size={16} color="#00e5ff" style={{ marginRight: 6 }} />
              <Text style={[styles.findInstructorFullBtnText, { color: '#00e5ff' }]}>Kredi Al</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {loading ? (
          <ActivityIndicator size="large" color="#00e5ff" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Yaklaşan Canlı Dersler */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.sectionTitle}>Yaklaşan Canlı Derslerin</Text>
                  {upcoming.length > 0 ? (
                    <View style={styles.countBadge}>
                      <Text style={styles.countBadgeText}>{upcoming.length}</Text>
                    </View>
                  ) : null}
                </View>
                <TouchableOpacity onPress={() => router.push('/dashboard/lessons' as any)}>
                  <Text style={{ color: '#00e5ff', fontSize: 13, fontWeight: '700' }}>Tüm Derslerim →</Text>
                </TouchableOpacity>
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

                    <TouchableOpacity
                      style={styles.joinButton}
                      activeOpacity={0.8}
                      onPress={() => {
                        const targetUrl = b.meet_link || `https://dersolab.com/canli-ders/${b.id}`;
                        openMeetLink(targetUrl);
                      }}
                    >
                      <Ionicons name="videocam" size={20} color="#030712" style={{ marginRight: 8 }} />
                      <Text style={styles.joinButtonText}>
                        {b.meet_link ? 'Canlı Derse Katıl (Google Meet)' : 'Canlı Sınıfa Katıl (DersoLab)'}
                      </Text>
                    </TouchableOpacity>
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
    padding: 12,
    paddingTop: Platform.OS === 'android' ? 28 : 12,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  profileBtn: {
    padding: 2,
  },
  quickList: {
    gap: 8,
    marginBottom: 16,
  },
  quickRowCard: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  quickRowGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  quickRowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickRowTextWrap: {
    flex: 1,
    marginLeft: 10,
    marginRight: 6,
  },
  quickRowTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  quickRowSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 1,
    lineHeight: 15,
  },
  pomodoroCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 12,
    marginBottom: 16,
  },
  pomoHeader: {
    marginBottom: 12,
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pomoTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  pomoSub: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  pomoModeRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  pomoModePill: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
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
    fontSize: 11,
    fontWeight: '700',
    color: '#cbd5e1',
  },
  pomoModeTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  pomoTimerBox: {
    backgroundColor: '#1e293b55',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  pomoClockLarge: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 10,
  },
  pomoControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  pomoBigPlayBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  pomoBigPlayText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#030712',
  },
  pomoResetIconBtn: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pomoFooterBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  pomoCompletedText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  creditCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.25)',
    marginBottom: 16,
  },
  creditTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  creditLabel: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '700',
  },
  creditValue: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  creditUnit: {
    fontSize: 13,
    color: '#00e5ff',
    fontWeight: '700',
  },
  creditIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creditSub: {
    color: '#cbd5e1',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  findInstructorFullBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00e5ff',
    paddingVertical: 10,
    borderRadius: 12,
  },
  findInstructorFullBtnText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: '900',
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
  },
  countBadge: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  countBadgeText: {
    color: '#00e5ff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    textAlign: 'center',
  },
  emptyMutedText: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
  },
  bookingCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badge: {
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  badgeText: {
    color: '#00e5ff',
    fontSize: 9,
    fontWeight: 'bold',
  },
  pastDate: {
    color: '#64748b',
    fontSize: 11,
  },
  bookingInfo: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 10,
    lineHeight: 16,
  },
  joinButton: {
    backgroundColor: '#00e5ff',
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: '900',
  },
  countdownCard: {
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  countdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countdownTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#ffffff',
  },
  examToggleRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  examToggleBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  examToggleBtnActive: {
    backgroundColor: '#6366f1',
  },
  examToggleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '700',
  },
  examToggleTextActive: {
    color: '#ffffff',
  },
  timerDigitsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  timerDigitBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    flex: 1,
    maxWidth: 60,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  timerDigitNum: {
    fontSize: 17,
    fontWeight: '900',
    color: '#38bdf8',
    fontVariant: ['tabular-nums'],
  },
  timerDigitLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748b',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  timerColon: {
    fontSize: 14,
    fontWeight: '900',
    color: '#64748b',
    marginBottom: 8,
  },
  countdownSub: {
    fontSize: 11,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },
});
