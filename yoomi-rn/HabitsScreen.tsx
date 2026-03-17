import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CheckCircle } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

const HABITS = [
  { id: 1, emoji: '💊', title: 'اخذ الادوية',    streak: 1,  doneToday: true,  target: 1,  progress: 1  },
  { id: 2, emoji: '💧', title: 'شرب الماء',       streak: 3,  doneToday: false, target: 8,  progress: 3  },
  { id: 3, emoji: '🥾', title: 'المشي 30 دقيقة', streak: 7,  doneToday: false, target: 1,  progress: 0  },
  { id: 4, emoji: '📖', title: 'القراءة',          streak: 14, doneToday: false, target: 20, progress: 12 },
  { id: 5, emoji: '🧘', title: 'التأمل',           streak: 5,  doneToday: false, target: 1,  progress: 0  },
];

export function HabitsScreen({ colorScheme: cs, activeTab = 'home', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';
  const [done, setDone] = useState<number[]>([1]);
  const completedCount = done.length;
  const total = HABITS.length;
  const pct = Math.round((completedCount / total) * 100);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity style={s.iconBtn}>
            <Plus size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>العادات</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: F.reg }}>
              {completedCount}/{total} أنجزت اليوم
            </Text>
          </View>
        </View>

        {/* Progress bar */}
        <View style={{ marginTop: 16, gap: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: F.med }}>{pct}%</Text>
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: F.med }}>التقدم اليومي</Text>
          </View>
          <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ width: `${pct}%`, height: '100%', backgroundColor: '#fff', borderRadius: 4 }} />
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 12, paddingBottom: 100 }}>
        {HABITS.map((h) => {
          const isDone = done.includes(h.id);
          const progress = isDone ? h.target : h.progress;
          const pctHabit = Math.round((progress / h.target) * 100);
          return (
            <View key={h.id} style={[s.card, { backgroundColor: T.card, borderColor: isDone ? 'rgba(74,222,128,0.4)' : T.border }, cardShadow]}>
              {/* Left: complete button */}
              <TouchableOpacity
                style={[s.checkBtn, isDone && s.checkBtnDone]}
                onPress={() => setDone(p => isDone ? p.filter(x => x !== h.id) : [...p, h.id])}
              >
                {isDone
                  ? <CheckCircle size={22} color="#fff" fill="#4ADE80" />
                  : <CheckCircle size={22} color={dk ? 'rgba(255,255,255,0.25)' : '#D0C9FF'} />
                }
              </TouchableOpacity>

              {/* Content */}
              <View style={{ flex: 1, alignItems: 'flex-end', gap: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <Text style={{ color: T.text, fontSize: 15, fontFamily: F.bold }}>{h.title}</Text>
                  <Text style={{ fontSize: 24 }}>{h.emoji}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                  <View style={[s.badge, { backgroundColor: 'rgba(251,146,60,0.15)' }]}>
                    <Text style={{ color: '#FB923C', fontSize: 10, fontFamily: F.med }}>🔥 {h.streak} أيام</Text>
                  </View>
                  {h.target > 1 && (
                    <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{progress}/{h.target}</Text>
                  )}
                </View>
                {h.target > 1 && (
                  <View style={{ width: '100%', height: 5, backgroundColor: dk ? 'rgba(255,255,255,0.1)' : '#EDE9FF', borderRadius: 3, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={GRADIENT_H}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ width: `${pctHabit}%`, height: '100%', borderRadius: 3 }}
                    />
                  </View>
                )}
              </View>
            </View>
          );
        })}
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
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: R.lg, borderWidth: 1,
  },
  checkBtn:     { padding: 4 },
  checkBtnDone: { padding: 4 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full },
});
