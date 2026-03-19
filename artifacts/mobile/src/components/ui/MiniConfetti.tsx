import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

const DOTS = [
  { color: '#6366F1', angle: 0,   dist: 30 },
  { color: '#F97316', angle: 60,  dist: 34 },
  { color: '#10B981', angle: 120, dist: 28 },
  { color: '#EC4899', angle: 180, dist: 32 },
  { color: '#EAB308', angle: 240, dist: 36 },
  { color: '#06B6D4', angle: 300, dist: 29 },
];

function toRad(deg: number) { return (deg * Math.PI) / 180; }

function Dot({ color, angle, dist, trigger }: { color: string; angle: number; dist: number; trigger: number }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (trigger === 0) return;
    tx.value = 0;
    ty.value = 0;
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 80 });
    const rad = toRad(angle);
    tx.value = withTiming(Math.cos(rad) * dist, { duration: 420, easing: Easing.out(Easing.cubic) });
    ty.value = withTiming(Math.sin(rad) * dist, { duration: 420, easing: Easing.out(Easing.cubic) });
    opacity.value = withDelay(180, withTiming(0, { duration: 260, easing: Easing.in(Easing.quad) }));
  }, [trigger]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

interface MiniConfettiProps {
  trigger: number;
  xPct?: number;
  yPct?: number;
  color?: string;
}

export function MiniConfetti({ trigger, xPct = 50, yPct = 50 }: MiniConfettiProps) {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <View style={[styles.origin, { left: `${xPct}%` as `${number}%`, top: `${yPct}%` as `${number}%` }]}>
        {DOTS.map((d, i) => (
          <Dot key={i} {...d} trigger={trigger} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  origin: {
    position: 'absolute',
    width: 0,
    height: 0,
  },
  dot: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    top: -3.5,
    left: -3.5,
  },
});
