import { useCallback, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { colors, sharedStyles } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import { getCategories, getCharacters } from "@/services/api";

export default function CategoriaDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [category, setCategory] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [id])
  );

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, chars] = await Promise.all([getCategories(), getCharacters()]);
      const cat = cats.find((c: any) => String(c.id) === id);
      setCategory(cat || null);
      if (cat) {
        const filtered = chars.filter((ch: any) =>
          ch.categories?.name?.toLowerCase() === cat.name.toLowerCase()
        );
        setCharacters(filtered);
      } else {
        setCharacters([]);
      }
    } catch {
      setCategory(null);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[sharedStyles.scrollContent, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!category) {
    return (
      <View style={[sharedStyles.scrollContent, styles.center]}>
        <Stack.Screen options={{ title: "CATEGORÍA", headerShown: true, headerStyle: { backgroundColor: colors.bgDark }, headerTintColor: colors.text }} />
        <Ionicons name="alert-circle-outline" size={48} color={colors.textMuted} />
        <Text style={styles.errorText}>Categoría no encontrada</Text>
        <Pressable style={[styles.backBtn, { borderColor: colors.primary + "40" }]} onPress={() => router.back()}>
          <Text style={[styles.backBtnText, { color: colors.primary }]}>VOLVER</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={sharedStyles.scrollContent}>
      <Stack.Screen options={{
        title: "CATEGORÍA",
        headerShown: true,
        headerStyle: { backgroundColor: colors.bgDark },
        headerTintColor: colors.text,
        headerLeft: () => (
          <Pressable onPress={() => router.back()} style={{ marginLeft: 4, padding: 4 }}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </Pressable>
        ),
      }} />

      <View style={[styles.hero, { borderBottomColor: colors.primary + "15" }]}>
        <Text style={styles.heroEmoji}>{category.emoji || "📁"}</Text>
        <Text style={styles.heroTitle}>{category.name}</Text>
        {category.description ? (
          <Text style={styles.heroDesc}>{category.description}</Text>
        ) : null}
      </View>

      <View style={styles.container}>
        <Text style={styles.sectionTitle}>PERSONAJES ({characters.length})</Text>

        {characters.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>SIN PERSONAJES</Text>
          </View>
        ) : (
          characters.map((ch) => (
            <View key={ch.id} style={[sharedStyles.card, { borderLeftWidth: 3, borderLeftColor: colors.secondary }]}>
              <View style={styles.chRow}>
                {ch.images && ch.images.length > 0 ? (
                  <Image source={{ uri: ch.images[0] }} style={styles.chImage} />
                ) : (
                  <View style={[styles.chImagePlaceholder, { backgroundColor: colors.surface }]}>
                    <Ionicons name="image-outline" size={24} color={colors.textMuted} />
                  </View>
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.chName}>{ch.name}</Text>
                </View>
              </View>
              <View style={styles.chBody}>
                <Text style={styles.chLabel}>DESCRIPCIÓN</Text>
                <Text style={styles.chValue}>{ch.description || "—"}</Text>
                <Text style={styles.chLabel}>HABILIDADES</Text>
                <Text style={styles.chValue}>{ch.abilities || "—"}</Text>
                {ch.images && ch.images.length > 1 && (
                  <View style={styles.moreImages}>
                    <Ionicons name="images" size={14} color={colors.textMuted} />
                    <Text style={styles.moreImagesText}>+{ch.images.length - 1} imagen(es) más</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.bg, gap: 12 },
  errorText: { color: colors.textMuted, fontSize: 14 },
  backBtn: { borderRadius: 6, paddingVertical: 12, paddingHorizontal: 24, borderWidth: 1.5, marginTop: 8 },
  backBtnText: { fontSize: 12, fontWeight: "700", letterSpacing: 2 },
  hero: {
    backgroundColor: colors.bgDarker, paddingTop: 50, paddingBottom: 30, paddingHorizontal: 24,
    alignItems: "center", borderBottomWidth: 2,
  },
  heroEmoji: { fontSize: 48, marginBottom: 12 },
  heroTitle: { color: colors.text, fontSize: 24, fontWeight: "700", letterSpacing: 2, textAlign: "center" },
  heroDesc: { color: colors.textLight, fontSize: 14, marginTop: 8, textAlign: "center", lineHeight: 20 },
  container: { flex: 1, backgroundColor: colors.bg, paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },
  sectionTitle: { color: colors.text, fontSize: 12, fontWeight: "700", letterSpacing: 3, marginBottom: 14 },
  empty: { alignItems: "center", marginTop: 40, gap: 10 },
  emptyText: { color: colors.text, fontSize: 14, fontWeight: "700", letterSpacing: 3 },
  chRow: { flexDirection: "row", alignItems: "center", padding: 14, paddingBottom: 0, gap: 12 },
  chImage: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.bgDark },
  chImagePlaceholder: { width: 64, height: 64, borderRadius: 8, justifyContent: "center", alignItems: "center", borderWidth: 1.5, borderColor: colors.border },
  chName: { color: colors.text, fontSize: 16, fontWeight: "700", letterSpacing: 1 },
  chBody: { padding: 14, gap: 4 },
  chLabel: { color: colors.secondary, fontSize: 9, fontWeight: "700", letterSpacing: 2, marginTop: 6 },
  chValue: { color: colors.textLight, fontSize: 13, lineHeight: 20 },
  moreImages: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 8 },
  moreImagesText: { color: colors.textMuted, fontSize: 11, fontWeight: "600" },
});
