import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export default function ParentLoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(
          error.message === 'Invalid login credentials'
            ? 'E-posta veya şifre hatalı.'
            : error.message
        );
        setLoading(false);
        return;
      }

      if (data.session) {
        router.replace('/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Giriş yapılırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const redirectUrl = Linking.createURL('/');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google ile giriş başlatılamadı.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Üst Bar */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#f4f4f5" />
          </TouchableOpacity>

          {/* Logo & Başlık */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/fox-head.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Veli Girişi</Text>
            <Text style={styles.subtitle}>
              Öğrencinizin gelişimini takip etmek için hesabınıza giriş yapın
            </Text>
          </View>

          {/* Hata Mesajı */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Form Alanları */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta Adresi</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="ornek@veli.com"
                  placeholderTextColor="#52525b"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#52525b"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#71717a"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Giriş Butonu */}
            <TouchableOpacity
              style={styles.loginButtonWrapper}
              activeOpacity={0.85}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    <Ionicons name="log-in-outline" size={20} color="#ffffff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Ayırıcı */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>veya</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Giriş */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.8}
              onPress={handleGoogleLogin}
            >
              <Ionicons name="logo-google" size={18} color="#ffffff" />
              <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
            </TouchableOpacity>
          </View>

          {/* Kayıt Ol Bağlantısı */}
          <View style={styles.registerRow}>
            <Text style={styles.registerPrompt}>Veli hesabınız yok mu?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.registerLink}>Kayıt Olun</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090b',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoImage: {
    width: 54,
    height: 54,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    flex: 1,
  },
  form: {
    gap: 16,
    marginBottom: 28,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#d4d4d8',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  eyeButton: {
    padding: 4,
  },
  loginButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 6,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 8,
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  dividerText: {
    color: '#71717a',
    fontSize: 12,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    height: 50,
    gap: 10,
  },
  googleButtonText: {
    color: '#e4e4e7',
    fontSize: 14,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  registerPrompt: {
    color: '#71717a',
    fontSize: 13,
  },
  registerLink: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
});
