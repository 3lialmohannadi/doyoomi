import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Language } from '../../types';
import { F, Radius, Spacing } from '../../theme';
import { t } from '../../utils/i18n';

interface BilingualNameFieldProps {
  lang: Language;
  nameAr: string;
  nameEn: string;
  onChangeAr: (v: string) => void;
  onChangeEn: (v: string) => void;
  error: boolean;
  onClearError: () => void;
  labelKey?: 'name' | 'title';
  placeholderAr?: string;
  placeholderEn?: string;
}

export function BilingualNameField({
  lang,
  nameAr,
  nameEn,
  onChangeAr,
  onChangeEn,
  error,
  onClearError,
  labelKey = 'name',
  placeholderAr = 'مثال: رياضة',
  placeholderEn = 'e.g. Workout',
}: BilingualNameFieldProps) {
  const { C } = useAppTheme();
  const isRTL = lang === 'ar';

  const arLabel  = labelKey === 'title' ? t('titleInArabic',  lang) : t('nameInArabic',  lang);
  const enLabel  = labelKey === 'title' ? t('titleInEnglish', lang) : t('nameInEnglish', lang);
  const errLabel = labelKey === 'title' ? t('atLeastOneTitle', lang) : t('atLeastOneName', lang);
  const optLabel = t('optional', lang);

  const inputBase = {
    backgroundColor: C.inputBg,
    color: C.text,
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 15,
    fontFamily: F.reg,
    minHeight: 48,
  };

  return (
    <View style={styles.wrapper}>
      {/* Arabic input — always RTL */}
      <View style={styles.subField}>
        <View style={[styles.subLabelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.subLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {arLabel}
          </Text>
          <Text style={[styles.optTag, { color: C.textMuted }]}>{optLabel}</Text>
        </View>
        <TextInput
          value={nameAr}
          onChangeText={(v) => { onChangeAr(v); if (v.trim() || nameEn.trim()) onClearError(); }}
          placeholder={placeholderAr}
          placeholderTextColor={C.textMuted}
          textAlign="right"
          style={[inputBase, { borderColor: error && !nameAr.trim() && !nameEn.trim() ? C.error : C.border }]}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/* English input — always LTR */}
      <View style={styles.subField}>
        <View style={[styles.subLabelRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Text style={[styles.subLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
            {enLabel}
          </Text>
          <Text style={[styles.optTag, { color: C.textMuted }]}>{optLabel}</Text>
        </View>
        <TextInput
          value={nameEn}
          onChangeText={(v) => { onChangeEn(v); if (v.trim() || nameAr.trim()) onClearError(); }}
          placeholder={placeholderEn}
          placeholderTextColor={C.textMuted}
          textAlign="left"
          style={[inputBase, { borderColor: error && !nameAr.trim() && !nameEn.trim() ? C.error : C.border }]}
          autoCapitalize="sentences"
        />
      </View>

      {/* Error */}
      {error && !nameAr.trim() && !nameEn.trim() && (
        <View style={[styles.errorRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Ionicons name="alert-circle-outline" size={14} color={C.error} />
          <Text style={[styles.errorText, { color: C.error }]}>{errLabel}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: Spacing.sm },
  subField: { gap: 4 },
  subLabelRow: { alignItems: 'center', gap: 6, marginBottom: 2 },
  subLabel: { fontSize: 13, fontFamily: F.med },
  optTag: { fontSize: 11, fontFamily: F.reg },
  errorRow: { alignItems: 'center', gap: 4, marginTop: 2 },
  errorText: { fontSize: 12, fontFamily: F.med },
});
