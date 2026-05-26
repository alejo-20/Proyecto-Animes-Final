import { useCallback, useState } from "react";
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, getCharacters, createCharacter, updateCharacter, deleteCharacter } from "@/services/api";
import * as ImagePicker from "expo-image-picker";

export default function PersonajesScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [characters, setCharacters] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [abilities, setAbilities] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [filterCat, setFilterCat] = useState<string>(category || "");

  useFocusEffect(
    useCallback(() => { loadData(); }, [])
  );

  const loadData = async (catSlug?: string) => {
    try {
      const slug = catSlug ?? filterCat;
      const [chars, cats] = await Promise.all([getCharacters(slug || undefined), getCategories()]);
      setCharacters(chars);
      setCategories(cats);
    } catch { setCharacters([]); setCategories([]); }
  };

  const selectImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.8, allowsMultipleSelection: true });
    if (!result.canceled) {
      const b64 = result.assets.map(a => a.base64).filter(Boolean) as string[];
      setImages(prev => [...prev, ...b64]);
    }
  };

  const openCreate = () => {
    setEditing(null); setName(""); setDescription(""); setAbilities(""); setCategoryId(null); setImages([]);
    setShowModal(true);
  };

  const openEdit = (ch: any) => {
    setEditing(ch); setName(ch.name); setDescription(ch.description || ""); setAbilities(ch.abilities || "");
    setCategoryId(ch.category_id); setImages([]); setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !categoryId) { Alert.alert("Error", "Nombre y categoría son requeridos"); return; }
    try {
      const data = { name: name.trim(), description: description.trim(), abilities: abilities.trim(), category_id: categoryId, images: images.length > 0 ? images : undefined };
      if (editing) {
        await updateCharacter(editing.id, data);
      } else {
        await createCharacter(data);
      }
      setShowModal(false); loadData();
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  const handleDelete = (id: number | string, name: string) => {
    Alert.alert("Eliminar", `¿Eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCharacter(id); loadData(); } catch (e: any) { Alert.alert("Error", e.message); }
      }},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.header, { backgroundColor: colors.bgDarker }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.secondary }]} />
        <Text style={sharedStyles.headerTitle}>PERSONAJES</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>CRUD</Text>
      </View>

      <View style={styles.container}>
        <Pressable style={[styles.addBtn, { borderColor: colors.secondary + "40" }]} onPress={openCreate}>
          <Ionicons name="add" size={20} color={colors.secondary} />
          <Text style={styles.addText}>NUEVO PERSONAJE</Text>
        </Pressable>

        <View style={styles.filterRow}>
          <Text style={styles.filterLabel}>FILTRAR:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
            <Pressable style={[styles.chip, !filterCat && { borderColor: colors.primary }]} onPress={() => { setFilterCat(""); loadData(""); }}>
              <Text style={[styles.chipText, !filterCat && { color: colors.primary }]}>TODOS</Text>
            </Pressable>
            {categories.map(cat => (
              <Pressable key={cat.id} style={[styles.chip, filterCat === cat.name && { borderColor: colors.primary }]} onPress={() => { setFilterCat(cat.name); loadData(cat.name); }}>
                <Text style={[styles.chipText, filterCat === cat.name && { color: colors.primary }]}>{cat.name.toUpperCase()}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {characters.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>SIN PERSONAJES</Text>
          </View>
        ) : (
          characters.map(ch => (
            <View key={ch.id} style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.secondary }]}>
              <View style={styles.chRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chName}>{ch.name}</Text>
                  <Text style={styles.chCat}>{ch.categories?.name || "Sin categoría"}</Text>
                </View>
                <View style={styles.chActions}>
                  <Pressable style={[styles.chBtn, { backgroundColor: colors.accent }]} onPress={() => openEdit(ch)}>
                    <Ionicons name="create" size={16} color={colors.bg} />
                  </Pressable>
                  <Pressable style={[styles.chBtn, { backgroundColor: colors.danger }]} onPress={() => handleDelete(ch.id, ch.name)}>
                    <Ionicons name="trash" size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
              <View style={styles.chBody}>
                <Text style={styles.chLabel}>DESCRIPCIÓN</Text>
                <Text style={styles.chValue}>{ch.description || "—"}</Text>
                <Text style={styles.chLabel}>HABILIDADES</Text>
                <Text style={styles.chValue}>{ch.abilities || "—"}</Text>
                {ch.images?.length > 0 && <Text style={styles.chValue}>{ch.images.length} imagen(es)</Text>}
              </View>
            </View>
          ))
        )}

        <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <View style={sharedStyles.backdrop}>
            <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={() => setShowModal(false)} />
            <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={[sharedStyles.modalHeader, { backgroundColor: colors.bgDarker }]}>
                <Text style={sharedStyles.modalTitle}>{editing ? "EDITAR" : "CREAR"} PERSONAJE</Text>
                <Pressable style={sharedStyles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={[sharedStyles.closeButtonText, { color: colors.secondary }]}>X</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={sharedStyles.modalBody}>
                <Text style={sharedStyles.label}>NOMBRE</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor={colors.textMuted} />
                <Text style={sharedStyles.label}>CATEGORÍA</Text>
                <View style={styles.catPicker}>
                  {categories.map(cat => (
                    <Pressable key={cat.id} style={[styles.catOption, categoryId === cat.id && { borderColor: colors.secondary, backgroundColor: colors.secondary + "15" }]} onPress={() => setCategoryId(cat.id)}>
                      <Text style={[styles.catOptionText, categoryId === cat.id && { color: colors.secondary }]}>{cat.name}</Text>
                    </Pressable>
                  ))}
                </View>
                <Text style={sharedStyles.label}>DESCRIPCIÓN</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descripción" placeholderTextColor={colors.textMuted} multiline />
                <Text style={sharedStyles.label}>HABILIDADES</Text>
                <TextInput style={[styles.input, styles.textArea]} value={abilities} onChangeText={setAbilities} placeholder="Habilidades" placeholderTextColor={colors.textMuted} multiline />
                <Text style={sharedStyles.label}>IMÁGENES</Text>
                <Pressable style={[styles.imagePicker, { borderColor: colors.secondary }]} onPress={selectImages}>
                  <Text style={[styles.imagePickerText, { color: colors.secondary }]}>
                    {images.length > 0 ? `${images.length} SELECCIONADA(S)` : "SELECCIONAR IMÁGENES"}
                  </Text>
                </Pressable>
                {images.length > 0 && (
                  <View style={styles.previews}>
                    {images.map((b64, i) => (
                      <Image key={i} source={{ uri: `data:image/jpeg;base64,${b64}` }} style={styles.preview} />
                    ))}
                  </View>
                )}
                <Pressable style={[sharedStyles.button, { backgroundColor: colors.secondary, borderColor: colors.secondary }]} onPress={handleSave}>
                  <Text style={sharedStyles.buttonText}>{editing ? "ACTUALIZAR" : "CREAR"}</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  accentBar: { width: 50, height: 3, marginBottom: 16 },
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  addBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.surface, borderRadius: 6, padding: 14, borderWidth: 1.5, marginBottom: 16 },
  addText: { color: colors.secondary, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  filterRow: { marginBottom: 16 },
  filterLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 8 },
  filterChips: { gap: 6 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  chipText: { color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  empty: { alignItems: "center", marginTop: 40, gap: 10 },
  emptyText: { color: colors.text, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  chRow: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 0, gap: 10 },
  chName: { color: colors.text, fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  chCat: { color: colors.textMuted, fontSize: 10, letterSpacing: 1, marginTop: 2 },
  chBody: { padding: 14, gap: 4 },
  chLabel: { color: colors.secondary, fontSize: 9, fontWeight: "700", letterSpacing: 2, marginTop: 6 },
  chValue: { color: colors.textLight, fontSize: 13 },
  chActions: { flexDirection: "row", gap: 6 },
  chBtn: { width: 32, height: 32, borderRadius: 4, justifyContent: "center", alignItems: "center" },
  input: { backgroundColor: colors.surfaceLight, borderRadius: 6, padding: 14, fontSize: 15, color: colors.text, marginBottom: 14, borderWidth: 1.5, borderColor: colors.border },
  textArea: { minHeight: 80, textAlignVertical: "top" },
  catPicker: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  catOption: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface },
  catOptionText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
  imagePicker: { borderRadius: 6, padding: 14, alignItems: "center", marginBottom: 12, borderWidth: 1.5, borderStyle: "dashed", backgroundColor: colors.surfaceLight },
  imagePickerText: { fontSize: 12, fontWeight: "700", letterSpacing: 1 },
  previews: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 },
  preview: { width: 80, height: 80, borderRadius: 6, backgroundColor: colors.bgDark },
});
