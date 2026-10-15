import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  'LGS Matematik - Üslü Sayılar yeni nesil problem yaz',
  'TYT Fizik - Bağıl Hareket 50 dk ders planı çıkar',
  'Öğrenci geometride göremiyor, nasıl anlatmalıyım?',
  'AYT Biyoloji - Fotosentez için pekiştirme ödevi ver',
];

export default function InstructorAiScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Merhaba Hocam! Ben DersoLab Eğitmen Yapay Zeka Asistanıyım. Ders planları hazırlamanıza, LGS & YKS formatında yeni nesil sorular türetmenize ve öğrencilerinize özel ödev şablonları oluşturmanıza yardımcı olabilirim. Nasıl bir destek istersiniz?',
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      let aiReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('soru') || lower.includes('problem') || lower.includes('yeni nesil')) {
        aiReply = `İşte MEB / ÖSYM tarzı yeni nesil kurgusal soru önerisi:\n\n📌 **Soru:** Bir veri merkezindeki sunucuların harcadığı güç miktarı üslü ifadelerle modellenmiştir. A kabininde 2^7 watt, B kabininde 4^3 watt güç tüketilmektedir. Toplam gücün 2 katına çıkarılması için C kabinine 8^x watt'lık yeni bir güç ünitesi takılacaktır. Buna göre x kaçtır?\n\n💡 **Çözüm Adımı:**\n- A = 2^7 = 128 W\n- B = (2^2)^3 = 2^6 = 64 W\n- Mevcut Toplam = 128 + 64 = 192 W\n- Hedef Toplam = 192 * 2 = 384 W\n- İhtiyaç = 384 - 192 = 192 W (veya 8^x formunda modifiye edilebilir).`;
      } else if (lower.includes('plan') || lower.includes('ders planı')) {
        aiReply = `🎯 **50 Dakikalık Birebir Canlı Ders Akışı:**\n\n1. **İlk 5 Dk:** Isınma, öğrencinin önceki ders ödevindeki 2 takıldığı sorunun çözümü.\n2. **15 Dk (Keşif & Kavram):** Konunun günlük hayattaki karşılığı ve temel teoremin analojisi.\n3. **15 Dk (Yeni Nesil Model Çözümü):** Ekrana paylaşılan 3 kademeli soru (Kolay -> Orta -> Beceri Temelli).\n4. **10 Dk (Öğrenci Uygulaması):** Kalemi öğrenciye vererek 1 soruyu sesli çözdürme.\n5. **Son 5 Dk:** Özetleme, haftalık ödevin belirlenmesi ve motivasyon kapanışı.`;
      } else if (lower.includes('ödev')) {
        aiReply = `📋 **Öğrenci Pekiştirme Ödev Şablonu:**\n\n- **1. Aşama (Kavrama):** Konu bitiminden sonraki ilk 24 saat içinde 20 klasik soru.\n- **2. Aşama (Pekiştirme):** 3. gün 15 yeni nesil grafik/tablo yorumlama sorusu.\n- **3. Aşama (Hata Defteri):** Yapılamayan veya boş bırakılan soruların kesilip veya işaretlenip bir sonraki derste incelenmek üzere ayrılması.`;
      } else {
        aiReply = `Harika bir pedagojik soru Hocam! Bu konuyu işlerken öğrencinin soyut kavramları görselleştirmesini sağlamak adına geogebra veya görsel şemalardan faydalanabilirsiniz. Öğrencinin seviyesine göre akışı basamaklandırıp soru çözümlerini adım adım yönlendirmeniz kavrama hızını %40 artıracaktır.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }, 900);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.aiIconBox}>
            <Ionicons name="sparkles" size={18} color="#ffffff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>DersoLab Eğitmen AI</Text>
            <Text style={styles.headerSubtitle}>Ders planlayıcı & pedagojik asistan</Text>
          </View>
        </View>
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>PRO</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hızlı Sorular */}
          <View style={styles.quickPromptsSection}>
            <Text style={styles.quickPromptsTitle}>Önerilen İstekler:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickPromptsScroll}
            >
              {QUICK_PROMPTS.map((prompt, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.quickPromptChip}
                  onPress={() => handleSend(prompt)}
                >
                  <Text style={styles.quickPromptText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Mesaj Baloncukları */}
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <View
                key={m.id}
                style={[
                  styles.messageRow,
                  isUser ? styles.messageRowUser : styles.messageRowAi,
                ]}
              >
                {!isUser && (
                  <View style={styles.messageAvatarBox}>
                    <Ionicons name="sparkles" size={14} color="#818cf8" />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    isUser ? styles.bubbleUser : styles.bubbleAi,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.messageTextUser : styles.messageTextAi,
                    ]}
                  >
                    {m.text}
                  </Text>
                  <Text
                    style={[
                      styles.timestampText,
                      isUser ? styles.timestampUser : styles.timestampAi,
                    ]}
                  >
                    {m.timestamp}
                  </Text>
                </View>
              </View>
            );
          })}

          {loading && (
            <View style={[styles.messageRow, styles.messageRowAi]}>
              <View style={styles.messageAvatarBox}>
                <Ionicons name="sparkles" size={14} color="#818cf8" />
              </View>
              <View style={[styles.bubble, styles.bubbleAi, styles.typingBubble]}>
                <ActivityIndicator size="small" color="#818cf8" />
                <Text style={styles.typingText}>Plan hazırlanıyor...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Mesaj Giriş Barı */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Bir soru, ders planı veya konu isteyin..."
            placeholderTextColor="#71717a"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => handleSend()}
            returnKeyType="send"
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!input.trim() || loading}
          >
            <LinearGradient
              colors={['#6366f1', '#4f46e5']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.sendButtonInner}
            >
              <Ionicons name="arrow-up" size={20} color="#ffffff" />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  headerSubtitle: {
    color: '#71717a',
    fontSize: 11,
  },
  proBadge: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  proBadgeText: {
    color: '#c084fc',
    fontSize: 11,
    fontWeight: '800',
  },
  keyboardContainer: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  quickPromptsSection: {
    marginBottom: 16,
  },
  quickPromptsTitle: {
    color: '#71717a',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  quickPromptsScroll: {
    gap: 8,
    paddingHorizontal: 4,
  },
  quickPromptChip: {
    backgroundColor: 'rgba(24, 24, 27, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  quickPromptText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 14,
    gap: 8,
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  messageRowAi: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  messageAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: '#6366f1',
    borderBottomRightRadius: 4,
  },
  bubbleAi: {
    backgroundColor: 'rgba(24, 24, 27, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 13,
    lineHeight: 19,
  },
  messageTextUser: {
    color: '#ffffff',
    fontWeight: '500',
  },
  messageTextAi: {
    color: '#e4e4e7',
  },
  timestampText: {
    fontSize: 9,
    marginTop: 4,
  },
  timestampUser: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  timestampAi: {
    color: '#71717a',
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  typingText: {
    color: '#a1a1aa',
    fontSize: 12,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(24, 24, 27, 0.95)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: Platform.OS === 'ios' ? 70 : 64,
    gap: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 13,
  },
  sendButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonInner: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
