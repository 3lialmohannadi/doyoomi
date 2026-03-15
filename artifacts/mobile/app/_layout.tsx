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
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useEffect, useRef, useState } from "react";
import { Animated, I18nManager, StyleSheet } from "react-native";
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

const VIDEO_SOURCE = require("../assets/videos/intro.mp4");
const MAX_VIDEO_DURATION = 10000; // 10s hard cap

function VideoSplash({ onFinish }: { onFinish: () => void }) {
  const finishedRef = useRef(false);

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    onFinish();
  };

  const player = useVideoPlayer(VIDEO_SOURCE, (p) => {
    p.loop = false;
    p.muted = false;
    p.play();
  });

  useEffect(() => {
    const sub = player.addListener("playToEnd", finish);
    const timer = setTimeout(finish, MAX_VIDEO_DURATION);
    return () => {
      sub.remove();
      clearTimeout(timer);
    };
  }, [player]);

  return (
    <VideoView
      player={player}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      nativeControls={false}
    />
  );
}

function RootLayoutNav() {
  const { loadSettings } = useSettingsStore();
  const { loadTasks } = useTasksStore();
  const { loadHabits } = useHabitsStore();
  const { loadGoals } = useGoalsStore();
  const { loadCategories } = useCategoriesStore();
  const { loadEntries } = useJournalStore();
  const { profile } = useSettingsStore();

  const [dataReady, setDataReady] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
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
    const isRTL = profile.language === "ar";
    I18nManager.allowRTL(true);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
    }
  }, [profile.language]);

  useEffect(() => {
    if (dataReady && videoFinished && splashVisible.current) {
      splashVisible.current = false;
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [dataReady, videoFinished]);

  return (
    <>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="journal" options={{ headerShown: false, presentation: "modal" }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
      </Stack>

      <Animated.View
        style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}
        pointerEvents={dataReady && videoFinished ? "none" : "auto"}
      >
        <VideoSplash onFinish={() => setVideoFinished(true)} />
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
