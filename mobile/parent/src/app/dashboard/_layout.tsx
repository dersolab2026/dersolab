import React from 'react';
import { Tabs } from 'expo-router';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ParentDashboardLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : 'rgba(9, 9, 11, 0.95)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.08)',
          elevation: 0,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
        },
        tabBarBackground: () =>
          Platform.OS === 'ios' ? (
            <BlurView tint="dark" intensity={85} style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarActiveTintColor: '#f97316',
        tabBarInactiveTintColor: '#71717a',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Özetim',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="lessons"
        options={{
          title: 'Dersler',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Gelişim',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trending-up-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'Veli AI',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="sparkles-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Hide outdated tabs from router */}
      <Tabs.Screen
        name="diary"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
