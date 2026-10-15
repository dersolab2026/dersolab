import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Linking from 'expo-linking';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { supabase } from '@/lib/supabase';

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];
const MEZUN_GRADE = 13;

const TRACK_LABELS: Record<string, string> = {
  sayisal: 'Sayısal',
  sozel: 'Sözel',
  ea: 'Eşit Ağırlık',
  dil: 'Dil',
};

export default function RegisterScreen() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [track, setTrack] = useState('');
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const gradeNumber = grade ? Number(grade) : undefined;
  const isLise = gradeNumber !== undefined && gradeNumber >= 9;

  const handleRegister = async () => {
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Devam etmek için Kullanım Şartları’nı kabul etmelisin.');
      return;
    }
    if (!name || !email || !password || !passwordConfirm || !schoolName || !grade) {
      setErrorMsg('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }
    if (isLise && !track) {
      setErrorMsg('Lütfen alanınızı seçiniz.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('Şifreler eşleşmiyor.');
      return;
    }
    
    setLoading(true);
    
    // Auth kayıt
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          school_name: schoolName,
          grade: grade,
          track: track || null,
          role: 'student'
        }
      }
    });
    
    setLoading(false);
    
    if (error) {
      setErrorMsg(error.message);
    } else {
      alert('Kayıt başarılı! Lütfen e-postanızı onaylayın veya giriş yapın.');
      router.replace('/login');
    }
  };

  const handleGoogleRegister = async () => {
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

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Geleceğin eğitim platformuna ilk adımı at.</Text>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Ad Soyad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              placeholder="Adın Soyadın"
              placeholderTextColor="#475569"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* E-Posta */}
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

          {/* Şifre */}
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

          {/* Şifre (Tekrar) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Şifre (Tekrar)</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              secureTextEntry
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
            />
          </View>

          {/* Okul Adı */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Okul Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="Okulunun Adı"
              placeholderTextColor="#475569"
              value={schoolName}
              onChangeText={setSchoolName}
            />
          </View>

          {/* Sınıf Seçimi */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sınıf</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={grade}
                onValueChange={(itemValue) => {
                  setGrade(itemValue);
                  setTrack(''); // Sınıf değiştiğinde alanı sıfırla
                }}
                style={[styles.picker, Platform.OS === 'web' && { backgroundColor: 'transparent', outline: 'none' } as any]}
                dropdownIconColor="#fff"
              >
                <Picker.Item label="Seçiniz..." value="" color={Platform.OS === 'ios' ? '#fff' : '#000'} />
                {GRADES.map((g) => (
                  <Picker.Item key={g} label={`${g}. Sınıf`} value={g.toString()} color={Platform.OS === 'ios' ? '#fff' : '#000'} />
                ))}
                <Picker.Item label="Mezun" value={MEZUN_GRADE.toString()} color={Platform.OS === 'ios' ? '#fff' : '#000'} />
              </Picker>
            </View>
          </View>

          {/* Alan Seçimi (Sadece 9. Sınıf ve Üzeri) */}
          {isLise && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alan</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={track}
                  onValueChange={(itemValue) => setTrack(itemValue)}
                  style={[styles.picker, Platform.OS === 'web' && { backgroundColor: 'transparent', outline: 'none' } as any]}
                  dropdownIconColor="#fff"
                >
                  <Picker.Item label="Seçiniz..." value="" color={Platform.OS === 'ios' ? '#fff' : '#000'} />
                  {Object.keys(TRACK_LABELS).map((t) => (
                    <Picker.Item key={t} label={TRACK_LABELS[t]} value={t} color={Platform.OS === 'ios' ? '#fff' : '#000'} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {/* Sözleşme Checkbox */}
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            activeOpacity={0.8}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <Checkbox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              color={termsAccepted ? '#4f46e5' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>
              Kullanım Şartları'nı okudum ve kabul ediyorum. Gizlilik Politikası'nı gördüm.
            </Text>
          </TouchableOpacity>

          {/* Kayıt Butonu */}
          <TouchableOpacity 
            style={styles.primaryButton} 
            activeOpacity={0.8}
            onPress={handleRegister}
            disabled={loading}
          >
            <LinearGradient
              colors={['#e11d48', '#f59e0b']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButtonGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.primaryButtonText}>Ücretsiz Kayıt Ol</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.divider} />
          </View>

          {/* Google Butonu */}
          <TouchableOpacity 
            style={styles.googleButton} 
            activeOpacity={0.8}
            onPress={handleGoogleRegister}
          >
            <Text style={styles.googleButtonText}>Google ile Kayıt Ol</Text>
          </TouchableOpacity>

        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Zaten hesabın var mı? </Text>
          <Link href="/login" asChild>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Giriş Yap</Text>
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
  },
  header: {
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 24,
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
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
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
  pickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: {
    color: '#ffffff',
    height: 55,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  checkbox: {
    marginRight: 12,
    borderColor: '#475569',
  },
  checkboxLabel: {
    color: '#94a3b8',
    fontSize: 13,
    flex: 1,
    lineHeight: 20,
  },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#e11d48',
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
    marginBottom: 10,
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
    paddingTop: 10,
    backgroundColor: '#030712',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 15,
  },
  footerLink: {
    color: '#f59e0b',
    fontSize: 15,
    fontWeight: '700',
  },
});
