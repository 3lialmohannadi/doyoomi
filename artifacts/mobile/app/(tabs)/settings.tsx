import React, { useState, useMemo } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  Platform, KeyboardAvoidingView, Image,
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
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useJournalStore } from '../../src/store/journalStore';
import { Spacing, Radius } from '../../src/theme';
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
  const { goals } = useGoalsStore();
  const { habits } = useHabitsStore();
  const { entries: journalEntries } = useJournalStore();
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

  const settingsSummary = [
    profile.language === 'ar' ? 'عربي' : 'English',
    tFunc(profile.theme === 'dark' ? 'dark' : 'light'),
    profile.time_format,
  ].join(' · ');

  const goalsCount = goals.length;
  const habitsCount = habits.length;
  const journalCount = journalEntries.length;

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>

        {/* ── Hero ── */}
        <LinearGradient
          colors={['#7C5CFC', '#A855F7', '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.md }]}
        >
          <View style={styles.heroDecor1} />
          <View style={styles.heroDecor2} />
          <View style={styles.heroDecor3} />

          <Text style={[styles.heroLabel, { textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('more')}</Text>

          {/* Profile card */}
          <Pressable
            onPress={openProfileModal}
            style={({ pressed }) => [styles.profileCard, { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.93 : 1 }]}
            accessibilityRole="button"
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

            <View style={[styles.profileInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.profileName, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {profile.name || tFunc('noNameSet')}
              </Text>
              <Text style={[styles.profileEmail, { textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {profile.email || tFunc('tapToEditProfile')}
              </Text>
            </View>

            <View style={styles.editBadge}>
              <Ionicons name="pencil" size={13} color="#7C5CFC" />
            </View>
          </Pressable>
        </LinearGradient>

        {/* ── Content ── */}
        <View style={[styles.pageContent, { paddingHorizontal: Spacing.lg }]}>

          {/* Section: Content */}
          <SectionHeader title={tFunc('content')} isRTL={isRTL} C={C} />
          <View style={styles.contentCards}>

            {/* Habits card */}
            <ContentCard
              icon="leaf"
              label={tFunc('habits')}
              sub={`${habitsCount} ${isRTL ? 'عادة' : 'habits'}`}
              colors={['#A855F7', '#7C5CFC']}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/habits'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Goals card */}
            <ContentCard
              icon="trophy"
              label={tFunc('goals')}
              sub={`${goalsCount} ${isRTL ? 'هدف' : 'goals'}`}
              colors={['#FF6B9D', '#A855F7']}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/goals'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Daily Journal card */}
            <ContentCard
              icon="book"
              label={tFunc('journal')}
              sub={`${journalCount} ${isRTL ? 'إدخال' : 'entries'}`}
              colors={['#9B6EF5', '#FF6B9D']}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/journal'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Categories card */}
            <ContentCard
              icon="folder-open"
              label={tFunc('categories')}
              sub={`${categories.length} ${isRTL ? 'تصنيف' : 'categories'}`}
              colors={['#FF6B35', '#FFB347']}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowCategories(true); }}
              isRTL={isRTL}
              C={C}
            />
          </View>

          {/* Section: App Settings */}
          <SectionHeader title={tFunc('preferences')} isRTL={isRTL} C={C} />
          <Pressable
            style={({ pressed }) => [styles.wideCard, { backgroundColor: C.card, borderColor: C.border, opacity: pressed ? 0.92 : 1 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowAppSettings(true); }}
            accessibilityRole="button"
          >
            <View style={[styles.wideCardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <LinearGradient
                colors={['#7C5CFC', '#00C48C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.wideCardIcon}
              >
                <Ionicons name="options" size={20} color="#fff" />
              </LinearGradient>
              <View style={[styles.wideCardText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.wideCardTitle, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('appSettings')}</Text>
                <Text style={[styles.wideCardSub, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>{settingsSummary}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={C.textMuted} />
            </View>
          </Pressable>

          {/* Section: Help */}
          <SectionHeader title={tFunc('helpSection')} isRTL={isRTL} C={C} />
          <Pressable
            style={({ pressed }) => [styles.wideCard, { overflow: 'hidden', opacity: pressed ? 0.92 : 1 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/support'); }}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={['#A855F7', '#7C5CFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill]}
            />
            <View style={styles.supportDecoCircle} />
            <View style={[styles.wideCardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.supportIconWrap}>
                <Ionicons name="chatbubble-ellipses" size={22} color="#A855F7" />
              </View>
              <View style={[styles.wideCardText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
                <Text style={[styles.wideCardTitle, { color: '#fff', textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('supportAndContact')}</Text>
                <Text style={[styles.wideCardSub, { color: 'rgba(255,255,255,0.75)', textAlign: isRTL ? 'right' : 'left' }]}>
                  {isRTL ? 'نحن هنا للمساعدة' : 'We are here to help'}
                </Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color="rgba(255,255,255,0.8)" />
            </View>
          </Pressable>

          {/* About card */}
          <View style={[styles.aboutCard, { backgroundColor: C.card, borderColor: C.border }]}>
            <Image
              source={require('../../assets/images/icon.png')}
              style={styles.aboutLogo}
              resizeMode="contain"
            />
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

      {/* ── App Settings Bottom Sheet ── */}
      <Modal
        visible={showAppSettings}
        animationType="fade"
        transparent
        onRequestClose={() => setShowAppSettings(false)}
        statusBarTranslucent
      >
        <Pressable style={styles.settingsOverlay} onPress={() => setShowAppSettings(false)}>
          <Pressable
            style={[styles.settingsSheet, { backgroundColor: C.background, paddingBottom: insets.bottom + 24 }]}
            onPress={() => {}}
          >
            <View style={styles.settingsHandle} />
            <View style={[styles.settingsSheetHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <LinearGradient
                colors={['#7C5CFC', '#00C48C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.settingsSheetIcon}
              >
                <Ionicons name="options" size={18} color="#fff" />
              </LinearGradient>
              <Text style={[styles.settingsSheetTitle, { color: C.text }]}>{tFunc('appSettings')}</Text>
              <Pressable onPress={() => setShowAppSettings(false)} style={styles.settingsCloseBtn}>
                <Ionicons name="close" size={20} color={C.textSecondary} />
              </Pressable>
            </View>

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
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── Profile Modal ── */}
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

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title, isRTL, C }: { title: string; isRTL: boolean; C: any }) {
  return (
    <Text style={[styles.sectionHeader, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
      {title}
    </Text>
  );
}

function ContentCard({ icon, label, sub, colors, onPress, isRTL, C }: {
  icon: any; label: string; sub: string;
  colors: [string, string]; onPress: () => void;
  isRTL: boolean; C: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.contentCard,
        { backgroundColor: C.card, borderColor: C.border, opacity: pressed ? 0.88 : 1 },
      ]}
      accessibilityRole="button"
    >
      <View style={[styles.contentCardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.contentCardIcon}
        >
          <Ionicons name={icon} size={20} color="#fff" />
        </LinearGradient>
        <View style={[styles.contentCardText, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
          <Text style={[styles.contentCardLabel, { color: C.text }]}>{label}</Text>
          <Text style={[styles.contentCardSub, { color: C.textMuted }]}>{sub}</Text>
        </View>
        <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={C.textMuted} />
      </View>
    </Pressable>
  );
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
      <View>{children}</View>
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
          const isTodayDate = dayKey === today;
          const day = parseISO(dayKey).getDate();
          return (
            <Pressable
              key={dayKey}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onSelect(dayKey); }}
              style={dobStyles.cell}
            >
              <View style={[
                dobStyles.dayCircle,
                isSelected && { backgroundColor: C.tint },
                isTodayDate && !isSelected && { borderWidth: 1.5, borderColor: C.tint },
              ]}>
                <Text style={[dobStyles.dayText, { color: isSelected ? '#fff' : isTodayDate ? C.tint : C.text }]}>
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

// ─── Styles ────────────────────────────────────────────────────────────────────

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

  // ── Hero ──
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 36,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  heroDecor1: {
    position: 'absolute', left: -50, top: -50,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  heroDecor2: {
    position: 'absolute', right: -30, bottom: -20,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  heroDecor3: {
    position: 'absolute', right: 60, top: 20,
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroLabel: {
    fontSize: 32, fontFamily: 'Inter_700Bold', color: '#fff',
    marginBottom: Spacing.lg,
  },

  // Profile card in hero
  profileCard: {
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  avatarGrad: {
    width: 58, height: 58, borderRadius: 29,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 26, fontFamily: 'Inter_700Bold', color: '#fff' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#1A0A4A' },
  profileEmail: { fontSize: 13, fontFamily: 'Inter_400Regular', color: '#6B5C9E' },
  editBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(124,92,252,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Page content ──
  pageContent: { paddingTop: Spacing.xxl, gap: Spacing.md },

  sectionHeader: {
    fontSize: 12, fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase', letterSpacing: 1,
    marginBottom: Spacing.xs, marginTop: Spacing.sm,
  },

  // Content cards (vertical stacked)
  contentCards: { gap: Spacing.sm, marginBottom: Spacing.xs },
  contentCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  contentCardRow: {
    alignItems: 'center', gap: Spacing.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.lg,
  },
  contentCardIcon: {
    width: 44, height: 44, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center',
  },
  contentCardText: { flex: 1, gap: 2 },
  contentCardLabel: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  contentCardSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  // Wide cards
  wideCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    position: 'relative', overflow: 'hidden',
    marginBottom: Spacing.xs,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  wideCardRow: {
    alignItems: 'center', gap: Spacing.md,
    padding: Spacing.lg,
  },
  wideCardIcon: {
    width: 48, height: 48, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  wideCardText: { flex: 1, gap: 3 },
  wideCardTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  wideCardSub: { fontSize: 12, fontFamily: 'Inter_400Regular' },

  // Support card extras
  supportDecoCircle: {
    position: 'absolute', right: -30, top: -30,
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  supportIconWrap: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },

  // About card
  aboutCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    alignItems: 'center', padding: Spacing.xxl,
    marginTop: Spacing.sm, marginBottom: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  aboutLogo: {
    width: 96, height: 96,
    marginBottom: Spacing.md,
  },
  aboutName: { fontSize: 24, fontFamily: 'Inter_700Bold', marginBottom: 2 },
  aboutAr: { fontSize: 17, fontFamily: 'Inter_700Bold', marginBottom: Spacing.sm },
  aboutTagline: { fontSize: 14, fontFamily: 'Inter_400Regular', marginBottom: Spacing.md },
  versionPill: { borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6 },
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

  // App Settings bottom sheet
  settingsOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end',
  },
  settingsSheet: {
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingTop: 12, paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.15, shadowRadius: 20, elevation: 20,
  },
  settingsHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.15)', alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  settingsSheetHeader: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  settingsSheetIcon: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  settingsSheetTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', flex: 1 },
  settingsCloseBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  appSettingsContent: { padding: Spacing.lg, gap: Spacing.md },
  appSettingRow: {
    borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  appSettingRowHeader: { alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  appSettingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  appSettingTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', flex: 1 },
});
