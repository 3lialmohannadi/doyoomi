import React, { useEffect } from 'react';
import { StyleSheet, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Colors, Radius } from '../../theme';

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: number;
  gradientColors?: [string, string];
}

export function ProgressBar({ progress, color, height = 6, gradientColors }: ProgressBarProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(Math.max(progress, 0), 1), { duration: 800 });
  }, [progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%`,
  }));

  return (
    <View style={[styles.track, { backgroundColor: C.borderLight, height, borderRadius: height }]}>
      <Animated.View style={[styles.fill, animStyle, { borderRadius: height, overflow: 'hidden' }]}>
        {gradientColors ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: color ?? C.tint }]} />
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
