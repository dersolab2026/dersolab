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
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

interface ExamResult {
  id: string;
  exam_title: string;
  exam_type: string;
  date: string;
  total_net: number;
  total_score?: number;
  details?: Record<string, number>;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: 'assigned' | 'completed' | 'graded';
  created_at: string;
  instructorName?: string;
}

export default function ParentProgressScreen() {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'exams' | 'homework'>('exams');

  const [exams, setExams] = useState<ExamResult[]>([]);
  const [homework, setHomework] = useState<HomeworkItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data: links } = await supabase
        .from('guardian_links')
        .select('student_id')
        .eq('guardian_id', session.user.id);

      if (!links || links.length === 0) {
        setStudents([]);
        setSelectedStudentId(null);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const studentIds = links.map((l) => l.student_id);
      const { data: usersData } = await supabase
        .from('users')
        .select('id, name')
        .in('id', studentIds);

      const list = (usersData ?? []).map((u) => ({ id: u.id, name: u.name || 'Öğrenci' }));
      setStudents(list);

      const initialId =
        selectedStudentId && list.some((s) => s.id === selectedStudentId)
          ? selectedStudentId
          : list[0]?.id ?? null;

      setSelectedStudentId(initialId);
      if (initialId) {
        await loadDetails(initialId);
      }
    } catch (err) {
      console.error('Öğrenci yükleme hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedStudentId]);

  const loadDetails = async (studentId: string) => {
    try {
      // 1. Denemeler
      const { data: examData } = await supabase
        .from('exam_results')
        .select('*')
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      setExams(examData ?? []);

      // 2. Ödevler
      const { data: hwData } = await supabase
        .from('homework')
        .select('id, title, description, due_date, status, created_at, instructor_id')
        .eq('student_id', studentId)
        .order('due_date', { ascending: false });

      if (hwData && hwData.length > 0) {
        const instIds = Array.from(new Set(hwData.map((h) => h.instructor_id).filter(Boolean)));
        let instMap = new Map<string, string>();
        if (instIds.length > 0) {
          const { data: instUsers } = await supabase
            .from('users')
            .select('id, name')
            .in('id', instIds);
          instMap = new Map((instUsers ?? []).map((u) => [u.id, u.name || 'Eğitmen']));
        }

        const formattedHw: HomeworkItem[] = hwData.map((h) => ({
          ...h,
          instructorName: instMap.get(h.instructor_id) || 'Eğitmen',
        }));
        setHomework(formattedHw);
      } else {
        setHomework([]);
      }
    } catch (err) {
      console.error('Detay yükleme hatası:', err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    loadDetails(id);
  };

  // İstatistik hesaplamaları
  const avgNet =
    exams.length > 0
      ? (exams.reduce((acc, curr) => acc + (curr.total_net || 0), 0) / exams.length).toFixed(1)
      : '—';
  const highestNet =
    exams.length > 0
      ? Math.max(...exams.map((e) => e.total_net || 0)).toFixed(1)
      : '—';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Akademik Gelişim</Text>
        <Text style={styles.headerSubtitle}>Deneme sınavı netleri ve ödev takip durumu</Text>

        {/* Öğrenci Sekmeleri */}
        {students.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.studentTabs}
          >
            {students.map((st) => {
              const isSelected = st.id === selectedStudentId;
              return (
                <TouchableOpacity
                  key={st.id}
                  style={[styles.studentTab, isSelected && styles.studentTabActive]}
                  onPress={() => handleSelectStudent(st.id)}
                >
                  <Text style={[styles.studentTabText, isSelected && styles.studentTabTextActive]}>
                    {st.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Sekme Seçici (Denemeler vs Ödevler) */}
        <View style={styles.tabToggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'exams' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('exams')}
          >
            <Ionicons
              name="bar-chart-outline"
              size={16}
              color={activeTab === 'exams' ? '#ffffff' : '#71717a'}
            />
            <Text style={[styles.toggleBtnText, activeTab === 'exams' && styles.toggleBtnTextActive]}>
              Deneme Netleri
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, activeTab === 'homework' && styles.toggleBtnActive]}
            onPress={() => setActiveTab('homework')}
          >
            <Ionicons
              name="book-outline"
              size={16}
              color={activeTab === 'homework' ? '#ffffff' : '#71717a'}
            />
            <Text
              style={[styles.toggleBtnText, activeTab === 'homework' && styles.toggleBtnTextActive]}
            >
              Ödevler ({homework.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#f97316" />
          <Text style={styles.loadingText}>Veriler Yükleniyor...</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadStudents();
              }}
              tintColor="#f97316"
            />
          }
        >
          {activeTab === 'exams' ? (
            <>
              {/* Deneme Özet Kartları */}
              <View style={styles.statsRow}>
                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Ortalama Net</Text>
                  <Text style={styles.statValue}>{avgNet}</Text>
                  <Text style={styles.statDesc}>Tüm denemeler</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>En Yüksek Net</Text>
                  <Text style={[styles.statValue, { color: '#10b981' }]}>{highestNet}</Text>
                  <Text style={styles.statDesc}>En iyi deneme</Text>
                </View>

                <View style={styles.statCard}>
                  <Text style={styles.statLabel}>Toplam Sınav</Text>
                  <Text style={[styles.statValue, { color: '#38bdf8' }]}>{exams.length}</Text>
                  <Text style={styles.statDesc}>Girdiği denemeler</Text>
                </View>
              </View>

              {/* Deneme Listesi */}
              {exams.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="bar-chart-outline" size={44} color="#52525b" />
                  <Text style={styles.emptyStateTitle}>Henüz Deneme Kaydı Yok</Text>
                  <Text style={styles.emptyStateDesc}>
                    Öğrenciniz deneme sınavı sonuçlarını girdiğinde burada grafikler ve net dökümleri listelenecektir.
                  </Text>
                </View>
              ) : (
                <View style={styles.itemsList}>
                  {exams.map((ex) => (
                    <View key={ex.id} style={styles.examCard}>
                      <View style={styles.examHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.examTitle}>{ex.exam_title}</Text>
                          <Text style={styles.examDate}>
                            {new Date(ex.date).toLocaleDateString('tr-TR', {
                              dateStyle: 'long',
                            })}
                          </Text>
                        </View>
                        <View style={styles.netPill}>
                          <Text style={styles.netPillValue}>{ex.total_net}</Text>
                          <Text style={styles.netPillLabel}>NET</Text>
                        </View>
                      </View>

                      {/* Ders Bazlı Net Dökümü */}
                      {ex.details && Object.keys(ex.details).length > 0 && (
                        <View style={styles.detailsGrid}>
                          {Object.entries(ex.details).map(([subject, net]) => (
                            <View key={subject} style={styles.subjectNetBadge}>
                              <Text style={styles.subjectName}>{subject}</Text>
                              <Text style={styles.subjectScore}>{net} Net</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <>
              {/* Ödevler Listesi */}
              {homework.length === 0 ? (
                <View style={styles.emptyState}>
                  <Ionicons name="book-outline" size={44} color="#52525b" />
                  <Text style={styles.emptyStateTitle}>Kayıtlı Ödev Bulunmuyor</Text>
                  <Text style={styles.emptyStateDesc}>
                    Eğitmen tarafından öğrenciye atanan ödevler burada listelenecektir.
                  </Text>
                </View>
              ) : (
                <View style={styles.itemsList}>
                  {homework.map((hw) => {
                    const isCompleted = hw.status === 'completed' || hw.status === 'graded';
                    const isPastDue = hw.due_date && new Date(hw.due_date) < new Date() && !isCompleted;

                    return (
                      <View key={hw.id} style={styles.homeworkCard}>
                        <View style={styles.hwHeader}>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.hwTitle}>{hw.title}</Text>
                            {hw.instructorName && (
                              <Text style={styles.hwInstructor}>Eğitmen: {hw.instructorName}</Text>
                            )}
                          </View>
                          <View
                            style={[
                              styles.hwStatusBadge,
                              isCompleted
                                ? styles.hwStatusCompleted
                                : isPastDue
                                ? styles.hwStatusPastDue
                                : styles.hwStatusPending,
                            ]}
                          >
                            <Text
                              style={[
                                styles.hwStatusText,
                                isCompleted
                                  ? { color: '#10b981' }
                                  : isPastDue
                                  ? { color: '#ef4444' }
                                  : { color: '#f97316' },
                              ]}
                            >
                              {isCompleted ? 'Tamamlandı' : isPastDue ? 'Gecikti' : 'Bekliyor'}
                            </Text>
                          </View>
                        </View>

                        {hw.description ? (
                          <Text style={styles.hwDesc}>{hw.description}</Text>
                        ) : null}

                        {hw.due_date && (
                          <View style={styles.hwDueRow}>
                            <Ionicons name="calendar-outline" size={14} color="#71717a" />
                            <Text style={styles.hwDueText}>
                              Son Teslim:{' '}
                              {new Date(hw.due_date).toLocaleDateString('tr-TR', {
                                dateStyle: 'medium',
                              })}
                            </Text>
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          )}
        </ScrollView>
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
    marginBottom: 12,
  },
  studentTabs: {
    gap: 8,
    marginBottom: 12,
  },
  studentTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  studentTabActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  studentTabText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  studentTabTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  tabToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#f97316',
  },
  toggleBtnText: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
  },
  statLabel: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    color: '#f97316',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  statDesc: {
    color: '#52525b',
    fontSize: 10,
  },
  itemsList: {
    gap: 12,
  },
  examCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  examTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  examDate: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  netPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  netPillValue: {
    color: '#f97316',
    fontSize: 18,
    fontWeight: '900',
  },
  netPillLabel: {
    color: '#ea580c',
    fontSize: 9,
    fontWeight: '800',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 10,
  },
  subjectNetBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
  },
  subjectName: {
    color: '#a1a1aa',
    fontSize: 11,
    fontWeight: '600',
  },
  subjectScore: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  homeworkCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
  },
  hwHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hwTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  hwInstructor: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  hwStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  hwStatusCompleted: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  hwStatusPastDue: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  hwStatusPending: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  hwStatusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  hwDesc: {
    color: '#a1a1aa',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  hwDueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hwDueText: {
    color: '#71717a',
    fontSize: 12,
  },
  emptyState: {
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  emptyStateTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  emptyStateDesc: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
});
