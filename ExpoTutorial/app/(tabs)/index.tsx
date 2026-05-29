import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Dimensions, FlatList, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, sharedStyles } from "@/theme";
import { useAnimeStore } from "@/store/animeStore";

const API_BASE = __DEV__
  ? 'http://localhost:3000'
  : 'https://proyecto-animes-final-production.up.railway.app';

const CATEGORIES = [
  { slug: "saint-seiya", apiSlug: "saintseiya", label: "Saint Seiya", name: "Saint Seiya", icon: "shield" as const, color: colors.primary },
  { slug: "hunter-x-hunter", apiSlug: "hunterxhunter", label: "Hunter x Hunter", name: "Hunter x Hunter", icon: "compass" as const, color: colors.secondary },
  { slug: "one-piece", apiSlug: "onepiece", label: "One Piece", name: "One Piece", icon: "boat" as const, color: colors.accent },
  { slug: "naruto", apiSlug: "naruto", label: "Naruto", name: "Naruto", icon: "flame" as const, color: "#FF6B35" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const IMAGE_GAP = 8;
const IMAGE_PADDING = 32;
const IMAGE_SIZE = (SCREEN_WIDTH - IMAGE_PADDING - IMAGE_GAP) / 2;

export default function InicioScreen() {
  const setLastCharacter = useAnimeStore(s => s.setLastCharacter);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchName, setSearchName] = useState("");
  const [characters, setCharacters] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedCategory) return;
    setError("");
    setResult(null);
    setImages([]);
    setCharacters([]);
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/anime/${selectedCategory}`);
        if (!res.ok) throw new Error("Error al obtener personajes");
        const data = await res.json();
        if (Array.isArray(data)) setCharacters(data);
      } catch (err: any) {
        console.error('Error cargando personajes:', err);
        setError(`Error: ${err?.message || 'Sin conexión al backend'}`);
      }
    })();
  }, [selectedCategory]);

  const handleCategoryPress = (cat: typeof CATEGORIES[0]) => {
    setSelectedCategory(cat.apiSlug);
    setSearchName("");
    setResult(null);
    setError("");
  };

  const handleSearch = async () => {
    if (!selectedCategory) {
      Alert.alert("Selecciona una categoría", "Toca una tarjeta de categoría primero");
      return;
    }
    if (!searchName.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    setImages([]);
    try {
      const res = await fetch(`${API_BASE}/api/anime/${selectedCategory}/${encodeURIComponent(searchName.trim())}`);
      if (res.status === 404) {
        Alert.alert("No encontrado", "Personaje no encontrado");
        return;
      }
      if (!res.ok) throw new Error("Error del servidor");
      const data = await res.json();
      setResult(data);
      if (data.images?.length > 0) setImages(data.images);
      setLastCharacter(selectedCategory, {
        name: data.name, age: data.age, power: data.power,
        images: data.images || [], category: selectedCategory,
      });
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  const renderCharChip = ({ item }: { item: string }) => (
    <Pressable style={styles.chip} onPress={() => setSearchName(item)}>
      <Text style={styles.chipText}>{item}</Text>
    </Pressable>
  );

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
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.apiSlug;
            return (
              <TouchableOpacity
                key={cat.slug}
                activeOpacity={0.7}
                style={[styles.categoryCard, { borderColor: isSelected ? cat.color : cat.color + "40", backgroundColor: isSelected ? cat.color + "10" : colors.surface }]}
                onPress={() => handleCategoryPress(cat)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: cat.color + "15" }]}>
                  <Ionicons name={cat.icon} size={24} color={cat.color} />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>BUSCAR PERSONAJE</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.searchInput, !selectedCategory && { opacity: 0.5 }]}
            value={searchName}
            onChangeText={setSearchName}
            placeholder={selectedCategory ? "Nombre del personaje..." : "Selecciona una categoría primero"}
            placeholderTextColor={colors.textMuted}
            editable={!!selectedCategory}
          />
          <Pressable style={[styles.searchBtn, { opacity: loading || !selectedCategory ? 0.5 : 1 }]} onPress={handleSearch} disabled={loading || !selectedCategory}>
            {loading ? <ActivityIndicator size="small" color={colors.bg} /> : <Ionicons name="search" size={20} color={colors.bg} />}
          </Pressable>
        </View>

        {selectedCategory && characters.length > 0 && (
          <View style={styles.charsSection}>
            <Text style={styles.charsLabel}>PERSONAJES DISPONIBLES</Text>
            <FlatList
              data={characters}
              renderItem={renderCharChip}
              keyExtractor={(item) => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsList}
            />
          </View>
        )}

        {error ? (
          <View style={[sharedStyles.errorBox, { marginTop: 12 }]}>
            <Text style={sharedStyles.errorText}>{error}</Text>
          </View>
        ) : null}

        {result && (
          <View style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.primary, marginTop: 16 }]}>
            <View style={[sharedStyles.cardHeader, { backgroundColor: colors.bgDarker }]}>
              <Text style={{ ...sharedStyles.cardTitle, color: colors.primary, fontSize: 13 }}>{result.name?.toUpperCase()}</Text>
            </View>
            <View style={sharedStyles.cardBody}>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>EDAD</Text>
                <Text style={sharedStyles.infoValue}>{result.age || "—"}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>PODER / TÉCNICA</Text>
                <Text style={sharedStyles.infoValue}>{result.power || result.technique || "—"}</Text>
              </View>
              <View style={sharedStyles.infoRow}>
                <Text style={[sharedStyles.infoLabel, { color: colors.primary }]}>{images.length} IMÁGENES RECUPERADA(S)</Text>
              </View>
              {images.length > 0 && (
                <Pressable
                  style={[sharedStyles.imagesButton, { backgroundColor: colors.secondary, borderColor: colors.secondary }]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={sharedStyles.imagesButtonText}>VER IMÁGENES ({images.length})</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>IMÁGENES ({images.length})</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalClose}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.imageGrid}>
                {images.map((uri, index) => (
                  <Image key={index} source={{ uri }} style={styles.gridImage} resizeMode="cover" />
                ))}
              </View>
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
    width: "47%", borderRadius: 6, padding: 16,
    alignItems: "center", borderWidth: 1.5, gap: 10,
  },
  categoryIcon: { width: 48, height: 48, borderRadius: 6, justifyContent: "center", alignItems: "center" },
  categoryLabel: { color: colors.text, fontSize: 12, fontWeight: "700", letterSpacing: 1, textAlign: "center" },
  searchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  searchInput: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 6, padding: 14,
    fontSize: 15, color: colors.text, borderWidth: 1.5, borderColor: colors.border,
  },
  searchBtn: {
    width: 48, height: 48, borderRadius: 6, backgroundColor: colors.primary,
    justifyContent: "center", alignItems: "center",
  },
  charsSection: { marginBottom: 16 },
  charsLabel: { color: colors.textMuted, fontSize: 10, fontWeight: "700", letterSpacing: 2, marginBottom: 8 },
  chipsList: { gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 4,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surface,
  },
  chipText: { color: colors.text, fontSize: 12, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#0f0f1a',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 500,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    color: '#00ffff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
  },
  modalClose: {
    color: '#fff',
    fontSize: 18,
    padding: 4,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridImage: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
  },
});
