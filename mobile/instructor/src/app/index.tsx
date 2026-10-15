import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function InstructorAppIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Arka Plan Efektleri */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orb1}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.25)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
          />
        </View>
        <View style={styles.orb2}>
          <LinearGradient
            colors={['rgba(249, 115, 22, 0.2)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header / Logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/fox-head.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <View style={styles.brandTitleRow}>
              <Text style={styles.logoTextBase}>
                Derso<Text style={styles.logoTextOrange}>Lab</Text>
              </Text>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>EĞİTMEN</Text>
              </View>
            </View>
          </View>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Canlı Ders & Takvim Yönetimi</Text>
          </View>
        </View>

        {/* Hero Bölümü */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Öğrencilerinizi ve{'\n'}
            Derslerinizi <Text style={styles.heroHighlight}>Cepten Yönetin</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Canlı derslere tek tıkla katılın, yoklama alın, ödev atayın ve haftalık müsaitliğinizi kolayca planlayın.
          </Text>
        </View>

        {/* Özellikler */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.15)' }]}>
              <Ionicons name="videocam-outline" size={22} color="#6366f1" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Google Meet Entegrasyonu</Text>
              <Text style={styles.featureDesc}>
                Planlanmış derslerinize doğrudan mobil uygulamadan tek dokunuşla katılın.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <Ionicons name="calendar-outline" size={22} color="#f97316" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Haftalık Müsaitlik Takvimi</Text>
              <Text style={styles.featureDesc}>
                Öğrencilerin rezervasyon yapabileceği saat aralıklarını dinamik olarak yönetin.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="book-outline" size={22} color="#10b981" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Ödev Atama & İnceleme</Text>
              <Text style={styles.featureDesc}>
                Ders sonrası öğrencilerinize ödev verin ve tamamlanma durumlarını kontrol edin.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="sparkles-outline" size={22} color="#a855f7" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>AI Ders & Soru Planlayıcı</Text>
              <Text style={styles.featureDesc}>
                LGS ve YKS kazanımlarına özel ders akışları ve yeni nesil sorular türetin.
              </Text>
            </View>
          </View>
        </View>

        {/* Butonlar */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.primaryButtonWrapper}
            activeOpacity={0.85}
            onPress={() => router.push('/login')}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Eğitmen Girişi Yap</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryButtonText}>Eğitmen Ol / Başvur</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            DersoLab eğitmen kadrosuna katılarak online özel ders vermeye hemen başlayabilirsiniz.
          </Text>
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
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  orb1: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: (width * 0.9) / 2,
  },
  orb2: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: width,
    height: width,
    borderRadius: width / 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoImage: {
    width: 64,
    height: 64,
    marginBottom: 8,
  },
  brandTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoTextBase: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoTextOrange: {
    color: '#f97316',
  },
  roleBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.4)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleBadgeText: {
    color: '#818cf8',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    color: '#a1a1aa',
    fontSize: 12,
    fontWeight: '600',
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroHighlight: {
    color: '#818cf8',
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
    lineHeight: 21,
    fontWeight: '500',
  },
  featuresContainer: {
    gap: 12,
    marginBottom: 32,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  featureIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#f4f4f5',
    marginBottom: 3,
  },
  featureDesc: {
    fontSize: 12,
    color: '#71717a',
    lineHeight: 16,
  },
  buttonSection: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    color: '#e4e4e7',
    fontSize: 15,
    fontWeight: '600',
  },
  footerNote: {
    alignItems: 'center',
  },
  footerNoteText: {
    color: '#52525b',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
