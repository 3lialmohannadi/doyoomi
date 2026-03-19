import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

function ActionPanel({
  icon,
  label,
  color,
  width = 80,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label?: string;
  color: string;
  width?: number;
}) {
  return (
    <View style={[styles.actionPanel, { backgroundColor: color, width }]}>
      <Ionicons name={icon} size={22} color="#fff" />
      {label ? <Text style={styles.actionLabel}>{label}</Text> : null}
    </View>
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
  const actionFired = useRef(false);

  const handleOpen = useCallback(
    (direction: 'left' | 'right') => {
      if (actionFired.current) return;
      actionFired.current = true;

      swipeRef.current?.close();

      if (!isRTL) {
        if (direction === 'left') {
          if (onPostpone) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPostpone();
          } else if (onComplete) {
            if (completeHaptic === 'light') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            onComplete();
          }
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onDelete();
        }
      } else {
        if (direction === 'right') {
          if (onPostpone) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPostpone();
          } else if (onComplete) {
            if (completeHaptic === 'light') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            } else {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            onComplete();
          }
        } else {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onDelete();
        }
      }
    },
    [isRTL, onComplete, onDelete, onPostpone, onCancel, completeHaptic],
  );

  const handleClose = useCallback(() => {
    actionFired.current = false;
  }, []);

  const renderLeftLTR = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => {
      if (onPostpone) {
        return (
          <ActionPanel
            icon="time-outline"
            label={postponeLabel}
            color="#F59E0B"
          />
        );
      }
      if (onComplete) {
        return (
          <ActionPanel
            icon={completeIcon ?? 'checkmark-circle'}
            label={completeLabel}
            color={completeColor ?? '#22C55E'}
          />
        );
      }
      return null;
    },
    [onPostpone, onComplete, postponeLabel, completeLabel, completeIcon, completeColor],
  );

  const renderRightLTR = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => (
      <View style={styles.multiPanel}>
        {onCancel && (
          <ActionPanel
            icon="close-circle-outline"
            label={cancelLabel}
            color="#94A3B8"
            width={72}
          />
        )}
        <ActionPanel
          icon="trash-outline"
          label={deleteLabel}
          color="#EF4444"
          width={72}
        />
      </View>
    ),
    [onCancel, cancelLabel, deleteLabel],
  );

  const renderLeftRTL = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => (
      <View style={styles.multiPanel}>
        <ActionPanel
          icon="trash-outline"
          label={deleteLabel}
          color="#EF4444"
          width={72}
        />
        {onCancel && (
          <ActionPanel
            icon="close-circle-outline"
            label={cancelLabel}
            color="#94A3B8"
            width={72}
          />
        )}
      </View>
    ),
    [onCancel, cancelLabel, deleteLabel],
  );

  const renderRightRTL = useCallback(
    (_progress: SharedValue<number>, _translation: SharedValue<number>) => {
      if (onPostpone) {
        return (
          <ActionPanel
            icon="time-outline"
            label={postponeLabel}
            color="#F59E0B"
          />
        );
      }
      if (onComplete) {
        return (
          <ActionPanel
            icon={completeIcon ?? 'checkmark-circle'}
            label={completeLabel}
            color={completeColor ?? '#22C55E'}
          />
        );
      }
      return null;
    },
    [onPostpone, onComplete, postponeLabel, completeLabel, completeIcon, completeColor],
  );

  const hasLeftLTR = !isRTL && (onPostpone != null || onComplete != null);
  const hasRightLTR = !isRTL;
  const hasLeftRTL = isRTL;
  const hasRightRTL = isRTL && (onPostpone != null || onComplete != null);

  const thresholdRight = onCancel ? 144 : 72;

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={72}
      rightThreshold={thresholdRight}
      renderLeftActions={!isRTL ? (hasLeftLTR ? renderLeftLTR : undefined) : (hasLeftRTL ? renderLeftRTL : undefined)}
      renderRightActions={!isRTL ? (hasRightLTR ? renderRightLTR : undefined) : (hasRightRTL ? renderRightRTL : undefined)}
      onSwipeableOpen={handleOpen}
      onSwipeableClose={handleClose}
    >
      {children}
    </ReanimatedSwipeable>
  );
}

const styles = StyleSheet.create({
  actionPanel: {
    width: 80,
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
