import { useCallback, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/services/api";

export default function CategoriasScreen() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useFocusEffect(
    useCallback(() => { loadCategories(); }, [])
  );

  const loadCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch { setCategories([]); }
  };

  const openCreate = () => {
    setEditing(null);
    setName("");
    setDescription("");
    setShowModal(true);
  };

  const openEdit = (cat: any) => {
    setEditing(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert("Error", "El nombre es requerido"); return; }
    try {
      if (editing) {
        await updateCategory(editing.id, name.trim(), description.trim());
      } else {
        await createCategory(name.trim(), description.trim());
      }
      setShowModal(false);
      loadCategories();
    } catch (e: any) { Alert.alert("Error", e.message); }
  };

  const handleDelete = (id: number | string, name: string) => {
    Alert.alert("Eliminar", `¿Eliminar "${name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: async () => {
        try { await deleteCategory(id); loadCategories(); }
        catch (e: any) { Alert.alert("Error", e.message); }
      }},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <View style={[sharedStyles.header, { backgroundColor: colors.bgDarker }]}>
        <View style={[styles.accentBar, { backgroundColor: colors.primary }]} />
        <Text style={sharedStyles.headerTitle}>CATEGORÍAS</Text>
        <Text style={[sharedStyles.headerSubtitle, { color: colors.textLight }]}>GESTIÓN</Text>
      </View>

      <View style={styles.container}>
        <Pressable style={[styles.addBtn, { borderColor: colors.primary + "40" }]} onPress={openCreate}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={styles.addText}>NUEVA CATEGORÍA</Text>
        </Pressable>

        {categories.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>SIN CATEGORÍAS</Text>
          </View>
        ) : (
          categories.map((cat) => (
            <View key={cat.id} style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.primary }]}>
              <View style={styles.catRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.catName}>{cat.name}</Text>
                  {cat.description ? <Text style={styles.catDesc}>{cat.description}</Text> : null}
                </View>
                <View style={styles.catActions}>
                  <Pressable style={[styles.catBtn, { backgroundColor: colors.accent }]} onPress={() => openEdit(cat)}>
                    <Ionicons name="create" size={16} color={colors.bg} />
                  </Pressable>
                  <Pressable style={[styles.catBtn, { backgroundColor: colors.danger }]} onPress={() => handleDelete(cat.id, cat.name)}>
                    <Ionicons name="trash" size={16} color={colors.text} />
                  </Pressable>
                </View>
              </View>
              <Text style={styles.catSlug}>/{cat.name.toLowerCase().replace(/\s+/g, '-')}</Text>
            </View>
          ))
        )}

        <Modal visible={showModal} transparent animationType="fade" onRequestClose={() => setShowModal(false)}>
          <View style={sharedStyles.backdrop}>
            <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={() => setShowModal(false)} />
            <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={[sharedStyles.modalHeader, { backgroundColor: colors.bgDarker }]}>
                <Text style={sharedStyles.modalTitle}>{editing ? "EDITAR" : "CREAR"} CATEGORÍA</Text>
                <Pressable style={sharedStyles.closeButton} onPress={() => setShowModal(false)}>
                  <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>X</Text>
                </Pressable>
              </View>
              <View style={sharedStyles.modalBody}>
                <Text style={sharedStyles.label}>NOMBRE</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Nombre" placeholderTextColor={colors.textMuted} />
                <Text style={sharedStyles.label}>DESCRIPCIÓN</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Descripción" placeholderTextColor={colors.textMuted} multiline />
                <Pressable style={[sharedStyles.button, { backgroundColor: colors.primary, borderColor: colors.primaryDark }]} onPress={handleSave}>
                  <Text style={sharedStyles.buttonText}>{editing ? "ACTUALIZAR" : "CREAR"}</Text>
                </Pressable>
              </View>
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
  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    backgroundColor: colors.surface, borderRadius: 6, padding: 14, borderWidth: 1.5, marginBottom: 16,
  },
  addText: { color: colors.primary, fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  empty: { alignItems: "center", marginTop: 40, gap: 10 },
  emptyText: { color: colors.text, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  catRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 10 },
  catName: { color: colors.text, fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  catDesc: { color: colors.textLight, fontSize: 12, marginTop: 2 },
  catSlug: { color: colors.textMuted, fontSize: 10, letterSpacing: 1, paddingHorizontal: 14, paddingBottom: 10 },
  catActions: { flexDirection: "row", gap: 6 },
  catBtn: { width: 32, height: 32, borderRadius: 4, justifyContent: "center", alignItems: "center" },
  input: { backgroundColor: colors.surfaceLight, borderRadius: 6, padding: 14, fontSize: 15, color: colors.text, marginBottom: 14, borderWidth: 1.5, borderColor: colors.border },
  textArea: { minHeight: 80, textAlignVertical: "top" },
});
