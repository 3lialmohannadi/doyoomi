import React, { useState, useMemo, useCallback } from 'react';
import {
  ScrollView, StyleSheet, Text, View, Pressable, Modal, TextInput,
  Platform, KeyboardAvoidingView, Image, Switch, Alert,
} from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import {
  format, parseISO, startOfMonth, getDaysInMonth, getDay,
  addMonths, subMonths, addYears, subYears,
} from 'date-fns';
import { ar } from 'date-fns/locale';

import { useSettingsStore } from '../../src/store/settingsStore';
import {
  requestNotificationPermission,
  scheduleAllReminders,
  cancelAllReminders,
} from '../../src/services/notificationService';
import { exportData, importData, clearAllData } from '../../src/utils/dataExport';
import { useCategoriesStore } from '../../src/store/categoriesStore';
import { useGoalsStore } from '../../src/store/goalsStore';
import { useHabitsStore } from '../../src/store/habitsStore';
import { useJournalStore } from '../../src/store/journalStore';
import { useTasksStore } from '../../src/store/tasksStore';
import { Spacing, Radius, F, PRIMARY, SECONDARY, GRADIENT_H, GRADIENT_D, GRADIENT_SAGE, GRADIENT_AMBER, GRADIENT_CORAL, GRADIENT_DARK_HEADER, GRADIENT_DARK_CARD, cardShadow, ColorScheme, APP_VERSION } from '../../src/theme';
import { useAppTheme } from '../../src/hooks/useAppTheme';
import { t } from '../../src/utils/i18n';
import { CategoriesManager } from '../../src/features/categories/CategoriesManager';
import { getTodayString, formatDateKey } from '../../src/utils/date';

