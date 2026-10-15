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
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export default function ParentRegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRegister = async () => {
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Devam etmek için Kullanım Şartları ve Gizlilik Politikasını onaylamalısınız.');
      return;
    }

    if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
      setErrorMsg('Lütfen zorunlu alanları doldurunuz.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakterden oluşmalıdır.');
      return;
    }

    if (password !== passwordConfirm) {
      setErrorMsg('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: name.trim(),
            role: 'parent',
            phone: phone.trim() || null,
            terms_version: '2026-08-07',
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        Alert.alert(
          'Hesabınız Oluşturuldu!',
          'DersoLab Veli hesabınız başarıyla açıldı. Öğrencinizi bağlamak için öğrenci kodunuzu kullanabilirsiniz.',
          [{ text: 'Devam Et', onPress: () => router.replace('/dashboard') }]
        );
      } else {
        Alert.alert(
          'Kayıt Başarılı',
          'Hesabınızı onaylamak için e-posta adresinize gönderilen bağlantıya tıklayın, ardından giriş yapın.',
          [{ text: 'Giriş Yap', onPress: () => router.replace('/login') }]
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Kayıt işlemi sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      const redirectUrl = Linking.createURL('/');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            role: 'parent',
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Google ile kayıt başlatılamadı.');
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
          {/* Geri Butonu */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#f4f4f5" />
          </TouchableOpacity>

          {/* Başlık */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/fox-head.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.title}>Veli Hesabı Oluştur</Text>
            <Text style={styles.subtitle}>
              Çocuğunuzun derslerini, deneme netlerini ve ödevlerini tek noktadan izleyin
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
            {/* Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ad Soyad *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ahmet Yılmaz"
                  placeholderTextColor="#52525b"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* E-posta */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-posta Adresi *</Text>
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

            {/* Telefon (Opsiyonel) */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefon Numarası (Opsiyonel)</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="05xx xxx xx xx"
                  placeholderTextColor="#52525b"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Şifre */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="En az 6 karakter"
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

            {/* Şifre Tekrar */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Şifre Tekrar *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color="#71717a" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Şifrenizi tekrar girin"
                  placeholderTextColor="#52525b"
                  value={passwordConfirm}
                  onChangeText={setPasswordConfirm}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>

            {/* Şartlar Checkbox */}
            <View style={styles.termsRow}>
              <Checkbox
                value={termsAccepted}
                onValueChange={setTermsAccepted}
                color={termsAccepted ? '#f97316' : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.termsText}>
                DersoLab{' '}
                <Text style={styles.termsLink}>Kullanım Şartları</Text> ve{' '}
                <Text style={styles.termsLink}>Gizlilik Politikası</Text>'nı okudum, kabul ediyorum.
              </Text>
            </View>

            {/* Kayıt Butonu */}
            <TouchableOpacity
              style={styles.submitButtonWrapper}
              activeOpacity={0.85}
              onPress={handleRegister}
              disabled={loading}
            >
              <LinearGradient
                colors={['#f97316', '#ea580c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitButton}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Hesabımı Oluştur</Text>
                    <Ionicons name="checkmark-circle-outline" size={20} color="#ffffff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Google ile Kayıt */}
            <TouchableOpacity
              style={styles.googleButton}
              activeOpacity={0.8}
              onPress={handleGoogleRegister}
            >
              <Ionicons name="logo-google" size={18} color="#ffffff" />
              <Text style={styles.googleButtonText}>Google ile Hızlı Kayıt</Text>
            </TouchableOpacity>
          </View>

          {/* Giriş Yap Bağlantısı */}
          <View style={styles.loginRow}>
            <Text style={styles.loginPrompt}>Zaten bir veli hesabınız var mı?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.loginLink}>Giriş Yapın</Text>
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
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
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
    paddingHorizontal: 16,
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
    gap: 14,
    marginBottom: 24,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    borderRadius: 4,
    width: 18,
    height: 18,
  },
  termsText: {
    flex: 1,
    color: '#a1a1aa',
    fontSize: 12,
    lineHeight: 16,
  },
  termsLink: {
    color: '#f97316',
    fontWeight: '600',
  },
  submitButtonWrapper: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
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
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  loginPrompt: {
    color: '#71717a',
    fontSize: 13,
  },
  loginLink: {
    color: '#f97316',
    fontSize: 13,
    fontWeight: '700',
  },
});
