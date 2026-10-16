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

export default function DashboardLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();

  // Tablet/Geniş Ekran kontrolü
  const isExpanded = width >= 768;

  const NAV_ITEMS: {
    id: string;
    label: string;
    path: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    color: string;
  }[] = [
    { id: 'home', label: 'Ana Sayfa', path: '/dashboard', icon: 'home-outline', activeIcon: 'home', color: '#00e5ff' },
    { id: 'lab', label: 'L.A.B.', path: '/dashboard/lab', icon: 'flask-outline', activeIcon: 'flask', color: '#a855f7' },
    { id: 'homework', label: 'Ödevlerim', path: '/dashboard/homework', icon: 'school-outline', activeIcon: 'school', color: '#38bdf8' },
    { id: 'netlerim', label: 'Netlerim', path: '/dashboard/netlerim', icon: 'trending-up-outline', activeIcon: 'trending-up', color: '#10b981' },
    { id: 'diary', label: 'Günlük', path: '/dashboard/diary', icon: 'calendar-outline', activeIcon: 'calendar', color: '#f59e0b' },
    { id: 'ai', label: 'AI Soru', path: '/dashboard/ai', icon: 'hardware-chip-outline', activeIcon: 'hardware-chip', color: '#ec4899' },
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
        {/* SOL PANEL (GENİŞ & FERAH KENAR ÇUBUĞU) */}
        <View style={[styles.sidebar, isExpanded ? styles.sidebarExpanded : styles.sidebarCompact]}>
          {/* Logo / Brand Header */}
          <View style={[styles.brandContainer, isExpanded ? styles.brandContainerExpanded : styles.brandContainerCompact]}>
            <LinearGradient colors={['#00e5ff', '#3b82f6']} style={styles.brandIconBox}>
              <Ionicons name="flask" size={20} color="#030712" />
            </LinearGradient>
            {isExpanded && (
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.brandTitle}>DersoLab</Text>
                <Text style={styles.brandSubtitle}>Öğrenci Paneli</Text>
              </View>
            )}
          </View>

          {/* Nav Items List */}
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
                    isActive && styles.navItemActive,
                    isActive && { borderColor: `${item.color}44` },
                  ]}
                >
                  {/* Aktif İndikatörü */}
                  {isActive && <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />}

                  <Ionicons
                    name={isActive ? item.activeIcon : item.icon}
                    size={22}
                    color={isActive ? item.color : '#94a3b8'}
                  />

                  {isExpanded ? (
                    <Text
                      style={[
                        styles.expandedLabel,
                        isActive && { color: '#ffffff', fontWeight: '800' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.compactLabel,
                        isActive && { color: item.color, fontWeight: '800' },
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

          {/* Alt Kısım */}
          {isExpanded && (
            <View style={styles.sidebarFooter}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>DersoLab v1.0</Text>
            </View>
          )}
        </View>

        {/* SAĞ İÇERİK ALANI */}
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
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 16,
    zIndex: 50,
  },
  sidebarCompact: {
    width: 78,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  sidebarExpanded: {
    width: 220,
    paddingHorizontal: 14,
  },
  brandContainer: {
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
    marginBottom: 12,
  },
  brandContainerCompact: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  brandContainerExpanded: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
  },
  brandIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 11,
    color: '#00e5ff',
    fontWeight: '700',
  },
  navItemsList: {
    gap: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  navItemBase: {
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    position: 'relative',
    overflow: 'hidden',
  },
  navItemCompact: {
    width: 70,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemExpanded: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 6,
    bottom: 6,
    width: 3.5,
    borderRadius: 2,
  },
  compactLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
  },
  expandedLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94a3b8',
  },
  sidebarFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 14,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    gap: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  screenContentArea: {
    flex: 1,
    backgroundColor: '#030712',
  },
});
