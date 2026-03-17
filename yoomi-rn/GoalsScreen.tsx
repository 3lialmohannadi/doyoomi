import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, ChevronLeft } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

const GOALS = [
  {
    id: 1, emoji: '💪', title: 'تحسين اللياقة البدنية',
    cat: 'صحة', completed: 3, target: 10,
    color: '#4ADE80', bg: 'rgba(74,222,128,0.12)',
  },
  {
    id: 2, emoji: '📚', title: 'قراءة 12 كتاباً هذا العام',
    cat: 'تطوير ذاتي', completed: 4, target: 12,
    color: '#60A5FA', bg: 'rgba(96,165,250,0.12)',
  },
  {
    id: 3, emoji: '💰', title: 'ادخار 20,000 ريال',
    cat: 'مالي', completed: 8, target: 20,
    color: '#FB923C', bg: 'rgba(251,146,60,0.12)',
  },
  {
    id: 4, emoji: '🗣️', title: 'تعلم اللغة الإنجليزية',
    cat: 'تعليم', completed: 6, target: 15,
    color: '#A78BFA', bg: 'rgba(167,139,250,0.12)',
  },
];

export function GoalsScreen({ colorScheme: cs, activeTab = 'home', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity style={s.iconBtn}>
            <Plus size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>الأهداف</Text>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: F.reg }}>
              {GOALS.length} أهداف نشطة
            </Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 14, paddingBottom: 100 }}>
        {GOALS.map((goal) => {
          const pct = Math.round((goal.completed / goal.target) * 100);
          return (
            <TouchableOpacity key={goal.id} activeOpacity={0.8}
              style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Arrow */}
                <ChevronLeft size={18} color={T.muted} />

                {/* Right side */}
                <View style={{ alignItems: 'flex-end', flex: 1, gap: 6 }}>
                  {/* Emoji + title */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: T.text, fontSize: 15, fontFamily: F.bold }}>{goal.title}</Text>
                    <View style={[s.emojiBox, { backgroundColor: goal.bg }]}>
                      <Text style={{ fontSize: 18 }}>{goal.emoji}</Text>
                    </View>
                  </View>

                  {/* Category + count */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.reg }}>
                      {goal.completed}/{goal.target} مكتمل
                    </Text>
                    <View style={[s.badge, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                      <Text style={{ color: PRIMARY, fontSize: 10, fontFamily: F.med }}>{goal.cat}</Text>
                    </View>
                  </View>

                  {/* Progress bar */}
                  <View style={{ width: '100%', height: 7, backgroundColor: dk ? 'rgba(255,255,255,0.1)' : '#EDE9FF', borderRadius: 4, overflow: 'hidden' }}>
                    <LinearGradient
                      colors={GRADIENT_H}
                      start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                      style={{ width: `${pct}%`, height: '100%', borderRadius: 4 }}
                    />
                  </View>
                  <Text style={{ color: goal.color, fontSize: 12, fontFamily: F.numBold }}>{pct}%</Text>
                </View>
              </View>
            </TouchableOpacity>
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
    paddingBottom:     28,
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
    padding: 16, borderRadius: R.lg, borderWidth: 1,
  },
  emojiBox: {
    width: 40, height: 40, borderRadius: R.md,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full },
});
