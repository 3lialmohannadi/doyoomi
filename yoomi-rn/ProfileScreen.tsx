import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Edit2, Cake, Mail, Phone, ChevronLeft, LogOut } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, GRADIENT_D, PRIMARY, SECONDARY, ColorScheme, cardShadow, primaryShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
  onLogout?:    () => void;
}

const ACHIEVEMENTS = [
  { emoji: '🏆', label: 'أول هدف',      color: '#FB923C', bg: 'rgba(251,146,60,0.15)'  },
  { emoji: '🔥', label: '7 أيام',        color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
  { emoji: '⭐', label: '10 مهام',       color: '#60A5FA', bg: 'rgba(96,165,250,0.15)'  },
  { emoji: '💎', label: 'شهر كامل',      color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
];

export function ProfileScreen({ colorScheme: cs, activeTab = 'more', onTabPress, onLogout }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={s.editBtn}>
            <Edit2 size={16} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>الملف الشخصي</Text>
        </View>

        {/* Avatar + name */}
        <View style={{ alignItems: 'center', gap: 10, marginTop: S.sm }}>
          <View style={s.avatarLg}>
            <Text style={{ color: PRIMARY, fontFamily: F.black, fontSize: 26 }}>ع</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: F.black }}>علي محمد</Text>
          <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 13, fontFamily: F.reg }}>عضو منذ يناير 2025</Text>
        </View>

        {/* Stats */}
        <View style={[s.statsRow, { backgroundColor: 'rgba(255,255,255,0.18)' }]}>
          {[
            { label: 'تسلسل',   value: '45', emoji: '🔥' },
            { label: 'عادات',    value: '3',  emoji: '✅' },
            { label: 'مهام',     value: '28', emoji: '📋' },
          ].map((st, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.numBold }}>{st.emoji} {st.value}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.78)', fontSize: 11, fontFamily: F.reg }}>{st.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: S.xl, gap: 14, paddingBottom: 100 }}>

        {/* Personal info */}
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.text, fontSize: 15, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>
            المعلومات الشخصية
          </Text>
          {[
            { icon: Edit2, label: 'الاسم الكامل',    val: 'علي محمد' },
            { icon: Cake,  label: 'تاريخ الميلاد',   val: '15 مارس 1995' },
          ].map((row, i) => (
            <View key={i}>
              {i > 0 && <View style={[s.divider, { backgroundColor: T.border }]} />}
              <View style={s.infoRow}>
                <TouchableOpacity style={s.rowEdit}>
                  <Edit2 size={14} color={T.muted} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{row.label}</Text>
                  <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>{row.val}</Text>
                </View>
                <View style={[s.rowIcon, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                  <row.icon size={16} color={PRIMARY} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Contact info */}
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.text, fontSize: 15, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>
            بيانات التواصل
          </Text>
          {[
            { icon: Mail,  label: 'البريد الإلكتروني', val: 'ali@example.com' },
            { icon: Phone, label: 'رقم الهاتف',         val: '+966 50 000 0000' },
          ].map((row, i) => (
            <View key={i}>
              {i > 0 && <View style={[s.divider, { backgroundColor: T.border }]} />}
              <View style={s.infoRow}>
                <TouchableOpacity style={s.rowEdit}>
                  <Edit2 size={14} color={T.muted} />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg }}>{row.label}</Text>
                  <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>{row.val}</Text>
                </View>
                <View style={[s.rowIcon, { backgroundColor: dk ? 'rgba(108,71,255,0.18)' : '#EDE9FF' }]}>
                  <row.icon size={16} color={PRIMARY} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.text, fontSize: 15, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>
            الإنجازات 🏅
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {ACHIEVEMENTS.map((a, i) => (
              <View key={i} style={[s.achievement, { backgroundColor: a.bg, flex: 1 }]}>
                <Text style={{ fontSize: 22 }}>{a.emoji}</Text>
                <Text style={{ color: a.color, fontSize: 10, fontFamily: F.med, textAlign: 'center' }}>{a.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity onPress={onLogout} activeOpacity={0.85}
          style={[s.logoutBtn, { backgroundColor: dk ? 'rgba(248,113,113,0.12)' : '#FFF0F0', borderColor: 'rgba(248,113,113,0.3)' }]}
        >
          <LogOut size={18} color="#F87171" />
          <Text style={{ color: '#F87171', fontSize: 15, fontFamily: F.black }}>تسجيل الخروج</Text>
        </TouchableOpacity>

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
  editBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLg: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  statsRow: {
    flexDirection: 'row', borderRadius: R.lg, padding: 12,
  },
  card: { padding: 16, borderRadius: R.lg, borderWidth: 1 },
  divider: { height: 1, marginVertical: S.sm },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingVertical: S.sm,
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: R.md,
    alignItems: 'center', justifyContent: 'center',
  },
  rowEdit: { padding: 4 },
  achievement: {
    padding: 10, borderRadius: R.md,
    alignItems: 'center', gap: 4,
  },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: 16, borderRadius: R.lg, borderWidth: 1,
  },
});
