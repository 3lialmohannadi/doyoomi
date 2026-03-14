import React from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet,
  TextInput, Platform, KeyboardAvoidingView,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';

interface FormModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
}

export function FormModal({
  visible, title, onClose, onSave,
  saveLabel = 'Save', cancelLabel = 'Cancel', children,
}: FormModalProps) {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'android' ? 24 : 0}
      >
        <View style={[styles.container, { backgroundColor: C.background }]}>
          <View style={[styles.header, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.cancelBtn, { opacity: pressed ? 0.6 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Ionicons name="close" size={22} color={C.textSecondary} />
            </Pressable>
            <Text style={[styles.headerTitle, { color: C.text }]} accessibilityRole="header">{title}</Text>
            <View style={{ width: 36 }} />
          </View>

          <KeyboardAwareScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
            keyboardShouldPersistTaps="handled"
            bottomOffset={80}
          >
            {children}
          </KeyboardAwareScrollView>

          <View style={[
            styles.bottomBar,
            {
              paddingBottom: insets.bottom + Spacing.md,
              backgroundColor: C.background,
              borderTopColor: C.border,
            },
          ]}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}
              style={({ pressed }) => [
                styles.bottomBtn,
                { backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, opacity: pressed ? 0.7 : 1 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={cancelLabel}
            >
              <Text style={[styles.bottomBtnText, { color: C.textSecondary }]}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); onSave(); }}
              style={({ pressed }) => [styles.bottomBtnSave, { opacity: pressed ? 0.85 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel={saveLabel}
            >
              <LinearGradient
                colors={['#7C5CFC', '#FF6B9D']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
              />
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.bottomBtnSaveText}>{saveLabel}</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FieldProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

interface InputProps {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  keyboardType?: any;
  error?: boolean;
}

export function FormInput({ value, onChangeText, placeholder, multiline, keyboardType, error }: InputProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.textMuted}
      multiline={multiline}
      keyboardType={keyboardType}
      accessibilityLabel={placeholder}
      textAlign={isRTL ? 'right' : 'left'}
      style={[
        styles.input,
        {
          backgroundColor: C.inputBg,
          borderColor: error ? C.error : C.border,
          color: C.text,
          minHeight: multiline ? 90 : 48,
          textAlignVertical: multiline ? 'top' : 'center',
          borderWidth: error ? 1.5 : 1,
        },
      ]}
    />
  );
}

interface SelectProps {
  options: { key: string; label: string }[];
  value: string;
  onChange: (key: string) => void;
}

export function FormSelect({ options, value, onChange }: SelectProps) {
  const { C } = useAppTheme();

  return (
    <View style={styles.selectRow}>
      {options.map((opt) => {
        const isActive = opt.key === value;
        return (
          <Pressable
            key={opt.key}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(opt.key); }}
            style={({ pressed }) => [
              styles.selectOption,
              {
                backgroundColor: isActive ? C.tint + '20' : C.surface,
                borderColor: isActive ? C.tint : C.border,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.selectText, { color: isActive ? C.tint : C.textSecondary }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface FormPressableInputProps {
  value: string;
  placeholder: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  error?: boolean;
}

export function FormPressableInput({ value, placeholder, icon, onPress, error }: FormPressableInputProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  return (
    <Pressable
      onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress(); }}
      style={({ pressed }) => [
        styles.pressableInput,
        {
          backgroundColor: C.inputBg,
          borderColor: error ? C.error : C.border,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          opacity: pressed ? 0.75 : 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={placeholder}
    >
      <Ionicons name={icon} size={18} color={C.tint} />
      <Text style={[styles.pressableInputText, { color: value ? C.text : C.textMuted, textAlign: isRTL ? 'right' : 'left' }]}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-down" size={16} color={C.textMuted} />
    </Pressable>
  );
}

interface PrioritySelectorProps {
  value: string;
  onChange: (key: string) => void;
  options: { key: string; label: string }[];
}

export function PrioritySelector({ value, onChange, options }: PrioritySelectorProps) {
  const { C } = useAppTheme();
  const priorityColors: Record<string, string> = {
    low: C.priorityLow,
    medium: C.priorityMedium,
    high: C.priorityHigh,
  };

  return (
    <View style={styles.priorityRow}>
      {options.map((opt) => {
        const isActive = opt.key === value;
        const color = priorityColors[opt.key] || C.tint;
        return (
          <Pressable
            key={opt.key}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(opt.key); }}
            style={({ pressed }) => [
              styles.priorityOption,
              {
                backgroundColor: isActive ? color + '20' : C.surface,
                borderColor: isActive ? color : C.border,
                borderWidth: isActive ? 2 : 1,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={opt.label}
          >
            <View style={[styles.priorityDot, { backgroundColor: color }]} />
            <Text style={[
              styles.priorityText,
              { color: isActive ? color : C.textSecondary, fontFamily: isActive ? 'Inter_600SemiBold' : 'Inter_400Regular' },
            ]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

interface CategoryOption {
  key: string;
  label: string;
  color?: string;
  icon?: string;
}

interface CategorySelectorProps {
  value: string;
  onChange: (key: string) => void;
  options: CategoryOption[];
}

export function CategorySelector({ value, onChange, options }: CategorySelectorProps) {
  const { C } = useAppTheme();

  return (
    <View style={styles.categoryGrid}>
      {options.map((opt) => {
        const isActive = opt.key === value;
        const color = opt.color || C.textMuted;
        return (
          <Pressable
            key={opt.key}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onChange(opt.key); }}
            style={({ pressed }) => [
              styles.categoryChip,
              {
                backgroundColor: isActive ? color + '20' : C.surface,
                borderColor: isActive ? color : C.border,
                borderWidth: isActive ? 2 : 1,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={opt.label}
          >
            {opt.icon ? (
              <Ionicons name={(opt.icon + '-outline') as any} size={16} color={isActive ? color : C.textMuted} />
            ) : null}
            <Text style={[styles.categoryText, { color: isActive ? color : C.textSecondary }]} numberOfLines={1}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  cancelBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.xl,
    gap: Spacing.xl,
  },
  field: {
    gap: Spacing.sm,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectOption: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  pressableInput: {
    alignItems: 'center',
    gap: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    height: 52,
  },
  pressableInputText: {
    flex: 1,
    fontSize: 17,
    fontFamily: 'Inter_400Regular',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  priorityOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md + 2,
    paddingHorizontal: Spacing.sm,
  },
  priorityDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  priorityText: {
    fontSize: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 4,
  },
  categoryText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
  },
  bottomBar: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  bottomBtn: {
    flex: 1,
    borderRadius: Radius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBtnText: {
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
  },
  bottomBtnSave: {
    flex: 2,
    flexDirection: 'row',
    borderRadius: Radius.xl,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    overflow: 'hidden',
  },
  bottomBtnSaveText: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
