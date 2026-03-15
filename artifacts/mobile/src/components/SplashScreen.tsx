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
        colors={["#160328", "#2b0848", "#420e6a", "#641880", "#8a2aa0", "#a83aae", "#c25098", "#d46882", "#de8070"]}
        locations={[0, 0.16, 0.32, 0.48, 0.62, 0.74, 0.85, 0.95, 1]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowBottom} />

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
    backgroundColor: "#160328",
  },
  bgGlowTop: {
    position: "absolute",
    top: "8%",
    alignSelf: "center",
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: "rgba(210, 80, 170, 0.22)",
  },
  bgGlowBottom: {
    position: "absolute",
    bottom: "5%",
    alignSelf: "center",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(80, 15, 120, 0.28)",
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
    backgroundColor: "rgba(210, 80, 165, 0.45)",
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
    color: "#f4d8ff",
  },
  dot: {
    color: "#d870d0",
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
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderWidth: 1,
    borderColor: "rgba(255, 210, 255, 0.14)",
  },
  chipIcon: {
    fontSize: 13,
  },
  chipEn: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(240, 210, 255, 0.82)",
  },
  chipAr: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(220, 180, 255, 0.45)",
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
