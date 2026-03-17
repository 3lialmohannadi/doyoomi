import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Clock, CheckSquare } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, SECONDARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

const DAYS = [
  { day: 'السبت',    date: '14' },
  { day: 'الأحد',    date: '15' },
  { day: 'الإثنين',  date: '16', active: true },
  { day: 'الثلاثاء', date: '17' },
  { day: 'الأربعاء', date: '18' },
  { day: 'الخميس',   date: '19' },
];

const STATS = [
  { label: 'مكتمل',       value: '0', emoji: '✓', color: '#4ADE80', bg: 'rgba(74,222,128,0.18)'  },
  { label: 'متأخر',        value: '0', emoji: '!', color: '#F87171', bg: 'rgba(248,113,113,0.18)' },
  { label: 'هذا الأسبوع', value: '2', emoji: '📅', color: '#60A5FA', bg: 'rgba(96,165,250,0.18)'  },
  { label: 'التسلسل',      value: '0', emoji: '🔥', color: '#FB923C', bg: 'rgba(251,146,60,0.18)'  },
];

const TASKS = [
  {
    id: 1, title: 'مراجعة العرض التقديمي',
    sub: 'تجهيز العرض لاجتماع مجلس الإدارة غداً',
    time: '10:00 ص', cat: 'عمل',
    priority: 'عالية', pColor: '#F87171', pBg: 'rgba(248,113,113,0.12)',
  },
  {
    id: 2, title: 'شراء مستلزمات المنزل',
    sub: 'حليب، بيض، خُضر، فواكه',
    time: '05:30 م', cat: 'شخصي',
    priority: 'متوسطة', pColor: '#FB923C', pBg: 'rgba(251,146,60,0.12)',
  },
];

const HABITS = [
  { id: 1, emoji: '💊', title: 'اخذ الادوية',    streak: 1, done: true  },
  { id: 2, emoji: '💧', title: 'شرب الماء',       streak: 3, done: false },
  { id: 3, emoji: '🥾', title: 'المشي 30 دقيقة', streak: 7, done: false },
];

