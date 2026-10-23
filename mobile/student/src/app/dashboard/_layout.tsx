import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

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
    { id: 'home', label: 'Ana Sayfa', path: '/dashboard', icon: 'home-outline', activeIcon: 'home', color: '#00e5ff' },
    { id: 'instructors', label: 'Eğitmenler', path: '/dashboard/instructors', icon: 'search-outline', activeIcon: 'search', color: '#38bdf8' },
    { id: 'lessons', label: 'Derslerim', path: '/dashboard/lessons', icon: 'videocam-outline', activeIcon: 'videocam', color: '#6366f1' },
    { id: 'lab', label: 'L.A.B.', path: '/dashboard/lab', icon: 'flask-outline', activeIcon: 'flask', color: '#a855f7' },
    { id: 'ai', label: 'AI Soru', path: '/dashboard/ai', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip', color: '#ec4899' },
    { id: 'homework', label: 'Ödevlerim', path: '/dashboard/homework', icon: 'school-outline', activeIcon: 'school', color: '#06b6d4' },
    { id: 'netlerim', label: 'Netlerim', path: '/dashboard/netlerim', icon: 'trending-up-outline', activeIcon: 'trending-up', color: '#10b981' },
    { id: 'diary', label: 'Günlük', path: '/dashboard/diary', icon: 'calendar-outline', activeIcon: 'calendar', color: '#f59e0b' },
    { id: 'profile', label: 'Profil', path: '/dashboard/profile', icon: 'person-outline', activeIcon: 'person', color: '#94a3b8' },
  ];

  const checkIsActive = (itemPath: string) => {
    if (itemPath === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/dashboard/' || pathname === '/dashboard/index';
    }
    return pathname.startsWith(itemPath);
  };

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.mainLayout}>
        {/* SOL PANEL (KOMPAKT & ŞIK SOL MENÜ) */}
        <View style={[styles.sidebar, { width: sidebarWidth }]}>
          {/* Logo / Brand Header */}
          <View style={styles.brandContainer}>
            <LinearGradient colors={['#00e5ff', '#3b82f6']} style={styles.brandIconBox}>
              <Ionicons name="flask" size={18} color="#030712" />
            </LinearGradient>
            {isExpanded && (
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.brandTitle}>DersoLab</Text>
                <Text style={styles.brandSubtitle}>Öğrenci</Text>
              </View>
            )}
          </View>

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

          {/* Alt Sabit Kısım */}
          <View style={styles.sidebarFooter}>
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
    backgroundColor: '#030712',
  },
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#070c18',
    borderRightWidth: 1,
    borderRightColor: '#1e293b',
    paddingTop: Platform.OS === 'android' ? 36 : 10,
    paddingBottom: 10,
    alignItems: 'center',
    zIndex: 50,
  },
  brandContainer: {
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  brandIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
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
    color: '#00e5ff',
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
    borderTopColor: '#1e293b',
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
    backgroundColor: '#030712',
  },
});
