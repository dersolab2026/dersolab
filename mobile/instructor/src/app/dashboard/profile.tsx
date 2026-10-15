import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

export default function InstructorProfileScreen() {
  const router = useRouter();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [bio, setBio] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [isVerified, setIsVerified] = useState(false);
  const [rating, setRating] = useState(5.0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      setUserEmail(session.user.email || '');

      const [{ data: userData }, { data: instructorData }] = await Promise.all([
        supabase.from('users').select('name').eq('id', session.user.id).single(),
        supabase
          .from('instructors')
          .select('bio, subjects, verified, rating, total_reviews')
          .eq('user_id', session.user.id)
          .maybeSingle(),
      ]);

      if (userData?.name) {
        setUserName(userData.name);
      } else if (session.user.user_metadata?.name) {
        setUserName(session.user.user_metadata.name);
      }

      if (instructorData) {
        setBio(instructorData.bio || '');
        setSubjects(instructorData.subjects || []);
        setIsVerified(instructorData.verified ?? false);
        setRating(instructorData.rating ?? 5.0);
        setTotalReviews(instructorData.total_reviews ?? 0);
      }
    } catch (err) {
      console.error('Profil yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Çıkış Yap', 'Hesabınızdan çıkış yapmak istediğinize emin misiniz?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          try {
            await supabase.auth.signOut();
            router.replace('/');
          } catch (err: any) {
            Alert.alert('Hata', err?.message || 'Çıkış yapılırken bir hata oluştu.');
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eğitmen Profili</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profil Kartı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {userName ? userName.charAt(0).toUpperCase() : 'E'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{userName || 'Eğitmen'}</Text>
            <Text style={styles.userEmail}>{userEmail}</Text>

            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.statusBadge,
                  isVerified ? styles.statusVerified : styles.statusPending,
                ]}
              >
                <Ionicons
                  name={isVerified ? 'checkmark-circle' : 'time-outline'}
                  size={12}
                  color={isVerified ? '#10b981' : '#f59e0b'}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    { color: isVerified ? '#10b981' : '#f59e0b' },
                  ]}
                >
                  {isVerified ? 'Onaylı Eğitmen' : 'Doğrulama Bekliyor'}
                </Text>
              </View>

              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={styles.ratingBadgeText}>
                  {rating.toFixed(1)} ({totalReviews})
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Branşlar */}
        {subjects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Uzmanlık & Branşlar</Text>
            <View style={styles.subjectChipsRow}>
              {subjects.map((sub, index) => (
                <View key={index} style={styles.subjectChip}>
                  <Text style={styles.subjectChipText}>{sub}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Hakkında */}
        {bio ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Eğitmen Özgeçmişi</Text>
            <View style={styles.bioCard}>
              <Text style={styles.bioText}>{bio}</Text>
            </View>
          </View>
        ) : null}

        {/* Uygulama Ayarları */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Uygulama Ayarları</Text>
          <View style={styles.cardGroup}>
            <View style={styles.cardItemRow}>
              <View style={styles.cardItemLeft}>
                <Ionicons name="notifications-outline" size={20} color="#818cf8" />
                <Text style={styles.cardItemText}>Ders Hatırlatıcı Bildirimler</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#27272a', true: '#6366f1' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.cardItemRow}>
              <View style={styles.cardItemLeft}>
                <Ionicons name="videocam-outline" size={20} color="#818cf8" />
                <Text style={styles.cardItemText}>Google Meet Entegrasyonu</Text>
              </View>
              <View style={styles.activePill}>
                <Text style={styles.activePillText}>Otomatik</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Destek & Sözleşmeler */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Yardım & Bilgi</Text>
          <View style={styles.cardGroup}>
            <TouchableOpacity
              style={styles.cardItemRow}
              onPress={() => Linking.openURL('https://dersolab.com/terms')}
            >
              <View style={styles.cardItemLeft}>
                <Ionicons name="document-text-outline" size={20} color="#71717a" />
                <Text style={styles.cardItemText}>Eğitmen Hizmet Şartları</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.cardItemRow}
              onPress={() => Linking.openURL('https://dersolab.com/contact')}
            >
              <View style={styles.cardItemLeft}>
                <Ionicons name="help-buoy-outline" size={20} color="#71717a" />
                <Text style={styles.cardItemText}>DersoLab Eğitmen Destek</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#71717a" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Çıkış Yap Butonu */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={loggingOut}
        >
          {loggingOut ? (
            <ActivityIndicator color="#ef4444" size="small" />
          ) : (
            <>
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.signOutButtonText}>Oturumu Kapat</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Versiyon */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>DersoLab Eğitmen Mobil v1.0.0 (2026)</Text>
        </View>
      </ScrollView>
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
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#818cf8',
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  userEmail: {
    color: '#71717a',
    fontSize: 12,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  statusVerified: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  ratingBadgeText: {
    color: '#f59e0b',
    fontSize: 10,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  subjectChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  subjectChipText: {
    color: '#818cf8',
    fontSize: 12,
    fontWeight: '600',
  },
  bioCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 14,
    padding: 14,
  },
  bioText: {
    color: '#d4d4d8',
    fontSize: 13,
    lineHeight: 18,
  },
  cardGroup: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cardItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardItemText: {
    color: '#f4f4f5',
    fontSize: 14,
    fontWeight: '500',
  },
  activePill: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  activePillText: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginHorizontal: 16,
  },
  signOutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  signOutButtonText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    color: '#52525b',
    fontSize: 11,
  },
});
