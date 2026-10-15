import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

type StudyLog = {
  id: string;
  logDate: string;
  subject: string;
  topic: string | null;
  hours: number | null;
  questionsSolved: number | null;
  source: string | null;
};

type Booking = {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  instructorName: string;
  meetLink?: string | null;
};

const SUBJECTS = [
  'TYT Matematik',
  'AYT Matematik',
  'Geometri',
  'TYT Türkçe',
  'AYT Edebiyat',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Fen Bilimleri',
  'Tarih',
  'Coğrafya',
  'Felsefe & Din',
  'İngilizce',
  'LGS Matematik',
  'LGS Fen Bilimleri',
  'LGS Türkçe',
  'Genel Çalışma',
];

function birGunOnce(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

function calculateStreak(dates: string[], todayStr: string): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  const todayDone = set.has(todayStr);

  let streak = todayDone ? 1 : 0;
  let cursor = birGunOnce(todayStr);

  while (set.has(cursor)) {
    streak++;
    cursor = birGunOnce(cursor);
  }

  return streak;
}

export default function DiaryScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);

  // Coaching state
  const [hasCoachingPlan, setHasCoachingPlan] = useState(false);
  const [coachingProgress, setCoachingProgress] = useState(0);
  const [coachingItemsCount, setCoachingItemsCount] = useState<{ total: number; completed: number }>({ total: 0, completed: 0 });

  // Add Study Log Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [topic, setTopic] = useState('');
  const [hours, setHours] = useState('');
  const [questionsSolved, setQuestionsSolved] = useState('');
  const [source, setSource] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchDailyData();
  }, [selectedDate]);

  useEffect(() => {
    fetchStreakAndCoaching();
  }, []);

  const fetchDailyData = async () => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const dateStr = selectedDate.toISOString().slice(0, 10);

      // 1. Fetch study logs for the selected date
      const { data: logsData } = await supabase
        .from('student_study_logs')
        .select('*')
        .eq('student_id', session.user.id)
        .eq('log_date', dateStr)
        .order('created_at', { ascending: false });

      if (logsData) {
        setStudyLogs(
          logsData.map((r: any) => ({
            id: r.id,
            logDate: r.log_date,
            subject: r.subject,
            topic: r.topic,
            hours: r.hours,
            questionsSolved: r.questions_solved,
            source: r.source,
          }))
        );
      } else {
        setStudyLogs([]);
      }

      // 2. Fetch bookings for the selected date
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('id, start_time, end_time, status, meet_link, instructor_id')
        .eq('student_id', session.user.id)
        .gte('start_time', dateStr)
        .lt('start_time', nextDay.toISOString().slice(0, 10));

      if (bookingsData && bookingsData.length > 0) {
        // Fetch instructor names
        const instructorIds = [...new Set(bookingsData.map((b: any) => b.instructor_id).filter(Boolean))];
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

        setBookings(
          bookingsData.map((b: any) => ({
            id: b.id,
            startTime: b.start_time,
            endTime: b.end_time,
            status: b.status,
            meetLink: b.meet_link,
            instructorName: usersMap[b.instructor_id] || 'Eğitmen',
          }))
        );
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error('fetchDailyData error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreakAndCoaching = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // 1. Calculate real streak
      const { data: allLogs } = await supabase
        .from('student_study_logs')
        .select('log_date')
        .eq('student_id', session.user.id);

      if (allLogs) {
        const dates = allLogs.map((l: any) => l.log_date);
        const todayStr = new Date().toISOString().slice(0, 10);
        setStreak(calculateStreak(dates, todayStr));
      }

      // 2. Fetch coaching status
      const { data: planData } = await supabase
        .from('coaching_plans')
        .select('id, status')
        .eq('student_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle();

      if (planData) {
        setHasCoachingPlan(true);
        const { data: items } = await supabase
          .from('coaching_plan_items')
          .select('id, is_completed')
          .eq('plan_id', planData.id);

        if (items && items.length > 0) {
          const completed = items.filter((i: any) => i.is_completed).length;
          setCoachingProgress(Math.round((completed / items.length) * 100));
          setCoachingItemsCount({ total: items.length, completed });
        }
      } else {
        setHasCoachingPlan(false);
      }
    } catch (e) {
      console.error('fetchStreakAndCoaching error:', e);
    }
  };

  const handleAddLog = async () => {
    if (!selectedSubject) {
      setFormError('Lütfen bir ders seçin.');
      return;
    }

    setFormError('');
    setSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setFormError('Oturum kapalı. Lütfen tekrar giriş yapın.');
        return;
      }

      const dateStr = selectedDate.toISOString().slice(0, 10);
      const parsedHours = hours.trim() ? parseFloat(hours.replace(',', '.')) : null;
      const parsedQuestions = questionsSolved.trim() ? parseInt(questionsSolved, 10) : null;

      const { error } = await supabase.from('student_study_logs').insert({
        student_id: session.user.id,
        log_date: dateStr,
        subject: selectedSubject,
        topic: topic.trim() || null,
        hours: parsedHours,
        questions_solved: parsedQuestions,
        source: source.trim() || null,
      });

      if (error) {
        setFormError('Kayıt eklenemedi: ' + error.message);
        return;
      }

      // Reset form
      setTopic('');
      setHours('');
      setQuestionsSolved('');
      setSource('');
      setModalVisible(false);

      // Refresh list & streak
      await fetchDailyData();
      await fetchStreakAndCoaching();
    } catch (e: any) {
      setFormError(e.message || 'Bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLog = (id: string, subjectName: string) => {
    Alert.alert(
      'Çalışma Notunu Sil',
      `"${subjectName}" çalışmanı silmek istediğine emin misin?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            try {
              const { data: { session } } = await supabase.auth.getSession();
              if (!session) return;

              const { error } = await supabase
                .from('student_study_logs')
                .delete()
                .eq('id', id)
                .eq('student_id', session.user.id);

              if (error) {
                Alert.alert('Hata', 'Kayıt silinemedi: ' + error.message);
              } else {
                await fetchDailyData();
                await fetchStreakAndCoaching();
              }
            } catch (err: any) {
              Alert.alert('Hata', err.message || 'Silme işlemi başarısız.');
            }
          },
        },
      ]
    );
  };

  const getDaysArray = () => {
    const days = [];
    const curr = new Date();
    curr.setDate(curr.getDate() - 3);
    for (let i = 0; i < 7; i++) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  };

  const daysList = getDaysArray();
  const dayNames = ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'];

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.toISOString().slice(0, 10) === d2.toISOString().slice(0, 10);
  };

  const today = new Date();

  const renderAgendaItems = () => {
    if (loading) {
      return <ActivityIndicator size="small" color="#00e5ff" style={{ marginVertical: 24 }} />;
    }

    if (studyLogs.length === 0 && bookings.length === 0) {
      return (
        <View style={styles.emptyAgenda}>
          <Ionicons name="calendar-outline" size={32} color="#475569" style={{ marginBottom: 8 }} />
          <Text style={styles.emptyAgendaText}>Bu gün için planlanmış bir ders veya çalışma notu yok.</Text>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            activeOpacity={0.8}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={16} color="#00e5ff" />
            <Text style={styles.emptyAddBtnText}>İlk Çalışma Notunu Ekle</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {bookings.map((b) => (
          <View key={b.id} style={styles.taskCard}>
            <View style={styles.taskLeft}>
              <View style={[styles.checkbox, { borderColor: '#3b82f6' }]}>
                {b.status === 'completed' && <Ionicons name="checkmark" size={14} color="#3b82f6" />}
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitle}>Canlı Ders: {b.instructorName}</Text>
                <Text style={styles.taskTime}>
                  <Ionicons name="time-outline" size={12} /> {new Date(b.startTime).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
            <View style={styles.bookingIcon}>
              <Ionicons name="videocam" size={16} color="#3b82f6" />
            </View>
          </View>
        ))}

        {studyLogs.map((log) => (
          <View key={log.id} style={[styles.taskCard, styles.taskCardCompleted]}>
            <View style={styles.taskLeft}>
              <View style={[styles.checkbox, styles.checkboxCompleted]}>
                <Ionicons name="checkmark" size={14} color="#fff" />
              </View>
              <View style={styles.taskDetails}>
                <Text style={styles.taskTitleCompleted}>
                  {log.subject} {log.topic ? `— ${log.topic}` : ''}
                </Text>
                <View style={styles.badgeRow}>
                  {log.questionsSolved ? (
                    <Text style={styles.taskBadge}>{log.questionsSolved} Soru</Text>
                  ) : null}
                  {log.hours ? (
                    <Text style={[styles.taskBadge, styles.taskBadgeHours]}>{log.hours} Saat</Text>
                  ) : null}
                  {log.source ? (
                    <Text style={[styles.taskBadge, styles.taskBadgeSource]}>{log.source}</Text>
                  ) : null}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => handleDeleteLog(log.id, log.subject)}
              style={styles.deleteBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Günlük</Text>
          <Text style={styles.subtitle}>Bir gün seç, o güne ait derslerini ve çalışma notlarını gör.</Text>
        </View>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#94a3b8" />
          <Text style={styles.infoText}>
            Ders aldığın eğitmenler ve koçun bu sayfayı görebilir — çalışmanı takip edip sana daha iyi yol gösterebilmeleri için.
          </Text>
        </View>

        {/* Streak Banner */}
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          style={styles.streakBanner}
        >
          <View style={styles.streakIconContainer}>
            <Ionicons name="flame" size={32} color="#ef4444" />
          </View>
          <View style={styles.streakTextContainer}>
            <Text style={styles.streakTitle}>{streak} Günlük Seri!</Text>
            <Text style={styles.streakSub}>
              {streak > 0
                ? 'Harika gidiyorsun. Seriyi korumak için bugün de çalışma notunu gir!'
                : 'Bugün yeni bir seri başlatmak için tam zamanı!'}
            </Text>
          </View>
        </LinearGradient>

        {/* Calendar Strip */}
        <View style={styles.calendarContainer}>
          {daysList.map((d, index) => {
            const isToday = isSameDay(d, today);
            const isSelected = isSameDay(d, selectedDate);
            const dayName = dayNames[d.getDay()];

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  isSelected && styles.calendarDaySelected,
                  isToday && !isSelected && styles.calendarDayToday,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedDate(d)}
              >
                <Text style={[styles.dayText, isSelected && styles.dayTextSelected]}>{dayName}</Text>
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>{d.getDate()}</Text>
                {isToday && <View style={styles.eventDot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Agenda */}
        <View style={styles.agendaSection}>
          <View style={styles.agendaHeader}>
            <Text style={styles.agendaTitle}>
              {isSameDay(selectedDate, today) ? 'Bugünün Ajandası' : `${selectedDate.getDate()} ${selectedDate.toLocaleDateString('tr-TR', { month: 'short' })} Ajandası`}
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.addBtnContainer}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={16} color="#00e5ff" />
              <Text style={styles.addBtnText}>Not Ekle</Text>
            </TouchableOpacity>
          </View>

          {renderAgendaItems()}
        </View>

        {/* Coaching Plan Summary */}
        <View style={styles.coachingSection}>
          <View style={styles.coachingHeader}>
            <Ionicons name="compass" size={22} color="#f59e0b" />
            <Text style={styles.coachingTitle}>Haftalık Koçluk Planın</Text>
          </View>
          <Text style={styles.coachingSub}>
            Öğrenci koçun tarafından sana atanan haftalık görevler burada görünür.
          </Text>

          {hasCoachingPlan ? (
            <>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${coachingProgress}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {coachingItemsCount.total > 0
                  ? `%${coachingProgress} tamamlandı (${coachingItemsCount.completed} / ${coachingItemsCount.total} görev)`
                  : 'Aktif koçluk görevin hazırlandı.'}
              </Text>
            </>
          ) : (
            <>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: '0%' }]} />
              </View>
              <Text style={styles.progressText}>Henüz aktif bir koçluk planın atanmamış.</Text>
            </>
          )}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Add Study Log Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Çalışma Notu Ekle</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>

            {formError ? (
              <View style={styles.formErrorBox}>
                <Ionicons name="alert-circle" size={16} color="#ef4444" />
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            ) : null}

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              {/* Subject Selector */}
              <Text style={styles.label}>Ders *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectChipContainer}>
                {SUBJECTS.map((sub) => {
                  const isChosen = selectedSubject === sub;
                  return (
                    <TouchableOpacity
                      key={sub}
                      style={[styles.subjectChip, isChosen && styles.subjectChipSelected]}
                      onPress={() => setSelectedSubject(sub)}
                    >
                      <Text style={[styles.subjectChipText, isChosen && styles.subjectChipTextSelected]}>
                        {sub}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Topic */}
              <Text style={styles.label}>Konu Başlığı</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Fonksiyonlar, Paragraf, Newton Yasaları"
                placeholderTextColor="#64748b"
                value={topic}
                onChangeText={setTopic}
              />

              {/* Numbers Row */}
              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.label}>Çözülen Soru</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Örn: 45"
                    placeholderTextColor="#64748b"
                    keyboardType="number-pad"
                    value={questionsSolved}
                    onChangeText={setQuestionsSolved}
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.label}>Çalışılan Süre (Saat)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Örn: 1.5"
                    placeholderTextColor="#64748b"
                    keyboardType="decimal-pad"
                    value={hours}
                    onChangeText={setHours}
                  />
                </View>
              </View>

              {/* Source */}
              <Text style={styles.label}>Kaynak / Kitap</Text>
              <TextInput
                style={styles.input}
                placeholder="Örn: Orijinal Soru Bankası, MEB Kitabı"
                placeholderTextColor="#64748b"
                value={source}
                onChangeText={setSource}
              />
            </ScrollView>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, submitting && { opacity: 0.7 }]}
              onPress={handleAddLog}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#030712" />
              ) : (
                <Text style={styles.submitButtonText}>Kaydet ve Günlüğe Ekle</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
  container: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 10,
    flex: 1,
  },
  streakBanner: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  streakIconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakTextContainer: {
    flex: 1,
  },
  streakTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  streakSub: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  calendarDay: {
    alignItems: 'center',
    paddingVertical: 12,
    width: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  calendarDayToday: {
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
  },
  calendarDaySelected: {
    backgroundColor: '#00e5ff',
  },
  dayText: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: '#030712',
    fontWeight: '800',
  },
  dateText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dateTextSelected: {
    color: '#030712',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00e5ff',
    marginTop: 6,
  },
  agendaSection: {
    marginBottom: 32,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  agendaTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  addBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
  },
  addBtnText: {
    color: '#00e5ff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 4,
  },
  emptyAgenda: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.2)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  emptyAgendaText: {
    color: '#64748b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  emptyAddBtnText: {
    color: '#00e5ff',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  taskCardCompleted: {
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  taskTitleCompleted: {
    color: '#f8fafc',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
  taskTime: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  taskBadge: {
    fontSize: 11,
    color: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontWeight: 'bold',
  },
  taskBadgeHours: {
    color: '#00e5ff',
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
  },
  taskBadgeSource: {
    color: '#94a3b8',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  bookingIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coachingSection: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 20,
    padding: 20,
  },
  coachingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coachingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  coachingSub: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 16,
    lineHeight: 18,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#f59e0b',
    borderRadius: 4,
  },
  progressText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
  },
  formErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  formErrorText: {
    color: '#ef4444',
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 10,
  },
  subjectChipContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  subjectChip: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  subjectChipSelected: {
    backgroundColor: '#00e5ff',
    borderColor: '#00e5ff',
  },
  subjectChipText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  subjectChipTextSelected: {
    color: '#030712',
    fontWeight: '800',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    color: '#ffffff',
    fontSize: 14,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  submitButton: {
    backgroundColor: '#00e5ff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#030712',
    fontWeight: '800',
    fontSize: 15,
  },
});
