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

export default function ParentAppIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Arka Plan Işık Efektleri */}
      <View style={styles.backgroundContainer}>
        <View style={styles.orb1}>
          <LinearGradient
            colors={['rgba(249, 115, 22, 0.25)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
          />
        </View>
        <View style={styles.orb2}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.2)', 'transparent']}
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
                <Text style={styles.roleBadgeText}>VELİ</Text>
              </View>
            </View>
          </View>

          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Çocuğunuzun Gelişimini Anlık İzleyin</Text>
          </View>
        </View>

        {/* Hero Metni */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Çocuğunuzun Başarısı{'\n'}
            <Text style={styles.heroHighlight}>Cebinizde</Text>
          </Text>
          <Text style={styles.heroSubtitle}>
            Canlı ders takipleri, deneme sınavı netleri, ödev teslimleri ve veli rehberlik danışmanı tek uygulamada.
          </Text>
        </View>

        {/* Öne Çıkan Özellik Kartları */}
        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(249, 115, 22, 0.15)' }]}>
              <Ionicons name="calendar-outline" size={22} color="#f97316" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Canlı Ders & Katılım</Text>
              <Text style={styles.featureDesc}>Hangi gün hangi eğitmenle ders yapıldığını ve katılım oranını anlık görün.</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(56, 189, 248, 0.15)' }]}>
              <Ionicons name="trending-up-outline" size={22} color="#38bdf8" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Deneme Sınavı Netleri</Text>
              <Text style={styles.featureDesc}>LGS ve YKS denemelerindeki net artışlarını ve ders bazlı grafikleri takip edin.</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
              <Ionicons name="checkmark-done-circle-outline" size={22} color="#a855f7" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Ödev ve Görevler</Text>
              <Text style={styles.featureDesc}>Eğitmenler tarafından verilen ödevlerin tamamlanma durumunu kontrol edin.</Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Ionicons name="sparkles-outline" size={22} color="#10b981" />
            </View>
            <View style={styles.featureTextBox}>
              <Text style={styles.featureTitle}>Veli AI Danışmanı</Text>
              <Text style={styles.featureDesc}>Sınav senesinde çocuğunuza en doğru motivasyonu sağlamak için yapay zeka rehberi.</Text>
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
              colors={['#f97316', '#ea580c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Veli Girişi Yap</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryButtonText}>Yeni Veli Hesabı Aç</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerNote}>
          <Text style={styles.footerNoteText}>
            Öğrenciniz varsa öğrencinizin profilindeki 8 haneli kodla hesabınızı bağlayabilirsiniz.
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
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.4)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  roleBadgeText: {
    color: '#f97316',
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
    color: '#f97316',
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
