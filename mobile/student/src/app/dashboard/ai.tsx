import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Image, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';

const SUBJECTS = [
  'TYT Matematik',
  'TYT Türkçe',
  'TYT Fen Bilimleri',
  'TYT Sosyal Bilimler',
  'AYT Matematik',
  'AYT Fizik',
  'AYT Kimya',
  'AYT Biyoloji',
  'AYT Türk Dili ve Edebiyatı',
  'AYT Tarih',
  'AYT Coğrafya',
  'LGS Matematik',
  'LGS Türkçe',
  'LGS Fen Bilimleri',
  'LGS T.C. İnkılap Tarihi',
  'İngilizce',
];

const EXAMPLE_QUESTIONS: Record<string, string> = {
  'LGS Matematik': "İki basamaklı bir sayının rakamları toplamı 11 ve basamaklar farkı 3'tür. Bu sayıların çarpımı kaçtır?",
  'TYT Matematik': 'log₂(x+3) + log₂(x-1) = 3 denklemini sağlayan x değeri kaçtır?',
  'AYT Fizik': "2 kg kütleli bir cisim 5 m/s² ivmeyle düzgün ivmeli hareket yapıyor. Cisme etki eden net kuvvet kaç Newton'dur?",
  'AYT Kimya': "Saf suyun kaynama noktası neden 100°C'dir? Bunu buhar basıncı kavramıyla açıklayın.",
  'TYT Türkçe': '"Gözlemlediği şeyleri hafızasında saklayıp uygun zamanda kullanan kişi" ifadesini tek bir kelimeyle ifade ediniz.',
};

