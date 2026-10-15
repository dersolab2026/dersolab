import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        // Fetch full profile from users table
        const { data: profileData } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        // Merge auth user metadata and public users table profile data
        setUser({
          ...authUser,
          profile: profileData || null
        });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Hesap Bilgileri' },
    { icon: 'notifications-outline', title: 'Bildirimler' },
    { icon: 'shield-checkmark-outline', title: 'Gizlilik ve Güvenlik' },
    { icon: 'help-circle-outline', title: 'Yardım ve Destek' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Profil</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            {user?.profile?.avatar_url ? (
               <Image source={{ uri: user.profile.avatar_url }} style={{width: 64, height: 64, borderRadius: 32}} />
            ) : (
               <Text style={styles.avatarText}>
                 {user?.profile?.name?.charAt(0) || user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || 'Ö'}
               </Text>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.profile?.name || user?.user_metadata?.full_name || 'Öğrenci'}</Text>
            <Text style={styles.profileEmail}>{user?.profile?.email || user?.email || 'ogrenci@dersolab.com'}</Text>
            {user?.user_metadata?.grade && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {user?.user_metadata?.grade}. Sınıf {user?.user_metadata?.track ? ` - ${user.user_metadata.track}` : ''}
                </Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Ionicons name="pencil" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Ayarlar</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconBox}>
                    <Ionicons name={item.icon as any} size={20} color="#94a3b8" />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#475569" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Çıkış Yap</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>DersoLab v1.0.0</Text>
      </ScrollView>
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
  }
});
