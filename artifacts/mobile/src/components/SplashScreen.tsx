import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

interface Props {
  onFinish?: () => void;
  duration?: number;
}

const features = [
  { icon: "✅", en: "Tasks",    ar: "مهام"   },
  { icon: "🔁", en: "Habits",   ar: "عادات"  },
  { icon: "🎯", en: "Goals",    ar: "أهداف"  },
  { icon: "📓", en: "Journal",  ar: "مذكرات" },
  { icon: "📅", en: "Calendar", ar: "تقويم"  },
];

export default function SplashScreen({ onFinish, duration = 3000 }: Props) {
  const contentOpacity    = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(20)).current;
  const iconTranslateY    = useRef(new Animated.Value(0)).current;
  const glowOpacity       = useRef(new Animated.Value(0.55)).current;
  const subOpacity        = useRef(new Animated.Value(0)).current;
  const subTranslateY     = useRef(new Animated.Value(6)).current;
  const chipsOpacity      = useRef(new Animated.Value(0)).current;
  const chipsTranslateY   = useRef(new Animated.Value(6)).current;

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 800,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        toValue: 0,
        duration: 800,
        delay: 80,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(subOpacity, {
        toValue: 1,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.timing(subTranslateY, {
        toValue: 0,
        duration: 600,
        delay: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(chipsOpacity, {
        toValue: 1,
        duration: 550,
        delay: 800,
        useNativeDriver: true,
      }),
      Animated.timing(chipsTranslateY, {
        toValue: 0,
        duration: 550,
        delay: 800,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(iconTranslateY, {
          toValue: -7,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(iconTranslateY, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.28,
          duration: 1750,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.55,
          duration: 1750,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
        onFinish?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={["#1C0D06", "#3B1A0F", "#6B2E18", "#A05030", "#C97A5B", "#D48E6E", "#E8A87C", "#F0BC90"]}
        locations={[0, 0.14, 0.30, 0.46, 0.62, 0.76, 0.88, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />
      <View style={styles.bgGlowMid} />

      <Animated.View style={[
        styles.content,
        { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }
      ]}>
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.iconGlow, { opacity: glowOpacity }]} />
          <Animated.View style={{ transform: [{ translateY: iconTranslateY }] }}>
            <Image
              source={require("../../assets/images/app-icon.png")}
              style={styles.icon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        <Text style={styles.appName}>
          Do<Text style={styles.dot}>.</Text>Yoomi
        </Text>

        <Animated.View style={{
          opacity: subOpacity,
          transform: [{ translateY: subTranslateY }],
          marginTop: 8,
        }}>
          <Image
            source={require("../../assets/images/yoomi-ar.png")}
            style={styles.arLogo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[
          styles.chipsRow,
          { opacity: chipsOpacity, transform: [{ translateY: chipsTranslateY }] }
        ]}>
          {features.map(({ icon, en, ar }) => (
            <View key={en} style={styles.chip}>
              <Text style={styles.chipIcon}>{icon}</Text>
              <Text style={styles.chipEn}>{en}</Text>
              <Text style={styles.chipAr}>{ar}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1C0D06",
  },
  bgGlowTop: {
    position: "absolute",
    top: "6%",
    alignSelf: "center",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(201, 122, 91, 0.22)",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: "5%",
    alignSelf: "center",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "rgba(123, 174, 158, 0.18)",
  },
  bgGlowMid: {
    position: "absolute",
    top: "45%",
    right: "-10%",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(232, 168, 124, 0.12)",
  },
  content: {
    alignItems: "center",
    zIndex: 10,
  },
  iconWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 54,
    backgroundColor: "rgba(201, 122, 91, 0.45)",
  },
  icon: {
    width: 150,
    height: 150,
    borderRadius: 34,
  },
  appName: {
    marginTop: 32,
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1.5,
    color: "#FFF9F5",
  },
  dot: {
    color: "#E8A87C",
    fontWeight: "900",
  },
  arLogo: {
    width: 130,
    height: 44,
    opacity: 0.88,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 9,
    marginTop: 28,
    maxWidth: 310,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 185, 0.22)",
  },
  chipIcon: {
    fontSize: 13,
  },
  chipEn: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 245, 235, 0.88)",
  },
  chipAr: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(232, 168, 124, 0.75)",
  },
  homeIndicator: {
    position: "absolute",
    bottom: 18,
    width: 128,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
