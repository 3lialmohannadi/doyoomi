import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CheckSquare, Target, Flame, Settings } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
}

type NotifRow = { key: string; label: string; sub: string };

const SECTIONS = [
  {
    title: 'تذكيرات المهام',
    icon:  CheckSquare,
    color: '#6C47FF',
    bg:    'rgba(108,71,255,0.15)',
    masterKey: 'tasks',
    rows: [
      { key: 'tasks_due',    label: 'المهام المستحقة',       sub: 'قبل ساعة من الموعد'    },
      { key: 'tasks_late',   label: 'المهام المتأخرة',       sub: 'عند تأخر المهمة'        },
      { key: 'tasks_daily',  label: 'ملخص يومي للمهام',     sub: 'كل يوم الساعة 8 صباحاً' },
    ] as NotifRow[],
  },
  {
    title: 'تذكيرات العادات',
    icon:  Flame,
    color: '#FB923C',
    bg:    'rgba(251,146,60,0.15)',
    masterKey: 'habits',
    rows: [
      { key: 'habits_remind', label: 'تذكير العادة',         sub: 'في وقت العادة المحدد'  },
      { key: 'habits_streak', label: 'تحذير انقطاع التسلسل', sub: 'عند خطر فقدان التسلسل' },
    ] as NotifRow[],
  },
  {
    title: 'تذكيرات الأهداف',
    icon:  Target,
    color: '#4ADE80',
    bg:    'rgba(74,222,128,0.15)',
    masterKey: 'goals',
    rows: [
      { key: 'goals_weekly', label: 'تقدم أسبوعي', sub: 'كل أحد الساعة 7 مساءً' },
      { key: 'goals_mile',   label: 'إنجاز المراحل', sub: 'عند إتمام مرحلة'       },
    ] as NotifRow[],
  },
  {
    title: 'إشعارات النظام',
    icon:  Settings,
    color: '#60A5FA',
    bg:    'rgba(96,165,250,0.15)',
    masterKey: 'system',
    rows: [
      { key: 'sys_update', label: 'تحديثات التطبيق', sub: 'إشعارات الإصدارات الجديدة' },
      { key: 'sys_tips',   label: 'نصائح ومقترحات', sub: 'مرة أسبوعياً كحد أقصى'   },
    ] as NotifRow[],
  },
];

export function NotificationsScreen({ colorScheme: cs, activeTab = 'more', onTabPress }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';

  const initState = () => {
    const s: Record<string, boolean> = {};
    SECTIONS.forEach(sec => {
      s[sec.masterKey] = true;
      sec.rows.forEach(r => { s[r.key] = true; });
    });
    return s;
  };
  const [toggles, setToggles] = useState<Record<string, boolean>>(initState);
  const set = (key: string, val: boolean) => setToggles(p => ({ ...p, [key]: val }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>الإشعارات</Text>
          <Bell size={24} color="#fff" />
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: F.reg, textAlign: 'right' }}>
          تحكم في الإشعارات التي تريد تلقيها
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 14, paddingBottom: 100 }}>
        {SECTIONS.map((sec) => (
          <View key={sec.masterKey} style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
            {/* Section header */}
            <View style={s.secHeader}>
              <Switch
                value={toggles[sec.masterKey]}
                onValueChange={(v) => set(sec.masterKey, v)}
                thumbColor="#fff"
                trackColor={{ false: '#ccc', true: PRIMARY }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: T.text, fontSize: 15, fontFamily: F.black }}>{sec.title}</Text>
                <View style={[s.iconBox, { backgroundColor: sec.bg }]}>
                  <sec.icon size={18} color={sec.color} />
                </View>
              </View>
            </View>

            {/* Rows */}
            {toggles[sec.masterKey] && sec.rows.map((row, ri) => (
              <View key={row.key}>
                {ri > 0 && <View style={[s.divider, { backgroundColor: T.border }]} />}
                <View style={s.row}>
                  <Switch
                    value={toggles[row.key]}
                    onValueChange={(v) => set(row.key, v)}
                    thumbColor="#fff"
                    trackColor={{ false: '#ccc', true: PRIMARY }}
                    style={{ transform: [{ scale: 0.85 }] }}
                  />
                  <View style={{ alignItems: 'flex-end', flex: 1 }}>
                    <Text style={{ color: T.text, fontSize: 13, fontFamily: F.bold }}>{row.label}</Text>
                    <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{row.sub}</Text>
                  </View>
                </View>
              </View>
            ))}
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
    gap: 6,
  },
  card:    { padding: 16, borderRadius: R.lg, borderWidth: 1 },
  secHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: S.md,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: R.md,
    alignItems: 'center', justifyContent: 'center',
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: S.sm, gap: 10,
  },
  divider: { height: 1 },
});
