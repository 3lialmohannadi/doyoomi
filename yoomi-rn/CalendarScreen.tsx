import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

const DAYS_AR = ['أح', 'إث', 'ثل', 'أر', 'خم', 'جم', 'سب'];
const MARCH_DAYS = 31;
const MARCH_START = 0; // March 2026 starts on Sunday

const EVENTS: Record<number, { color: string }[]> = {
  5:  [{ color: '#6C47FF' }],
  10: [{ color: '#FF6B8A' }, { color: '#4ADE80' }],
  16: [{ color: '#6C47FF' }, { color: '#FB923C' }],
  20: [{ color: '#4ADE80' }],
  25: [{ color: '#FF6B8A' }],
};

const DAY_TASKS = [
  {
    id: 1, title: 'مراجعة العرض التقديمي',
    time: '10:00 ص', cat: 'عمل',
    color: '#F87171', bg: 'rgba(248,113,113,0.12)',
  },
  {
    id: 2, title: 'شراء مستلزمات المنزل',
    time: '05:30 م', cat: 'شخصي',
    color: '#FB923C', bg: 'rgba(251,146,60,0.12)',
  },
];

type ViewMode = 'month' | 'week' | 'day';

export function CalendarScreen({ colorScheme: cs, activeTab = 'calendar', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T    = theme(scheme);
  const dk   = scheme === 'dark';
  const [view, setView]       = useState<ViewMode>('month');
  const [selected, setSelected] = useState(16);

  const cells: (number | null)[] = [
    ...Array(MARCH_START).fill(null),
    ...Array.from({ length: MARCH_DAYS }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black, textAlign: 'right' }}>التقويم</Text>

        {/* View tabs */}
        <View style={[s.tabRow, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          {(['day', 'week', 'month'] as ViewMode[]).map((v) => (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              style={[s.tabBtn, view === v && s.tabBtnActive]}
            >
              <Text style={{ color: '#fff', fontSize: 13, fontFamily: view === v ? F.bold : F.reg }}>
                {v === 'month' ? 'شهر' : v === 'week' ? 'أسبوع' : 'يوم'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* ── Month Nav ── */}
        <View style={[s.monthNav, { borderBottomColor: T.border }]}>
          <TouchableOpacity><ChevronLeft size={20} color={T.muted} /></TouchableOpacity>
          <Text style={{ color: T.text, fontSize: 17, fontFamily: F.black }}>مارس 2026</Text>
          <TouchableOpacity><ChevronRight size={20} color={T.muted} /></TouchableOpacity>
        </View>

        {/* ── Day headers ── */}
        <View style={s.dayHeaders}>
          {DAYS_AR.map((d, i) => (
            <View key={i} style={s.dayHeaderCell}>
              <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.med, textAlign: 'center' }}>{d}</Text>
            </View>
          ))}
        </View>

        {/* ── Calendar grid ── */}
        <View style={[s.grid, { paddingHorizontal: S.lg }]}>
          {cells.map((day, i) => {
            if (!day) return <View key={`e-${i}`} style={s.cell} />;
            const isToday    = day === 16;
            const isSelected = day === selected;
            const dots       = EVENTS[day] ?? [];
            return (
              <TouchableOpacity key={day} style={s.cell} onPress={() => setSelected(day)}>
                {isSelected ? (
                  <LinearGradient colors={GRADIENT_H} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.dayCircle}>
                    <Text style={{ color: '#fff', fontSize: 14, fontFamily: F.black }}>{day}</Text>
                  </LinearGradient>
                ) : (
                  <View style={[s.dayCircle, isToday && { borderWidth: 2, borderColor: PRIMARY }]}>
                    <Text style={{ color: isToday ? PRIMARY : T.text, fontSize: 14, fontFamily: isToday ? F.black : F.reg }}>
                      {day}
                    </Text>
                  </View>
                )}
                {dots.length > 0 && (
                  <View style={{ flexDirection: 'row', gap: 2, marginTop: 2 }}>
                    {dots.slice(0, 2).map((d, di) => (
                      <View key={di} style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: d.color }} />
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Selected day tasks ── */}
        <View style={{ paddingHorizontal: S.xl, marginTop: S.xl }}>
          <Text style={{ color: T.text, fontSize: 16, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>
            مهام {selected} مارس
          </Text>
          <View style={{ gap: 10 }}>
            {DAY_TASKS.map((t) => (
              <View key={t.id} style={[s.taskCard, { backgroundColor: T.card, borderColor: T.border, borderRightWidth: 4, borderRightColor: t.color }, cardShadow]}>
                <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>{t.title}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={[s.badge, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                      <Text style={{ color: PRIMARY, fontSize: 10, fontFamily: F.med }}>{t.cat}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{t.time}</Text>
                      <Clock size={11} color={T.muted} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomNav active={activeTab} onPress={onTabPress} colorScheme={scheme} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop:        56,
    paddingBottom:     24,
    paddingHorizontal: 24,
    borderBottomLeftRadius:  32,
    borderBottomRightRadius: 32,
    gap: 14,
  },
  tabRow: {
    flexDirection: 'row', borderRadius: R.full,
    padding: 4, alignSelf: 'flex-end',
  },
  tabBtn:       { paddingHorizontal: 16, paddingVertical: 7, borderRadius: R.full },
  tabBtnActive: { backgroundColor: 'rgba(255,255,255,0.28)' },
  monthNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: S.xl, paddingVertical: S.md,
    borderBottomWidth: 1,
  },
  dayHeaders: {
    flexDirection: 'row', paddingHorizontal: S.lg, paddingVertical: S.sm,
  },
  dayHeaderCell: { flex: 1, alignItems: 'center' },
  grid:  { flexDirection: 'row', flexWrap: 'wrap' },
  cell:  { width: '14.28%', alignItems: 'center', paddingVertical: 4 },
  dayCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  taskCard: {
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full },
});
