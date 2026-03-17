import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput,
  StyleSheet, KeyboardAvoidingView, Platform,
  useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { F, S, R, GRADIENT_D, GRADIENT_H, PRIMARY, theme, ColorScheme, primaryShadow } from './theme';

interface Props {
  colorScheme?:    ColorScheme;
  onLogin?:        (email: string, pass: string) => void;
  onGuest?:        () => void;
  onRegister?:     () => void;
}

export function LoginScreen({ colorScheme: cs, onLogin, onGuest, onRegister }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [mode,    setMode]    = useState<'login' | 'register'>('login');

  const inputStyle = [
    s.input,
    {
      backgroundColor: dk ? 'rgba(255,255,255,0.06)' : '#F8F5FF',
      borderColor:     T.border,
      color:           T.text,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }}>
      {/* Top gradient blob */}
      <LinearGradient colors={GRADIENT_D} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.topBlob}>
        <View style={s.logoBubble}>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: F.brand }}>Do</Text>
        </View>
        <Text style={{ color: '#fff', fontSize: 26, fontFamily: F.brand }}>Do.Yoomi</Text>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, fontFamily: F.reg }}>يومي — أنجز يومك بذكاء</Text>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={{ flex: 1, padding: S.xl, gap: S.lg, justifyContent: 'center' }}>

          {/* Tab switcher */}
          <View style={[s.tabRow, { backgroundColor: dk ? T.card2 : '#EDE9FF' }]}>
            {(['register', 'login'] as const).map((m) => (
              <TouchableOpacity key={m} onPress={() => setMode(m)} style={[s.tab, mode === m && s.tabActive]}>
                <Text style={{ color: mode === m ? PRIMARY : T.muted, fontSize: 14, fontFamily: mode === m ? F.black : F.reg }}>
                  {m === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Email */}
          <View style={{ gap: S.sm }}>
            <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.med, textAlign: 'right' }}>البريد الإلكتروني</Text>
            <View style={[s.inputWrap, { backgroundColor: dk ? 'rgba(255,255,255,0.06)' : '#F8F5FF', borderColor: T.border }]}>
              <Mail size={18} color={T.muted} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor={T.dim}
                keyboardType="email-address"
                autoCapitalize="none"
                textAlign="right"
                style={{ flex: 1, color: T.text, fontSize: 14, fontFamily: F.reg }}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ gap: S.sm }}>
            <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.med, textAlign: 'right' }}>كلمة المرور</Text>
            <View style={[s.inputWrap, { backgroundColor: dk ? 'rgba(255,255,255,0.06)' : '#F8F5FF', borderColor: T.border }]}>
              <TouchableOpacity onPress={() => setShowPw(p => !p)}>
                {showPw ? <EyeOff size={18} color={T.muted} /> : <Eye size={18} color={T.muted} />}
              </TouchableOpacity>
              <TextInput
                value={pass}
                onChangeText={setPass}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                placeholderTextColor={T.dim}
                textAlign="right"
                style={{ flex: 1, color: T.text, fontSize: 14, fontFamily: F.reg }}
              />
              <Lock size={18} color={T.muted} />
            </View>
          </View>

          {mode === 'login' && (
            <TouchableOpacity style={{ alignSelf: 'flex-end' }}>
              <Text style={{ color: PRIMARY, fontSize: 13, fontFamily: F.med }}>نسيت كلمة المرور؟</Text>
            </TouchableOpacity>
          )}

          {/* CTA */}
          <TouchableOpacity onPress={() => onLogin?.(email, pass)} activeOpacity={0.85}>
            <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={[s.cta, primaryShadow]}>
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: F.black }}>
                {mode === 'login' ? 'دخول' : 'إنشاء الحساب'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Guest */}
          <TouchableOpacity onPress={onGuest} style={[s.guestBtn, { borderColor: T.border }]}>
            <Text style={{ color: T.muted, fontSize: 14, fontFamily: F.reg }}>الدخول كضيف</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  topBlob: {
    paddingTop:        64,
    paddingBottom:     36,
    paddingHorizontal: 24,
    borderBottomLeftRadius:  48,
    borderBottomRightRadius: 48,
    alignItems: 'center', gap: 8,
  },
  logoBubble: {
    width: 72, height: 72, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
  },
  tabRow: {
    flexDirection: 'row', borderRadius: R.full, padding: 4,
  },
  tab: {
    flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: R.full,
  },
  tabActive: { backgroundColor: '#fff' },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderRadius: R.md,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  cta: {
    paddingVertical: 16, borderRadius: R.full, alignItems: 'center',
  },
  guestBtn: {
    paddingVertical: 13, borderRadius: R.full, borderWidth: 1,
    alignItems: 'center',
  },
});
