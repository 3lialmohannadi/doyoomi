import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  Platform, KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  format, parseISO, startOfMonth, getDaysInMonth, getDay,
  addMonths, subMonths,
} from 'date-fns';

import { useSettingsStore } from '../../src/store/settingsStore';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { Spacing, Radius, Shadow } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { ToggleRow } from '../../src/components/ui/ToggleRow';
import { CategoriesManager } from '../../src/features/categories/CategoriesManager';
import { Language, Theme, TimeFormat, StartOfWeek } from '../../src/types';
import { getTodayString, formatDateKey } from '../../src/utils/date';

export default function MoreScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const { profile, setLanguage, setTheme, setTimeFormat, setStartOfWeek, setProfile } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showAppSettings, setShowAppSettings] = useState(false);
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

  const displayDob = profileDob ? format(parseISO(profileDob), 'MMM d, yyyy') : '';

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>

        {/* Hero Header */}
        <LinearGradient
          colors={['#FF6B9D', '#A855F7', '#7C5CFC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.md }]}
        >
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
          <Text style={[styles.heroTitle, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('more')}</Text>

          {/* Profile card inside hero */}
          <Pressable
            onPress={openProfileModal}
            style={({ pressed }) => [styles.profileCard, { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.92 : 1 }]}
            accessibilityRole="button"
            accessibilityLabel={tFunc('profile')}
          >
            <LinearGradient
              colors={['#7C5CFC', '#FF6B9D']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGrad}
            >
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </LinearGradient>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
              <Text style={[styles.profileName, { textAlign: isRTL ? 'right' : 'left' }]}>{profile.name || tFunc('noNameSet')}</Text>
              <Text style={[styles.profileSub, { textAlign: isRTL ? 'right' : 'left' }]}>
                {profile.email || tFunc('tapToEditProfile')}
              </Text>
            </View>
            <View style={styles.editChevron}>
              <Ionicons name="pencil" size={14} color="#7C5CFC" />
            </View>
          </Pressable>
        </LinearGradient>

        {/* Menu Content */}
        <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.xl, marginTop: Spacing.xl }}>

          {/* Account section */}
          <MenuSection title={tFunc('account')} icon="person-outline" color="#7C5CFC" C={C} isRTL={isRTL}>
            <MenuItem
              icon="person-circle-outline"
              iconColor="#7C5CFC"
              label={tFunc('profile')}
              subtitle={profile.name || tFunc('noNameSet')}
              onPress={openProfileModal}
              isRTL={isRTL} C={C}
              isLast
            />
          </MenuSection>

          {/* Content section */}
          <MenuSection title={tFunc('content')} icon="grid-outline" color="#FF6B9D" C={C} isRTL={isRTL}>
            <MenuItem
              icon="trophy-outline"
              iconColor="#FF6B9D"
              label={tFunc('goals')}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/goals');
              }}
              isRTL={isRTL} C={C}
            />
            <MenuDivider C={C} />
            <MenuItem
              icon="folder-open-outline"
              iconColor="#FF6B35"
              label={tFunc('categories')}
              badge={categories.length}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowCategories(true);
              }}
              isRTL={isRTL} C={C}
              isLast
            />
          </MenuSection>

          {/* Preferences section */}
          <MenuSection title={tFunc('preferences')} icon="settings-outline" color="#00C48C" C={C} isRTL={isRTL}>
            <MenuItem
              icon="options-outline"
              iconColor="#00C48C"
              label={tFunc('appSettings')}
              subtitle={`${tFunc(profile.language === 'ar' ? 'arabic' : 'english')} · ${tFunc(profile.theme === 'dark' ? 'dark' : 'light')}`}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowAppSettings(true);
              }}
              isRTL={isRTL} C={C}
              isLast
            />
          </MenuSection>

          {/* Help section */}
          <MenuSection title={tFunc('helpSection')} icon="headset-outline" color="#A855F7" C={C} isRTL={isRTL}>
            <MenuItem
              icon="mail-outline"
              iconColor="#A855F7"
              label={tFunc('supportAndContact')}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/support');
              }}
              isRTL={isRTL} C={C}
              isLast
            />
          </MenuSection>

          {/* About card */}
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

      {/* App Settings Modal */}
      <Modal
        visible={showAppSettings}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAppSettings(false)}
      >
        <View style={[styles.modal, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Pressable onPress={() => setShowAppSettings(false)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={22} color={C.textSecondary} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('appSettings')}</Text>
            <View style={{ width: 36 }} />
          </View>

          <ScrollView contentContainerStyle={[styles.appSettingsContent, { paddingBottom: insets.bottom + 40 }]}>
            <AppSettingSection title={tFunc('language')} icon="language-outline" iconColor="#7C5CFC" C={C} isRTL={isRTL}>
              <ToggleRow
                label=""
                options={[{ key: 'en', label: 'English' }, { key: 'ar', label: 'عربي' }]}
                value={profile.language}
                onChange={(v) => setLanguage(v as Language)}
              />
            </AppSettingSection>

            <AppSettingSection title={tFunc('theme')} icon="moon-outline" iconColor="#A855F7" C={C} isRTL={isRTL}>
              <ToggleRow
                label=""
                options={[{ key: 'light', label: tFunc('light') }, { key: 'dark', label: tFunc('dark') }]}
                value={profile.theme}
                onChange={(v) => setTheme(v as Theme)}
              />
            </AppSettingSection>

            <AppSettingSection title={tFunc('timeFormat')} icon="time-outline" iconColor="#FF6B9D" C={C} isRTL={isRTL}>
              <ToggleRow
                label=""
                options={[{ key: '12h', label: '12h' }, { key: '24h', label: '24h' }]}
                value={profile.time_format}
                onChange={(v) => setTimeFormat(v as TimeFormat)}
              />
            </AppSettingSection>

            <AppSettingSection title={tFunc('startOfWeek')} icon="calendar-outline" iconColor="#00C48C" C={C} isRTL={isRTL}>
              <ToggleRow
                label=""
                options={[{ key: 'monday', label: isRTL ? 'الإثنين' : 'Mon' }, { key: 'sunday', label: isRTL ? 'الأحد' : 'Sun' }]}
                value={profile.start_of_week}
                onChange={(v) => setStartOfWeek(v as StartOfWeek)}
              />
            </AppSettingSection>
          </ScrollView>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={showProfileModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfileModal(false)}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modal, { backgroundColor: C.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Pressable onPress={() => setShowProfileModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={C.textSecondary} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('profile')}</Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.modalContent} keyboardShouldPersistTaps="handled">
              {/* Avatar */}
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

              {/* Personal info */}
              <View style={styles.formSection}>
                <View style={[styles.formSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.formSectionIcon, { backgroundColor: '#7C5CFC20' }]}>
                    <Ionicons name="person-outline" size={14} color="#7C5CFC" />
                  </View>
                  <Text style={[styles.formSectionTitle, { color: C.textSecondary }]}>{tFunc('personalInfo')}</Text>
                </View>
                <View style={[styles.formCard, { backgroundColor: C.card, borderColor: C.border }]}>
                  <ProfileField label={tFunc('name')} icon="person-outline" C={C} isRTL={isRTL}>
                    <TextInput
                      value={profileName}
                      onChangeText={setProfileName}
                      placeholder={tFunc('namePlaceholder')}
                      placeholderTextColor={C.textMuted}
                      textAlign={isRTL ? 'right' : 'left'}
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>
                  <View style={{ height: 1, backgroundColor: C.borderLight }} />
                  <ProfileField label={tFunc('dateOfBirth')} icon="calendar-outline" C={C} isRTL={isRTL}>
                    <Pressable
                      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowDobPicker(!showDobPicker); }}
                      style={[styles.dobPressable, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
                    >
                      <Text style={[styles.formInputInline, { color: displayDob ? C.text : C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
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

              {/* Contact info */}
              <View style={styles.formSection}>
                <View style={[styles.formSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.formSectionIcon, { backgroundColor: '#FF6B9D20' }]}>
                    <Ionicons name="mail-outline" size={14} color="#FF6B9D" />
                  </View>
                  <Text style={[styles.formSectionTitle, { color: C.textSecondary }]}>{tFunc('contactInfo')}</Text>
                </View>
                <View style={[styles.formCard, { backgroundColor: C.card, borderColor: C.border }]}>
                  <ProfileField label={tFunc('email')} icon="mail-outline" C={C} isRTL={isRTL}>
                    <TextInput
                      value={profileEmail}
                      onChangeText={setProfileEmail}
                      placeholder={tFunc('emailPlaceholder')}
                      placeholderTextColor={C.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      textAlign={isRTL ? 'right' : 'left'}
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>
                  <View style={{ height: 1, backgroundColor: C.borderLight }} />
                  <ProfileField label={tFunc('phone')} icon="call-outline" C={C} isRTL={isRTL}>
                    <TextInput
                      value={profilePhone}
                      onChangeText={setProfilePhone}
                      placeholder={tFunc('phonePlaceholder')}
                      placeholderTextColor={C.textMuted}
                      keyboardType="phone-pad"
                      textAlign={isRTL ? 'right' : 'left'}
                      style={[styles.formInputInline, { color: C.text }]}
                    />
                  </ProfileField>
                </View>
              </View>
            </ScrollView>

            {/* Bottom save */}
            <View style={[styles.modalBottomBar, { paddingBottom: insets.bottom + Spacing.md, borderTopColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowProfileModal(false); }}
                style={[styles.modalCancelBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              >
                <Text style={[styles.modalCancelText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
              </Pressable>
              <Pressable onPress={saveProfile} style={styles.modalSaveBtn}>
                <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function MenuSection({ title, icon, color, C, isRTL, children }: any) {
  return (
    <View>
      <View style={[styles.sectionLabel, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.sectionIconWrap, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={13} color={color} />
        </View>
        <Text style={[styles.sectionTitle, { color: C.textSecondary }]}>{title}</Text>
      </View>
      <View style={[styles.menuCard, { backgroundColor: C.card, borderColor: C.border }]}>
        {children}
      </View>
    </View>
  );
}

function MenuItem({ icon, iconColor, label, subtitle, badge, onPress, isRTL, C, isLast }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.menuItem,
        { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.7 : 1 },
        !isLast && { borderBottomWidth: 1, borderBottomColor: C.borderLight },
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <View style={[styles.menuItemIcon, { backgroundColor: iconColor + '15' }]}>
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={[styles.menuItemText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={[styles.menuItemLabel, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
        {subtitle && (
          <Text style={[styles.menuItemSubtitle, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{subtitle}</Text>
        )}
      </View>
      <View style={[styles.menuItemRight, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {badge !== undefined && (
          <View style={[styles.menuBadge, { backgroundColor: C.tint + '18' }]}>
            <Text style={[styles.menuBadgeText, { color: C.tint }]}>{badge}</Text>
          </View>
        )}
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textMuted} />
      </View>
    </Pressable>
  );
}

function MenuDivider({ C }: { C: any }) {
  return <View style={{ height: 1, backgroundColor: C.borderLight }} />;
}

function AppSettingSection({ title, icon, iconColor, C, isRTL, children }: any) {
  return (
    <View style={[styles.appSettingRow, { backgroundColor: C.card, borderColor: C.border }]}>
      <View style={[styles.appSettingRowHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={[styles.appSettingIcon, { backgroundColor: iconColor + '15' }]}>
          <Ionicons name={icon} size={16} color={iconColor} />
        </View>
        <Text style={[styles.appSettingTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
      </View>
      <View style={styles.appSettingControl}>
        {children}
      </View>
    </View>
  );
}

function ProfileField({ label, icon, C, isRTL, children }: any) {
  return (
    <View style={[styles.profileField, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <View style={[styles.profileFieldLeft, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <Ionicons name={icon} size={18} color={C.tint} />
        <Text style={[styles.profileFieldLabel, { color: C.textSecondary }]}>{label}</Text>
      </View>
      <View style={styles.profileFieldValue}>{children}</View>
    </View>
  );
}

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
              <View style={[dobStyles.dayCircle, isSelected && { overflow: 'hidden' as const }]}>
                {isSelected && (
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: 999 }]}
                  />
                )}
                <Text style={[dobStyles.dayText, { color: isSelected ? '#fff' : isFuture ? C.textMuted + '50' : C.text }]}>
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

// ─── Styles ───────────────────────────────────────────────────────────────────

const dobStyles = StyleSheet.create({
  container: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.md },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  navLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  headerRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  headerDay: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%` as any, alignItems: 'center', justifyContent: 'center', paddingVertical: 2 },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    position: 'relative',
    overflow: 'hidden',
  },
  heroDecor1: { position: 'absolute', left: -40, top: -40, width: 160, height: 160, borderRadius: 80, backgroundColor: 'rgba(255,255,255,0.1)' },
  heroDecor2: { position: 'absolute', right: -20, bottom: 10, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(255,255,255,0.07)' },
  heroTitle: { fontSize: 30, fontFamily: 'Inter_700Bold', color: '#fff', marginBottom: Spacing.lg },

  // Profile card in hero
  profileCard: {
    alignItems: 'center', gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: Radius.xl, padding: Spacing.lg,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 6,
  },
  avatarGrad: {
    width: 54, height: 54, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileName: { fontSize: 18, fontFamily: 'Inter_700Bold', color: '#1A0A4A' },
  profileSub: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B5C9E', marginTop: 1 },
  editChevron: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(124,92,252,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Section label
  sectionLabel: { alignItems: 'center', gap: Spacing.xs, marginBottom: Spacing.sm },
  sectionIconWrap: { width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.8 },

  // Menu card
  menuCard: {
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  menuItem: {
    alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.md, paddingVertical: 14,
  },
  menuItemIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  menuItemText: { flex: 1, gap: 2 },
  menuItemLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  menuItemSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  menuItemRight: { alignItems: 'center', gap: Spacing.xs },
  menuBadge: { borderRadius: Radius.full, paddingHorizontal: 8, paddingVertical: 2 },
  menuBadgeText: { fontSize: 12, fontFamily: 'Inter_700Bold' },

  // About
  aboutCard: {
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    alignItems: 'center', padding: Spacing.xxl,
    marginTop: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  aboutLogo: {
    width: 72, height: 72, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  aboutName: { fontSize: 22, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  aboutAr: { fontSize: 16, fontFamily: 'Inter_600SemiBold', marginBottom: Spacing.sm },
  aboutTagline: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: Spacing.md },
  versionPill: { borderRadius: Radius.full, paddingHorizontal: 14, paddingVertical: 5 },
  versionText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  // Modals
  modal: { flex: 1 },
  modalHeader: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalCloseBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  modalTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  modalContent: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  modalAvatarSection: { alignItems: 'center', marginBottom: Spacing.md },
  modalAvatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarText: { fontSize: 36, fontFamily: 'Inter_700Bold', color: '#fff' },
  modalBottomBar: {
    alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  modalCancelBtn: {
    flex: 1, height: 48, borderRadius: Radius.xl, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  modalSaveBtn: {
    flex: 2, height: 48, borderRadius: Radius.xl, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
    backgroundColor: '#7C5CFC',
  },
  modalSaveText: { fontSize: 15, fontFamily: 'Inter_700Bold', color: '#fff' },

  // Profile form
  formSection: { gap: Spacing.sm },
  formSectionHeader: { alignItems: 'center', gap: 6, marginBottom: 2 },
  formSectionIcon: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  formSectionTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', letterSpacing: 0.6 },
  formCard: { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  profileField: { alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  profileFieldLeft: { alignItems: 'center', gap: 6, minWidth: 80 },
  profileFieldLabel: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  profileFieldValue: { flex: 1 },
  formInputInline: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular', padding: 0 },
  dobPressable: { flex: 1, alignItems: 'center', gap: 4 },

  // App Settings modal rows
  appSettingsContent: { padding: Spacing.lg, gap: Spacing.md },
  appSettingRow: {
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  appSettingRowHeader: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  appSettingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appSettingTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
  appSettingControl: {},
});
