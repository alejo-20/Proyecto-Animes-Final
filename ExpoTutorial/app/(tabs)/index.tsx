import { useState } from "react";
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { getCharacters } from "@/services/api";

const CATEGORIES = [
  { slug: "saint-seiya", label: "Saint Seiya", name: "Saint Seiya", icon: "shield" as const, color: colors.primary },
  { slug: "hunter-x-hunter", label: "Hunter x Hunter", name: "Hunter x Hunter", icon: "compass" as const, color: colors.secondary },
  { slug: "one-piece", label: "One Piece", name: "One Piece", icon: "boat" as const, color: colors.accent },
  { slug: "naruto", label: "Naruto", name: "Naruto", icon: "flame" as const, color: "#FF6B35" },
];

export default function InicioScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setSearching(true);
    try {
      const chars = await getCharacters();
      const found = chars.find((c: any) =>
        c.name.toLowerCase().includes(searchText.toLowerCase())
      );
      if (found) {
        setSearchResult(found);
        if (found.images?.length > 0) {
          setSelectedImages(found.images);
        }
      } else {
        Alert.alert("No encontrado", "Personaje no encontrado");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setSearching(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.hero}>
        <View style={styles.glitchLine} />
        <Text style={styles.logo}>
          <Text style={styles.logoCyan}>NE</Text>X<Text style={styles.logoPink}>US</Text>
        </Text>
        <Text style={styles.tagline}>SISTEMA DE GESTIÓN DE ANIME</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>CATEGORÍAS</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat) => (
            <Pressable key={cat.slug} style={[styles.categoryCard, { borderColor: cat.color + "40" }]} onPress={() => router.push('/(tabs)/personajes?category=' + encodeURIComponent(cat.name))}>
              <View style={[styles.categoryIcon, { backgroundColor: cat.color + "15" }]}>
                <Ionicons name={cat.icon} size={24} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>BUSCAR PERSONAJE</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Nombre del personaje..."
            placeholderTextColor={colors.textMuted}
          />
          <Pressable style={styles.searchBtn} onPress={handleSearch} disabled={searching}>
            <Ionicons name="search" size={20} color={colors.bg} />
          </Pressable>
        </View>

        {searchResult && (
          <View style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.primary }]}>
            <View style={[sharedStyles.cardHeader, { backgroundColor: colors.bgDarker }]}>
              <Text style={{ ...sharedStyles.cardTitle, color: colors.primary, fontSize: 13 }}>{searchResult.name.toUpperCase()}</Text>
            </View>
            <View style={sharedStyles.cardBody}>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>DESCRIPCION</Text>
                <Text style={sharedStyles.infoValue}>{searchResult.description || "Sin descripción"}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>HABILIDADES</Text>
                <Text style={sharedStyles.infoValue}>{searchResult.abilities || "Sin habilidades"}</Text>
              </View>
              {searchResult.images?.length > 0 && (
                <Pressable
                  style={[sharedStyles.imagesButton, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}
                  onPress={() => { setSelectedImages(searchResult.images); setShowImages(true); }}
                >
                  <Text style={sharedStyles.imagesButtonText}>VER IMÁGENES ({searchResult.images.length})</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        <Modal visible={showImages} transparent animationType="fade" onRequestClose={() => setShowImages(false)}>
          <View style={sharedStyles.backdrop}>
            <View style={sharedStyles.backdropClick} onStartShouldSetResponder={() => true} onResponderRelease={() => setShowImages(false)} />
            <View style={sharedStyles.modalContainer} onStartShouldSetResponder={() => true}>
              <View style={[sharedStyles.modalHeader, { backgroundColor: colors.bgDarker }]}>
                <Text style={sharedStyles.modalTitle}>IMÁGENES ({selectedImages.length})</Text>
                <Pressable style={sharedStyles.closeButton} onPress={() => setShowImages(false)}>
                  <Text style={[sharedStyles.closeButtonText, { color: colors.primary }]}>X</Text>
                </Pressable>
              </View>
              <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={styles.imageGrid}>
                  {selectedImages.map((url, i) => (
                    <View key={i} style={styles.imageSlot}>
                      <Ionicons name="image" size={24} color={colors.textMuted} />
                      <Text style={styles.imageLabel}>#{i + 1}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },
  hero: {
    backgroundColor: colors.bgDarker,
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: colors.primary + "15",
  },
  glitchLine: { width: 80, height: 3, backgroundColor: colors.primary, marginBottom: 20 },
  logo: { fontSize: 46, fontWeight: "700", letterSpacing: 6, color: colors.text },
  logoCyan: { color: colors.primary },
  logoPink: { color: colors.secondary },
  tagline: { color: colors.textMuted, fontSize: 11, marginTop: 12, letterSpacing: 3, fontWeight: "700" },
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 24, paddingBottom: 50 },
  sectionTitle: { color: colors.text, fontSize: 12, fontWeight: "700", letterSpacing: 3, marginBottom: 14 },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 24 },
  categoryCard: {
    width: "47%", backgroundColor: colors.surface, borderRadius: 6, padding: 16,
    alignItems: "center", borderWidth: 1.5, gap: 10,
  },
  categoryIcon: { width: 48, height: 48, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  categoryLabel: { color: colors.text, fontSize: 12, fontWeight: "700", letterSpacing: 1, textAlign: "center" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 16 },
  searchInput: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 6, padding: 14,
    fontSize: 15, color: colors.text, borderWidth: 1.5, borderColor: colors.border,
  },
  searchBtn: {
    width: 48, height: 48, borderRadius: 6, backgroundColor: colors.primary,
    justifyContent: "center", alignItems: "center",
  },
  modalBody: { padding: 16 },
  imageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "center" },
  imageSlot: {
    width: "46%", backgroundColor: colors.surface, borderRadius: 6, padding: 20,
    alignItems: "center", borderWidth: 1.5, borderColor: colors.border, gap: 8,
  },
  imageLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 2 },
});
