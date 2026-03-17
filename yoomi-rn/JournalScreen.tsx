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
  onEntryPress?: (id: number) => void;
}

const ENTRIES = [
  {
    group: 'اليوم',
    items: [
      {
        id: 1, date: 'الإثنين، 16 مارس 2026', time: '10:30 ص',
        title: 'يوم مثمر وهادئ',
        preview: 'استيقظت مبكراً اليوم وأنجزت معظم مهامي...',
        mood: 'سعيد 😊', moodColor: '#4ADE80', moodBg: 'rgba(74,222,128,0.12)',
        words: 245,
      },
    ],
  },
  {
    group: 'أمس',
    items: [
      {
        id: 2, date: 'الأحد، 15 مارس 2026', time: '09:15 م',
        title: 'تحديات وتعلم جديد',
        preview: 'واجهت بعض الصعوبات في العمل لكنني تعلمت...',
        mood: 'محايد 😐', moodColor: '#60A5FA', moodBg: 'rgba(96,165,250,0.12)',
        words: 182,
      },
    ],
  },
  {
    group: 'السبت',
    items: [
      {
        id: 3, date: 'السبت، 14 مارس 2026', time: '08:45 م',
        title: 'عطلة نهاية الأسبوع',
        preview: 'قضيت وقتاً رائعاً مع العائلة في نزهة...',
        mood: 'سعيد جداً 🤩', moodColor: '#FB923C', moodBg: 'rgba(251,146,60,0.12)',
        words: 310,
      },
      {
        id: 4, date: 'السبت، 14 مارس 2026', time: '11:00 ص',
        title: 'أفكار الصباح',
        preview: 'في الصباح الباكر، جلست مع فنجان القهوة...',
        mood: 'هادئ 😌', moodColor: '#A78BFA', moodBg: 'rgba(167,139,250,0.12)',
        words: 130,
      },
    ],
  },
];

export function JournalScreen({ colorScheme: cs, activeTab = 'home', onTabPress, onEntryPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';
  const totalEntries = ENTRIES.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={s.headerRow}>
          <TouchableOpacity style={s.iconBtn}>
            <Plus size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>مذكراتي</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={[s.statsRow, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          {[
            { label: 'تسلسل',  value: '7',           emoji: '🔥' },
            { label: 'هذا الشهر', value: '12',        emoji: '📅' },
            { label: 'الإجمالي', value: `${totalEntries}`, emoji: '📝' },
          ].map((st, i) => (
            <View key={i} style={s.statItem}>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: F.numBold }}>{st.emoji} {st.value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11, fontFamily: F.reg }}>{st.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 20, paddingBottom: 100 }}>
        {ENTRIES.map((group) => (
          <View key={group.group}>
            <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.med, textAlign: 'right', marginBottom: S.md }}>
              {group.group}
            </Text>
            <View style={{ gap: 10 }}>
              {group.items.map((entry) => (
                <TouchableOpacity key={entry.id} activeOpacity={0.8}
                  onPress={() => onEntryPress?.(entry.id)}
                  style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <ChevronLeft size={16} color={T.muted} />
                    <View style={{ alignItems: 'flex-end', flex: 1, gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={{ color: T.text, fontSize: 15, fontFamily: F.bold }}>{entry.title}</Text>
                        <View style={[s.badge, { backgroundColor: entry.moodBg }]}>
                          <Text style={{ color: entry.moodColor, fontSize: 11, fontFamily: F.med }}>{entry.mood}</Text>
                        </View>
                      </View>
                      <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.reg, textAlign: 'right' }} numberOfLines={2}>
                        {entry.preview}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        <View style={[s.badge, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                          <Text style={{ color: PRIMARY, fontSize: 10, fontFamily: F.med }}>{entry.words} كلمة</Text>
                        </View>
                        <Text style={{ color: T.dim, fontSize: 11, fontFamily: F.reg }}>{entry.time} • {entry.date}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
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
  headerRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row', borderRadius: R.lg,
    padding: 12, marginTop: 16,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 2 },
  card: {
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: R.full },
});
