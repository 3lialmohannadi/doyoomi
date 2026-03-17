/**
 * DatePickerModal — منتقي التاريخ
 *
 * Usage:
 *   <DatePickerModal
 *     visible={showPicker}
 *     value={selectedDate}
 *     onSelect={(date) => { setDate(date); setShowPicker(false); }}
 *     onDismiss={() => setShowPicker(false)}
 *   />
 */

import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, Modal,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react-native';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  visible:       boolean;
  value?:        Date;
  onSelect?:     (date: Date) => void;
  onDismiss?:    () => void;
  colorScheme?:  ColorScheme;
}

const DAYS_AR   = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
const MONTHS_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function firstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const QUICK = [
  { label: 'اليوم',   offset: 0  },
  { label: 'غداً',    offset: 1  },
  { label: 'الأسبوع القادم', offset: 7 },
  { label: 'الشهر القادم',   offset: 30 },
];

export function DatePickerModal({ visible, value, onSelect, onDismiss, colorScheme: cs }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';

  const today     = new Date();
  const initDate  = value ?? today;
  const [viewYear,  setViewYear]  = useState(initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate.getMonth());
  const [selected,  setSelected]  = useState<Date>(initDate);
  const [yearMode,  setYearMode]  = useState(false);

  const totalDays  = daysInMonth(viewYear, viewMonth);
  const startDay   = firstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(startDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };
  const selectDay = (day: number) => {
    setSelected(new Date(viewYear, viewMonth, day));
  };
  const confirm = () => {
    onSelect?.(selected);
  };

  const isSelectedDay = (day: number) =>
    selected.getDate() === day &&
    selected.getMonth() === viewMonth &&
    selected.getFullYear() === viewYear;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const YEARS = Array.from({ length: 15 }, (_, i) => 2020 + i);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onDismiss} />
      <View style={[s.sheet, { backgroundColor: T.card }]}>

        {/* Handle */}
        <View style={[s.handle, { backgroundColor: T.border }]} />

        {/* Header */}
        <View style={s.headerRow}>
          <TouchableOpacity onPress={onDismiss} style={[s.iconBtn, { backgroundColor: dk ? 'rgba(255,255,255,0.08)' : '#F0EDFF' }]}>
            <X size={16} color={T.muted} />
          </TouchableOpacity>
          <Text style={{ color: T.text, fontSize: 16, fontFamily: F.black }}>اختر التاريخ</Text>
        </View>

        {/* Quick pills */}
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end', paddingHorizontal: S.xl, paddingBottom: S.md }}>
          {QUICK.map((q) => {
            const d = new Date(today); d.setDate(d.getDate() + q.offset);
            const isActive = selected.toDateString() === d.toDateString();
            return (
              <TouchableOpacity
                key={q.label}
                onPress={() => { setSelected(d); setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }}
                style={[
                  s.pill,
                  isActive
                    ? { backgroundColor: PRIMARY }
                    : { backgroundColor: dk ? 'rgba(255,255,255,0.08)' : '#EDE9FF', borderColor: T.border, borderWidth: 1 },
                ]}
              >
                <Text style={{ color: isActive ? '#fff' : T.muted, fontSize: 12, fontFamily: F.med }}>{q.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {yearMode ? (
          // ── Year grid ──
          <View style={{ paddingHorizontal: S.xl }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {YEARS.map((yr) => {
                const isSel = yr === viewYear;
                return (
                  <TouchableOpacity key={yr} onPress={() => { setViewYear(yr); setYearMode(false); }}
                    style={[s.yearChip, isSel ? { backgroundColor: PRIMARY } : { backgroundColor: dk ? T.card2 : '#EDE9FF', borderColor: T.border, borderWidth: 1 }]}
                  >
                    <Text style={{ color: isSel ? '#fff' : T.text, fontSize: 14, fontFamily: F.numBold }}>{yr}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          // ── Month calendar ──
          <View style={{ paddingHorizontal: S.xl }}>
            {/* Month nav */}
            <View style={s.monthNav}>
              <TouchableOpacity onPress={nextMonth}><ChevronLeft size={20} color={T.muted} /></TouchableOpacity>
              <TouchableOpacity onPress={() => setYearMode(true)} style={[s.yearBtn, { backgroundColor: dk ? T.card2 : '#EDE9FF' }]}>
                <Text style={{ color: PRIMARY, fontSize: 15, fontFamily: F.black }}>
                  {MONTHS_AR[viewMonth]} {viewYear} ▾
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={prevMonth}><ChevronRight size={20} color={T.muted} /></TouchableOpacity>
            </View>

            {/* Day labels */}
            <View style={{ flexDirection: 'row', marginBottom: S.sm }}>
              {DAYS_AR.map((d) => (
                <Text key={d} style={{ flex: 1, textAlign: 'center', color: T.muted, fontSize: 11, fontFamily: F.med }}>{d}</Text>
              ))}
            </View>

            {/* Grid */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {cells.map((day, i) => {
                if (!day) return <View key={`e-${i}`} style={s.cell} />;
                const sel   = isSelectedDay(day);
                const tod   = isToday(day);
                return (
                  <TouchableOpacity key={day} style={s.cell} onPress={() => selectDay(day)}>
                    {sel ? (
                      <LinearGradient colors={GRADIENT_H} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.circle}>
                        <Text style={{ color: '#fff', fontSize: 13, fontFamily: F.black }}>{day}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={[s.circle, tod && { borderWidth: 2, borderColor: PRIMARY }]}>
                        <Text style={{ color: tod ? PRIMARY : T.text, fontSize: 13, fontFamily: tod ? F.black : F.reg }}>{day}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Selected badge + Confirm */}
        <View style={[s.footer, { borderTopColor: T.border }]}>
          <View style={[s.selectedBadge, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
            <Text style={{ color: PRIMARY, fontSize: 13, fontFamily: F.black }}>
              {selected.getDate()} {MONTHS_AR[selected.getMonth()]} {selected.getFullYear()}
            </Text>
          </View>
          <TouchableOpacity onPress={confirm} style={{ flex: 1 }}>
            <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={s.confirmBtn}>
              <Check size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 15, fontFamily: F.black }}>تأكيد</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    borderTopLeftRadius:  32,
    borderTopRightRadius: 32,
    paddingTop: S.lg,
    paddingBottom: 32,
    gap: S.md,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    alignSelf: 'center', marginBottom: S.sm,
  },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: S.xl, paddingBottom: S.sm,
  },
  iconBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.full,
  },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: S.md,
  },
  yearBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: R.full,
  },
  cell: {
    width: '14.28%', height: 44, alignItems: 'center', justifyContent: 'center',
  },
  circle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  yearChip: {
    width: '22%', paddingVertical: 10,
    borderRadius: R.md, alignItems: 'center',
  },
  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: S.xl, paddingTop: S.md, borderTopWidth: 1,
  },
  selectedBadge: {
    paddingHorizontal: 14, paddingVertical: 12, borderRadius: R.md,
  },
  confirmBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 13, borderRadius: R.full,
  },
});
