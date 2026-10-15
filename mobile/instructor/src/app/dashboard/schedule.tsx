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
  Modal,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';

interface AvailabilitySlot {
  id: string;
  dayOfWeek: number; // 0: Pazar, 1: Pazartesi, ..., 6: Cumartesi
  startTime: string; // "14:00:00"
  endTime: string; // "15:00:00"
  isActive: boolean;
}

const DAYS = [
  { id: 1, label: 'Pazartesi', short: 'Pzt' },
  { id: 2, label: 'Salı', short: 'Sal' },
  { id: 3, label: 'Çarşamba', short: 'Çar' },
  { id: 4, label: 'Perşembe', short: 'Per' },
  { id: 5, label: 'Cuma', short: 'Cum' },
  { id: 6, label: 'Cumartesi', short: 'Cmt' },
  { id: 0, label: 'Pazar', short: 'Paz' },
];

const TIME_OPTIONS = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
];

export default function InstructorScheduleScreen() {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Pazartesi
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDay, setModalDay] = useState<number>(1);
  const [startTime, setStartTime] = useState<string>('17:00');
  const [endTime, setEndTime] = useState<string>('18:00');
  const [saving, setSaving] = useState(false);

  const loadAvailability = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('instructor_availability')
        .select('id, day_of_week, start_time, end_time, is_active')
        .eq('instructor_id', session.user.id)
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Müsaitlik çekilemedi:', error.message);
        return;
      }

      const formatted: AvailabilitySlot[] = (data ?? []).map((item) => ({
        id: item.id,
        dayOfWeek: item.day_of_week,
        startTime: item.start_time.slice(0, 5),
        endTime: item.end_time.slice(0, 5),
        isActive: item.is_active,
      }));

      setSlots(formatted);
    } catch (err) {
      console.error('Müsaitlik hatası:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const handleToggleSlot = async (slot: AvailabilitySlot) => {
    try {
      const { error } = await supabase
        .from('instructor_availability')
        .update({ is_active: !slot.isActive })
        .eq('id', slot.id);

      if (error) {
        Alert.alert('Hata', error.message);
        return;
      }

      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (err: any) {
      Alert.alert('Hata', err?.message);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    Alert.alert('Aralığı Sil', 'Bu müsaitlik saatini silmek istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            const { error } = await supabase
              .from('instructor_availability')
              .delete()
              .eq('id', slotId);

            if (error) {
              Alert.alert('Hata', error.message);
              return;
            }

            setSlots((prev) => prev.filter((s) => s.id !== slotId));
          } catch (err: any) {
            Alert.alert('Hata', err?.message);
          }
        },
      },
    ]);
  };

  const handleAddSlot = async () => {
    if (startTime >= endTime) {
      Alert.alert('Geçersiz Saat', 'Bitiş saati başlangıç saatinden sonra olmalıdır.');
      return;
    }

    setSaving(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const { error } = await supabase.from('instructor_availability').insert({
        instructor_id: session.user.id,
        day_of_week: modalDay,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        is_active: true,
      });

      if (error) {
        Alert.alert('Hata', error.message || 'Müsaitlik kaydedilemedi.');
        setSaving(false);
        return;
      }

      setModalVisible(false);
      loadAvailability();
    } catch (err: any) {
      Alert.alert('Hata', err?.message || 'Bir sorun oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const filteredSlots = slots.filter((s) => s.dayOfWeek === selectedDay);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Müsaitlik Takvimi Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Haftalık Müsaitlik</Text>
          <Text style={styles.headerSubtitle}>
            Öğrencilerin rezervasyon yapabileceği saatleri belirleyin
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addSlotBtn}
          onPress={() => {
            setModalDay(selectedDay);
            setModalVisible(true);
          }}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addSlotBtnText}>Aralık Ekle</Text>
        </TouchableOpacity>
      </View>

      {/* Gün Seçim Çubuğu */}
      <View style={styles.daySelectorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daySelectorScroll}
        >
          {DAYS.map((d) => {
            const isSelected = selectedDay === d.id;
            const count = slots.filter((s) => s.dayOfWeek === d.id && s.isActive).length;

            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.dayTab, isSelected && styles.dayTabActive]}
                onPress={() => setSelectedDay(d.id)}
              >
                <Text style={[styles.dayTabLabel, isSelected && styles.dayTabLabelActive]}>
                  {d.short}
                </Text>
                <View
                  style={[
                    styles.dayCountBadge,
                    count > 0 ? styles.dayCountBadgeActive : styles.dayCountBadgeZero,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayCountText,
                      isSelected && { color: '#ffffff' },
                    ]}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadAvailability();
            }}
            tintColor="#6366f1"
          />
        }
      >
        <View style={styles.dayHeaderRow}>
          <Text style={styles.activeDayTitle}>
            {DAYS.find((d) => d.id === selectedDay)?.label} Günü Saatleri
          </Text>
          <Text style={styles.activeDayCount}>
            {filteredSlots.length} saat aralığı tanımlı
          </Text>
        </View>

        {filteredSlots.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="time-outline" size={44} color="#52525b" />
            <Text style={styles.emptyTitle}>Bu Gün İçin Saat Eklenmedi</Text>
            <Text style={styles.emptyDesc}>
              {DAYS.find((d) => d.id === selectedDay)?.label} gününde öğrencilerinize ders saati sunmak için yukarıdaki "Aralık Ekle" butonuna dokunun.
            </Text>
            <TouchableOpacity
              style={styles.emptyAddBtn}
              onPress={() => {
                setModalDay(selectedDay);
                setModalVisible(true);
              }}
            >
              <Text style={styles.emptyAddBtnText}>+ Saat Aralığı Belirle</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.slotsList}>
            {filteredSlots.map((slot) => (
              <View key={slot.id} style={styles.slotCard}>
                <View style={styles.slotTimeBox}>
                  <Ionicons
                    name="time"
                    size={20}
                    color={slot.isActive ? '#818cf8' : '#71717a'}
                  />
                  <Text
                    style={[
                      styles.slotTimeText,
                      !slot.isActive && styles.slotTimeTextInactive,
                    ]}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Text>
                </View>

                <View style={styles.slotActions}>
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      slot.isActive ? styles.toggleBtnActive : styles.toggleBtnInactive,
                    ]}
                    onPress={() => handleToggleSlot(slot)}
                  >
                    <Text
                      style={[
                        styles.toggleBtnText,
                        slot.isActive ? styles.toggleBtnTextActive : styles.toggleBtnTextInactive,
                      ]}
                    >
                      {slot.isActive ? 'Aktif' : 'Kapalı'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDeleteSlot(slot.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Bilgilendirme Kartı */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color="#818cf8" />
          <Text style={styles.infoCardText}>
            Belirlediğiniz aralıklar, ders süresi (50 dk) baz alınarak öğrencilerinize takvimde sunulur. Başka bir öğrenci rezervasyon yaptığında o saat otomatik kapatılır.
          </Text>
        </View>
      </ScrollView>

      {/* Yeni Aralık Ekle Modalı */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saat Aralığı Ekle</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            {/* Gün Seçimi */}
            <Text style={styles.inputLabel}>Uygulanacak Gün</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalDayRow}
            >
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d.id}
                  style={[styles.modalDayChip, modalDay === d.id && styles.modalDayChipActive]}
                  onPress={() => setModalDay(d.id)}
                >
                  <Text
                    style={[
                      styles.modalDayChipText,
                      modalDay === d.id && styles.modalDayChipTextActive,
                    ]}
                  >
                    {d.short}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Başlangıç Saati */}
            <Text style={styles.inputLabel}>Başlangıç Saati</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeChipsRow}
            >
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, startTime === t && styles.timeChipActive]}
                  onPress={() => {
                    setStartTime(t);
                    // Bitiş saatini otomatik bir saat sonraya kaydır
                    const idx = TIME_OPTIONS.indexOf(t);
                    if (idx !== -1 && idx + 1 < TIME_OPTIONS.length) {
                      setEndTime(TIME_OPTIONS[idx + 1]);
                    }
                  }}
                >
                  <Text
                    style={[styles.timeChipText, startTime === t && styles.timeChipTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Bitiş Saati */}
            <Text style={styles.inputLabel}>Bitiş Saati</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.timeChipsRow}
            >
              {TIME_OPTIONS.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, endTime === t && styles.timeChipActive]}
                  onPress={() => setEndTime(t)}
                >
                  <Text
                    style={[styles.timeChipText, endTime === t && styles.timeChipTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Kaydet Butonu */}
            <TouchableOpacity
              style={styles.saveSlotBtn}
              onPress={handleAddSlot}
              disabled={saving}
            >
              <LinearGradient
                colors={['#6366f1', '#4f46e5']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveSlotBtnInner}
              >
                {saving ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle-outline" size={18} color="#ffffff" />
                    <Text style={styles.saveSlotBtnText}>
                      {DAYS.find((d) => d.id === modalDay)?.short} {startTime} - {endTime} Kaydet
                    </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#a1a1aa',
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  headerSubtitle: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  addSlotBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    gap: 4,
  },
  addSlotBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  daySelectorContainer: {
    marginBottom: 12,
  },
  daySelectorScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  dayTab: {
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    minWidth: 54,
  },
  dayTabActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  dayTabLabel: {
    color: '#71717a',
    fontSize: 12,
    fontWeight: '600',
  },
  dayTabLabelActive: {
    color: '#818cf8',
    fontWeight: '800',
  },
  dayCountBadge: {
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  dayCountBadgeActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.3)',
  },
  dayCountBadgeZero: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayCountText: {
    color: '#a1a1aa',
    fontSize: 10,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  dayHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 4,
  },
  activeDayTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
  activeDayCount: {
    color: '#71717a',
    fontSize: 12,
  },
  emptyCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 4,
  },
  emptyDesc: {
    color: '#71717a',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  emptyAddBtn: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  emptyAddBtnText: {
    color: '#818cf8',
    fontSize: 13,
    fontWeight: '700',
  },
  slotsList: {
    gap: 10,
    marginBottom: 20,
  },
  slotCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
  },
  slotTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  slotTimeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  slotTimeTextInactive: {
    color: '#71717a',
    textDecorationLine: 'line-through',
  },
  slotActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleBtn: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  toggleBtnInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  toggleBtnTextActive: {
    color: '#10b981',
  },
  toggleBtnTextInactive: {
    color: '#71717a',
  },
  deleteBtn: {
    padding: 4,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    alignItems: 'center',
  },
  infoCardText: {
    flex: 1,
    color: '#a1a1aa',
    fontSize: 12,
    lineHeight: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#18181b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    paddingBottom: 36,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  modalCloseBtn: {
    padding: 4,
  },
  inputLabel: {
    color: '#d4d4d8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalDayRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modalDayChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  modalDayChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  modalDayChipText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  modalDayChipTextActive: {
    color: '#818cf8',
    fontWeight: '700',
  },
  timeChipsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  timeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  timeChipActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderColor: '#6366f1',
  },
  timeChipText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  timeChipTextActive: {
    color: '#818cf8',
    fontWeight: '700',
  },
  saveSlotBtn: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  saveSlotBtnInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveSlotBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
