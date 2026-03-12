import React, { useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView, TextInput, StyleSheet, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Spacing, Radius, Shadow } from '../../theme';
import { t } from '../../utils/i18n';
import { Category } from '../../types';

const CATEGORY_ICONS = [
  'briefcase', 'person', 'fitness', 'book', 'card',
  'home', 'heart', 'star', 'rocket', 'leaf',
  'musical-notes', 'camera', 'globe', 'school', 'cart',
  'airplane', 'cafe', 'game-controller', 'brush', 'code-slash',
];

const CATEGORY_COLORS = [
  '#6C8EF5', '#F0A4C8', '#4CAF82', '#9B6EF5', '#F5A623',
  '#E05E5E', '#FF8A50', '#5CC2C2', '#7C5CFC', '#FF6B9D',
  '#00C48C', '#FFB800', '#FF4D6A', '#A855F7', '#3B82F6',
];

interface CategoriesManagerProps {
  visible: boolean;
  onClose: () => void;
}

export function CategoriesManager({ visible, onClose }: CategoriesManagerProps) {
  const { C } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoriesStore();
  const { profile } = useSettingsStore();
  const lang = profile.language;
  const tFunc = (key: string) => t(key, lang);

  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

  const openAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingCat(null);
    setName('');
    setColor(CATEGORY_COLORS[0]);
    setIcon(CATEGORY_ICONS[0]);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingCat(cat);
    setName(cat.name);
    setColor(cat.color);
    setIcon(cat.icon);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (editingCat) {
      updateCategory(editingCat.id, { name: name.trim(), color, icon });
    } else {
      addCategory({ name: name.trim(), color, icon });
    }
    setShowForm(false);
  };

  const handleDelete = (cat: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      tFunc('delete'),
      cat.name,
      [
        { text: tFunc('cancel'), style: 'cancel' },
        { text: tFunc('delete'), style: 'destructive', onPress: () => deleteCategory(cat.id) },
      ]
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[styles.container, { backgroundColor: C.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: C.border }]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={C.textSecondary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('categories')}</Text>
          <Pressable onPress={openAdd}>
            <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
              <Ionicons name="add" size={18} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Categories list */}
        <ScrollView contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 40 }]}>
          {categories.length === 0 ? (
            <View style={styles.emptyBox}>
              <View style={[styles.emptyIconBox, { backgroundColor: C.tint + '12' }]}>
                <Ionicons name="folder-open-outline" size={40} color={C.tint} />
              </View>
              <Text style={[styles.emptyTitle, { color: C.text }]}>{tFunc('none')}</Text>
              <Text style={[styles.emptySub, { color: C.textMuted }]}>
                {lang === 'ar' ? 'أضف فئة لتنظيم مهامك' : 'Add a category to organize your tasks'}
              </Text>
              <Pressable onPress={openAdd} style={styles.emptyAddBtn}>
                <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.emptyAddText}>{tFunc('addNew')}</Text>
              </Pressable>
            </View>
          ) : (
            categories.map((cat) => (
              <View key={cat.id} style={[styles.catCard, { backgroundColor: C.card, borderColor: C.border }]}>
                <View style={[styles.catAccent, { backgroundColor: cat.color }]} />
                <View style={[styles.catIcon, { backgroundColor: cat.color + '18' }]}>
                  <Ionicons name={(cat.icon + '-outline') as any} size={22} color={cat.color} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: C.text }]}>{cat.name}</Text>
                </View>
                <View style={styles.catActions}>
                  <Pressable
                    onPress={() => openEdit(cat)}
                    style={[styles.catActionBtn, { backgroundColor: C.tint + '12' }]}
                    hitSlop={4}
                  >
                    <Ionicons name="pencil-outline" size={16} color={C.tint} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(cat)}
                    style={[styles.catActionBtn, { backgroundColor: C.error + '12' }]}
                    hitSlop={4}
                  >
                    <Ionicons name="trash-outline" size={16} color={C.error} />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Add/Edit form modal */}
      <Modal visible={showForm} animationType="fade" transparent onRequestClose={() => setShowForm(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowForm(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <Pressable style={[styles.formCard, { backgroundColor: C.card }]} onPress={() => {}}>
              {/* Form header with preview */}
              <View style={styles.formHeader}>
                <View style={[styles.formPreviewIcon, { backgroundColor: color + '18' }]}>
                  <Ionicons name={(icon + '-outline') as any} size={28} color={color} />
                </View>
                <Text style={[styles.formTitle, { color: C.text }]}>
                  {editingCat ? tFunc('edit') : tFunc('addNew')}
                </Text>
              </View>

              {/* Name input */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('name')}</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder={lang === 'ar' ? 'اسم الفئة' : 'Category name'}
                  placeholderTextColor={C.textMuted}
                  style={[styles.formInput, { backgroundColor: C.inputBg, borderColor: C.border, color: C.text }]}
                />
              </View>

              {/* Icon picker */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('icon')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.iconRow}>
                  {CATEGORY_ICONS.map((ic) => {
                    const isActive = icon === ic;
                    return (
                      <Pressable
                        key={ic}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIcon(ic); }}
                        style={[
                          styles.iconChoice,
                          { backgroundColor: isActive ? color + '20' : C.surface, borderColor: isActive ? color : 'transparent', borderWidth: isActive ? 2 : 0 },
                        ]}
                      >
                        <Ionicons name={(ic + '-outline') as any} size={20} color={isActive ? color : C.textMuted} />
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Color picker */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary }]}>{tFunc('color')}</Text>
                <View style={styles.colorGrid}>
                  {CATEGORY_COLORS.map((cl) => {
                    const isActive = color === cl;
                    return (
                      <Pressable
                        key={cl}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setColor(cl); }}
                        style={[
                          styles.colorChoice,
                          { backgroundColor: cl },
                          isActive && styles.colorSelected,
                        ]}
                      >
                        {isActive && <Ionicons name="checkmark" size={16} color="#fff" />}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Live preview */}
              <View style={[styles.preview, { backgroundColor: C.surface, borderColor: C.border }]}>
                <View style={[styles.previewAccent, { backgroundColor: color }]} />
                <View style={[styles.previewIconBox, { backgroundColor: color + '18' }]}>
                  <Ionicons name={(icon + '-outline') as any} size={20} color={color} />
                </View>
                <Text style={[styles.previewText, { color: C.text }]}>{name || '...'}</Text>
              </View>

              {/* Action buttons */}
              <View style={styles.formActions}>
                <Pressable
                  onPress={() => setShowForm(false)}
                  style={[styles.formCancelBtn, { backgroundColor: C.surface, borderColor: C.border }]}
                >
                  <Text style={[styles.formCancelText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
                </Pressable>
                <Pressable onPress={handleSave} style={styles.formSaveBtn}>
                  <LinearGradient
                    colors={['#7C5CFC', '#FF6B9D']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
                  />
                  <Ionicons name="checkmark" size={18} color="#fff" />
                  <Text style={styles.formSaveText}>{tFunc('save')}</Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { padding: Spacing.lg, gap: Spacing.sm },

  // Category card
  catCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    paddingVertical: Spacing.md, paddingRight: Spacing.md,
    ...Shadow.sm,
  },
  catAccent: { width: 4, alignSelf: 'stretch' },
  catIcon: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  catInfo: { flex: 1 },
  catName: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  catActions: { flexDirection: 'row', gap: 6 },
  catActionBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  // Empty state
  emptyBox: { alignItems: 'center', paddingTop: 80, gap: Spacing.md },
  emptyIconBox: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  emptyTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  emptySub: { fontSize: 14, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.xl, height: 48,
    paddingHorizontal: Spacing.xxl,
    overflow: 'hidden', marginTop: Spacing.md,
  },
  emptyAddText: { fontSize: 15, fontFamily: 'Inter_600SemiBold', color: '#fff' },

  // Form overlay
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  formCard: {
    width: '100%', maxWidth: 400, borderRadius: Radius.xxl,
    padding: Spacing.xl, gap: Spacing.lg,
    ...Shadow.lg,
  },
  formHeader: { alignItems: 'center', gap: Spacing.sm, paddingBottom: Spacing.sm },
  formPreviewIcon: {
    width: 56, height: 56, borderRadius: 28,
    alignItems: 'center', justifyContent: 'center',
  },
  formTitle: { fontSize: 20, fontFamily: 'Inter_700Bold' },

  formField: { gap: Spacing.sm },
  formLabel: {
    fontSize: 13, fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  formInput: {
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 17, fontFamily: 'Inter_400Regular', height: 52,
  },

  iconRow: { gap: 8, paddingVertical: 2 },
  iconChoice: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorChoice: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },

  // Preview
  preview: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden',
    paddingVertical: Spacing.md, paddingRight: Spacing.md,
  },
  previewAccent: { width: 4, alignSelf: 'stretch' },
  previewIconBox: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  previewText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },

  // Action buttons
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  formCancelBtn: {
    flex: 1, borderRadius: Radius.xl, height: 50,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  formCancelText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  formSaveBtn: {
    flex: 2, flexDirection: 'row', borderRadius: Radius.xl, height: 50,
    alignItems: 'center', justifyContent: 'center', gap: 6, overflow: 'hidden',
  },
  formSaveText: { fontSize: 16, fontFamily: 'Inter_700Bold', color: '#fff' },
});
