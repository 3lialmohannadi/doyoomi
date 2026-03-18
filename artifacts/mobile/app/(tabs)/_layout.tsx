import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { t } from "../../src/utils/i18n";
import { PRIMARY, GRADIENT_H, F } from "../../src/theme";

function TabIcon({
  children,
  focused,
  label,
  color,
}: {
  children: React.ReactNode;
  focused: boolean;
  label: string;
  color: string;
}) {
  return (
    <View style={styles.tabIconWrap}>
      {focused ? (
        <View style={styles.activePill}>
          <LinearGradient
            colors={[...GRADIENT_H]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
          />
          {children}
        </View>
      ) : (
        <View style={styles.inactivePill}>{children}</View>
      )}
      <Text
        style={[
          styles.tabLabel,
          { color: focused ? PRIMARY : color, fontFamily: focused ? F.bold : F.med },
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
}

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
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : isDark ? "#1C130C" : "#FBF7F3",
          borderTopWidth: 1,
          borderTopColor: isDark ? "#362415" : "#EFE5DB",
          elevation: 0,
          height: isWeb ? 84 : 74,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={85} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
          ) : isWeb ? (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: isDark ? "#1C130C" : "#FBF7F3" }]} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tFunc("home"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label={tFunc("home")} color={color}>
              {isIOS ? (
                <SymbolView name="house" tintColor={focused ? "#fff" : color} size={21} />
              ) : (
                <Ionicons name={focused ? "home" : "home-outline"} size={21} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: tFunc("tasks"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label={tFunc("tasks")} color={color}>
              {isIOS ? (
                <SymbolView name="checklist" tintColor={focused ? "#fff" : color} size={21} />
              ) : (
                <Ionicons name={focused ? "checkmark-circle" : "checkmark-circle-outline"} size={21} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="habits"
        options={{
          title: tFunc("habits"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label={tFunc("habits")} color={color}>
              {isIOS ? (
                <SymbolView name="sparkles" tintColor={focused ? "#fff" : color} size={21} />
              ) : (
                <Ionicons name={focused ? "leaf" : "leaf-outline"} size={21} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: tFunc("calendar"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label={tFunc("calendar")} color={color}>
              {isIOS ? (
                <SymbolView name="calendar" tintColor={focused ? "#fff" : color} size={21} />
              ) : (
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={21} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: tFunc("more"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} label={tFunc("more")} color={color}>
              {isIOS ? (
                <SymbolView name="ellipsis.circle" tintColor={focused ? "#fff" : color} size={21} />
              ) : (
                <Ionicons name={focused ? "grid" : "grid-outline"} size={21} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />
      <Tabs.Screen name="goals" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingTop: 8,
  },
  activePill: {
    width: 48,
    height: 34,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  inactivePill: {
    width: 48,
    height: 34,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
  },
});
