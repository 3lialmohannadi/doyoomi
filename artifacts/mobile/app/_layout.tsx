import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  Cairo_900Black,
} from "@expo-google-fonts/cairo";
import {
  Comfortaa_700Bold,
} from "@expo-google-fonts/comfortaa";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useRef, useState } from "react";
import { I18nManager } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useSettingsStore } from "@/src/store/settingsStore";
import { useTasksStore } from "@/src/store/tasksStore";
import { useHabitsStore } from "@/src/store/habitsStore";
import { useGoalsStore } from "@/src/store/goalsStore";
import { useCategoriesStore } from "@/src/store/categoriesStore";
import { useJournalStore } from "@/src/store/journalStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { loadSettings, profile } = useSettingsStore();
  const { loadTasks } = useTasksStore();
  const { loadHabits } = useHabitsStore();
  const { loadGoals } = useGoalsStore();
  const { loadCategories } = useCategoriesStore();
  const { loadEntries } = useJournalStore();

  const [dataReady, setDataReady] = useState(false);
  const redirectedRef = useRef(false);

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
    if (dataReady && !redirectedRef.current) {
      redirectedRef.current = true;
      if (!profile.onboarding_complete) {
        router.replace('/onboarding');
      }
    }
  }, [dataReady]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="journal" options={{ headerShown: false, presentation: "modal" }} />
      <Stack.Screen name="support" options={{ headerShown: false }} />
      <Stack.Screen name="statistics" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
    Cairo_900Black,
    Comfortaa_700Bold,
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
