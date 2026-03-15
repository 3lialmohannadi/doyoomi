import React from 'react';
import { View, Text, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';
import { Radius, Spacing } from '../../theme';

export type ConfirmDialogType = 'danger' | 'warning' | 'default';

interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmDialogType;
  onConfirm: () => void;
  onCancel: () => void;
}

const TYPE_CONFIG: Record<ConfirmDialogType, { color: string; icon: string; gradient: [string, string] }> = {
  danger:  { color: '#FF4D6A', icon: 'trash-outline',        gradient: ['#FF4D6A', '#FF8E53'] },
  warning: { color: '#FFB800', icon: 'warning-outline',      gradient: ['#FFB800', '#FF6B35'] },
  default: { color: '#7C5CFC', icon: 'help-circle-outline',  gradient: ['#7C5CFC', '#A855F7'] },
};

export function ConfirmDialog({
  visible, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  type = 'danger', onConfirm, onCancel,
}: ConfirmDialogProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';
  const cfg = TYPE_CONFIG[type];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={[styles.card, { backgroundColor: C.card }]} onPress={() => {}}>
          <View style={[styles.iconCircle, { backgroundColor: cfg.color + '15' }]}>
            <Ionicons name={cfg.icon as any} size={32} color={cfg.color} />
          </View>
          <Text style={[styles.title, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{message}</Text>
          ) : null}
          <View style={styles.btnRow}>
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onCancel(); }}
              style={[styles.cancelBtn, { backgroundColor: C.surface, borderColor: C.border }]}
            >
              <Text style={[styles.cancelText, { color: C.textSecondary }]}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning); onConfirm(); }}
              style={[styles.confirmBtn, { overflow: 'hidden' }]}
            >
              <LinearGradient
                colors={cfg.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
              />
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  card: {
    width: '100%',
    borderRadius: Radius.xxl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  iconCircle: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    width: '100%',
  },
  message: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
    width: '100%',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    width: '100%',
    marginTop: Spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: Radius.xl,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },
});
