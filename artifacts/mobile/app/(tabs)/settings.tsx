import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Spacing, Radius } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { ToggleRow } from '../../src/components/ui/ToggleRow';
import { CategoriesManager } from '../../src/features/categories/CategoriesManager';
import { Language, Theme, TimeFormat, StartOfWeek } from '../../src/types';

export default function SettingsScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { profile, setLanguage, setTheme, setTimeFormat, setStartOfWeek, setProfile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const lang = profile.language;

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const saveProfile = () => {
    setProfile({ name: profileName, email: profileEmail });
    setShowProfileModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
      >
        {/* Hero header */}
        <LinearGradient
          colors={['#FF6B9D', '#A855F7', '#7C5CFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.md }]}
        >
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
          <Text style={styles.heroTitle}>{tFunc('settings')}</Text>

          {/* Profile card inside hero */}
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setProfileName(profile.name);
              setProfileEmail(profile.email);
              setShowProfileModal(true);
            }}
            style={styles.profileCard}
          >
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name || tFunc('noNameSet')}</Text>
              <Text style={styles.profileSub}>{tFunc('tapToEditProfile')}</Text>
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#7C5CFC" />
            </View>
          </Pressable>
        </LinearGradient>

        <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.xl, marginTop: Spacing.xl }}>
          {/* App settings */}
          <SettingSection title={tFunc('appSettings')} icon="settings-outline" color="#7C5CFC" C={C}>
            <ToggleRow label={tFunc('language')} options={[{ key: 'en', label: 'EN' }, { key: 'ar', label: 'عربي' }]} value={profile.language} onChange={(v) => setLanguage(v as Language)} />
            <Divider C={C} />
            <ToggleRow label={tFunc('theme')} options={[{ key: 'light', label: tFunc('light') }, { key: 'dark', label: tFunc('dark') }]} value={profile.theme} onChange={(v) => setTheme(v as Theme)} />
            <Divider C={C} />
            <ToggleRow label={tFunc('timeFormat')} options={[{ key: '12h', label: '12h' }, { key: '24h', label: '24h' }]} value={profile.time_format} onChange={(v) => setTimeFormat(v as TimeFormat)} />
            <Divider C={C} />
            <ToggleRow label={tFunc('startOfWeek')} options={[{ key: 'monday', label: 'Mon' }, { key: 'sunday', label: 'Sun' }]} value={profile.start_of_week} onChange={(v) => setStartOfWeek(v as StartOfWeek)} />
          </SettingSection>

          {/* Organization */}
          <SettingSection title={tFunc('organization')} icon="folder-outline" color="#FF6B9D" C={C}>
            <Pressable style={styles.settingRow} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowCategories(true); }}>
              <View style={[styles.settingIcon, { backgroundColor: '#FF6B9D' + '20' }]}>
                <Ionicons name="folder-outline" size={18} color="#FF6B9D" />
              </View>
              <Text style={[styles.settingLabel, { color: C.text }]}>{tFunc('categories')}</Text>
              <View style={styles.settingRight}>
                <View style={[styles.countBadge, { backgroundColor: C.tint + '18' }]}>
                  <Text style={[styles.countText, { color: C.tint }]}>{categories.length}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
              </View>
            </Pressable>
          </SettingSection>

          {/* About */}
          <View style={[styles.aboutCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <LinearGradient
              colors={['#7C5CFC', '#FF6B9D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aboutLogo}
            >
              <Ionicons name="calendar" size={30} color="#fff" />
            </LinearGradient>
            <Text style={[styles.aboutName, { color: C.text }]}>Do.Yoomi</Text>
            <Text style={[styles.aboutAr, { color: C.tint }]}>يومي</Text>
            <Text style={[styles.aboutTagline, { color: C.textSecondary }]}>{tFunc('yourDayYourWay')}</Text>
            <View style={[styles.versionPill, { backgroundColor: C.tint + '15' }]}>
              <Text style={[styles.versionText, { color: C.tint }]}>v1.0.0</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <CategoriesManager visible={showCategories} onClose={() => setShowCategories(false)} />

      {/* Profile modal */}
      <Modal visible={showProfileModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProfileModal(false)}>
        <View style={[styles.modal, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
            <Pressable onPress={() => setShowProfileModal(false)}>
              <Text style={[styles.modalCancel, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('profile')}</Text>
            <Pressable onPress={saveProfile}>
              <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGrad}>
                <Text style={styles.saveText}>{tFunc('save')}</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <View style={{ padding: Spacing.lg, gap: Spacing.lg }}>
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('name')}</Text>
              <TextInput value={profileName} onChangeText={setProfileName} placeholder="Your name" placeholderTextColor={C.textMuted} style={[styles.formInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]} />
            </View>
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('email')}</Text>
              <TextInput value={profileEmail} onChangeText={setProfileEmail} placeholder="your@email.com" placeholderTextColor={C.textMuted} keyboardType="email-address" autoCapitalize="none" style={[styles.formInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function SettingSection({ title, icon, color, C, children }: any) {
  return (
    <View>
      <View style={styles.sectionLabel}>
        <View style={[styles.sectionIcon, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={14} color={color} />
        </View>
        <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>{title}</Text>
      </View>
      <View style={[styles.card, { backgroundColor: C.card, borderColor: C.border }]}>
        {children}
      </View>
    </View>
  );
}

function Divider({ C }: { C: any }) {
  return <View style={{ height: 1, backgroundColor: C.borderLight }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecor1: { position: 'absolute', left: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
  heroDecor2: { position: 'absolute', right: -20, bottom: 10, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroTitle: { fontSize: 28, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: Spacing.lg },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.xl, padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  avatarBox: {
    width: 50, height: 50, borderRadius: 25,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,92,252,0.2)',
  },
  avatarText: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#7C5CFC' },
  profileName: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#1A0A4A' },
  profileSub: { fontSize: 12, fontFamily: 'Inter_400Regular', color: 'rgba(0,0,0,0.5)', marginTop: 2 },
  editBadge: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(124,92,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: Spacing.sm, marginLeft: 4 },
  sectionIcon: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.8 },
  card: {
    borderRadius: Radius.xl, borderWidth: 1,
    paddingHorizontal: Spacing.lg, overflow: 'hidden',
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 15, fontFamily: 'Inter_500Medium' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  aboutCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
    shadowColor: '#7C5CFC', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  aboutLogo: { width: 76, height: 76, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  aboutName: { fontSize: 22, fontFamily: 'Inter_700Bold' },
  aboutAr: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  aboutTagline: { fontSize: 13, fontFamily: 'Inter_400Regular' },
  versionPill: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 5, marginTop: 4 },
  versionText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md, borderBottomWidth: 1,
  },
  modalCancel: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  saveGrad: { borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6 },
  saveText: { fontSize: 13, fontFamily: 'Inter_600SemiBold', color: '#fff' },
  formField: { gap: Spacing.xs },
  formLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: { borderRadius: Radius.md, borderWidth: 1, paddingHorizontal: Spacing.md, paddingVertical: 12, fontSize: 15, fontFamily: 'Inter_400Regular' },
});
