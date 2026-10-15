import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(3, 7, 18, 0.95)',
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={80} style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarActiveTintColor: '#00e5ff', // Neon Mavi
        tabBarInactiveTintColor: '#64748b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Derslerim',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Günlük',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI Asistan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hardware-chip" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
      {/* İleride eklemek isteyebileceğimiz, alt barda görünmeyecek ama Dashboard içinde olacak ekranlar için `href: null` kullanabiliriz */}
      <Tabs.Screen
        name="lessons"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
