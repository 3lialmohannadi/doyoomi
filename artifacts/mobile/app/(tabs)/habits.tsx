import React, { useState, useEffect, useRef } from 'react';
import {
  FlatList, StyleSheet, Text, View, Platform, Pressable, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { format, subDays, getDay } from 'date-fns';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useHabitsStore } from '../../src/store/habitsStore';
import { useSettingsStore } from '../../src/store/settingsStore';
import { Spacing, Radius, F, GRADIENT_DARK_CARD, GRADIENT_DARK_HEADER, ColorScheme, Shadow, ShadowDark } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { SwipeableRow } from '../../src/components/ui/SwipeableRow';
import { HabitForm } from '../../src/features/habits/HabitForm';
import { Toast } from '../../src/components/ui/Toast';
import { ConfirmDialog } from '../../src/components/ui/ConfirmDialog';
import { StreakCelebration } from '../../src/components/ui/StreakCelebration';
import { MiniConfetti } from '../../src/components/ui/MiniConfetti';
import { Habit, HabitFrequency } from '../../src/types';
import { StreakCelebrationPayload } from '../../src/store/habitsStore';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function getFreqBadge(freq: HabitFrequency, tFunc: (k: string) => string): string {
  if (freq.type === 'daily') return tFunc('freqDaily');
  if (freq.type === 'weekdays') return tFunc('freqWeekdays');
  if (freq.type === 'custom') {
    const sd = freq.specific_days;
    if (sd && sd.length > 0) {
      const dayAbbr = ['Su','Mo','Tu','We','Th','Fr','Sa'];
      return sd.map(d => dayAbbr[d]).join(', ');
    }
    const dpw = freq.days_per_week ?? 3;
    return `${dpw}× / ${tFunc('freqWeek')}`;
  }
  return '';
}

