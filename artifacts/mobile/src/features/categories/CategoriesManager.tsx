import React, { useState } from 'react';
import {
  Modal, View, Text, Pressable, ScrollView, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import { useCategoriesStore } from '../../store/categoriesStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAppTheme } from '../../hooks/useAppTheme';
import { Spacing, Radius, Shadow, F, PRIMARY, SECONDARY, GRADIENT_H } from '../../theme';
import { t, resolveDisplayName } from '../../utils/i18n';
import { Category } from '../../types';
import { BilingualNameField } from '../../components/ui/BilingualNameField';

import { SHARED_ICONS as CATEGORY_ICONS, SHARED_COLORS as CATEGORY_COLORS } from '../../constants/pickerOptions';

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
  const isRTL = lang === 'ar';
  const tFunc = (key: string) => t(key, lang);

  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [nameError, setNameError] = useState(false);
  const [color, setColor] = useState(CATEGORY_COLORS[0]);
  const [icon, setIcon] = useState(CATEGORY_ICONS[0]);

  const openAdd = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingCat(null);
    setNameAr('');
    setNameEn('');
    setNameError(false);
    setColor(CATEGORY_COLORS[0]);
    setIcon(CATEGORY_ICONS[0]);
    setShowForm(true);
  };

  const openEdit = (cat: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingCat(cat);
    setNameAr(cat.name_ar ?? (cat.name && !cat.name_en ? cat.name : ''));
    setNameEn(cat.name_en ?? '');
    setNameError(false);
    setColor(cat.color);
    setIcon(cat.icon);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!nameAr.trim() && !nameEn.trim()) { setNameError(true); return; }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const resolvedName = resolveDisplayName(nameAr, nameEn, lang, nameAr || nameEn);
    if (editingCat) {
      updateCategory(editingCat.id, { name: resolvedName, name_ar: nameAr.trim() || undefined, name_en: nameEn.trim() || undefined, color, icon });
    } else {
      addCategory({ name: resolvedName, name_ar: nameAr.trim() || undefined, name_en: nameEn.trim() || undefined, color, icon });
    }
    setShowForm(false);
  };

  const handleDelete = (cat: Category) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      tFunc('delete'),
      resolveDisplayName(cat.name_ar, cat.name_en, lang, cat.name),
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
        <View style={[styles.header, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          <Pressable onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={C.textSecondary} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: C.text }]}>{tFunc('categories')}</Text>
          <Pressable onPress={openAdd}>
            <LinearGradient colors={[...GRADIENT_H]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.addBtn}>
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
                <LinearGradient colors={[...GRADIENT_H]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]} />
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.emptyAddText}>{tFunc('addNew')}</Text>
              </Pressable>
            </View>
          ) : (
            categories.map((cat) => (
              <View key={cat.id} style={[
                styles.catCard,
                { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
                isRTL ? { paddingLeft: Spacing.md } : { paddingRight: Spacing.md },
              ]}>
                <View style={[styles.catAccent, { backgroundColor: cat.color }]} />
                <View style={[styles.catIcon, { backgroundColor: cat.color + '18' }]}>
                  <Ionicons name={(cat.icon + '-outline') as React.ComponentProps<typeof Ionicons>['name']} size={22} color={cat.color} />
                </View>
                <View style={styles.catInfo}>
                  <Text style={[styles.catName, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{resolveDisplayName(cat.name_ar, cat.name_en, lang, cat.name)}</Text>
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

      {/* Add/Edit form — full sheet modal */}
      <Modal visible={showForm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowForm(false)}>
        <View style={[styles.formContainer, { backgroundColor: C.background }]}>
            {/* Form header */}
            <View style={[styles.formHeader, { borderBottomColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Pressable onPress={() => setShowForm(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={22} color={C.textSecondary} />
              </Pressable>
              <Text style={[styles.headerTitle, { color: C.text }]}>
                {editingCat ? tFunc('edit') : tFunc('addNew')}
              </Text>
              <View style={{ width: 36 }} />
            </View>

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Preview icon */}
              <View style={styles.formPreviewSection}>
                <View style={[styles.formPreviewIcon, { backgroundColor: color + '18' }]}>
                  <Ionicons name={(icon + '-outline') as React.ComponentProps<typeof Ionicons>['name']} size={32} color={color} />
                </View>
              </View>

              {/* Name inputs */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('name')}</Text>
                <BilingualNameField
                  lang={lang}
                  nameAr={nameAr}
                  nameEn={nameEn}
                  onChangeAr={setNameAr}
                  onChangeEn={setNameEn}
                  error={nameError}
                  onClearError={() => setNameError(false)}
                  labelKey="name"
                  placeholderAr="مثال: عمل"
                  placeholderEn="e.g. Work"
                />
              </View>

              {/* Live preview */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>
                  {lang === 'ar' ? 'معاينة' : 'Preview'}
                </Text>
                <View style={[
                  styles.preview,
                  { backgroundColor: C.card, borderColor: C.border, flexDirection: isRTL ? 'row-reverse' : 'row' },
                  isRTL ? { paddingLeft: Spacing.md } : { paddingRight: Spacing.md },
                ]}>
                  <View style={[styles.previewAccent, { backgroundColor: color }]} />
                  <View style={[styles.previewIconBox, { backgroundColor: color + '18' }]}>
                    <Ionicons name={(icon + '-outline') as React.ComponentProps<typeof Ionicons>['name']} size={20} color={color} />
                  </View>
                  <Text style={[styles.previewText, { color: C.text, textAlign: isRTL ? 'right' : 'left' }]}>{resolveDisplayName(nameAr, nameEn, lang) || '...'}</Text>
                </View>
              </View>

              {/* Icon picker */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('icon')}</Text>
                <View style={styles.iconGrid}>
                  {CATEGORY_ICONS.map((ic) => {
                    const isActive = icon === ic;
                    return (
                      <Pressable
                        key={ic}
                        onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setIcon(ic); }}
                        style={[
                          styles.iconChoice,
                          {
                            backgroundColor: isActive ? color + '20' : C.surface,
                            borderColor: isActive ? color : 'transparent',
                            borderWidth: isActive ? 2 : 0,
                          },
                        ]}
                      >
                        <Ionicons name={(ic + '-outline') as React.ComponentProps<typeof Ionicons>['name']} size={20} color={isActive ? color : C.textMuted} />
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Color picker */}
              <View style={styles.formField}>
                <Text style={[styles.formLabel, { color: C.textSecondary, textAlign: isRTL ? 'right' : 'left' }]}>{tFunc('color')}</Text>
                <View style={styles.colorGrid}>
                  {CATEGORY_COLORS.map((cl, ci) => {
                    const isActive = color === cl;
                    return (
                      <Pressable
                        key={`${cl}-${ci}`}
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
            </ScrollView>

            {/* Bottom save button */}
            <View style={[styles.formBottomBar, {
              paddingBottom: insets.bottom + Spacing.md,
              borderTopColor: C.border,
              flexDirection: isRTL ? 'row-reverse' : 'row',
            }]}>
              <Pressable
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setShowForm(false); }}
                style={[styles.formCancelBtn, { backgroundColor: C.surface, borderColor: C.border }]}
              >
                <Text style={[styles.formCancelText, { color: C.textSecondary }]}>{tFunc('cancel')}</Text>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.formSaveBtn}>
                <LinearGradient
                  colors={[...GRADIENT_H]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[StyleSheet.absoluteFill, { borderRadius: Radius.xl }]}
                />
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.formSaveText}>{tFunc('save')}</Text>
              </Pressable>
            </View>
          </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 19, fontFamily: F.bold },
  addBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  list: { padding: Spacing.lg, gap: Spacing.sm },

  catCard: {
    alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.xl, borderWidth: 1, overflow: 'hidden',
    paddingVertical: Spacing.md,
    ...Shadow.sm,
  },
  catAccent: { width: 4, alignSelf: 'stretch' },
  catIcon: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },
  catInfo: { flex: 1 },
  catName: { fontSize: 16, fontFamily: F.med },
  catActions: { flexDirection: 'row', gap: 6 },
  catActionBtn: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },

  emptyBox: { alignItems: 'center', paddingTop: 80, gap: Spacing.md },
  emptyIconBox: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm,
  },
  emptyTitle: { fontSize: 18, fontFamily: F.bold },
  emptySub: { fontSize: 14, fontFamily: F.reg, textAlign: 'center' },
  emptyAddBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderRadius: Radius.xl, height: 48,
    paddingHorizontal: Spacing.xxl,
    overflow: 'hidden', marginTop: Spacing.md,
  },
  emptyAddText: { fontSize: 15, fontFamily: F.med, color: '#fff' },

  formContainer: { flex: 1 },
  formHeader: {
    alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, paddingBottom: Spacing.md,
    borderBottomWidth: 1,
  },
  formContent: {
    padding: Spacing.xl,
    gap: Spacing.xxl,
    paddingBottom: 120,
  },
  formPreviewSection: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  formPreviewIcon: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
  },

  formField: { gap: Spacing.sm },
  formLabel: {
    fontSize: 13, fontFamily: F.med,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  formInput: {
    borderRadius: Radius.lg, borderWidth: 1,
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    fontSize: 17, fontFamily: F.reg, height: 52,
  },

  iconGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center',
  },
  iconChoice: {
    width: 44, height: 44, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
  },

  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  colorChoice: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },

  preview: {
    alignItems: 'center', gap: Spacing.md,
    borderRadius: Radius.lg, borderWidth: 1, overflow: 'hidden',
    paddingVertical: Spacing.md,
  },
  previewAccent: { width: 4, alignSelf: 'stretch' },
  previewIconBox: {
    width: 36, height: 36, borderRadius: Radius.sm,
    alignItems: 'center', justifyContent: 'center',
  },
  previewText: { fontSize: 16, fontFamily: F.med, flex: 1 },

  formBottomBar: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
  },
  formCancelBtn: {
    flex: 1, borderRadius: Radius.xl, height: 54,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  formCancelText: { fontSize: 17, fontFamily: F.med },
  formSaveBtn: {
    flex: 2, flexDirection: 'row', borderRadius: Radius.xl, height: 54,
    alignItems: 'center', justifyContent: 'center', gap: 8, overflow: 'hidden',
  },
  formSaveText: { fontSize: 17, fontFamily: F.bold, color: '#fff' },
});
