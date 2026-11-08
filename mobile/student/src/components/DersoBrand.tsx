import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';

export type BrandRole = 'student' | 'parent' | 'instructor' | 'lab';

export const WEB_THEME = {
  bg: '#0a0a0a',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  inputBg: 'rgba(255, 255, 255, 0.04)',
  inputBorder: 'rgba(255, 255, 255, 0.10)',
  student: {
    primary: '#f97316',
    accent: '#fb923c',
    amber: '#f59e0b',
    activeBg: 'rgba(249, 115, 22, 0.20)',
    activeBorder: 'rgba(249, 115, 22, 0.35)',
    gradient: ['#f97316', '#f59e0b'] as [string, string],
  },
  parent: {
    primary: '#10b981',
    accent: '#34d399',
    teal: '#14b8a6',
    activeBg: 'rgba(16, 185, 129, 0.20)',
    activeBorder: 'rgba(16, 185, 129, 0.35)',
    gradient: ['#10b981', '#14b8a6'] as [string, string],
  },
  instructor: {
    primary: '#3b82f6',
    accent: '#60a5fa',
    cyan: '#06b6d4',
    activeBg: 'rgba(59, 130, 246, 0.20)',
    activeBorder: 'rgba(59, 130, 246, 0.35)',
    gradient: ['#3b82f6', '#06b6d4'] as [string, string],
  },
};

export function getRoleAccentColor(role: BrandRole = 'student'): string {
  if (role === 'parent') return '#34d399';
  if (role === 'instructor') return '#60a5fa';
  if (role === 'lab') return '#22d3ee';
  return '#fb923c';
}

interface FoxMascotProps {
  size?: number;
  variant?: 'head' | 'full';
  role?: BrandRole;
  withBox?: boolean;
  style?: ViewStyle;
}

export function FoxMascot({
  size = 32,
  variant = 'head',
  role = 'student',
  withBox = false,
  style,
}: FoxMascotProps) {
  const source =
    variant === 'full'
      ? require('../../assets/fox-mascot.png')
      : require('../../assets/fox-head.png');

  if (!withBox) {
    return (
      <Image
        source={source}
        style={[{ width: size, height: size }, style as any]}
        contentFit="contain"
        allowDownscaling={false}
        transition={0}
      />
    );
  }

  const boxColor =
    role === 'parent'
      ? 'rgba(16, 185, 129, 0.16)'
      : role === 'instructor'
      ? 'rgba(59, 130, 246, 0.16)'
      : role === 'lab'
      ? 'rgba(6, 182, 212, 0.16)'
      : 'rgba(249, 115, 22, 0.16)';

  const borderColor =
    role === 'parent'
      ? 'rgba(16, 185, 129, 0.35)'
      : role === 'instructor'
      ? 'rgba(59, 130, 246, 0.35)'
      : role === 'lab'
      ? 'rgba(6, 182, 212, 0.35)'
      : 'rgba(249, 115, 22, 0.35)';

  const boxSize = Math.round(size * 1.38);

  return (
    <View
      style={[
        {
          width: boxSize,
          height: boxSize,
          borderRadius: Math.round(boxSize * 0.32),
          backgroundColor: boxColor,
          borderWidth: 1,
          borderColor,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Image
        source={source}
        style={{ width: size, height: size }}
        contentFit="contain"
        allowDownscaling={false}
        transition={0}
      />
    </View>
  );
}

interface DersoBrandLogoProps {
  role?: BrandRole;
  size?: 'sm' | 'md' | 'lg';
  badgeText?: string;
  subtitle?: string;
  centered?: boolean;
}

export function DersoBrandLogo({
  role = 'student',
  size = 'md',
  badgeText,
  subtitle,
  centered = false,
}: DersoBrandLogoProps) {
  const accent = getRoleAccentColor(role);
  const foxSize = size === 'lg' ? 52 : size === 'sm' ? 26 : 34;
  const fontSize = size === 'lg' ? 30 : size === 'sm' ? 17 : 21;

  return (
    <View style={[centered && { alignItems: 'center' }]}>
      <View style={[styles.row, centered && { justifyContent: 'center' }]}>
        <FoxMascot size={foxSize} role={role} withBox={size !== 'lg'} />
        <View style={{ marginLeft: 10 }}>
          <View style={styles.titleRow}>
            <Text style={[styles.brandWhite, { fontSize }]}>
              Derso<Text style={{ color: accent }}>Lab</Text>
            </Text>
            {badgeText ? (
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor:
                      role === 'parent'
                        ? 'rgba(16, 185, 129, 0.18)'
                        : role === 'instructor'
                        ? 'rgba(59, 130, 246, 0.18)'
                        : role === 'lab'
                        ? 'rgba(6, 182, 212, 0.18)'
                        : 'rgba(249, 115, 22, 0.18)',
                    borderColor:
                      role === 'parent'
                        ? 'rgba(16, 185, 129, 0.38)'
                        : role === 'instructor'
                        ? 'rgba(59, 130, 246, 0.38)'
                        : role === 'lab'
                        ? 'rgba(6, 182, 212, 0.38)'
                        : 'rgba(249, 115, 22, 0.38)',
                  },
                ]}
              >
                <Text style={[styles.badgeText, { color: accent }]}>{badgeText}</Text>
              </View>
            ) : null}
          </View>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandWhite: {
    color: '#ffffff',
    fontWeight: '900',
    letterSpacing: -0.6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
});
