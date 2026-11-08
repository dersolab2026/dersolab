import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function StudentDashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Tablet veya Geniş Ekran kontrolü
  const isExpanded = width >= 768;
  const sidebarWidth = isExpanded ? 200 : 58;

  const NAV_ITEMS: {
    id: string;
    label: string;
    path: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    { id: 'home', label: 'Genel Bakış', path: '/dashboard', icon: 'home-outline', activeIcon: 'home', color: '#f97316' },
    { id: 'packages', label: 'Kredi Paketleri', path: '/dashboard/packages', icon: 'wallet-outline', activeIcon: 'wallet', color: '#f97316' },
    { id: 'instructors', label: 'Eğitmenler', path: '/dashboard/instructors', icon: 'search-outline', activeIcon: 'search', color: '#f97316' },
    { id: 'lessons', label: 'Derslerim', path: '/dashboard/lessons', icon: 'videocam-outline', activeIcon: 'videocam', color: '#f97316' },
    { id: 'lab', label: 'L.A.B. Deneyleri', path: '/dashboard/lab', icon: 'cube-outline', activeIcon: 'cube', color: '#f97316' },
    { id: 'ai', label: 'AI Soru Asistanı', path: '/dashboard/ai', icon: 'sparkles-outline', activeIcon: 'sparkles', color: '#f97316' },
    { id: 'homework', label: 'Ödevlerim', path: '/dashboard/homework', icon: 'school-outline', activeIcon: 'school', color: '#f97316' },
    { id: 'netlerim', label: 'Net & Puan', path: '/dashboard/netlerim', icon: 'trending-up-outline', activeIcon: 'trending-up', color: '#f97316' },
    { id: 'diary', label: 'Günlük & Ajanda', path: '/dashboard/diary', icon: 'calendar-outline', activeIcon: 'calendar', color: '#f97316' },
    { id: 'profile', label: 'Profil & Kod', path: '/dashboard/profile', icon: 'person-outline', activeIcon: 'person', color: '#f97316' },
  ];

  const checkIsActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/' || pathname === '/dashboard/index';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <SafeAreaView style={styles.rootContainer} edges={['top', 'bottom']}>
      <View style={styles.mainLayout}>
        {/* SOL PANEL (WEB DASHBOARDNAV İLE BİREBİR TİLKİ MASKOTLU SOL MENÜ) */}
        <View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Logo / Fox Mascot Header */}
          <TouchableOpacity
            style={styles.brandContainer}
            onPress={() => router.push('/dashboard' as any)}
            activeOpacity={0.8}
          >
            <View style={styles.brandIconBox}>
              <Image
                source={require('../../../assets/fox-head.png')}
                style={{ width: 26, height: 26 }}
                resizeMode="contain"
              />
            </View>
            {isExpanded && (
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.brandTitle}>
                  Derso<Text style={{ color: '#fb923c' }}>Lab</Text>
                </Text>
                <Text style={styles.brandSubtitle}>Öğrenci Paneli</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Menü Butonları Listesi */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.navItemsList}
          >
            {NAV_ITEMS.map((item) => {
              const isActive = checkIsActive(item.path);

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.path as any)}
                  activeOpacity={0.7}
                  style={[
                    styles.navItemBase,
                    isExpanded ? styles.navItemExpanded : styles.navItemCompact,
                    isActive && {
                      backgroundColor: `${item.color}22`,
                      borderColor: `${item.color}55`,
                    },
                  ]}
                >
                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={20}
                    color={isActive ? item.color : '#94a3b8'}
                  />

                  {isExpanded && (
                    <Text
                      style={[
                        styles.expandedLabel,
                        isActive && { color: '#ffffff', fontWeight: '800' },
                      ]}
                      numberOfLines={1}
                    >
                      {item.label}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Alt Sabit Kısım: Rol Değiştir / Ana Ekran */}
          <View style={styles.sidebarFooter}>
            <TouchableOpacity
              onPress={() => router.replace('/')}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                backgroundColor: 'rgba(245, 158, 11, 0.14)',
                borderWidth: 1,
                borderColor: 'rgba(245, 158, 11, 0.35)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6,
              }}
            >
              <Ionicons name="swap-horizontal" size={18} color="#f59e0b" />
            </TouchableOpacity>
            <View style={styles.onlineDot} />
          </View>
        </View>

        {/* SAĞ İÇERİK ALANI (%100 ESNEK VE FERAH) */}
        <View style={styles.screenContentArea}>
          <Slot />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#0a0a0a',
    borderRightWidth: 1,
    borderRightColor: 'rgba(255, 255, 255, 0.10)',
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: 'center',
    zIndex: 50,
  },
  brandContainer: {
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.10)',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  brandIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(249, 115, 22, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.40)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ffffff',
  },
  brandSubtitle: {
    fontSize: 10,
    color: '#fb923c',
    fontWeight: '700',
  },
  navItemsList: {
    gap: 8,
    paddingVertical: 4,
    alignItems: 'center',
    width: '100%',
  },
  navItemBase: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCompact: {
    width: 42,
    height: 42,
  },
  navItemExpanded: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  expandedLabel: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '600',
  },
  sidebarFooter: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.10)',
    alignItems: 'center',
    width: '100%',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  screenContentArea: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
});
