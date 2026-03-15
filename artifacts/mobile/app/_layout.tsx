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
import React, { useEffect, useRef, useState } from "react";
import { Animated, I18nManager, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import AppSplashScreen from "@/src/components/SplashScreen";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useTasksStore } from "@/src/store/tasksStore";
import { useHabitsStore } from "@/src/store/habitsStore";
import { useGoalsStore } from "@/src/store/goalsStore";
import { useCategoriesStore } from "@/src/store/categoriesStore";
import { useJournalStore } from "@/src/store/journalStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { loadSettings } = useSettingsStore();
  const { loadTasks } = useTasksStore();
  const { loadHabits } = useHabitsStore();
  const { loadGoals } = useGoalsStore();
  const { loadCategories } = useCategoriesStore();
  const { loadEntries } = useJournalStore();

  const [dataReady, setDataReady] = useState(false);
  const [splashDone, setSplashDone] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const splashVisible = useRef(true);

  useEffect(() => {
    Promise.allSettled([
      loadSettings(),
      loadTasks(),
      loadHabits(),
      loadGoals(),
      loadCategories(),
      loadEntries(),
    ]).then(() => setDataReady(true));
  }, []);

  useEffect(() => {
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL) {
      I18nManager.forceRTL(false);
    }
  }, []);

  useEffect(() => {
    if (dataReady && splashDone && splashVisible.current) {
      splashVisible.current = false;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [dataReady, splashDone]);

  return (
    <>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="journal" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
      </Stack>

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
        pointerEvents={dataReady && splashDone ? "none" : "auto"}
      >
        <AppSplashScreen onFinish={() => setSplashDone(true)} duration={3000} />
      </Animated.View>
    </>
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
