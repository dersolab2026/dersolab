import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function UnifiedAppIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar style="light" />

      {/* Web (#0a0a0a) Obsidian Arkaplan */}
      <LinearGradient
        colors={['#11131a', '#0a0a0a', '#0a0a0a']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Logo / Mascot Area */}
        <View style={styles.logoContainer}>
          <View
            style={{
              width: 84,
              height: 84,
              borderRadius: 24,
              backgroundColor: 'rgba(249, 115, 22, 0.12)',
              borderWidth: 1,
              borderColor: 'rgba(249, 115, 22, 0.35)',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Image
              source={require('../../assets/fox-mascot.png')}
              style={{ width: 62, height: 62 }}
              resizeMode="contain"
            />
          </View>
          <View style={styles.logoTextWrapper}>
            <Text style={styles.logoTextBase}>
              Derso<Text style={styles.logoTextGradient}>Lab</Text>
            </Text>
          </View>

          <View style={styles.badge}>
            <View style={styles.badgeDotContainer}>
              <View style={styles.badgeDotBg} />
              <View style={styles.badgeDot} />
            </View>
            <Text style={styles.badgeText}>ÖĞRENCİ · VELİ · EĞİTMEN</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Sınava Hazırlıkta{'\n'}Sınırları Kaldır
          </Text>
          <Text style={styles.subtitle}>
            3D Deney Laboratuvarı (L.A.B.), AI Soru Çözüm Asistanı, Birebir Canlı Dersler ve Veli Gelişim Takibi tek bir native uygulamada.
          </Text>
        </View>

        {/* Action Buttons + Quick Native Role Switcher */}
        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.85}>
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Giriş Yap</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <Link href="/register" asChild>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.85}>
              <Text style={styles.secondaryButtonText}>Ücretsiz Hesap Oluştur</Text>
            </TouchableOpacity>
          </Link>

          {/* Hızlı Native Arayüz Keşfi (Web Role Renkleriyle Birebir) */}
          <View style={styles.quickExploreBox}>
            <Text style={styles.quickExploreTitle}>PANELLERİ DOĞRUDAN KEŞFET</Text>
            <View style={styles.quickRoleRow}>
              <TouchableOpacity
                style={[styles.roleChip, { backgroundColor: 'rgba(249, 115, 22, 0.14)', borderColor: 'rgba(249, 115, 22, 0.4)' }]}
                onPress={() => router.push('/dashboard' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="school" size={15} color="#fb923c" />
                <Text style={[styles.roleChipText, { color: '#fb923c' }]}>Öğrenci</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleChip, { backgroundColor: 'rgba(16, 185, 129, 0.14)', borderColor: 'rgba(16, 185, 129, 0.4)' }]}
                onPress={() => router.push('/parent' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="shield-checkmark" size={15} color="#34d399" />
                <Text style={[styles.roleChipText, { color: '#34d399' }]}>Veli</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.roleChip, { backgroundColor: 'rgba(59, 130, 246, 0.14)', borderColor: 'rgba(59, 130, 246, 0.4)' }]}
                onPress={() => router.push('/instructor' as any)}
                activeOpacity={0.8}
              >
                <Ionicons name="easel" size={15} color="#60a5fa" />
                <Text style={[styles.roleChipText, { color: '#60a5fa' }]}>Eğitmen</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    zIndex: 0,
  },
  orb1: {
    position: 'absolute',
    top: -height * 0.1,
    left: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
  },
  orb2: {
    position: 'absolute',
    bottom: -height * 0.1,
    right: -width * 0.2,
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: width * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 28,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  logoImage: {
    width: 64,
    height: 64,
    marginBottom: 12,
  },
  logoTextWrapper: {
    flexDirection: 'row',
  },
  logoTextBase: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -1,
  },
  logoTextGradient: {
    color: '#f59e0b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 18,
  },
  badgeDotContainer: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeDotBg: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#10b981',
    borderRadius: 5,
    opacity: 0.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#10b981',
    borderRadius: 3,
  },
  badgeText: {
    color: '#e2e8f0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -1,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 10,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  quickExploreBox: {
    marginTop: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  quickExploreTitle: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  quickRoleRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
  },
  roleChipText: {
    fontSize: 12,
    fontWeight: '800',
  },
});
