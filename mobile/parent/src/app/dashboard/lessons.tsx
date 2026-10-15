import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

interface LessonItem {
  id: string;
  studentId: string;
  studentName: string;
  instructorId: string;
  instructorName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  meetLink: string | null;
  notes?: string | null;
}

export default function ParentLessonsScreen() {
  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<LessonItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'scheduled' | 'completed' | 'cancelled'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLessons = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Bağlı öğrencileri al
      const { data: links } = await supabase
        .from('guardian_links')
        .select('student_id')
        .eq('guardian_id', session.user.id);

      if (!links || links.length === 0) {
        setLessons([]);
        setFilteredLessons([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const studentIds = links.map((l) => l.student_id);

      // 2. Öğrencilerin derslerini ve kullanıcı isimlerini çek
      const [{ data: bookingsData }, { data: studentUsers }] = await Promise.all([
        supabase
          .from('bookings')
          .select('id, student_id, instructor_id, start_time, end_time, status, meet_link')
          .in('student_id', studentIds)
          .order('start_time', { ascending: false }),
        supabase.from('users').select('id, name').in('id', studentIds),
      ]);

      const studentNameMap = new Map((studentUsers ?? []).map((u) => [u.id, u.name || 'Öğrenci']));

      // 3. Eğitmen isimlerini çek
      const instructorIds = Array.from(new Set((bookingsData ?? []).map((b) => b.instructor_id)));
      let instructorNameMap = new Map<string, string>();
      if (instructorIds.length > 0) {
        const { data: instUsers } = await supabase
          .from('users')
          .select('id, name')
          .in('id', instructorIds);
        instructorNameMap = new Map((instUsers ?? []).map((u) => [u.id, u.name || 'Eğitmen']));
      }

      const formatted: LessonItem[] = (bookingsData ?? []).map((b) => ({
        id: b.id,
        studentId: b.student_id,
        studentName: studentNameMap.get(b.student_id) || 'Öğrenci',
        instructorId: b.instructor_id,
        instructorName: instructorNameMap.get(b.instructor_id) || 'Eğitmen',
        startTime: b.start_time,
        endTime: b.end_time,
        status: b.status,
        meetLink: b.meet_link,
      }));

      setLessons(formatted);
      applyFilter(formatted, activeFilter);
    } catch (err) {
      console.error('Dersleri getirme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeFilter]);

  const applyFilter = (list: LessonItem[], filter: 'all' | 'scheduled' | 'completed' | 'cancelled') => {
    if (filter === 'all') {
      setFilteredLessons(list);
    } else if (filter === 'cancelled') {
      setFilteredLessons(list.filter((l) => l.status === 'cancelled' || l.status === 'no_show'));
    } else {
      setFilteredLessons(list.filter((l) => l.status === filter));
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleFilterChange = (filter: 'all' | 'scheduled' | 'completed' | 'cancelled') => {
    setActiveFilter(filter);
    applyFilter(lessons, filter);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: 'Tamamlandı',
          bg: 'rgba(16, 185, 129, 0.15)',
          text: '#10b981',
          icon: 'checkmark-circle-outline' as const,
        };
      case 'scheduled':
        return {
          label: 'Planlandı',
          bg: 'rgba(249, 115, 22, 0.15)',
          text: '#f97316',
          icon: 'calendar-outline' as const,
        };
      case 'cancelled':
        return {
          label: 'İptal Edildi',
          bg: 'rgba(239, 68, 68, 0.15)',
          text: '#ef4444',
          icon: 'close-circle-outline' as const,
        };
      case 'no_show':
        return {
          label: 'Katılmadı',
          bg: 'rgba(245, 158, 11, 0.15)',
          text: '#f59e0b',
          icon: 'alert-circle-outline' as const,
        };
      default:
        return {
          label: status,
          bg: 'rgba(255, 255, 255, 0.1)',
          text: '#a1a1aa',
          icon: 'help-circle-outline' as const,
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Üst Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ders Takibi</Text>
        <Text style={styles.headerSubtitle}>
          Öğrencinizin tüm canlı derslerini ve eğitmen bilgilerini görüntüleyin
        </Text>

        {/* Filtre Butonları */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'scheduled', label: 'Planlanan' },
            { id: 'completed', label: 'Tamamlanan' },
            { id: 'cancelled', label: 'İptal / Gelmedi' },
          ].map((item) => {
            const isSelected = activeFilter === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.filterBtn, isSelected && styles.filterBtnActive]}
                onPress={() => handleFilterChange(item.id as any)}
              >
                <Text style={[styles.filterBtnText, isSelected && styles.filterBtnTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Dersler Yükleniyor...</Text>
        </View>
      ) : filteredLessons.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-clear-outline" size={48} color="#52525b" />
          <Text style={styles.emptyTitle}>Kayıtlı Ders Bulunamadı</Text>
          <Text style={styles.emptySubtitle}>
            Seçili filtreye ait herhangi bir ders kaydı bulunmamaktadır.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchLessons();
              }}
              tintColor="#f97316"
            />
          }
          renderItem={({ item }) => {
            const badge = getStatusBadge(item.status);
            const isFutureScheduled =
              item.status === 'scheduled' && new Date(item.startTime) >= new Date();

            return (
              <View style={styles.lessonCard}>
                <View style={styles.lessonHeaderRow}>
                  <View style={styles.instructorInfo}>
                    <Text style={styles.instructorName}>{item.instructorName}</Text>
                    <Text style={styles.studentSub}>Öğrenci: {item.studentName}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Ionicons name={badge.icon} size={13} color={badge.text} />
                    <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                      {badge.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.timeInfoRow}>
                  <Ionicons name="time-outline" size={15} color="#a1a1aa" />
                  <Text style={styles.timeInfoText}>
                    {new Date(item.startTime).toLocaleString('tr-TR', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </Text>
                </View>

                {isFutureScheduled && item.meetLink ? (
                  <TouchableOpacity
                    style={styles.meetBtn}
                    onPress={() => Linking.openURL(item.meetLink!)}
                  >
                    <Ionicons name="videocam-outline" size={16} color="#ffffff" />
                    <Text style={styles.meetBtnText}>Canlı Derse Katıl (Google Meet)</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            );
          }}
        />
      )}
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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#71717a',
    fontSize: 13,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterBtnActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  filterBtnText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  filterBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 12,
  },
  lessonCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  lessonHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  studentSub: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  timeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  timeInfoText: {
    color: '#a1a1aa',
    fontSize: 13,
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
    marginTop: 6,
    gap: 6,
  },
  meetBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: '#71717a',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
});
