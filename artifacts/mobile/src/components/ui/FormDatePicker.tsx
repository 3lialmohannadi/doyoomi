import React, { useState, useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  parseISO, getDaysInMonth, getDay, startOfMonth,
  addMonths, subMonths, addYears, subYears, format,
} from 'date-fns';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing, F, ColorScheme } from '../../theme';
import { getTodayString, formatDateKey } from '../../utils/date';

const AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const AR_DAYS_SUN = ['أح','إث','ثل','أر','خم','جم','سب'];
const AR_DAYS_MON = ['إث','ثل','أر','خم','جم','سب','أح'];
const EN_DAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const EN_DAYS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

interface FormDatePickerProps {
  selected: string;
  onSelect: (date: string) => void;
  C: ColorScheme;
  lang: 'en' | 'ar';
  startOfWeek?: 'sunday' | 'monday';
}

export function FormDatePicker({ selected, onSelect, C, lang, startOfWeek = 'sunday' }: FormDatePickerProps) {
  const [viewDate, setViewDate] = useState(() => selected ? parseISO(selected) : new Date());
  const isRTL = lang === 'ar';

  const weekStart = startOfWeek === 'sunday' ? 0 : 1;

  const arHeadersBase = startOfWeek === 'sunday' ? AR_DAYS_SUN : AR_DAYS_MON;
  const enHeaders = startOfWeek === 'sunday' ? EN_DAYS_SUN : EN_DAYS_MON;
  const dayHeaders = isRTL ? [...arHeadersBase].reverse() : enHeaders;

  const daysInMonth = getDaysInMonth(viewDate);
  const firstDaySunday = getDay(startOfMonth(viewDate));
  const offset = (firstDaySunday - weekStart + 7) % 7;
  const today = getTodayString();

  const monthLabel = isRTL ? AR_MONTHS[viewDate.getMonth()] : format(viewDate, 'MMMM');
  const yearLabel = format(viewDate, 'yyyy');

  const ltrCells: (string | null)[] = useMemo(() => {
    const c: (string | null)[] = [
      ...Array(offset).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
        return formatDateKey(d);
      }),
    ];
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [viewDate, offset, daysInMonth]);

  const cells: (string | null)[] = useMemo(() => {
    if (!isRTL) return ltrCells;
    const rows: (string | null)[][] = [];
    for (let i = 0; i < ltrCells.length; i += 7) {
      rows.push([...ltrCells.slice(i, i + 7)].reverse());
    }
    return rows.flat();
  }, [ltrCells, isRTL]);

  const prevYear = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? addYears(viewDate, 1) : subYears(viewDate, 1)); };
  const nextYear = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? subYears(viewDate, 1) : addYears(viewDate, 1)); };
  const prevMonth = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? addMonths(viewDate, 1) : subMonths(viewDate, 1)); };
  const nextMonth = () => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? subMonths(viewDate, 1) : addMonths(viewDate, 1)); };

  return (
    <View style={[fpStyles.container, { backgroundColor: C.surface, borderColor: C.border }]}>

      {/* ── Year row ── */}
      <View style={[fpStyles.yearNav, isRTL && { flexDirection: 'row-reverse' }]}>
        <Pressable onPress={prevYear} style={[fpStyles.yearNavBtn, { backgroundColor: C.tint + '18' }]} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={14} color={C.tint} />
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={14} color={C.tint} style={{ marginLeft: -8 }} />
        </Pressable>
        <Text style={[fpStyles.yearLabel, { color: C.tint }]}>{yearLabel}</Text>
        <Pressable onPress={nextYear} style={[fpStyles.yearNavBtn, { backgroundColor: C.tint + '18' }]} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={C.tint} />
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={C.tint} style={{ marginLeft: -8 }} />
        </Pressable>
      </View>

      {/* ── Month row ── */}
      <View style={[fpStyles.monthNav, isRTL && { flexDirection: 'row-reverse' }]}>
        <Pressable onPress={prevMonth} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color={C.tint} />
        </Pressable>
        <Text style={[fpStyles.monthLabel, { color: C.text }]}>{monthLabel}</Text>
        <Pressable onPress={nextMonth} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={C.tint} />
        </Pressable>
      </View>

      {/* ── Day headers ── */}
      <View style={fpStyles.headerRow}>
        {dayHeaders.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={[fpStyles.headerDay, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>

      {/* ── Day grid ── */}
      <View style={fpStyles.grid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={'e-' + i} style={fpStyles.cell} />;
          const isSelected = dayKey === selected;
          const isToday = dayKey === today;
          const day = parseISO(dayKey).getDate();
          return (
            <Pressable
              key={dayKey}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(dayKey); }}
              style={fpStyles.cell}
            >
              <View style={[
                fpStyles.dayCircle,
                isSelected && { backgroundColor: C.tint },
                isToday && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
              ]}>
                <Text style={[
                  fpStyles.dayText,
                  { color: isSelected ? '#fff' : isToday ? C.tint : C.text },
                  isToday && !isSelected && { fontFamily: F.bold },
                ]}>
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

    </View>
  );
}

const fpStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  yearNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  yearNavBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  yearLabel: { fontSize: 15, fontFamily: F.bold },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  monthLabel: { fontSize: 14, fontFamily: F.med },
  headerRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  headerDay: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: F.med },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 13, fontFamily: F.med },
});
