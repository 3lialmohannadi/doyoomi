import React from 'react';
import { StyleSheet, Text, Pressable, View, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Radius, Spacing, Typography } from '../../theme';
import * as Haptics from 'expo-haptics';

interface Option {
  key: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  selected: string;
  onSelect: (key: string) => void;
}

export function SegmentedControl({ options, selected, onSelect }: SegmentedControlProps) {
  const scheme = useColorScheme() ?? 'light';
  const C = Colors[scheme];

  return (
    <View style={[styles.container, { backgroundColor: C.segmentBg }]}>
      {options.map((opt) => {
        const isActive = opt.key === selected;
        return (
          <Pressable
            key={opt.key}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onSelect(opt.key);
            }}
            style={[styles.tab, isActive && styles.activeTab]}
          >
            {isActive ? (
              <LinearGradient
                colors={['#6C8EF5', '#F0A4C8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            ) : null}
            <Text style={[styles.label, { color: isActive ? '#fff' : C.textSecondary }]}>
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
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 3,
  },
  tab: {
    flex: 1,
    borderRadius: Radius.full,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  activeTab: {
    ...{
      shadowColor: '#6C8EF5',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 4,
    },
  },
  label: {
    ...Typography.captionMedium,
    fontFamily: 'Inter_600SemiBold',
  },
});
