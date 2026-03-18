import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { t } from "../../src/utils/i18n";

export default function TabLayout() {
  const { profile } = useSettingsStore();
  const { scheme, C } = useAppTheme();
  const lang = profile.language;
  const tFunc = (key: string) => t(key, lang);
  const isDark = scheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: C.textMuted,
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#1C130C" : "#FBF7F3",
          borderTopWidth: isWeb ? 1 : 0,
          borderTopColor: isDark ? "#362415" : "#EFE5DB",
          elevation: 0,
          ...(isWeb ? { height: 84 } : {}),
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={80} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "#1C130C" : "#FBF7F3" }]} />
          ) : null,
        tabBarLabelStyle: { fontFamily: 'Cairo_600SemiBold', fontSize: 10 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tFunc('home'),
          tabBarIcon: ({ color }) =>
            isIOS ? <SymbolView name="house" tintColor={color} size={24} /> : <Ionicons name="home-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: tFunc('calendar'),
          tabBarIcon: ({ color }) =>
            isIOS ? <SymbolView name="calendar" tintColor={color} size={24} /> : <Ionicons name="calendar-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: tFunc('tasks'),
          tabBarIcon: ({ color }) =>
            isIOS ? <SymbolView name="checklist" tintColor={color} size={24} /> : <Ionicons name="checkmark-circle-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: tFunc('more'),
          tabBarIcon: ({ color }) =>
            isIOS ? <SymbolView name="ellipsis.circle" tintColor={color} size={24} /> : <Ionicons name="grid-outline" size={22} color={color} />,
        }}
      />
      <Tabs.Screen name="habits" options={{ href: null }} />
      <Tabs.Screen name="goals" options={{ href: null }} />
    </Tabs>
  );
}
