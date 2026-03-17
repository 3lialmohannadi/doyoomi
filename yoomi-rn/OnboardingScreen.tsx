import React, { useState, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, Dimensions, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { F, S, R, GRADIENT_D, GRADIENT_H, PRIMARY, theme, ColorScheme, primaryShadow } from './theme';

const { width: W } = Dimensions.get('window');

interface Props {
  colorScheme?: ColorScheme;
  onDone?:      () => void;
}

const SLIDES = [
  {
    key:     '1',
    emoji:   '✅',
    title:   'أنجز مهامك بسهولة',
    sub:     'نظّم مهامك اليومية وتتبع تقدمك بطريقة ذكية وبسيطة',
    color:   '#6C47FF',
  },
  {
    key:     '2',
    emoji:   '🔥',
    title:   'كوّن عادات إيجابية',
    sub:     'ابنِ عادات صحية يوماً بعد يوم وتابع تسلسلك المتواصل',
    color:   '#FF6B8A',
  },
  {
    key:     '3',
    emoji:   '🎯',
    title:   'حقق أهدافك الكبيرة',
    sub:     'قسّم أهدافك الكبيرة إلى خطوات صغيرة وقابلة للتنفيذ',
    color:   '#4ADE80',
  },
  {
    key:     '4',
    emoji:   '📖',
    title:   'سجّل لحظاتك',
    sub:     'دوّن أفكارك ومشاعرك في مذكرة يومية خاصة بك',
    color:   '#60A5FA',
  },
];

export function OnboardingScreen({ colorScheme: cs, onDone }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';
  const [idx, setIdx] = useState(0);
  const ref = useRef<FlatList>(null);

  const goNext = () => {
    if (idx < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: idx + 1 });
      setIdx(idx + 1);
    } else {
      onDone?.();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Skip */}
      <View style={{ alignItems: 'flex-start', paddingHorizontal: S.xl, paddingTop: S.lg }}>
        {idx < SLIDES.length - 1 && (
          <TouchableOpacity onPress={onDone}>
            <Text style={{ color: T.muted, fontSize: 14, fontFamily: F.med }}>تخطي</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={ref}
        data={SLIDES}
        keyExtractor={(s) => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setIdx(Math.round(e.nativeEvent.contentOffset.x / W));
        }}
        renderItem={({ item }) => (
          <View style={{ width: W, alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.xl, gap: 24 }}>
            <View style={[s.emojiCircle, { backgroundColor: `${item.color}22` }]}>
              <Text style={{ fontSize: 56 }}>{item.emoji}</Text>
            </View>
            <Text style={{ color: T.text, fontSize: 26, fontFamily: F.black, textAlign: 'center' }}>
              {item.title}
            </Text>
            <Text style={{ color: T.muted, fontSize: 15, fontFamily: F.reg, textAlign: 'center', lineHeight: 24 }}>
              {item.sub}
            </Text>
          </View>
        )}
      />

      {/* Dots + Button */}
      <View style={{ paddingHorizontal: S.xl, paddingBottom: 40, gap: 24 }}>
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[
              s.dot,
              i === idx
                ? { width: 24, backgroundColor: PRIMARY }
                : { width: 8, backgroundColor: dk ? 'rgba(255,255,255,0.25)' : '#D0C9FF' },
            ]} />
          ))}
        </View>

        <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
          <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={[s.btn, primaryShadow]}>
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: F.black }}>
              {idx < SLIDES.length - 1 ? 'التالي' : 'ابدأ الآن'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  emojiCircle: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
  },
  dot: { height: 8, borderRadius: 4 },
  btn: {
    paddingVertical: 16, borderRadius: R.full,
    alignItems: 'center',
  },
});
