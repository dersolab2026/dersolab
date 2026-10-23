import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

type LessonMaterial = {
  id: string;
  title: string;
  file_path: string;
  created_at: string;
};

type BookingItem = {
  id: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meet_link: string | null;
  instructor_id: string;
  instructor_name: string;
  topic_note?: string | null;
  subject_name?: string;
};

export default function LessonsScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();

  // Tekil ders görünümü
  const isDetailView = Boolean(id);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  // Tekil ders state
  const [singleBooking, setSingleBooking] = useState<BookingItem | null>(null);
  const [materials, setMaterials] = useState<LessonMaterial[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  // Tüm dersler listesi state
  const [allBookings, setAllBookings] = useState<BookingItem[]>([]);

  useEffect(() => {
    if (isDetailView && id) {
      fetchSingleLesson(id);
    } else {
      fetchAllLessons();
    }
  }, [id, isDetailView]);

  const onRefresh = () => {
    setRefreshing(true);
    if (isDetailView && id) {
      fetchSingleLesson(id);
    } else {
      fetchAllLessons();
    }
  };

  // 1. Tekil Ders Çek
  const fetchSingleLesson = async (lessonId: string) => {
    try {
      setLoading(true);
      setErrorMsg('');

      const { data: bookingData, error: bookingErr } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, status, meet_link, instructor_id, topic_note')
        .eq('id', lessonId)
        .single();

      if (bookingErr) throw bookingErr;

      let instructorName = 'Eğitmen';
      if (bookingData.instructor_id) {
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', bookingData.instructor_id)
          .single();
        if (userData?.name) instructorName = userData.name;
      }

      setSingleBooking({
        ...bookingData,
        instructor_name: instructorName,
      });

      // Materyaller
      const { data: materialsData } = await supabase
        .from('lesson_materials')
        .select('id, title, file_path, created_at')
        .eq('booking_id', lessonId)
        .order('created_at', { ascending: false });

      setMaterials(materialsData || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Ders detayları yüklenemedi.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 2. Tüm Dersleri Çek
  const fetchAllLessons = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, status, meet_link, instructor_id, topic_note')
        .eq('student_id', session.user.id)
        .order('start_time', { ascending: false });

      if (error) throw error;

      if (!bookingsData || bookingsData.length === 0) {
        setAllBookings([]);
        return;
      }

      // Eğitmen isimlerini al
      const instructorIds = Array.from(new Set(bookingsData.map((b) => b.instructor_id).filter(Boolean)));
      let instructorNameMap = new Map<string, string>();

      if (instructorIds.length > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('id, name')
          .in('id', instructorIds);

        instructorNameMap = new Map((usersData ?? []).map((u) => [u.id, u.name || 'Uzman Eğitmen']));
      }

      const formatted: BookingItem[] = bookingsData.map((b) => ({
        id: b.id,
        start_time: b.start_time,
        end_time: b.end_time,
        status: b.status,
        meet_link: b.meet_link,
        instructor_id: b.instructor_id,
        instructor_name: instructorNameMap.get(b.instructor_id) || 'Uzman Eğitmen',
        topic_note: b.topic_note,
        subject_name: b.topic_note || 'Birebir Canlı Ders',
      }));

      setAllBookings(formatted);
    } catch (err: any) {
      console.error('Tüm dersleri çekme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const openMaterial = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('lesson-materials')
        .createSignedUrl(filePath, 3600);

      if (error) throw error;
      if (data?.signedUrl) Linking.openURL(data.signedUrl);
    } catch (e) {
      alert('Dosya açılamadı.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const openClassroom = (booking: BookingItem) => {
    const url = booking.meet_link || `https://dersolab.com/canli-ders/${booking.id}`;
    Linking.openURL(url);
  };

  // ================= TEKİL DERS GÖRÜNÜMÜ =================
  if (isDetailView) {
    if (loading) {
      return (
        <View style={[styles.container, styles.centerBox]}>
          <ActivityIndicator size="large" color="#00e5ff" />
          <Text style={styles.loadingText}>Ders detayları açılıyor...</Text>
        </View>
      );
    }

    if (errorMsg || !singleBooking) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={[styles.container, styles.centerBox, { padding: 20 }]}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" style={{ marginBottom: 12 }} />
            <Text style={{ color: '#ef4444', marginBottom: 20, textAlign: 'center' }}>
              {errorMsg || 'Ders bulunamadı'}
            </Text>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/dashboard/lessons' as any)}>
              <Text style={{ color: '#030712', fontWeight: 'bold' }}>Derslerime Dön</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/dashboard/lessons' as any)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Ders & Materyaller</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Tarih & Saat</Text>
            <Text style={styles.infoValue}>{formatDate(singleBooking.start_time)}</Text>

            <View style={styles.divider} />

            <Text style={styles.infoLabel}>Eğitmen</Text>
            <Text style={styles.infoValue}>{singleBooking.instructor_name}</Text>

            {singleBooking.topic_note ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.infoLabel}>İşlenecek Konu / Not</Text>
                <Text style={styles.infoValue}>{singleBooking.topic_note}</Text>
              </>
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.infoLabel}>Durum</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {singleBooking.status === 'completed'
                  ? 'TAMAMLANDI'
                  : singleBooking.status === 'scheduled'
                  ? 'YAKLAŞIYOR'
                  : singleBooking.status === 'cancelled'
                  ? 'İPTAL EDİLDİ'
                  : singleBooking.status}
              </Text>
            </View>

            {/* Canlı Derse Katıl Butonu */}
            {singleBooking.status === 'scheduled' && (
              <TouchableOpacity
                style={styles.bigJoinBtn}
                activeOpacity={0.8}
                onPress={() => openClassroom(singleBooking)}
              >
                <LinearGradient
                  colors={['#00e5ff', '#3b82f6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.bigJoinBtnGradient}
                >
                  <Ionicons name="videocam" size={20} color="#030712" style={{ marginRight: 8 }} />
                  <Text style={styles.bigJoinBtnText}>
                    {singleBooking.meet_link ? 'Canlı Derse Katıl (Google Meet)' : 'Canlı Sınıfa Katıl (DersoLab)'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Ders Materyalleri & Kaynaklar</Text>

          {materials.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={48} color="#334155" />
              <Text style={styles.emptyText}>Bu derse ait henüz bir materyal yüklenmemiş.</Text>
            </View>
          ) : (
            materials.map((m) => (
              <TouchableOpacity
                key={m.id}
                style={styles.materialCard}
                onPress={() => openMaterial(m.file_path)}
              >
                <View style={styles.materialIcon}>
                  <Ionicons name="document-text" size={24} color="#ef4444" />
                </View>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialTitle}>{m.title}</Text>
                  <Text style={styles.materialDate}>
                    Yüklenme: {new Date(m.created_at).toLocaleDateString('tr-TR')}
                  </Text>
                </View>
                <Ionicons name="download-outline" size={20} color="#cbd5e1" />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ================= TÜM DERSLERİM LİSTESİ =================
  const upcomingLessons = allBookings.filter((b) => b.status === 'scheduled');
  const pastLessons = allBookings.filter((b) => b.status !== 'scheduled');
  const displayList = activeTab === 'upcoming' ? upcomingLessons : pastLessons;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Derslerim</Text>
            <Text style={styles.subtitle}>Birebir canlı derslerin ve geçmiş kayıtların</Text>
          </View>

          <TouchableOpacity
            style={styles.newLessonBtn}
            onPress={() => router.push('/dashboard/instructors' as any)}
          >
            <Ionicons name="add" size={16} color="#030712" style={{ marginRight: 4 }} />
            <Text style={styles.newLessonBtnText}>Yeni Ders Al</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabSwitcher}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'upcoming' && styles.tabBtnActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'upcoming' && styles.tabBtnTextActive]}>
              Yaklaşan Dersler ({upcomingLessons.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'past' && styles.tabBtnActive]}
            onPress={() => setActiveTab('past')}
          >
            <Text style={[styles.tabBtnText, activeTab === 'past' && styles.tabBtnTextActive]}>
              Geçmiş Dersler ({pastLessons.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste */}
      {loading ? (
        <View style={[styles.container, styles.centerBox]}>
          <ActivityIndicator size="large" color="#00e5ff" />
          <Text style={styles.loadingText}>Dersleriniz yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00e5ff" />
          }
        >
          {displayList.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="calendar-outline" size={54} color="#334155" style={{ marginBottom: 14 }} />
              <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming'
                  ? 'Planlanmış Aktif Bir Dersin Yok'
                  : 'Henüz Tamamlanan Bir Dersin Yok'}
              </Text>
              <Text style={styles.emptySub}>
                {activeTab === 'upcoming'
                  ? 'Hedefine ulaşmak için eğitmenlerimizden dilediğin zaman canlı ders randevusu alabilirsin.'
                  : 'Derslerin tamamlandıkça geçmiş kayıtların ve ders notların burada listelenecek.'}
              </Text>

              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  style={styles.findTutorBigBtn}
                  onPress={() => router.push('/dashboard/instructors' as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#00e5ff', '#3b82f6']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.findTutorBigBtnGradient}
                  >
                    <Ionicons name="search" size={18} color="#030712" style={{ marginRight: 8 }} />
                    <Text style={styles.findTutorBigBtnText}>Eğitmen Bul & Ders Ayarla</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            displayList.map((b) => (
              <View key={b.id} style={[styles.lessonCard, b.status !== 'scheduled' && styles.pastLessonCard]}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardSubject}>{b.topic_note || 'Birebir Canlı Ders'}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      b.status === 'completed'
                        ? { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: 'rgba(34, 197, 94, 0.3)' }
                        : b.status === 'cancelled'
                        ? { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)' }
                        : { backgroundColor: 'rgba(0, 229, 255, 0.15)', borderColor: 'rgba(0, 229, 255, 0.3)' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        b.status === 'completed'
                          ? { color: '#22c55e' }
                          : b.status === 'cancelled'
                          ? { color: '#ef4444' }
                          : { color: '#00e5ff' },
                      ]}
                    >
                      {b.status === 'completed'
                        ? 'TAMAMLANDI'
                        : b.status === 'scheduled'
                        ? 'YAKLAŞIYOR'
                        : b.status === 'cancelled'
                        ? 'İPTAL EDİLDİ'
                        : b.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="calendar-outline" size={15} color="#94a3b8" />
                  <Text style={styles.infoMetaText}>{formatDate(b.start_time)}</Text>
                </View>

                <View style={styles.infoMetaRow}>
                  <Ionicons name="person-outline" size={15} color="#94a3b8" />
                  <Text style={styles.infoMetaText}>Eğitmen: <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>{b.instructor_name}</Text></Text>
                </View>

                {/* Butonlar */}
                <View style={styles.actionsRow}>
                  {b.status === 'scheduled' && (
                    <TouchableOpacity
                      style={styles.joinActionBtn}
                      onPress={() => openClassroom(b)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="videocam" size={16} color="#030712" style={{ marginRight: 6 }} />
                      <Text style={styles.joinActionBtnText}>Canlı Sınıfa Katıl</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.detailsActionBtn}
                    onPress={() => router.push(`/dashboard/lessons?id=${b.id}` as any)}
                  >
                    <Ionicons name="document-text-outline" size={16} color="#cbd5e1" style={{ marginRight: 6 }} />
                    <Text style={styles.detailsActionBtnText}>Materyaller</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  centerBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  newLessonBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00e5ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  newLessonBtnText: {
    color: '#030712',
    fontSize: 12,
    fontWeight: '900',
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabBtnActive: {
    backgroundColor: '#1e293b',
  },
  tabBtnText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  tabBtnTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  findTutorBigBtn: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  findTutorBigBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  findTutorBigBtnText: {
    color: '#030712',
    fontSize: 15,
    fontWeight: '900',
  },
  lessonCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
  },
  pastLessonCard: {
    opacity: 0.8,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardSubject: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  infoMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoMetaText: {
    color: '#94a3b8',
    fontSize: 13,
    marginLeft: 6,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  joinActionBtn: {
    flex: 1,
    backgroundColor: '#00e5ff',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  joinActionBtnText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: '900',
  },
  detailsActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsActionBtnText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  iconBtn: {
    padding: 6,
  },
  topBarTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
  },
  content: {
    padding: 20,
  },
  infoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 24,
  },
  infoLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#1e293b',
    marginVertical: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  badgeText: {
    color: '#00e5ff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  bigJoinBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 18,
  },
  bigJoinBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  bigJoinBtnText: {
    color: '#030712',
    fontSize: 14,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 12,
  },
  emptyBox: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  emptyText: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 10,
    textAlign: 'center',
  },
  materialCard: {
    backgroundColor: '#0f172a',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 10,
  },
  materialIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  materialDate: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
  backBtn: {
    backgroundColor: '#00e5ff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
