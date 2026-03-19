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
  completeLabel?: string;
  deleteLabel?: string;
}

function CompleteAction({
  methods,
  onComplete,
  label,
}: {
  methods: SwipeableMethods;
  onComplete: () => void;
  label?: string;
}) {
  return (
    <View style={[styles.actionPanel, styles.completePanel]}>
      <Ionicons name="checkmark-circle" size={26} color="#fff" />
      {label ? <Text style={styles.actionLabel}>{label}</Text> : null}
    </View>
  );
}

function DeleteAction({
  methods,
  onDelete,
  label,
}: {
  methods: SwipeableMethods;
  onDelete: () => void;
  label?: string;
}) {
  return (
    <View style={[styles.actionPanel, styles.deletePanel]}>
      <Ionicons name="trash-outline" size={22} color="#fff" />
      {label ? <Text style={styles.actionLabel}>{label}</Text> : null}
    </View>
  );
}

export function SwipeableRow({
  children,
  isRTL,
  onComplete,
  onDelete,
  completeLabel,
  deleteLabel,
}: SwipeableRowProps) {
  const swipeRef = useRef<SwipeableMethods | null>(null);
  const actionFired = useRef(false);

  const handleOpen = useCallback(
    (direction: 'left' | 'right') => {
      if (actionFired.current) return;
      actionFired.current = true;

      const isCompleteDir = isRTL
        ? direction === 'right'
        : direction === 'left';

      if (isCompleteDir && onComplete) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onComplete();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        onDelete();
      }
      swipeRef.current?.close();
    },
    [isRTL, onComplete, onDelete],
  );

  const handleClose = useCallback(() => {
    actionFired.current = false;
  }, []);

  const renderComplete = useCallback(
    (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      methods: SwipeableMethods,
    ) => (
      <CompleteAction
        methods={methods}
        onComplete={onComplete ?? (() => {})}
        label={completeLabel}
      />
    ),
    [onComplete, completeLabel],
  );

  const renderDelete = useCallback(
    (
      _progress: SharedValue<number>,
      _translation: SharedValue<number>,
      methods: SwipeableMethods,
    ) => (
      <DeleteAction
        methods={methods}
        onDelete={onDelete}
        label={deleteLabel}
      />
    ),
    [onDelete, deleteLabel],
  );

  const leftActions = !isRTL
    ? onComplete
      ? renderComplete
      : undefined
    : renderDelete;

  const rightActions = !isRTL
    ? renderDelete
    : onComplete
      ? renderComplete
      : undefined;

  return (
    <ReanimatedSwipeable
      ref={swipeRef}
      friction={2}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={72}
      rightThreshold={72}
      renderLeftActions={leftActions}
      renderRightActions={rightActions}
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
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  completePanel: {
    backgroundColor: '#22C55E',
  },
  deletePanel: {
    backgroundColor: '#EF4444',
  },
  actionLabel: {
    fontSize: 10,
    fontFamily: F.bold,
    color: '#fff',
    textAlign: 'center',
  },
});
