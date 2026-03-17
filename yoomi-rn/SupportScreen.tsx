import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageCircle, Send, Mail } from 'lucide-react-native';
import { BottomNav, TabKey } from './BottomNav';
import { theme, F, S, R, GRADIENT_H, GRADIENT_D, PRIMARY, ColorScheme, cardShadow, primaryShadow } from './theme';

interface Props {
  colorScheme?: ColorScheme;
  activeTab?:   TabKey;
  onTabPress?:  (tab: TabKey) => void;
  onSend?:      (type: string, subject: string, message: string) => void;
}

const TYPES = [
  { key: 'suggestion', label: '💡 اقتراح' },
  { key: 'bug',        label: '🐛 مشكلة تقنية' },
  { key: 'other',      label: '💬 أخرى' },
];

export function SupportScreen({ colorScheme: cs, activeTab = 'more', onTabPress, onSend }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T  = theme(scheme);
  const dk = scheme === 'dark';
  const [type, setType]       = useState('suggestion');
  const [subject, setSubject] = useState('');
  const [msg, setMsg]         = useState('');

  const inputStyle = [
    s.input,
    {
      backgroundColor: dk ? 'rgba(255,255,255,0.05)' : '#F8F5FF',
      borderColor:     T.border,
      color:           T.text,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: T.bg }} edges={['top']}>
      {/* ── Header ── */}
      <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={s.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-end' }}>
          <Text style={{ color: '#fff', fontSize: 22, fontFamily: F.black }}>الدعم والمساعدة</Text>
          <MessageCircle size={24} color="#fff" />
        </View>
        <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: F.reg, textAlign: 'right' }}>
          نسعد بسماع رأيك وتعليقاتك
        </Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: S.xl, gap: 16, paddingBottom: 100 }}
      >
        {/* Type chips */}
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.text, fontSize: 14, fontFamily: F.black, textAlign: 'right', marginBottom: S.md }}>
            نوع الرسالة
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
            {TYPES.map((t) => (
              <TouchableOpacity key={t.key} onPress={() => setType(t.key)}
                style={[
                  s.chip,
                  type === t.key
                    ? { backgroundColor: PRIMARY }
                    : { backgroundColor: dk ? 'rgba(255,255,255,0.08)' : '#EDE9FF', borderColor: T.border, borderWidth: 1 },
                ]}
              >
                <Text style={{ color: type === t.key ? '#fff' : T.muted, fontSize: 12, fontFamily: F.med }}>
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form */}
        <View style={[s.card, { backgroundColor: T.card, borderColor: T.border }, cardShadow]}>
          <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.med, textAlign: 'right', marginBottom: S.sm }}>
            الموضوع
          </Text>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            placeholder="اكتب موضوع رسالتك..."
            placeholderTextColor={T.dim}
            textAlign="right"
            style={inputStyle}
          />

          <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.med, textAlign: 'right', marginTop: S.lg, marginBottom: S.sm }}>
            الرسالة
          </Text>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="اكتب رسالتك بالتفصيل..."
            placeholderTextColor={T.dim}
            multiline
            numberOfLines={5}
            textAlign="right"
            textAlignVertical="top"
            style={[inputStyle, { height: 120, paddingTop: 12 }]}
          />

          {/* Send button */}
          <TouchableOpacity
            onPress={() => onSend?.(type, subject, msg)}
            activeOpacity={0.85}
            style={{ marginTop: S.lg }}
          >
            <LinearGradient colors={GRADIENT_D} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.sendBtn, primaryShadow]}>
              <Send size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 15, fontFamily: F.black }}>إرسال الرسالة</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Email alternative */}
        <View style={[s.emailRow, { backgroundColor: dk ? 'rgba(108,71,255,0.15)' : '#EDE9FF', borderColor: T.border }]}>
          <Text style={{ color: PRIMARY, fontSize: 13, fontFamily: F.bold }}>support@doyoomi.app</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ color: T.muted, fontSize: 13, fontFamily: F.reg }}>أو راسلنا على البريد</Text>
            <Mail size={15} color={T.muted} />
          </View>
        </View>
      </ScrollView>
      <BottomNav active={activeTab} onPress={onTabPress} colorScheme={scheme} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingTop:        56,
    paddingBottom:     24,
    paddingHorizontal: 24,
    borderBottomLeftRadius:  32,
    borderBottomRightRadius: 32,
    gap: 6,
  },
  card: { padding: 16, borderRadius: R.lg, borderWidth: 1 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: R.full,
  },
  input: {
    borderWidth: 1, borderRadius: R.md,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, fontFamily: F.reg,
  },
  sendBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, borderRadius: R.full,
  },
  emailRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 14, borderRadius: R.lg, borderWidth: 1,
  },
});
