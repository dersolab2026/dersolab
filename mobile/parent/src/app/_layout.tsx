import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const inAuthGroup = segments[0] === 'dashboard';
      if (session && !inAuthGroup) {
        router.replace('/dashboard');
      } else if (!session && inAuthGroup) {
        router.replace('/');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const inAuthGroup = segments[0] === 'dashboard';
      if (event === 'SIGNED_IN' && session && !inAuthGroup) {
        router.replace('/dashboard');
      } else if (event === 'SIGNED_OUT' && inAuthGroup) {
        router.replace('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isReady, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#09090b' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'DersoLab Veli' }} />
        <Stack.Screen name="login" options={{ title: 'Giriş Yap' }} />
        <Stack.Screen name="register" options={{ title: 'Kayıt Ol' }} />
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
