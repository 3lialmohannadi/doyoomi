import React, { useEffect } from 'react';
import { View, Text, StyleSheet, useColorScheme as useSysCS } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { F, GRADIENT_D } from './theme';

interface Props {
  onFinish?: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  useEffect(() => {
    const t = setTimeout(() => onFinish?.(), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <LinearGradient colors={GRADIENT_D} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.container}>
      {/* Logo bubble */}
      <View style={s.logoBubble}>
        <Text style={s.logoText}>Do</Text>
      </View>

      {/* Brand name */}
      <Text style={s.brand}>Do.Yoomi</Text>
      <Text style={s.brandAr}>يومي</Text>

      {/* Tagline */}
      <Text style={s.tagline}>أنجز • كوّن عادات • حقق أهدافك</Text>

      {/* Dots loader */}
      <View style={s.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[s.dot, { opacity: 0.4 + i * 0.3 }]} />
        ))}
      </View>
    </LinearGradient>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  logoBubble: {
    width: 96, height: 96, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: { color: '#fff', fontSize: 36, fontFamily: F.brand },
  brand:    { color: '#fff', fontSize: 32, fontFamily: F.brand },
  brandAr:  { color: 'rgba(255,255,255,0.85)', fontSize: 22, fontFamily: F.black, marginTop: -6 },
  tagline:  { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontFamily: F.reg, marginTop: 8 },
  dots: {
    flexDirection: 'row', gap: 8, marginTop: 48,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff',
  },
});
