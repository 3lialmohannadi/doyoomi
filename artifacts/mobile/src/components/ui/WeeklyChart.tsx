import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
}

const MAX_BAR_H = 68;
const BAR_ANIM_DURATION = 550;

function ChartBar({
  day,
  index,
  C,
  isDark,
}: {
  day: WeekDayData;
  index: number;
  C: ColorScheme;
  isDark: boolean;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: day.pct,
      duration: BAR_ANIM_DURATION,
      delay: index * 50,
      useNativeDriver: false,
    }).start();
  }, [day.pct, index]);

  const barH = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, MAX_BAR_H],
  });

  const trackBg = isDark
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(99,102,241,0.07)';

  const showLabel = !day.isFuture && day.totalCount > 0;
  const countLabel = showLabel ? `${day.completedCount}/${day.totalCount}` : '';

  return (
    <View style={styles.barCol}>
      <Text
        style={[
          styles.pctLabel,
          {
            color: day.isToday ? C.tint : C.textMuted,
            opacity: showLabel ? 1 : 0,
          },
        ]}
      >
        {countLabel}
      </Text>

      <View style={[styles.barTrack, { backgroundColor: trackBg }]}>
        {!day.isFuture && (
          <Animated.View
            style={[
              styles.barFill,
              { height: barH },
              day.isToday && { overflow: 'hidden' },
            ]}
          >
            {day.isToday ? (
              <LinearGradient
                colors={[...GRADIENT_H]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            ) : (
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: C.tint + '55' },
                ]}
              />
            )}
          </Animated.View>
        )}
      </View>

      <Text
        style={[
          styles.dayLabel,
          { color: day.isToday ? C.tint : C.textSecondary },
          day.isToday && { fontFamily: F.bold },
        ]}
      >
        {day.dayLabel}
      </Text>

      {day.isToday && (
        <View style={[styles.todayDot, { backgroundColor: C.tint }]} />
      )}
    </View>
  );
}

export function WeeklyChart({
  data,
  C,
  isDark,
  isRTL,
  title,
}: WeeklyChartProps) {
  const hasData = data.some((d) => d.totalCount > 0);
  if (!hasData) return null;

  const displayData = isRTL ? [...data].reverse() : data;

  return (
    <View
      style={[
        styles.card,
        { borderColor: C.border },
        isDark ? ShadowDark.sm : Shadow.sm,
      ]}
    >
      {isDark && (
        <LinearGradient
          colors={[...GRADIENT_DARK_CARD]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}
      {!isDark && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />
      )}

      <Text
        style={[
          styles.cardTitle,
          { color: C.text, textAlign: isRTL ? 'right' : 'left' },
        ]}
      >
        {title}
      </Text>

      <View style={styles.chartRow}>
        {displayData.map((day, i) => (
          <ChartBar key={day.date} day={day} index={i} C={C} isDark={isDark} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: F.bold,
    marginBottom: Spacing.sm,
    letterSpacing: 0.3,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: MAX_BAR_H + 36,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pctLabel: {
    fontSize: 11,
    fontFamily: F.bold,
    marginBottom: 2,
    textAlign: 'center',
  },
  barTrack: {
    width: 22,
    height: MAX_BAR_H,
    borderRadius: 6,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: 22,
    borderRadius: 6,
    overflow: 'hidden',
  },
  dayLabel: {
    fontSize: 11,
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
