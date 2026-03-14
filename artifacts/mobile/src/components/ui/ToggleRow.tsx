import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Radius, Spacing, Typography } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';
import * as Haptics from 'expo-haptics';

interface Option {
  key: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
}

interface ToggleRowProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
}

export function ToggleRow({ label, options, value, onChange }: ToggleRowProps) {
  const { C } = useAppTheme();
  const { profile } = useSettingsStore();
  const isRTL = profile.language === 'ar';

  return (
    <View style={[styles.row, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
      <Text style={[styles.label, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{label}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md + 2,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    flex: 1,
  },
  toggle: {
    flexDirection: 'row',
    borderRadius: Radius.full,
    padding: 3,
  },
  option: {
    borderRadius: Radius.full,
    paddingHorizontal: 14,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeOption: {
    shadowColor: '#7C5CFC',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
