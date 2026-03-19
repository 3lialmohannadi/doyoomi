import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ReanimatedSwipeable, { SwipeableMethods } from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { F } from '../../theme';

interface SwipeableRowProps {
  children: React.ReactNode;
  isRTL?: boolean;
  onComplete?: () => void;
  onDelete: () => void;
  onPostpone?: () => void;
  onCancel?: () => void;
  completeLabel?: string;
  deleteLabel?: string;
  postponeLabel?: string;
  cancelLabel?: string;
  completeIcon?: React.ComponentProps<typeof Ionicons>['name'];
  completeColor?: string;
  completeHaptic?: 'success' | 'light';
}

function ActionButton({
  icon,
  label,
  color,
  width = 80,
  onPress,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label?: string;
  color: string;
  width?: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.actionPanel, { backgroundColor: color, width }]}
    >
      <Ionicons name={icon} size={22} color="#fff" />
      {label ? <Text style={styles.actionLabel}>{label}</Text> : null}
    </TouchableOpacity>
  );
}

export function SwipeableRow({
  children,
  isRTL,
  onComplete,
  onDelete,
  onPostpone,
  onCancel,
  completeLabel,
  deleteLabel,
  postponeLabel,
  cancelLabel,
  completeIcon,
  completeColor,
  completeHaptic = 'success',
}: SwipeableRowProps) {
  const swipeRef = useRef<SwipeableMethods | null>(null);

  const close = useCallback(() => {
    swipeRef.current?.close();
  }, []);

  const handleComplete = useCallback(() => {
    close();
    if (completeHaptic === 'light') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    onComplete?.();
  }, [close, completeHaptic, onComplete]);

  const handlePostpone = useCallback(() => {
    close();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPostpone?.();
  }, [close, onPostpone]);

  const handleCancel = useCallback(() => {
    close();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onCancel?.();
  }, [close, onCancel]);

  const handleDelete = useCallback(() => {
    close();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onDelete();
  }, [close, onDelete]);

  // LTR: right swipe (left panel) = Delete; left swipe (right panel) = Archive/Complete
  // RTL: mirrored — left swipe (left panel) = Archive/Complete; right swipe (right panel) = Delete
  const renderLeftLTR = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => (
      <View style={styles.multiPanel}>
        {onCancel && (
          <ActionButton
            icon="close-circle-outline"
            label={cancelLabel}
            color="#94A3B8"
            width={72}
            onPress={handleCancel}
          />
        )}
        <ActionButton
          icon="trash-outline"
          label={deleteLabel}
          color="#EF4444"
          width={72}
          onPress={handleDelete}
        />
      </View>
    ),
    [onCancel, cancelLabel, deleteLabel, handleCancel, handleDelete],
  );

  const renderRightLTR = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => {
      if (onPostpone) {
        return (
          <ActionButton
            icon="time-outline"
            label={postponeLabel}
            color="#F59E0B"
            onPress={handlePostpone}
          />
        );
      }
      if (onComplete) {
        return (
          <ActionButton
            icon={completeIcon ?? 'checkmark-circle'}
            label={completeLabel}
            color={completeColor ?? '#22C55E'}
            onPress={handleComplete}
          />
        );
      }
      return null;
    },
    [onPostpone, onComplete, postponeLabel, completeLabel, completeIcon, completeColor, handlePostpone, handleComplete],
  );

  const renderLeftRTL = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => {
      if (onPostpone) {
        return (
          <ActionButton
            icon="time-outline"
            label={postponeLabel}
            color="#F59E0B"
            onPress={handlePostpone}
          />
        );
      }
      if (onComplete) {
        return (
          <ActionButton
            icon={completeIcon ?? 'checkmark-circle'}
            label={completeLabel}
            color={completeColor ?? '#22C55E'}
            onPress={handleComplete}
          />
        );
      }
      return null;
    },
    [onPostpone, onComplete, postponeLabel, completeLabel, completeIcon, completeColor, handlePostpone, handleComplete],
  );

  const renderRightRTL = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => (
      <View style={styles.multiPanel}>
        <ActionButton
          icon="trash-outline"
          label={deleteLabel}
          color="#EF4444"
          width={72}
          onPress={handleDelete}
        />
        {onCancel && (
          <ActionButton
            icon="close-circle-outline"
            label={cancelLabel}
            color="#94A3B8"
            width={72}
            onPress={handleCancel}
          />
        )}
      </View>
    ),
    [onCancel, cancelLabel, deleteLabel, handleCancel, handleDelete],
  );

  const hasLeftLTR = !isRTL;
  const hasRightLTR = !isRTL && (onPostpone != null || onComplete != null);
  const hasLeftRTL = isRTL && (onPostpone != null || onComplete != null);
  const hasRightRTL = isRTL;

  const leftThreshold = onCancel ? 144 : 72;
  const rightThreshold = onCancel && isRTL ? 144 : 72;

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={leftThreshold}
      rightThreshold={rightThreshold}
      renderLeftActions={!isRTL ? (hasLeftLTR ? renderLeftLTR : undefined) : (hasLeftRTL ? renderLeftRTL : undefined)}
      renderRightActions={!isRTL ? (hasRightLTR ? renderRightLTR : undefined) : (hasRightRTL ? renderRightRTL : undefined)}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  actionPanel: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  multiPanel: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: F.bold,
    color: '#fff',
    textAlign: 'center',
  },
});