function getDayAbbr(date: Date, lang: string): string {
  const day = getDay(date);
  const en = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const ar = ['أح', 'اث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
  return lang === 'ar' ? ar[day] : en[day];
}

function isRequiredDay(date: Date, freq: HabitFrequency): boolean {
  if (freq.type === 'daily') return true;
  if (freq.type === 'weekdays') {
    const d = getDay(date);
    return d !== 0 && d !== 6;
  }
  if (freq.type === 'custom') {
    const sd = freq.specific_days;
    if (sd && sd.length > 0) {
      return sd.includes(getDay(date));
    }
    return true;
  }
  return true;
}

function HistoryCalendarModal({
  visible,
  habit,
  onClose,
  lang,
  isRTL,
  C,
  isDark,
}: {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  lang: string;
  isRTL: boolean;
  C: ColorScheme;
  isDark: boolean;
}) {
  if (!habit) return null;
  const today = new Date();
  const days30 = Array.from({ length: 30 }, (_, i) => subDays(today, 29 - i));
  const history = habit.completion_history ?? [];

  const rows: Date[][] = [];
  for (let i = 0; i < days30.length; i += 7) {
    rows.push(days30.slice(i, i + 7));
  }

  const completedCount = days30.filter(d => history.includes(format(d, 'yyyy-MM-dd'))).length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={calStyles.overlay} onPress={onClose}>
        <Pressable style={[calStyles.sheet, { backgroundColor: isDark ? '#1C1A2E' : C.card }]} onPress={() => {}}>
          {/* Header */}
          <View style={[calStyles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[calStyles.habitIconWrap, { backgroundColor: habit.color + '20' }]}>
              <Ionicons name={habit.icon as React.ComponentProps<typeof Ionicons>['name']} size={20} color={habit.color} />
            </View>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', marginHorizontal: 10 }}>
              <Text style={[calStyles.title, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {habit.name}
              </Text>
              <Text style={[calStyles.subtitle, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                {t('completionHistory30', lang)} · {completedCount}/30
              </Text>
            </View>
            <Pressable onPress={onClose} style={calStyles.closeBtn} hitSlop={8}>
              <Ionicons name="close" size={20} color={C.textMuted} />
            </Pressable>
          </View>

          {/* Calendar grid */}
          <View style={calStyles.grid}>
            {rows.map((week, wi) => (
              <View key={wi} style={[calStyles.week, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                {week.map((d) => {
                  const dStr = format(d, 'yyyy-MM-dd');
                  const todayStr = format(today, 'yyyy-MM-dd');
                  const isToday = dStr === todayStr;
                  const isFuture = d > today;
                  const isDone = history.includes(dStr);

                  const required = !isFuture && isRequiredDay(d, habit.frequency ?? { type: 'daily' });
                  const isMissed = !isFuture && !isToday && !isDone && required;

                  let bg = isDark ? 'rgba(255,255,255,0.05)' : C.surface;
                  let dotColor = isDark ? 'rgba(255,255,255,0.1)' : C.border;
                  if (isDone) { bg = habit.color + '25'; dotColor = habit.color; }
                  else if (isMissed) { bg = '#EF444415'; dotColor = '#EF4444'; }
                  else if (isFuture) { bg = 'transparent'; dotColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'; }

                  return (
                    <View key={dStr} style={[calStyles.dayCell]}>
                      <View style={[
                        calStyles.dayDot,
                        { backgroundColor: bg, borderColor: isToday ? habit.color : dotColor, borderWidth: isToday ? 2 : 1 },
                      ]}>
                        {isDone && (
                          <Ionicons name="checkmark" size={12} color={habit.color} />
                        )}
                        {isMissed && !isToday && (
                          <Ionicons name="close" size={10} color="#EF4444" />
                        )}
                      </View>
                      <Text style={[calStyles.dayLabel, { color: isFuture ? C.textMuted + '60' : C.textMuted }]}>
                        {getDayAbbr(d, lang)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Legend */}
          <View style={[calStyles.legend, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[calStyles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[calStyles.legendDot, { backgroundColor: habit.color + '25', borderColor: habit.color }]} />
              <Text style={[calStyles.legendText, { color: C.textSecondary }]}>{t('done', lang)}</Text>
            </View>
            <View style={[calStyles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[calStyles.legendDot, { backgroundColor: '#EF444415', borderColor: '#EF4444' }]} />
              <Text style={[calStyles.legendText, { color: C.textSecondary }]}>{t('missed', lang)}</Text>
            </View>
            <View style={[calStyles.legendItem, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={[calStyles.legendDot, { backgroundColor: 'transparent', borderColor: C.textMuted + '30' }]} />
              <Text style={[calStyles.legendText, { color: C.textSecondary }]}>{t('future', lang)}</Text>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const calStyles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  sheet: {
    width: '100%', maxWidth: 380, borderRadius: 24, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 24, elevation: 20,
  },
  header: { alignItems: 'center', marginBottom: 16 },
  habitIconWrap: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  title: { fontSize: 16, fontFamily: F.bold },
  subtitle: { fontSize: 12, fontFamily: F.med, marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  grid: { gap: 6 },
  week: { gap: 4, justifyContent: 'space-between' },
  dayCell: { flex: 1, alignItems: 'center', gap: 3 },
  dayDot: {
    width: 32, height: 32, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  dayLabel: { fontSize: 9, fontFamily: F.med },
  legend: { marginTop: 14, gap: 14, justifyContent: 'center' },
  legendItem: { alignItems: 'center', gap: 5 },
  legendDot: { width: 14, height: 14, borderRadius: 5, borderWidth: 1 },
  legendText: { fontSize: 11, fontFamily: F.med },
});

function HistoryDots({ history, color, isRTL }: { history: string[]; color: string; isRTL: boolean }) {
  const today = new Date();
  const dots = Array.from({ length: 7 }, (_, i) => {
    const d = subDays(today, 6 - i);
    const key = format(d, 'yyyy-MM-dd');
    const done = history.includes(key);
    return { key, done };
  });
  const ordered = isRTL ? [...dots].reverse() : dots;
  return (
    <View style={[hStyles.dotsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      {ordered.map(dot => (
        <View
          key={dot.key}
          style={[hStyles.dot, { backgroundColor: dot.done ? color : color + '25', borderColor: dot.done ? color : color + '40' }]}
        />
      ))}
    </View>
  );
}

const hStyles = StyleSheet.create({
  dotsRow: { gap: 4, alignItems: 'center', marginTop: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, borderWidth: 1 },
});

function HabitCard({
  item, isDoneToday, isDark, isRTL, C, tFunc, onToggle, onEdit, onDelete, onShowHistory,
}: {
  item: Habit;
  isDark: boolean;
  isDoneToday: boolean;
  isRTL: boolean;
  C: ColorScheme;
  tFunc: (k: string) => string;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowHistory: () => void;
}) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const [confettiKey, setConfettiKey] = useState(0);
  const prevDone = useRef(isDoneToday);
  useEffect(() => {
    if (isDoneToday && !prevDone.current) {
      setConfettiKey(k => k + 1);
    }
    prevDone.current = isDoneToday;
  }, [isDoneToday]);

  const freqBadge = item.frequency ? getFreqBadge(item.frequency, tFunc) : '';

  return (
    <AnimatedPressable
      style={[
        animStyle,
        { position: 'relative' },
        isDark ? ShadowDark.sm : Shadow.sm,
        styles.habitCard,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: isDark ? 'transparent' : (isDoneToday ? item.color + '10' : C.card),
          borderColor: isDoneToday ? item.color + '50' : C.border,
          overflow: 'hidden',
        },
      ]}
      onPressIn={() => { scale.value = withSpring(0.98, { damping: 15 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15 }); }}
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ checked: isDoneToday }}
      accessibilityLabel={item.name}
    >
      {isDark && (
        <LinearGradient
          colors={isDoneToday ? [item.color + '22', item.color + '08'] : [...GRADIENT_DARK_CARD]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Thick colored accent bar */}
      <LinearGradient
        colors={isDoneToday ? [item.color, item.color + 'AA'] : [C.tint, C.tint + '60']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.habitAccent}
      />

      {/* Card content */}
      <View style={[styles.habitBody, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {/* Icon bubble */}
        <View style={[
          styles.habitIconWrap,
          {
            backgroundColor: isDoneToday ? item.color + '22' : item.color + '15',
            borderColor: isDoneToday ? item.color + '45' : item.color + '20',
            borderWidth: 1.5,
          },
        ]}>
          <Ionicons
            name={(item.icon + (isDoneToday ? '' : '-outline')) as React.ComponentProps<typeof Ionicons>['name']}
            size={24}
            color={item.color}
          />
        </View>

        {/* Info */}
        <View style={[styles.habitInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text
            style={[
              styles.habitName,
              {
                color: isDoneToday ? item.color : C.text,
                textAlign: isRTL ? 'right' : 'left',
                textDecorationLine: isDoneToday ? 'line-through' : 'none',
              },
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>

          <View style={[styles.habitMeta, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Streak badge — tappable to open 30-day calendar */}
            <Pressable
              onPress={(e) => { e.stopPropagation?.(); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onShowHistory(); }}
              style={[styles.streakBadge, { backgroundColor: '#F97316' + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={tFunc('completionHistory30')}
            >
              <Ionicons name="flame" size={12} color="#F97316" />
              <Text style={[styles.streakText, { color: '#F97316' }]}>{item.streak_days} {tFunc('days')}</Text>
            </Pressable>

            {/* Frequency badge */}
            {!!freqBadge && (
              <View style={[styles.doneBadge, { backgroundColor: C.tint + '12', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="repeat" size={11} color={C.tint} />
                <Text style={[styles.doneBadgeText, { color: C.tint }]}>{freqBadge}</Text>
              </View>
            )}

            {isDoneToday && (
              <View style={[styles.doneBadge, { backgroundColor: item.color + '15', flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Ionicons name="checkmark-circle" size={12} color={item.color} />
                <Text style={[styles.doneBadgeText, { color: item.color }]}>{tFunc('doneToday')}</Text>
              </View>
            )}
          </View>

          {/* 7-day history dots */}
          {(item.completion_history?.length ?? 0) > 0 && (
            <HistoryDots
              history={item.completion_history ?? []}
              color={item.color}
              isRTL={isRTL}
            />
          )}
        </View>

        {/* Actions */}
        <View style={[styles.habitActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {/* Complete toggle */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onToggle(); }}
            style={({ pressed }) => [
              styles.completeBtn,
              {
                borderColor: isDoneToday ? item.color : C.border,
                overflow: 'hidden',
                opacity: pressed ? 0.75 : 1,
                backgroundColor: isDoneToday ? 'transparent' : C.surface,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={isDoneToday ? tFunc('habitUncompleted') : tFunc('completeHabit')}
          >
            {isDoneToday && (
              <LinearGradient
                colors={[item.color, item.color + 'BB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Ionicons
              name={isDoneToday ? 'checkmark' : 'checkmark-outline'}
              size={18}
              color={isDoneToday ? '#fff' : C.textMuted}
            />
          </Pressable>

          {/* Edit */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onEdit(); }}
            style={({ pressed }) => [
              styles.smallActionBtn,
              { backgroundColor: C.tint + '12', borderColor: C.tint + '28', opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('editHabit')}
          >
            <Ionicons name="pencil-outline" size={13} color={C.tint} />
          </Pressable>

          {/* Delete */}
          <Pressable
            onPress={(e) => { e.stopPropagation?.(); onDelete(); }}
            style={({ pressed }) => [
              styles.smallActionBtn,
              { backgroundColor: C.error + '12', borderColor: C.error + '28', opacity: pressed ? 0.7 : 1 },
            ]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('deleteHabit')}
          >
            <Ionicons name="trash-outline" size={13} color={C.error} />
          </Pressable>
        </View>
      </View>
      <MiniConfetti trigger={confettiKey} x={isRTL ? 18 : 82} y={50} />
    </AnimatedPressable>
  );
}

export default function HabitsScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { from } = useLocalSearchParams<{ from?: string }>();

  const { habits, completeHabit, uncompleteHabit, deleteHabit } = useHabitsStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showForm, setShowForm] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [confirmHabit, setConfirmHabit] = useState<Habit | null>(null);
  const [historyHabit, setHistoryHabit] = useState<Habit | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [celebrationPayload, setCelebrationPayload] = useState<StreakCelebrationPayload | null>(null);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;
  const today = format(new Date(), 'yyyy-MM-dd');

  const doneToday = habits.filter(h => {
    const lastDate = h.last_completed_at ? format(new Date(h.last_completed_at), 'yyyy-MM-dd') : null;
    return lastDate === today;
  }).length;

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const headerColors: [string, string] = isDark
    ? ['#1A1A2E', '#0B0B14']
    : ['#F97316', '#EF4444'];

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Header — Vivid Orange in light, dark in dark */}
      <LinearGradient
        colors={isDark ? [...GRADIENT_DARK_HEADER] : headerColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.md }, isDark && styles.headerDark]}
      >
        {!isDark && <View style={styles.headerDecor1} />}
        {!isDark && <View style={styles.headerDecor2} />}

        <View style={[styles.headerRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <View style={{ width: 46 }} />
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.headerTitle, { textAlign: 'center', color: '#fff' }]}>{tFunc('habits')}</Text>
            <Text style={[styles.headerSub, { textAlign: 'center', color: 'rgba(255,255,255,0.75)' }]}>
              {doneToday}/{habits.length} {tFunc('doneToday')}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              setEditHabit(null);
              setShowForm(true);
            }}
            style={({ pressed }) => [styles.addBtn, { opacity: pressed ? 0.8 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('addHabit')}
          >
            <View style={[styles.addBtnInner, isDark && { backgroundColor: C.surfaceElevated, borderColor: 'rgba(129,140,248,0.2)', borderWidth: 1 }]}>
              <Ionicons name="add" size={26} color={isDark ? C.tintSecondary : '#F97316'} />
            </View>
          </Pressable>
        </View>

        {habits.length > 0 && (
          <View style={[styles.progressWrap, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={[styles.progressTrack, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.25)' }]}>
              <LinearGradient
                colors={isDark ? [C.tint, C.tintSecondary] : ['#fff', 'rgba(255,255,255,0.85)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.round((doneToday / habits.length) * 100)}%`,
                    alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressLabel, { color: isDark ? C.tint : '#fff' }]}>
              {Math.round((doneToday / habits.length) * 100)}%
            </Text>
          </View>
        )}
      </LinearGradient>

      <FlatList
        data={habits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.md }}
        renderItem={({ item }) => {
          const lastDate = item.last_completed_at
            ? format(new Date(item.last_completed_at), 'yyyy-MM-dd')
            : null;
          const isDoneToday = lastDate === today;

          return (
            <SwipeableRow
              isRTL={isRTL}
              onComplete={!isDoneToday ? () => {
                const payload = completeHabit(item.id);
                if (payload) {
                  setCelebrationPayload(payload);
                } else {
                  showToast(tFunc('habitCompleted'), 'success');
                }
              } : undefined}
              onDelete={() => {
                setConfirmHabit(item);
              }}
              completeLabel={tFunc('done')}
              deleteLabel={tFunc('delete')}
            >
              <HabitCard
                item={item}
                isDoneToday={isDoneToday}
                isDark={isDark}
                isRTL={isRTL}
                C={C}
                tFunc={tFunc}
                onToggle={() => {
                  if (isDoneToday) {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    uncompleteHabit(item.id);
                    showToast(tFunc('habitUncompleted'), 'info');
                  } else {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    const payload = completeHabit(item.id);
                    if (payload) {
                      setCelebrationPayload(payload);
                    } else {
                      showToast(tFunc('habitCompleted'), 'success');
                    }
                  }
                }}
                onEdit={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setEditHabit(item);
                  setShowForm(true);
                }}
                onDelete={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  setConfirmHabit(item);
                }}
                onShowHistory={() => setHistoryHabit(item)}
              />
            </SwipeableRow>
          );
        }}
        ListEmptyComponent={() => (
          <EmptyState
            icon="leaf-outline"
            title={tFunc('noHabits')}
            subtitle={tFunc('noHabitsSubtitle')}
            gradient={['#F97316', '#EF4444']}
            actionLabel={tFunc('addHabit')}
            onAction={() => { setEditHabit(null); setShowForm(true); }}
          />
        )}
      />

      <HabitForm
        visible={showForm}
        onClose={() => { setShowForm(false); setEditHabit(null); }}
        editHabit={editHabit}
      />

      <ConfirmDialog
        visible={!!confirmHabit}
        title={tFunc('deleteHabit')}
        message={confirmHabit?.name}
        confirmLabel={tFunc('delete')}
        cancelLabel={tFunc('cancel')}
        type="danger"
        onConfirm={() => {
          if (confirmHabit) {
            deleteHabit(confirmHabit.id);
            showToast(tFunc('habitDeleted'), 'error');
          }
          setConfirmHabit(null);
        }}
        onCancel={() => setConfirmHabit(null)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onHide={() => setToast(null)}
        />
      )}

      <StreakCelebration
        visible={!!celebrationPayload}
        habitName={celebrationPayload?.habitName ?? ''}
        streakDays={celebrationPayload?.streakDays ?? 0}
        lang={lang}
        onDismiss={() => {
          showToast(tFunc('habitCompleted'), 'success');
          setCelebrationPayload(null);
        }}
      />

      <HistoryCalendarModal
        visible={!!historyHabit}
        habit={historyHabit}
        onClose={() => setHistoryHabit(null)}
        lang={lang}
        isRTL={isRTL}
        C={C}
        isDark={isDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(129,140,248,0.08)',
  },
  headerDecor1: {
    position: 'absolute', right: -40, top: -40,
    width: 180, height: 180, borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  headerDecor2: {
    position: 'absolute', left: 20, bottom: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  headerRow: {
    alignItems: 'center', justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 30, fontFamily: F.black },
  headerSub: { fontSize: 13, fontFamily: F.med, marginTop: 2 },
  addBtn: {},
  addBtnInner: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5,
  },
  progressWrap: {
    alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.lg,
  },
  progressTrack: {
    flex: 1, height: 8, borderRadius: 4, overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 4 },
  progressLabel: {
    fontSize: 13, fontFamily: F.black, minWidth: 44, textAlign: 'center',
  },

  habitCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    overflow: 'hidden',
  },
  habitAccent: { width: 5 },
  habitBody: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  habitIconWrap: {
    width: 52, height: 52, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  habitInfo: {
    flex: 1,
    gap: 5,
  },
  habitName: { fontSize: 16, fontFamily: F.bold },
  habitMeta: { alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  streakBadge: {
    alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  streakText: { fontSize: 11, fontFamily: F.bold },
  doneBadge: {
    alignItems: 'center', gap: 3,
    borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 3,
  },
  doneBadgeText: { fontSize: 11, fontFamily: F.bold },

  habitActions: { alignItems: 'center', gap: 6 },
  completeBtn: {
    width: 40, height: 40, borderRadius: 13, borderWidth: 1.5,
    alignItems: 'center', justifyContent: 'center',
  },
  smallActionBtn: {
    width: 28, height: 28, borderRadius: 8, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
});
