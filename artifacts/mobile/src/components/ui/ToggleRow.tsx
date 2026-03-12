import React from 'react';
import { StyleSheet, Text, View, Pressable, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import * as Haptics from 'expo-haptics';

interface Option {
  key: string;
  label: string;
}

interface ToggleRowProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
}

export function ToggleRow({ label, options, value, onChange }: ToggleRowProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: C.text }]}>{label}</Text>
      <View style={[styles.toggle, { backgroundColor: C.segmentBg }]}>
        {options.map((opt) => {
          const isActive = opt.key === value;
          return (
            <Pressable
              key={opt.key}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onChange(opt.key);
              }}
              style={[styles.option, isActive && styles.activeOption, { overflow: 'hidden' }]}
            >
              {isActive && (
                <LinearGradient
                  colors={['#7C5CFC', '#FF6B9D']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <Text style={[styles.optionText, { color: isActive ? '#fff' : C.textSecondary }]}>
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  label: {
    ...Typography.bodyMedium,
    flex: 1,
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 2,
  },
  option: {
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOption: {
    shadowColor: '#6C8EF5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_500Medium',
  },
});
