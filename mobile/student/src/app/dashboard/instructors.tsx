import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
  Image,
  RefreshControl,
  Dimensions,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface InstructorItem {
  id: string;
  name: string;
  avatar_url: string | null;
  bio: string | null;
  subjects: string[];
  lesson_price?: number;
  rating?: number;
  total_reviews?: number;
  completed_lesson_count?: number;
}

const POPULAR_SUBJECTS = [
  'Tümü',
  'TYT Matematik',
  'AYT Matematik',
  'Geometri',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Türkçe',
  'LGS Matematik',
  'LGS Fen Bilimleri',
  'İngilizce',
];

const TIME_SLOTS = [
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
];

export default function InstructorsScreen() {
  const router = useRouter();

  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Tümü');
  const [creditBalance, setCreditBalance] = useState<number>(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Booking Modal State
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [targetInstructor, setTargetInstructor] = useState<InstructorItem | null>(null);
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0); // 0: Bugün, 1: Yarın, ...
  const [selectedTime, setSelectedTime] = useState<string>('17:00');
  const [topicNote, setTopicNote] = useState<string>('');
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // 1. Öğrenci oturumu ve kalan kredi
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUserId(session.user.id);
        const { data: studentData } = await supabase
          .from('students')
          .select('credit_balance')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (studentData) {
          setCreditBalance(studentData.credit_balance ?? 0);
        }
      }

      // 2. Onaylı eğitmenleri çek
      // Önce instructor_profiles view'ı dene
      const { data: viewData, error: viewError } = await supabase
        .from('instructor_profiles')
        .select('*');

      if (!viewError && viewData && viewData.length > 0) {
        const formatted: InstructorItem[] = viewData.map((item: any) => ({
          id: item.id || item.user_id,
          name: item.name || 'Eğitmen',
          avatar_url: item.avatar_url,
          bio: item.bio,
          subjects: Array.isArray(item.subjects) ? item.subjects : [],
          lesson_price: item.lesson_price,
          rating: item.rating || 5.0,
          total_reviews: item.total_reviews || 0,
          completed_lesson_count: item.completed_lesson_count || 12,
        }));
        setInstructors(formatted);
      } else {
        // Fallback: instructors tablosundan çek
        const { data: rawInstructors } = await supabase
          .from('instructors')
          .select('user_id, bio, subjects, lesson_price');

        if (rawInstructors && rawInstructors.length > 0) {
          const userIds = rawInstructors.map((i) => i.user_id);
          const { data: userData } = await supabase
            .from('users')
            .select('id, name, avatar_url')
            .in('id', userIds);

          const nameMap = new Map((userData ?? []).map((u) => [u.id, u]));

          const formatted: InstructorItem[] = rawInstructors.map((item) => {
            const u = nameMap.get(item.user_id);
            return {
              id: item.user_id,
              name: u?.name || 'Uzman Eğitmen',
              avatar_url: u?.avatar_url || null,
              bio: item.bio,
              subjects: Array.isArray(item.subjects) ? item.subjects : [],
              lesson_price: item.lesson_price,
              rating: 5.0,
              total_reviews: 4,
              completed_lesson_count: 8,
            };
          });
          setInstructors(formatted);
        }
      }
    } catch (err) {
      console.error('Eğitmen yükleme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Filtreleme
  const filteredInstructors = instructors.filter((inst) => {
    const matchesSearch =
      inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inst.bio && inst.bio.toLowerCase().includes(searchQuery.toLowerCase())) ||
      inst.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject =
      selectedSubject === 'Tümü' ||
      inst.subjects.some((s) => s.toLowerCase().includes(selectedSubject.toLowerCase()));

    return matchesSearch && matchesSubject;
  });

  // Randevu Alma Akışı
  const openBookingModal = (instructor: InstructorItem) => {
    setTargetInstructor(instructor);
    setSelectedDateOffset(0);
    setSelectedTime('17:00');
    setTopicNote('');
    setBookingModalVisible(true);
  };

  const getTargetDate = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d;
  };

  const confirmBooking = async () => {
    if (!targetInstructor || !currentUserId) {
      Alert.alert('Giriş Gerekli', 'Ders ayarlamak için lütfen oturum açın.');
      return;
    }

    if (creditBalance < 1) {
      Alert.alert(
        'Yetersiz Kredi',
        'Canlı ders randevusu oluşturabilmek için en az 1 ders krediniz olmalıdır. Kredi yüklemek için web sitemizi ziyaret edebilirsiniz.',
        [{ text: 'Tamam' }]
      );
      return;
    }

    setBookingSubmitting(true);
    try {
      const targetDate = getTargetDate(selectedDateOffset);
      const [hours, minutes] = selectedTime.split(':').map(Number);
      targetDate.setHours(hours, minutes, 0, 0);

      const startTimeIso = targetDate.toISOString();
      const endTimeObj = new Date(targetDate.getTime() + 50 * 60 * 1000); // 50 dakika
      const endTimeIso = endTimeObj.toISOString();

      // 1. Bookings tablosuna ekle
      const { data: newBooking, error: bookingErr } = await supabase
        .from('bookings')
        .insert({
          student_id: currentUserId,
          instructor_id: targetInstructor.id,
          purchased_by: currentUserId,
          start_time: startTimeIso,
          end_time: endTimeIso,
          status: 'scheduled',
          topic_note: topicNote.trim() || `${selectedSubject !== 'Tümü' ? selectedSubject : 'Birebir'} Canlı Ders`,
          session_type: 'lesson',
        })
        .select('id')
        .single();

      if (bookingErr) throw bookingErr;

      // 2. Krediyi düşür
      const newCredit = Math.max(0, creditBalance - 1);
      await supabase
        .from('students')
        .update({ credit_balance: newCredit })
        .eq('user_id', currentUserId);

      setCreditBalance(newCredit);
      setBookingModalVisible(false);

      Alert.alert(
        '🎉 Tebrikler! Dersiniz Planlandı',
        `${targetInstructor.name} ile ${targetDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })} saat ${selectedTime} için canlı ders randevunuz oluşturuldu.`,
        [
          {
            text: 'Derslerime Git',
            onPress: () => router.push('/dashboard/lessons' as any),
          },
          { text: 'Tamam' },
        ]
      );
    } catch (err: any) {
      Alert.alert('Hata', err.message || 'Ders randevusu oluşturulurken bir hata oluştu.');
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Üst Bar */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Eğitmen Bul & Ders Al</Text>
            <Text style={styles.subtitle}>Alanında uzman eğitmenlerden birebir ders</Text>
          </View>
          <View style={styles.creditBadge}>
            <Ionicons name="flash" size={14} color="#f59e0b" style={{ marginRight: 4 }} />
            <Text style={styles.creditBadgeText}>{creditBalance} Kredi</Text>
          </View>
        </View>

        {/* Arama Çubuğu */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#64748b" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Eğitmen adı, konu veya branş ara..."
            placeholderTextColor="#64748b"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Branş Yatay Filtre Listesi */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subjectList}
        >
          {POPULAR_SUBJECTS.map((subj) => {
            const isSelected = selectedSubject === subj;
            return (
              <TouchableOpacity
                key={subj}
                style={[styles.subjectChip, isSelected && styles.subjectChipActive]}
                onPress={() => setSelectedSubject(subj)}
              >
                <Text style={[styles.subjectChipText, isSelected && styles.subjectChipTextActive]}>
                  {subj}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* İçerik */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00e5ff" />
          <Text style={styles.loadingText}>Eğitmenler listeleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00e5ff" />
          }
        >
          {filteredInstructors.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#334155" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyTitle}>Eğitmen Bulunamadı</Text>
              <Text style={styles.emptySub}>
                Arama kriterinize veya seçili branşa uygun eğitmen bulunamadı. Lütfen filtreyi değiştirip tekrar deneyin.
              </Text>
              <TouchableOpacity
                style={styles.resetFilterBtn}
                onPress={() => {
                  setSearchQuery('');
                  setSelectedSubject('Tümü');
                }}
              >
                <Text style={styles.resetFilterBtnText}>Filtreleri Temizle</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredInstructors.map((inst) => (
              <View key={inst.id} style={styles.instructorCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.avatarWrap}>
                    {inst.avatar_url ? (
                      <Image source={{ uri: inst.avatar_url }} style={styles.avatarImg} />
                    ) : (
                      <LinearGradient colors={['#6366f1', '#a855f7']} style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarLetter}>{inst.name.charAt(0).toUpperCase()}</Text>
                      </LinearGradient>
                    )}
                  </View>

                  <View style={styles.cardMainInfo}>
                    <View style={styles.nameRow}>
                      <Text style={styles.instructorName}>{inst.name}</Text>
                      <Ionicons name="checkmark-circle" size={16} color="#00e5ff" style={{ marginLeft: 4 }} />
                    </View>

                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.ratingText}>
                        {inst.rating?.toFixed(1) || '5.0'}
                      </Text>
                      <Text style={styles.reviewsText}>
                        ({inst.completed_lesson_count || 10}+ tamamlanan ders)
                      </Text>
                    </View>
                  </View>
                </View>

                {inst.bio ? (
                  <Text style={styles.bioText} numberOfLines={2}>
                    {inst.bio}
                  </Text>
                ) : null}

                {/* Branş Rozetleri */}
                <View style={styles.subjectsRow}>
                  {inst.subjects.slice(0, 4).map((sub, idx) => (
                    <View key={idx} style={styles.badgePill}>
                      <Text style={styles.badgePillText}>{sub}</Text>
                    </View>
                  ))}
                  {inst.subjects.length > 4 && (
                    <View style={styles.badgePill}>
                      <Text style={styles.badgePillText}>+{inst.subjects.length - 4}</Text>
                    </View>
                  )}
                </View>

                {/* Alt Aksiyon Butonu */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Ders Bedeli</Text>
                    <Text style={styles.priceVal}>1 Ders Kredisi</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.bookBtn}
                    onPress={() => openBookingModal(inst)}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#00e5ff', '#3b82f6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.bookBtnGradient}
                    >
                      <Ionicons name="calendar-outline" size={16} color="#030712" style={{ marginRight: 6 }} />
                      <Text style={styles.bookBtnText}>Randevu Al</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}

      {/* Randevu Alma Modalı */}
      <Modal
        visible={bookingModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Canlı Ders Randevusu</Text>
                <Text style={styles.modalSub}>{targetInstructor?.name} ile birebir ders</Text>
              </View>
              <TouchableOpacity onPress={() => setBookingModalVisible(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Gün Seçimi */}
              <Text style={styles.modalSectionLabel}>1. Gün Seç</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datePickerRow}>
                {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                  const d = getTargetDate(offset);
                  const isSelected = selectedDateOffset === offset;
                  const dayName = offset === 0 ? 'Bugün' : offset === 1 ? 'Yarın' : d.toLocaleDateString('tr-TR', { weekday: 'short' });
                  const dateNum = d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });

                  return (
                    <TouchableOpacity
                      key={offset}
                      style={[styles.dateCard, isSelected && styles.dateCardActive]}
                      onPress={() => setSelectedDateOffset(offset)}
                    >
                      <Text style={[styles.dateDayName, isSelected && styles.dateDayNameActive]}>{dayName}</Text>
                      <Text style={[styles.dateNumber, isSelected && styles.dateNumberActive]}>{dateNum}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Saat Seçimi */}
              <Text style={styles.modalSectionLabel}>2. Saat Seç</Text>
              <View style={styles.timeGrid}>
                {TIME_SLOTS.map((t) => {
                  const isSelected = selectedTime === t;
                  return (
                    <TouchableOpacity
                      key={t}
                      style={[styles.timeBtn, isSelected && styles.timeBtnActive]}
                      onPress={() => setSelectedTime(t)}
                    >
                      <Text style={[styles.timeBtnText, isSelected && styles.timeBtnTextActive]}>{t}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Konu Notu */}
              <Text style={styles.modalSectionLabel}>3. İşlemek İstediğin Konu / Not (Opsiyonel)</Text>
              <TextInput
                style={styles.topicInput}
                placeholder="Örn: Türev kuralları ve AYT çıkmış soruları..."
                placeholderTextColor="#64748b"
                value={topicNote}
                onChangeText={setTopicNote}
                multiline
              />

              {/* Kredi Bilgisi */}
              <View style={styles.creditNoticeBox}>
                <Ionicons name="information-circle" size={18} color="#00e5ff" style={{ marginRight: 8 }} />
                <Text style={styles.creditNoticeText}>
                  Bu ders için hesabınızdan <Text style={{ color: '#00e5ff', fontWeight: 'bold' }}>1 Kredi</Text> düşülecektir. Kalan krediniz: {creditBalance}.
                </Text>
              </View>

              {/* Onay Butonu */}
              <TouchableOpacity
                style={[styles.confirmBtn, bookingSubmitting && { opacity: 0.7 }]}
                onPress={confirmBooking}
                disabled={bookingSubmitting}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={creditBalance > 0 ? ['#00e5ff', '#3b82f6'] : ['#475569', '#334155']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmBtnGradient}
                >
                  {bookingSubmitting ? (
                    <ActivityIndicator size="small" color="#030712" />
                  ) : (
                    <Text style={styles.confirmBtnText}>
                      {creditBalance > 0 ? 'Ders Randevusunu Onayla' : 'Kredi Yetersiz'}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
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
    paddingTop: 12,
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
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  creditBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  creditBadgeText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '800',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  subjectList: {
    gap: 8,
    paddingVertical: 2,
  },
  subjectChip: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  subjectChipActive: {
    backgroundColor: '#00e5ff',
    borderColor: '#00e5ff',
  },
  subjectChipText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
  },
  subjectChipTextActive: {
    color: '#030712',
    fontWeight: '900',
  },
  scrollContent: {
    padding: 16,
    gap: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 12,
    fontSize: 14,
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
  },
  emptySub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  resetFilterBtn: {
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  resetFilterBtnText: {
    color: '#00e5ff',
    fontWeight: '700',
    fontSize: 13,
  },
  instructorCard: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderRadius: 18,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarWrap: {
    marginRight: 12,
  },
  avatarImg: {
    width: 52,
    height: 52,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },
  cardMainInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    color: '#f59e0b',
    fontSize: 13,
    fontWeight: '800',
    marginLeft: 4,
    marginRight: 6,
  },
  reviewsText: {
    color: '#64748b',
    fontSize: 12,
  },
  bioText: {
    color: '#94a3b8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  subjectsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  badgePill: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgePillText: {
    color: '#38bdf8',
    fontSize: 11,
    fontWeight: '700',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    paddingTop: 12,
  },
  priceLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  priceVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  bookBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  bookBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bookBtnText: {
    color: '#030712',
    fontSize: 13,
    fontWeight: '900',
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
    padding: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  modalSub: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 2,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalSectionLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#e2e8f0',
    marginTop: 14,
    marginBottom: 10,
  },
  datePickerRow: {
    gap: 8,
  },
  dateCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    minWidth: 70,
  },
  dateCardActive: {
    backgroundColor: '#00e5ff',
    borderColor: '#00e5ff',
  },
  dateDayName: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '700',
  },
  dateDayNameActive: {
    color: '#030712',
  },
  dateNumber: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '900',
    marginTop: 2,
  },
  dateNumberActive: {
    color: '#030712',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timeBtnActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  timeBtnText: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '700',
  },
  timeBtnTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  topicInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 13,
    borderWidth: 1,
    borderColor: '#334155',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  creditNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderRadius: 10,
    padding: 12,
    marginTop: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  creditNoticeText: {
    flex: 1,
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  },
  confirmBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  confirmBtnGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: {
    color: '#030712',
    fontSize: 15,
    fontWeight: '900',
  },
});
