import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { F, Spacing, Radius, ColorScheme, Shadow, ShadowDark, GRADIENT_H, GRADIENT_DARK_CARD } from '../../theme';

export interface WeekDayData {
  date: string;
  dayLabel: string;
  completedCount: number;
  totalCount: number;
  pct: number;
  isToday: boolean;
  isFuture: boolean;
}

interface WeeklyChartProps {
  data: WeekDayData[];
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
  title: string;
  streakDays?: number;
  bestStreak?: number;
  onBarPress?: (date: string) => void;
}

const MAX_BAR_H = 60;
const BAR_ANIM_DURATION = 550;

function ChartBar({
  day,
  index,
  C,
  isDark,
  onPress,
}: {
  day: WeekDayData;
  index: number;
  C: ColorScheme;
  isDark: boolean;
  onPress?: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: day.pct,
      duration: BAR_ANIM_DURATION,
      delay: index * 60,
      useNativeDriver: false,
    }).start();
  }, [day.pct, index]);

  const barH = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, MAX_BAR_H],
  });

  const trackBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.08)';

  return (
    <Pressable
      style={({ pressed }) => [styles.barCol, { opacity: pressed && onPress ? 0.7 : 1 }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={[styles.barTrack, { backgroundColor: trackBg }]}>
        {!day.isFuture && (
          <Animated.View style={[styles.barFill, { height: barH }, day.isToday && { overflow: 'hidden' }]}>
            {day.isToday ? (
              <LinearGradient
                colors={[...GRADIENT_H]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View style={[StyleSheet.absoluteFill, { backgroundColor: C.tint + '60' }]} />
            )}
          </Animated.View>
        )}
      </View>

      <Text
        style={[
          styles.dayLabel,
          { color: day.isToday ? C.tint : C.textMuted },
          day.isToday && { fontFamily: F.bold },
        ]}
      >
        {day.dayLabel}
      </Text>

      {day.isToday && (
        <View style={[styles.todayDot, { backgroundColor: C.tint }]} />
      )}
    </Pressable>
  );
}

export function WeeklyChart({
  data,
  C,
  isDark,
  isRTL,
  title,
  streakDays = 0,
  bestStreak = 0,
  onBarPress,
}: WeeklyChartProps) {
  const hasData = data.some((d) => d.totalCount > 0);
  const hasStreak = streakDays > 0;
  const showStreakPanel = hasStreak || bestStreak > 0;
  if (!hasData && !showStreakPanel) return null;

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (streakDays > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.18, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [streakDays]);

  const displayData = isRTL ? [...data].reverse() : data;
  const pastDays = data.filter((d) => !d.isFuture);
  const completedDays = pastDays.filter((d) => d.pct >= 0.5).length;
  const weekPct = pastDays.length > 0 ? Math.round((completedDays / pastDays.length) * 100) : 0;
  const showBest = bestStreak > 0 && bestStreak >= streakDays;

  return (
    <View style={[styles.card, isDark ? ShadowDark.md : Shadow.md, { borderColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(99,102,241,0.12)' }]}>

      {isDark && (
        <LinearGradient
          colors={['rgba(30,27,55,0.98)', 'rgba(15,13,35,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}

      {/* Top gradient accent */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topAccent}
      />

      <View style={styles.inner}>

        {/* Title row */}
        <View style={[styles.titleRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.cardTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>
            {title}
          </Text>
          <View style={[styles.weekPctBadge, { backgroundColor: C.tint + '18' }]}>
            <Text style={[styles.weekPctText, { color: C.tint }]}>{weekPct}%</Text>
          </View>
        </View>

        {/* Main body */}
        <View style={[styles.body, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>

          {/* ── Streak panel ── */}
          {showStreakPanel && (
            <>
              <View style={styles.streakPanel}>
                <LinearGradient
                  colors={streakDays > 0
                    ? ['#F97316' + '22', '#F97316' + '06']
                    : [isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: Radius.lg }]}
                />

                {/* Flame with glow */}
                <View style={styles.flameWrap}>
                  {streakDays > 0 && (
                    <View style={[styles.flameGlow, { backgroundColor: '#F97316' + '30' }]} />
                  )}
                  <Animated.Text
                    style={[
                      styles.flameEmoji,
                      streakDays > 0 && { transform: [{ scale: pulseAnim }] },
                    ]}
                  >
                    {streakDays > 0 ? '🔥' : '💤'}
                  </Animated.Text>
                </View>

                <Text style={[styles.streakNum, { color: streakDays > 0 ? '#F97316' : C.textMuted }]}>
                  {streakDays}
                </Text>
                <Text style={[styles.streakLabel, { color: C.textSecondary }]}>
                  {isRTL ? 'يوم متتالي' : 'day streak'}
                </Text>

                {showBest && (
                  <View style={[styles.bestBadge, { backgroundColor: isDark ? 'rgba(249,115,22,0.15)' : 'rgba(249,115,22,0.10)' }]}>
                    <Text style={[styles.bestText, { color: '#F97316' }]}>
                      🏆 {bestStreak}
                    </Text>
                  </View>
                )}
              </View>

              {/* Vertical divider */}
              <View style={[styles.vDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }]} />
            </>
          )}

          {/* ── Chart panel ── */}
          <View style={styles.chartPanel}>
            {hasData ? (
              <View style={styles.chartRow}>
                {displayData.map((day, i) => (
                  <ChartBar
                    key={day.date}
                    day={day}
                    index={i}
                    C={C}
                    isDark={isDark}
                    onPress={onBarPress ? () => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      onBarPress(day.date);
                    } : undefined}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.emptyChart}>
                <Text style={[styles.emptyChartText, { color: C.textMuted }]}>
                  {isRTL ? 'لا توجد بيانات بعد' : 'No data yet'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bottom summary */}
        <View style={[styles.summaryRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }]}>
          <View style={[styles.summaryPill, { backgroundColor: C.tintSecondary + '15' }]}>
            <Text style={[styles.summaryPillText, { color: C.tintSecondary }]}>
              ✅ {completedDays} {isRTL ? 'أيام' : 'days'}
            </Text>
          </View>
          <View style={[styles.summaryPill, { backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)' }]}>
            <Text style={[styles.summaryPillText, { color: C.textSecondary }]}>
              📅 {pastDays.length} {isRTL ? 'من 7' : 'of 7'}
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl + 4,
    borderWidth: 1,
    overflow: 'hidden',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  topAccent: {
    height: 3,
    width: '100%',
  },
  inner: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: 0,
  },

  titleRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: F.bold,
    letterSpacing: 0.3,
  },
  weekPctBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  weekPctText: {
    fontSize: 12,
    fontFamily: F.black,
  },

  body: {
    alignItems: 'stretch',
    gap: 0,
  },

  streakPanel: {
    width: 96,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    gap: 2,
  },
  flameWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    marginBottom: 2,
  },
  flameGlow: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  flameEmoji: {
    fontSize: 28,
  },
  streakNum: {
    fontSize: 28,
    fontFamily: F.black,
    lineHeight: 32,
  },
  streakLabel: {
    fontSize: 10,
    fontFamily: F.med,
    textAlign: 'center',
    marginTop: 1,
  },
  bestBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  bestText: {
    fontSize: 11,
    fontFamily: F.bold,
  },

  vDivider: {
    width: 1,
    marginVertical: Spacing.sm,
    marginHorizontal: Spacing.sm,
  },

  chartPanel: {
    flex: 1,
    justifyContent: 'center',
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_H + 28,
    paddingTop: 4,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 18,
    height: MAX_BAR_H,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 18,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: F.med,
    marginTop: 3,
    textAlign: 'center',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  emptyChart: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyChartText: {
    fontSize: 12,
    fontFamily: F.med,
  },

  summaryRow: {
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    gap: Spacing.sm,
  },
  summaryPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  summaryPillText: {
    fontSize: 11,
    fontFamily: F.med,
  },
});