export default function MoreScreen() {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const {
    profile, setLanguage, setTheme, setTimeFormat, setStartOfWeek, setProfile,
    setNotificationsEnabled, setNotificationsTaskTime, setNotificationsHabitTime,
  } = useSettingsStore();
  const { categories } = useCategoriesStore();
  const { goals } = useGoalsStore();
  const { habits } = useHabitsStore();
  const { entries: journalEntries } = useJournalStore();
  const { tasks } = useTasksStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileEmail, setProfileEmail] = useState(profile.email);
  const [profilePhone, setProfilePhone] = useState(profile.phone_number ?? '');
  const [profileDob, setProfileDob] = useState(profile.date_of_birth ?? '');
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showNotifTimeModal, setShowNotifTimeModal] = useState<null | 'task' | 'habit'>(null);
  const [notifTimeHour, setNotifTimeHour] = useState(9);
  const [notifTimeMin, setNotifTimeMin] = useState(0);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;
  const bottomPad = isWeb ? 34 : 0;

  const handleExport = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExportLoading(true);
    const result = await exportData();
    setExportLoading(false);
    if (result.success) {
      Alert.alert('', Platform.OS === 'web' ? tFunc('exportSuccessWeb') : tFunc('exportSuccess'));
    } else {
      Alert.alert('Error', result.error ?? 'Export failed');
    }
  };

  const handleImport = async () => {
    if (!importText.trim()) return;
    setImportLoading(true);
    const result = await importData(importText.trim());
    setImportLoading(false);
    if (result.success) {
      setShowImportModal(false);
      setImportText('');
      Alert.alert('', tFunc('importSuccess'));
    } else {
      Alert.alert(tFunc('importError'), result.error ?? 'Invalid format');
    }
  };

  const handleClearAll = () => {
    Alert.alert(
      tFunc('clearConfirmTitle'),
      tFunc('clearConfirmMsg'),
      [
        { text: tFunc('cancel'), style: 'cancel' },
        {
          text: tFunc('clearAllData'),
          style: 'destructive',
          onPress: async () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            const result = await clearAllData();
            if (result.success) {
              Alert.alert('', tFunc('clearSuccess'));
            } else {
              Alert.alert('Error', result.error ?? tFunc('clearError'));
            }
          },
        },
      ],
    );
  };

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
    ? isRTL
      ? format(parseISO(profileDob), 'd MMMM yyyy', { locale: ar })
      : format(parseISO(profileDob), 'MMM d, yyyy')
    : '';

  const tasksCount = tasks.length;
  const goalsCount = goals.length;
  const habitsCount = habits.length;
  const journalCount = journalEntries.length;

  const notifEnabled = profile.notifications_enabled ?? false;
  const notifTaskTime = profile.notifications_task_time ?? '09:00';
  const notifHabitTime = profile.notifications_habit_time ?? '20:00';

  const handleNotificationToggle = async (val: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (val) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        Alert.alert(tFunc('notificationsPermissionTitle'), tFunc('notificationsDenied'));
        return;
      }
      setNotificationsEnabled(true);
      await scheduleAllReminders(notifTaskTime, notifHabitTime, lang);
    } else {
      setNotificationsEnabled(false);
      await cancelAllReminders();
    }
  };

  const openNotifTimePicker = (type: 'task' | 'habit') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const timeStr = type === 'task' ? notifTaskTime : notifHabitTime;
    const [h, m] = timeStr.split(':').map(Number);
    setNotifTimeHour(h);
    setNotifTimeMin(m);
    setShowNotifTimeModal(type);
  };

  const saveNotifTime = async () => {
    const hh = String(notifTimeHour).padStart(2, '0');
    const mm = String(notifTimeMin).padStart(2, '0');
    const timeStr = `${hh}:${mm}`;
    if (showNotifTimeModal === 'task') {
      setNotificationsTaskTime(timeStr);
      if (notifEnabled) await scheduleAllReminders(timeStr, notifHabitTime, lang);
    } else if (showNotifTimeModal === 'habit') {
      setNotificationsHabitTime(timeStr);
      if (notifEnabled) await scheduleAllReminders(notifTaskTime, timeStr, lang);
    }
    setShowNotifTimeModal(null);
  };

  const formatTime12 = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const ampm = h < 12 ? 'AM' : 'PM';
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 100 }}>

        {/* ── Hero ── */}
        <LinearGradient
          colors={isDark ? [...GRADIENT_DARK_HEADER] : [...GRADIENT_D]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: topPad + Spacing.md }, isDark && styles.heroDark]}
        >
          {!isDark && <View style={styles.heroDecor1} />}
          {!isDark && <View style={styles.heroDecor2} />}
          {!isDark && <View style={styles.heroDecor3} />}

          <Text style={[styles.heroLabel, { color: isDark ? C.tint : '#fff', textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('more')}</Text>

          {/* Profile card */}
          <Pressable
            onPress={openProfileModal}
            style={({ pressed }) => [
              styles.profileCard,
              {
                backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.95)',
                borderWidth: isDark ? 1 : 0,
                borderColor: isDark ? 'rgba(255,255,255,0.10)' : 'transparent',
                flexDirection: isRTL ? 'row-reverse' : 'row',
                opacity: pressed ? 0.93 : 1,
              },
            ]}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[...GRADIENT_H]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarGrad}
            >
              <Text style={styles.avatarText}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : '?'}
              </Text>
            </LinearGradient>

            <View style={[styles.profileInfo, { alignItems: isRTL ? 'flex-end' : 'flex-start' }]}>
              <Text style={[styles.profileName, { color: isDark ? C.text : '#1A1A3A', textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {profile.name || tFunc('noNameSet')}
              </Text>
              <Text style={[styles.profileEmail, { color: isDark ? C.textSecondary : '#6B7280', textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                {profile.email || tFunc('tapToEditProfile')}
              </Text>
            </View>

            <View style={[styles.editBadge, { backgroundColor: isDark ? C.tint + '20' : PRIMARY + '1A' }]}>
              <Ionicons name="pencil" size={13} color={C.tint} />
            </View>
          </Pressable>
        </LinearGradient>

        {/* ── Content ── */}
        <View style={[styles.pageContent, { paddingHorizontal: Spacing.lg }]}>

          {/* Section: Content */}
          <SectionHeader title={tFunc('content')} isRTL={isRTL} C={C} />
          <View style={styles.contentCards}>

            {/* Tasks card */}
            <ContentCard
              icon="checkmark-done"
              label={tFunc('tasks')}
              sub={`${tasksCount} ${isRTL ? 'مهمة' : 'tasks'}`}
              colors={[...GRADIENT_CORAL]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/tasks'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Habits card */}
            <ContentCard
              icon="leaf"
              label={tFunc('habits')}
              sub={`${habitsCount} ${isRTL ? 'عادة' : 'habits'}`}
              colors={[...GRADIENT_H]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.navigate('/habits'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Goals card */}
            <ContentCard
              icon="trophy"
              label={tFunc('goals')}
              sub={`${goalsCount} ${isRTL ? 'هدف' : 'goals'}`}
              colors={[...GRADIENT_SAGE]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.navigate('/goals'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Daily Journal card */}
            <ContentCard
              icon="book"
              label={tFunc('journal')}
              sub={`${journalCount} ${isRTL ? 'إدخال' : 'entries'}`}
              colors={[PRIMARY, SECONDARY]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/journal'); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Categories card */}
            <ContentCard
              icon="folder-open"
              label={tFunc('categories')}
              sub={`${categories.length} ${isRTL ? 'تصنيف' : 'categories'}`}
              colors={[...GRADIENT_AMBER]}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowCategories(true); }}
              isRTL={isRTL}
              C={C}
            />

            {/* Statistics card */}
            <ContentCard
              icon="bar-chart"
              label={tFunc('viewStatistics')}
              sub={tFunc('statistics')}
              colors={['#6366F1', '#8B5CF6']}
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/statistics'); }}
              isRTL={isRTL}
              C={C}
            />
          </View>

          {/* Section: Settings */}
          <SectionHeader title={tFunc('settings')} isRTL={isRTL} C={C} />
          <View style={styles.settingGrid}>
            <View style={[styles.settingGridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <SettingCard
                icon="language-outline"
                iconColor={PRIMARY}
                title={tFunc('language')}
                options={['English', 'عربي']}
                activeIndex={profile.language === 'en' ? 0 : 1}
                onSelect={(i) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setLanguage(i === 0 ? 'en' : 'ar'); }}
                C={C}
                isRTL={isRTL}
              />
              <SettingCard
                icon="moon-outline"
                iconColor={SECONDARY}
                title={tFunc('theme')}
                options={isRTL ? ['فاتح', 'داكن'] : ['Light', 'Dark']}
                activeIndex={profile.theme === 'light' ? 0 : 1}
                onSelect={(i) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setTheme(i === 0 ? 'light' : 'dark'); }}
                C={C}
                isRTL={isRTL}
              />
            </View>
            <View style={[styles.settingGridRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <SettingCard
                icon="time-outline"
                iconColor={SECONDARY}
                title={tFunc('timeFormat')}
                options={['12h', '24h']}
                activeIndex={profile.time_format === '12h' ? 0 : 1}
                onSelect={(i) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setTimeFormat(i === 0 ? '12h' : '24h'); }}
                C={C}
                isRTL={isRTL}
              />
              <SettingCard
                icon="calendar-outline"
                iconColor={SECONDARY}
                title={tFunc('startOfWeek')}
                options={isRTL ? ['الأحد', 'الإثنين'] : ['Sun', 'Mon']}
                activeIndex={profile.start_of_week === 'sunday' ? 0 : 1}
                onSelect={(i) => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); setStartOfWeek(i === 0 ? 'sunday' : 'monday'); }}
                C={C}
                isRTL={isRTL}
              />
            </View>
          </View>

          {/* ── Section: Notifications ── */}
          <SectionHeader title={tFunc('notifications')} isRTL={isRTL} C={C} />
          <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
            {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}

            {/* Toggle row */}
            <View style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: notifEnabled ? 1 : 0, borderBottomColor: C.border }]}>
              <View style={[styles.notifIconWrap, { backgroundColor: '#6366F1' + '20' }]}>
                <Ionicons name="notifications" size={20} color="#6366F1" />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[styles.notifRowTitle, { color: C.text, fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>
                  {tFunc('notificationsEnabled')}
                </Text>
                <Text style={[styles.notifRowSub, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {tFunc('notificationsDesc')}
                </Text>
              </View>
              <Switch
                value={notifEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: C.border, true: '#6366F1' + '80' }}
                thumbColor={notifEnabled ? '#6366F1' : (isDark ? '#555' : '#ccc')}
              />
            </View>

            {/* Task time */}
            {notifEnabled && (
              <Pressable
                onPress={() => openNotifTimePicker('task')}
                style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 1, borderBottomColor: C.border }]}
              >
                <View style={[styles.notifIconWrap, { backgroundColor: '#06B6D4' + '20' }]}>
                  <Ionicons name="checkmark-circle" size={20} color="#06B6D4" />
                </View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={[styles.notifRowTitle, { color: C.text, fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>
                    {tFunc('notificationsTaskReminder')}
                  </Text>
                </View>
                <View style={[styles.timePill, { backgroundColor: '#6366F1' + '18' }]}>
                  <Text style={[styles.timePillText, { color: '#6366F1', fontFamily: F.bold }]}>
                    {formatTime12(notifTaskTime)}
                  </Text>
                </View>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textSecondary} style={{ marginLeft: 4 }} />
              </Pressable>
            )}

            {/* Habit time */}
            {notifEnabled && (
              <Pressable
                onPress={() => openNotifTimePicker('habit')}
                style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
              >
                <View style={[styles.notifIconWrap, { backgroundColor: '#F97316' + '20' }]}>
                  <Ionicons name="leaf" size={20} color="#F97316" />
                </View>
                <View style={{ flex: 1, marginHorizontal: 12 }}>
                  <Text style={[styles.notifRowTitle, { color: C.text, fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>
                    {tFunc('notificationsHabitReminder')}
                  </Text>
                </View>
                <View style={[styles.timePill, { backgroundColor: '#F97316' + '18' }]}>
                  <Text style={[styles.timePillText, { color: '#F97316', fontFamily: F.bold }]}>
                    {formatTime12(notifHabitTime)}
                  </Text>
                </View>
                <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textSecondary} style={{ marginLeft: 4 }} />
              </Pressable>
            )}
          </View>

          {/* ── Section: Widgets ── */}
          <SectionHeader title={tFunc('widgets')} isRTL={isRTL} C={C} />
          <View style={[styles.widgetsCard, { backgroundColor: C.card, borderColor: C.border, overflow: 'hidden' }]}>
            {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
            <LinearGradient
              colors={['#06B6D4', '#6366F1']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
              style={styles.widgetsBanner}
            >
              <Ionicons name="grid" size={32} color="#fff" />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[styles.widgetsBannerTitle, { fontFamily: F.black }]}>{tFunc('widgetsComingSoon')}</Text>
                <Text style={[styles.widgetsBannerSub, { fontFamily: F.reg }]}>{tFunc('widgetsComingSoonDesc')}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* ── Section: Data & Backup ── */}
          <SectionHeader title={tFunc('dataAndBackup')} isRTL={isRTL} C={C} />
          <View style={[styles.settingsGroup, { backgroundColor: C.card, borderColor: C.border }]}>
            {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}

            {/* Export */}
            <Pressable
              onPress={handleExport}
              disabled={exportLoading}
              style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 1, borderBottomColor: C.border, opacity: exportLoading ? 0.6 : 1 }]}
            >
              <View style={[styles.notifIconWrap, { backgroundColor: '#6366F1' + '20' }]}>
                <Ionicons name="share-outline" size={20} color="#6366F1" />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[styles.notifRowTitle, { color: C.text, fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('exportData')}</Text>
                <Text style={[styles.notifRowSub, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('exportDataSub')}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textSecondary} />
            </Pressable>

            {/* Import */}
            <Pressable
              onPress={() => { setImportText(''); setShowImportModal(true); }}
              style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row', borderBottomWidth: 1, borderBottomColor: C.border }]}
            >
              <View style={[styles.notifIconWrap, { backgroundColor: '#10B981' + '20' }]}>
                <Ionicons name="download-outline" size={20} color="#10B981" />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[styles.notifRowTitle, { color: C.text, fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('importData')}</Text>
                <Text style={[styles.notifRowSub, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('importDataSub')}</Text>
              </View>
              <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={16} color={C.textSecondary} />
            </Pressable>

            {/* Clear All */}
            <Pressable
              onPress={handleClearAll}
              style={[styles.notifRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}
            >
              <View style={[styles.notifIconWrap, { backgroundColor: '#EF4444' + '20' }]}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </View>
              <View style={{ flex: 1, marginHorizontal: 12 }}>
                <Text style={[styles.notifRowTitle, { color: '#EF4444', fontFamily: F.med, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('clearAllData')}</Text>
                <Text style={[styles.notifRowSub, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('clearAllDataSub')}</Text>
              </View>
            </Pressable>
          </View>

          {/* Section: Help */}
          <SectionHeader title={tFunc('helpSection')} isRTL={isRTL} C={C} />
          <Pressable
            style={({ pressed }) => [styles.wideCard, { overflow: 'hidden', opacity: pressed ? 0.92 : 1 }]}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); router.push('/support'); }}
            accessibilityRole="button"
          >
            <LinearGradient
              colors={[...GRADIENT_H]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill]}
            />
            <View style={styles.supportDecoCircle} />
            <View style={[styles.wideCardRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <View style={styles.supportIconWrap}>
                <Ionicons name="chatbubble-ellipses" size={22} color={PRIMARY} />
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
          <View style={[styles.aboutCard, { borderColor: C.border, overflow: 'hidden' }]}>
            {isDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
            {!isDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
            <View style={styles.aboutLogoWrap}>
              <Image
                source={require('../../assets/images/icon-nobg.png')}
                style={styles.aboutLogo}
                resizeMode="cover"
              />
            </View>
            <Text style={[styles.aboutName, { color: C.text }]}>Do.Yoomi</Text>
            <Text style={[styles.aboutAr, { color: C.tint }]}>يومي</Text>
            <Text style={[styles.aboutTagline, { color: C.textSecondary }]}>{tFunc('yourDayYourWay')}</Text>
            <View style={[styles.versionPill, { backgroundColor: C.tint + '15' }]}>
              <Text style={[styles.versionText, { color: C.tint }]}>v{APP_VERSION}</Text>
            </View>
          </View>

        </View>
      </ScrollView>

      <CategoriesManager visible={showCategories} onClose={() => setShowCategories(false)} />

      {/* ── Notification Time Picker Modal ── */}
      <Modal
        visible={showNotifTimeModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotifTimeModal(null)}
      >
        <View style={[styles.modal, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Pressable onPress={() => setShowNotifTimeModal(null)} style={styles.modalCloseBtn}>
              <Ionicons name="close" size={20} color={C.textSecondary} />
            </Pressable>
            <Text style={[styles.modalTitle, { color: C.text }]}>
              {showNotifTimeModal === 'task' ? tFunc('notificationsTaskReminder') : tFunc('notificationsHabitReminder')}
            </Text>
            <View style={{ width: 36 }} />
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 24 }}>
            {Platform.OS !== 'web' ? (
              <DateTimePicker
                value={(() => {
                  const d = new Date();
                  d.setHours(notifTimeHour, notifTimeMin, 0, 0);
                  return d;
                })()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                is24Hour
                onChange={(event: DateTimePickerEvent, date?: Date) => {
                  if (date) {
                    setNotifTimeHour(date.getHours());
                    setNotifTimeMin(date.getMinutes());
                  }
                }}
                style={{ width: 200 }}
              />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ color: C.textSecondary, fontSize: 12, fontFamily: F.med }}>{tFunc('hourLabel')}</Text>
                <TextInput
                  value={String(notifTimeHour).padStart(2, '0')}
                  onChangeText={v => { const n = parseInt(v, 10); if (!isNaN(n) && n >= 0 && n < 24) setNotifTimeHour(n); }}
                  keyboardType="number-pad"
                  maxLength={2}
                  style={{ color: C.text, fontFamily: F.black, fontSize: 24, width: 48, textAlign: 'center', backgroundColor: C.card, borderRadius: 10, padding: 8 }}
                />
                <Text style={{ fontSize: 24, fontFamily: F.black, color: '#6366F1' }}>:</Text>
                <TextInput
                  value={String(notifTimeMin).padStart(2, '0')}
                  onChangeText={v => { const n = parseInt(v, 10); if (!isNaN(n) && n >= 0 && n < 60) setNotifTimeMin(n); }}
                  keyboardType="number-pad"
                  maxLength={2}
                  style={{ color: C.text, fontFamily: F.black, fontSize: 24, width: 48, textAlign: 'center', backgroundColor: C.card, borderRadius: 10, padding: 8 }}
                />
                <Text style={{ color: C.textSecondary, fontSize: 12, fontFamily: F.med }}>{tFunc('minLabel')}</Text>
              </View>
            )}
            <View style={[{ backgroundColor: '#6366F1' + '18', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 28 }]}>
              <Text style={{ fontSize: 26, fontFamily: F.black, color: '#6366F1' }}>
                {String(notifTimeHour).padStart(2, '0')}:{String(notifTimeMin).padStart(2, '0')}
              </Text>
            </View>
          </View>
          <View style={[styles.modalBottomBar, { borderTopColor: C.border }]}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, width: '100%' }}>
              <Pressable onPress={() => setShowNotifTimeModal(null)} style={[styles.modalCancelBtn, { borderColor: C.border }]}>
                <Text style={[styles.modalCancelText, { color: C.text }]}>{tFunc('cancel')}</Text>
              </Pressable>
              <Pressable onPress={saveNotifTime} style={{ flex: 2, height: 48, borderRadius: 16, overflow: 'hidden' }}>
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={[styles.modalSaveText]}>{tFunc('save')}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Import / Restore Modal ── */}
      <Modal
        visible={showImportModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowImportModal(false)}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[styles.modal, { backgroundColor: C.background }]}>
            <View style={[styles.modalHeader, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Pressable onPress={() => setShowImportModal(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={C.textSecondary} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: C.text }]}>{tFunc('pasteBackupTitle')}</Text>
              <View style={{ width: 36 }} />
            </View>
            <View style={[styles.modalContent, { flex: 1 }]}>
              <TextInput
                value={importText}
                onChangeText={setImportText}
                placeholder={tFunc('pasteBackupPlaceholder')}
                placeholderTextColor={C.textSecondary}
                multiline
                textAlignVertical="top"
                style={[{
                  flex: 1,
                  fontFamily: F.reg,
                  fontSize: 12,
                  color: C.text,
                  backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                  borderRadius: Radius.md,
                  padding: Spacing.md,
                  borderWidth: 1,
                  borderColor: C.border,
                  textAlign: isRTL ? 'right' : 'left',
                  minHeight: 200,
                }]}
              />
              <Pressable
                onPress={handleImport}
                disabled={importLoading || !importText.trim()}
                style={[{
                  marginTop: Spacing.md,
                  backgroundColor: '#10B981',
                  borderRadius: Radius.md,
                  padding: Spacing.md,
                  alignItems: 'center',
                  opacity: importLoading || !importText.trim() ? 0.5 : 1,
                }]}
              >
                <Text style={{ fontFamily: F.bold, color: '#fff', fontSize: 15 }}>{tFunc('importBtn')}</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
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
                  colors={[...GRADIENT_H]}
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
                  <View style={[styles.formSectionIcon, { backgroundColor: PRIMARY + '20' }]}>
                    <Ionicons name="person-outline" size={14} color={PRIMARY} />
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
                        isRTL={isRTL}
                        lang={lang}
                      />
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formSection}>
                <View style={[styles.formSectionHeader, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                  <View style={[styles.formSectionIcon, { backgroundColor: SECONDARY + '20' }]}>
                    <Ionicons name="mail-outline" size={14} color={SECONDARY} />
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
                <LinearGradient colors={[...GRADIENT_H]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
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

function SectionHeader({ title, isRTL, C }: { title: string; isRTL: boolean; C: ColorScheme }) {
  return (
    <Text style={[styles.sectionHeader, { color: C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
      {title}
    </Text>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

function ContentCard({ icon, label, sub, colors, onPress, isRTL, C }: {
  icon: IoniconsName; label: string; sub: string;
  colors: [string, string]; onPress: () => void;
  isRTL: boolean; C: ColorScheme;
}) {
  const { scheme: ccScheme } = useAppTheme();
  const isCCDark = ccScheme === 'dark';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.contentCard,
        { borderColor: C.border, overflow: 'hidden', opacity: pressed ? 0.88 : 1 },
      ]}
      accessibilityRole="button"
    >
      {isCCDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isCCDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
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

function SettingCard({ icon, iconColor, title, options, activeIndex, onSelect, C, isRTL }: {
  icon: IoniconsName; iconColor: string; title: string;
  options: string[]; activeIndex: number;
  onSelect: (index: number) => void; C: ColorScheme; isRTL?: boolean;
}) {
  const { scheme: scScheme } = useAppTheme();
  const isSCDark = scScheme === 'dark';
  return (
    <View style={[styles.settingCard, { borderColor: C.border, overflow: 'hidden' }]}>
      {isSCDark && <LinearGradient colors={[...GRADIENT_DARK_CARD]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />}
      {!isSCDark && <View style={[StyleSheet.absoluteFill, { backgroundColor: C.card }]} />}
      <View style={[styles.settingCardHeader, isRTL && { flexDirection: 'row-reverse' }]}>
        <View style={[styles.settingCardIcon, { backgroundColor: iconColor + '18' }]}>
          <Ionicons name={icon} size={17} color={iconColor} />
        </View>
        <Text style={[styles.settingCardTitle, { color: C.textMuted }]} numberOfLines={1}>{title}</Text>
      </View>
      <View style={styles.settingCardOptions}>
        {options.map((opt, i) => (
          <Pressable
            key={i}
            onPress={() => onSelect(i)}
            style={({ pressed }) => [
              styles.settingCardOption,
              {
                backgroundColor: i === activeIndex ? iconColor + '18' : C.surface,
                borderColor: i === activeIndex ? iconColor : C.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: i === activeIndex }}
            accessibilityLabel={opt}
          >
            <Text style={[
              styles.settingCardOptionText,
              { color: i === activeIndex ? iconColor : C.textMuted, fontFamily: i === activeIndex ? F.bold : F.reg },
            ]}>
              {opt}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ProfileField({ label, icon, C, isRTL, children }: { label: string; icon: IoniconsName; C: ColorScheme; isRTL: boolean; children: React.ReactNode }) {
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

const DOB_AR_MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
const DOB_AR_DAYS = ['أح','إث','ثل','أر','خم','جم','سب'];
const DOB_EN_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function DobCalendar({ selected, onSelect, C, isRTL, lang }: { selected?: string; onSelect: (d: string) => void; C: ColorScheme; isRTL: boolean; lang: string }) {
  const [viewDate, setViewDate] = useState(() => {
    if (selected) return parseISO(selected);
    const d = new Date();
    d.setFullYear(d.getFullYear() - 20);
    return d;
  });

  const dayHeaders = isRTL ? [...DOB_AR_DAYS].reverse() : DOB_EN_DAYS;
  const daysInMonth = getDaysInMonth(viewDate);
  const firstDay = getDay(startOfMonth(viewDate));
  const today = getTodayString();
  const monthLabel = isRTL ? DOB_AR_MONTHS[viewDate.getMonth()] : format(viewDate, 'MMMM');

  const ltrCells: (string | null)[] = useMemo(() => {
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

  const displayCells = useMemo(() => {
    if (!isRTL) return ltrCells;
    const rows: (string | null)[][] = [];
    for (let i = 0; i < ltrCells.length; i += 7) {
      rows.push([...ltrCells.slice(i, i + 7)].reverse());
    }
    return rows.flat();
  }, [ltrCells, isRTL]);

  return (
    <View style={[dobStyles.container, { backgroundColor: C.surface, borderColor: C.border }]}>
      {/* Year navigation row */}
      <View style={[dobStyles.yearNav, isRTL && { flexDirection: 'row-reverse' }]}>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? addYears(viewDate, 1) : subYears(viewDate, 1)); }}
          style={[dobStyles.yearNavBtn, { backgroundColor: C.tint + '15' }]}
          hitSlop={8}
        >
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={14} color={C.tint} />
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={14} color={C.tint} style={{ marginLeft: -8 }} />
        </Pressable>
        <Text style={[dobStyles.yearLabel, { color: C.tint }]}>{format(viewDate, 'yyyy')}</Text>
        <Pressable
          onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? subYears(viewDate, 1) : addYears(viewDate, 1)); }}
          style={[dobStyles.yearNavBtn, { backgroundColor: C.tint + '15' }]}
          hitSlop={8}
        >
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={C.tint} />
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={14} color={C.tint} style={{ marginLeft: -8 }} />
        </Pressable>
      </View>
      {/* Month navigation row */}
      <View style={[dobStyles.nav, isRTL && { flexDirection: 'row-reverse' }]}>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? addMonths(viewDate, 1) : subMonths(viewDate, 1)); }} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={18} color={C.tint} />
        </Pressable>
        <Text style={[dobStyles.navLabel, { color: C.text }]}>{monthLabel}</Text>
        <Pressable onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setViewDate(isRTL ? subMonths(viewDate, 1) : addMonths(viewDate, 1)); }} hitSlop={8}>
          <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={C.tint} />
        </Pressable>
      </View>
      <View style={dobStyles.headerRow}>
        {dayHeaders.map((d, idx) => (
          <Text key={`${d}-${idx}`} style={[dobStyles.headerDay, { color: C.textMuted }]}>{d}</Text>
        ))}
      </View>
      <View style={dobStyles.grid}>
        {displayCells.map((dayKey, i) => {
          if (!dayKey) return <View key={'empty-' + i} style={dobStyles.cell} />;
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
  yearNav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  yearNavBtn: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: Radius.sm, paddingHorizontal: 6, paddingVertical: 4,
  },
  yearLabel: { fontSize: 15, fontFamily: F.bold },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.sm },
  navLabel: { fontSize: 14, fontFamily: F.med },
  headerRow: { flexDirection: 'row', marginBottom: Spacing.xs },
  headerDay: { flex: 1, textAlign: 'center', fontSize: 11, fontFamily: F.med },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, alignItems: 'center' as const, justifyContent: 'center' as const, paddingVertical: 2 },
  dayCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  dayText: { fontSize: 13, fontFamily: F.med },
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  // ── Hero ──
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 36,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  heroDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
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
    fontSize: 32, fontFamily: F.bold, color: '#fff',
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
  avatarText: { fontSize: 26, fontFamily: F.bold, color: '#fff' },
  profileInfo: { flex: 1, gap: 3 },
  profileName: { fontSize: 17, fontFamily: F.bold, color: '#2D1A0E' },
  profileEmail: { fontSize: 13, fontFamily: F.reg, color: '#7A5C48' },
  editBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: PRIMARY + '1A',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Page content ──
  pageContent: { paddingTop: Spacing.xxl, gap: Spacing.md },

  sectionHeader: {
    fontSize: 12, fontFamily: F.bold,
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
  contentCardLabel: { fontSize: 16, fontFamily: F.med },
  contentCardSub: { fontSize: 12, fontFamily: F.reg },

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
  wideCardTitle: { fontSize: 16, fontFamily: F.bold },
  wideCardSub: { fontSize: 12, fontFamily: F.reg },

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
  aboutLogoWrap: {
    width: 96, height: 96,
    borderRadius: 22,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4,
  },
  aboutLogo: {
    width: 96, height: 96,
  },
  aboutInfo: { flex: 1, gap: 2 },
  aboutName: { fontSize: 24, fontFamily: F.brand, marginBottom: 2 },
  aboutAr: { fontSize: 17, fontFamily: F.bold, marginBottom: Spacing.sm },
  aboutTagline: { fontSize: 14, fontFamily: F.reg, marginBottom: Spacing.md },
  versionPill: { borderRadius: Radius.full, paddingHorizontal: 16, paddingVertical: 6 },
  versionText: { fontSize: 13, fontFamily: F.med },

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
  modalTitle: { fontSize: 17, fontFamily: F.bold },
  modalContent: { padding: Spacing.lg, gap: Spacing.lg, paddingBottom: 40 },
  modalAvatarSection: { alignItems: 'center', marginBottom: Spacing.md },
  modalAvatar: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center',
  },
  modalAvatarText: { fontSize: 36, fontFamily: F.bold, color: '#fff' },
  modalBottomBar: {
    alignItems: 'center', gap: Spacing.md,
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.md,
    borderTopWidth: 1,
  },
  modalCancelBtn: {
    flex: 1, height: 48, borderRadius: Radius.xl, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  modalCancelText: { fontSize: 15, fontFamily: F.med },
  modalSaveBtn: {
    flex: 2, height: 48, borderRadius: Radius.xl, overflow: 'hidden',
    alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6,
    backgroundColor: PRIMARY,
  },
  modalSaveText: { fontSize: 15, fontFamily: F.bold, color: '#fff' },

  // Profile form
  formSection: { gap: Spacing.sm },
  formSectionHeader: { alignItems: 'center', gap: 6, marginBottom: 2 },
  formSectionIcon: { width: 24, height: 24, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  formSectionTitle: { fontSize: 12, fontFamily: F.bold, textTransform: 'uppercase', letterSpacing: 0.6 },
  formCard: { borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden' },
  profileField: { alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: Spacing.sm },
  profileFieldLeft: { alignItems: 'center', gap: 6, minWidth: 80 },
  profileFieldLabel: { fontSize: 13, fontFamily: F.med },
  profileFieldValue: { flex: 1 },
  formInputInline: { flex: 1, fontSize: 15, fontFamily: F.reg, padding: 0 },
  dobPressable: { flex: 1, alignItems: 'center', gap: 4 },

  settingsGroup: {
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    marginBottom: Spacing.xs,
  },

  // Notifications
  notifRow: {
    alignItems: 'center', paddingHorizontal: Spacing.md, paddingVertical: 14,
  },
  notifIconWrap: {
    width: 38, height: 38, borderRadius: 11,
    alignItems: 'center', justifyContent: 'center',
  },
  notifRowTitle: { fontSize: 15 },
  notifRowSub: { fontSize: 12, marginTop: 2, fontFamily: F.reg },
  timePill: {
    borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 5,
  },
  timePillText: { fontSize: 13 },

  // Widgets
  widgetsCard: {
    borderRadius: Radius.xl, borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
    marginBottom: Spacing.xs, overflow: 'hidden',
  },
  widgetsBanner: {
    flexDirection: 'row', alignItems: 'center',
    padding: 18, gap: 0,
  },
  widgetsBannerTitle: { fontSize: 16, color: '#fff' },
  widgetsBannerSub: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 3 },
  widgetsSetupTitle: { fontSize: 14 },
  widgetsStep: { alignItems: 'center', gap: 0 },
  widgetsStepNum: {
    width: 28, height: 28, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center',
  },
  widgetsStepNumText: { fontSize: 13 },
  widgetsStepLabel: { fontSize: 14 },

  // Settings 2×2 grid
  settingGrid: { gap: Spacing.sm, marginBottom: Spacing.xs },
  settingGridRow: { gap: Spacing.sm },
  settingCard: {
    flex: 1, borderRadius: Radius.xl, borderWidth: 1,
    padding: Spacing.md, gap: Spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 2,
  },
  settingCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  settingCardIcon: {
    width: 32, height: 32, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  settingCardTitle: { flex: 1, fontSize: 12, fontFamily: F.med, letterSpacing: 0.1 },
  settingCardOptions: { flexDirection: 'row', gap: 5 },
  settingCardOption: {
    flex: 1, borderRadius: Radius.md, borderWidth: 1.5,
    paddingVertical: 7, alignItems: 'center', justifyContent: 'center',
  },
  settingCardOptionText: { fontSize: 12, textAlign: 'center' },
});
