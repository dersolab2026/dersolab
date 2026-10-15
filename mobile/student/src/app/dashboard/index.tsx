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

  useEffect(() => {
    loadDashboardData();
  }, []);

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00e5ff" />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Merhaba, {studentName} 👋</Text>
          <Text style={styles.subtitle}>Bugünkü hedeflerine ve derslerine göz at.</Text>
        </View>

        {/* Credit & Quick Action Card */}
        <LinearGradient
          colors={['#0f172a', '#1e293b']}
          style={styles.creditCard}
        >
          <View style={styles.creditTop}>
            <View>
              <Text style={styles.creditLabel}>Kalan Ders Kredin</Text>
              <Text style={styles.creditValue}>{creditBalance} <Text style={styles.creditUnit}>Kredi</Text></Text>
            </View>
            <View style={styles.creditIconBox}>
              <Ionicons name="sparkles" size={24} color="#00e5ff" />
            </View>
          </View>
          <Text style={styles.creditSub}>
            {creditBalance > 0
              ? 'Onaylı eğitmenlerinden dilediğin zaman randevu alabilirsin.'
              : 'Ders kredisi yükleyerek birebir canlı derslere hemen başla.'}
          </Text>

          {/* Quick Shortcuts */}
          <View style={styles.quickNavRow}>
            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => router.push('/dashboard/diary')}
            >
              <Ionicons name="book" size={16} color="#00e5ff" />
              <Text style={styles.quickNavText}>Günlüğüm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => router.push('/dashboard/ai')}
            >
              <Ionicons name="hardware-chip" size={16} color="#f59e0b" />
              <Text style={styles.quickNavText}>AI Soru Çöz</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickNavBtn}
              onPress={() => router.push('/explore')}
            >
              <Ionicons name="search" size={16} color="#10b981" />
              <Text style={styles.quickNavText}>Eğitmen Bul</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {loading ? (
          <ActivityIndicator size="large" color="#00e5ff" style={{ marginTop: 40 }} />
        ) : (
          <>
            {/* Upcoming Bookings */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yaklaşan Dersler</Text>
                {upcoming.length > 0 ? (
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{upcoming.length}</Text>
                  </View>
                ) : null}
              </View>

              {upcoming.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Ionicons name="calendar-outline" size={28} color="#475569" style={{ marginBottom: 6 }} />
                  <Text style={styles.emptyText}>Henüz planlanmış aktif bir dersin yok.</Text>
                  <TouchableOpacity
                    style={styles.findInstructorBtn}
                    onPress={() => router.push('/explore')}
                  >
                    <Text style={styles.findInstructorBtnText}>Eğitmenleri Keşfet</Text>
                  </TouchableOpacity>
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
                        <Ionicons name="videocam" size={18} color="#030712" style={{ marginRight: 6 }} />
                        <Text style={styles.joinButtonText}>Canlı Derse Katıl</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.joinButton, { backgroundColor: '#1e293b' }]}>
                        <Text style={[styles.joinButtonText, { color: '#64748b' }]}>
                          Meet Linki Oluşturuluyor...
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </View>

            {/* Past Bookings */}
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

                    <TouchableOpacity
                      style={styles.reviewButton}
                      onPress={() => router.push(`/dashboard/lessons?id=${b.id}`)}
                    >
                      <Text style={styles.reviewButtonText}>Ders Notları & Materyaller</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          </>
        )}

        <View style={{ height: 80 }} />
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
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  header: {
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  creditCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    marginBottom: 28,
  },
  creditTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  creditLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  creditValue: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  creditUnit: {
    fontSize: 16,
    color: '#00e5ff',
    fontWeight: '700',
  },
  creditIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  quickNavRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickNavBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quickNavText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
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
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  findInstructorBtn: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  findInstructorBtnText: {
    color: '#00e5ff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyMutedText: {
    color: '#64748b',
    fontSize: 14,
    fontStyle: 'italic',
  },
  bookingCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
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
  },
  joinButton: {
    backgroundColor: '#00e5ff',
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinButtonText: {
    color: '#030712',
    fontSize: 15,
    fontWeight: 'bold',
  },
  reviewButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  reviewButtonText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
  },
});
