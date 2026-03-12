import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Radius, Shadow } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated = false }: CardProps) {
  const { C } = useAppTheme();
  return (
    <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }, elevated && Shadow.md, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.sm,
  },
});
