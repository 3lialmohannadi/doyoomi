/**
 * AddTaskSheet — إضافة مهمة جديدة (Bottom Sheet)
 *
 * Usage:
 *   <AddTaskSheet visible={show} onSave={(t) => ...} onDismiss={() => setShow(false)} />
 */

import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, TextInput,
  ScrollView, StyleSheet, useColorScheme as useSysCS,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Calendar, Clock, Flag, Tag, Check } from 'lucide-react-native';
import { theme, F, S, R, GRADIENT_H, GRADIENT_D, PRIMARY, ColorScheme, primaryShadow } from './theme';

interface Task {
  title:    string;
  note:     string;
  priority: 'high' | 'mid' | 'low';
  category: string;
  date:     string;
  time:     string;
}

interface Props {
  visible:       boolean;
  onSave?:       (task: Task) => void;
  onDismiss?:    () => void;
  colorScheme?:  ColorScheme;
}

const PRIORITIES = [
  { key: 'high', label: 'عالية',    color: '#F87171', bg: 'rgba(248,113,113,0.15)' },
  { key: 'mid',  label: 'متوسطة',  color: '#FB923C', bg: 'rgba(251,146,60,0.15)'  },
  { key: 'low',  label: 'منخفضة', color: '#4ADE80', bg: 'rgba(74,222,128,0.15)'  },
] as const;

const CATEGORIES = ['عمل', 'شخصي', 'صحة', 'تعليم', 'أخرى'];

export function AddTaskSheet({ visible, onSave, onDismiss, colorScheme: cs }: Props) {
  const sys = useSysCS();
  const scheme: ColorScheme = cs ?? (sys === 'dark' ? 'dark' : 'light');
  const T   = theme(scheme);
  const dk  = scheme === 'dark';
  const [title,    setTitle]    = useState('');
  const [note,     setNote]     = useState('');
  const [priority, setPriority] = useState<'high'|'mid'|'low'>('mid');
  const [category, setCategory] = useState('عمل');

  const inputBg = { backgroundColor: dk ? 'rgba(255,255,255,0.06)' : '#F8F5FF', borderColor: T.border };

  const save = () => {
    if (!title.trim()) return;
    onSave?.({ title, note, priority, category, date: '', time: '' });
    setTitle(''); setNote('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onDismiss}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onDismiss} />
      <View style={[s.sheet, { backgroundColor: T.card }]}>
        <View style={[s.handle, { backgroundColor: T.border }]} />

        {/* Header */}
        <View style={s.hRow}>
          <TouchableOpacity onPress={onDismiss} style={[s.closeBtn, { backgroundColor: dk ? T.card2 : '#EDE9FF' }]}>
            <X size={16} color={T.muted} />
          </TouchableOpacity>
          <Text style={{ color: T.text, fontSize: 17, fontFamily: F.black }}>مهمة جديدة</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: S.lg, paddingHorizontal: S.xl, paddingBottom: 24 }}>

          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="عنوان المهمة *"
            placeholderTextColor={T.dim}
            textAlign="right"
            style={[s.titleInput, { color: T.text, borderBottomColor: T.border }]}
          />

          {/* Note */}
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="ملاحظة (اختياري)"
            placeholderTextColor={T.dim}
            multiline
            numberOfLines={3}
            textAlign="right"
            textAlignVertical="top"
            style={[s.textarea, inputBg, { color: T.text }]}
          />

          {/* Priority */}
          <View style={{ gap: S.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>الأولوية</Text>
              <Flag size={16} color={T.muted} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end' }}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity key={p.key} onPress={() => setPriority(p.key)}
                  style={[
                    s.chip,
                    priority === p.key
                      ? { backgroundColor: p.color }
                      : { backgroundColor: p.bg, borderColor: p.color + '40', borderWidth: 1 },
                  ]}
                >
                  <Text style={{ color: priority === p.key ? '#fff' : p.color, fontSize: 13, fontFamily: F.med }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={{ gap: S.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
              <Text style={{ color: T.text, fontSize: 14, fontFamily: F.bold }}>الفئة</Text>
              <Tag size={16} color={T.muted} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity key={cat} onPress={() => setCategory(cat)}
                  style={[
                    s.chip,
                    category === cat
                      ? { backgroundColor: PRIMARY }
                      : { backgroundColor: dk ? T.card2 : '#EDE9FF', borderColor: T.border, borderWidth: 1 },
                  ]}
                >
                  <Text style={{ color: category === cat ? '#fff' : T.muted, fontSize: 13, fontFamily: F.med }}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Row: Date + Time */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { icon: Calendar, label: 'تاريخ الاستحقاق' },
              { icon: Clock,    label: 'الوقت' },
            ].map((item) => (
              <TouchableOpacity key={item.label} style={[s.pickerBtn, inputBg, { flex: 1 }]}>
                <Text style={{ color: T.muted, fontSize: 12, fontFamily: F.reg }}>{item.label}</Text>
                <item.icon size={16} color={PRIMARY} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Save */}
          <TouchableOpacity onPress={save} activeOpacity={0.85}>
            <LinearGradient colors={GRADIENT_D} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[s.saveBtn, primaryShadow]}>
              <Check size={18} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 16, fontFamily: F.black }}>حفظ المهمة</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: {
    borderTopLeftRadius:  32, borderTopRightRadius: 32,
    paddingTop: S.lg, gap: S.md, maxHeight: '90%',
  },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: S.sm },
  hRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: S.xl, paddingBottom: S.md,
  },
  closeBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  titleInput: {
    fontSize: 18, fontFamily: F.black, paddingBottom: S.sm, borderBottomWidth: 1,
  },
  textarea: {
    borderWidth: 1, borderRadius: R.md, padding: 12,
    fontSize: 14, fontFamily: F.reg, minHeight: 80,
  },
  chip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: R.full },
  pickerBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: R.md, padding: 12,
  },
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    paddingVertical: 15, borderRadius: R.full,
  },
});
