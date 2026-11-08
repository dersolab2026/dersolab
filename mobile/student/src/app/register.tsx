import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Checkbox from 'expo-checkbox';
import { supabase } from '@/lib/supabase';

type SelectedRole = 'student' | 'parent' | 'instructor';

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12];
const MEZUN_GRADE = 13;

const TRACK_LABELS: Record<string, string> = {
  sayisal: 'Sayısal',
  sozel: 'Sözel',
  ea: 'Eşit Ağırlık',
  dil: 'Dil',
};

const SUBJECT_OPTIONS = [
  'Matematik',
  'Geometri',
  'Fizik',
  'Kimya',
  'Biyoloji',
  'Türkçe & Edebiyat',
  'Tarih',
  'Coğrafya',
  'LGS Genel Mentörlük',
  'YKS Koçluk',
];

export default function UnifiedRegisterScreen() {
  const router = useRouter();

  const [role, setRole] = useState<SelectedRole>('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

  // Öğrenci alanları
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState('');
  const [track, setTrack] = useState('');

  // Eğitmen alanları
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const gradeNumber = grade ? Number(grade) : undefined;
  const isLise = gradeNumber !== undefined && gradeNumber >= 9;

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleRegister = async () => {
    setErrorMsg('');

    if (!termsAccepted) {
      setErrorMsg('Devam etmek için Kullanım Şartları ve Gizlilik Politikasını onaylamalısınız.');
      return;
    }
    if (!name.trim() || !email.trim() || !password || !passwordConfirm) {
      setErrorMsg('Lütfen ad soyad, e-posta ve şifre alanlarını doldurunuz.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('Şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (role === 'student') {
      if (!schoolName.trim() || !grade) {
        setErrorMsg('Lütfen okul adı ve sınıfınızı seçiniz.');
        return;
      }
      if (isLise && !track) {
        setErrorMsg('Lütfen alanınızı seçiniz.');
        return;
      }
    } else if (role === 'instructor' && selectedSubjects.length === 0) {
      setErrorMsg('Lütfen en az bir uzmanlık branşı seçiniz.');
      return;
    }

    setLoading(true);

    try {
      const metadata: Record<string, any> = {
        name: name.trim(),
        full_name: name.trim(),
        role,
        phone: phone.trim() || null,
        terms_version: '2026-08-07',
      };

      if (role === 'student') {
        metadata.school_name = schoolName.trim();
        metadata.grade = grade;
        metadata.track = track || null;
      } else if (role === 'instructor') {
        metadata.subjects = selectedSubjects;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: metadata },
      });

      setLoading(false);

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      const targetRoute = role === 'parent' ? '/parent' : role === 'instructor' ? '/instructor' : '/dashboard';

      if (data.session) {
        router.replace(targetRoute as any);
      } else {
        Alert.alert(
          'Kayıt Başarılı!',
          'Hesabınız oluşturuldu. E-posta adresinizi doğruladıktan sonra giriş yapabilirsiniz.',
          [{ text: 'Giriş Yap', onPress: () => router.replace('/login') }]
        );
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMsg(err?.message || 'Kayıt sırasında bir hata oluştu.');
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
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Image
              source={require('../../assets/fox-mascot.png')}
              style={{ width: 42, height: 42, marginRight: 10 }}
              resizeMode="contain"
            />
            <Text style={{ fontSize: 26, fontWeight: '900', color: '#ffffff', letterSpacing: -0.8 }}>
              Derso
              <Text
                style={{
                  color:
                    role === 'parent'
                      ? '#34d399'
                      : role === 'instructor'
                      ? '#60a5fa'
                      : '#fb923c',
                }}
              >
                Lab
              </Text>
            </Text>
          </View>
          <Text style={styles.title}>Hesap Oluştur</Text>
          <Text style={styles.subtitle}>Rolünü seç ve DersoLab dünyasına katıl.</Text>

          {/* 3'lü Rol Seçici */}
          <View style={styles.roleSelectorRow}>
            <TouchableOpacity
              style={[styles.roleTab, role === 'student' && styles.roleTabStudentActive]}
              onPress={() => setRole('student')}
            >
              <Ionicons name="school" size={16} color={role === 'student' ? '#030712' : '#94a3b8'} />
              <Text style={[styles.roleTabText, role === 'student' && styles.roleTabTextActiveDark]}>Öğrenci</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'parent' && styles.roleTabParentActive]}
              onPress={() => setRole('parent')}
            >
              <Ionicons name="shield-checkmark" size={16} color={role === 'parent' ? '#030712' : '#94a3b8'} />
              <Text style={[styles.roleTabText, role === 'parent' && styles.roleTabTextActiveDark]}>Veli</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleTab, role === 'instructor' && styles.roleTabInstructorActive]}
              onPress={() => setRole('instructor')}
            >
              <Ionicons name="easel" size={16} color={role === 'instructor' ? '#ffffff' : '#94a3b8'} />
              <Text style={[styles.roleTabText, role === 'instructor' && { color: '#ffffff', fontWeight: '800' }]}>Eğitmen</Text>
            </TouchableOpacity>
          </View>

          {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

          {/* Ad Soyad */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Ad Soyad</Text>
            <TextInput
              style={styles.input}
              placeholder="Adınız Soyadınız"
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
              placeholder="ornek@dersolab.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Telefon (Veli ve Eğitmen için) */}
          {(role === 'parent' || role === 'instructor') && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefon Numarası</Text>
              <TextInput
                style={styles.input}
                placeholder="05XX XXX XX XX"
                placeholderTextColor="#475569"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
          )}

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

          {/* Şifre Tekrar */}
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

          {/* ÖĞRENCİ ALANLARI */}
          {role === 'student' && (
            <>
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sınıf</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={grade}
                    onValueChange={(itemValue) => {
                      setGrade(itemValue);
                      setTrack('');
                    }}
                    style={styles.picker}
                    dropdownIconColor="#fff"
                  >
                    <Picker.Item label="Seçiniz..." value="" color="#000" />
                    {GRADES.map((g) => (
                      <Picker.Item key={g} label={`${g}. Sınıf`} value={g.toString()} color="#000" />
                    ))}
                    <Picker.Item label="Mezun" value={MEZUN_GRADE.toString()} color="#000" />
                  </Picker>
                </View>
              </View>

              {isLise && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Alan</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={track}
                      onValueChange={(itemValue) => setTrack(itemValue)}
                      style={styles.picker}
                      dropdownIconColor="#fff"
                    >
                      <Picker.Item label="Seçiniz..." value="" color="#000" />
                      {Object.keys(TRACK_LABELS).map((t) => (
                        <Picker.Item key={t} label={TRACK_LABELS[t]} value={t} color="#000" />
                      ))}
                    </Picker>
                  </View>
                </View>
              )}
            </>
          )}

          {/* EĞİTMEN ALANLARI */}
          {role === 'instructor' && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Uzmanlık Branşlarınız</Text>
              <View style={styles.subjectChipsWrap}>
                {SUBJECT_OPTIONS.map((subj) => {
                  const active = selectedSubjects.includes(subj);
                  return (
                    <TouchableOpacity
                      key={subj}
                      style={[styles.subjectChip, active && styles.subjectChipActive]}
                      onPress={() => toggleSubject(subj)}
                    >
                      <Text style={[styles.subjectChipText, active && styles.subjectChipTextActive]}>
                        {subj}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Sözleşme */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            activeOpacity={0.8}
            onPress={() => setTermsAccepted(!termsAccepted)}
          >
            <Checkbox
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              color={termsAccepted ? '#f59e0b' : undefined}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>
              Kullanım Şartları ve Gizlilik Politikasını okudum, kabul ediyorum.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
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
                <Text style={styles.primaryButtonText}>Hesap Oluştur</Text>
              )}
            </LinearGradient>
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
  container: { flex: 1, backgroundColor: '#030712' },
  content: { flex: 1 },
  header: { marginTop: 10, marginBottom: 10, paddingHorizontal: 24 },
  backButton: { padding: 8, alignSelf: 'flex-start' },
  backButtonText: { color: '#94a3b8', fontSize: 16, fontWeight: '600' },
  scrollContainer: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: '900', color: '#ffffff', marginBottom: 6, letterSpacing: -1 },
  subtitle: { fontSize: 15, color: '#94a3b8', marginBottom: 20 },
  roleSelectorRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 5,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  roleTabStudentActive: { backgroundColor: '#f59e0b' },
  roleTabParentActive: { backgroundColor: '#10b981' },
  roleTabInstructorActive: { backgroundColor: '#4f46e5' },
  roleTabText: { color: '#94a3b8', fontSize: 13, fontWeight: '700' },
  roleTabTextActiveDark: { color: '#030712', fontWeight: '800' },
  errorText: { color: '#ef4444', marginBottom: 16, fontSize: 14, fontWeight: '500' },
  inputGroup: { marginBottom: 18 },
  label: { color: '#cbd5e1', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 15,
    color: '#ffffff',
    fontSize: 15,
  },
  pickerContainer: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  picker: { color: '#ffffff', height: 55 },
  subjectChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  subjectChipActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.25)',
    borderColor: '#818cf8',
  },
  subjectChipText: { color: '#94a3b8', fontSize: 13, fontWeight: '600' },
  subjectChipTextActive: { color: '#ffffff', fontWeight: '800' },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  checkbox: { marginRight: 12, borderColor: '#475569' },
  checkboxLabel: { color: '#94a3b8', fontSize: 13, flex: 1, lineHeight: 19 },
  primaryButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
  },
  primaryButtonGradient: { paddingVertical: 18, alignItems: 'center', justifyContent: 'center' },
  primaryButtonText: { color: '#ffffff', fontSize: 17, fontWeight: '800' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
    paddingTop: 10,
    backgroundColor: '#030712',
  },
  footerText: { color: '#94a3b8', fontSize: 15 },
  footerLink: { color: '#f59e0b', fontSize: 15, fontWeight: '700' },
});
