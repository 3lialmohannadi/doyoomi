import React from 'react';
import { ScrollView, StyleSheet, Text, Pressable, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import * as Haptics from 'expo-haptics';

interface Chip {
  key: string;
  label: string;
}

interface FilterChipsProps {
  chips: Chip[];
  selected: string;
  onSelect: (key: string) => void;
}

export function FilterChips({ chips, selected, onSelect }: FilterChipsProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {chips.map((chip) => {
        const isActive = chip.key === selected;
        return (
          <Pressable
            key={chip.key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(chip.key);
            }}
            style={[
              styles.chip,
              {
                backgroundColor: isActive ? 'transparent' : C.pillInactive,
                borderColor: isActive ? 'transparent' : C.border,
                overflow: 'hidden',
              },
            ]}
          >
            {isActive && (
              <LinearGradient
                colors={['#6C8EF5', '#F0A4C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            )}
            <Text style={[styles.label, { color: isActive ? '#fff' : C.textSecondary }]}>
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_500Medium',
  },
});
