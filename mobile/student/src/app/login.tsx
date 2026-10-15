import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { supabase } from '@/lib/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMsg('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    setLoading(false);
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      router.replace('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    const redirectUrl = Linking.createURL('/');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });
    
    if (error) {
      setErrorMsg(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        
        {/* Üst Kısım: Geri Butonu ve Başlık */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace('/');
              }
            }} 
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>← Geri</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Hoş Geldin!</Text>
          <Text style={styles.subtitle}>Derslerine kaldığın yerden devam et.</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>E-Posta Adresi</Text>
            <TextInput
              style={styles.input}
              placeholder="ornek@ogrenci.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4f46e5', '#e11d48']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Giriş Yap</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity 
            style={styles.googleButton} 
            activeOpacity={0.8}
            onPress={handleGoogleLogin}
          >
            <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hesabın yok mu? </Text>
          <Link href="/register" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Hemen Oluştur</Text>
            </TouchableOpacity>
          </Link>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  header: {
    marginTop: 10,
    marginBottom: 40,
  },
  backButton: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8',
    marginBottom: 32,
    fontWeight: '300',
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  forgotPasswordText: {
    color: '#a5b4fc',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4f46e5',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
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
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    color: '#64748b',
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  googleButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  footerLink: {
    color: '#00e5ff',
    fontSize: 15,
    fontWeight: '700',
  },
});
