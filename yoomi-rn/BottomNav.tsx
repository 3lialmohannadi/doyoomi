import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Home, CheckSquare, Calendar, MoreHorizontal } from 'lucide-react-native';
import { theme, F, GRADIENT_D, ColorScheme, PRIMARY } from './theme';

export type TabKey = 'home' | 'tasks' | 'calendar' | 'more';

interface Props {
  active:       TabKey;
  onPress?:     (tab: TabKey) => void;
  colorScheme?: ColorScheme;
}

const TABS: { key: TabKey; label: string; Icon: React.ComponentType<any> }[] = [
  { key: 'more',     label: 'المزيد',    Icon: MoreHorizontal },
  { key: 'tasks',    label: 'المهام',    Icon: CheckSquare    },
  { key: 'calendar', label: 'التقويم',  Icon: Calendar       },
  { key: 'home',     label: 'الرئيسية', Icon: Home           },
];

export function BottomNav({ active, onPress, colorScheme = 'light' }: Props) {
  const T = theme(colorScheme);
  return (
    <View style={[s.bar, { backgroundColor: T.card, borderTopColor: T.border }]}>
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <TouchableOpacity key={key} style={s.tab} onPress={() => onPress?.(key)} activeOpacity={0.7}>
            {isActive ? (
              <LinearGradient colors={GRADIENT_D} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.activeCircle}>
                <Icon size={20} color="#fff" />
              </LinearGradient>
            ) : (
              <View style={s.inactiveCircle}>
                <Icon size={22} color={T.muted} />
              </View>
            )}
            <Text style={[s.label, { color: isActive ? PRIMARY : T.muted, fontFamily: isActive ? F.bold : F.reg }]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  bar: {
    flexDirection:    'row',
    borderTopWidth:   1,
    paddingTop:       10,
    paddingBottom:    28,
    paddingHorizontal: 8,
  },
  tab: {
    flex:            1,
    alignItems:      'center',
    gap:             4,
  },
  activeCircle: {
    width:           44,
    height:          44,
    borderRadius:    22,
    alignItems:      'center',
    justifyContent:  'center',
  },
  inactiveCircle: {
    width:           44,
    height:          44,
    alignItems:      'center',
    justifyContent:  'center',
  },
  label: {
    fontSize:    10,
    textAlign:   'center',
  },
});
