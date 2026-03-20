import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing, F, GRADIENT_H } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';

export interface ActionSheetAction {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
  style?: 'default' | 'destructive' | 'cancel';
  color?: string;
}

interface ActionSheetProps {
  visible: boolean;
  title?: string;
  subtitle?: string;
  actions: ActionSheetAction[];
  onClose: () => void;
}

export function ActionSheet({ visible, title, subtitle, actions, onClose }: ActionSheetProps) {
  const { C, scheme } = useAppTheme();
  const isDark = scheme === 'dark';
  const insets = useSafeAreaInsets();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  const nonCancelActions = actions.filter(a => a.style !== 'cancel');
  const cancelAction = actions.find(a => a.style === 'cancel');

  const getActionColor = (action: ActionSheetAction) => {
    if (action.color) return action.color;
    if (action.style === 'destructive') return C.error;
    return C.tint;
  };

  const handleActionPress = (action: ActionSheetAction) => {
    Haptics.impactAsync(
      action.style === 'destructive'
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
    onClose();
    setTimeout(action.onPress, 100);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: isDark ? '#1C1A2E' : C.card, paddingBottom: insets.bottom + 8 }]}
          onPress={() => {}}
        >
          <View style={[styles.handle, { backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' }]} />

          {(title || subtitle) && (
            <View style={[styles.titleBlock, { alignItems: isRTL ? 'flex-end' : 'flex-start', borderBottomColor: C.border }]}>
              {title && (
                <Text style={[styles.titleText, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={1}>
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text style={[styles.subtitleText, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]} numberOfLines={2}>
                  {subtitle}
                </Text>
              )}
            </View>
          )}

          <View style={[styles.actionsBlock, { borderColor: C.border }]}>
            {nonCancelActions.map((action, idx) => {
              const color = getActionColor(action);
              const isLast = idx === nonCancelActions.length - 1;
              return (
                <Pressable
                  key={action.label}
                  onPress={() => handleActionPress(action)}
                  style={({ pressed }) => [
                    styles.actionRow,
                    { flexDirection: isRTL ? 'row-reverse' : 'row', opacity: pressed ? 0.65 : 1 },
                    !isLast && { borderBottomColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderBottomWidth: 1 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                >
                  <View style={[styles.actionIconWrap, { backgroundColor: color + '16' }]}>
                    <Ionicons name={action.icon} size={19} color={color} />
                  </View>
                  <Text style={[styles.actionLabel, { color, textAlign: isRTL ? 'right' : 'left' }]}>{action.label}</Text>
                  <Ionicons
                    name={isRTL ? 'chevron-back' : 'chevron-forward'}
                    size={16}
                    color={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}
                  />
                </Pressable>
              );
            })}
          </View>

          {cancelAction && (
            <Pressable
              onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onClose(); }}
              style={({ pressed }) => [styles.cancelBtn, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)', opacity: pressed ? 0.7 : 1 }]}
              accessibilityRole="button"
              accessibilityLabel={cancelAction.label}
            >
              <Text style={[styles.cancelLabel, { color: C.textSecondary }]}>{cancelAction.label}</Text>
            </Pressable>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.48)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 24,
  },
  handle: {
    width: 44, height: 5, borderRadius: 3,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  titleBlock: {
    gap: 3,
    paddingBottom: Spacing.md,
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  titleText: {
    fontSize: 17,
    fontFamily: F.bold,
  },
  subtitleText: {
    fontSize: 13,
    fontFamily: F.reg,
    lineHeight: 18,
  },
  actionsBlock: {
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  actionRow: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 3,
  },
  actionIconWrap: {
    width: 38, height: 38, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  actionLabel: {
    flex: 1,
    fontSize: 17,
    fontFamily: F.med,
  },
  cancelBtn: {
    height: 52,
    borderRadius: Radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  cancelLabel: {
    fontSize: 17,
    fontFamily: F.med,
  },
});
