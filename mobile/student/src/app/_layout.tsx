import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // A small delay to let the layout mount fully before triggering redirects
    // which avoids 'Attempted to navigate before mounting' in Expo Router
    const timeout = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Check active session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      const inAuthGroup = segments[0] === 'dashboard';
      if (session && !inAuthGroup) {
        router.replace('/dashboard');
      } else if (!session && inAuthGroup) {
        router.replace('/');
      }
    });

    // Listen for auth events (like completing OAuth)
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
      <Stack screenOptions={{ 
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0a0a' }
      }}>
        <Stack.Screen name="index" options={{ title: 'Ana Sayfa' }} />
      </Stack>
    </>
  );
}
