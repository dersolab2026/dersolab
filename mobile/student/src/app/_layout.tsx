import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

async function resolveTargetRouteForSession(userId: string, metaRole?: string): Promise<'/dashboard' | '/parent' | '/instructor'> {
  try {
    const { data: userRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .maybeSingle();

    const role = userRow?.role || metaRole || 'student';
    if (role === 'parent') return '/parent';
    if (role === 'instructor') return '/instructor';
    return '/dashboard';
  } catch {
    if (metaRole === 'parent') return '/parent';
    if (metaRole === 'instructor') return '/instructor';
    return '/dashboard';
  }
}

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

    const firstSegment = segments[0] as string | undefined;
    const inRoleArea =
      firstSegment === 'dashboard' ||
      firstSegment === 'parent' ||
      firstSegment === 'instructor';

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session && !inRoleArea) {
        const target = await resolveTargetRouteForSession(
          session.user.id,
          session.user.user_metadata?.role
        );
        router.replace(target as any);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session && !inRoleArea) {
        const target = await resolveTargetRouteForSession(
          session.user.id,
          session.user.user_metadata?.role
        );
        router.replace(target as any);
      } else if (event === 'SIGNED_OUT' && inRoleArea) {
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
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'DersoLab' }} />
      </Stack>
    </>
  );
}