export function HomeScreen({ colorScheme: cs, activeTab = 'home', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';
  const [checked, setChecked] = useState<number[]>([]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* ── Header ─────────────────────────────────────── */}
        <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
          <View style={s.headerRow}>
            <View style={s.avatar}>
              <Text style={{ color: PRIMARY, fontFamily: F.black, fontSize: 16 }}>ع</Text>
            </View>
            <View style={{ alignItems: 'flex-end', flex: 1 }}>
              <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: F.reg }}>مساء الخير، 👋</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: F.black }}>علي محمد</Text>
            </View>
          </View>

          {/* Stats card */}
          <View style={[s.statsCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
            {STATS.map((st, i) => (
              <View key={i} style={s.statItem}>
                <View style={[s.statIcon, { backgroundColor: st.bg }]}>
                  <Text style={{ fontSize: 11 }}>{st.emoji}</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: F.numBold }}>{st.value}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 10, fontFamily: F.reg, textAlign: 'center' }}>{st.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* ── Date Strip ─────────────────────────────────── */}
        <View style={{ marginTop: S.xl, paddingHorizontal: S.xl }}>
          <Text style={[s.secTitle, { color: T.text }]}>مارس 2026</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: S.md }} contentContainerStyle={{ gap: 10 }}>
            {DAYS.map((d, i) =>
              d.active ? (
                <LinearGradient key={i} colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.dayActive}>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11, fontFamily: F.med }}>{d.day}</Text>
                  <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>{d.date}</Text>
                  <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.7)', marginTop: 2 }} />
                </LinearGradient>
              ) : (
                <View key={i} style={[s.dayInactive, { backgroundColor: T.card, borderColor: T.border }]}>
                  <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.med }}>{d.day}</Text>
                  <Text style={{ color: T.text, fontSize: 22, fontFamily: F.black }}>{d.date}</Text>
                </View>
              )
            )}
          </ScrollView>
        </View>

        {/* ── Today's Tasks ───────────────────────────────── */}
        <View style={{ marginTop: S.xl, paddingHorizontal: S.xl }}>
          <View style={s.secHeader}>
            <TouchableOpacity style={[s.addBtn, { backgroundColor: dk ? 'rgba(108,71,255,0.22)' : '#EDE9FF' }]}>
              <Plus size={14} color={PRIMARY} />
              <Text style={{ color: PRIMARY, fontSize: 12, fontFamily: F.bold }}>إضافة</Text>
            </TouchableOpacity>
            <Text style={[s.secTitle, { color: T.text }]}>اليوم</Text>
          </View>

          <View style={{ gap: 10, marginTop: S.md }}>
            {TASKS.map((task) => {
              const done = checked.includes(task.id);
              return (
                <View key={task.id} style={[s.taskCard, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
                  <TouchableOpacity
                    style={[s.circle, { borderColor: done ? '#4ADE80' : (dk ? 'rgba(255,255,255,0.2)' : '#D0C9FF') }]}
                    onPress={() => setChecked(p => done ? p.filter(x => x !== task.id) : [...p, task.id])}
                  >
                    {done && <Text style={{ color: '#4ADE80', fontSize: 14 }}>✓</Text>}
                  </TouchableOpacity>
                  <View style={{ flex: 1, alignItems: 'flex-end', gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                      <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold, textDecorationLine: done ? 'line-through' : 'none' }}>
                        {task.title}
                      </Text>
                      <View style={[s.badge, { backgroundColor: task.pBg }]}>
                        <Text style={{ color: task.pColor, fontSize: 10, fontFamily: F.med }}>{task.priority}</Text>
                      </View>
                    </View>
                    <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.reg, textAlign: 'right' }}>{task.sub}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                      <View style={[s.badge, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                        <Text style={{ color: PRIMARY, fontSize: 10, fontFamily: F.med }}>{task.cat}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                        <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{task.time}</Text>
                        <Clock size={11} color={T.muted} />
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Habits ──────────────────────────────────────── */}
        <View style={{ marginTop: S.xl, paddingHorizontal: S.xl }}>
          <Text style={[s.secTitle, { color: T.text, marginBottom: S.md }]}>العادات</Text>
          <View style={{ gap: 10 }}>
            {HABITS.map((h) => (
              <View key={h.id} style={[s.habitCard, { backgroundColor: T.card, borderColor: h.done ? 'rgba(74,222,128,0.4)' : T.border }, cardShadow]}>
                <TouchableOpacity style={[s.habitCheck, { borderColor: h.done ? '#4ADE80' : (dk ? 'rgba(255,255,255,0.2)' : '#D0C9FF'), backgroundColor: h.done ? '#4ADE80' : 'transparent' }]}>
                  {h.done && <CheckSquare size={14} color="#fff" />}
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>{h.title}</Text>
                  <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.reg, marginTop: 2 }}>تسلسل {h.streak} أيام 🔥</Text>
                </View>
                <Text style={{ fontSize: 26, marginLeft: S.sm }}>{h.emoji}</Text>
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
  },
  headerRow:    { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  statsCard: {
    flexDirection: 'row', borderRadius: 20,
    padding: 14, marginTop: 18, gap: 8,
  },
  statItem:  { flex: 1, alignItems: 'center', gap: 4 },
  statIcon:  { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  secTitle:  { fontSize: 17, fontFamily: F.black, textAlign: 'right' },
  secHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: R.full,
  },
  dayActive: {
    width: 62, height: 84, borderRadius: R.lg,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  dayInactive: {
    width: 62, height: 84, borderRadius: R.lg, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center', gap: 2,
  },
  taskCard: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  circle: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full,
  },
  habitCard: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  habitCheck: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center',
  },
});
