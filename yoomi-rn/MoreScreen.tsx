import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Switch, StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit2, BookOpen, Target, Flame, FolderOpen, Globe, Moon, ChevronLeft } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, PRIMARY, SECONDARY, ColorScheme, cardShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
  onDarkToggle?: (val: boolean) => void;
}

const NAV_ITEMS = [
  { icon: Flame,     label: 'العادات',         sub: '3 عادات نشطة',         color: '#FB923C', bg: 'rgba(251,146,60,0.15)'   },
  { icon: Target,    label: 'الأهداف',          sub: '2 هدف نشط',            color: '#4ADE80', bg: 'rgba(74,222,128,0.15)'   },
  { icon: BookOpen,  label: 'مذكرات يومية',   sub: '12 مدونة هذا الشهر',   color: '#60A5FA', bg: 'rgba(96,165,250,0.15)'   },
  { icon: FolderOpen,label: 'الفئات',           sub: '4 فئات',               color: '#A78BFA', bg: 'rgba(167,139,250,0.15)'  },
];

export function MoreScreen({ colorScheme: cs, activeTab = 'more', onTabPress, onDarkToggle }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T    = theme(scheme);
  const dk   = scheme === 'dark';
  const [isDark, setIsDark] = useState(dk);
  const [isAr, setIsAr]     = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black, textAlign: 'right' }}>المزيد</Text>

        {/* User card */}
        <View style={[s.userCard, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          <TouchableOpacity style={s.editBtn}>
            <Edit2 size={14} color="#fff" />
          </TouchableOpacity>
          <View style={{ alignItems: 'flex-end', flex: 1, gap: 2 }}>
            <Text style={{ color: '#fff', fontSize: 17, fontFamily: F.black }}>علي محمد</Text>
            <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 12, fontFamily: F.reg }}>منذ يناير 2025 • 45 يوم متواصل 🔥</Text>
          </View>
          <View style={s.avatar}>
            <Text style={{ color: PRIMARY, fontFamily: F.black, fontSize: 18 }}>ع</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 14, paddingBottom: 100 }}>

        {/* Nav grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {NAV_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} activeOpacity={0.8}
              style={[s.navCard, { backgroundColor: T.card, borderColor: T.border, width: '47%' }, cardShadow]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <ChevronLeft size={14} color={T.muted} />
                <View style={{ alignItems: 'flex-end', gap: 8, flex: 1 }}>
                  <View style={[s.iconBox, { backgroundColor: item.bg }]}>
                    <item.icon size={22} color={item.color} />
                  </View>
                  <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>{item.label}</Text>
                  <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{item.sub}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={[s.settingsCard, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.text, fontSize: 15, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>الإعدادات</Text>

          {/* Language */}
          <View style={s.settingRow}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity style={[s.toggleChip, isAr && s.toggleChipActive]}>
                <Text style={{ color: isAr ? '#fff' : T.muted, fontSize: 12, fontFamily: F.bold }}>عربي</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.toggleChip, !isAr && s.toggleChipActive]} onPress={() => setIsAr(false)}>
                <Text style={{ color: !isAr ? '#fff' : T.muted, fontSize: 12, fontFamily: F.bold }}>English</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>اللغة</Text>
              <Globe size={18} color={PRIMARY} />
            </View>
          </View>

          <View style={[s.divider, { backgroundColor: T.border }]} />

          {/* Theme */}
          <View style={s.settingRow}>
            <Switch
              value={isDark}
              onValueChange={(v) => { setIsDark(v); onDarkToggle?.(v); }}
              thumbColor="#fff"
              trackColor={{ false: '#ccc', true: PRIMARY }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>المظهر الداكن</Text>
              <Moon size={18} color={PRIMARY} />
            </View>
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
  userCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 16, borderRadius: R.lg,
  },
  editBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  navCard: {
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
  iconBox: {
    width: 48, height: 48, borderRadius: R.md,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsCard: {
    padding: 16, borderRadius: R.lg, borderWidth: 1,
  },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: S.sm,
  },
  divider: { height: 1, marginVertical: S.sm },
  toggleChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: R.full,
    backgroundColor: 'transparent',
  },
  toggleChipActive: { backgroundColor: PRIMARY },
});
