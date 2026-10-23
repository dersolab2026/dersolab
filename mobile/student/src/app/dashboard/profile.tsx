import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Modal,
  TextInput,
  Switch,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  // Notifications State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadUser();
    loadNotificationPref();
  }, []);

  const loadNotificationPref = async () => {
    try {
      const val = await AsyncStorage.getItem('student_notifications_enabled');
      if (val !== null) {
        setNotificationsEnabled(val === 'true');
      }
    } catch (e) {
      // ignore
    }
  };

  const toggleNotifications = async (val: boolean) => {
    setNotificationsEnabled(val);
    try {
      await AsyncStorage.setItem('student_notifications_enabled', String(val));
      Alert.alert('Bildirimler', val ? 'Ders ve ödev bildirimleri açıldı.' : 'Bildirimler kapatıldı.');
    } catch (e) {
      // ignore
    }
  };

  const loadUser = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (authUser) {
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        setUser({
          ...authUser,
          profile: profileData || null,
        });
        setNewName(profileData?.name || authUser?.user_metadata?.full_name || '');
      }
    } catch (err) {
      console.error('loadUser error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim() || !user) return;
    setSavingName(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: newName.trim() })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Hata', error.message);
      } else {
        setUser((prev: any) => ({
          ...prev,
          profile: {
            ...prev?.profile,
            name: newName.trim(),
          },
        }));
        Alert.alert('Başarılı 🎉', 'Profil adınız güncellendi.');
        setEditModalVisible(false);
      }
    } catch (e: any) {
      Alert.alert('Hata', e?.message || 'Güncelleme yapılamadı.');
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkmak istediğinize emin misiniz?', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace('/login');
        },
      },
    ]);
  };

  const handleMenuItemPress = (id: string) => {
    switch (id) {
      case 'account':
        Alert.alert(
          'Hesap Bilgileri',
          `Ad Soyad: ${user?.profile?.name || user?.user_metadata?.full_name || 'Öğrenci'}\n` +
          `E-Posta: ${user?.profile?.email || user?.email || '-'}\n` +
          `Rol: Öğrenci\n` +
          `Hesap ID: ${user?.id || '-'}`
        );
        break;
      case 'notifications':
        toggleNotifications(!notificationsEnabled);
        break;
      case 'privacy':
        Linking.openURL('https://dersolab.com/privacy');
        break;
      case 'support':
        Linking.openURL('https://dersolab.com/contact');
        break;
      default:
        break;
    }
  };

  const menuItems = [
    { id: 'account', icon: 'person-outline', title: 'Hesap Bilgileri' },
    { id: 'notifications', icon: 'notifications-outline', title: 'Bildirimler', isSwitch: true },
    { id: 'privacy', icon: 'shield-checkmark-outline', title: 'Gizlilik ve Güvenlik' },
    { id: 'support', icon: 'help-circle-outline', title: 'Yardım ve Destek' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#00e5ff" />
      </View>
    );
  }

  const studentName = user?.profile?.name || user?.user_metadata?.full_name || 'Öğrenci';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.profile?.avatar_url ? (
              <Image source={{ uri: user.profile.avatar_url }} style={{ width: 64, height: 64, borderRadius: 32 }} />
            ) : (
              <Text style={styles.avatarText}>
                {studentName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentName}</Text>
            <Text style={styles.profileEmail}>{user?.profile?.email || user?.email || 'ogrenci@dersolab.com'}</Text>
            {user?.user_metadata?.grade && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {user?.user_metadata?.grade}. Sınıf {user?.user_metadata?.track ? ` - ${user.user_metadata.track}` : ''}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setEditModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={18} color="#00e5ff" />
          </TouchableOpacity>
        </View>

        {/* Veli Bağlantı Bilgisi */}
        <View style={styles.parentLinkCard}>
          <View style={styles.parentLinkHeader}>
            <Ionicons name="link-outline" size={20} color="#38bdf8" />
            <Text style={styles.parentLinkTitle}>Veli Bağlantı Kodu</Text>
          </View>
          <Text style={styles.parentLinkDesc}>
            Velinizin sizin ders ve ödev durumunuzu takip edebilmesi için veli uygulamasında bu kodu kullanabilirsiniz:
          </Text>
          <View style={styles.parentLinkCodeBox}>
            <Text style={styles.parentLinkCodeText} selectable={true}>
              {user?.id ? user.id.slice(0, 8).toUpperCase() : 'DERSOLAB'}
            </Text>
          </View>
        </View>

        {/* Ayarlar Listesi */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ayarlar & Güvenlik</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleMenuItemPress(item.id)}
                activeOpacity={0.7}
                style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconBox}>
                    <Ionicons name={item.icon as any} size={20} color="#00e5ff" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>

                {item.isSwitch ? (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    trackColor={{ false: '#334155', true: '#00e5ff' }}
                    thumbColor="#ffffff"
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={18} color="#64748b" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>DersoLab v1.2.0 • Güvenli Butik Akademi</Text>
      </ScrollView>

      {/* Profil Düzenleme Modalı */}
      <Modal visible={editModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adı ve Soyadı Düzenle</Text>
            <TextInput
              style={styles.modalInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Adınız Soyadınız"
              placeholderTextColor="#64748b"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveName}
                disabled={savingName}
              >
                {savingName ? (
                  <ActivityIndicator size="small" color="#030712" />
                ) : (
                  <Text style={styles.modalSaveText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#030712' },
  container: { padding: 20, paddingTop: 20 },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '900', color: '#ffffff', letterSpacing: -0.5 },
  
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 32,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '600',
  },
  editBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  
  menuSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  menuCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    color: '#e2e8f0',
    fontSize: 15,
    fontWeight: '600',
  },
  
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 24,
  },
  logoutText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    color: '#475569',
    fontSize: 12,
  },
  parentLinkCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    marginBottom: 24,
  },
  parentLinkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  parentLinkTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
  parentLinkDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 10,
  },
  parentLinkCodeBox: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  parentLinkCodeText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 18,
    fontWeight: '900',
    color: '#00e5ff',
    letterSpacing: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 14,
  },
  modalInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalCancelText: {
    color: '#cbd5e1',
    fontWeight: '700',
    fontSize: 13,
  },
  modalSaveBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#00e5ff',
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#030712',
    fontWeight: '900',
    fontSize: 13,
  },
});
