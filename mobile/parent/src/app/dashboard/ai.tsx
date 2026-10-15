import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'Sınav kaygısı yaşayan çocuğuma nasıl yaklaşmalıyım?',
  'Netleri düştüğünde onu nasıl motive edebilirim?',
  'Evde verimli bir çalışma ortamı ve disiplin nasıl sağlanır?',
  'Telefon ve ekran süresi sınırını çatışmadan nasıl koyabiliriz?',
];

export default function ParentAIScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Merhaba Sayın Velimiz! Ben DersoLab Veli Rehberlik ve Danışmanlık Asistanıyım. LGS ve YKS hazırlık sürecinde çocuğunuza doğru desteği vermek, motivasyonunu artırmak veya ev içi ders düzenini yönetmekle ilgili sorularınızı bana sorabilirsiniz.',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const getParentAdvisorResponse = (query: string): string => {
    const q = query.toLowerCase();

    if (q.includes('kaygı') || q.includes('stres') || q.includes('korku')) {
      return (
        'Sınav kaygısında en kritik nokta çocuğun hissettiği baskıyı hafifletmektir:\n\n' +
        '1. **"Sen bizim için her şeyden değerlisin" mesajı verin:** Sınav sonucunun onun değerini değil, sadece o günkü bilgi ölçümünü belirlediğini sık sık hissettirin.\n' +
        '2. **Kıyaslamalardan kaçının:** Kuzenler veya arkadaşların netleri ile kıyaslamak kaygıyı tetikler. Sadece kendi dünkü durumu ile bugünkü durumunu karşılaştırın.\n' +
        '3. **Fiziksel rahatlama:** Nefes egzersizleri ve haftada en az 2 gün kısa açık hava yürüyüşleri zihni boşaltmada çok etkilidir.'
      );
    }

    if (q.includes('net') || q.includes('düş') || q.includes('başarısız') || q.includes('motive')) {
      return (
        'Netlerin dalgalanması sınav hazırlığının çok doğal bir parçasıdır:\n\n' +
        '1. **Panik yapmayın:** Her denemenin zorluk seviyesi ve ölçtüğü kazanımlar farklıdır. Bazen denemede yanlış yapmak, eksik konuyu gerçek sınavdan önce görmek için en büyük şanstır.\n' +
        '2. **"Neden yapamadın?" yerine "Birlikte bakalım mı?":** Eğitmeniyle bu denemenin analizini yapmasını teşvik edin (Örn: Süre yetersizliği mi, bilgi eksikliği mi?).\n' +
        '3. **Çabayı övün:** Sonuçtan ziyade masanın başında harcadığı emeği ve istikrarı takdir edin.'
      );
    }

    if (q.includes('telefon') || q.includes('ekran') || q.includes('oyun') || q.includes('sosyal')) {
      return (
        'Ekran bağımlılığı ve çalışma dengesinde kural koyarken ortak karar almak esastır:\n\n' +
        '1. **Telefonu çalışma masasının dışına çıkarın:** Çalışırken bildirimlerin görünmemesi odaklanma süresini iki katına çıkarır.\n' +
        '2. **Pomodoro molalarında ekran yerine göz dinlendirme:** 40 dk ders + 10 dk mola uyguluyorsa, molada telefona bakmak beyni yormaya devam eder.\n' +
        '3. **Yasaklamak yerine ödül/bloklama saati:** Akşam tüm dersler bittikten sonra 45-60 dakikalık serbest zaman tanımak çocuğun gün boyu derse odaklanmasını kolaylaştırır.'
      );
    }

    if (q.includes('ortam') || q.includes('düzen') || q.includes('ev') || q.includes('disiplin')) {
      return (
        'Evde verimli bir sınav ortamı yaratmak için şu adımları öneririm:\n\n' +
        '1. **Sessiz ve aydınlık bir köşe:** Odanın havalandırılması ve masanın sadece ders materyalleriyle düzenli olması dikkat dağınıklığını önler.\n' +
        '2. **Evin genel ritmi:** Çocuk ders çalışırken evde yüksek sesle dizi izlenmesi ya da kalabalık misafir ortamları konsantrasyonu bozar. Mümkünse siz de o saatlerde kitap okuyarak eşlik edebilirsiniz.\n' +
        '3. **Haftalık çalışma planına saygı:** Eğitmeniyle belirlediği ders saatlerinde ev içi ekstra görevler veya ani planlar vermemeye özen gösterin.'
      );
    }

    return (
      'Çocuğunuzun eğitim yolculuğundaki bu hassas süreci düşündüğünüz için tebrik ederim. ' +
      'LGS ve YKS hazırlığında velinin sakin, destekleyici ve yol gösterici rolü başarıyı doğrudan etkiler. ' +
      'DersoLab eğitmenlerimizle düzenli iletişim kurarak çocuğunuzun akademik eksiklerini tam zamanında kapatmasını sağlayabilirsiniz. Başka bir konuda rehberlik ister misiniz?'
    );
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = getParentAdvisorResponse(text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    if (messages.length > 1) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Üst Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.avatarWrap}>
            <Ionicons name="sparkles" size={18} color="#f97316" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Veli Rehberlik Danışmanı</Text>
            <Text style={styles.headerStatus}>DersoLab AI Mentörlük</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardView}
      >
        {/* Mesaj Listesi */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingBubble}>
                <ActivityIndicator size="small" color="#f97316" />
                <Text style={styles.typingText}>Danışman yazıyor...</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isUser = item.sender === 'user';
            return (
              <View style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow]}>
                {!isUser && (
                  <View style={styles.botIcon}>
                    <Ionicons name="sparkles" size={14} color="#f97316" />
                  </View>
                )}
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timestampText, isUser ? styles.userTime : styles.assistantTime]}>
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* Hızlı Soru Önerileri */}
        {messages.length <= 2 && (
          <View style={styles.quickPromptsWrap}>
            <Text style={styles.quickPromptsTitle}>Önerilen Danışmanlık Soruları:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickPromptsRow}>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.promptPill}
                  onPress={() => handleSend(prompt)}
                >
                  <Text style={styles.promptPillText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Giriş Alanı */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Bir konu veya soru danışın..."
            placeholderTextColor="#71717a"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim()}
          >
            <LinearGradient
              colors={inputText.trim() ? ['#f97316', '#ea580c'] : ['#27272a', '#27272a']}
              style={styles.sendBtnInner}
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? '#ffffff' : '#52525b'}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerStatus: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
  },
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 14,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 8,
    maxWidth: '85%',
  },
  userRow: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  assistantRow: {
    alignSelf: 'flex-start',
    justifyContent: 'flex-start',
  },
  botIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userBubble: {
    backgroundColor: '#f97316',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  assistantText: {
    color: '#e4e4e7',
  },
  timestampText: {
    fontSize: 10,
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  assistantTime: {
    color: '#71717a',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignSelf: 'flex-start',
    gap: 8,
    marginTop: 4,
  },
  typingText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  quickPromptsWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  quickPromptsTitle: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
  },
  quickPromptsRow: {
    gap: 8,
  },
  promptPill: {
    backgroundColor: 'rgba(24, 24, 27, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  promptPillText: {
    color: '#d4d4d8',
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#09090b',
    marginBottom: Platform.OS === 'ios' ? 70 : 64,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    color: '#ffffff',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnInner: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
