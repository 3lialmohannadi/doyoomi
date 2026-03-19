import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSettingsStore } from "../../src/store/settingsStore";
import { useTasksStore } from "../../src/store/tasksStore";
import { useHabitsStore } from "../../src/store/habitsStore";
import { useAppTheme } from "../../src/hooks/useAppTheme";
import { t } from "../../src/utils/i18n";
import { F } from "../../src/theme";
import { format, getDay } from "date-fns";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

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
            colors={[tint, tint + "BB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 22 }]}
          />
          {children}
        </View>
      ) : (
        <View style={styles.inactivePill}>{children}</View>
      )}
    </View>
  );
}

function TabIonicon({
  focused,
  tint,
  iconFocused,
  iconBlur,
  color,
}: {
  focused: boolean;
  tint: string;
  iconFocused: IoniconName;
  iconBlur: IoniconName;
  color: string;
}) {
  return (
    <TabIcon focused={focused} tint={tint}>
      <Ionicons
        name={focused ? iconFocused : iconBlur}
        size={20}
        color={focused ? "#fff" : color}
      />
    </TabIcon>
  );
}

export default function TabLayout() {
  const { profile } = useSettingsStore();
  const { tasks } = useTasksStore();
  const { habits } = useHabitsStore();
  const { scheme, C } = useAppTheme();
  const lang = profile.language;
  const tFunc = (key: string) => t(key, lang);
  const isDark = scheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  const tabBarHeight = isWeb ? 80 : 72;

  const today = format(new Date(), "yyyy-MM-dd");

  const pendingTasksTodayCount = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.due_date === today &&
        t.status !== "completed" &&
        t.status !== "postponed"
    ).length;
  }, [tasks, today]);

  const remainingHabitsCount = useMemo(() => {
    const todayDow = getDay(new Date());
    const isWeekend = todayDow === 0 || todayDow === 6;
    const isWeekday = !isWeekend;
    return habits.filter((h) => {
      const freq = h.frequency ?? 'daily';
      if (freq === 'weekdays' && isWeekend) return false;
      if (freq === 'weekends' && isWeekday) return false;
      const lastDate = h.last_completed_at
        ? format(new Date(h.last_completed_at), "yyyy-MM-dd")
        : null;
      return lastDate !== today;
    }).length;
  }, [habits, today]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.tint,
        tabBarInactiveTintColor: isDark
          ? "rgba(200,200,255,0.30)"
          : "rgba(60,60,100,0.32)",
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: F.bold,
          marginTop: -2,
          marginBottom: 4,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: tabBarHeight,
          ...(isWeb ? {} : {
            marginHorizontal: 16,
            borderRadius: 28,
            marginBottom: 8,
            shadowColor: isDark ? '#000000' : '#6366F1',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: isDark ? 0.45 : 0.18,
            shadowRadius: 20,
            elevation: 12,
          }),
        },
        tabBarBadgeStyle: {
          backgroundColor: "#F97316",
          color: "#fff",
          fontSize: 10,
          fontFamily: F.bold,
          minWidth: 16,
          height: 16,
          borderRadius: 8,
          lineHeight: 16,
        },
        tabBarBackground: () => (
          <View style={[StyleSheet.absoluteFill, isWeb ? {} : { borderRadius: 28, overflow: "hidden" }]}>
            {isDark ? (
              <View style={StyleSheet.absoluteFill}>
                {isIOS ? (
                  <BlurView
                    intensity={60}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(13,11,22,0.95)" },
                  ]}
                />
              </View>
            ) : (
              <View style={StyleSheet.absoluteFill}>
                {isIOS ? (
                  <BlurView
                    intensity={80}
                    tint="light"
                    style={StyleSheet.absoluteFill}
                  />
                ) : null}
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: "rgba(245,245,255,0.97)" },
                  ]}
                />
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
          tabBarBadge:
            pendingTasksTodayCount > 0 ? pendingTasksTodayCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIonicon
              focused={focused}
              tint={C.tint}
              iconFocused="home"
              iconBlur="home-outline"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: tFunc("calendar"),
          tabBarIcon: ({ color, focused }) => (
            <TabIonicon
              focused={focused}
              tint={C.tint}
              iconFocused="calendar"
              iconBlur="calendar-outline"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="habits"
        options={{
          title: tFunc("habits"),
          tabBarBadge:
            remainingHabitsCount > 0 ? remainingHabitsCount : undefined,
          tabBarIcon: ({ color, focused }) => (
            <TabIonicon
              focused={focused}
              tint={C.tintSecondary}
              iconFocused="leaf"
              iconBlur="leaf-outline"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="goals"
        options={{
          title: tFunc("goals"),
          tabBarIcon: ({ color, focused }) => (
            <TabIonicon
              focused={focused}
              tint={C.tint}
              iconFocused="trophy"
              iconBlur="trophy-outline"
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: tFunc("more"),
          tabBarIcon: ({ color, focused }) => (
            <TabIonicon
              focused={focused}
              tint={C.tint}
              iconFocused="grid"
              iconBlur="grid-outline"
              color={color}
            />
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
    marginTop: 4,
  },
  activePill: {
    width: 48,
    height: 32,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.38,
    shadowRadius: 10,
    elevation: 7,
  },
  inactivePill: {
    width: 48,
    height: 32,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
