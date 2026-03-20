import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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

interface StatItem {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: number;
  label: string;
  color: string;
}

interface WeeklyChartProps {
  data: WeekDayData[];
  C: ColorScheme;
  isDark: boolean;
  isRTL: boolean;
  title: string;
  completedToday?: number;
  overdueCount?: number;
  thisWeek?: number;
  streakDays?: number;
  bestStreak?: number;
  labelCompleted?: string;
  labelOverdue?: string;
  labelThisWeek?: string;
  labelStreak?: string;
  onBarPress?: (date: string) => void;
}

const MAX_BAR_H = 64;
const BAR_ANIM_DURATION = 580;

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

  const barH = anim.interpolate({ inputRange: [0, 1], outputRange: [0, MAX_BAR_H] });
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
              <View style={[StyleSheet.absoluteFill, { backgroundColor: C.tint + '65' }]} />
            )}
          </Animated.View>
        )}
      </View>
      <Text style={[styles.dayLabel, { color: day.isToday ? C.tint : C.textMuted }, day.isToday && { fontFamily: F.bold }]}>
        {day.dayLabel}
      </Text>
      {day.isToday && <View style={[styles.todayDot, { backgroundColor: C.tint }]} />}
    </Pressable>
  );
}

export function WeeklyChart({
  data,
  C,
  isDark,
  isRTL,
  title,
  completedToday = 0,
  overdueCount = 0,
  thisWeek = 0,
  streakDays = 0,
  bestStreak = 0,
  labelCompleted = 'Completed',
  labelOverdue = 'Overdue',
  labelThisWeek = 'This Week',
  labelStreak = 'Streak',
  onBarPress,
}: WeeklyChartProps) {
  const hasData = data.some((d) => d.totalCount > 0);
  const hasStats = completedToday > 0 || overdueCount > 0 || thisWeek > 0 || streakDays > 0;
  if (!hasData && !hasStats) return null;

  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (streakDays > 0) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 900, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [streakDays]);

  const displayData = isRTL ? [...data].reverse() : data;

  const stats: StatItem[] = [
    { icon: 'checkmark-done', value: completedToday, label: labelCompleted, color: C.tintSecondary },
    { icon: 'alert-circle',   value: overdueCount,   label: labelOverdue,   color: C.error },
    { icon: 'calendar',       value: thisWeek,        label: labelThisWeek,  color: C.tint },
    { icon: 'flame',          value: streakDays,      label: labelStreak,    color: '#F97316' },
  ];

  return (
    <View style={[styles.card, isDark ? ShadowDark.md : Shadow.md, { borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.13)' }]}>

      {/* Background */}
      {isDark ? (
        <LinearGradient
          colors={['rgba(28,25,52,0.98)', 'rgba(14,12,30,0.98)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />
      )}

      {/* Top gradient accent */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899', '#F97316']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.topAccent}
      />

      <View style={styles.inner}>

        {/* ── Stats Row ── */}
        <View style={[styles.statsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {stats.map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={[styles.statSep, { backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]} />}
              <View style={styles.statCell}>
                <View style={[styles.statIconRing, { backgroundColor: s.color + '18' }]}>
                  {s.icon === 'flame' && streakDays > 0 ? (
                    <Animated.Text style={[styles.flameEmoji, { transform: [{ scale: pulseAnim }] }]}>🔥</Animated.Text>
                  ) : (
                    <Ionicons name={s.icon} size={16} color={s.color} />
                  )}
                </View>
                <Text style={[styles.statNum, { color: s.value > 0 ? s.color : C.textMuted }]}>
                  {s.value}
                </Text>
                <Text style={[styles.statLabel, { color: C.textSecondary }]} numberOfLines={1}>
                  {s.label}
                </Text>
                {s.icon === 'flame' && bestStreak > streakDays && bestStreak > 0 && (
                  <Text style={[styles.bestHint, { color: '#F97316' + '99' }]}>🏆{bestStreak}</Text>
                )}
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* ── Divider with chart title ── */}
        {hasData && (
          <>
            <View style={[styles.sectionDivider, { borderTopColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)' }]}>
              <Text style={[styles.chartTitle, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {title}
              </Text>
            </View>

            {/* ── Bar Chart ── */}
            <View style={[styles.chartRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
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
          </>
        )}

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
  topAccent: { height: 3 },
  inner: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
  },

  // Stats
  statsGrid: {
    alignItems: 'stretch',
  },
  statSep: {
    width: 1,
    marginVertical: Spacing.xs,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: 3,
  },
  statIconRing: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  flameEmoji: { fontSize: 18 },
  statNum: {
    fontSize: 20,
    fontFamily: F.black,
    lineHeight: 24,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: F.med,
    textAlign: 'center',
  },
  bestHint: {
    fontSize: 10,
    fontFamily: F.bold,
    marginTop: 1,
  },

  // Chart section
  sectionDivider: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
  },
  chartTitle: {
    fontSize: 11,
    fontFamily: F.bold,
    letterSpacing: 0.3,
    marginBottom: Spacing.xs,
    opacity: 0.7,
  },
  chartRow: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_H + 26,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barTrack: {
    width: 20,
    height: MAX_BAR_H,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 20,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dayLabel: {
    fontSize: 10,
    fontFamily: F.med,
    marginTop: 4,
    textAlign: 'center',
  },
  todayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
});
