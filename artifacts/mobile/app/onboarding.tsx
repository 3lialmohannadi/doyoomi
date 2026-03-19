import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, TextInput, Platform,
  ScrollView, Dimensions, Image, KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, interpolate, Extrapolation,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '../src/store/settingsStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { F, PRIMARY, SECONDARY } from '../src/theme';
import { t } from '../src/utils/i18n';
import type { Language } from '../src/types';

const { width: W } = Dimensions.get('window');
const TOTAL_STEPS = 5;

const FEATURES = [
  { icon: 'checkmark-circle', color: '#6366F1', key: 'Task' },
  { icon: 'leaf',             color: '#F97316', key: 'Habit' },
  { icon: 'trophy',           color: '#EAB308', key: 'Goal' },
  { icon: 'book',             color: '#EC4899', key: 'Journal' },
  { icon: 'calendar',         color: '#06B6D4', key: 'Calendar' },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

export default function OnboardingScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const { setLanguage, setProfile, completeOnboarding } = useSettingsStore();

  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState<Language>('en');
  const [name, setName] = useState('');
  const slideAnim = useSharedValue(0);

  const isRTL = selectedLang === 'ar';
  const tFunc = (key: string) => t(key, selectedLang);

  const bg = isDark ? '#0B0B14' : '#F5F5FF';
  const cardBg = isDark ? 'rgba(30,30,60,0.95)' : '#FFFFFF';

  const goBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setStep(s => s - 1);
  };

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    if (step < TOTAL_STEPS - 1) {
      setStep(s => s + 1);
    }
  };

  const handleLangSelect = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  };

  const handleFinish = () => {
    if (name.trim()) {
      setProfile({ name: name.trim() });
    }
    completeOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    router.replace('/' as any);
  };

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const botPad = Platform.OS === 'web' ? 34 : insets.bottom;

  return (
    <View style={[styles.root, { backgroundColor: bg, paddingTop: topPad }]}>
      <View style={[styles.topNav, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {step > 0 ? (
          <Pressable
            onPress={goBack}
            hitSlop={12}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
            accessibilityRole="button"
          >
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color={isDark ? '#E0E0FF' : '#1A1A3A'} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        <StepDots current={step} total={TOTAL_STEPS} />
        <View style={styles.backBtn} />
      </View>

      {step === 0 && <WelcomeStep tFunc={tFunc} isDark={isDark} cardBg={cardBg} onNext={goNext} />}
      {step === 1 && (
        <LangStep
          tFunc={tFunc}
          selectedLang={selectedLang}
          onSelect={handleLangSelect}
          onNext={goNext}
          isDark={isDark}
          cardBg={cardBg}
          isRTL={isRTL}
        />
      )}
      {step === 2 && (
        <NameStep
          tFunc={tFunc}
          name={name}
          setName={setName}
          onNext={goNext}
          isDark={isDark}
          cardBg={cardBg}
          isRTL={isRTL}
        />
      )}
      {step === 3 && (
        <FeaturesStep
          tFunc={tFunc}
          isDark={isDark}
          cardBg={cardBg}
          onNext={goNext}
          isRTL={isRTL}
        />
      )}
      {step === 4 && (
        <DoneStep
          tFunc={tFunc}
          name={name}
          isDark={isDark}
          cardBg={cardBg}
          onFinish={handleFinish}
          isRTL={isRTL}
          botPad={botPad}
        />
      )}
    </View>
  );
}

function WelcomeStep({
  tFunc, isDark, cardBg, onNext,
}: { tFunc: (k: string) => string; isDark: boolean; cardBg: string; onNext: () => void }) {
  return (
    <View style={styles.stepWrap}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.welcomeGradientBall}
      />
      <View style={[styles.iconCircle]}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          style={styles.iconCircleGrad}
        >
          <Image
            source={require('../assets/images/icon.png')}
            style={styles.welcomeIcon}
            resizeMode="cover"
          />
        </LinearGradient>
      </View>
      <Text style={[styles.welcomeTitle, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.black }]}>
        {tFunc('onboardingWelcome')}
      </Text>
      <Text style={[styles.welcomeSub, { color: isDark ? 'rgba(200,200,255,0.65)' : 'rgba(60,60,100,0.55)' }]}>
        {tFunc('onboardingWelcomeSub')}
      </Text>
      <Pressable onPress={onNext} style={styles.primaryBtn}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGrad}
        >
          <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>
            {tFunc('onboardingGetStarted')}
          </Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function LangStep({
  tFunc, selectedLang, onSelect, onNext, isDark, cardBg, isRTL,
}: {
  tFunc: (k: string) => string; selectedLang: Language;
  onSelect: (l: Language) => void; onNext: () => void;
  isDark: boolean; cardBg: string; isRTL: boolean;
}) {
  return (
    <View style={styles.stepWrap}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconWrap, { backgroundColor: '#6366F1' + '22' }]}>
          <Ionicons name="language" size={28} color="#6366F1" />
        </View>
        <Text style={[styles.stepTitle, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.black }]}>
          {tFunc('onboardingChooseLang')}
        </Text>
        <Text style={[styles.stepSub, { color: isDark ? 'rgba(200,200,255,0.55)' : 'rgba(60,60,100,0.5)' }]}>
          {tFunc('onboardingChooseLangSub')}
        </Text>
      </View>

      <View style={styles.langCards}>
        {(['en', 'ar'] as Language[]).map(lang => {
          const active = selectedLang === lang;
          return (
            <Pressable key={lang} onPress={() => onSelect(lang)} style={[styles.langCard, { backgroundColor: cardBg }]}>
              <LinearGradient
                colors={active ? ['#6366F1', '#4F46E5'] : ['transparent', 'transparent']}
                style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
              />
              <Text style={[styles.langName, {
                color: active ? '#fff' : (isDark ? '#E0E0FF' : '#1A1A3A'),
                fontFamily: F.bold,
              }]}>
                {lang === 'en' ? 'English' : 'العربية'}
              </Text>
              <Text style={[styles.langSub, {
                color: active ? 'rgba(255,255,255,0.75)' : (isDark ? 'rgba(200,200,255,0.5)' : 'rgba(60,60,100,0.45)'),
              }]}>
                {lang === 'en' ? 'English' : 'Arabic'}
              </Text>
              {active && (
                <View style={styles.langCheck}>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={onNext} style={styles.primaryBtn}>
        <LinearGradient
          colors={['#6366F1', '#4F46E5']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGrad}
        >
          <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>
            {tFunc('onboardingContinue')}
          </Text>
          <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function NameStep({
  tFunc, name, setName, onNext, isDark, cardBg, isRTL,
}: {
  tFunc: (k: string) => string; name: string; setName: (n: string) => void;
  onNext: () => void; isDark: boolean; cardBg: string; isRTL: boolean;
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, width: '100%' }}
    >
      <View style={styles.stepWrap}>
        <View style={styles.stepHeader}>
          <View style={[styles.stepIconWrap, { backgroundColor: '#F97316' + '22' }]}>
            <Ionicons name="person" size={28} color="#F97316" />
          </View>
          <Text style={[styles.stepTitle, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.black }]}>
            {tFunc('onboardingYourName')}
          </Text>
          <Text style={[styles.stepSub, { color: isDark ? 'rgba(200,200,255,0.55)' : 'rgba(60,60,100,0.5)' }]}>
            {tFunc('onboardingYourNameSub')}
          </Text>
        </View>

        <View style={[styles.nameInputWrap, { backgroundColor: cardBg }]}>
          <Ionicons name="person-outline" size={20} color="#6366F1" style={{ marginRight: 10 }} />
          <TextInput
            style={[styles.nameInput, {
              color: isDark ? '#E0E0FF' : '#1A1A3A',
              fontFamily: F.med,
              textAlign: isRTL ? 'right' : 'left',
              flex: 1,
            }]}
            placeholder={tFunc('onboardingNamePlaceholder')}
            placeholderTextColor={isDark ? 'rgba(200,200,255,0.35)' : 'rgba(60,60,100,0.35)'}
            value={name}
            onChangeText={setName}
            returnKeyType="done"
            onSubmitEditing={onNext}
            autoFocus
          />
        </View>

        {name.trim().length > 0 && (
          <View style={[styles.greetingPreview, { backgroundColor: '#6366F1' + '18' }]}>
            <Text style={[styles.greetingText, { color: '#6366F1', fontFamily: F.bold }]}>
              👋 {isRTL ? `مرحباً ${name}!` : `Hello, ${name}!`}
            </Text>
          </View>
        )}

        <Pressable onPress={onNext} style={[styles.primaryBtn, { marginTop: 16 }]}>
          <LinearGradient
            colors={['#F97316', '#EA580C']}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.primaryBtnGrad}
          >
            <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>
              {tFunc('onboardingContinue')}
            </Text>
            <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#fff" />
          </LinearGradient>
        </Pressable>

        <Pressable onPress={onNext} style={styles.skipBtn}>
          <Text style={[styles.skipText, { color: isDark ? 'rgba(200,200,255,0.45)' : 'rgba(60,60,100,0.4)' }]}>
            {tFunc('onboardingSkip')}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function FeaturesStep({
  tFunc, isDark, cardBg, onNext, isRTL,
}: {
  tFunc: (k: string) => string; isDark: boolean; cardBg: string;
  onNext: () => void; isRTL: boolean;
}) {
  return (
    <View style={[styles.stepWrap, { justifyContent: 'flex-start' }]}>
      <View style={styles.stepHeader}>
        <View style={[styles.stepIconWrap, { backgroundColor: '#EAB308' + '22' }]}>
          <Ionicons name="star" size={28} color="#EAB308" />
        </View>
        <Text style={[styles.stepTitle, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.black }]}>
          {tFunc('onboardingFeatures')}
        </Text>
        <Text style={[styles.stepSub, { color: isDark ? 'rgba(200,200,255,0.55)' : 'rgba(60,60,100,0.5)' }]}>
          {tFunc('onboardingFeaturesSub')}
        </Text>
      </View>

      <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
        {FEATURES.map(feat => (
          <View key={feat.key} style={[styles.featCard, { backgroundColor: cardBg }]}>
            <View style={[styles.featIconWrap, { backgroundColor: feat.color + '20' }]}>
              <Ionicons name={feat.icon as any} size={24} color={feat.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.featName, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.bold }]}>
                {tFunc(`onboardingFeat${feat.key}`)}
              </Text>
              <Text style={[styles.featDesc, { color: isDark ? 'rgba(200,200,255,0.5)' : 'rgba(60,60,100,0.5)' }]}>
                {tFunc(`onboardingFeat${feat.key}Desc`)}
              </Text>
            </View>
            <View style={[styles.featAccent, { backgroundColor: feat.color }]} />
          </View>
        ))}
      </ScrollView>

      <Pressable onPress={onNext} style={[styles.primaryBtn, { marginTop: 12 }]}>
        <LinearGradient
          colors={['#EAB308', '#D97706']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGrad}
        >
          <Text style={[styles.primaryBtnText, { fontFamily: F.bold }]}>
            {tFunc('onboardingContinue')}
          </Text>
          <Ionicons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

function DoneStep({
  tFunc, name, isDark, cardBg, onFinish, isRTL, botPad,
}: {
  tFunc: (k: string) => string; name: string; isDark: boolean; cardBg: string;
  onFinish: () => void; isRTL: boolean; botPad: number;
}) {
  return (
    <View style={[styles.stepWrap, { paddingBottom: botPad + 24 }]}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.doneGradCircle}
      />
      <View style={styles.doneEmojiWrap}>
        <Text style={styles.doneEmoji}>🎉</Text>
      </View>
      <Text style={[styles.doneTitle, { color: isDark ? '#E0E0FF' : '#1A1A3A', fontFamily: F.black }]}>
        {name ? (isRTL ? `مرحباً ${name}!` : `Welcome, ${name}!`) : tFunc('onboardingAllSet')}
      </Text>
      <Text style={[styles.doneSub, { color: isDark ? 'rgba(200,200,255,0.6)' : 'rgba(60,60,100,0.55)' }]}>
        {tFunc('onboardingAllSetSub')}
      </Text>

      <View style={styles.doneStats}>
        {[
          { icon: 'checkmark-circle', color: '#6366F1', label: isRTL ? 'المهام' : 'Tasks' },
          { icon: 'leaf',             color: '#F97316', label: isRTL ? 'العادات' : 'Habits' },
          { icon: 'trophy',           color: '#EAB308', label: isRTL ? 'الأهداف' : 'Goals' },
        ].map(s => (
          <View key={s.label} style={[styles.doneStatItem, { backgroundColor: s.color + '18' }]}>
            <Ionicons name={s.icon as any} size={22} color={s.color} />
            <Text style={[styles.doneStatLabel, { color: s.color, fontFamily: F.bold }]}>{s.label}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={onFinish} style={[styles.primaryBtn, { marginTop: 32 }]}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#EC4899']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.primaryBtnGrad}
        >
          <Text style={[styles.primaryBtnText, { fontFamily: F.bold, fontSize: 17 }]}>
            {tFunc('onboardingStartApp')}
          </Text>
          <Ionicons name="rocket" size={20} color="#fff" />
        </LinearGradient>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  topNav: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 7,
    paddingVertical: 20,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 24,
    backgroundColor: '#6366F1',
  },
  dotInactive: {
    width: 8,
    backgroundColor: 'rgba(99,102,241,0.25)',
  },
  stepWrap: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  stepHeader: {
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 26,
    textAlign: 'center',
  },
  stepSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  welcomeGradientBall: {
    position: 'absolute',
    top: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.12,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 12,
  },
  iconCircleGrad: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeIcon: {
    width: 110,
    height: 110,
    borderRadius: 28,
  },
  welcomeTitle: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 12,
  },
  welcomeSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },

  langCards: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  langCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    minHeight: 130,
    justifyContent: 'center',
  },
  langName: {
    fontSize: 16,
  },
  langSub: {
    fontSize: 12,
  },
  langCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
  },

  nameInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  nameInput: {
    fontSize: 17,
    height: 28,
  },
  greetingPreview: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 16,
  },

  featCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  featIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featName: {
    fontSize: 15,
    marginBottom: 3,
  },
  featDesc: {
    fontSize: 12,
    lineHeight: 17,
  },
  featAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderRadius: 2,
  },

  doneGradCircle: {
    position: 'absolute',
    top: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.1,
  },
  doneEmojiWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(99,102,241,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneEmoji: {
    fontSize: 52,
  },
  doneTitle: {
    fontSize: 28,
    textAlign: 'center',
  },
  doneSub: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  doneStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  doneStatItem: {
    flex: 1,
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    gap: 7,
  },
  doneStatLabel: {
    fontSize: 12,
  },

  primaryBtn: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  skipBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  skipText: {
    fontSize: 14,
  },
});
