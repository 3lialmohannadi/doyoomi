import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { I18nManager, View, Text, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useTasksStore } from "@/src/store/tasksStore";
import { useHabitsStore } from "@/src/store/habitsStore";
import { useGoalsStore } from "@/src/store/goalsStore";
import { useCategoriesStore } from "@/src/store/categoriesStore";
import { useJournalStore } from "@/src/store/journalStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function LoadingScreen() {
  return (
    <LinearGradient
      colors={["#7C5CFC", "#FF6B9D"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={loadStyles.container}
    >
      <View style={loadStyles.logoRing}>
        <Ionicons name="calendar" size={42} color="#7C5CFC" />
      </View>
      <Text style={loadStyles.name}>Do.Yoomi</Text>
      <Text style={loadStyles.arabic}>يومي</Text>
      <View style={loadStyles.dotsRow}>
        <View style={loadStyles.dot} />
        <View style={[loadStyles.dot, { opacity: 0.6 }]} />
        <View style={[loadStyles.dot, { opacity: 0.3 }]} />
      </View>
    </LinearGradient>
  );
}

const loadStyles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8 },
  logoRing: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#fff",
    alignItems: "center", justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 12,
  },
  name: { fontSize: 32, fontFamily: "Inter_700Bold", color: "#fff" },
  arabic: { fontSize: 20, fontFamily: "Inter_700Bold", color: "rgba(255,255,255,0.75)" },
  dotsRow: { flexDirection: "row", gap: 8, marginTop: 24 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#fff" },
});

function RootLayoutNav() {
  const { loadSettings } = useSettingsStore();
  const { loadTasks } = useTasksStore();
  const { loadHabits } = useHabitsStore();
  const { loadGoals } = useGoalsStore();
  const { loadCategories } = useCategoriesStore();
  const { loadEntries } = useJournalStore();
  const { profile } = useSettingsStore();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      loadSettings(),
      loadTasks(),
      loadHabits(),
      loadGoals(),
      loadCategories(),
      loadEntries(),
    ]).then(() => setReady(true));
  }, []);

  useEffect(() => {
    const isRTL = profile.language === "ar";
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [profile.language]);

  if (!ready) return <LoadingScreen />;

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="journal" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="support" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <RootLayoutNav />
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