export default function AiScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState('TYT Matematik');
  const [question, setQuestion] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: true, // We need base64 for the API
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Prepare base64 image data URI
        const asset = result.assets[0];
        if (asset.base64) {
          const mimeType = asset.mimeType || 'image/jpeg';
          const b64Str = `data:${mimeType};base64,${asset.base64}`;
          setImageUri(b64Str);
        } else {
          setImageUri(asset.uri); // Fallback for display if base64 fails
        }
        setErrorMsg('');
      }
    } catch (e) {
      setErrorMsg('Fotoğraf seçilirken bir hata oluştu.');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Kamera ile soru çekmek için kamera erişimine izin vermelisiniz.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          const mimeType = asset.mimeType || 'image/jpeg';
          const b64Str = `data:${mimeType};base64,${asset.base64}`;
          setImageUri(b64Str);
        } else {
          setImageUri(asset.uri);
        }
        setErrorMsg('');
      }
    } catch (e) {
      setErrorMsg('Kamera ile fotoğraf çekilirken bir hata oluştu.');
    }
  };

  const handleGenerateSimilar = async () => {
    if (!solution && !question) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const prompt = `Lütfen şu sorunun temel mantığını, kavramlarını ve çözüm yöntemini kullanarak yeni, orijinal ve benzer bir soru üret ve adım adım ayrıntılı çözümünü ver:\n\nOrijinal Soru: ${question}\n\nKonu: ${subject}`;
      const res = await fetch('https://dersolab.com/api/ai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          question: prompt,
          subject: subject,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Benzer soru üretilemedi.');
      setSolution(data.solution);
      setQuestion(`[Yeni Nesil Benzer Soru - ${subject}]`);
      setImageUri(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Benzer soru üretilirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      const savedRaw = await AsyncStorage.getItem('dersolab_saved_questions');
      const list = savedRaw ? JSON.parse(savedRaw) : [];
      const newItem = {
        id: Date.now().toString(),
        subject,
        question: question || 'Görsel Soru',
        solution,
        date: new Date().toLocaleDateString('tr-TR'),
      };
      list.unshift(newItem);
      await AsyncStorage.setItem('dersolab_saved_questions', JSON.stringify(list));
      Alert.alert('Harika!', 'Soru ve detaylı çözümü arşivinize kaydedildi.');
    } catch (e) {
      Alert.alert('Hata', 'Soru kaydedilirken bir hata oluştu.');
    }
  };

  const loadExample = () => {
    const ex = EXAMPLE_QUESTIONS[subject] ?? Object.values(EXAMPLE_QUESTIONS)[0];
    setQuestion(ex);
  };

  const handleSolve = async () => {
    const trimmed = question.trim();
    if (!trimmed && !imageUri) {
      setErrorMsg('Lütfen bir soru yazın veya soru fotoğrafı yükleyin.');
      return;
    }
    
    setErrorMsg('');
    setSolution('');
    setLoading(true);

    try {
      // Get current auth session to send the token
      const { data: { session } } = await supabase.auth.getSession();
      
      const res = await fetch('https://dersolab.com/api/ai/solve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(session?.access_token ? { 'Authorization': `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          question: trimmed,
          subject: subject,
          imageBase64: imageUri?.startsWith('data:image') ? imageUri : undefined,
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Çözüm oluşturulurken bir hata oluştu.');
      }

      setSolution(data.solution);
    } catch (err: any) {
      setErrorMsg(err.message || 'Bağlantı hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Ionicons name="hardware-chip-outline" size={28} color="#00e5ff" />
            <Text style={styles.title}>AI Soru Asistanı</Text>
          </View>
          <Text style={styles.subtitle}>Gemini ile güçlendirilmiş adım adım çözüm asistanı</Text>
        </View>

        <View style={styles.badgesContainer}>
          <View style={styles.badge}>
            <Ionicons name="logo-google" size={12} color="#4285F4" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Google Gemini AI</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="infinite" size={14} color="#f59e0b" style={styles.badgeIcon} />
            <Text style={styles.badgeText}>Sınırsız Çözüm Aktif</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Branş Seç</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={subject}
                onValueChange={(itemValue) => setSubject(itemValue)}
                style={styles.picker}
                dropdownIconColor="#fff"
              >
                {SUBJECTS.map((s) => (
                  <Picker.Item key={s} label={s} value={s} color={Platform.OS === 'ios' ? '#fff' : '#000'} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Sorun</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={takePhoto} style={styles.actionBtn}>
                  <Ionicons name="camera" size={16} color="#38bdf8" />
                  <Text style={[styles.actionText, { color: '#38bdf8' }]}>Kamera</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
                  <Ionicons name="image-outline" size={16} color="#cbd5e1" />
                  <Text style={styles.actionText}>Galeri</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={loadExample} style={styles.actionBtn}>
                  <Text style={[styles.actionText, { color: '#f59e0b', textDecorationLine: 'underline' }]}>Örnek</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TextInput
              style={styles.textArea}
              placeholder="Sorunuzu buraya yazın..."
              placeholderTextColor="#475569"
              multiline
              textAlignVertical="top"
              value={question}
              onChangeText={setQuestion}
              maxLength={2000}
            />
            <Text style={styles.charCount}>{question.length}/2000</Text>

            {imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <View style={styles.imageInfo}>
                  <Text style={styles.imageName} numberOfLines={1}>Soru Fotoğrafı eklendi</Text>
                  <Text style={styles.imageSub}>Gemini analiz edecek</Text>
                </View>
                <TouchableOpacity onPress={() => setImageUri(null)} style={styles.removeImageBtn}>
                  <Ionicons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {errorMsg ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          <TouchableOpacity 
            style={[styles.solveBtn, (loading || (!question.trim() && !imageUri)) && styles.solveBtnDisabled]} 
            onPress={handleSolve}
            disabled={loading || (!question.trim() && !imageUri)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={loading || (!question.trim() && !imageUri) ? ['#334155', '#475569'] : ['#3b82f6', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.solveBtnGradient}
            >
              {loading ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text style={styles.solveBtnText}>Gemini düşünüyor...</Text>
                </View>
              ) : (
                <Text style={styles.solveBtnText}>Gemini ile Çöz</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {solution ? (
          <View style={styles.solutionCard}>
            <View style={styles.solutionHeader}>
              <Ionicons name="bulb-outline" size={20} color="#f59e0b" />
              <Text style={styles.solutionTitle}>Çözüm</Text>
            </View>
            <Text style={styles.solutionText}>{solution}</Text>
            
            <View style={styles.solutionActions}>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: 'rgba(56, 189, 248, 0.15)', borderColor: 'rgba(56, 189, 248, 0.4)' }]} onPress={handleGenerateSimilar}>
                <Ionicons name="sparkles" size={14} color="#38bdf8" style={{ marginRight: 4 }} />
                <Text style={[styles.secondaryBtnText, { color: '#38bdf8' }]}>Benzer Soru Üret</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.4)' }]} onPress={handleSaveQuestion}>
                <Ionicons name="star" size={14} color="#f59e0b" style={{ marginRight: 4 }} />
                <Text style={[styles.secondaryBtnText, { color: '#f59e0b' }]}>Deftere Kaydet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => {setSolution(''); setQuestion(''); setImageUri(null);}}>
                <Text style={styles.secondaryBtnText}>Yeni Soru</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            💡 <Text style={{fontWeight: 'bold'}}>DersoLab Branş Kapsamı:</Text> AI Soru Asistanı LGS ve YKS soruları için özel eğitilmiştir. Sınırsız soru sorabilirsiniz.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#030712',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    marginLeft: 10,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#94a3b8',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeIcon: {
    marginRight: 6,
  },
  badgeText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  pickerContainer: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#ffffff',
    height: Platform.OS === 'ios' ? 150 : 55,
  },
  textArea: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 15,
    minHeight: 120,
  },
  charCount: {
    textAlign: 'right',
    color: '#64748b',
    fontSize: 11,
    marginTop: 4,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 10,
    marginTop: 12,
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  imageInfo: {
    flex: 1,
    marginLeft: 12,
  },
  imageName: {
    color: '#e2e8f0',
    fontWeight: 'bold',
    fontSize: 13,
  },
  imageSub: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  removeImageBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#f87171',
    fontSize: 13,
    fontWeight: 'bold',
  },
  solveBtn: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  solveBtnDisabled: {
    opacity: 0.7,
  },
  solveBtnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  solveBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  solutionCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  solutionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
    marginBottom: 16,
  },
  solutionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  solutionText: {
    color: '#e2e8f0',
    fontSize: 15,
    lineHeight: 24,
  },
  solutionActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  secondaryBtn: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  secondaryBtnText: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18,
  }
});
