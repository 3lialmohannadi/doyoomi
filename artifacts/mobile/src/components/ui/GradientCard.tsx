import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Radius, Shadow } from '../../theme';

interface GradientCardProps {
  colors?: readonly [string, string, ...string[]];
  children: React.ReactNode;
  style?: ViewStyle;
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export function GradientCard({ colors = ['#6C8EF5', '#F0A4C8'], children, style, start = { x: 0, y: 0 }, end = { x: 1, y: 1 } }: GradientCardProps) {
  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={[styles.card, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    ...Shadow.md,
    overflow: 'hidden',
  },
});
