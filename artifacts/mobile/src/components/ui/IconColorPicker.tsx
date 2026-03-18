import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Radius, Spacing, F, PRIMARY, SECONDARY, GRADIENT_H } from '../../theme';
import { useAppTheme } from '../../hooks/useAppTheme';
import { useSettingsStore } from '../../store/settingsStore';
import { t } from '../../utils/i18n';
import { SHARED_ICONS, SHARED_COLORS } from '../../constants/pickerOptions';

interface IconColorPickerProps {
  selectedIcon: string;
  selectedColor: string;
  onIconChange: (icon: string) => void;
  onColorChange: (color: string) => void;
  iconSuffix?: string;
}

export function IconPicker({ selectedIcon, selectedColor, onIconChange, iconSuffix = '-outline' }: Omit<IconColorPickerProps, 'onColorChange' | 'selectedColor'> & { selectedColor?: string }) {
  const { C } = useAppTheme();
  const color = selectedColor ?? PRIMARY;

  return (
    <View style={styles.iconGrid}>
      {SHARED_ICONS.map((ic, ii) => {
        const isActive = ic === selectedIcon;
        return (
          <Pressable
            key={`${ic}-${ii}`}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onIconChange(ic); }}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: isActive ? color + '25' : C.surface,
                borderColor: isActive ? color : C.border,
                borderWidth: isActive ? 2 : 1,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={ic}
            accessibilityState={{ selected: isActive }}
          >
            <Ionicons
              name={((ic + iconSuffix) as React.ComponentProps<typeof Ionicons>['name'])}
              size={22}
              color={isActive ? color : C.textMuted}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

export function ColorPicker({ selectedColor, onColorChange }: Pick<IconColorPickerProps, 'selectedColor' | 'onColorChange'>) {
  return (
    <View style={styles.colorGrid}>
      {SHARED_COLORS.map((cl, ci) => {
        const isActive = cl === selectedColor;
        return (
          <Pressable
            key={`${cl}-${ci}`}
            onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onColorChange(cl); }}
            style={({ pressed }) => [
              styles.colorBtn,
              {
                backgroundColor: cl,
                borderWidth: isActive ? 3 : 0,
                borderColor: '#fff',
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: isActive ? 1.08 : 1 }],
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel={cl}
            accessibilityState={{ selected: isActive }}
          >
            {isActive && <Ionicons name="checkmark" size={18} color="#fff" />}
          </Pressable>
        );
      })}
    </View>
  );
}

export function IconColorPicker({ selectedIcon, selectedColor, onIconChange, onColorChange }: IconColorPickerProps) {
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const { C } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t('icon', lang).toUpperCase()}
        </Text>
        <IconPicker
          selectedIcon={selectedIcon}
          selectedColor={selectedColor}
          onIconChange={onIconChange}
        />
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: C.textSecondary }]}>
          {t('color', lang).toUpperCase()}
        </Text>
        <ColorPicker selectedColor={selectedColor} onColorChange={onColorChange} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: Spacing.lg },
  section: { gap: Spacing.sm },
  sectionLabel: {
    fontSize: 11,
    fontFamily: F.med,
    letterSpacing: 0.5,
  },
  iconGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center' },
  iconBtn: {
    width: 46, height: 46, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm + 2, justifyContent: 'center' },
  colorBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, shadowRadius: 4, elevation: 3,
  },
});
