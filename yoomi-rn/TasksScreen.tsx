import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Filter, Clock, ChevronDown } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

const TASKS_TODAY = [
  {
    id: 1, title: 'مراجعة العرض التقديمي',
    sub: 'تجهيز العرض لاجتماع مجلس الإدارة',
    time: '10:00 ص', cat: 'عمل',
    priority: 'عالية', pColor: '#F87171', pBg: 'rgba(248,113,113,0.12)',
  },
  {
    id: 2, title: 'شراء مستلزمات المنزل',
    sub: 'حليب، بيض، خُضر، فواكه',
    time: '05:30 م', cat: 'شخصي',
    priority: 'متوسطة', pColor: '#FB923C', pBg: 'rgba(251,146,60,0.12)',
  },
  {
    id: 3, title: 'تمرين رياضي',
    sub: 'صالة الألعاب الرياضية – 45 دقيقة',
    time: '07:00 م', cat: 'صحة',
    priority: 'منخفضة', pColor: '#4ADE80', pBg: 'rgba(74,222,128,0.12)',
  },
];

const TASKS_TOMORROW = [
  {
    id: 4, title: 'اجتماع الفريق',
    sub: 'مناقشة خطة الربع القادم',
    time: '09:00 ص', cat: 'عمل',
    priority: 'عالية', pColor: '#F87171', pBg: 'rgba(248,113,113,0.12)',
  },
];

export function TasksScreen({ colorScheme: cs, activeTab = 'tasks', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (id: number) => setChecked(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const renderTask = (task: typeof TASKS_TODAY[0]) => {
    const done = checked.includes(task.id);
    return (
      <View key={task.id} style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
        <TouchableOpacity
          style={[s.circle, { borderColor: done ? '#4ADE80' : (dk ? 'rgba(255,255,255,0.2)' : '#D0C9FF') }]}
          onPress={() => toggle(task.id)}
        >
          {done && <Text style={{ color: '#4ADE80', fontSize: 13, fontFamily: F.bold }}>✓</Text>}
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
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={s.headerRow}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={s.iconBtn}>
              <Filter size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={s.iconBtn}>
              <Plus size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>المهام</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: F.reg }}>
              لديك {TASKS_TODAY.length} مهام متبقية اليوم
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 20, paddingBottom: 100 }}>

        {/* Today */}
        <View>
          <View style={s.groupHeader}>
            <View style={[s.badge, { backgroundColor: dk ? 'rgba(108,71,255,0.22)' : '#EDE9FF' }]}>
              <Text style={{ color: PRIMARY, fontSize: 11, fontFamily: F.med }}>{TASKS_TODAY.length} مهام</Text>
            </View>
            <Text style={[s.groupTitle, { color: T.text }]}>اليوم</Text>
          </View>
          <View style={{ gap: 10, marginTop: S.md }}>
            {TASKS_TODAY.map(renderTask)}
          </View>
        </View>

        {/* Tomorrow */}
        <View>
          <View style={s.groupHeader}>
            <View style={[s.badge, { backgroundColor: dk ? 'rgba(255,255,255,0.08)' : '#F0EDFF' }]}>
              <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.med }}>{TASKS_TOMORROW.length} مهام</Text>
            </View>
            <Text style={[s.groupTitle, { color: T.text }]}>غداً</Text>
          </View>
          <View style={{ gap: 10, marginTop: S.md }}>
            {TASKS_TOMORROW.map(renderTask)}
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
    paddingBottom:     28,
    paddingHorizontal: 24,
    borderBottomLeftRadius:  32,
    borderBottomRightRadius: 32,
  },
  headerRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  groupTitle:  { fontSize: 17, fontFamily: F.black },
  card: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  circle: {
    width: 26, height: 26, borderRadius: 13, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full },
});
