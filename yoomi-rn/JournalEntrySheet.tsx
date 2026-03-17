/**
 * JournalEntrySheet — كتابة مدونة يومية (Bottom Sheet / Full Screen)
 */

import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput,
  ScrollView, StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Check } from 'lucide-react-native';
import { theme, F, S, R, GRADIENT_H, GRADIENT_D, PRIMARY, ColorScheme, primaryShadow } from './theme';

interface Props {
  visible:      boolean;
  onSave?:      (entry: { title: string; body: string; mood: string }) => void;
  onDismiss?:   () => void;
  colorScheme?: ColorScheme;
}

const MOODS = [
  { key: 'happy',    emoji: '😊', label: 'سعيد',       color: '#4ADE80' },
  { key: 'great',    emoji: '🤩', label: 'رائع',        color: '#FB923C' },
  { key: 'neutral',  emoji: '😐', label: 'محايد',       color: '#60A5FA' },
  { key: 'calm',     emoji: '😌', label: 'هادئ',        color: '#A78BFA' },
  { key: 'sad',      emoji: '😢', label: 'حزين',        color: '#F87171' },
  { key: 'stressed', emoji: '😤', label: 'متوتر',       color: '#FB923C' },
];

export function JournalEntrySheet({ visible, onSave, onDismiss, colorScheme: cs }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';
  const [title, setTitle] = useState('');
  const [body,  setBody]  = useState('');
  const [mood,  setMood]  = useState('happy');
  const words = body.trim().split(/\s+/).filter(Boolean).length;

  const save = () => {
    if (!title.trim() && !body.trim()) return;
    onSave?.({ title, body, mood });
    setTitle(''); setBody('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onDismiss} />
      <View style={[s.sheet, { backgroundColor: T.card }]}>
        <View style={[s.handle, { backgroundColor: T.border }]} />

        {/* Header */}
        <View style={s.hRow}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity onPress={onDismiss} style={[s.btn36, { backgroundColor: dk ? T.card2 : '#EDE9FF' }]}>
              <X size={16} color={T.muted} />
            </TouchableOpacity>
            <TouchableOpacity onPress={save}>
              <LinearGradient colors={GRADIENT_H} start={{ x: 1, y: 0 }} end={{ x: 0, y: 0 }} style={s.saveSmall}>
                <Check size={14} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontFamily: F.bold }}>حفظ</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Text style={{ color: T.text, fontSize: 17, fontFamily: F.black }}>مدونة جديدة</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: S.lg, paddingHorizontal: S.xl, paddingBottom: 32 }}
        >
          {/* Mood selector */}
          <View style={{ gap: S.sm }}>
            <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.med, textAlign: 'right' }}>كيف حالك اليوم؟</Text>
            <View style={{ flexDirection: 'row', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {MOODS.map((m) => (
                <TouchableOpacity key={m.key} onPress={() => setMood(m.key)}
                  style={[
                    s.moodChip,
                    mood === m.key
                      ? { backgroundColor: m.color, borderColor: 'transparent' }
                      : { backgroundColor: 'transparent', borderColor: T.border },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{m.emoji}</Text>
                  <Text style={{ color: mood === m.key ? '#fff' : T.muted, fontSize: 11, fontFamily: F.med }}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="عنوان المذكرة..."
            placeholderTextColor={T.dim}
            textAlign="right"
            style={[s.titleInput, { color: T.text, borderBottomColor: T.border }]}
          />

          {/* Body */}
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder="اكتب أفكارك هنا..."
            placeholderTextColor={T.dim}
            multiline
            textAlign="right"
            textAlignVertical="top"
            style={[
              s.bodyInput,
              { color: T.text, backgroundColor: dk ? 'rgba(255,255,255,0.04)' : '#FAFAFE', borderColor: T.border },
            ]}
          />
          <Text style={{ color: T.muted, fontSize: 11, fontFamily: F.reg, textAlign: 'left' }}>
            {words} كلمة
          </Text>

        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingTop: S.lg, gap: S.md, maxHeight: '92%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: S.sm },
  hRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: S.xl, paddingBottom: S.sm,
  },
  btn36: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  saveSmall: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: R.full,
  },
  moodChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: R.full, borderWidth: 1,
  },
  titleInput: {
    fontSize: 20, fontFamily: F.black,
    paddingBottom: S.sm, borderBottomWidth: 1,
  },
  bodyInput: {
    borderWidth: 1, borderRadius: R.lg, padding: 14,
    fontSize: 15, fontFamily: F.reg, minHeight: 200, lineHeight: 26,
  },
});
