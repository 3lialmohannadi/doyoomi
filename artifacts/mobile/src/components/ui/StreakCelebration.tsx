import React, { useEffect, useMemo, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { F, Spacing, Radius } from '../../theme';
import { Language } from '../../types';
import { t } from '../../utils/i18n';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const PARTICLE_COUNT = 18;
const AUTO_DISMISS_MS = 2500;

const MILESTONE_CONFIG: Record<number, {
  emoji: string;
  gradient: readonly [string, string, string];
  particleColors: string[];
}> = {
  3:  {
    emoji: '⚡',
    gradient: ['#F97316', '#FB923C', '#FDE68A'] as const,
    particleColors: ['#F97316', '#FDE68A', '#FB923C', '#FCA5A5'],
  },
  7:  {
    emoji: '🔥',
    gradient: ['#6366F1', '#8B5CF6', '#EC4899'] as const,
    particleColors: ['#6366F1', '#8B5CF6', '#EC4899', '#F9A8D4'],
  },
  14: {
    emoji: '🔥',
    gradient: ['#10B981', '#06B6D4', '#3B82F6'] as const,
    particleColors: ['#10B981', '#34D399', '#06B6D4', '#93C5FD'],
  },
  30: {
    emoji: '🏆',
    gradient: ['#EAB308', '#F97316', '#EF4444'] as const,
    particleColors: ['#EAB308', '#FDE68A', '#F97316', '#FCA5A5'],
  },
  100: {
    emoji: '🎯',
    gradient: ['#8B5CF6', '#6366F1', '#EC4899'] as const,
    particleColors: ['#8B5CF6', '#EC4899', '#6366F1', '#F9A8D4'],
  },
};

function getConfig(streakDays: number) {
  return MILESTONE_CONFIG[streakDays] ?? MILESTONE_CONFIG[7];
}

function getCelebrationMessage(streakDays: number, lang: Language): string {
  const key = `streakCelebration${streakDays}` as
    | 'streakCelebration3'
    | 'streakCelebration7'
    | 'streakCelebration14'
    | 'streakCelebration30'
    | 'streakCelebration100';
  return t(key, lang);
}

interface ParticleDef {
  anim: Animated.Value;
  x: number;
  y: number;
  angle: number;
  distance: number;
  size: number;
  color: string;
}

function buildParticles(colors: string[]): ParticleDef[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    anim: new Animated.Value(0),
    x: SCREEN_W / 2,
    y: SCREEN_H / 2,
    angle: (i / PARTICLE_COUNT) * 2 * Math.PI + Math.random() * 0.5,
    distance: 80 + Math.random() * 160,
    size: 6 + Math.random() * 8,
    color: colors[i % colors.length],
  }));
}

interface StreakCelebrationProps {
  visible: boolean;
  habitName: string;
  streakDays: number;
  lang: Language;
  onDismiss: () => void;
}

export function StreakCelebration({
  visible,
  habitName,
  streakDays,
  lang,
  onDismiss,
}: StreakCelebrationProps) {
  const isRTL = lang === 'ar';
  const cfg = getConfig(streakDays);

  const emojiScale = useRef(new Animated.Value(0)).current;
  const emojiRotate = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const particles = useMemo(() => buildParticles(cfg.particleColors), [streakDays]);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    overlayOpacity.setValue(0);
    emojiScale.setValue(0);
    emojiRotate.setValue(0);
    contentOpacity.setValue(0);
    particles.forEach((p) => p.anim.setValue(0));

    Animated.sequence([
      Animated.timing(overlayOpacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.spring(emojiScale, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(emojiRotate, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.stagger(
          30,
          particles.map((p) =>
            Animated.timing(p.anim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            })
          )
        ),
      ]),
    ]).start();

    autoTimer.current = setTimeout(() => {
      dismiss();
    }, AUTO_DISMISS_MS);

    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, [visible]);

  const dismiss = () => {
    if (autoTimer.current) clearTimeout(autoTimer.current);
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  const emojiRotateDeg = emojiRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <TouchableWithoutFeedback onPress={dismiss}>
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <LinearGradient
            colors={[...cfg.gradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />

          {particles.map((p, i) => {
            const translateX = p.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.cos(p.angle) * p.distance],
            });
            const translateY = p.anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, Math.sin(p.angle) * p.distance],
            });
            const particleOpacity = p.anim.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [1, 1, 0],
            });
            return (
              <Animated.View
                key={i}
                style={[
                  styles.particle,
                  {
                    width: p.size,
                    height: p.size,
                    borderRadius: p.size / 2,
                    backgroundColor: p.color,
                    opacity: particleOpacity,
                    transform: [{ translateX }, { translateY }],
                  },
                ]}
              />
            );
          })}

          <Animated.View
            style={[
              styles.content,
              { opacity: contentOpacity },
            ]}
          >
            <Animated.Text
              style={[
                styles.emoji,
                {
                  transform: [
                    { scale: emojiScale },
                    { rotate: emojiRotateDeg },
                  ],
                },
              ]}
            >
              {cfg.emoji}
            </Animated.Text>

            <Text style={[styles.milestoneLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('streakMilestone', lang)}
            </Text>

            <View style={styles.streakBadge}>
              <Text style={styles.streakNumber}>{streakDays}</Text>
              <Text style={styles.streakUnit}>
                {' '}{t('streakDaysLabel', lang)}
              </Text>
            </View>

            <Text
              style={[
                styles.habitName,
                { textAlign: 'center' },
              ]}
              numberOfLines={2}
            >
              {habitName}
            </Text>

            <Text style={[styles.celebrationMsg, { textAlign: 'center' }]}>
              {getCelebrationMessage(streakDays, lang)}
            </Text>

            <Text style={styles.dismissHint}>
              {t('streakTapToDismiss', lang)}
            </Text>
          </Animated.View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
    top: SCREEN_H / 2,
    left: SCREEN_W / 2,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxl,
  },
  emoji: {
    fontSize: 96,
    marginBottom: Spacing.lg,
  },
  milestoneLabel: {
    fontSize: 15,
    fontFamily: F.bold,
    color: 'rgba(255,255,255,0.80)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  streakNumber: {
    fontSize: 72,
    fontFamily: F.black,
    color: '#FFFFFF',
    lineHeight: 80,
  },
  streakUnit: {
    fontSize: 22,
    fontFamily: F.bold,
    color: 'rgba(255,255,255,0.85)',
    marginLeft: 4,
  },
  habitName: {
    fontSize: 20,
    fontFamily: F.bold,
    color: 'rgba(255,255,255,0.90)',
    marginBottom: Spacing.lg,
  },
  celebrationMsg: {
    fontSize: 16,
    fontFamily: F.med,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
  },
  dismissHint: {
    fontSize: 13,
    fontFamily: F.reg,
    color: 'rgba(255,255,255,0.50)',
    textAlign: 'center',
  },
});
