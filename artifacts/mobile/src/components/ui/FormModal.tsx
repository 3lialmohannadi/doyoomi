import React from 'react';
import {
  Modal, View, Text, Pressable, StyleSheet, ScrollView,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Radius, Shadow, Spacing, Typography } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';

interface FormModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  children: React.ReactNode;
}

export function FormModal({ visible, title, onClose, onSave, saveLabel = 'Save', cancelLabel = 'Cancel', children }: FormModalProps) {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.container, { backgroundColor: C.background }]}>
          <View style={[styles.header, { borderBottomColor: C.border }]}>
            <Pressable onPress={onClose} style={styles.headerBtn}>
              <Text style={[styles.headerBtnText, { color: C.textSecondary }]}>{cancelLabel}</Text>
            </Pressable>
            <Text style={[styles.headerTitle, { color: C.text }]}>{title}</Text>
            <Pressable onPress={onSave} style={styles.headerBtn}>
              <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.saveGradient}>
                <Text style={styles.saveText}>{saveLabel}</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
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

  return (
    <View style={styles.field}>
      <Text style={[styles.fieldLabel, { color: C.textSecondary }]}>{label}</Text>
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
}

export function FormInput({ value, onChangeText, placeholder, multiline, keyboardType }: InputProps) {
  const { C } = useAppTheme();

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={C.textMuted}
      multiline={multiline}
      keyboardType={keyboardType}
      style={[
        styles.input,
        {
          backgroundColor: C.inputBg,
          borderColor: C.border,
          color: C.text,
          minHeight: multiline ? 80 : 44,
          textAlignVertical: multiline ? 'top' : 'center',
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
            onPress={() => onChange(opt.key)}
            style={[
              styles.selectOption,
              {
                backgroundColor: isActive ? C.tint + '20' : C.surface,
                borderColor: isActive ? C.tint : C.border,
              },
            ]}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  headerBtn: {},
  headerBtnText: {
    ...Typography.body,
  },
  headerTitle: {
    ...Typography.subtitle,
    fontFamily: 'Inter_600SemiBold',
  },
  saveGradient: {
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  saveText: {
    ...Typography.captionMedium,
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  scroll: { flex: 1 },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  field: {
    gap: Spacing.xs,
  },
  fieldLabel: {
    ...Typography.caption,
    fontFamily: 'Inter_500Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    ...Typography.body,
  },
  selectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  selectOption: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  selectText: {
    ...Typography.captionMedium,
  },
});
