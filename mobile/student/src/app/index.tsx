import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function StudentAppIndex() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Arkaplan Neon Efektleri (Orbs) */}
      <View style={styles.backgroundContainer}>
        <View style={[styles.orb1, { opacity: 0.5 }]}>
          <LinearGradient
            colors={['rgba(79, 70, 229, 0.4)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
          />
        </View>
        <View style={[styles.orb2, { opacity: 0.4 }]}>
          <LinearGradient
            colors={['rgba(225, 29, 72, 0.3)', 'transparent']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0.5, y: 0.5 }}
          />
        </View>
      </View>

      <View style={styles.content}>
        {/* Logo / Mascot Area */}
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/fox-head.png')} 
            style={styles.logoImage} 
            resizeMode="contain" 
          />
          <View style={styles.logoTextWrapper}>
            <Text style={styles.logoTextBase}>Derso<Text style={styles.logoTextGradient}>Lab</Text></Text>
          </View>
          
          <View style={styles.badge}>
            <View style={styles.badgeDotContainer}>
              <View style={styles.badgeDotBg} />
              <View style={styles.badgeDot} />
            </View>
            <Text style={styles.badgeText}>Geleceğin Eğitim Platformu</Text>
          </View>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>
            Sınava Hazırlıkta{'\n'}Sınırları Kaldır
          </Text>
          <Text style={styles.subtitle}>
            Hedefindeki üniversiteye veya liseye ulaşmak için ihtiyacın olan her şey tek bir platformda. Yapay zeka ile hızlan, uzman eğitmenlerle fark yarat.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity 
              style={styles.primaryButton} 
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#4f46e5', '#e11d48', '#f59e0b']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <Text style={styles.primaryButtonText}>Giriş Yap</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
          <Link href="/register" asChild>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Hesap Oluştur</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712', // Web'deki gibi derin siyah
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
    paddingVertical: 40,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: 60,
    height: 60,
    marginBottom: 16,
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
    color: '#a5b4fc', // Gradient olmadığı için en yakın neon lila/mavi renk
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    marginTop: 24,
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
    backgroundColor: '#f59e0b',
    borderRadius: 5,
    opacity: 0.5,
  },
  badgeDot: {
    width: 6,
    height: 6,
    backgroundColor: '#f59e0b',
    borderRadius: 3,
  },
  badgeText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -1,
    lineHeight: 44,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '300',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 20,
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
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
});
