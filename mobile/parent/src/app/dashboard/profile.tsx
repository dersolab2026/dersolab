import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

interface LinkedStudent {
  id: string;
  name: string;
  email: string;
  gradeTrack?: string;
}

export default function ParentProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState<string>('Veli');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPhone, setUserPhone] = useState<string>('');
  const [students, setStudents] = useState<LinkedStudent[]>([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  // Link modal
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [linkCode, setLinkCode] = useState('');
  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      setUserEmail(session.user.email || '');

      const { data: userRecord } = await supabase
        .from('users')
        .select('name, phone')
        .eq('id', session.user.id)
        .single();

      if (userRecord) {
        setUserName(userRecord.name || 'Veli');
        setUserPhone(userRecord.phone || '');
      }

      // Bağlı öğrencileri getir
      const { data: links } = await supabase
        .from('guardian_links')
        .select('student_id')
        .eq('guardian_id', session.user.id);

      if (links && links.length > 0) {
        const studentIds = links.map((l) => l.student_id);
        const [{ data: studentUsers }, { data: studentRecords }] = await Promise.all([
          supabase.from('users').select('id, name, email').in('id', studentIds),
          supabase.from('students').select('user_id, grade_track').in('user_id', studentIds),
        ]);

        const tracksMap = new Map((studentRecords ?? []).map((s) => [s.user_id, s.grade_track]));

        const list: LinkedStudent[] = (studentUsers ?? []).map((u) => ({
          id: u.id,
          name: u.name || 'Öğrenci',
          email: u.email || '',
          gradeTrack: tracksMap.get(u.id) || 'yks',
        }));

        setStudents(list);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Profil yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const handleUnlinkStudent = (studentId: string, studentName: string) => {
    Alert.alert(
      'Öğrenci Bağlantısını Kaldır',
      `"${studentName}" adlı öğrencinin takibini sonlandırmak istediğinizden emin misiniz?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Kaldır',
          style: 'destructive',
          onPress: async () => {
            const {
              data: { session },
            } = await supabase.auth.getSession();
            if (!session) return;

            const { error } = await supabase
              .from('guardian_links')
              .delete()
              .eq('guardian_id', session.user.id)
              .eq('student_id', studentId);

            if (error) {
              Alert.alert('Hata', 'Bağlantı kaldırılırken bir hata oluştu.');
            } else {
              setStudents((prev) => prev.filter((s) => s.id !== studentId));
              Alert.alert('Bilgi', 'Öğrenci bağlantısı kaldırıldı.');
            }
          },
        },
      ]
    );
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
      const { error } = await supabase.rpc('redeem_guardian_code', {
        p_code: cleanCode,
      });

      if (error) {
        setLinkError(error.message || 'Öğrenci bağlanamadı.');
        setLinkLoading(false);
        return;
      }

      Alert.alert('Tebrikler!', 'Öğrenci başarıyla bağlandı.');
      setLinkModalVisible(false);
      setLinkCode('');
      loadProfile();
    } catch (err: any) {
      setLinkError(err?.message || 'Bir sorun oluştu.');
    } finally {
      setLinkLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#f97316" />
        <Text style={styles.loadingText}>Profil Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Üst Profil Kartı */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Ionicons name="person" size={32} color="#f97316" />
          </View>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userEmail}>{userEmail}</Text>
          {userPhone ? <Text style={styles.userPhone}>{userPhone}</Text> : null}

          <View style={styles.roleBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#f97316" />
            <Text style={styles.roleBadgeText}>DersoLab Veli Hesabı</Text>
          </View>
        </View>

        {/* Bağlı Öğrenciler Bölümü */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Bağlı Öğrenciler ({students.length})</Text>
            <TouchableOpacity
              style={styles.addStudentBtn}
              onPress={() => {
                setLinkError('');
                setLinkCode('');
                setLinkModalVisible(true);
              }}
            >
              <Ionicons name="add" size={16} color="#f97316" />
              <Text style={styles.addStudentText}>Yeni Öğrenci</Text>
            </TouchableOpacity>
          </View>

          {students.length === 0 ? (
            <View style={styles.emptyStudentCard}>
              <Ionicons name="school-outline" size={24} color="#71717a" />
              <Text style={styles.emptyStudentText}>Bağlı öğrenci bulunmuyor.</Text>
            </View>
          ) : (
            <View style={styles.studentsList}>
              {students.map((st) => (
                <View key={st.id} style={styles.studentItemCard}>
                  <View style={styles.studentItemInfo}>
                    <Text style={styles.studentItemName}>{st.name}</Text>
                    <Text style={styles.studentItemTrack}>
                      Hedef: {st.gradeTrack ? st.gradeTrack.toUpperCase() : 'YKS'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.unlinkBtn}
                    onPress={() => handleUnlinkStudent(st.id, st.name)}
                  >
                    <Ionicons name="link-outline" size={16} color="#ef4444" />
                    <Text style={styles.unlinkBtnText}>Kaldır</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bildirim ve Tercihler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayarlar ve Tercihler</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={20} color="#a1a1aa" />
              <Text style={styles.settingLabel}>Ders ve Ödev Bildirimleri</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#27272a', true: '#f97316' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        {/* DersoLab Hakkında & Güvenlik */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Bilgileri</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Uygulama Sürümü</Text>
              <Text style={styles.infoValue}>1.0.0 (Parent Build)</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>DersoLab Canlı Özel Ders</Text>
            </View>
          </View>
        </View>

        {/* Çıkış Butonu */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={18} color="#ef4444" />
          <Text style={styles.signOutBtnText}>Oturumu Kapat</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Kodla Öğrenci Bağlama Modalı */}
      <Modal
        visible={linkModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLinkModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Öğrenci Kodu Gir</Text>
              <TouchableOpacity
                onPress={() => setLinkModalVisible(false)}
                style={styles.modalCloseBtn}
              >
                <Ionicons name="close" size={22} color="#a1a1aa" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Öğrencinizin DersoLab profilindeki 8 haneli tek kullanımlık bağlantı kodunu giriniz.
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
    paddingTop: 20,
    paddingBottom: 110,
  },
  userCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  userAvatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  userEmail: {
    color: '#a1a1aa',
    fontSize: 13,
  },
  userPhone: {
    color: '#71717a',
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 14,
    gap: 6,
  },
  roleBadgeText: {
    color: '#f97316',
    fontSize: 11,
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  addStudentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addStudentText: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyStudentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 16,
    gap: 10,
  },
  emptyStudentText: {
    color: '#71717a',
    fontSize: 13,
  },
  studentsList: {
    gap: 10,
  },
  studentItemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
  },
  studentItemInfo: {
    flex: 1,
  },
  studentItemName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  studentItemTrack: {
    color: '#a1a1aa',
    fontSize: 11,
  },
  unlinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  unlinkBtnText: {
    color: '#ef4444',
    fontSize: 11,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingLabel: {
    color: '#e4e4e7',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: '#71717a',
    fontSize: 13,
  },
  infoValue: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  signOutBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
  },
  signOutBtnText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
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
});
