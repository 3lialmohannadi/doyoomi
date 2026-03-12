import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  useColorScheme, Platform, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Colors, Spacing, Typography, Radius, Shadow, GRADIENT_PRIMARY } from '../../src/theme';
import { t } from '../../src/utils/i18n';
import { Card } from '../../src/components/ui/Card';
import { ToggleRow } from '../../src/components/ui/ToggleRow';
import { Language, Theme, TimeFormat, StartOfWeek } from '../../src/types';

export default function SettingsScreen() {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { profile, setLanguage, setTheme, setTimeFormat, setStartOfWeek, setProfile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const lang = profile.language;

  const [showProfileModal, setShowProfileModal] = useState(false);
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
      <View style={[styles.header, { paddingTop: topPad + Spacing.sm }]}>
        <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('settings')}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: bottomPad + 100, gap: Spacing.lg }}
      >
        {/* Profile Card */}
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setProfileName(profile.name);
            setProfileEmail(profile.email);
            setShowProfileModal(true);
          }}
        >
          <LinearGradient
            colors={['#6C8EF5', '#B08EF5', '#F0A4C8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileAvatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>
                {profile.name || tFunc('noNameSet')}
              </Text>
              <Text style={styles.profileSubtitle}>{tFunc('tapToEditProfile')}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        </Pressable>

        {/* App Settings */}
        <View>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{tFunc('appSettings')}</Text>
          <Card style={{ paddingHorizontal: Spacing.lg }}>
            <ToggleRow
              label={tFunc('language')}
              options={[
                { key: 'en', label: tFunc('english') },
                { key: 'ar', label: tFunc('arabic') },
              ]}
              value={profile.language}
              onChange={(v) => setLanguage(v as Language)}
            />
            <Separator C={C} />
            <ToggleRow
              label={tFunc('theme')}
              options={[
                { key: 'light', label: tFunc('light') },
                { key: 'dark', label: tFunc('dark') },
              ]}
              value={profile.theme}
              onChange={(v) => setTheme(v as Theme)}
            />
            <Separator C={C} />
            <ToggleRow
              label={tFunc('timeFormat')}
              options={[
                { key: '12h', label: tFunc('hour12') },
                { key: '24h', label: tFunc('hour24') },
              ]}
              value={profile.time_format}
              onChange={(v) => setTimeFormat(v as TimeFormat)}
            />
            <Separator C={C} />
            <ToggleRow
              label={tFunc('startOfWeek')}
              options={[
                { key: 'monday', label: tFunc('monday') },
                { key: 'sunday', label: tFunc('sunday') },
              ]}
              value={profile.start_of_week}
              onChange={(v) => setStartOfWeek(v as StartOfWeek)}
            />
          </Card>
        </View>

        {/* Organization */}
        <View>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{tFunc('organization')}</Text>
          <Card style={{ paddingHorizontal: Spacing.lg }}>
            <Pressable style={styles.settingRow}>
              <View style={[styles.settingIcon, { backgroundColor: C.tint + '20' }]}>
                <Ionicons name="folder-outline" size={18} color={C.tint} />
              </View>
              <Text style={[styles.settingLabel, { color: C.text }]}>{tFunc('categories')}</Text>
              <View style={styles.settingRight}>
                <Text style={[styles.settingValue, { color: C.textSecondary }]}>{categories.length}</Text>
                <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
              </View>
            </Pressable>
          </Card>
        </View>

        {/* About */}
        <View>
          <Text style={[styles.sectionLabel, { color: C.textMuted }]}>{tFunc('about')}</Text>
          <Card style={{ padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm }}>
            <LinearGradient
              colors={['#6C8EF5', '#F0A4C8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aboutLogo}
            >
              <Ionicons name="calendar" size={28} color="#fff" />
            </LinearGradient>
            <Text style={[styles.aboutAppName, { color: C.text }]}>My.Uoomi — يومي</Text>
            <Text style={[styles.aboutTagline, { color: C.textSecondary }]}>{tFunc('yourDayYourWay')}</Text>
            <View style={[styles.versionBadge, { backgroundColor: C.borderLight }]}>
              <Text style={[styles.versionText, { color: C.textMuted }]}>{tFunc('version')} 1.0.0</Text>
            </View>
          </Card>
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal visible={showProfileModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowProfileModal(false)}>
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
            <Pressable onPress={() => setShowProfileModal(false)}>
              <Text style={[styles.modalCancel, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
            </Pressable>
            <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('profile')}</Text>
            <Pressable onPress={saveProfile}>
              <LinearGradient colors={['#6C8EF5', '#F0A4C8']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradient}>
                <Text style={styles.saveText}>{tFunc('save')}</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <View style={{ padding: Spacing.lg, gap: Spacing.lg }}>
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('name')}</Text>
              <TextInput
                value={profileName}
                onChangeText={setProfileName}
                placeholder="Your name"
                placeholderTextColor={C.textMuted}
                style={[styles.formInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
              />
            </View>
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('email')}</Text>
              <TextInput
                value={profileEmail}
                onChangeText={setProfileEmail}
                placeholder="your@email.com"
                placeholderTextColor={C.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.formInput, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function Separator({ C }: { C: any }) {
  return <View style={{ height: 1, backgroundColor: C.borderLight }} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerTitle: { ...Typography.heading2 },
  sectionLabel: {
    ...Typography.label,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    marginLeft: 4,
  },
  profileCard: {
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.md,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarText: { ...Typography.heading3, color: '#fff' },
  profileInfo: { flex: 1 },
  profileName: { ...Typography.subtitle, color: '#fff' },
  profileSubtitle: { ...Typography.caption, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { ...Typography.bodyMedium, flex: 1 },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingValue: { ...Typography.caption },
  aboutLogo: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  aboutAppName: { ...Typography.heading3 },
  aboutTagline: { ...Typography.caption },
  versionBadge: { borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 4, marginTop: 4 },
  versionText: { ...Typography.label },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  modalCancel: { ...Typography.body },
  modalTitle: { ...Typography.subtitle, fontFamily: 'Inter_600SemiBold' },
  saveGradient: { borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6 },
  saveText: { ...Typography.captionMedium, color: '#fff', fontFamily: 'Inter_600SemiBold' },
  formField: { gap: Spacing.xs },
  formLabel: { ...Typography.caption, fontFamily: 'Inter_500Medium', textTransform: 'uppercase', letterSpacing: 0.5 },
  formInput: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    ...Typography.body,
  },
});
