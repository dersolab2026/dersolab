import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '@/lib/supabase';
import { askParentAdvisor } from '@/lib/gemini';

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
  const [studentContext, setStudentContext] = useState<string>('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;
        const { data: links } = await supabase
          .from('guardian_links')
          .select('student_id')
          .eq('guardian_id', session.user.id);
        if (links && links.length > 0) {
          const ids = links.map((l) => l.student_id);
          const { data: uData } = await supabase.from('users').select('name').in('id', ids);
          if (uData && uData.length > 0) {
            setStudentContext(`Bağlı öğrenciler: ${uData.map((u) => u.name).join(', ')}`);
          }
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const responseText = await askParentAdvisor({
        question: text,
        studentName: studentContext || undefined,
      });
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Şu anda bağlantı kurulamadı, lütfen tekrar deneyin.',
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (messages.length > 1) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="light" />

      {/* Üst Bar */}
      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../../assets/fox-head.png')}
              style={{ width: 24, height: 24 }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>Veli Rehberlik Danışmanı</Text>
            <Text style={styles.headerStatus}>DersoLab Tilki AI Mentörlük</Text>
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
                    <Image
                      source={require('../../../assets/fox-head.png')}
                      style={{ width: 18, height: 18 }}
                      resizeMode="contain"
                    />
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
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
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
    marginBottom: 0,
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
