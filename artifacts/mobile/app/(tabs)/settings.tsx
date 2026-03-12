import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  format, parseISO, startOfMonth, getDaysInMonth, getDay,
  addMonths, subMonths,
} from 'date-fns';

import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Spacing, Radius, Shadow, Typography } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { ToggleRow } from '../../src/components/ui/ToggleRow';
import { CategoriesManager } from '../../src/features/categories/CategoriesManager';
import { Language, Theme, TimeFormat, StartOfWeek } from '../../src/types';
import { getTodayString, formatDateKey } from '../../src/utils/date';

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
  const [profilePhone, setProfilePhone] = useState(profile.phone_number ?? '');
  const [profileDob, setProfileDob] = useState(profile.date_of_birth ?? '');
  const [showDobPicker, setShowDobPicker] = useState(false);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const openProfileModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setProfileName(profile.name);
    setProfileEmail(profile.email);
    setProfilePhone(profile.phone_number ?? '');
    setProfileDob(profile.date_of_birth ?? '');
    setShowDobPicker(false);
    setShowProfileModal(true);
  };

  const saveProfile = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setProfile({
      name: profileName,
      email: profileEmail,
      phone_number: profilePhone || undefined,
      date_of_birth: profileDob || undefined,
    });
    setShowProfileModal(false);
  };

  const displayDob = profileDob
    ? format(parseISO(profileDob), 'MMM d, yyyy')
    : '';

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
          <Pressable onPress={openProfileModal} style={styles.profileCard}>
            <View style={styles.avatarBox}>
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>{profile.name || tFunc('noNameSet')}</Text>
              {profile.email ? (
                <Text style={styles.profileEmail}>{profile.email}</Text>
              ) : (
                <Text style={styles.profileSub}>{tFunc('tapToEditProfile')}</Text>
              )}
            </View>
            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color="#7C5CFC" />
            </View>
          </Pressable>
        </LinearGradient>

        <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.xl, marginTop: Spacing.xl }}>
          {/* App settings */}
          <SettingSection title={tFunc('appSettings')} icon="settings-outline" color="#7C5CFC" C={C}>
            <SettingItemRow icon="language-outline" iconColor="#7C5CFC" C={C}>
              <ToggleRow label={tFunc('language')} options={[{ key: 'en', label: 'EN' }, { key: 'ar', label: 'عربي' }]} value={profile.language} onChange={(v) => setLanguage(v as Language)} />
            </SettingItemRow>
            <Divider C={C} />
            <SettingItemRow icon="moon-outline" iconColor="#A855F7" C={C}>
              <ToggleRow label={tFunc('theme')} options={[{ key: 'light', label: tFunc('light') }, { key: 'dark', label: tFunc('dark') }]} value={profile.theme} onChange={(v) => setTheme(v as Theme)} />
            </SettingItemRow>
            <Divider C={C} />
            <SettingItemRow icon="time-outline" iconColor="#FF6B9D" C={C}>
              <ToggleRow label={tFunc('timeFormat')} options={[{ key: '12h', label: '12h' }, { key: '24h', label: '24h' }]} value={profile.time_format} onChange={(v) => setTimeFormat(v as TimeFormat)} />
            </SettingItemRow>
            <Divider C={C} />
            <SettingItemRow icon="calendar-outline" iconColor="#00C48C" C={C}>
              <ToggleRow label={tFunc('startOfWeek')} options={[{ key: 'monday', label: 'Mon' }, { key: 'sunday', label: 'Sun' }]} value={profile.start_of_week} onChange={(v) => setStartOfWeek(v as StartOfWeek)} />
            </SettingItemRow>
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
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modal, { backgroundColor: C.background }]}>
            {/* Modal header */}
            <View style={[styles.modalHeader, { borderBottomColor: C.border }]}>
              <Pressable onPress={() => setShowProfileModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={C.textSecondary} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('profile')}</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
            >
              {/* Avatar section */}
              <View style={styles.modalAvatarSection}>
                <LinearGradient
                  colors={['#7C5CFC', '#FF6B9D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.modalAvatar}
                >
                  <Text style={styles.modalAvatarText}>
                    {profileName ? profileName.charAt(0).toUpperCase() : '?'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Personal info section */}
              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <View style={[styles.formSectionIcon, { backgroundColor: '#7C5CFC20' }]}>
                    <Ionicons name="person-outline" size={14} color="#7C5CFC" />
                  </View>
                  <Text style={[styles.formSectionTitle, { color: C.textSecondary }]}>{tFunc('personalInfo')}</Text>
                </View>
                <View style={[styles.formCard, { backgroundColor: C.card, borderColor: C.border }]}>
                  <ProfileField label={tFunc('name')} icon="person-outline" C={C}>
                    <TextInput
                      value={profileName}
                      onChangeText={setProfileName}
                      placeholder={tFunc('namePlaceholder')}
                      placeholderTextColor={C.textMuted}
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>

                  <View style={{ height: 1, backgroundColor: C.borderLight }} />

                  <ProfileField label={tFunc('dateOfBirth')} icon="calendar-outline" C={C}>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowDobPicker(!showDobPicker); }}
                      style={styles.dobPressable}
                    >
                      <Text style={[styles.formInputInline, { color: displayDob ? C.text : C.textMuted }]}>
                        {displayDob || tFunc('dobPlaceholder')}
                      </Text>
                      <Ionicons name="chevron-down" size={16} color={C.textMuted} />
                    </Pressable>
                  </ProfileField>

                  {showDobPicker && (
                    <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md }}>
                      <DobCalendar
                        selected={profileDob}
                        onSelect={(d: string) => { setProfileDob(d); setShowDobPicker(false); }}
                        C={C}
                      />
                    </View>
                  )}
                </View>
              </View>

              {/* Contact info section */}
              <View style={styles.formSection}>
                <View style={styles.formSectionHeader}>
                  <View style={[styles.formSectionIcon, { backgroundColor: '#FF6B9D20' }]}>
                    <Ionicons name="mail-outline" size={14} color="#FF6B9D" />
                  </View>
                  <Text style={[styles.formSectionTitle, { color: C.textSecondary }]}>{tFunc('contactInfo')}</Text>
                </View>
                <View style={[styles.formCard, { backgroundColor: C.card, borderColor: C.border }]}>
                  <ProfileField label={tFunc('email')} icon="mail-outline" C={C}>
                    <TextInput
                      value={profileEmail}
                      onChangeText={setProfileEmail}
                      placeholder={tFunc('emailPlaceholder')}
                      placeholderTextColor={C.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>

                  <View style={{ height: 1, backgroundColor: C.borderLight }} />

                  <ProfileField label={tFunc('phone')} icon="call-outline" C={C}>
                    <TextInput
                      value={profilePhone}
                      onChangeText={setProfilePhone}
                      placeholder={tFunc('phonePlaceholder')}
                      placeholderTextColor={C.textMuted}
                      keyboardType="phone-pad"
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>
                </View>
              </View>
            </ScrollView>

            {/* Bottom save button */}
            <View style={[styles.modalBottomBar, { paddingBottom: insets.bottom + Spacing.md, borderTopColor: C.border }]}>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowProfileModal(false); }}
                style={[styles.modalCancelBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              >
                <Text style={[styles.modalCancelText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.modalSaveBtn}>
                <LinearGradient
                  colors={['#7C5CFC', '#FF6B9D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
                />
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.modalSaveText}>{tFunc('save')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

function ProfileField({ label, icon, C, children }: any) {
  return (
    <View style={styles.profileField}>
      <View style={styles.profileFieldLeft}>
        <Ionicons name={icon} size={18} color={C.tint} />
        <Text style={[styles.profileFieldLabel, { color: C.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.profileFieldValue}>
        {children}
      </View>
    </View>
  );
}

function SettingItemRow({ icon, iconColor, C, children }: any) {
  return (
    <View style={styles.settingItemRow}>
      <View style={[styles.settingItemIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={styles.settingItemContent}>
        {children}
      </View>
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

// Mini calendar for date of birth
function DobCalendar({ selected, onSelect, C }: any) {
  const [viewDate, setViewDate] = useState(() => {
    if (selected) return parseISO(selected);
    const d = new Date();
    d.setFullYear(d.getFullYear() - 20);
    return d;
  });

  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getDay(startOfMonth(viewDate));
  const today = getTodayString();

  const cells: (string | null)[] = useMemo(() => {
    const c: (string | null)[] = [
      ...Array(firstDay).fill(null),
      ...Array.from({ length: daysInMonth }, (_, i) => {
        const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), i + 1);
        return formatDateKey(d);
      }),
    ];
    while (c.length % 7 !== 0) c.push(null);
    return c;
  }, [viewDate, firstDay, daysInMonth]);

  return (
    <View style={[dobStyles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      <View style={dobStyles.nav}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(subMonths(viewDate, 1)); }}>
          <Ionicons name="chevron-back" size={18} color={C.tint} />
        </Pressable>
        <Text style={[dobStyles.navLabel, { color: C.text }]}>{format(viewDate, 'MMMM yyyy')}</Text>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(addMonths(viewDate, 1)); }}>
          <Ionicons name="chevron-forward" size={18} color={C.tint} />
        </Pressable>
      </View>
      <View style={dobStyles.headerRow}>
        {dayHeaders.map(d => (
          <Text key={d} style={[dobStyles.headerDay, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>
      <View style={dobStyles.grid}>
        {cells.map((dayKey, i) => {
          if (!dayKey) return <View key={i} style={dobStyles.cell} />;
          const isSelected = dayKey === selected;
          const isFuture = dayKey > today;
          const day = parseISO(dayKey).getDate();

          return (
            <Pressable
              key={dayKey}
              onPress={() => { if (!isFuture) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(dayKey); } }}
              style={dobStyles.cell}
              disabled={isFuture}
            >
              <View style={[
                dobStyles.dayCircle,
                isSelected && { overflow: 'hidden' as const },
              ]}>
                {isSelected && (
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                )}
                <Text style={[
                  dobStyles.dayText,
                  { color: isSelected ? '#fff' : isFuture ? C.textMuted + '50' : C.text },
                ]}>
                  {day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const dobStyles = StyleSheet.create({
  container: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: Spacing.md,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  navLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  headerRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  headerDay: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});

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
  heroTitle: { fontSize: 30, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: Spacing.lg },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.xl, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  avatarBox: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(124,92,252,0.2)',
  },
  avatarText: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#7C5CFC' },
  profileName: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A0A4A' },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(0,0,0,0.45)', marginTop: 2 },
  profileSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: 'rgba(0,0,0,0.45)', marginTop: 2 },
  editBadge: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(124,92,252,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: Spacing.sm, marginLeft: 4 },
  sectionIcon: { width: 26, height: 26, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.8 },
  card: {
    borderRadius: Radius.xl, borderWidth: 1,
    paddingHorizontal: Spacing.md, overflow: 'hidden',
    ...Shadow.sm,
  },
  settingItemRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    paddingVertical: 2,
  },
  settingItemIcon: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  settingItemContent: { flex: 1 },
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, gap: Spacing.md },
  settingIcon: { width: 36, height: 36, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { flex: 1, fontSize: 16, fontFamily: 'Inter_500Medium' },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  aboutCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.xl, alignItems: 'center', gap: Spacing.sm,
    ...Shadow.sm,
  },
  aboutLogo: { width: 76, height: 76, borderRadius: Radius.xl, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  aboutName: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  aboutAr: { fontSize: 17, fontFamily: 'Inter_600SemiBold' },
  aboutTagline: { fontSize: 14, fontFamily: 'Inter_400Regular' },
  versionPill: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 5, marginTop: 4 },
  versionText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  // Profile modal
  modal: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md, borderBottomWidth: 1,
  },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  modalContent: {
    padding: Spacing.xl,
    gap: Spacing.xxl,
    paddingBottom: 120,
  },
  modalAvatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  modalAvatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarText: {
    fontSize: 34, fontFamily: 'Inter_700Bold', color: '#fff',
  },

  // Form sections
  formSection: { gap: Spacing.sm },
  formSectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 4,
  },
  formSectionIcon: {
    width: 22, height: 22, borderRadius: 6,
    alignItems: 'center', justifyContent: 'center',
  },
  formSectionTitle: {
    fontSize: 13, fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  formCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    overflow: 'hidden',
    ...Shadow.sm,
  },

  // Profile field row
  profileField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    minHeight: 56,
  },
  profileFieldLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    width: 120,
  },
  profileFieldLabel: {
    fontSize: 14, fontFamily: 'Inter_500Medium',
  },
  profileFieldValue: {
    flex: 1,
  },
  formInputInline: {
    fontSize: 16, fontFamily: 'Inter_400Regular',
    paddingVertical: 0,
  },
  dobPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Bottom bar
  modalBottomBar: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  modalCancelBtn: {
    flex: 1,
    borderRadius: Radius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalCancelText: {
    fontSize: 17, fontFamily: 'Inter_600SemiBold',
  },
  modalSaveBtn: {
    flex: 2,
    flexDirection: 'row',
    borderRadius: Radius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  modalSaveText: {
    fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff',
  },
});
