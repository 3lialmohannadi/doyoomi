import React, { useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView, TextInput, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Spacing, Radius, Typography } from '../../theme';
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
    setEditingCat(null);
    setName('');
    setColor(CATEGORY_COLORS[0]);
    setIcon(CATEGORY_ICONS[0]);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setColor(cat.color);
    setIcon(cat.icon);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!name.trim()) return;
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
          <Pressable onPress={onClose}>
            <Text style={[styles.cancelBtn, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('categories')}</Text>
          <Pressable onPress={openAdd}>
            <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addGrad}>
              <Ionicons name="add" size={16} color="#fff" />
            </LinearGradient>
          </Pressable>
        </View>

        {/* Categories list */}
        <ScrollView contentContainerStyle={styles.list}>
          {categories.map((cat) => (
            <View key={cat.id} style={[styles.catRow, { backgroundColor: C.card, borderColor: C.border }]}>
              <View style={[styles.catIcon, { backgroundColor: cat.color + '20' }]}>
                <Ionicons name={(cat.icon + '-outline') as any} size={20} color={cat.color} />
              </View>
              <Text style={[styles.catName, { color: C.text }]}>{cat.name}</Text>
              <View style={[styles.colorDot, { backgroundColor: cat.color }]} />
              <Pressable onPress={() => openEdit(cat)} hitSlop={8} style={styles.actionBtn}>
                <Ionicons name="pencil-outline" size={18} color={C.tint} />
              </Pressable>
              <Pressable onPress={() => handleDelete(cat)} hitSlop={8} style={styles.actionBtn}>
                <Ionicons name="trash-outline" size={18} color={C.error} />
              </Pressable>
            </View>
          ))}
          {categories.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="folder-open-outline" size={48} color={C.textMuted} />
              <Text style={[styles.emptyText, { color: C.textMuted }]}>{tFunc('none')}</Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Add/Edit form modal */}
      <Modal visible={showForm} animationType="fade" transparent onRequestClose={() => setShowForm(false)}>
        <Pressable style={styles.overlay} onPress={() => setShowForm(false)}>
          <Pressable style={[styles.formCard, { backgroundColor: C.card }]} onPress={() => {}}>
            <Text style={[styles.formTitle, { color: C.text }]}>
              {editingCat ? tFunc('edit') : tFunc('addNew')}
            </Text>

            {/* Name input */}
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder={tFunc('name')}
              placeholderTextColor={C.textMuted}
              style={[styles.input, { backgroundColor: C.surface, borderColor: C.border, color: C.text }]}
            />

            {/* Icon picker */}
            <Text style={[styles.pickerLabel, { color: C.textSecondary }]}>{tFunc('icon')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerRow}>
              {CATEGORY_ICONS.map((ic) => (
                <Pressable
                  key={ic}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIcon(ic); }}
                  style={[styles.iconChoice, icon === ic && { backgroundColor: C.tint + '25', borderColor: C.tint, borderWidth: 2 }]}
                >
                  <Ionicons name={(ic + '-outline') as any} size={22} color={icon === ic ? C.tint : C.textMuted} />
                </Pressable>
              ))}
            </ScrollView>

            {/* Color picker */}
            <Text style={[styles.pickerLabel, { color: C.textSecondary }]}>{tFunc('color')}</Text>
            <View style={styles.colorGrid}>
              {CATEGORY_COLORS.map((cl) => (
                <Pressable
                  key={cl}
                  onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setColor(cl); }}
                  style={[styles.colorChoice, { backgroundColor: cl }, color === cl && styles.colorSelected]}
                >
                  {color === cl && <Ionicons name="checkmark" size={16} color="#fff" />}
                </Pressable>
              ))}
            </View>

            {/* Preview */}
            <View style={[styles.preview, { backgroundColor: color + '15' }]}>
              <Ionicons name={(icon + '-outline') as any} size={24} color={color} />
              <Text style={[styles.previewText, { color }]}>{name || '...'}</Text>
            </View>

            {/* Actions */}
            <View style={styles.formActions}>
              <Pressable onPress={() => setShowForm(false)} style={[styles.formBtn, { backgroundColor: C.surface }]}>
                <Text style={[styles.formBtnText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
              </Pressable>
              <Pressable onPress={handleSave}>
                <LinearGradient colors={['#7C5CFC', '#FF6B9D']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.formBtn}>
                  <Text style={[styles.formBtnText, { color: '#fff' }]}>{tFunc('save')}</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.xl, paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  cancelBtn: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  headerTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  addGrad: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, gap: Spacing.sm },
  catRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, borderRadius: Radius.lg, borderWidth: 1,
  },
  catIcon: { width: 40, height: 40, borderRadius: Radius.sm, alignItems: 'center', justifyContent: 'center' },
  catName: { flex: 1, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
  actionBtn: { padding: 6 },
  emptyBox: { alignItems: 'center', paddingTop: 60, gap: Spacing.md },
  emptyText: { fontSize: 15, fontFamily: 'Inter_400Regular' },

  // Form overlay
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center', padding: Spacing.lg,
  },
  formCard: {
    width: '100%', maxWidth: 400, borderRadius: Radius.xl,
    padding: Spacing.xl, gap: Spacing.md,
  },
  formTitle: { fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  input: {
    borderRadius: Radius.md, borderWidth: 1,
    paddingHorizontal: Spacing.md, paddingVertical: 12,
    fontSize: 16, fontFamily: 'Inter_400Regular',
  },
  pickerLabel: { fontSize: 13, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 4 },
  pickerRow: { flexGrow: 0 },
  iconChoice: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
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
  preview: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    padding: Spacing.md, borderRadius: Radius.md,
  },
  previewText: { fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  formActions: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.sm },
  formBtn: { flex: 1, borderRadius: Radius.full, paddingVertical: 12, alignItems: 'center' },
  formBtnText: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
});
