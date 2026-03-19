import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { t } from "../../src/utils/i18n";

function TabIcon({
  children,
  focused,
  tint,
}: {
  children: React.ReactNode;
  focused: boolean;
  tint: string;
}) {
  return (
    <View style={styles.tabIconWrap}>
      {focused ? (
        <View style={[styles.activePill, { shadowColor: tint }]}>
          <LinearGradient
            colors={[tint, tint + 'BB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 26 }]}
          />
          {children}
        </View>
      ) : (
        <View style={styles.inactivePill}>{children}</View>
      )}
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
  const tabBarHeight = isWeb ? 80 : 72;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: isDark ? 'rgba(200,200,255,0.28)' : 'rgba(60,60,100,0.30)',
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          height: tabBarHeight,
        },
        tabBarBackground: () => (
          <View style={StyleSheet.absoluteFill}>
            {isDark ? (
              <View style={[StyleSheet.absoluteFill, styles.darkTabBg]}>
                {isIOS ? (
                  <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
                ) : null}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(11,11,20,0.93)' }]} />
                <View style={styles.darkTabBorder} />
              </View>
            ) : (
              <View style={StyleSheet.absoluteFill}>
                {isIOS ? (
                  <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
                ) : null}
                <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(245,245,255,0.97)' }]} />
                <View style={[styles.darkTabBorder, { borderTopColor: 'rgba(99,102,241,0.12)' }]} />
              </View>
            )}
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: tFunc("home"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} tint={C.tint}>
              {isIOS ? (
                <SymbolView name="house.fill" tintColor={focused ? "#fff" : color} size={22} />
              ) : (
                <Ionicons name={focused ? "home" : "home-outline"} size={22} color={focused ? "#fff" : color} />
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
            <TabIcon focused={focused} tint={C.tint}>
              {isIOS ? (
                <SymbolView name="calendar" tintColor={focused ? "#fff" : color} size={22} />
              ) : (
                <Ionicons name={focused ? "calendar" : "calendar-outline"} size={22} color={focused ? "#fff" : color} />
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
            <TabIcon focused={focused} tint={C.tintSecondary}>
              {isIOS ? (
                <SymbolView name="sparkles" tintColor={focused ? "#fff" : color} size={22} />
              ) : (
                <Ionicons name={focused ? "leaf" : "leaf-outline"} size={22} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen
        name="goals"
        options={{
          title: tFunc("goals"),
          tabBarIcon: ({ color, focused }) => (
            <TabIcon focused={focused} tint={C.tint}>
              {isIOS ? (
                <SymbolView name="trophy.fill" tintColor={focused ? "#fff" : color} size={22} />
              ) : (
                <Ionicons name={focused ? "trophy" : "trophy-outline"} size={22} color={focused ? "#fff" : color} />
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
            <TabIcon focused={focused} tint={C.tint}>
              {isIOS ? (
                <SymbolView name="ellipsis.circle.fill" tintColor={focused ? "#fff" : color} size={22} />
              ) : (
                <Ionicons name={focused ? "grid" : "grid-outline"} size={22} color={focused ? "#fff" : color} />
              )}
            </TabIcon>
          ),
        }}
      />

      <Tabs.Screen name="tasks" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  activePill: {
    width: 52,
    height: 38,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.40,
    shadowRadius: 12,
    elevation: 8,
  },
  inactivePill: {
    width: 52,
    height: 38,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  darkTabBg: {
    overflow: 'hidden',
  },
  darkTabBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(129,140,248,0.08)',
  },
});
