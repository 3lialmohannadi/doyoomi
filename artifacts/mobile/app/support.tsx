import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Platform, Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { useSettingsStore } from '../src/store/settingsStore';
import { useAppTheme } from '../src/hooks/useAppTheme';
import { t } from '../src/utils/i18n';
import { Spacing, Radius, Shadow } from '../src/theme';

const SUPPORT_EMAIL = 'admin@doyoomi.com';

const CATEGORIES = [
  { key: 'suggestion',     icon: 'bulb-outline',         color: '#FFB800' },
  { key: 'technicalIssue', icon: 'bug-outline',           color: '#FF4D6A' },
  { key: 'other',          icon: 'help-circle-outline',   color: '#7C5CFC' },
];

export default function SupportScreen() {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const isRTL = lang === 'ar';
  const tFunc = (key: string) => t(key, lang);
  const topPad = isWeb ? 67 : insets.top;

  const [category, setCategory] = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [mailError, setMailError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [messageError, setMessageError] = useState(false);

  const selectedCat = CATEGORIES.find(c => c.key === category)!;

  const handleSend = async () => {
    let hasError = false;
    if (!subject.trim()) { setSubjectError(true); hasError = true; }
    if (!message.trim()) { setMessageError(true); hasError = true; }
    if (hasError) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); return; }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const catLabel = tFunc(category);
    const emailSubject = `[${catLabel}] ${subject.trim()}`;
    const emailBody = `${message.trim()}\n\n──────────────\nApp: Do.Yoomi v1.0.0`;
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    try {
      await Linking.openURL(mailto);
      setSent(true);
    } catch {
      setMailError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setMailError(false);
    setSubject('');
    setMessage('');
    setCategory('suggestion');
    setSubjectError(false);
    setMessageError(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      <LinearGradient
        colors={['#7C5CFC', '#A855F7']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: topPad + Spacing.sm }]}
      >
        <View style={styles.headerDecor1} />
        <View style={styles.headerDecor2} />
        <View style={[styles.headerRow, isRTL && { flexDirection: 'row-reverse' }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Ionicons name={isRTL ? 'chevron-forward' : 'chevron-back'} size={24} color="#fff" />
          </Pressable>
          <Text style={styles.headerTitle}>{tFunc('support')}</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={[styles.headerSub, { textAlign: isRTL ? 'right' : 'left' }]}>
          {tFunc('supportSubtitle')}
        </Text>
      </LinearGradient>

      {sent ? (
        <View style={styles.centerState}>
          <View style={[styles.stateIconBox, { backgroundColor: '#00C48C18' }]}>
            <Ionicons name="checkmark-circle" size={64} color="#00C48C" />
          </View>
          <Text style={[styles.stateTitle, { color: C.text }]}>{tFunc('messagePrepared')}</Text>
          <Text style={[styles.stateSub, { color: C.textSecondary }]}>{tFunc('messagePreparedDesc')}</Text>
          <Pressable onPress={handleReset} style={styles.stateBtn}>
            <LinearGradient colors={['#7C5CFC', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
            <Ionicons name="create-outline" size={18} color="#fff" />
            <Text style={styles.stateBtnText}>{tFunc('sendAnother')}</Text>
          </Pressable>
        </View>
      ) : mailError ? (
        <View style={styles.centerState}>
          <View style={[styles.stateIconBox, { backgroundColor: '#FF4D6A18' }]}>
            <Ionicons name="alert-circle" size={64} color="#FF4D6A" />
          </View>
          <Text style={[styles.stateTitle, { color: C.text }]}>{tFunc('mailFailed')}</Text>
          <Text style={[styles.stateSub, { color: C.textSecondary }]}>{tFunc('mailFailedDesc')}</Text>
          <Text style={[styles.emailHint, { color: C.tint, marginTop: 4 }]}>{SUPPORT_EMAIL}</Text>
          <Pressable onPress={() => setMailError(false)} style={[styles.stateBtn, { marginTop: Spacing.xl }]}>
            <LinearGradient colors={['#7C5CFC', '#A855F7']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.stateBtnText}>{tFunc('tryAgain')}</Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: Spacing.xl, paddingBottom: insets.bottom + 100, gap: Spacing.xl }}
          keyboardShouldPersistTaps="handled"
          bottomOffset={80}
        >
          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {tFunc('supportCategory')}
            </Text>
            <View style={[styles.categoryRow, isRTL && { flexDirection: 'row-reverse' }]}>
              {CATEGORIES.map(cat => {
                const isActive = category === cat.key;
                return (
                  <Pressable
                    key={cat.key}
                    onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setCategory(cat.key); }}
                    style={[
                      styles.categoryChip,
                      {
                        backgroundColor: isActive ? cat.color + '1E' : C.surface,
                        borderColor: isActive ? cat.color : C.border,
                        borderWidth: isActive ? 2 : 1,
                        flex: 1,
                      },
                    ]}
                  >
                    <Ionicons name={cat.icon as any} size={17} color={isActive ? cat.color : C.textMuted} />
                    <Text style={[styles.chipText, { color: isActive ? cat.color : C.textSecondary }]} numberOfLines={1}>
                      {tFunc(cat.key)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {tFunc('supportSubjectField')}
            </Text>
            <TextInput
              value={subject}
              onChangeText={(v) => { setSubject(v); if (v.trim()) setSubjectError(false); }}
              placeholder={tFunc('supportSubjectPlaceholder')}
              placeholderTextColor={C.textMuted}
              style={[
                styles.input,
                {
                  backgroundColor: C.inputBg,
                  borderColor: subjectError ? '#FF4D6A' : C.border,
                  color: C.text,
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            />
            {subjectError && (
              <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {tFunc('fieldRequired')}
              </Text>
            )}
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.fieldLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
              {tFunc('supportMessage')}
            </Text>
            <TextInput
              value={message}
              onChangeText={(v) => { setMessage(v); if (v.trim()) setMessageError(false); }}
              placeholder={tFunc('supportMessagePlaceholder')}
              placeholderTextColor={C.textMuted}
              multiline
              numberOfLines={5}
              style={[
                styles.input,
                styles.messageInput,
                {
                  backgroundColor: C.inputBg,
                  borderColor: messageError ? '#FF4D6A' : C.border,
                  color: C.text,
                  textAlign: isRTL ? 'right' : 'left',
                  textAlignVertical: 'top',
                },
              ]}
            />
            {messageError && (
              <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {tFunc('fieldRequired')}
              </Text>
            )}
          </View>

          <Pressable onPress={handleSend} disabled={loading} style={[styles.sendBtn, { opacity: loading ? 0.7 : 1 }]}>
            <LinearGradient
              colors={[selectedCat.color, '#7C5CFC']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
            />
            <Ionicons name={loading ? 'hourglass-outline' : 'send'} size={19} color="#fff" />
            <Text style={styles.sendBtnText}>{loading ? '...' : tFunc('sendMessage')}</Text>
          </Pressable>

          <Text style={[styles.emailHint, { color: C.textMuted }]}>{SUPPORT_EMAIL}</Text>
        </KeyboardAwareScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxl,
    position: 'relative',
    overflow: 'hidden',
  },
  headerDecor1: {
    position: 'absolute', right: -30, top: -30,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerDecor2: {
    position: 'absolute', left: 40, top: 50,
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  headerTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', color: '#fff' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginTop: 2 },

  centerState: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.xxxl, gap: Spacing.md,
  },
  stateIconBox: {
    width: 110, height: 110, borderRadius: 55,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  stateTitle: { fontSize: 22, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  stateSub: { fontSize: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', lineHeight: 22 },
  emailHint: { fontSize: 13, fontFamily: 'Inter_500Medium', textAlign: 'center' },
  stateBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: Radius.xl, height: 52,
    paddingHorizontal: Spacing.xxl,
    overflow: 'hidden', marginTop: Spacing.lg,
  },
  stateBtnText: { fontSize: 16, fontFamily: 'Inter_600SemiBold', color: '#fff' },

  fieldGroup: { gap: Spacing.sm },
  fieldLabel: {
    fontSize: 13, fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  categoryRow: { flexDirection: 'row', gap: Spacing.sm },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, borderRadius: Radius.lg,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.sm,
  },
  chipText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  input: {
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 16, fontFamily: 'Inter_400Regular', height: 52,
  },
  messageInput: {
    height: 130, paddingTop: Spacing.md,
  },
  errorText: {
    fontSize: 12, fontFamily: 'Inter_500Medium', color: '#FF4D6A',
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, borderRadius: Radius.xl, height: 56,
    overflow: 'hidden',
    ...Shadow.md,
  },
  sendBtnText: { fontSize: 17, fontFamily: 'Inter_700Bold', color: '#fff' },
});
